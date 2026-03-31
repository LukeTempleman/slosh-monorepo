# Docker Quick Start

Complete Flask PostgreSQL backend with Docker containerization.

## What's Included

✅ **Dockerfile** - Multi-stage optimized Flask image
✅ **docker-compose.yml** - Development environment (hot reload, debug mode)
✅ **docker-compose.prod.yml** - Production environment (Gunicorn, security hardened)
✅ **PostgreSQL** - Automated database setup with health checks
✅ **JWT Authentication** - Token-based security
✅ **Admin Role Protection** - Role-based access control
✅ **Volume Management** - Data persistence
✅ **Health Checks** - Automatic service monitoring
✅ **Environment Config** - Easy configuration management

## 1-Minute Start (Windows)

### Step 1: Open Terminal
```powershell
cd "c:\Users\Kat\Documents\Slosh manu backend\Backend"
```

### Step 2: Start Docker Services
```powershell
docker-compose up -d
```

### Step 3: Verify Services
```powershell
docker-compose ps
```

You should see `web` and `db` containers running.

## Testing the API

### Register Admin User
```powershell
$body = @{
    username = "admin"
    email = "admin@example.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

Invoke-WebRequest -Method POST `
  -Uri "http://localhost:5000/api/auth/register" `
  -ContentType "application/json" `
  -Body $body
```

### Login
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Method POST `
  -Uri "http://localhost:5000/api/auth/login" `
  -ContentType "application/json" `
  -Body $body

$token = ($response.Content | ConvertFrom-Json).access_token
Write-Output "Token: $token"
```

### Get Current User (Requires Token)
```powershell
$token = "YOUR_TOKEN_HERE"

Invoke-WebRequest -Method GET `
  -Uri "http://localhost:5000/api/auth/me" `
  -Headers @{Authorization = "Bearer $token"}
```

### List All Users (Admin Only)
```powershell
Invoke-WebRequest -Method GET `
  -Uri "http://localhost:5000/api/auth/admin/users" `
  -Headers @{Authorization = "Bearer $token"}
```

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f web

# Access Flask shell
docker-compose exec web flask shell

# Stop and delete data
docker-compose down -v

# Rebuild image
docker-compose build --no-cache

# Check container health
docker-compose ps

# View database logs
docker-compose logs db
```

## Using Makefile (Linux/Mac)

```bash
make help          # Show all available commands
make up            # Start development
make down          # Stop services
make logs          # View logs
make db-reset      # Reset database
make db-backup     # Backup database
make clean         # Clean files
```

## Accessing Services

- **API**: http://localhost:5000
- **PostgreSQL**: localhost:5432
  - Username: `slosh_user` (or custom from `.env`)
  - Password: `slosh_password` (or custom from `.env`)
  - Database: `slosh_db` (or custom from `.env`)

## Database Management

### Connect to Database
```bash
docker exec -it slosh_db psql -U slosh_user -d slosh_db
```

### Backup Database
```bash
docker exec slosh_db pg_dump -U slosh_user slosh_db > backup.sql
```

### Restore Database
```bash
docker exec -i slosh_db psql -U slosh_user slosh_db < backup.sql
```

### Reset Database (⚠️ Deletes all data)
```bash
docker-compose down -v
docker-compose up -d
```

## Production Deployment

### Using Production Compose
```bash
# Copy production environment
cp .env.example .env
# Edit .env with production values

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

**Key Differences**:
- Uses Gunicorn (4 workers) instead of Flask dev server
- Healthchecks enabled
- Security hardening applied
- Auto-restart on failure
- Non-root user in container

## Environment Variables

Create `.env` file or edit existing:

```env
# Flask
FLASK_ENV=development
FLASK_APP=run.py

# JWT
JWT_SECRET_KEY=change-this-to-strong-random-value

# PostgreSQL
POSTGRES_USER=slosh_user
POSTGRES_PASSWORD=slosh_password
POSTGRES_DB=slosh_db

# Database URL
DATABASE_URL=postgresql://slosh_user:slosh_password@db:5432/slosh_db
```

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Rebuild and start fresh
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Port 5000 Already in Use
```bash
# Change port in docker-compose.yml
# Change "5000:5000" to "5001:5000"
# Then restart: docker-compose up -d
```

### Database Connection Error
```bash
# Wait for DB to be healthy
docker-compose ps

# Check DB logs
docker-compose logs db

# Check DATABASE_URL in .env
```

### Container Stops Immediately
```bash
# View error logs
docker-compose logs web

# Check if port is in use
netstat -an

# Check Docker disk space
docker system df
```

## File Structure

```
Backend/
├── Dockerfile              # Container image definition
├── docker-compose.yml      # Development orchestration
├── docker-compose.prod.yml # Production orchestration
├── .dockerignore          # Files to exclude from image
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
├── Makefile               # Convenient commands
├── setup-docker.sh        # Setup script (Linux/Mac)
├── setup-docker.bat       # Setup script (Windows)
├── DEPLOYMENT.md          # Deployment guide
├── app/                   # Flask application
│   ├── __init__.py
│   ├── models.py
│   ├── routes.py
│   └── utils.py
├── config.py              # Configuration
├── run.py                 # Entry point
└── requirements.txt       # Python dependencies
```

## Next Steps

1. ✅ Docker setup complete
2. 📝 Register first admin user
3. 🔐 Update JWT_SECRET_KEY in production
4. 🚀 Deploy to your platform (Heroku, AWS, GCP, etc.)
5. 📊 Monitor logs and performance
6. 💾 Setup automated backups

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Authentication](https://tools.ietf.org/html/rfc7519)

## Support

For issues or questions, check:
1. [README.md](README.md) - Full API documentation
2. [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
3. Container logs: `docker-compose logs`
4. Check `.env` configuration

---

**Happy deploying! 🚀**
