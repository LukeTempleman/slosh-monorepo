# GONXT Backend - Project Structure

## Overview

```
GONXT backend/
├── app.py                          # Application factory and initialization
├── config.py                       # Configuration for dev/prod/test
├── models.py                       # SQLAlchemy database models
├── routes.py                       # API endpoints (blueprints)
├── auth_controller.py              # Business logic for auth and API keys
├── run.py                          # Entry point
├── requirements.txt                # Python dependencies
├── Dockerfile                      # Docker image definition
├── docker-compose.yml              # Full stack setup (Flask + PostgreSQL)
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── Makefile                        # Development commands
├── README.md                       # Full documentation
├── QUICKSTART.md                   # Getting started guide
├── setup.sh                        # Linux/Mac setup script
├── setup-windows.bat               # Windows setup script
├── test_api.py                     # Test suite
└── GONXT_API.postman_collection.json  # Postman collection
```

## Architecture

### Application Factory Pattern
- **app.py**: Creates Flask app with extensions (SQLAlchemy, JWT, CORS)
- Supports multiple configurations (development, production, testing)
- Database initialized automatically on app startup

### Database Layer
- **models.py**: Two main models:
  - `User`: User accounts with password hashing
  - `APIKey`: API keys with random generation and hashing
- Uses SQLAlchemy ORM with PostgreSQL backend
- UUID primary keys for better security
- Timestamps for audit trail

### Business Logic
- **auth_controller.py**: Authentication and API key management
  - `AuthController`: User registration, login, token refresh
  - `APIKeyController`: Creating, listing, verifying API keys
  - Decorators: `@admin_required`, `@token_required` for authorization

### API Routes
- **routes.py**: Four blueprints:
  - `auth_bp`: `/api/auth/*` - User authentication and admin management
  - `apikey_bp`: `/api/keys/*` - API key operations
  - Health check: `/api/health`
  - Error handlers: 404, 500

### Configuration
- **config.py**: Three environment configurations
  - `DevelopmentConfig`: Debug enabled, local DB
  - `ProductionConfig`: Debug disabled, production DB
  - `TestingConfig`: Testing DB in memory
- Loads from environment variables via `.env`

## Key Features

### 1. User Authentication
```
Registration → Email/Username Validation → Password Hashing → DB Store
    ↓
Login → Credentials Check → JWT Token Generation → Return Tokens
    ↓
Refresh → Validate Refresh Token → New Access Token
```

### 2. API Key Management
```
Generate → Random Key (gnx_*) → Hash with bcrypt → Store Hash
    ↓
Verify → Check Against Hashes → Update last_used_at
    ↓
List → Show user's keys (hashes, not plain text)
    ↓
Delete → Remove from database
```

### 3. Security Features
- **Password Hashing**: bcrypt with salting
- **API Key Storage**: Only hashes stored, plain key shown once
- **JWT**: Signed tokens with role claims
- **Role-Based Access**: Admin, User, Viewer roles
- **CORS**: Configured for frontend access

## Data Models

### User Table
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| username | String | Unique, indexed |
| email | String | Unique, indexed |
| password_hash | String | Bcrypt hash |
| role | String | admin, user, viewer |
| is_active | Boolean | Account status |
| created_at | DateTime | Audit |
| updated_at | DateTime | Audit |

### APIKey Table
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to User |
| key_hash | String | Bcrypt hash (unique) |
| name | String | User-friendly name |
| description | Text | Optional description |
| last_used_at | DateTime | Tracking |
| is_active | Boolean | Enable/disable |
| created_at | DateTime | Audit |
| updated_at | DateTime | Audit |

## API Flow

### Login Flow
```
1. POST /api/auth/login
   ↓
2. Verify credentials against password_hash
   ↓
3. Generate JWT tokens with role claim
   ↓
4. Return access_token, refresh_token, user info
   ↓
5. Client stores tokens (access in memory, refresh in secure storage)
```

