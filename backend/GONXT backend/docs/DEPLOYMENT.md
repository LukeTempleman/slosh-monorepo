# GONXT Backend - Deployment Guide

## Production Deployment

### Prerequisites
- Ubuntu 20.04 LTS or similar Linux
- Docker and Docker Compose
- PostgreSQL 13+ (or use managed database)
- Nginx (reverse proxy)
- SSL certificate (Let's Encrypt)

---

## Option 1: Docker Compose (Recommended)

### Setup

1. **Clone repository**
   ```bash
   git clone <repository> gonxt-backend
   cd gonxt-backend
   ```

2. **Create production .env**
   ```bash
   cat > .env.prod << EOF
   FLASK_ENV=production
   FLASK_DEBUG=False
   SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')
   JWT_SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')
   DATABASE_URL=postgresql://gonxt_prod:$(python -c 'import secrets; print(secrets.token_urlsafe(16))')@postgres:5432/gonxt_prod
   PORT=5000
   EOF
   ```

3. **Update docker-compose.yml for production**
   ```yaml
   environment:
     FLASK_ENV: production
     FLASK_DEBUG: "False"
     DATABASE_URL: postgresql://gonxt_prod:password@postgres:5432/gonxt_prod
     JWT_SECRET_KEY: your-secure-secret-key
   ports:
     - "5000:5000"  # Only expose internally, use Nginx
   ```

4. **Start services**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

5. **Verify services**
   ```bash
   docker-compose ps
   docker-compose logs -f flask_app
   ```

### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U gonxt_prod gonxt_prod > backup.sql

# Restore
docker-compose exec -T postgres psql -U gonxt_prod gonxt_prod < backup.sql
```

---

## Option 2: Gunicorn + Nginx

### Install Dependencies
```bash
sudo apt-get update
sudo apt-get install -y python3.11 python3.11-venv postgresql postgresql-contrib nginx
```

### Setup Application

1. **Create app directory**
   ```bash
   sudo mkdir -p /var/www/gonxt-backend
   cd /var/www/gonxt-backend
   ```

2. **Clone and setup**
   ```bash
   git clone <repo> .
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   ```

3. **Create production .env**
   ```bash
   cat > .env << EOF
   FLASK_ENV=production
   DATABASE_URL=postgresql://gonxt_user:STRONG_PASSWORD@localhost/gonxt_prod
   JWT_SECRET_KEY=SECURE_SECRET_KEY
   EOF
   chmod 600 .env
   ```

4. **Initialize database**
   ```bash
   python -c "from app import create_app, db; app = create_app(); db.create_all()"
   ```

### Systemd Service

Create `/etc/systemd/system/gonxt-backend.service`:
```ini
[Unit]
Description=GONXT Backend Flask Application
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/gonxt-backend
Environment="PATH=/var/www/gonxt-backend/venv/bin"
EnvironmentFile=/var/www/gonxt-backend/.env
ExecStart=/var/www/gonxt-backend/venv/bin/gunicorn \
    --workers 4 \
    --worker-class sync \
    --bind 127.0.0.1:5000 \
    --access-logfile /var/log/gonxt/access.log \
    --error-logfile /var/log/gonxt/error.log \
    --log-level info \
    app:app

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo mkdir -p /var/log/gonxt
sudo chown www-data:www-data /var/log/gonxt
sudo systemctl enable gonxt-backend
sudo systemctl start gonxt-backend
sudo systemctl status gonxt-backend
```

### Nginx Configuration

Create `/etc/nginx/sites-available/gonxt-backend`:
```nginx
upstream gonxt_backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates from Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client upload size
    client_max_body_size 10M;

    # Logging
    access_log /var/log/nginx/gonxt_access.log;
    error_log /var/log/nginx/gonxt_error.log;

    # Proxy settings
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    location / {
        proxy_pass http://gonxt_backend;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    location /static/ {
        alias /var/www/gonxt-backend/static/;
        expires 30d;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/gonxt-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Setup SSL (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot renew --dry-run  # Test auto-renewal
```

---

## PostgreSQL Configuration

### Production Settings
```sql
-- Connect as admin
psql -U postgres

-- Create user and database
CREATE ROLE gonxt_prod WITH LOGIN PASSWORD 'VERY_STRONG_PASSWORD';
CREATE DATABASE gonxt_prod OWNER gonxt_prod;

-- Limit connections
ALTER ROLE gonxt_prod CONNECTION LIMIT 50;

-- Grant permissions
GRANT CONNECT ON DATABASE gonxt_prod TO gonxt_prod;
GRANT ALL PRIVILEGES ON DATABASE gonxt_prod TO gonxt_prod;
```

### Backup Strategy
```bash
#!/bin/bash
# /home/backups/backup-gonxt.sh

BACKUP_DIR="/home/backups/gonxt"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Daily backup
pg_dump -U gonxt_prod -h localhost gonxt_prod | \
    gzip > $BACKUP_DIR/gonxt_$TIMESTAMP.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to cloud (optional)
# aws s3 cp $BACKUP_DIR/gonxt_$TIMESTAMP.sql.gz s3://backup-bucket/
```

Add to crontab:
```bash
0 2 * * * /home/backups/backup-gonxt.sh  # Daily at 2 AM
```

---

## Monitoring and Logging

### Application Logs
```bash
# With Systemd
sudo journalctl -u gonxt-backend -f

# With Docker
docker-compose logs -f flask_app
```

### Performance Monitoring
```bash
# Monitor resources
watch -n 1 'ps aux | grep gunicorn'

# Check database connections
sudo -u postgres psql -d gonxt_prod -c "SELECT count(*) FROM pg_stat_activity;"
```

### Setup Log Aggregation
```bash
# Using rsyslog
echo "
# Send Flask logs to /var/log/gonxt/app.log
:programname, isequal, \"flask\" /var/log/gonxt/app.log
" | sudo tee -a /etc/rsyslog.d/50-gonxt.conf

sudo systemctl restart rsyslog
```

---

## Security Hardening

### 1. Firewall
```bash
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL (internal only)
```

### 2. Application Security
```bash
# CORS configuration in config.py
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST", "PATCH", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

### 3. Rate Limiting
```bash
pip install Flask-Limiter

# In app.py
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)

@login.route("/api/auth/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    ...
```

### 4. Environment Secrets
```bash
# Use environment variables, never hardcode
export JWT_SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')
export DATABASE_PASSWORD=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')

# Verify
echo $JWT_SECRET_KEY
```

---

## Health Checks

### Monitoring Script
```bash
#!/bin/bash
# /home/scripts/health-check.sh

API_URL="https://yourdomain.com/api/health"
ALERT_EMAIL="ops@example.com"

response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ "$response" != "200" ]; then
    mail -s "GONXT Backend Alert" $ALERT_EMAIL << EOF
    API returned HTTP $response
    Timestamp: $(date)
EOF
fi
```

Add to crontab:
```bash
*/5 * * * * /home/scripts/health-check.sh  # Every 5 minutes
```

---

## Scaling

### Horizontal Scaling (Multiple Servers)

1. **Load Balancer Setup**
   ```nginx
   upstream gonxt_backend {
       least_conn;
       server gonxt1.internal:5000;
       server gonxt2.internal:5000;
       server gonxt3.internal:5000;
   }
   ```

2. **Shared Database**
   - Use managed PostgreSQL (AWS RDS, Azure Database, etc.)
   - All instances connect to same database
   - Migration: single instance performs migrations

3. **Session Management**
   - JWT tokens don't require server-side sessions
   - API keys verified against database
   - No session affinity needed

### Vertical Scaling (Single Server)

1. **Gunicorn Workers**
   ```bash
   # In systemd service
   --workers $(nproc)  # Use CPU count
   ```

2. **Database Connection Pool**
   ```python
   SQLALCHEMY_ENGINE_OPTIONS = {
       "pool_size": 20,
       "pool_recycle": 3600,
       "pool_pre_ping": True,
   }
   ```

---

## Troubleshooting

### 502 Bad Gateway
```bash
# Check Gunicorn status
sudo systemctl status gonxt-backend
sudo journalctl -u gonxt-backend -n 50

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Refused
```bash
# Check PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -d gonxt_prod -c "SELECT 1"

# Test connection
psql -U gonxt_prod -h localhost -d gonxt_prod
```

### High Memory Usage
```bash
# Restart Gunicorn
sudo systemctl restart gonxt-backend

# Check for memory leaks
ps aux | grep gunicorn
```

---

## Rollback Procedure

1. **Keep previous version**
   ```bash
   git tag -a v1.0.0-prod -m "Production release"
   git push origin v1.0.0-prod
   ```

2. **Quick rollback**
   ```bash
   git checkout v1.0.0-prod
   ./venv/bin/pip install -r requirements.txt
   sudo systemctl restart gonxt-backend
   ```

---

## Checklist

- [ ] Production `.env` created with strong secrets
- [ ] SSL certificate installed and configured
- [ ] PostgreSQL backup strategy implemented
- [ ] Firewall configured
- [ ] Health checks setup
- [ ] Logging configured
- [ ] Monitoring enabled
- [ ] CORS restricted to frontend domain
- [ ] Rate limiting enabled
- [ ] Database optimized
- [ ] Application tested on production setup
- [ ] Rollback procedure documented
- [ ] Team notified of changes
- [ ] Monitoring alerts configured
