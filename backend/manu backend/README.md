# Flask PostgreSQL Backend with JWT Authentication

A Flask-based backend application with PostgreSQL database, JWT authentication, and role-based access control (admin/user roles).

## Features

- **User Authentication**: Register and login with JWT tokens
- **Role-Based Access Control**: Admin and User roles
- **PostgreSQL Database**: Persistent data storage
- **JWT Token Support**: Secure token-based authentication
- **Admin Panel**: User management endpoints

## Setup Instructions

### Option 1: Docker Setup (Recommended)

**Prerequisites**:
- Docker 20.10+
- Docker Compose 1.29+

**Steps**:

1. **Navigate to the project directory**:
   ```bash
   cd Backend
   ```

2. **Copy environment template** (optional for customization):
   ```bash
   cp .env.example .env
   ```

3. **Build and start containers**:
   ```bash
   docker-compose up -d
   ```

   The API will be available at `http://localhost:5000`

4. **View logs**:
   ```bash
   docker-compose logs -f web
   ```

5. **Stop containers**:
   ```bash
   docker-compose down
   ```

### Option 2: Local Setup

**Prerequisites**:
- Python 3.8+
- PostgreSQL 12+
- pip or conda

**Steps**:

1. **Navigate to the project directory**:
   ```bash
   cd Backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   - Copy `.env.example` to `.env` and update with your PostgreSQL credentials
   - Example:
     ```
     DATABASE_URL=postgresql://user:password@localhost:5432/slosh_db
     JWT_SECRET_KEY=your-secret-key-here
     FLASK_ENV=development
     ```

5. **Create PostgreSQL database**:
   ```bash
   createdb slosh_db
   ```

6. **Run the application**:
   ```bash
   python run.py
   ```

   The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "user"
  }
  ```
- **Response**: User object with 201 status

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "username": "john_doe",
    "password": "securepassword"
  }
  ```
- **Response**: JWT access token with 200 status
- **Example**:
  ```json
  {
    "message": "Login successful",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: Current user object

### Admin Endpoints

#### List All Users
- **GET** `/api/auth/admin/users`
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response**: Array of all users

#### Update User Role
- **PATCH** `/api/auth/admin/users/<user_id>/role`
- **Headers**: `Authorization: Bearer <admin_token>`
- **Body**:
  ```json
  {
    "role": "admin"
  }
  ```
- **Response**: Updated user object

#### Update User Status
- **PATCH** `/api/auth/admin/users/<user_id>/status`
- **Headers**: `Authorization: Bearer <admin_token>`
- **Body**:
  ```json
  {
    "is_active": false
  }
  ```
- **Response**: Updated user object

## Project Structure

```
Backend/
├── app/
│   ├── controllers/     # Business logic controllers
│   │   ├── __init__.py
│   │   └── auth_controller.py
│   ├── models/          # Database models
│   │   ├── __init__.py
│   │   └── user.py
│   ├── routes/          # API endpoints/routes
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── utils/           # Utility functions & decorators
│   │   ├── __init__.py
│   │   └── decorators.py
│   └── __init__.py      # Application factory
├── config.py            # Configuration settings
├── run.py               # Application entry point
├── requirements.txt     # Python dependencies
├── Dockerfile          # Docker image
├── docker-compose.yml  # Dev environment
├── docker-compose.prod.yml # Prod environment
├── Makefile            # Helpful commands
├── .env                # Environment variables
├── .env.example        # Environment template
├── .gitignore          # Git ignore file
├── .dockerignore       # Docker ignore file
├── README.md           # This file
├── DOCKER.md           # Docker guide
├── DEPLOYMENT.md       # Deployment guide
└── PROJECT_STRUCTURE.md # Detailed structure guide
```

### Directory Breakdown

- **app/controllers/** - Business logic and request handling
- **app/models/** - Database models and ORM definitions
- **app/routes/** - API endpoints and route definitions
- **app/utils/** - Shared utilities, decorators, helpers
- **config.py** - Flask configuration for different environments
- **run.py** - Application entry point and server runner

## Testing

### Using cURL

1. **Register a user**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"password123","role":"user"}'
   ```

2. **Register an admin user**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","email":"admin@example.com","password":"adminpass","role":"admin"}'
   ```

3. **Login**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   ```

4. **Get current user** (replace TOKEN with actual token):
   ```bash
   curl -X GET http://localhost:5000/api/auth/me \
     -H "Authorization: Bearer TOKEN"
   ```

5. **List users (admin only)**:
   ```bash
   curl -X GET http://localhost:5000/api/auth/admin/users \
     -H "Authorization: Bearer ADMIN_TOKEN"
   ```

## Security Notes

⚠️ **Important for Production**:
- Change the `JWT_SECRET_KEY` in `.env` to a strong, random value
- Use HTTPS in production
- Store sensitive credentials securely
- Enable CORS appropriately
- Add rate limiting for login endpoints
- Implement password complexity requirements
- Use environment-specific configurations

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Check PostgreSQL credentials

### JWT Token Errors
- Verify token is included in Authorization header
- Check token hasn't expired
- Ensure JWT_SECRET_KEY matches between registration and verification

### Admin Override Not Working
- Verify user role is "admin" in database
- Check token claims include the role
- Confirm admin template is applied correctly

### Docker Issues

**Port already in use**:
```bash
# Stop existing containers
docker-compose down

# Or use different ports in docker-compose.yml
# Change "5000:5000" to "5001:5000" for example
```

**Database connection failed**:
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check container logs: `docker-compose logs db`
- Wait for database to be ready (health check runs 40s before app starts)

**Container won't start**:
```bash
# Check logs
docker-compose logs web

# Rebuild image
docker-compose build --no-cache

# Restart
docker-compose up
```

**Data persistence**:
- PostgreSQL data is stored in Docker volume `postgres_data`
- To reset database: `docker-compose down -v` (⚠️ deletes all data)
- To backup: `docker exec slosh_db pg_dump -U slosh_user slosh_db > backup.sql`

## License

This project is licensed under the MIT License.
