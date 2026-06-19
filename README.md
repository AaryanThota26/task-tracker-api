# Task Tracker - Cloud Native Application on GCP

## Overview

Task Tracker is a cloud-native task management application built using FastAPI, React, PostgreSQL, and Redis.

The project demonstrates a complete end-to-end deployment workflow on Google Cloud Platform (GCP), including containerization with Docker, infrastructure provisioning using Terraform, orchestration using Google Kubernetes Engine (GKE), HTTPS-secured public access through Kubernetes Ingress, and persistent data storage using PostgreSQL.

The application allows users to authenticate using Google OAuth and perform CRUD operations on tasks through a responsive web interface.

---

# Live Application

### Frontend

https://taskmonitor.org

### Backend API

https://taskmonitor.org/docs

---

# Architecture

```text
User
  │
  ▼
HTTPS (taskmonitor.org)
  │
  ▼
GKE Ingress + Managed SSL Certificate
  │
  ├──────────────► Frontend Service (React)
  │
  └──────────────► Backend Service (FastAPI)
                              │
                              ▼
                        PostgreSQL
                              │
                              ▼
                            Redis
```

---

# Tech Stack

## Frontend

* React
* Vite
* Axios
* Google OAuth

## Backend

* FastAPI
* SQLAlchemy
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

---

# Features

## Authentication

* Google OAuth Login
* User-specific task management

## Task Management

* Create Tasks
* View Tasks
* Update Tasks
* Delete Tasks
* Search Tasks

## Database

* PostgreSQL persistent storage
* SQLAlchemy ORM integration

## Caching

* Redis caching layer
* Improved task retrieval performance
* Automatic cache invalidation on updates

## Cloud Features

* Dockerized application
* Kubernetes deployments
* ConfigMaps and Secrets
* HTTPS secured endpoint
* Custom domain integration
* GKE Ingress routing
* Infrastructure as Code using Terraform

---

# Project Structure

```text
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
│   ├── ingress.yaml
│   ├── managed-cert.yaml
│   ├── configmap.yaml
│   └── secret.yaml
│
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── provider.tf
│
├── Dockerfile
├── docker-compose.yml
├── main.py
├── database.py
├── models.py
├── schemas.py
├── redis_config.py
├── requirements.txt
├── .env.example
└── README.md
```

---

# Environment Variables

Example `.env.example`

```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=taskdb
DB_USER=postgres
DB_PASSWORD=your_password

REDIS_HOST=redis
REDIS_PORT=6379

VITE_API_URL=https://taskmonitor.org/api
```

---

# API Endpoints

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

# Run Locally

## Clone Repository

```bash
git clone <repository-url>
cd task-tracker
```

## Create Environment File

```bash
cp .env.example .env
```

## Start Containers

```bash
docker compose up -d
```

## Backend

```text
http://localhost:8000
```

## Swagger Documentation

```text
http://localhost:8000/docs
```

## Frontend

```text
http://localhost:5173
```

---

# Docker

Build Backend

```bash
docker build -t task-api .
```

Build Frontend

```bash
docker build -t task-frontend ./frontend
```

---

# Kubernetes Deployment

Deploy Resources

```bash
kubectl apply -f k8s/
```

Verify Deployments

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

---

# Terraform Deployment

Initialize Terraform

```bash
terraform init
```

Plan Infrastructure

```bash
terraform plan
```

Apply Infrastructure

```bash
terraform apply
```

Verify State

```bash
terraform state list
```

---

# Deployment Validation

Infrastructure successfully managed by Terraform:

```text
No changes. Your infrastructure matches the configuration.

Apply complete!
Resources: 0 added, 0 changed, 0 destroyed.
```

---

# GCP Resources Used

* Google Kubernetes Engine (GKE)
* Artifact Registry
* Managed SSL Certificates
* Load Balancer
* Kubernetes Ingress
* Cloud DNS
* Compute Engine (GKE Nodes)


---

# Author

**Aaryan Thota**

Cloud Native Application Deployment on Google Cloud Platform using FastAPI, React, Kubernetes, Terraform, PostgreSQL, and Redis.