### Authenticated Request
```
1. Client sends: GET /api/keys
   Headers: Authorization: Bearer <access_token>
   ↓
2. JWT middleware validates token signature and expiration
   ↓
3. @jwt_required() decorator extracts user_id and role
   ↓
4. Route handler processes request with user_id
   ↓
5. Return protected resource (user's API keys)
```

### Admin Action
```
1. Client sends: PATCH /api/auth/admin/users/{id}/role
   Headers: Authorization: Bearer <admin_token>
   ↓
2. JWT validates admin token and extracts role claim
   ↓
3. @admin_required decorator checks role == "admin"
   ↓
4. If not admin, return 403 Forbidden
   ↓
5. If admin, execute route handler
```

## Development Workflow

### Local Development
```
1. Create venv: python -m venv venv
2. Activate: source venv/bin/activate
3. Install: pip install -r requirements.txt
4. Create .env from .env.example
5. Init DB: python -c "from app import create_app, db; ..."
6. Run: python run.py
```

### Docker Development
```
1. docker-compose up -d
2. Services start: Flask, PostgreSQL, PgAdmin
3. Access: http://localhost:5000
4. Logs: docker-compose logs -f
```

### Testing
```
1. Execute: pytest -v
2. Options:
   - --cov: Coverage report
   - -k pattern: Run specific tests
   - -x: Stop on first failure
```

## Extension Points

### Adding New Routes
1. Create route function in `routes.py`
2. Decorate with `@jwt_required()` if private
3. Register in app.py blueprint

### Adding New Models
1. Define in `models.py` with relationships
2. Create migrations or manual schema updates
3. Update Controller if needed

### Adding New Controllers
1. Create new class in `auth_controller.py` or new file
2. Implement static methods for operations
3. Import and use in routes

### Custom Decorators
```python
from functools import wraps
from flask_jwt_extended import get_jwt

def viewer_or_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        role = get_jwt().get("role")
        if role not in ["admin", "viewer"]:
            return {"error": "Access denied"}, 403
        return f(*args, **kwargs)
    return decorated
```

## Error Handling

### Standard Responses
```json
{
  "error": "Description of what went wrong"
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Server Error

## Configuration Options

### Environment Variables
| Variable | Default | Purpose |
|----------|---------|---------|
| FLASK_ENV | development | App environment |
| FLASK_DEBUG | False | Enable debug mode |
| DATABASE_URL | localhost:5432 | PostgreSQL connection |
| JWT_SECRET_KEY | change-me | JWT signing key |
| PORT | 5000 | Server port |

### JWT Settings
- Access token expires: 1 hour
- Refresh token expires: 30 days
- Algorithm: HS256 (HMAC with SHA-256)

## Deployment Checklist

- [ ] Set FLASK_ENV=production
- [ ] Set unique JWT_SECRET_KEY
- [ ] Use strong passwords
- [ ] Enable HTTPS
- [ ] Setup PostgreSQL backup
- [ ] Configure database URL
- [ ] Setup logging
- [ ] Enable CORS for frontend domain only
- [ ] Use environment variables for secrets
- [ ] Run database migrations
- [ ] Test all endpoints
- [ ] Monitor performance

## Performance Considerations

1. **Database Indexing**: API key hashes and usernames indexed
2. **JWT Caching**: Tokens validated server-side
3. **Connection Pooling**: SQLAlchemy manages connections
4. **Role-Based Caching**: Role checks in token claims
5. **Lazy Loading**: Relationships lazy-loaded by default

## Security Considerations

1. **API Key Hashing**: Only hashes stored, never plain keys
2. **Password Hashing**: Bcrypt with auto salt
3. **JWT Validation**: Signature and expiration checked
4. **CORS**: Restrict origin for production
5. **SQL Injection**: Protected by SQLAlchemy ORM
6. **Rate Limiting**: Consider adding for production

## Future Enhancements

- [ ] Rate limiting middleware
- [ ] Request logging and auditing
- [ ] Email verification for registration
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] OAuth2 integration
- [ ] API rate limiting per key
- [ ] Webhook support
- [ ] GraphQL endpoint
- [ ] Caching layer (Redis)
