# Task Tracker API

## Overview

Task Tracker API is a cloud-native application built with FastAPI that allows users to create, read, update, and delete tasks.

The application uses PostgreSQL for persistent storage, Redis for caching, Docker for containerization, Docker Compose for local development, and Kubernetes (GKE) for cloud deployment on Google Cloud Platform.

---

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis

### Frontend
- React
- Vite
- Axios
- Google OAuth

### DevOps & Cloud
- Docker
- Docker Compose
- Kubernetes (GKE)
- Artifact Registry
- Google Cloud Platform (GCP)

---

## Features

### Backend
- Create Tasks
- Get All Tasks
- Get Task By ID
- Update Tasks
- Delete Tasks
- PostgreSQL Integration
- Redis Caching

### Frontend
- User Login Screen
- Task Dashboard
- API Integration using Axios
- Responsive UI

### Cloud Features
- Dockerized Services
- Kubernetes Deployment
- ConfigMaps and Secrets
- Public LoadBalancer Access

---

## Project Structure

task-tracker/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   ├── Dockerfile
│   └── package.json
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   ├── redis-deployment.yaml
│   ├── redis-service.yaml
│   ├── configmap.yaml
│   └── secret.yaml
│
├── main.py
├── database.py
├── models.py
├── schemas.py
├── redis_config.py
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md

---

## Environment Variables

Example `.env.example`

```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=taskdb
DB_USER=postgres
DB_PASSWORD=your_password

REDIS_HOST=redis
REDIS_PORT=6379
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

---

## Run Locally

### 1. Clone Repository

```bash
git clone <repository-url>
cd task-tracker
```

### 2. Create Environment File

```bash
cp .env.example .env
```

### 3. Start Containers

```bash
docker compose up -d
```

### 4. Access Swagger Documentation

```text
http://localhost:8000/docs
```

---

## Stop Services

```bash
docker compose down
```

---

## GCP Deployment

Application deployed on Google Kubernetes Engine (GKE).

### Components

* FastAPI Backend
* PostgreSQL
* Redis
* Kubernetes Deployments
* Kubernetes Services
* ConfigMaps
* Secrets
* Artifact Registry

---

## Public Endpoints

### Backend Swagger

http://34.173.172.212:8000/docs

### Frontend

http://34.46.70.183

---

## Screenshots Included

* GKE Cluster Running
* Artifact Registry Images
* FastAPI Swagger UI
* Successful POST /tasks
* Successful GET /tasks

---

## Author

Aaryan Thota
