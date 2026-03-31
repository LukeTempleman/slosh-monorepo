"""Authorization decorators"""

from functools import wraps
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask import jsonify


def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return {"error": "Admin access required"}, 403
        return f(*args, **kwargs)
    return decorated


def token_required(f):
    """Decorator to require JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = get_jwt_identity()
        if not user_id:
            return {"error": "Unauthorized"}, 401
        return f(*args, **kwargs)
    return decorated
