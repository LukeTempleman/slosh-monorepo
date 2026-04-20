"""Routes package"""
from app.routes.auth import auth_bp
from app.routes.secret_keys import secret_key_bp
from app.routes.health import health_bp
from app.routes.manufacturers import manufacturers_bp

__all__ = ['auth_bp', 'secret_key_bp', 'health_bp', 'manufacturers_bp']
