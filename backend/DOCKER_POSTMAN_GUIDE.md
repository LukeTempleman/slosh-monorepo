# Multi-Backend Docker & Postman Setup Guide

## Overview

This guide will help you run both the GONXT backend and Manufacturers backend using Docker, along with a comprehensive Postman collection to test all endpoints.

**Ports:**
- **GONXT Backend**: http://localhost:5000
- **GONXT PgAdmin**: http://localhost:5050
- **GONXT Database**: localhost:5432
- **Manufacturers Backend**: http://localhost:5001
- **Manufacturers PgAdmin**: http://localhost:5051
- **Manufacturers Database**: localhost:5433

---

## Prerequisites

1. **Docker & Docker Compose** installed
2. **Postman** installed (or use web version at https://www.postman.com)
3. Both backend directories present:
   - `GONXT backend/`
   - `manu backend/`

---

## Docker Setup

### 1. Run Both Backends

From the root directory (`Slosh manu backend/`):

```bash
docker-compose -f docker-compose.global.yml up -d
```

### 2. Verify Services Are Running

```bash
docker-compose -f docker-compose.global.yml ps
```

Expected output:
```
CONTAINER ID   IMAGE              COMMAND            PORTS                     STATUS
...            gonxt_flask        python run.py      0.0.0.0:5000->5000/tcp   Up 2 min
...            gonxt_postgres     postgres           0.0.0.0:5432->5432/tcp   Up 2 min
...            gonxt_pgadmin      pgadmin            0.0.0.0:5050->80/tcp     Up 2 min
...            manu_flask         python run.py      0.0.0.0:5001->5000/tcp   Up 2 min
...            manu_postgres      postgres           0.0.0.0:5433->5432/tcp   Up 2 min
...            manu_pgadmin       pgadmin            0.0.0.0:5051->80/tcp     Up 2 min
```

### 3. View Logs

For GONXT backend:
```bash
docker logs -f gonxt_flask
```

For Manufacturers backend:
```bash
docker logs -f manu_flask
```

For all services:
```bash
docker-compose -f docker-compose.global.yml logs -f
```

### 4. Access Databases

**GONXT Database:**
- PgAdmin: http://localhost:5050
- Login: admin@gonxt.local / admin@123
- Host: gonxt_postgres
- Database: gonxt_db

**Manufacturers Database:**
- PgAdmin: http://localhost:5051
- Login: admin@manu.local / admin@123
- Host: manu_postgres
- Database: slosh_db

### 5. Stop Services

```bash
docker-compose -f docker-compose.global.yml down
```

To clean up volumes (careful - deletes data):
```bash
docker-compose -f docker-compose.global.yml down -v
```

---

## Postman Setup

### 1. Import Collection

1. Open Postman
2. Click **Import** (top-left)
3. Select **Upload Files**
4. Choose `Slosh_Multi_Backend_Collection.postman_collection.json`

### 2. Environment Variables

The collection uses these variables (auto-populated):

| Variable | Purpose |
|----------|---------|
| `gonxt_url` | GONXT backend URL (http://localhost:5000) |
| `manu_url` | Manufacturers backend URL (http://localhost:5001) |
| `gonxt_access_token` | JWT token for GONXT (auto-set after login) |
| `manu_access_token` | JWT token for Manufacturers (auto-set after login) |
| `gonxt_api_key_id` | Created API key ID (auto-set) |
| `gonxt_api_code` | Original API code (auto-set) |
| `gonxt_api_manu_code` | Manufacturers encrypted code (auto-set) |
| `gonxt_api_verify_code` | API verification code (auto-set) |

---

## Testing Workflow

### 1. GONXT Backend Flow

#### a. Register User
```
POST {{gonxt_url}}/api/auth/register
Body:
{
  "username": "admin",
  "email": "admin@gonxt.com",
  "password": "admin@123",
  "role": "admin"
}
```

#### b. Login
```
POST {{gonxt_url}}/api/auth/login
Body:
{
  "username": "admin",
  "password": "admin@123"
}
```
✅ **Auto-saves**: `gonxt_access_token` and `gonxt_refresh_token`

#### c. Create API Key (Dual Encryption)
```
POST {{gonxt_url}}/api/keys
Headers: Authorization: Bearer {{gonxt_access_token}}
Body:
{
  "name": "Payment Processing Key",
  "description": "Key for payment system integration"
}
```

Returns:
```json
{
  "id": "550e8400-...",
  "code": "hello",                           // Original
  "manufacturers_code": "desk",              // Encrypted for DB
  "api_verification_code": "polar bear",     // Encrypted for API
  "message": "✓ Codes created and stored in database. Retrieve with authentication."
}
```

✅ **Auto-saves**: `gonxt_api_key_id`, `gonxt_api_code`, `gonxt_api_manu_code`, `gonxt_api_verify_code`

#### d. Verify Code (Public - No Auth Required)
```
POST {{gonxt_url}}/api/keys/verify
Body:
{
  "code": "{{gonxt_api_verify_code}}"
}
```

Response:
```json
{
  "verified": true,
  "code": "hello",
  "user_id": "550e8400-...",
  "key_name": "Payment Processing Key"
}
```

#### e. Get All Codes (Authenticated)
```
GET {{gonxt_url}}/api/keys/{{gonxt_api_key_id}}/codes
Headers: Authorization: Bearer {{gonxt_access_token}}
```

Returns all three codes with storage info:
```json
{
  "id": "550e8400-...",
  "name": "Payment Processing Key",
  "code": "hello",
  "code_encrypted_db": "desk",
  "code_encrypted_api": "polar bear",
  "storage_info": {
    "all_three_codes_stored": true,
    "code": "Original code (for reference)",
    "code_encrypted_db": "For manufacturers database",
    "code_encrypted_api": "For API verification requests"
  }
}
```

#### f. List Keys
```
GET {{gonxt_url}}/api/keys
Headers: Authorization: Bearer {{gonxt_access_token}}
```

### 2. Manufacturers Backend Flow

#### a. Register User
```
POST {{manu_url}}/api/auth/register
Body:
{
  "username": "manu_admin",
  "email": "admin@manu.com",
  "password": "admin@123"
}
```

#### b. Login
```
POST {{manu_url}}/api/auth/login
Body:
{
  "username": "manu_admin",
  "password": "admin@123"
}
```

✅ **Auto-saves**: `manu_access_token` and `manu_refresh_token`

#### c. Set Secret Key
```
POST {{manu_url}}/api/auth/me/secret-key
Headers: Authorization: Bearer {{manu_access_token}}
Body:
{
  "secret": "my-custom-secret-key-123"
}
```

#### d. Get Secret Key
```
GET {{manu_url}}/api/auth/me/secret-key
Headers: Authorization: Bearer {{manu_access_token}}
```

#### e. Generate Custom Secret Key
```
POST {{manu_url}}/api/auth/me/secret-key/generate
Headers: Authorization: Bearer {{manu_access_token}}
```

---

## Integration Test: Complete Dual Encryption Flow

Use the **"Integration Tests"** folder in Postman to test the complete flow:

1. ✅ GONXT: Login
2. ✅ GONXT: Create API Key (generates 3 codes)
3. ✅ GONXT: Verify Code (uses API verification code)
4. ✅ GONXT: Retrieve All Three Codes

All requests auto-populate tokens and IDs!

---

## Common Commands

### Check Health
```bash
curl http://localhost:5000/api/health
curl http://localhost:5001/api/health
```

### View Database

**GONXT tables:**
```bash
docker exec gonxt_postgres psql -U gonxt_user -d gonxt_db -c "\dt"
```

**Manufacturers tables:**
```bash
docker exec manu_postgres psql -U slosh_user -d slosh_db -c "\dt"
```

### Restart Single Service
```bash
docker-compose -f docker-compose.global.yml restart gonxt_flask
docker-compose -f docker-compose.global.yml restart manu_flask
```

### Rebuild Images
```bash
docker-compose -f docker-compose.global.yml build --no-cache
docker-compose -f docker-compose.global.yml up -d
```

---

## Troubleshooting

### 1. Ports Already in Use

If you get "port already allocated":
```bash
# Kill the existing container
docker-compose -f docker-compose.global.yml down
docker system prune -a
```

Or use different ports in `docker-compose.global.yml`.

### 2. Database Connection Issues

Check if Postgres is healthy:
```bash
docker-compose -f docker-compose.global.yml ps
# STATUS should show "Up" with healthy status
```

If not healthy, restart:
```bash
docker-compose -f docker-compose.global.yml restart gonxt_postgres
docker-compose -f docker-compose.global.yml restart manu_postgres
```

### 3. Postman Auth Issues

If tokens aren't auto-saving:
1. Check that requests have the **Test** script enabled
2. In requests with test scripts, click **Run** instead of **Send**
3. Or manually copy tokens to environment variables

### 4. App Won't Start

Check logs:
```bash
docker logs gonxt_flask
docker logs manu_flask
```

Common issues:
- Database not ready: Usually resolves after 10 seconds
- Wrong environment variables: Check docker-compose.global.yml
- Port conflicts: See "Ports Already in Use" above

---

## Directory Structure

```
Slosh manu backend/
├── docker-compose.global.yml          ← Use this!
├── Slosh_Multi_Backend_Collection.postman_collection.json  ← Import this!
├── GONXT backend/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   ├── run.py
│   ├── config.py
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── utils/
│   └── docs/
├── manu backend/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   ├── run.py
│   ├── config.py
│   └── app/
└── README.md (this file)
```

---

## Key Features

### GONXT Backend (Port 5000)
- ✅ User registration & JWT authentication
- ✅ Role-based access control (admin, user, viewer)
- ✅ Dual-encryption API key generation
- ✅ Three code versions (original, DB encrypted, API encrypted)
- ✅ Public code verification endpoint
- ✅ Authenticated code retrieval
- ✅ Admin user management

### Manufacturers Backend (Port 5001)
- ✅ User registration & JWT authentication
- ✅ Secret key management (personal)
- ✅ Admin secret key management
- ✅ User role management
- ✅ User status management

### Databases
- ✅ Separate PostgreSQL databases
- ✅ Automatic schema initialization
- ✅ PgAdmin for both databases
- ✅ Health checks configured

---

## Next Steps

1. **Run containers**: `docker-compose -f docker-compose.global.yml up -d`
2. **Import Postman collection**: `Slosh_Multi_Backend_Collection.postman_collection.json`
3. **Test GONXT backend**: Follow "Testing Workflow" → "GONXT Backend Flow"
4. **Test Manufacturers backend**: Follow "Testing Workflow" → "Manufacturers Backend Flow"
5. **Test integration**: Run "Integration Tests" folder in Postman

---

## Documentation

For detailed API documentation, see:
- GONXT Backend: `GONXT backend/docs/DUAL_ENCRYPTION.md`
- GONXT Backend: `GONXT backend/docs/ENCRYPTION_QUICKSTART.md`
- Manufacturers Backend: `manu backend/POSTMAN_GUIDE.md`

---

**Happy testing!** 🚀
