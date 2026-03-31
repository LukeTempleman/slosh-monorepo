# GONXT Backend - Project Index

## 📋 Quick Navigation

| File | Purpose |
|------|---------|
| **[QUICKSTART.md](QUICKSTART.md)** | ⚡ Start here - 5 minute setup guide |
| **[README.md](README.md)** | 📖 Complete API documentation |
| **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** | 🏗️ Architecture and project organization |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | 🚀 Production deployment guide |

---

## 🚀 Getting Started (Choose One)

### Option 1: Docker (Recommended - 2 minutes)
```bash
docker-compose up -d
# API ready at http://localhost:5000
```

### Option 2: Local Dev (5 minutes)
**Windows:**
```bash
setup-windows.bat
source venv\Scripts\activate.bat
python run.py
```

**Linux/Mac:**
```bash
bash setup.sh
source venv/bin/activate
python run.py
```

---

## 📁 Project Files Explained

### Core Application
- **app.py** - Application factory, initializes Flask, database, JWT, CORS
- **config.py** - Configuration for development/production/testing environments
- **run.py** - Entry point to start the server
- **models.py** - Database models (User, APIKey) with hashing logic

### Business Logic
- **auth_controller.py** - Authentication, authorization, API key management
- **routes.py** - API endpoints organized in blueprints (auth, keys, admin)

### Configuration & Setup
- **.env.example** - Template for environment variables
- **config.py** - Environment-specific settings
- **requirements.txt** - Python dependencies
- **setup.sh** - Linux/Mac automated setup
- **setup-windows.bat** - Windows automated setup

### Docker & Deployment
- **Dockerfile** - Docker image definition
- **docker-compose.yml** - Full stack (Flask + PostgreSQL + PgAdmin)
- **DEPLOYMENT.md** - Production deployment guide

### Documentation
- **README.md** - Full API documentation with examples
- **QUICKSTART.md** - Getting started in 5 minutes
- **PROJECT_STRUCTURE.md** - Architecture and design patterns
- **DEPLOYMENT.md** - Production setup guide

### Testing & Development
- **test_api.py** - Pytest test suite
- **GONXT_API.postman_collection.json** - Postman API collection
- **Makefile** - Common development commands

### Version Control
- **.gitignore** - Git ignore patterns

---

## 🔑 Key Features

✅ **JWT Authentication** - Secure token-based login
✅ **Role-Based Access** - Admin, User, Viewer roles  
✅ **API Key Management** - Generate, hash, and verify API keys
✅ **PostgreSQL** - Production-grade database
✅ **Docker Support** - Full containerized setup
✅ **Bcrypt Hashing** - Secure password and key storage
✅ **CORS Enabled** - Frontend integration ready
✅ **Comprehensive Tests** - Test suite included

---

## 🔐 Security Highlights

| Feature | Implementation |
|---------|-----------------|
| Passwords | Bcrypt with salting |
| API Keys | Random generation (gnx_) + bcrypt hash |
| Tokens | JWT signed with secret key |
| Authorization | Role-based access control (decorators) |
| Database | UUID primary keys, indexed for performance |

**API Key Flow:**
```
Generate → Random "gnx_*" → Hash with bcrypt → Storage
Verify → Compare against hashes → Update last_used
```

---

## 📊 Database Models

### User Table
- id, username, email, password_hash, role, is_active
- Timestamps: created_at, updated_at
- Relationship: One user → Many API keys

### APIKey Table
- id, user_id, key_hash, name, description, is_active
- Tracking: last_used_at
- Timestamps: created_at, updated_at
- Note: key_plain hidden after creation

---

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login, get tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Current user info

### API Keys
- `POST /api/keys` - Create API key
- `GET /api/keys` - List user's keys
- `DELETE /api/keys/{id}` - Delete key
- `POST /api/keys/verify` - Verify API key

### Admin Only
- `GET /api/auth/admin/users` - List all users
- `PATCH /api/auth/admin/users/{id}/role` - Change user role
- `PATCH /api/auth/admin/users/{id}/status` - Enable/disable user

### Utility
- `GET /api/health` - Health check

---

## 👤 Default Credentials

After setup, these default accounts are available:

| Username | Password | Role |
|----------|----------|------|
| admin | admin@123 | admin |
| demo | demo@123 | user |

**⚠️ IMPORTANT:** Change these credentials before production!

---

## 🛠️ Common Commands

### Setup
```bash
make install              # Install dependencies
make db-init            # Initialize database
make db-seed            # Seed with test data
```

