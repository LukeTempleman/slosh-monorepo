# Docker Quick Reference

## START Everything
```bash
# Windows
setup-docker.bat

# Linux/Mac
bash setup-docker.sh

# Or manually
docker-compose -f docker-compose.global.yml up -d
```

## View Status
```bash
docker-compose -f docker-compose.global.yml ps
```

## View Logs
```bash
# All services
docker-compose -f docker-compose.global.yml logs -f

# Specific service
docker logs -f gonxt_flask
docker logs -f manu_flask
docker logs -f gonxt_postgres
docker logs -f manu_postgres
```

## Execute Commands in Containers

### GONXT Backend
```bash
# Run Python shell
docker exec -it gonxt_flask python

# Check database
docker exec -it gonxt_postgres psql -U gonxt_user -d gonxt_db -c "\dt"

# View app files
docker exec -it gonxt_flask ls -la
```

### Manufacturers Backend
```bash
# Run Python shell
docker exec -it manu_flask python

# Check database
docker exec -it manu_postgres psql -U slosh_user -d slosh_db -c "\dt"

# View app files
docker exec -it manu_flask ls -la
```

## Restart Services

```bash
# Restart all
docker-compose -f docker-compose.global.yml restart

# Restart single service
docker-compose -f docker-compose.global.yml restart gonxt_flask
docker-compose -f docker-compose.global.yml restart manu_flask
docker-compose -f docker-compose.global.yml restart gonxt_postgres
docker-compose -f docker-compose.global.yml restart manu_postgres
```

## Rebuild Images
```bash
# Rebuild all
docker-compose -f docker-compose.global.yml build --no-cache
docker-compose -f docker-compose.global.yml up -d

# Rebuild specific
docker-compose -f docker-compose.global.yml build --no-cache gonxt_flask
docker-compose -f docker-compose.global.yml build --no-cache manu_flask
```

## Stop Services
```bash
# Stop all (keeps data)
docker-compose -f docker-compose.global.yml stop

# Stop and remove containers
docker-compose -f docker-compose.global.yml down

# Stop and remove everything (DELETES DATA)
docker-compose -f docker-compose.global.yml down -v
```

## Database Access via PgAdmin

### GONXT Database
- URL: http://localhost:5050
- Email: admin@gonxt.local
- Password: admin@123
- Connect to: gonxt_postgres:5432

### Manufacturers Database
- URL: http://localhost:5051
- Email: admin@manu.local
- Password: admin@123
- Connect to: manu_postgres:5432

## Test Health
```bash
# GONXT
curl http://localhost:5000/api/health

# Manufacturers
curl http://localhost:5001/api/health
```

## Common Issues

### Port Already in Use
```bash
# Find what's using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # Mac/Linux

# Stop everything
docker-compose -f docker-compose.global.yml down -v

# Or change ports in docker-compose.global.yml
```

### Database Connection Failed
```bash
# Check if postgres is healthy
docker-compose -f docker-compose.global.yml ps
# STATUS should show "Up (healthy)"

# View postgres logs
docker logs gonxt_postgres
docker logs manu_postgres

# Restart postgres
docker-compose -f docker-compose.global.yml restart gonxt_postgres
docker-compose -f docker-compose.global.yml restart manu_postgres
```

### Flask App Not Starting
```bash
# View detailed logs
docker logs gonxt_flask
docker logs manu_flask

# Rebuild without cache
docker-compose -f docker-compose.global.yml build --no-cache
docker-compose -f docker-compose.global.yml up -d
```

### Cannot Connect to API
```bash
# Check if container is running
docker ps | grep flask

# View health status
docker-compose -f docker-compose.global.yml ps

# Try accessing from inside container
docker exec -it gonxt_flask curl http://localhost:5000/api/health
docker exec -it manu_flask curl http://localhost:5000/api/health
```

## Environment Files

### GONXT Backend (.env)
```
FLASK_ENV=development
DATABASE_URL=postgresql://gonxt_user:gonxt_password@gonxt_postgres:5432/gonxt_db
JWT_SECRET_KEY=gonxt-jwt-secret-key-change-in-production
ENCRYPTION_KEY=<your-fernet-key>
PORT=5000
```

### Manufacturers Backend (.env)
```
FLASK_ENV=development
FLASK_APP=run.py
JWT_SECRET_KEY=manu-jwt-secret-key-change-in-production
DATABASE_URL=postgresql://slosh_user:slosh_password@manu_postgres:5432/slosh_db
```

## Postman Testing

1. Import: `Slosh_Multi_Backend_Collection.postman_collection.json`
2. Variables auto-populate from responses
3. Test workflow:
   - Register User (GONXT)
   - Login (saves token)
   - Create API Key (generates 3 codes)
   - Verify Code (tests encryption)
   - Retrieve Codes (authenticated access)

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| GONXT API | http://localhost:5000 | Main API endpoint |
| GONXT PgAdmin | http://localhost:5050 | Database management |
| GONXT Database | localhost:5432 | PostgreSQL |
| Manu API | http://localhost:5001 | Manufacturers API |
| Manu PgAdmin | http://localhost:5051 | Database management |
| Manu Database | localhost:5433 | PostgreSQL |

## Performance Tips

```bash
# View resource usage
docker stats

# Limit CPU/Memory (in docker-compose.global.yml add to service):
# resources:
#   limits:
#     cpus: '0.5'
#     memory: 512M
#   reservations:
#     cpus: '0.25'
#     memory: 256M

# Clean up unused images/volumes
docker system prune -a
docker volume prune
```
