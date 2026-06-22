from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskStatus:
    pending = "pending"
    doing = "doing"
    done = "done"
    missed = "missed"

class TaskPriority:
    low = "low"
    medium = "medium"
    high = "high"

class TaskBase(BaseModel):
    task: str
    description: Optional[str] = None
    status: str = "pending"
    priority: str = "medium"
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    user_email: str

class TaskUpdate(BaseModel):
    task: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    user_email: str

class TaskResponse(BaseModel):
    id: int
    task: str
    description: Optional[str] = None
    user_email: str
    status: str
    priority: str
    due_date: Optional[datetime] = None

    class Config:
        from_attributes = True
