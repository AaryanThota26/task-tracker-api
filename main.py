from fastapi import FastAPI
from pydantic import BaseModel
from database import SessionLocal
from models import TaskDB

from sqlalchemy.orm import Session
from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()


class Task(BaseModel):
    task: str

@app.get("/")
def home():
    return {"message": "Task Tracker API"}

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):

    tasks = db.query(TaskDB).all()

    return tasks

@app.post("/tasks")
def create_task(task: Task, db: Session = Depends(get_db)):

    new_task = TaskDB(task=task.task)

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

# get the task by id 
@app.get("/tasks/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if task:
        return task

    return {"message": "Task not found"}


#  To delete a task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if not task:
        return {"message": "Task not found"}

    db.delete(task)
    db.commit()

    return {"message": "Task deleted"}


# to updated the tasks

@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    updated_task: Task,
    db: Session = Depends(get_db)
):

    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if not task:
        return {"message": "Task not found"}

    task.task = updated_task.task

    db.commit()
    db.refresh(task)

    return {
        "message": "Task updated",
        "task": task
    }
