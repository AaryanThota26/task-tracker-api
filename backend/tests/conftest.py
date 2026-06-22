"""Pytest fixtures and test setup."""
import os
import sys
import fnmatch
import json

# ---------------------------------------------------------------------------
# 1. Set env vars BEFORE any code that reads them
# ---------------------------------------------------------------------------
os.environ["DB_HOST"] = "localhost"
os.environ["DB_PORT"] = "5432"
os.environ["DB_NAME"] = "testdb"
os.environ["DB_USER"] = "test"
os.environ["DB_PASSWORD"] = "test"
os.environ["REDIS_HOST"] = "localhost"
os.environ["REDIS_PORT"] = "6379"

# ---------------------------------------------------------------------------
# 2. Import database module so it creates Base, engine, SessionLocal
# ---------------------------------------------------------------------------
import database as _db_module  # noqa: E402

# ---------------------------------------------------------------------------
# 3. Monkeypatch database to use an in-memory SQLite engine
# ---------------------------------------------------------------------------
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

_test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
_test_session_local = sessionmaker(
    autocommit=False, autoflush=False, bind=_test_engine
)

_db_module.engine = _test_engine
_db_module.SessionLocal = _test_session_local
# Base stays the SAME object so model registrations are visible everywhere

# ---------------------------------------------------------------------------
# 4. NOW import main (first time) — it captures the monkeypatched engine
# ---------------------------------------------------------------------------
import main  # noqa: E402

# Create tables on the SQLite test engine
main.Base.metadata.create_all(bind=_test_engine)

# ---------------------------------------------------------------------------
# 5. Mock Redis with an in-memory dict so caching logic actually works
# ---------------------------------------------------------------------------
import redis_config  # noqa: E402


class FakeRedis:
    def __init__(self):
        self._store = {}

    def get(self, key):
        return self._store.get(key)

    def setex(self, key, ttl, value):
        self._store[key] = value

    def delete(self, key):
        self._store.pop(key, None)

    def scan_iter(self, match):
        for k in list(self._store.keys()):
            if fnmatch.fnmatch(k, match):
                yield k


redis_config.redis_client = FakeRedis()

# ---------------------------------------------------------------------------
# 6. Provide FastAPI TestClient via pytest fixture
# ---------------------------------------------------------------------------
import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    return TestClient(main.app)


@pytest.fixture
def db_session():
    """Yield a fresh DB session; rollback on teardown."""
    session = _test_session_local()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(autouse=True)
def clean_redis():
    """Clear fake Redis before every test."""
    redis_config.redis_client._store.clear()


@pytest.fixture(autouse=True)
def clean_db():
    """Delete all rows from tasks table before every test."""
    from models import TaskDB
    session = _test_session_local()
    session.query(TaskDB).delete()
    session.commit()
    session.close()
