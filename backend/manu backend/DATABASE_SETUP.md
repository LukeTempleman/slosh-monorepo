# Batches API - Database Setup & Migration Guide

## Database Schema

### Batch Table

```sql
CREATE TABLE batches (
    id VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL (indexed),
    quality_score FLOAT NOT NULL DEFAULT 0.0 (indexed),
    risk_level VARCHAR(20) NOT NULL DEFAULT 'low' (indexed),
    location VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP (indexed),
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER FOREIGN KEY REFERENCES users(id),
    notes TEXT,
);
```

### Table Structure

| Column | Type | Constraints | Index | Purpose |
|--------|------|-------------|-------|---------|
| id | VARCHAR(50) | PRIMARY KEY | Yes | Unique batch identifier |
| product_name | VARCHAR(255) | NOT NULL | No | Product name |
| quantity | INTEGER | NOT NULL | No | Number of units |
| status | VARCHAR(20) | NOT NULL | Yes | Filter by status |
| quality_score | FLOAT | Default: 0.0 | Yes | Filter by quality |
| risk_level | VARCHAR(20) | Default: 'low' | Yes | Filter by risk |
| location | VARCHAR(255) | Nullable | No | Geographic location |
| created_at | DATETIME | Default: NOW() | Yes | Filter by date |
| updated_at | DATETIME | Auto-update | No | Track changes |
| created_by | INTEGER | FK(users.id) | No | User reference |
| notes | TEXT | Nullable | No | Additional details |

---

## 🔧 Database Setup

### Option 1: Automatic (Recommended)

**Using Python Flask-SQLAlchemy:**

```bash
cd "manu backend"
python
```

```python
from app import create_app, db

app = create_app()
with app.app_context():
    # Create all tables defined in models
    db.create_all()
    print("✓ Tables created successfully")
```

### Option 2: Using SQL Directly

**Connect to PostgreSQL:**

```bash
docker exec -it manu_postgres psql -U slosh_user -d slosh_db
```

**Create batches table:**

```sql
CREATE TABLE IF NOT EXISTS batches (
    id VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    quality_score FLOAT NOT NULL DEFAULT 0.0,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'low',
    location VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT
);

-- Create indexes for filtering
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_quality_score ON batches(quality_score);
CREATE INDEX idx_batches_risk_level ON batches(risk_level);
CREATE INDEX idx_batches_created_at ON batches(created_at);
```

---

## 📊 Populating Sample Data

### Using Seed Script (Recommended)

```bash
cd "manu backend"
python seed_batches.py
```

**What it does:**
- Creates 30 sample batches
- Random product names  
- Random statuses and risk levels
- Random quality scores (60-100)
- Random locations
- Random creation dates (last 30 days)

**Output:**
```
✓ Created batch BN0001 - Jameson Irish Whiskey (production)
✓ Created batch BN0002 - Chivas Regal 12 Year (pending)
...
✓ Created batch BN0030 - Tanqueray Gin (completed)

✅ Successfully seeded 30 sample batches!
```

### Manual SQL Insert

```sql
INSERT INTO batches (id, product_name, quantity, status, quality_score, risk_level, location, created_at, created_by, notes)
VALUES (
    'BN0001',
    'Jameson Irish Whiskey',
    5000,
    'production',
    92.5,
    'low',
    'Johannesburg',
    TODAY(),
    1,
    'Production batch'
);
```

### Verify Data

```bash
# Check number of batches
docker exec -it manu_postgres psql -U slosh_user -d slosh_db -c "SELECT COUNT(*) FROM batches;"

# Check status distribution
docker exec -it manu_postgres psql -U slosh_user -d slosh_db -c "SELECT status, COUNT(*) FROM batches GROUP BY status;"

# Check quality scores
docker exec -it manu_postgres psql -U slosh_user -d slosh_db -c "SELECT product_name, quality_score, risk_level FROM batches ORDER BY quality_score DESC LIMIT 10;"
```

---

## 🚀 Complete Setup Walkthrough

### Step 1: Start Docker
```bash
cd backend
docker-compose -f docker-compose.global.yml up -d
docker-compose -f docker-compose.global.yml ps
# Wait for all containers to be "Up"
```

### Step 2: Create Tables
```bash
cd "manu backend"
python -c "from app import create_app, db; app = create_app(); [db.create_all() for _ in [0]].__class__.__getitem__(0)" 
# Or use interactive Python:
python << EOF
from app import create_app, db
app = create_app()
with app.app_context():
    db.create_all()
    print("✓ Tables created")
EOF
```

### Step 3: Seed Data
```bash
cd "manu backend"
python seed_batches.py
```

