from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
from app.utils import admin_required, login_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields: username, email, password'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    user = User(username=username, email=email)
    user.set_password(password)
    user.role = 'admin' if data.get('role') == 'admin' else 'user'
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'User account is inactive'}), 403
    
    additional_claims = {'role': user.role}
    access_token = create_access_token(
        identity=user.id,
        additional_claims=additional_claims
    )
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@auth_bp.route('/admin/users', methods=['GET'])
@admin_required
def list_users():
    """List all users (admin only)"""
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@auth_bp.route('/admin/users/<int:user_id>/role', methods=['PATCH'])
@admin_required
def update_user_role(user_id):
    """Update user role (admin only)"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    new_role = data.get('role')
    
    if new_role not in ['admin', 'user']:
        return jsonify({'error': 'Invalid role. Must be "admin" or "user"'}), 400
    
    user.role = new_role
    db.session.commit()
    
    return jsonify({
        'message': 'User role updated successfully',
        'user': user.to_dict()
    }), 200

@auth_bp.route('/admin/users/<int:user_id>/status', methods=['PATCH'])
@admin_required
def update_user_status(user_id):
    """Update user active status (admin only)"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    is_active = data.get('is_active')
    
    if not isinstance(is_active, bool):
        return jsonify({'error': 'is_active must be a boolean'}), 400
    
    user.is_active = is_active
    db.session.commit()
    
    return jsonify({
        'message': 'User status updated successfully',
        'user': user.to_dict()
    }), 200