### Development
```bash
make run                 # Production server
make dev                 # Development with hot reload
make test               # Run tests
```

### Docker
```bash
make docker-up          # Start all services
make docker-down        # Stop services
make docker-logs        # View logs
```

### Database
```bash
make db-drop            # Drop all tables
make clean              # Clean cache files
```

See **Makefile** for all available commands.

---

## 🧪 Testing

### Run Tests
```bash
pytest -v
pytest -v --cov         # With coverage report
pytest -v -k auth       # Run specific tests
```

### Test with Postman
1. Import **GONXT_API.postman_collection.json**
2. Create environment with variables:
   - access_token (auto-filled)
   - refresh_token (auto-filled)
   - api_key (auto-filled)
3. Run "Login" first
4. Use other requests with auto-populated tokens

---

## 🚀 Deployment

### Quick Docker Production
```bash
# 1. Create production .env
cp .env.example .env.prod
# 2. Edit .env.prod with production secrets

# 3. Start services
docker-compose -f docker-compose.yml up -d

# 4. Access
# API: https://yourdomain.com
# PgAdmin: https://yourdomain.com:5050
```

### Full Production Setup
See **DEPLOYMENT.md** for:
- Gunicorn + Nginx setup
- SSL configuration
- PostgreSQL tuning
- Monitoring & logging
- Scaling strategies

---

## 📚 Documentation Map

```
├── QUICKSTART.md          ← Start here (5 min)
│   └── Shows Docker & local setup
│
├── README.md              ← API Reference (30 min)
│   └── All endpoints with examples
│
├── PROJECT_STRUCTURE.md   ← Deep dive (1 hour)
│   └── Architecture & design patterns
│
├── DEPLOYMENT.md          ← Production (1-2 hours)
│   └── Complete deployment guide
│
└── This file (INDEX.md)   ← You are here
    └── Quick navigation
```

---

## ❓ Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or docker-compose.yml
PORT=5001
```

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql
# Or with Docker
docker-compose logs postgres
```

### JWT Token Expired
```bash
# Login again to get new token
# Or use refresh_token POST /api/auth/refresh
```

### Permission Denied on setup.sh
```bash
chmod +x setup.sh
./setup.sh
```

For more help, see **DEPLOYMENT.md** Troubleshooting section.

---

## 🔄 Development Workflow

### Local Development
```
1. git clone <repo>
2. bash setup.sh  (or setup-windows.bat)
3. source venv/bin/activate
4. python run.py
5. Access http://localhost:5000/api/health
```

### With Docker
```
1. git clone <repo>
2. docker-compose up -d
3. Access http://localhost:5000/api/health
4. PgAdmin at http://localhost:5050
```

### Adding New Feature
```
1. Edit models.py (if needed)
2. Edit auth_controller.py (business logic)
3. Edit routes.py (add endpoint)
4. Write tests in test_api.py
5. Test with: pytest -v
6. Test with Postman collection
```

---

## 🎯 Next Steps

1. **Start Here:** Read [QUICKSTART.md](QUICKSTART.md)
2. **Setup Project:** Run Docker or setup.sh
3. **Test API:** Use [GONXT_API.postman_collection.json](GONXT_API.postman_collection.json)
4. **Learn API:** Read [README.md](README.md)
5. **Understand Architecture:** Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
6. **Deploy:** Follow [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📞 Support

### Check Logs
```bash
# Docker
docker-compose logs -f flask_app

# Systemd
sudo journalctl -u gonxt-backend -f

# File
tail -f logs/app.log
```

### Database Issues
```bash
# Check connection
psql -U gonxt_user -d gonxt_db

# With Docker
docker-compose exec postgres psql -U gonxt_user -d gonxt_db
```

### API Issues
```bash
# Health check
curl http://localhost:5000/api/health

# With authentication
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/auth/me
```

---

## ✅ Project Summary

**GONXT Backend** is a production-ready Flask API with:
- ✨ JWT authentication with role-based access
- 🔐 Secure API key management with bcrypt hashing
- 📦 PostgreSQL database with SQLAlchemy ORM
- 🐳 Full Docker support
- 📖 Comprehensive documentation
- ✅ Test suite included
- 🚀 Ready for production deployment

**Total files created:** 20
**Quick start time:** 2-5 minutes
**Documentation:** Complete with examples

---

*Last updated: 2024*
*Version: 1.0.0*
*Status: Production Ready*
