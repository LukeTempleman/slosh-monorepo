# Deployment Guide

Complete guide for deploying the Flask PostgreSQL backend with JWT authentication.

## Quick Start with Docker

### Development

```bash
# Clone/navigate to project
cd Backend

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f web

# Stop services
docker-compose down
```

Access API at: **http://localhost:5000**

### Production

```bash
# Create .env file with secure values
cp .env.example .env
# Edit .env with production values

# Start with production compose file
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Key Files for Deployment

- **Dockerfile** - Container image definition with Python 3.11-slim
- **docker-compose.yml** - Development environment orchestration
- **docker-compose.prod.yml** - Production setup with Gunicorn and security hardening
- **requirements.txt** - Python dependencies
- **.env.example** - Environment variables template

## Environment Variables

### Required for Both Dev and Prod

```env
JWT_SECRET_KEY=<strong-random-secret-here>
POSTGRES_USER=<database-user>
POSTGRES_PASSWORD=<strong-database-password>
POSTGRES_DB=<database-name>
DATABASE_URL=postgresql://<user>:<password>@db:5432/<dbname>
```

### Development-Specific

```env
FLASK_ENV=development
DEBUG=True
```

### Production-Specific

```env
FLASK_ENV=production
DEBUG=False
```

## Deployment Platforms

### Docker (Any Platform)

**Prerequisites**: Docker and Docker Compose

**Steps**:
1. Clone repo
2. Copy `.env.example` to `.env`
3. Update `.env` with production values
4. Run: `docker-compose -f docker-compose.prod.yml up -d`

### Heroku

**With Procfile**:
```
web: gunicorn --workers 4 --bind 0.0.0.0:$PORT run:app
```

**Deploy**:
```bash
heroku create slosh-backend
heroku addons:create heroku-postgresql:standard-0
git push heroku main
heroku open
```

### AWS (ECS + RDS)

1. **Push image to ECR**:
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag slosh-backend <account-id>.dkr.ecr.<region>.amazonaws.com/slosh:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/slosh:latest
```

2. **Create RDS PostgreSQL instance**
3. **Deploy to ECS cluster**
4. **Configure security groups and load balancer**

### Google Cloud (Cloud Run + Cloud SQL)

1. **Build and push to Container Registry**:
```bash
gcloud builds submit --tag gcr.io/<project>/slosh:latest
```

2. **Deploy to Cloud Run**:
```bash
gcloud run deploy slosh \
  --image gcr.io/<project>/slosh:latest \
  --add-cloudsql-instances <project>:<region>:<instance> \
  --set-env-vars DATABASE_URL=postgresql://<user>:<pass>@/<db>
```

### DigitalOcean App Platform

1. Push code to GitHub
2. Connect repository to DigitalOcean
3. Create `app.yaml`:
```yaml
name: slosh-backend
services:
- name: web
  dockerfile_path: Dockerfile
  github:
    branch: main
    repo: username/slosh
databases:
- name: db
  engine: PG
  version: "15"
```

## Database Migrations

### Initialize Migrations
```bash
docker-compose exec web flask db init
```

### Create Migration
```bash
docker-compose exec web flask db migrate -m "Description"
```

### Apply Migration
```bash
docker-compose exec web flask db upgrade
```

## Monitoring & Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f db
```

### Database Backup
```bash
docker exec slosh_db pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql
```

### Database Restore
```bash
docker exec -i slosh_db psql -U $POSTGRES_USER $POSTGRES_DB < backup.sql
```

### Health Check
```bash
curl http://localhost:5000/api/auth/me
```

## Security Checklist

Before production deployment:

- [ ] Change `JWT_SECRET_KEY` to strong random value
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL
- [ ] Set `FLASK_ENV=production`
- [ ] Disable debug mode
- [ ] Use environment variables for all secrets
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable monitoring and logging
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Configure CORS properly

## Scaling

### Horizontal Scaling (Multiple Instances)

**Update docker-compose**:
```yaml
web:
  deploy:
    replicas: 3
  restart_policy:
    condition: on-failure
```

### Load Balancing with Nginx

Add to `docker-compose.yml`:
```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - web
```

## Troubleshooting

### Port Already in Use
```bash
# Find and stop existing container
docker ps
docker stop <container-id>
```

### Database Connection Failed
- Check container is healthy: `docker-compose ps`
- Verify DATABASE_URL environment variable
- Check database credentials
- Ensure PostgreSQL container fully started

### Migrations Not Applied
```bash
docker-compose exec web flask db upgrade
docker-compose restart web
```

### Memory Issues
```bash
# Increase Docker memory limit
# Check container stats
docker stats
```

## Performance Tips

1. Use connection pooling (SQLAlchemy default handles this)
2. Add database indexes on frequently queried fields
3. Use Gunicorn with appropriate worker count
4. Enable Flask caching for static content
5. Monitor slow queries in PostgreSQL logs
6. Consider read replicas for high-traffic apps

## Rollback Procedure

```bash
# Stop current version
docker-compose down

# Restore from backup
docker exec -i slosh_db psql -U user db < backup.sql

# Restart
docker-compose up -d
```

## Support

For issues, check:
1. Docker container logs: `docker-compose logs`
2. PostgreSQL logs in the container
3. Application error traces
4. Environment variable configuration
