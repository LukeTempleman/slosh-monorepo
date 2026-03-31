# Docker Setup - Complete Guide

## 🚀 Quick Start (60 seconds)

### Option 1: Automated Setup
```bash
# Windows
setup-docker.bat

# Linux/Mac
bash setup-docker.sh
```

### Option 2: Manual Setup
```bash
docker-compose -f docker-compose.global.yml up -d
```

### Option 3: With Validation
```bash
# Windows
validate-docker.bat

# Linux/Mac
bash validate-docker.sh
```

---

## ✅ What Gets Started

| Service | URL | Port | Purpose |
|---------|-----|------|---------|
| GONXT Flask API | http://localhost:5000 | 5000 | Main API endpoint |
| GONXT PostgreSQL | localhost | 5432 | Database |
| GONXT PgAdmin | http://localhost:5050 | 5050 | Database management |
| Manufacturers Flask API | http://localhost:5001 | 5001 | Manufacturers backend |
| Manufacturers PostgreSQL | localhost | 5433 | Database |
| Manufacturers PgAdmin | http://localhost:5051 | 5051 | Database management |

---

## 📋 Prerequisites

- **Docker** (18.09+)
- **Docker Compose** (1.25+)
- **Windows**: WSL 2 or Docker Desktop
- **4 GB RAM** minimum (8 GB recommended)
- **1 GB disk space** minimum

Check versions:
```bash
docker --version
docker-compose --version
```

---

## 🔧 Files Overview

### Configuration Files
- **docker-compose.global.yml** - Main compose file (runs both backends)
- **GONXT backend/.env** - GONXT configuration
- **manu backend/.env** - Manufacturers configuration

### Setup Scripts
- **setup-docker.bat** - Windows automated setup
- **setup-docker.sh** - Linux/Mac automated setup
- **validate-docker.bat** - Windows health check
- **validate-docker.sh** - Linux/Mac health check

