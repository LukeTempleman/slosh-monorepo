# GONXT Backend - Quick Start Guide

Get up and running in 5 minutes!

## Option 1: Docker (Recommended)

### Requirements
- Docker
- Docker Compose

### Steps

1. **Start services**
   ```bash
   docker-compose up -d
   ```

2. **Check services are running**
   ```bash
   docker-compose ps
   ```

3. **Create initial data** (optional)
   ```bash
   docker-compose exec flask_app python -c "
   from app import create_app
   from models import User, db
   app = create_app()
   ctx = app.app_context()
   ctx.push()
   
   admin = User(username='admin', email='admin@gonxt.local', role='admin')
   admin.set_password('admin@123')
   db.session.add(admin)
   db.session.commit()
   print('Admin user created: admin / admin@123')
   "
   ```

4. **Access services**
   - API: http://localhost:5000/api/health
   - PgAdmin: http://localhost:5050 (admin@gonxt.local / admin@123)

5. **Stop services**
   ```bash
   docker-compose down
   ```

---

## Option 2: Local Development

### Requirements
- Python 3.11+
- PostgreSQL 13+

### Steps

1. **Setup Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Setup PostgreSQL**
   ```bash
   # Create database
   createdb -U postgres gonxt_db
   
   # Optional: Create user
   createuser -U postgres gonxt_user
   psql -U postgres -d gonxt_db -c "ALTER USER gonxt_user WITH PASSWORD 'gonxt_password';"
   ```

3. **Configure .env**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed:
   ```
   DATABASE_URL=postgresql://gonxt_user:gonxt_password@localhost:5432/gonxt_db
   JWT_SECRET_KEY=your-secret-key-here
   ```

4. **Initialize database**
   ```bash
   python -c "from app import create_app, db; app = create_app(); ctx = app.app_context(); ctx.push(); db.create_all(); print('DB ready!')"
   ```

5. **Add admin user**
   ```bash
   python -c "
   from app import create_app
   from models import User, db
   app = create_app()
   ctx = app.app_context()
   ctx.push()
   
   admin = User(username='admin', email='admin@gonxt.local', role='admin')
   admin.set_password('admin@123')
   db.session.add(admin)
   db.session.commit()
   print('Admin created!')
   "
   ```

6. **Run server**
   ```bash
   python run.py
   ```

   Server at: http://localhost:5000

---

## First Steps

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin@123"
  }'
```

Response will include `access_token` - save this!

### 2. Create API Key
```bash
curl -X POST http://localhost:5000/api/keys \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Key",
    "description": "Testing API keys"
  }'
```

Response includes the key - **save it immediately**! You won't see it again.

### 3. Verify API Key
```bash
curl -X POST http://localhost:5000/api/keys/verify \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "gnx_YOUR_KEY_HERE"
  }'
```

---

## Using Postman

1. **Import collection**
   - Open Postman
   - Import `GONXT_API.postman_collection.json`

2. **Setup environment**
   - Create new environment
   - Add variables:
     - `access_token`: (leave blank, auto-populated by Login request)
     - `refresh_token`: (leave blank, auto-populated by Login request)
     - `api_key`: (leave blank, auto-populated by Create API Key request)

3. **Make requests**
   - Start with "Login" request
   - Use other requests - tokens auto-populate!

---

## Key Concepts

### Users
- Created with username/email/password
- Assigned role: `admin`, `user`, or `viewer`
- Disabled/enabled with `is_active` flag

### API Keys
- Generated randomly with `gnx_` prefix
- Hashed with bcrypt for security
- Shown ONCE at creation - store securely
- Can verify without JWT token

### JWT Tokens
- **Access Token**: Short-lived (1 hour), used to access protected routes
- **Refresh Token**: Long-lived (30 days), used to get new access token
- Both contain user role in claims

### Admin Role
- Can manage all users
- Can update user roles and status
- Routes: `/api/auth/admin/*`

---

## Troubleshooting

### Docker: Port 5000 already in use
```bash
# Kill process or use different port
docker-compose.yml - change ports line:
  - "5001:5000"
```

### Docker: Database connection error
```bash
# Ensure postgres is healthy
docker-compose logs postgres

# Manually create DB
docker-compose exec postgres createdb -U gonxt_user gonxt_db
```

### Local: ModuleNotFoundError
```bash
# Activate venv and reinstall
source venv/bin/activate
pip install -r requirements.txt
```

### Local: PostgreSQL connection refused
```bash
# Check PostgreSQL is running
psql -U postgres  # Should connect

# If not, start PostgreSQL:
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### JWT token expired
- New tokens needed after 1 hour
- Use `refresh_token` to get new `access_token`
- POST to `/api/auth/refresh` with Authorization header

---

## Common Tasks

### Create new user as admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "secure123"
  }'
```

### Promote user to admin
```bash
# 1. Get all users
curl -X GET http://localhost:5000/api/auth/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 2. Get user_id from response

# 3. Update role
curl -X PATCH http://localhost:5000/api/auth/admin/users/{user_id}/role \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

### Disable user account
```bash
curl -X PATCH http://localhost:5000/api/auth/admin/users/{user_id}/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

### Test API with generated key
```bash
# Use the key from creation response
curl -X POST http://localhost:5000/api/keys/verify \
  -H "Content-Type: application/json" \
  -d '{"api_key": "gnx_XYZ..."}'
```

---

## Next Steps

- Read [README.md](README.md) for full API documentation
- Check [docker-compose.yml](docker-compose.yml) for configuration options
- Review [models.py](models.py) for database schema
- Run tests: `pytest -v` (requires local setup)

---

## Quick Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Get JWT tokens |
| `/api/auth/me` | GET | Yes | Current user info |
| `/api/keys` | POST | Yes | Create API key |
| `/api/keys` | GET | Yes | List user's keys |
| `/api/keys/verify` | POST | No | Verify API key |
| `/api/auth/admin/users` | GET | Admin | List all users |

---

Need help? Check README.md or error messages in logs!
