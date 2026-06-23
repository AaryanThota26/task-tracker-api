# Task Tracker

[![Live Site](https://img.shields.io/badge/Live-taskmonitor.org-4285F4?style=flat-square&logo=google-chrome)](https://taskmonitor.org)
[![API Docs](https://img.shields.io/badge/API_Docs-Swagger-85EA2D?style=flat-square&logo=swagger)](https://taskmonitor.org/docs)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-GKE-326CE5?style=flat-square&logo=kubernetes)](https://cloud.google.com/kubernetes-engine)
[![Terraform](https://img.shields.io/badge/IaC-Terraform-7B42BC?style=flat-square&logo=terraform)](https://www.terraform.io)
[![Python](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)]()

A full-stack task management application with Google OAuth authentication, deployed on Google Kubernetes Engine (GKE) with PostgreSQL and Redis.

**Live**: [https://taskmonitor.org](https://taskmonitor.org)  
**API Docs**: [https://taskmonitor.org/docs](https://taskmonitor.org/docs)

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker](#docker)
- [API Reference](#api-reference)
- [Deployment](#deployment)
  - [Kubernetes](#kubernetes)
  - [Terraform](#terraform)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Engineering Highlights](#engineering-highlights)
- [Roadmap](#roadmap)

---

## Architecture

```
User
  |
  v
https://taskmonitor.org
  |
  v
Google Cloud DNS
  |
  v
Google Cloud HTTP(S) Load Balancer
  |
  v
GKE Ingress (GCE Ingress Controller)
  |
  +--> Frontend Service --> React Pods (x2)
  |
  +--> Backend Service --> FastAPI Pods (x2)
                            |
              +-------------+-------------+
              |                           |
      PostgreSQL StatefulSet        Redis StatefulSet
              |                           |
      Persistent Volume (10Gi)     Persistent Volume (5Gi)
```

The GCE Ingress Controller provides path-based routing:
- `/api`, `/docs`, `/openapi.json` route to the **backend** service
- All other paths (`/`) route to the **frontend** service

HTTP requests are automatically upgraded to HTTPS via GKE Managed Certificates.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic 2 |
| **Database** | PostgreSQL 17 |
| **Cache** | Redis 7 |
| **Auth** | Google OAuth (client-side JWT) |
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes, GKE Autopilot |
| **Infrastructure** | Terraform (GCP provider) |
| **Packaging** | Helm |
| **Registry** | Artifact Registry |
| **Networking** | GCE Ingress, Managed SSL Certificates |

---

## Features

- **Google OAuth** authentication with per-user task isolation
- **CRUD** operations on tasks with status (pending/doing/done/missed) and priority (low/medium/high)
- **Search** with case-insensitive matching on task name and description
- **Redis caching** with a cache-aside pattern and automatic invalidation on writes (TTL: 300s)
- **Pomodoro timer** with configurable focus/break presets
- **Responsive design** with dark theme, glass-morphism UI, and customizable accent colors
- **Due date tracking** with Today, Upcoming, and timeline views
- **Graceful degradation** — the application remains fully functional if Redis is unavailable

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 22+
- Docker & Docker Compose (for containerized setup)
- A Google OAuth client ID (for authentication)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/AaryanThota26/task-tracker-api.git
   cd task-tracker-api
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example backend/.env
   ```

   Edit `backend/.env` with your database credentials and Redis host.

3. **Run the backend**

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

4. **Run the frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - API: [http://localhost:8000](http://localhost:8000)
   - Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Docker

```bash
docker compose up -d
```

This starts four services: PostgreSQL, Redis, the FastAPI backend (port 8000), and the React frontend with Vite dev server (port 5173).

---

## API Reference

All endpoints are prefixed with `/api`. Authentication is managed client-side via Google OAuth; the `user_email` query parameter is used for user scoping.

### List Tasks

```http
GET /api/tasks?user_email=<email>&status=<status>&priority=<priority>&search=<query>
```

| Parameter | Type | Description |
|---|---|---|
| `user_email` | `string` | **Required**. Owner of the tasks |
| `status` | `string` | Filter by status: `pending`, `doing`, `done`, `missed` |
| `priority` | `string` | Filter by priority: `low`, `medium`, `high` |
| `search` | `string` | Case-insensitive search on task name and description |

**Response**: `200 OK` — Array of task objects.

```json
[
  {
    "id": 1,
    "task": "Buy groceries",
    "description": "Milk and eggs",
    "user_email": "user@example.com",
    "status": "pending",
    "priority": "medium",
    "due_date": "2025-12-01T10:00:00+00:00"
  }
]
```

### Create Task

```http
POST /api/tasks
Content-Type: application/json

{
  "task": "Write unit tests",
  "description": "Test the FastAPI backend",
  "user_email": "user@example.com",
  "status": "pending",
  "priority": "high",
  "due_date": "2025-12-01T10:00:00"
}
```

**Response**: `200 OK` — The created task object with auto-generated `id`.

### Get Task

```http
GET /api/tasks/{task_id}?user_email=<email>
```

**Response**: `200 OK` — Single task object.  
**Error**: `404 Not Found` — Task does not exist or does not belong to the user.

### Update Task

```http
PUT /api/tasks/{task_id}
Content-Type: application/json

{
  "task": "Updated task name",
  "description": "Updated description",
  "status": "doing",
  "priority": "high",
  "due_date": "2025-12-15T10:00:00",
  "user_email": "user@example.com"
}
```

All fields are optional. Only provided fields are updated.

**Response**: `200 OK` — `{ "message": "Task updated", "task": { ... } }`  
**Error**: `404 Not Found`

### Delete Task

```http
DELETE /api/tasks/{task_id}?user_email=<email>
```

**Response**: `200 OK` — `{ "message": "Task deleted" }`  
**Error**: `404 Not Found`

---

## Deployment

### Kubernetes

Apply the manifests to any Kubernetes cluster:

```bash
kubectl apply -f k8s/stateful/
kubectl apply -f k8s/
```

Verify the deployment:

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
kubectl get managedcertificate
```

The cluster is configured with:
- **2 replicas** each for frontend and backend Deployments
- **Readiness probes** (HTTP GET `/`, delay 5s, period 10s)
- **Liveness probes** (HTTP GET `/`, delay 10s, period 20s)
- **Secrets** for sensitive configuration via `secretKeyRef`

### Terraform

Provision the GKE Autopilot cluster:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

**Note**: The Terraform configuration provisions only the GKE cluster. Kubernetes resources are applied separately via `kubectl` or Helm.

---

## Testing

The backend includes 16 unit tests covering all CRUD operations, filtering, search, and Redis cache invalidation.

```bash
cd backend
pytest -v
```

The test suite uses:
- **SQLite in-memory** as a drop-in replacement for PostgreSQL
- **FakeRedis** — an in-memory dict implementing `get`, `setex`, `delete`, and `scan_iter`
- **Autouse fixtures** to clean both database and cache before each test

---

## Project Structure

```
task-tracker-api/
├── backend/
│   ├── main.py              # FastAPI application with route handlers
│   ├── database.py           # SQLAlchemy engine and session configuration
│   ├── models.py             # ORM models (TaskDB)
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── redis_config.py       # Redis client initialization
│   ├── requirements.txt
│   ├── .env
│   └── tests/
│       ├── conftest.py       # Fixtures and test infrastructure
│       └── test_api.py       # 16 unit tests
├── frontend/
│   ├── src/
│   │   ├── pages/            # Login, Dashboard, Today, Upcoming, Accounts
│   │   ├── components/       # Layout, Sidebar, TopBar, NewTaskModal
│   │   ├── context/          # SearchContext, NotificationContext
│   │   └── services/         # Axios client with error interceptor
│   ├── Dockerfile
│   └── package.json
├── k8s/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-service.yaml
│   ├── ingress.yaml
│   ├── managed-cert.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   └── stateful/
│       ├── postgres-statefulset.yaml
│       ├── postgres-headless-service.yaml
│       ├── redis-statefulset.yaml
│       └── redis-headless-service.yaml
├── terraform/
│   ├── main.tf
│   ├── provider.tf
│   ├── variables.tf
│   └── outputs.tf
├── helm/
│   └── task-tracker/
├── docker-compose.yml
└── .env.example
```

---

## Engineering Highlights

### Redis Cache-Aside Pattern

The backend implements the standard cache-aside pattern with graceful degradation:

1. Check Redis for the cached result
2. On **hit**: return immediately
3. On **miss**: query PostgreSQL, populate Redis with a 300-second TTL, return
4. On **write** (create/update/delete): invalidate all list caches matching `tasks_{email}_*` and the single-task cache

Every Redis operation is wrapped in `try/except` — if Redis is unreachable, the application continues to work against PostgreSQL directly.

### Stateful Workloads

PostgreSQL and Redis run as StatefulSets with:
- **PersistentVolumeClaims** (10Gi for PostgreSQL, 5Gi for Redis)
- **Headless services** (`clusterIP: None`) for stable pod DNS
- **Ordered pod startup** guaranteed by the StatefulSet controller

### Testing Strategy

- SQLite `:memory:` engine replaces PostgreSQL via monkeypatching
- `FakeRedis` class replaces the Redis client with an in-memory `dict`
- Autouse fixtures reset all state before every test
- 16 tests validate CRUD operations, filtering, search, and cache invalidation

### Security & Production Readiness

- HTTPS enforced via GKE Managed Certificates
- CORS restricted to known origins (`localhost:5173`, `taskmonitor.org`, `www.taskmonitor.org`)
- Health probes configured for both frontend and backend
- Environment configuration separated from application code

---

## Roadmap

- [ ] GitHub Actions CI/CD pipeline with automated deployments
- [ ] Cloud SQL (managed PostgreSQL) integration
- [ ] Google Memorystore (managed Redis) integration
- [ ] Horizontal Pod Autoscaler (HPA) for demand-based scaling
- [ ] Prometheus + Grafana monitoring and alerting
- [ ] Centralized logging with Google Cloud Logging / Cloud Operations
- [ ] Alembic database migrations for safe schema evolution
- [ ] Server-side Google OAuth token verification
- [ ] Notification system with WebSocket support

---

## Author

**Aaryan Thota**

---

## License

This project is provided for educational and portfolio purposes.
