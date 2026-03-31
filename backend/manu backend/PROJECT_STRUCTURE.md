# Project Structure Guide

## Current Directory Layout

```
Backend/
├── app/
│   ├── controllers/           # Business logic controllers
│   │   ├── __init__.py
│   │   └── auth_controller.py
│   ├── models/               # Database models
│   │   ├── __init__.py
│   │   └── user.py
│   ├── routes/               # API routes/endpoints
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── utils/                # Utility functions & decorators
│   │   ├── __init__.py
│   │   └── decorators.py
│   └── __init__.py           # App factory
├── config.py                 # Application configuration
├── run.py                    # Entry point
├── requirements.txt          # Dependencies
├── Dockerfile               # Docker image definition
├── docker-compose.yml       # Development environment
├── docker-compose.prod.yml  # Production environment
├── Makefile                 # Convenient commands
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── .dockerignore           # Docker ignore rules
├── README.md               # Full documentation
├── DEPLOYMENT.md           # Deployment guide
└── DOCKER.md               # Docker quick start
```

## Architecture Explanation

### Controllers (`app/controllers/`)
- Contains business logic for different features
- Methods handle request processing and return responses
- Examples: `AuthController`, `UserController`
- **File**: `auth_controller.py`

### Models (`app/models/`)
- Defines database schema using SQLAlchemy ORM
- Contains model classes: `User`
- Manages relationships between tables
- **Files**: `user.py`

### Routes (`app/routes/`)
- Defines API endpoints and routes
- Maps HTTP methods to controller methods
- Applies decorators (auth, admin checks)
- **Files**: `auth.py`

### Utils (`app/utils/`)
- Reusable utility functions and decorators
- Authentication decorators: `@login_required`, `@admin_required`
- **Files**: `decorators.py`

### App Factory (`app/__init__.py`)
- Initializes Flask app
- Configures extensions (SQLAlchemy, JWT)
- Registers blueprints
- Creates database tables

## Adding New Features

### Example: Adding a Product Module

1. **Create model** `app/models/product.py`:
```python
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
```

2. **Create controller** `app/controllers/product_controller.py`:
```python
class ProductController:
    @staticmethod
    def list_products():
        products = Product.query.all()
        return jsonify([p.to_dict() for p in products]), 200
```

3. **Create routes** `app/routes/product.py`:
```python
product_bp = Blueprint('product', __name__)

@product_bp.route('/', methods=['GET'])
def list_products():
    return ProductController.list_products()
```

4. **Register in** `app/__init__.py`:
```python
from app.routes import product_bp
app.register_blueprint(product_bp, url_prefix='/api/products')
```

5. **Update models** `app/models/__init__.py`:
```python
from app.models.product import Product
__all__ = ['User', 'Product']
```

## Import Patterns

### In Controllers
```python
from app import db
from app.models import User
from flask import request, jsonify
```

### In Routes
```python
from flask import Blueprint
from app.controllers import AuthController
from app.utils.decorators import login_required
```

### In Models
```python
from app import db
from datetime import datetime
```

## Best Practices

1. **Controllers** - Keep business logic separate from routes
2. **Models** - Only define data structure and relationships
3. **Routes** - Only map endpoints to controllers
4. **Utils** - Keep reusable code (decorators, helpers)
5. **Configuration** - All config in `config.py`
6. **Imports** - Use relative imports within the app package
7. **Blueprints** - Organize routes by feature/module

## Testing Structure (Recommended)

```
tests/
├── __init__.py
├── test_auth.py
├── test_models.py
├── test_controllers.py
└── conftest.py
```

## Common Commands

```bash
# Run app
python run.py

# Access Flask shell with models
python -c "from app import create_app, db; from app.models import User; app = create_app(); app.app_context().push()"

# Docker
docker-compose up -d
docker-compose logs -f

# Database
docker exec -i db psql -U user db < backup.sql
```

## Scalability Tips

- Organize models by domain (users, products, orders)
- Create separate controller files per domain
- Use blueprints for feature separation
- Keep utilities modular and reusable
- Consider using service layer for complex logic
- Add caching for frequently accessed data

## File Naming Conventions

- **Models**: singular (`user.py`, `product.py`)
- **Controllers**: `{feature}_controller.py`
- **Routes**: feature name (`auth.py`, `products.py`)
- **Classes**: PascalCase (`UserController`, `Product`)
- **Functions**: snake_case (`update_user_role()`)
- **Variables**: snake_case (`user_id`, `is_active`)
