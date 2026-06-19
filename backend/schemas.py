from pydantic import BaseModel

class TaskCreate(BaseModel):
    task: str
    user_email: str