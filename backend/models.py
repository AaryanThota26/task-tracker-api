from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base
import enum

class TaskStatus(str, enum.Enum):
    pending = "pending"
    doing = "doing"
    done = "done"
    missed = "missed"

class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TaskDB(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    task = Column(String, nullable=False)
    description = Column(String, nullable=True)
    user_email = Column(String, index=True, nullable=False)
    status = Column(String, default=TaskStatus.pending.value, nullable=False)
    priority = Column(String, default=TaskPriority.medium.value, nullable=False)
    due_date = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )