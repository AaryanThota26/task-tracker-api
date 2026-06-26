"""Unit tests for Task Tracker API endpoints."""
import json


def test_home(client):
    """GET / should return a welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Task Tracker API"}


# ---------------------------------------------------------------------------
# CREATE
# ---------------------------------------------------------------------------

def test_create_task(client):
    """POST /api/tasks should create a new task."""
    payload = {
        "task": "Write unit tests",
        "description": "Test the FastAPI backend",
        "user_email": "test@example.com",
        "status": "pending",
        "priority": "high",
        "due_date": "2025-12-01T10:00:00",
    }
    response = client.post("/api/tasks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["task"] == "Write unit tests"
    assert data["description"] == "Test the FastAPI backend"
    assert data["user_email"] == "test@example.com"
    assert data["status"] == "pending"
    assert data["priority"] == "high"
    assert data["due_date"] is not None


def test_create_task_minimal(client):
    """POST /api/tasks with minimal fields should use defaults."""
    payload = {
        "task": "Minimal task",
        "user_email": "user@example.com",
    }
    response = client.post("/api/tasks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["task"] == "Minimal task"
    assert data["status"] == "pending"
    assert data["priority"] == "medium"
    assert data["description"] is None
    assert data["due_date"] is None


# ---------------------------------------------------------------------------
# READ (list)
# ---------------------------------------------------------------------------

def test_get_tasks_empty(client):
    """GET /api/tasks should return an empty list."""
    response = client.get("/api/tasks?user_email=test@example.com")
    assert response.status_code == 200
    assert response.json() == []


def test_get_tasks_populated(client):
    """GET /api/tasks should return tasks for a user."""
    # Create two tasks
    client.post("/api/tasks", json={
        "task": "Task A",
        "user_email": "alice@example.com",
    })
    client.post("/api/tasks", json={
        "task": "Task B",
        "user_email": "alice@example.com",
    })
    client.post("/api/tasks", json={
        "task": "Task C",
        "user_email": "bob@example.com",
    })

    response = client.get("/api/tasks?user_email=alice@example.com")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {t["task"] for t in data} == {"Task A", "Task B"}


def test_get_tasks_status_filter(client):
    """GET /api/tasks with status filter should work."""
    client.post("/api/tasks", json={
        "task": "Pending Task",
        "user_email": "u@example.com",
        "status": "pending",
    })
    client.post("/api/tasks", json={
        "task": "Done Task",
        "user_email": "u@example.com",
        "status": "done",
    })

    response = client.get("/api/tasks?user_email=u@example.com&status=done")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["task"] == "Done Task"


def test_get_tasks_priority_filter(client):
    """GET /api/tasks with priority filter should work."""
    client.post("/api/tasks", json={
        "task": "Low priority",
        "user_email": "u@example.com",
        "priority": "low",
    })
    client.post("/api/tasks", json={
        "task": "High priority",
        "user_email": "u@example.com",
        "priority": "high",
    })

    response = client.get("/api/tasks?user_email=u@example.com&priority=high")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["task"] == "High priority"


def test_get_tasks_search_filter(client):
    """GET /api/tasks with search filter should match titles/descriptions."""
    client.post("/api/tasks", json={
        "task": "Buy groceries",
        "description": "Milk and eggs",
        "user_email": "u@example.com",
    })
    client.post("/api/tasks", json={
        "task": "Write report",
        "description": "Q4 analysis",
        "user_email": "u@example.com",
    })

    response = client.get("/api/tasks?user_email=u@example.com&search=groceries")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["task"] == "Buy groceries"


# ---------------------------------------------------------------------------
# READ (single)
# ---------------------------------------------------------------------------

def test_get_task_by_id(client):
    """GET /api/tasks/{id} should return a single task."""
    create_resp = client.post("/api/tasks", json={
        "task": "Single fetch",
        "user_email": "u@example.com",
    })
    task_id = create_resp.json()["id"]

    response = client.get(f"/api/tasks/{task_id}?user_email=u@example.com")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["task"] == "Single fetch"


def test_get_task_not_found(client):
    """GET /api/tasks/{id} for missing task should return 404."""
    response = client.get("/api/tasks/999?user_email=u@example.com")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


# ---------------------------------------------------------------------------
# UPDATE
# ---------------------------------------------------------------------------

def test_update_task(client):
    """PUT /api/tasks/{id} should update allowed fields."""
    create_resp = client.post("/api/tasks", json={
        "task": "Original",
        "user_email": "u@example.com",
    })
    task_id = create_resp.json()["id"]

    response = client.put(f"/api/tasks/{task_id}", json={
        "task": "Updated",
        "description": "New desc",
        "status": "doing",
        "priority": "high",
        "user_email": "u@example.com",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Task updated"
    assert data["task"]["task"] == "Updated"
    assert data["task"]["description"] == "New desc"
    assert data["task"]["status"] == "doing"
    assert data["task"]["priority"] == "high"


def test_update_task_not_found(client):
    """PUT /api/tasks/{id} for missing task should return 404."""
    response = client.put("/api/tasks/999", json={
        "task": "Updated",
        "user_email": "u@example.com",
    })
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_update_task_due_date(client):
    """PUT /api/tasks/{id} should add a due_date to a task created without one."""
    create_resp = client.post("/api/tasks", json={
        "task": "No due date",
        "user_email": "u@example.com",
    })
    task_id = create_resp.json()["id"]

    response = client.put(f"/api/tasks/{task_id}", json={
        "due_date": "2025-12-01T10:00:00",
        "user_email": "u@example.com",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Task updated"
    assert data["task"]["due_date"] == "2025-12-01T10:00:00+00:00"


def test_update_task_partial(client):
    """PUT /api/tasks/{id} with only the title should preserve other fields."""
    create_resp = client.post("/api/tasks", json={
        "task": "Original title",
        "description": "Original description",
        "user_email": "u@example.com",
        "status": "doing",
        "priority": "high",
    })
    task_id = create_resp.json()["id"]

    response = client.put(f"/api/tasks/{task_id}", json={
        "task": "New title",
        "user_email": "u@example.com",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Task updated"
    assert data["task"]["task"] == "New title"
    assert data["task"]["description"] == "Original description"
    assert data["task"]["status"] == "doing"
    assert data["task"]["priority"] == "high"


def test_update_task_wrong_user(client):
    """PUT /api/tasks/{id} for a task owned by another user should return 404."""
    create_resp = client.post("/api/tasks", json={
        "task": "Alice task",
        "user_email": "alice@example.com",
    })
    task_id = create_resp.json()["id"]

    response = client.put(f"/api/tasks/{task_id}", json={
        "task": "Hacked title",
        "user_email": "bob@example.com",
    })
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


def test_update_task_invalid_due_date(client):
    """PUT /api/tasks/{id} with a malformed due_date should return a 422 validation error."""
    create_resp = client.post("/api/tasks", json={
        "task": "Due date test",
        "user_email": "u@example.com",
    })
    task_id = create_resp.json()["id"]

    response = client.put(f"/api/tasks/{task_id}", json={
        "due_date": "not-a-datetime",
        "user_email": "u@example.com",
    })
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# DELETE
# ---------------------------------------------------------------------------

def test_delete_task(client):
    """DELETE /api/tasks/{id} should remove a task."""
    create_resp = client.post("/api/tasks", json={
        "task": "To delete",
        "user_email": "u@example.com",
    })
    task_id = create_resp.json()["id"]

    response = client.delete(f"/api/tasks/{task_id}?user_email=u@example.com")
    assert response.status_code == 200
    assert response.json()["message"] == "Task deleted"

    # Verify it is gone
    get_resp = client.get(f"/api/tasks/{task_id}?user_email=u@example.com")
    assert get_resp.status_code == 404


def test_delete_task_not_found(client):
    """DELETE /api/tasks/{id} for missing task should return 404."""
    response = client.delete("/api/tasks/999?user_email=u@example.com")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"


# ---------------------------------------------------------------------------
# REDIS CACHE invalidation
# ---------------------------------------------------------------------------

def test_redis_cache_invalidation_on_create(client):
    """Creating a task should invalidate user task cache."""
    # Prime cache by fetching tasks
    client.get("/api/tasks?user_email=cached@example.com")

    # Create a new task
    client.post("/api/tasks", json={
        "task": "New cached task",
        "user_email": "cached@example.com",
    })

    # Cache should be invalidated; next fetch comes from DB
    from redis_config import redis_client
    cache_key = "tasks_cached@example.com_all_all_all"
    assert cache_key not in redis_client._store


def test_redis_cache_invalidation_on_update(client):
    """Updating a task should invalidate cached entries."""
    create_resp = client.post("/api/tasks", json={
        "task": "Cache me",
        "user_email": "cached@example.com",
    })
    task_id = create_resp.json()["id"]

    # Prime cache
    client.get("/api/tasks?user_email=cached@example.com")

    # Update
    client.put(f"/api/tasks/{task_id}", json={
        "task": "Updated cache me",
        "user_email": "cached@example.com",
    })

    from redis_config import redis_client
    cache_key = "tasks_cached@example.com_all_all_all"
    assert cache_key not in redis_client._store
