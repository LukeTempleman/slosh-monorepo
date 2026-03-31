from flask import Blueprint
from app.controllers import AuthController, UserController
from app.utils.decorators import login_required, admin_required

auth_bp = Blueprint('auth', __name__)

# Authentication routes
@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    return AuthController.register()

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    return AuthController.login()

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current user profile"""
    return AuthController.get_current_user()

# Current user secret key management routes (user's own secret key)
@auth_bp.route('/me/secret-key', methods=['POST'])
@login_required
def set_own_secret_key():
    """Set your own secret key"""
    return AuthController.set_own_secret_key()

@auth_bp.route('/me/secret-key', methods=['GET'])
@login_required
def get_own_secret_key():
    """Get your own secret key"""
    return AuthController.get_own_secret_key()

@auth_bp.route('/me/secret-key/generate', methods=['POST'])
@login_required
def generate_own_secret_key():
    """Generate a new secret key for yourself"""
    return AuthController.generate_own_secret_key()

@auth_bp.route('/me/secret-key', methods=['DELETE'])
@login_required
def reset_own_secret_key():
    """Reset (clear) your own secret key"""
    return AuthController.reset_own_secret_key()

# User management routes (admin only)
@auth_bp.route('/admin/users', methods=['GET'])
@admin_required
def list_users():
    """List all users (admin only)"""
    return UserController.list_users()

@auth_bp.route('/admin/users/<int:user_id>/role', methods=['PATCH'])
@admin_required
def update_user_role(user_id):
    """Update user role (admin only)"""
    return UserController.update_user_role(user_id)

@auth_bp.route('/admin/users/<int:user_id>/status', methods=['PATCH'])
@admin_required
def update_user_status(user_id):
    """Update user active status (admin only)"""
    return UserController.update_user_status(user_id)

# Secret key management routes (admin only)
@auth_bp.route('/admin/users/<int:user_id>/secret-key', methods=['POST'])
@admin_required
def set_user_secret_key(user_id):
    """Set a custom secret key for a user (admin only)"""
    return UserController.set_user_secret_key(user_id)

@auth_bp.route('/admin/users/<int:user_id>/secret-key', methods=['GET'])
@admin_required
def get_user_secret_key(user_id):
    """Get the secret key for a user (admin only)"""
    return UserController.get_user_secret_key(user_id)

@auth_bp.route('/admin/users/<int:user_id>/secret-key/generate', methods=['POST'])
@admin_required
def generate_user_secret_key(user_id):
    """Generate a new secret key for a user (admin only)"""
    return UserController.generate_user_secret_key(user_id)

@auth_bp.route('/admin/users/<int:user_id>/secret-key', methods=['DELETE'])
@admin_required
def reset_user_secret_key(user_id):
    """Reset (clear) the secret key for a user (admin only)"""
    return UserController.reset_user_secret_key(user_id)
