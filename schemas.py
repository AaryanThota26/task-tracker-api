from pydantic import BaseModel

class TaskCreate(BaseModel):
    task: str