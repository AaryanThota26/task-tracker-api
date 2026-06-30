![Terraform](https://img.shields.io/badge/Terraform-IaC-blueviolet)

![Docker](https://img.shields.io/badge/Docker-Containerized-blue)

![Kubernetes](https://img.shields.io/badge/Kubernetes-GKE-326CE5)

![Helm](https://img.shields.io/badge/Helm-Deployed-0F1689)

![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub%20Actions-2088FF)

![GCP](https://img.shields.io/badge/Cloud-Google%20Cloud-4285F4)

# 🚀 Task Tracker - Cloud Native Application on Google Cloud Platform (GCP)

## Overview

Task Tracker is a full-stack cloud-native task management application built using **FastAPI**, **React**, **PostgreSQL**, and **Redis**.

The project demonstrates an end-to-end cloud-native deployment workflow on **Google Cloud Platform (GCP)**, including:

* Containerization using Docker
* Infrastructure provisioning using Terraform
* Kubernetes orchestration using Google Kubernetes Engine (GKE)
* HTTPS-secured public access through Kubernetes Ingress
* Stateful workloads using PostgreSQL and Redis StatefulSets
* Artifact Registry image management
* Google OAuth authentication
* Production deployment with a custom domain

The application allows users to authenticate using Google OAuth and perform CRUD operations on tasks through a responsive web interface.

---

# 🌐 Live Application

## Frontend

[Frontend](https://taskmonitor.org)

## Swagger API Documentation

[Swagger API](https://taskmonitor.org/docs)

---

# ⭐ Key Achievements

* Built and deployed a full-stack cloud-native application on GCP
* Implemented Infrastructure as Code (IaC) using Terraform
* Containerized frontend and backend using Docker
* Deployed workloads on Google Kubernetes Engine (GKE)
* Packaged Kubernetes resources using Helm Charts
* Automated CI/CD using GitHub Actions
* Stored container images in Google Artifact Registry
* Configured HTTPS using GKE Managed SSL Certificates
* Implemented Google OAuth authentication
* Managed PostgreSQL and Redis using Kubernetes StatefulSets
* Configured Kubernetes Ingress with custom domain routing
* Implemented Redis caching with automatic cache invalidation
* Resolved production deployment, SSL, persistence, Helm migration, and timezone-related issues
* Designed separate GitHub Actions workflows for backend and frontend with path-based triggers

---

# 🏗️ Application Architecture

```text
User
  │
  ▼
https://taskmonitor.org
  │
  ▼
Google Cloud DNS
  │
  ▼
Google Cloud HTTP(S) Load Balancer
  │
  ▼
GKE Ingress (GCE Ingress Controller)
  │
  ├──────────────► Frontend Service
  │                    │
  │                    ▼
  │               React Pods
  │
  └──────────────► Backend Service
                       │
                       ▼
                  FastAPI Pods
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
 PostgreSQL StatefulSet      Redis StatefulSet
          │                         │
          ▼                         ▼
 Persistent Volume           Persistent Volume
```


# ⚙️ Deployment Pipeline Architecture

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├──────────── Build Docker Images
    │
    ├──────────── Push Images
    │               │
    │               ▼
    │        Artifact Registry
    │
    ├──────────── Helm Upgrade
    │
    ▼
Google Kubernetes Engine
    │
    ├────────► Frontend Pods
    │
    ├────────► Backend Pods
    │
    ├────────► PostgreSQL StatefulSet
    │
    ├────────► Redis StatefulSet
    │
    ▼
Ingress
    │
    ▼
https://taskmonitor.org
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Axios
* Google OAuth

## Backend

* Python
* FastAPI
* SQLAlchemy ORM
* PostgreSQL
* Redis

## DevOps & Cloud

* Docker
* Docker Compose
* Terraform
* Kubernetes
* Helm
* GitHub Actions
* Google Kubernetes Engine (GKE)
* Google Cloud Platform (GCP)
* Artifact Registry
* Managed SSL Certificates
* Kubernetes Ingress
* Persistent Volumes
* StatefulSets


---

# ✨ Features

## Authentication

* Google OAuth Login
* User-specific task management

## Task Management

* Create Tasks
* View Tasks
* Update Tasks
* Delete Tasks
* Search Tasks
* Due Date Tracking

## Database

* PostgreSQL persistent storage
* SQLAlchemy ORM integration

## Caching

* Redis caching layer
* Faster task retrieval
* Automatic cache invalidation

## Cloud Features

* Dockerized application
* Kubernetes deployments
* Stateful PostgreSQL and Redis
* Kubernetes services
* Kubernetes ingress routing
* HTTPS secured endpoint
* Custom domain integration
* Managed SSL certificates
* Infrastructure as Code using Terraform

---

# 📁 Project Structure

```text
task-tracker-api/
│
│
├── .github/
│  └── workflows/
│      ├── backend.yml
│      └── frontend.yml
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── redis_config.py
│   ├── requirements.txt
│   └── tests/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-service.yaml
│   ├── ingress.yaml
│   ├── managed-cert.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   │
│   └── stateful/
│       ├── postgres-statefulset.yaml
│       ├── postgres-headless-service.yaml
│       ├── redis-statefulset.yaml
│       └── redis-headless-service.yaml
│
├── terraform/
│   ├── main.tf
│   ├── provider.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── helm/
│   └── task-tracker/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── charts/
│       └── templates/
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# 🔐 Environment Variables

Example `.env.example`

```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=taskdb
DB_USER=postgres
DB_PASSWORD=your_password

REDIS_HOST=redis
REDIS_PORT=6379

GOOGLE_CLIENT_ID=your_google_client_id

VITE_API_URL=https://taskmonitor.org/api
```

---

# 📡 API Endpoints

## Get All Tasks

```http
GET /api/tasks
```

## Get Task By ID

```http
GET /api/tasks/{task_id}
```

## Create Task

```http
POST /api/tasks
```

## Update Task

```http
PUT /api/tasks/{task_id}
```

## Delete Task

```http
DELETE /api/tasks/{task_id}
```

---

# 💻 Run Locally

## Clone Repository

```bash
git clone https://github.com/AaryanThota26/task-tracker-api.git
cd task-tracker-api
```

## Create Environment File

```bash
cp .env.example .env
```

## Start Containers

```bash
docker compose up -d
```

## Frontend

```text
http://localhost:5173
```

## Backend

```text
http://localhost:8000
```

## Swagger Documentation

```text
http://localhost:8000/docs
```

---

# 🐳 Docker

## Build Backend

```bash
docker build -t task-api ./backend
```

## Build Frontend

```bash
docker build -t task-frontend ./frontend
```

## Start Application

```bash
docker compose up -d
```

---

# ☸️ Helm Deployment

## Install Helm Release

```bash
helm install task-tracker ./helm/task-tracker
```

## Upgrade Release

```bash
helm upgrade task-tracker ./helm/task-tracker
```

## List Releases

```bash
helm list
```

## View Release

```bash
helm status task-tracker
```

## Rollback

```bash
helm rollback task-tracker <revision>
```


---

# 6. Add a new section after Kubernetes Deployment

# 🔄 GitHub Actions CI/CD

```md
The project includes two independent GitHub Actions workflows.

### Backend Workflow

- Triggered only when backend files change
- Builds backend Docker image
- Pushes image to Artifact Registry
- Deploys using Helm
- Waits for Kubernetes rollout

### Frontend Workflow

- Triggered only when frontend files change
- Builds frontend Docker image
- Pushes image to Artifact Registry
- Deploys using Helm
- Waits for Kubernetes rollout

Both workflows use:

- Workload Identity Federation
- Google Artifact Registry
- Google Kubernetes Engine
- Helm
```


# ☸️ Kubernetes Deployment

## Deploy Resources

```bash
kubectl apply -f k8s/
kubectl apply -f k8s/stateful/
```

## Verify Deployments

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
kubectl get managedcertificate
```

---

# ☸️ Kubernetes Components

## Deployments

* Frontend Deployment
* Backend Deployment

## StatefulSets

* PostgreSQL StatefulSet
* Redis StatefulSet

## Services

* Frontend Service
* Backend Service
* PostgreSQL Headless Service
* Redis Headless Service

## Networking

* GCE Ingress Controller
* HTTPS Routing
* Managed SSL Certificate
* Custom Domain Mapping

---

# 🌍 Production Deployment

The application is deployed on **Google Kubernetes Engine (GKE Autopilot)** using:

* GKE Autopilot Cluster
* Helm Releases
* Kubernetes StatefulSets
* Kubernetes Services
* Kubernetes Ingress
* GitHub Actions
* Google Cloud Load Balancer
* Artifact Registry
* Managed SSL Certificates
* Custom Domain

Production URL:

https://taskmonitor.org

---

# 🏗️ Terraform Deployment

## Initialize Terraform

```bash
terraform init
```

## Review Infrastructure Plan

```bash
terraform plan
```

## Apply Infrastructure

```bash
terraform apply
```

## Verify State

```bash
terraform state list
```


---
# 📦 Artifact Registry
```
Docker images are automatically pushed to **Google Artifact Registry**.

Repositories:

- Backend → `task-api`
- Frontend → `task-frontend`

These images are deployed to Google Kubernetes Engine using Helm through GitHub Actions.
```

---

---

# 📦 Infrastructure as Code (IaC)

Terraform is used to provision and manage cloud infrastructure.

Benefits:

* Reproducible deployments
* Version-controlled infrastructure
* Automated provisioning
* Reduced manual configuration
* Consistent environments
* Infrastructure lifecycle management

---

# 📈 Scalability

The application is deployed on Google Kubernetes Engine with multiple replicas.

Current deployment:

* Frontend: 2 Replicas
* Backend: 2 Replicas
* PostgreSQL: 1 Stateful Replica
* Redis: 1 Stateful Replica

Kubernetes allows horizontal scaling as traffic increases.

---

# 🔒 Security

* HTTPS enabled using GKE Managed Certificates
* TLS encryption for all external traffic
* Kubernetes Secrets for sensitive configuration
* Environment variable management
* Google OAuth authentication
* Separation of application and infrastructure configuration

---

# 🧪 Testing

Backend includes automated tests for:

* Task creation
* Task retrieval
* Task updates
* Task deletion
* Search functionality
* Redis cache invalidation

Run tests:

```bash
pytest
```

---

# 🚧 Engineering Challenges Solved

During development and deployment, the following production issues were identified and resolved:

* HTTPS certificate provisioning using GKE Managed Certificates
* Kubernetes Ingress routing configuration
* PostgreSQL persistence using StatefulSets and PVCs
* Redis service discovery inside Kubernetes
* Docker Compose frontend/backend networking
* Timezone handling across React, FastAPI, and PostgreSQL
* Backend image rollout through Artifact Registry and GKE
* Health probes and service availability improvements

---

# 🔮 Future Improvements


* Cloud SQL integration
* Google Memorystore integration
* Horizontal Pod Autoscaler (HPA)
* Prometheus and Grafana monitoring
* Centralized logging with Google Cloud Logging
* Alembic database migrations

---

# 👨‍💻 Author

**Aaryan Thota**

Cloud Native Application Deployment on Google Cloud Platform using FastAPI, React, Kubernetes, Terraform, PostgreSQL, Redis, Docker, and Google Cloud Services.

---

# 📄 License

This project is for educational and portfolio purposes.