### Step 4: Verify Setup
```bash
cd "manu backend"
.\test_batches_api.ps1  # PowerShell on Windows
# or
python test_batches_api.py  # Python cross-platform
```

---

## 🔄 Database Maintenance

### Backup Database
```bash
# Backup to SQL file
docker exec -it manu_postgres pg_dump -U slosh_user -d slosh_db > backup.sql
```

### Restore Database
```bash
# Restore from SQL file
docker exec -i manu_postgres psql -U slosh_user -d slosh_db < backup.sql
```

### Clear Batches Table
```bash
# Remove all batches (keep schema)
docker exec -it manu_postgres psql -U slosh_user -d slosh_db -c "DELETE FROM batches;"
```

### Reset Database
```bash
# Delete database and recreate
docker exec -it manu_postgres psql -U slosh_user -c "DROP DATABASE IF EXISTS slosh_db;"
docker exec -it manu_postgres psql -U slosh_user -c "CREATE DATABASE slosh_db;"
# Then: Create tables and seed data again
```

---

## 📈 Database Optimization

### Indexes (Already Created)
```sql
-- Status filtering
CREATE INDEX idx_batches_status ON batches(status);

-- Quality score filtering
CREATE INDEX idx_batches_quality_score ON batches(quality_score);

-- Risk level filtering
CREATE INDEX idx_batches_risk_level ON batches(risk_level);

-- Date range filtering
CREATE INDEX idx_batches_created_at ON batches(created_at);
```

### Query Performance

**Without indexes:**
```
SELECT * FROM batches WHERE status = 'production';
-- Seq Scan on batches (slow with many rows)
```

**With indexes:**
```
SELECT * FROM batches WHERE status = 'production';
-- Index Scan on idx_batches_status (fast)
```

### Monitor Query Performance
```bash
docker exec -it manu_postgres psql -U slosh_user -d slosh_db -c "EXPLAIN ANALYZE SELECT * FROM batches WHERE status = 'production';"
```

---

## 🔍 Database Connection Info

### PostgreSQL Details
- **Host**: manu_postgres (Docker network) or localhost (external)
- **Port**: 5433 (external) or 5432 (Docker)
- **Database**: slosh_db
- **User**: slosh_user
- **Password**: slosh_password

### Connection String (Python/SQLAlchemy)
```
postgresql://slosh_user:slosh_password@manu_postgres:5432/slosh_db
```

### PgAdmin Access
- **URL**: http://localhost:5051
- **Email**: admin@manu.local
- **Password**: admin@123
- **Server**: manu_postgres
- **Port**: 5432

---

## ✅ Verification Checklist

- [ ] Container running: `docker ps | grep manu_`
- [ ] Can connect to database: `docker exec -it manu_postgres psql -U slosh_user -d slosh_db -c "\dt"`
- [ ] Batches table exists: `SELECT * FROM batches LIMIT 1;`
- [ ] Sample data loaded: `SELECT COUNT(*) FROM batches;` returns > 0
- [ ] API returns data: `GET /api/batches` returns 200 OK
- [ ] Filtering works: `GET /api/batches?status=production` filters correctly

---

## 🆘 Common Issues

### Error: "batches" table does not exist

```bash
# Solution: Create tables
python << EOF
from app import create_app, db
app = create_app()
with app.app_context():
    db.create_all()
EOF
```

### Error: Database connection refused

```bash
# Check if PostgreSQL is running
docker exec -it manu_postgres pg_isready -U slosh_user

# If not running, start it
docker-compose -f docker-compose.global.yml restart manu_postgres
```

### Error: No batches returned

```bash
# Check if data exists
docker exec -it manu_postgres psql -U slosh_user -d slosh_db -c "SELECT COUNT(*) FROM batches;"

# If empty, seed data
python seed_batches.py
```

### Error: Permission denied

```bash
# Usually permissions on seed script
chmod +x seed_batches.py
python seed_batches.py
```

---

## 📊 Sample Data Statistics

After seeding, you should see:

```
Total batches: 30
Status distribution:
- pending: ~7-8 batches
- production: ~7-8 batches
- completed: ~7-8 batches
- rejected: ~7-8 batches

Risk level distribution:
- low: ~10 batches
- medium: ~10 batches
- high: ~10 batches

Quality score range: 60.0 - 99.8%
Date range: Last 30 days
```

---

## 🔐 Data Privacy

### Don't include in backups
- User passwords (already hashed)
- API keys (store separately)
- Sensitive business data (encrypt at application level)

### Enable backups
```bash
# Automatic daily backup
docker exec -it manu_postgres pg_dump -U slosh_user -d slosh_db | gzip > /backups/slosh_db_$(date +%Y%m%d).sql.gz
```

---

**Database setup complete!** Proceed to API testing: `test_batches_api.ps1`
