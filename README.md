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

https://taskmonitor.org

## Swagger API Documentation

https://taskmonitor.org/docs

---

# ⭐ Key Achievements

* Built and deployed a full-stack cloud-native application on GCP
* Implemented Infrastructure as Code (IaC) using Terraform
* Containerized frontend and backend using Docker
* Deployed workloads on Google Kubernetes Engine (GKE)
* Configured HTTPS using GKE Managed SSL Certificates
* Implemented Google OAuth authentication
* Managed PostgreSQL and Redis using Kubernetes StatefulSets
* Configured Kubernetes Ingress with custom domain routing
* Implemented Redis caching with automatic cache invalidation
* Resolved production deployment, SSL, persistence, and timezone-related issues

---

# 🏗️ Architecture

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
* Kubernetes
* Google Kubernetes Engine (GKE)
* Terraform
* Google Cloud Platform (GCP)
* Artifact Registry
* Managed SSL Certificates
* Kubernetes Ingress
* StatefulSets
* Persistent Volumes

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
│
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
git clone https://github.com/<your-username>/task-tracker-api.git
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
* Kubernetes Deployments
* Kubernetes StatefulSets
* Kubernetes Services
* Kubernetes Ingress
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

* GitHub Actions CI/CD Pipeline
* Automated Kubernetes deployments
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
