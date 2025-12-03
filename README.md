# Recruitsss - Complete Recruitment Platform

![Django](https://img.shields.io/badge/Django-5.2-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)
![Progress](https://img.shields.io/badge/Progress-90%25-brightgreen.svg)
![License](https://img.shields.io/badge/License-TBD-yellow.svg)

A modern, production-ready recruitment platform (Applicant Tracking System) built with Django 5 LTS and Next.js 15. **90% Complete** with working authentication, dashboards, job search, and API.

## 🎯 Features

### Core Functionality
- **Multi-Role System**: Candidates, Recruiters, and Admins
- **Job Management**: Create, publish, and manage job offers
- **Smart Applications**: Apply to jobs with AI-powered matching
- **Multi-Channel Notifications**: Email, WhatsApp, and In-App
- **Payment Processing**: Subscription management for recruiters
- **Advanced Search**: Full-text search with filters
- **Gamification**: Points, levels, and badges for candidates

### Technical Highlights
- **Modern Stack**: Django 5 LTS + Next.js 15 + PostgreSQL 16
- **RESTful API**: Fully documented with OpenAPI/Swagger
- **JWT Authentication**: Secure token-based auth
- **Async Tasks**: Celery for background jobs
- **Caching**: Redis for performance
- **Docker Support**: Full containerization
- **Production Ready**: Security best practices applied

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🏗️ Architecture

This project is built on a decoupled, service-oriented architecture that separates the frontend and backend concerns, ensuring scalability and maintainability.

```mermaid
graph TD
    subgraph User Interaction
        A[Browser / Client]
    end

    subgraph Frontend (Vercel / Node.js)
        B[Next.js App]
        B -- "Serves UI components" --> A
        A -- "User actions (login, search, etc.)" --> B
    end

    subgraph Backend (Railway / Docker)
        C[Django REST API]
        D[PostgreSQL Database]
        E[Redis]
        F[Celery]
    end

    B -- "Makes API calls (REST over HTTPS)" --> C
    C -- "Authenticates via JWT" --> B
    C -- "Reads/Writes data" --> D
    C -- "Caches queries/sessions" --> E
    C -- "Dispatches async tasks" --> F
    F -- "Executes background jobs (e.g., sending emails)" --> C
    F -- "Uses Redis as message broker" --> E

    style B fill:#282c34,stroke:#61dafb,color:#fff
    style C fill:#092e20,stroke:#44b78b,color:#fff
    style D fill:#336791,stroke:#fff,color:#fff
    style E fill:#d82c20,stroke:#fff,color:#fff
    style F fill:#a0a0a0,stroke:#fff,color:#fff
```

### Composants Clés

1.  **Frontend (`/frontend`)**:
    *   Un client riche et interactif construit avec **Next.js** (React) et **TypeScript**.
    *   Utilise une architecture **App Router** pour le routage et le rendu côté serveur/client.
    *   Gère l'état global et la communication avec l'API via **Zustand** et **React Query** (via Axios).
    *   L'interface est stylée avec **Tailwind CSS**.
    *   Responsable de l'expérience utilisateur, de l'affichage des données et de la capture des entrées utilisateur.

2.  **Backend (`/backend`)**:
    *   Une **API RESTful** robuste développée avec **Django** et **Django REST Framework**.
    *   Sert de point d'accès unique pour toutes les opérations de données (CRUD).
    *   **Authentification**: Gérée par **Simple JWT**, fournissant des `access tokens` et `refresh tokens` pour sécuriser les points d'accès de l'API.
    *   **Base de données**: **PostgreSQL** est la source de vérité, stockant toutes les données persistantes (utilisateurs, offres d'emploi, candidatures, etc.).
    *   **Gestion des Tâches Asynchrones**: **Celery** est utilisé pour exécuter des tâches longues en arrière-plan (comme l'envoi d'e-mails de notification), évitant de bloquer l'API.
    *   **Caching & Message Broker**: **Redis** joue un double rôle :
        *   Il sert de **cache** pour les requêtes fréquentes et les sessions, réduisant la charge sur la base de données.
        *   Il agit comme **message broker** pour Celery, gérant la file d'attente des tâches.

### Flux d'Authentification

1.  L'utilisateur soumet ses identifiants via le formulaire de connexion sur le frontend Next.js.
2.  Le frontend envoie une requête `POST` à l'endpoint `/api/v1/auth/login/` du backend Django.
3.  Django vérifie les identifiants et, si valides, génère un `access token` (courte durée) et un `refresh token` (longue durée).
4.  Le frontend stocke ces tokens de manière sécurisée (par exemple, dans le `localStorage` ou des cookies).
5.  Pour chaque requête API subséquente, le frontend inclut l'`access token` dans le header `Authorization: Bearer <token>`.
6.  Lorsque l'`access token` expire, le frontend utilise le `refresh token` pour en obtenir un nouveau sans que l'utilisateur ait à se reconnecter.

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.2 LTS
- **API**: Django REST Framework 3.16+
- **Database**: PostgreSQL 16 with extensions (uuid-ossp, pg_trgm)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Caching**: Redis 7+
- **Task Queue**: Celery 5.3+
- **Documentation**: drf-spectacular (OpenAPI 3.0)

### Frontend
- **Framework**: Next.js 15 (App Router) ✅
- **Language**: TypeScript 5+ ✅
- **Styling**: Tailwind CSS v4 ✅
- **UI Components**: Custom components ✅
- **State Management**: Zustand + Axios ✅
- **Forms**: React Hook Form (ready) ✅
- **Auth**: JWT with auto-refresh ✅

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (to be configured)
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- OR manually: Python 3.12+, PostgreSQL 16+, Redis 7+, Node.js 20+

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Starland9/recruitsss.git
cd recruitsss

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# 🎬 NEW: Populate database with demo data (perfect for presentations!)
docker-compose exec backend python manage.py seed_data --clear

# Create superuser (or use demo admin: admin@recruitsss.com / Admin123!)
docker-compose exec backend python manage.py createsuperuser

# Access the application
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs/
# Admin Panel: http://localhost:8000/admin/
# Frontend: http://localhost:3000
```

### 🎬 Demo Data for Presentations

The project includes a powerful command to populate the database with realistic demo data:

```bash
# Quick demo data (20 candidates, 10 recruiters, 30 jobs)
python manage.py seed_data --clear

# Large demo dataset  
python manage.py seed_data --clear --candidates 100 --recruiters 30 --jobs 150
```

**Test Accounts Created:**
- **Admin**: admin@recruitsss.com / Admin123!
- **Candidate**: candidate1@example.com / Password123!
- **Recruiter**: recruiter1@example.com / Password123!

📚 **Full Documentation**: See [backend/QUICKSTART_SEED_DATA.md](backend/QUICKSTART_SEED_DATA.md) for complete guide

### Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Create database
createdb recruitsss

# Run migrations
python manage.py migrate

# 🎬 Populate with demo data (recommended for presentations)
python manage.py seed_data --clear

# Or create superuser manually
python manage.py createsuperuser

# Run server
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env .env.local

# Run development server
npm run dev

# Access at http://localhost:3000
```

## 📁 Project Structure

```
recruitsss/
├── backend/                    # Django Backend ✅
│   ├── config/                 # Project settings
│   ├── users/                  # User management app
│   ├── jobs/                   # Job offers app
│   ├── applications/           # Applications app
│   ├── notifications/          # Notifications app
│   ├── payments/               # Payments app
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Backend container
│   └── README.md               # Backend documentation
├── frontend/                   # Next.js Frontend ✅
│   ├── app/                    # Next.js App Router
│   │   ├── auth/               # Auth pages (login, register)
│   │   ├── dashboard/          # Role-based dashboards
│   │   ├── jobs/               # Job listing & details
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   ├── lib/                    # API client, types, stores
│   └── README.md               # Frontend documentation
├── docs/                       # Documentation
│   ├── architecture/           # Architecture diagrams
│   ├── api/                    # API documentation
│   └── deployment/             # Deployment guides
├── infrastructure/             # DevOps configs
│   ├── docker/                 # Docker configs
│   └── nginx/                  # Nginx configs
├── *.puml                      # PlantUML diagrams
├── database-schema.sql         # PostgreSQL schema
├── docker-compose.yml          # Docker orchestration
└── README.md                   # This file
```

## 💻 Development

### Backend Development

```bash
cd backend

# Run tests
python manage.py test

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Run Celery worker
celery -A config worker -l info

# Run Celery beat (scheduled tasks)
celery -A config beat -l info
```

### Frontend Development

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Run linter
npm run lint
```

## 📚 API Documentation

The API is fully documented using OpenAPI 3.0 specification.

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

### Main Endpoints

**Authentication**
- `POST /api/v1/auth/register/` - User registration ✅
- `POST /api/v1/auth/login/` - User login ✅
- `POST /api/v1/auth/logout/` - User logout ✅
- `POST /api/v1/auth/token/refresh/` - Refresh JWT token ✅

**Jobs**
- `GET /api/v1/jobs/` - List job offers ✅
- `POST /api/v1/jobs/` - Create job offer ✅
- `GET /api/v1/jobs/{id}/` - Get job details ✅
- `POST /api/v1/jobs/{id}/publish/` - Publish job ✅
- `POST /api/v1/jobs/{id}/close/` - Close job ✅

**Applications**
- `GET /api/v1/applications/` - List applications ✅
- `POST /api/v1/applications/` - Apply to job ✅
- `POST /api/v1/applications/{id}/withdraw/` - Withdraw application ✅
- `POST /api/v1/applications/{id}/shortlist/` - Shortlist candidate ✅

**Notifications & More**
- `GET /api/v1/notifications/` - List notifications ✅
- `GET /api/v1/users/me/` - Get current user ✅
- `POST /api/v1/saved-jobs/` - Save job ✅
- `GET /api/v1/payments/` - List payments ✅

## 🗄️ Database Schema

The database schema includes:

- **users**: Base user table with role-based access
- **candidates**: Candidate profiles with CV and skills
- **recruiters**: Recruiter profiles with company info
- **admins**: Admin profiles with permissions
- **job_offers**: Job postings with rich details
- **applications**: Job applications with matching scores
- **notifications**: Multi-channel notifications
- **payments**: Payment tracking and subscriptions
- **saved_jobs**: Candidate bookmarks
- **contact_messages**: Contact form submissions
- **logs**: System audit logs
- **seo_metadata**: SEO optimization
- **badges**: Gamification badges
- **candidate_badges**: Earned badges
- **gamification_scores**: User points and levels

Full schema available in `database-schema.sql`

## 🚢 Deployment

### Backend Deployment

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

**Option 2: Render**
- Connect your GitHub repository
- Configure environment variables
- Deploy automatically on push

**Option 3: AWS/DigitalOcean**
- Use provided Dockerfile
- Configure environment variables
- Set up PostgreSQL and Redis instances

### Frontend Deployment

**Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

To be defined

## 👥 Authors

- Starland9 - Initial work

## 🙏 Acknowledgments

- Django REST Framework team
- Next.js team
- All contributors and supporters

## 📞 Contact

- Project Link: https://github.com/Starland9/recruitsss
- Documentation: See `/docs` folder

---

**Status**: 90% Complete - Full backend API + Frontend with authentication, dashboards, and job search working. Ready for deployment and further customization.
