"""Authentication routes"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import AuthController
from app.models import User
from app.utils import admin_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.get_json()
    response, status_code = AuthController.register(data)
    return jsonify(response), status_code


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login and get JWT tokens"""
    data = request.get_json()
    response, status_code = AuthController.login(data)
    return jsonify(response), status_code


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    user_id = get_jwt_identity()
    response, status_code = AuthController.refresh(user_id)
    return jsonify(response), status_code


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Get current user info"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200


@auth_bp.route("/admin/users", methods=["GET"])
@jwt_required()
@admin_required
def list_all_users():
    """List all users (admin only)"""
    users = User.query.all()
    return jsonify({
        "users": [user.to_dict() for user in users]
    }), 200


@auth_bp.route("/admin/users/<user_id>/role", methods=["PATCH"])
@jwt_required()
@admin_required
def update_user_role(user_id):
    """Update user role (admin only)"""
    from app import db
    
    data = request.get_json()
    role = data.get("role")
    
    if role not in ["admin", "user", "viewer"]:
        return jsonify({"error": "Invalid role"}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user.role = role
    db.session.commit()
    
    return jsonify({
        "message": "User role updated",
        "user": user.to_dict()
    }), 200


@auth_bp.route("/admin/users/<user_id>/status", methods=["PATCH"])
@jwt_required()
@admin_required
def update_user_status(user_id):
    """Enable/disable user (admin only)"""
    from app import db
    
    data = request.get_json()
    is_active = data.get("is_active")
    
    if not isinstance(is_active, bool):
        return jsonify({"error": "is_active must be boolean"}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user.is_active = is_active
    db.session.commit()
    
    return jsonify({
        "message": "User status updated",
        "user": user.to_dict()
    }), 200
