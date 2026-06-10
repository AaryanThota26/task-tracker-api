from fastapi import FastAPI
from schemas import TaskCreate
from database import SessionLocal, Base, engine
from models import TaskDB

from sqlalchemy.orm import Session
from fastapi import Depends

from fastapi.middleware.cors import CORSMiddleware


from redis_config import redis_client
import json

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Task Tracker API"}

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):

    cached_tasks = redis_client.get("all_tasks")

    if cached_tasks:
        return json.loads(cached_tasks)

    tasks = db.query(TaskDB).all()

    tasks_data = [
        {
            "id": task.id,
            "task": task.task
        }
        for task in tasks
    ]

    redis_client.setex(
        "all_tasks",
        300,
        json.dumps(tasks_data)
    )

    return tasks_data

@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):

    new_task = TaskDB(task=task.task)

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    redis_client.delete("all_tasks")

    return new_task

# get the task by id 
@app.get("/tasks/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):

    cached_task = redis_client.get(f"task_{task_id}")

    if cached_task:
        return json.loads(cached_task)

    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if not task:
        return {"message": "Task not found"}

    task_data = {
        "id": task.id,
        "task": task.task
    }

    redis_client.setex(
        f"task_{task_id}",
        300,
        json.dumps(task_data)
    )

    return task_data


#  To delete a task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if not task:
        return {"message": "Task not found"}

    db.delete(task)
    db.commit()

    redis_client.delete("all_tasks")
    redis_client.delete(f"task_{task_id}")

    return {"message": "Task deleted"}


# to updated the tasks

@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    updated_task: TaskCreate,
    db: Session = Depends(get_db)
):

    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if not task:
        return {"message": "Task not found"}

    task.task = updated_task.task

    db.commit()
    db.refresh(task)

    redis_client.delete("all_tasks")
    redis_client.delete(f"task_{task_id}")

    return {
        "message": "Task updated",
        "task": task
    }
