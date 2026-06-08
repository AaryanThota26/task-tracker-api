# Task Tracker API

## Overview

Task Tracker API is a backend application built with FastAPI that allows users to create, read, update, and delete tasks.

The application uses PostgreSQL for persistent storage, Redis for caching, Docker for containerization, and Docker Compose for orchestration.

---

## Tech Stack

* FastAPI
* PostgreSQL
* SQLAlchemy
* Redis
* Docker
* Docker Compose
* Python 3.11

---

## Features

* Create Tasks
* Get All Tasks
* Get Task By ID
* Update Tasks
* Delete Tasks
* Redis Caching
* Dockerized Deployment

---

## Project Structure

```text
task-tracker/
├── main.py
├── database.py
├── models.py
├── schemas.py
├── redis_config.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

## API Endpoints

### Get All Tasks

```http
GET /tasks
```

### Get Task By ID

```http
GET /tasks/{task_id}
```

### Create Task

```http
POST /tasks
```

### Update Task

```http
PUT /tasks/{task_id}
```

### Delete Task

```http
DELETE /tasks/{task_id}
```

## Run Locally

```bash
docker compose up -d
```

Access Swagger UI:

```text
http://localhost:8000/docs
```

## Stop Services

```bash
docker compose down
```
