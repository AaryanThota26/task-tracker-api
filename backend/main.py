from fastapi import FastAPI, Depends, Query, HTTPException
from schemas import TaskCreate, TaskUpdate, TaskResponse
from database import SessionLocal, Base, engine
from models import TaskDB
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from redis_config import redis_client
import json
import logging
from typing import Optional
from datetime import datetime, timezone
from contextlib import asynccontextmanager

logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Wait for DB to be reachable before creating tables
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://taskmonitor.org","https://www.taskmonitor.org"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/api")

@app.get("/")
def home():
    return {"message": "Task Tracker API"}

def task_to_dict(task):
    return {
        "id": task.id,
        "task": task.task,
        "description": task.description,
        "user_email": task.user_email,
        "status": task.status,
        "priority": task.priority,
        "due_date": task.due_date.replace(tzinfo=timezone.utc).isoformat() if task.due_date else None,
    }

@router.get("/tasks")
def get_tasks(
    user_email: str,
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    cache_key = f"tasks_{user_email}_{status or 'all'}_{priority or 'all'}_{search or 'all'}"
    try:
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        logger.warning("Redis get failed for key %s: %s", cache_key, e)

    query = db.query(TaskDB).filter(TaskDB.user_email == user_email)

    if status:
        query = query.filter(TaskDB.status == status)
    if priority:
        query = query.filter(TaskDB.priority == priority)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (TaskDB.task.ilike(like)) | (TaskDB.description.ilike(like))
        )

    tasks = query.order_by(TaskDB.due_date.asc()).all()
    tasks_data = [task_to_dict(t) for t in tasks]

    try:
        redis_client.setex(cache_key, 300, json.dumps(tasks_data))
    except Exception as e:
        logger.warning("Redis setex failed for key %s: %s", cache_key, e)
    return tasks_data

@router.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = TaskDB(
        task=task.task,
        description=task.description,
        user_email=task.user_email,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    try:
        for key in redis_client.scan_iter(match=f"tasks_{task.user_email}_*"):
            redis_client.delete(key)
    except Exception as e:
        logger.warning("Redis invalidation failed on create: %s", e)
    return task_to_dict(new_task)

@router.get("/tasks/{task_id}")
def get_task(
    task_id: int,
    user_email: str,
    db: Session = Depends(get_db)
):
    cache_key = f"task_{task_id}_{user_email}"
    try:
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        logger.warning("Redis get failed for key %s: %s", cache_key, e)

    task = db.query(TaskDB).filter(
        TaskDB.id == task_id,
        TaskDB.user_email == user_email
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    data = task_to_dict(task)
    try:
        redis_client.setex(cache_key, 300, json.dumps(data))
    except Exception as e:
        logger.warning("Redis setex failed for key %s: %s", cache_key, e)
    return data

@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    user_email: str,
    db: Session = Depends(get_db)
):
    task = db.query(TaskDB).filter(
        TaskDB.id == task_id,
        TaskDB.user_email == user_email
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    try:
        redis_client.delete(f"task_{task_id}_{user_email}")
        for key in redis_client.scan_iter(match=f"tasks_{user_email}_*"):
            redis_client.delete(key)
    except Exception as e:
        logger.warning("Redis invalidation failed on delete: %s", e)
    return {"message": "Task deleted"}

@router.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    updated_task: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(TaskDB).filter(
        TaskDB.id == task_id,
        TaskDB.user_email == updated_task.user_email
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if updated_task.task is not None:
        task.task = updated_task.task
    if updated_task.description is not None:
        task.description = updated_task.description
    if updated_task.status is not None:
        task.status = updated_task.status
    if updated_task.priority is not None:
        task.priority = updated_task.priority
    if updated_task.due_date is not None:
        task.due_date = updated_task.due_date

    db.commit()
    db.refresh(task)

    try:
        for key in redis_client.scan_iter(match=f"tasks_{updated_task.user_email}_*"):
            redis_client.delete(key)
        redis_client.delete(f"task_{task_id}_{updated_task.user_email}")
    except Exception as e:
        logger.warning("Redis invalidation failed on update: %s", e)

    return {
        "message": "Task updated",
        "task": task_to_dict(task)
    }

app.include_router(router)


# Test GitHub Actions