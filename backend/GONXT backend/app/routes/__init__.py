"""Routes package"""

from app.routes.auth import auth_bp
from app.routes.keys import apikey_bp
from app.routes.codes import codes_bp
from app.routes.health import health_bp

__all__ = ['auth_bp', 'apikey_bp', 'codes_bp', 'health_bp']
