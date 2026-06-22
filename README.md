# Task Tracker - Cloud Native Application on Google Cloud Platform (GCP)

## Overview

Task Tracker is a cloud-native task management application built using FastAPI, React, PostgreSQL, and Redis.

The project demonstrates an end-to-end cloud-native deployment workflow on Google Cloud Platform (GCP), including containerization with Docker, infrastructure provisioning using Terraform, orchestration using Google Kubernetes Engine (GKE), HTTPS-secured public access through Kubernetes Ingress, and application deployment using Kubernetes.

The application allows users to authenticate using Google OAuth and perform CRUD operations on tasks through a responsive web interface.

---

# Live Application

## Frontend

https://taskmonitor.org

## API Documentation (Swagger)

https://taskmonitor.org/docs

---

# Architecture

```text
User
  │
  ▼
https://taskmonitor.org
  │
  ▼
DNS Resolution
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
     PostgreSQL                  Redis
```

---

# Tech Stack

## Frontend

* React
* Vite
* Axios
* Google OAuth

## Backend

* Python
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

* PostgreSQL data storage
* SQLAlchemy ORM integration

## Caching

* Redis caching layer
* Improved task retrieval performance
* Automatic cache invalidation on updates

## Cloud Features

* Dockerized application
* Kubernetes deployments
* Kubernetes services
* Kubernetes ingress routing
* HTTPS secured endpoint
* Custom domain integration
* Managed SSL certificates
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

## Build Backend

```bash
docker build -t task-api .
```

## Build Frontend

```bash
docker build -t task-frontend ./frontend
```

---

# Kubernetes Deployment

## Deploy Resources

```bash
kubectl apply -f k8s/
```

## Verify Deployments

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

---

# Kubernetes Components

The application is deployed using the following Kubernetes resources:

### Deployments

* Frontend Deployment
* Backend Deployment
* PostgreSQL Deployment
* Redis Deployment

### Services

* Frontend Service
* Backend Service
* PostgreSQL Service
* Redis Service

### Ingress

* GCE Ingress Controller
* HTTPS Routing
* Managed SSL Certificate

---

# Terraform Deployment

## Initialize Terraform

```bash
terraform init
```

## Plan Infrastructure

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

# Infrastructure as Code (IaC)

Terraform is used to provision and manage cloud infrastructure.

### Benefits

* Reproducible deployments
* Version-controlled infrastructure
* Automated provisioning
* Reduced manual configuration
* Consistent environments

---

# Deployment Validation

Infrastructure successfully managed by Terraform:

```text
No changes. Your infrastructure matches the configuration.

Apply complete!
Resources: 0 added, 0 changed, 0 destroyed.
```

---

# Security

* HTTPS enabled using GKE Managed Certificates
* TLS encryption for secure communication
* Kubernetes Secrets for sensitive configuration
* Environment variables following 12-Factor App principles
* Secure OAuth authentication using Google Login

---

# Scalability

The application is deployed on Google Kubernetes Engine (GKE) with multiple frontend and backend replicas.

### Current Deployment

* Frontend: 2 Replicas
* Backend: 2 Replicas
* PostgreSQL: 1 Replica
* Redis: 1 Replica

Kubernetes enables horizontal scaling by increasing pod replicas as traffic grows.

---

# GCP Resources Used

* Google Kubernetes Engine (GKE)
* Artifact Registry
* Google Cloud Load Balancer
* Managed SSL Certificates
* Kubernetes Ingress
* Compute Engine (GKE Nodes)

---

# Screenshots

The repository includes screenshots demonstrating:

* Terraform Deployment
* GKE Cluster
* Kubernetes Pods
* Kubernetes Services
* Kubernetes Ingress
* HTTPS Access
* Task Dashboard
* Task Creation
* CRUD Operations

---

# Author

**Aaryan Thota**

Cloud Native Application Deployment on Google Cloud Platform using FastAPI, React, Kubernetes, Terraform, PostgreSQL, and Redis.
