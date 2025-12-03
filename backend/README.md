# Recruitsss Backend - Django 5 LTS

## Overview

Recruitsss backend is a production-ready Django 5 LTS API for a complete recruitment platform with features including:

- **User Management**: Candidates, Recruiters, and Admins with role-based access
- **Job Offers**: Create, manage, and search job postings
- **Applications**: Handle candidate applications with AI matching scores
- **Notifications**: Multi-channel notifications (Email, WhatsApp, In-App)
- **Payments**: Subscription management for recruiters
- **REST API**: Full RESTful API with JWT authentication
- **OpenAPI Documentation**: Swagger/ReDoc documentation

## Tech Stack

- **Framework**: Django 5.2 LTS
- **API**: Django REST Framework 3.16+
- **Database**: PostgreSQL 16+ with advanced features
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Caching**: Redis
- **Task Queue**: Celery with Redis broker
- **Documentation**: drf-spectacular (OpenAPI 3.0)
- **CORS**: django-cors-headers

## Quick Start

### Prerequisites

- Python 3.12+
- PostgreSQL 16+
- Redis 7+

### Installation

1. **Clone the repository and navigate to backend**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Create PostgreSQL database**:
   ```bash
   createdb recruitsss
   ```

6. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser**:
   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server**:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## Database Setup

### Apply the SQL schema

The complete database schema is available in `../database-schema.sql`. To apply it:

```bash
psql recruitsss < ../database-schema.sql
```

Or let Django migrations handle it:

```bash
python manage.py makemigrations
python manage.py migrate
```

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## Project Structure

```
backend/
├── config/                 # Django project settings
│   ├── settings.py        # Main settings
│   ├── urls.py            # URL configuration
│   └── wsgi.py            # WSGI config
├── users/                 # User management app
│   ├── models.py          # User, Candidate, Recruiter, Admin models
│   ├── admin.py           # Admin configuration
│   ├── serializers.py     # API serializers (to be created)
│   └── views.py           # API views (to be created)
├── jobs/                  # Job offers app
│   ├── models.py          # JobOffer, SavedJob models
│   ├── admin.py           # Admin configuration
│   └── ...
├── applications/          # Applications app
│   ├── models.py          # Application model
│   └── ...
├── notifications/         # Notifications app
│   └── ...
├── payments/              # Payments app
│   └── ...
├── requirements.txt       # Python dependencies
├── .env.example           # Environment variables template
└── manage.py              # Django management script
```

## Models

### User System

- **User**: Base user model with email authentication
- **Candidate**: Candidate profile with CV, skills, experience
- **Recruiter**: Recruiter profile with company information
- **Admin**: Admin profile with permissions

### Core Features

- **JobOffer**: Job postings with rich details
- **Application**: Job applications with matching scores
- **Notification**: Multi-channel notifications
- **Payment**: Subscription payments tracking
- **SavedJob**: Candidate job bookmarks

## Environment Variables

Key environment variables (see `.env.example`):

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=recruitsss
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

REDIS_URL=redis://localhost:6379/1
CELERY_BROKER_URL=redis://localhost:6379/0
```

## Development

### Running Tests

```bash
python manage.py test
```

### Creating a Superuser

```bash
python manage.py createsuperuser
```

### Making Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Running Celery

In a separate terminal:

```bash
celery -A config worker -l info
```

## API Endpoints (Planned)

### Authentication
- `POST /api/v1/auth/register/` - Register new user
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/refresh/` - Refresh token
- `POST /api/v1/auth/logout/` - Logout

### Users
- `GET /api/v1/users/me/` - Get current user
- `PUT /api/v1/users/me/` - Update current user
- `GET /api/v1/users/candidates/` - List candidates
- `GET /api/v1/users/recruiters/` - List recruiters

### Jobs
- `GET /api/v1/jobs/` - List jobs
- `POST /api/v1/jobs/` - Create job (recruiter)
- `GET /api/v1/jobs/{id}/` - Get job details
- `PUT /api/v1/jobs/{id}/` - Update job
- `DELETE /api/v1/jobs/{id}/` - Delete job

### Applications
- `GET /api/v1/applications/` - List applications
- `POST /api/v1/applications/` - Apply to job
- `GET /api/v1/applications/{id}/` - Get application
- `PUT /api/v1/applications/{id}/` - Update application status

### Notifications
- `GET /api/v1/notifications/` - List notifications
- `PUT /api/v1/notifications/{id}/read/` - Mark as read

### Payments
- `GET /api/v1/payments/` - List payments
- `POST /api/v1/payments/` - Create payment
- `GET /api/v1/payments/{id}/` - Get payment details

## Security

- JWT token-based authentication
- CORS configured for frontend
- CSRF protection enabled
- SQL injection prevention
- XSS protection
- Password hashing with PBKDF2
- Environment-based secrets

## Performance

- Redis caching for sessions and frequent queries
- Database connection pooling
- Query optimization with select_related/prefetch_related
- Celery for async tasks
- Database indexes on frequently queried fields

## Next Steps

1. Create serializers for all models
2. Implement ViewSets and API endpoints
3. Add JWT authentication endpoints
4. Implement permissions (IsCandidate, IsRecruiter, IsAdmin)
5. Create Celery tasks for notifications
6. Add API tests
7. Implement AI matching service
8. Add search functionality (Elasticsearch/PostgreSQL full-text)

## Contributing

See the main project README for contribution guidelines.

## License

To be defined