### Reference
- **DOCKER_QUICK_REFERENCE.md** - Common commands
- **DOCKER_POSTMAN_GUIDE.md** - Full testing guide
- **GONXT backend/docs/** - API documentation

---

## 📱 Using Postman

### 1. Import Collection
1. Open Postman
2. Click **Import**
3. Select `Slosh_Multi_Backend_Collection.postman_collection.json`

### 2. Auto-Features
- ✅ Variables auto-populate from responses
- ✅ Tokens saved automatically after login
- ✅ API key IDs stored for retrieval requests
- ✅ All three encryption codes extracted

### 3. Test Flow
```
1. Register User (GONXT)
   ↓
2. Login (token auto-saved)
   ↓
3. Create API Key (generates 3 codes)
   ↓
4. Verify Code (public endpoint)
   ↓
5. Retrieve Codes (authenticated endpoint)
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              Docker Compose Network                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │        GONXT Backend Network                 │   │
│  ├──────────────────────────────────────────────┤   │
│  │ ┌─────────────┐      ┌──────────────────┐   │   │
│  │ │   Flask     │      │    PostgreSQL    │   │   │
│  │ │  (Port 5000)├─────→│    (Port 5432)   │   │   │
│  │ └─────────────┘      └──────────────────┘   │   │
│  │                                              │   │
│  │  ┌──────────────────┐                       │   │
│  │  │    PgAdmin       │                       │   │
│  │  │  (Port 5050)     │                       │   │
│  │  └──────────────────┘                       │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │     Manufacturers Backend Network            │   │
│  ├──────────────────────────────────────────────┤   │
│  │ ┌─────────────┐      ┌──────────────────┐   │   │
│  │ │   Flask     │      │    PostgreSQL    │   │   │
│  │ │  (Port 5001)├─────→│    (Port 5433)   │   │   │
│  │ └─────────────┘      └──────────────────┘   │   │
│  │                                              │   │
│  │  ┌──────────────────┐                       │   │
│  │  │    PgAdmin       │                       │   │
│  │  │  (Port 5051)     │                       │   │
│  │  └──────────────────┘                       │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Key Features:**
- ✅ Separate networks (gonxt_network, manu_network)
- ✅ Independent PostgreSQL instances
- ✅ Health checks on all services
- ✅ Auto-restart on failure
- ✅ Volume persistence for databases

---

## 📊 Database Access

### GONXT Database

**Via PgAdmin:**
- URL: http://localhost:5050
- Email: `admin@gonxt.local`
- Password: `admin@123`
- Server: `gonxt_postgres`
- Port: `5432`

**Via CLI:**
```bash
docker exec -it gonxt_postgres psql -U gonxt_user -d gonxt_db
```

### Manufacturers Database

**Via PgAdmin:**
- URL: http://localhost:5051
- Email: `admin@manu.local`
- Password: `admin@123`
- Server: `manu_postgres`
- Port: `5432`

**Via CLI:**
```bash
docker exec -it manu_postgres psql -U slosh_user -d slosh_db
```

---

## 🛠️ Common Tasks

### View Logs
```bash
# All services
docker-compose -f docker-compose.global.yml logs -f

# Specific service
docker logs -f gonxt_flask
docker logs -f manu_flask
```

### Restart Services
```bash
# All services
docker-compose -f docker-compose.global.yml restart

# Single service
docker-compose -f docker-compose.global.yml restart gonxt_flask
```

### Stop Services
```bash
# Stop (keeps data)
docker-compose -f docker-compose.global.yml stop

# Stop and remove containers (keeps data)
docker-compose -f docker-compose.global.yml down

# Complete cleanup (DELETES DATA)
docker-compose -f docker-compose.global.yml down -v
```

### Rebuild Images
```bash
# Full rebuild
docker-compose -f docker-compose.global.yml build --no-cache
docker-compose -f docker-compose.global.yml up -d

# Specific service
docker-compose -f docker-compose.global.yml build --no-cache gonxt_flask
```

---

## 🔍 Troubleshooting

### Services Not Starting

**Check logs:**
```bash
docker logs gonxt_flask
docker logs manu_flask
```

**Wait for database:**
```bash
# Databases take 10-15 seconds to initialize
docker-compose -f docker-compose.global.yml ps
# Wait for STATUS to show "Up" with healthy indicator
```

### Port Already in Use

```bash
# Find what's using the port
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # Mac/Linux

# Stop everything and restart
docker-compose -f docker-compose.global.yml down -v
docker-compose -f docker-compose.global.yml up -d
```

### Database Connection Failed

```bash
# Restart just the databases
docker-compose -f docker-compose.global.yml restart gonxt_postgres
docker-compose -f docker-compose.global.yml restart manu_postgres

# Wait 30 seconds for recovery
```

### API Not Responding

```bash
# Check container is running
docker ps | grep flask

# Try from inside container
docker exec -it gonxt_flask curl http://localhost:5000/api/health

# Check logs
docker logs -f gonxt_flask
```

### Postman Getting 502 Bad Gateway

This usually means the Flask app hasn't finished initializing. Wait 10 seconds and retry.

---

## 🔐 Environment Variables

### GONXT Backend (.env)
```bash
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=postgresql://gonxt_user:gonxt_password@gonxt_postgres:5432/gonxt_db
JWT_SECRET_KEY=gonxt-jwt-secret-key-change-in-production
ENCRYPTION_KEY=<your-fernet-key>
PORT=5000
```

### Manufacturers Backend (.env)
```bash
FLASK_ENV=development
FLASK_APP=run.py
JWT_SECRET_KEY=manu-jwt-secret-key-change-in-production
DATABASE_URL=postgresql://slosh_user:slosh_password@manu_postgres:5432/slosh_db
```

---

## 🚢 Production Deployment

For production, update:

1. **Environment variables** in .env files:
   ```bash
   FLASK_ENV=production
   FLASK_DEBUG=False
   JWT_SECRET_KEY=<strong-random-key>
   ENCRYPTION_KEY=<secure-fernet-key>
   ```

2. **docker-compose.global.yml**:
   - Add resource limits
   - Enable HTTPS/SSL
   - Add backup volumes
   - Configure logging
   - Set healthcheck timeouts

3. **Database**:
   - Enable backups
   - Set up replication
   - Configure authentication
   - Monitor connections

See **DEPLOYMENT.md** in each backend directory for details.

---

## 📚 Additional Resources

- **DOCKER_QUICK_REFERENCE.md** - Common Docker commands
- **DOCKER_POSTMAN_GUIDE.md** - Complete Postman testing guide
- **GONXT backend/docs/DUAL_ENCRYPTION.md** - API key encryption details
- **GONXT backend/docs/ENCRYPTION_QUICKSTART.md** - 5-minute quick start
- **manu backend/POSTMAN_GUIDE.md** - Manufacturers API guide

---

## ⏱️ Expected Startup Times

```
Step 1: Build images              5-15 seconds
Step 2: Start containers          3-5 seconds
Step 3: PostgreSQL startup        15-30 seconds
Step 4: Flask app startup         10-20 seconds
Step 5: Database initialization  5-10 seconds

Total:                            40-80 seconds
```

If services aren't ready after 2 minutes, check logs:
```bash
docker-compose -f docker-compose.global.yml logs
```

---

## 🎯 Testing Checklist

- [ ] `docker-compose -f docker-compose.global.yml up -d` succeeds
- [ ] All 6 containers show "Up" status
- [ ] http://localhost:5000/api/health returns 200
- [ ] http://localhost:5001/api/health returns 200
- [ ] Postman collection imports successfully
- [ ] Register endpoint creates user
- [ ] Login endpoint returns JWT token
- [ ] Create API Key endpoint returns 3 codes
- [ ] Verify Code endpoint decrypts successfully
- [ ] Get Codes endpoint returns all 3 codes

---

## 🆘 Need Help?

**Check logs first:**
```bash
docker-compose -f docker-compose.global.yml logs -f
```

**Run validation:**
```bash
# Windows
validate-docker.bat

# Linux/Mac
bash validate-docker.sh
```

**Still stuck?**
- Review DOCKER_QUICK_REFERENCE.md for commands
- Check backend documentation in `docs/` folders
- Verify .env files are properly configured
- Ensure ports 5000, 5001, 5432, 5433 aren't in use

---

**Happy testing!** 🎉
