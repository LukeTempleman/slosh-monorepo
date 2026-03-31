# GONXT Backend

A Flask + PostgreSQL backend service with JWT authentication, role-based access control, and API key management.

## Features

- **User Authentication**: JWT-based login/registration system
- **Role-Based Access Control**: Admin, User, and Viewer roles
- **API Key Management**: Generate, manage, and verify API keys with hashing
- **Secure Key Storage**: Randomly generated and bcrypt-hashed keys
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Docker Support**: Full Docker and Docker Compose setup

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 13+
- Docker & Docker Compose (optional)

### Installation - Local Development

1. **Clone and setup**
   ```bash
   cd "GONXT backend"
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   FLASK_ENV=development
   DATABASE_URL=postgresql://gonxt_user:gonxt_password@localhost:5432/gonxt_db
   JWT_SECRET_KEY=your-jwt-secret-key-here
   ```

3. **Create PostgreSQL database**
   ```bash
   createdb -U postgres gonxt_db
   ```

4. **Initialize database**
   ```bash
   python -c "from app import create_app, db; app = create_app(); ctx = app.app_context(); ctx.push(); db.create_all(); print('Database initialized!')"
   ```

5. **Seed initial data**
   ```bash
   python -c "from app import create_app; app = create_app(); ctx = app.app_context(); ctx.push(); 
   from models import User, db
   admin = User(username='admin', email='admin@gonxt.local', role='admin')
   admin.set_password('admin@123')
   db.session.add(admin)
   db.session.commit(); print('Admin user created')"
   ```

6. **Run the application**
   ```bash
   python run.py
   ```

   Server runs at `http://localhost:5000`

### Installation - Docker

1. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Initialize database** (if needed)
   ```bash
   docker-compose exec flask_app python -c "from app import create_app, db; app = create_app(); ctx = app.app_context(); ctx.push(); db.create_all(); print('DB initialized!')"
   ```

3. **Access services**
   - Flask API: `http://localhost:5000`
   - PgAdmin: `http://localhost:5050` (admin@gonxt.local / admin@123)

## API Endpoints

### Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (201)**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "username": "john",
    "email": "john@example.com",
    "role": "user",
    "is_active": true,
    "created_at": "2024-01-20T10:00:00",
    "updated_at": "2024-01-20T10:00:00"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin@123"
}
```

**Response (200)**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@gonxt.local",
    "role": "admin",
    "is_active": true,
    "created_at": "2024-01-20T10:00:00"
  }
}
```

#### Refresh Token
```bash
POST /api/auth/refresh
Authorization: Bearer <refresh_token>
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <access_token>
```

### API Key Management

#### Create API Key
```bash
POST /api/keys
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "My API Key",
  "description": "Key for external service"
}
```

**Response (201) - Save this key!**
```json
{
  "id": "uuid",
  "name": "My API Key",
  "description": "Key for external service",
  "key": "gnx_AbCdEfGhIjKlMnOpQrStUvWxYz...",
  "is_active": true,
  "created_at": "2024-01-20T10:00:00",
  "message": "API key created. Save this key - you won't see it again!"
}
```

#### List API Keys
```bash
GET /api/keys
Authorization: Bearer <access_token>
```

#### Delete API Key
```bash
DELETE /api/keys/{key_id}
Authorization: Bearer <access_token>
```

#### Verify API Key
```bash
POST /api/keys/verify
Content-Type: application/json

{
  "api_key": "gnx_AbCdEfGhIjKlMnOpQrStUvWxYz..."
}
```

### Admin Routes

#### List All Users (Admin Only)
```bash
GET /api/auth/admin/users
Authorization: Bearer <admin_access_token>
```

#### Update User Role (Admin Only)
```bash
PATCH /api/auth/admin/users/{user_id}/role
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "role": "admin"  # Options: "admin", "user", "viewer"
}
```

#### Update User Status (Admin Only)
```bash
PATCH /api/auth/admin/users/{user_id}/status
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "is_active": true
}
```

## Database Models

### User
```python
- id: UUID (primary key)
- username: String (unique)
- email: String (unique)
- password_hash: String (bcrypt)
- role: String (admin, user, viewer)
- is_active: Boolean
- created_at: DateTime
- updated_at: DateTime
- api_keys: Relationship to APIKey
```

### APIKey
```python
- id: UUID (primary key)
- user_id: UUID (foreign key)
- key_hash: String (bcrypt hash, unique)
- name: String
- description: Text
- last_used_at: DateTime (nullable)
- is_active: Boolean
- created_at: DateTime
- updated_at: DateTime
```

## Security Features

1. **Password Hashing**: Bcrypt with salting
2. **API Key Hashing**: Randomly generated `gnx_` prefixed keys, hashed with bcrypt
3. **JWT Tokens**: Signed tokens with role claims
4. **Role-Based Access**: Admin decorators for protected routes
5. **CORS Support**: Configurable for frontend integration

## Configuration

Key settings in `config.py`:

```python
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
```

## Environment Variables

```bash
FLASK_ENV              # development, production, testing
FLASK_DEBUG            # True/False
DATABASE_URL           # PostgreSQL connection string
JWT_SECRET_KEY         # Secret key for JWT signing
PORT                   # Server port (default: 5000)
```

## Testing

Run tests with pytest:
```bash
pytest -v
```

## Development

### Create admin user
```python
from models import User, db
admin = User(username='admin', email='admin@gonxt.local', role='admin')
admin.set_password('admin@123')
db.session.add(admin)
db.session.commit()
```

### Generate API key per user
1. Login as user
2. POST to `/api/keys` to generate new key
3. Key is shown once - store securely
4. Use key to verify access

## Troubleshooting

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify credentials match PostgreSQL setup

### Port already in use
```bash
# Change PORT in .env
PORT=5001
```

### JWT signature verification failed
- Ensure JWT_SECRET_KEY is same across all instances
- Check token expiration

## Project Structure

```
GONXT backend/
├── app.py             # Application factory
├── config.py          # Configuration
├── models.py          # Database models
├── routes.py          # API endpoints
├── auth_controller.py # Authentication logic
├── run.py             # Entry point
├── requirements.txt   # Python dependencies
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Full stack setup
└── README.md          # This file
```

## License

Proprietary - GONXT

## Support

For issues or questions, contact the development team.
