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

tasks = [
    {"id": 1, "task": "Learn FastAPI"},
    {"id": 2, "task": "Learn Docker"}
]

class Task(BaseModel):
    task: str

@app.get("/")
def home():
    return {"message": "Task Tracker API"}

@app.get("/tasks")
def get_tasks():
    return tasks

next_id = 3

@app.post("/tasks")
def create_task(task: Task):
    global next_id

    new_task = {
        "id": next_id,
        "task": task.task
    }

    tasks.append(new_task)
    next_id += 1

    return new_task

# get the task by id 
@app.get("/tasks/{task_id}")
def get_task(task_id: int):

    for task in tasks:
        if task["id"] == task_id:
            return task

    return {"message": "Task not found"}


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):

    for task in tasks:
        if task["id"] == task_id:
            tasks.remove(task)
            return {"message": "Task deleted"}

    return {"message": "Task not found"}


# to updated the tasks

@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: Task):

    for task in tasks:
        if task["id"] == task_id:
            task["task"] = updated_task.task

            return {
                "message": "Task updated",
                "task": task
            }

    return {"message": "Task not found"}


@app.get("/dbtasks")
def get_db_tasks(db: Session = Depends(get_db)):

    tasks = db.query(TaskDB).all()

    return tasks