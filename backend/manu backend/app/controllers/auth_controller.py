from flask import request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from app import db
from app.models import User
from app.utils.decorators import login_required, admin_required

class AuthController:
    """Authentication controller"""
    
    @staticmethod
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
    
    @staticmethod
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
            identity=str(user.id),
            additional_claims=additional_claims
        )
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    
    @staticmethod
    def get_current_user():
        """Get current user profile"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
    
    @staticmethod
    def set_own_secret_key():
        """Set current user's own secret key"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        custom_key = data.get('secret_key')
        
        if not custom_key:
            return jsonify({'error': 'secret_key is required'}), 400
        
        if len(custom_key) < 16:
            return jsonify({'error': 'Secret key must be at least 16 characters long'}), 400
        
        # Check if key already exists for another user
        existing_user = User.query.filter_by(secret_key=custom_key).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'This secret key is already in use'}), 409
        
        user.secret_key = custom_key
        db.session.commit()
        
        return jsonify({
            'message': 'Your secret key has been set successfully',
            'user_id': user.id,
            'username': user.username
        }), 200
    
    @staticmethod
    def get_own_secret_key():
        """Get current user's own secret key"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.secret_key:
            return jsonify({'error': 'You do not have a secret key set'}), 404
        
        return jsonify({
            'user_id': user.id,
            'username': user.username,
            'secret_key': user.secret_key
        }), 200
    
    @staticmethod
    def generate_own_secret_key():
        """Generate a new secret key for current user"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate a new secret key
        secret_key = user.generate_secret_key()
        db.session.commit()
        
        return jsonify({
            'message': 'Secret key generated successfully',
            'user_id': user.id,
            'username': user.username,
            'secret_key': secret_key,
            'warning': 'Save this secret key securely. It will not be shown again.'
        }), 200
    
    @staticmethod
    def reset_own_secret_key():
        """Reset (clear) current user's secret key"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.secret_key = None
        db.session.commit()
        
        return jsonify({
            'message': 'Your secret key has been reset',
            'user_id': user.id,
            'username': user.username
        }), 200


class UserController:
    """User management controller"""
    
    @staticmethod
    def list_users():
        """List all users (admin only)"""
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    
    @staticmethod
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
    
    @staticmethod
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
    
    @staticmethod
    def generate_user_secret_key(user_id):
        """Generate a new secret key for a user (admin only)"""
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate a new secret key
        secret_key = user.generate_secret_key()
        db.session.commit()
        
        return jsonify({
            'message': 'Secret key generated successfully',
            'user_id': user.id,
            'username': user.username,
            'secret_key': secret_key,
            'warning': 'Save this secret key securely. It will not be shown again.'
        }), 200
    
    @staticmethod
    def get_user_secret_key(user_id):
        """Get the secret key for a user (admin only or user viewing their own)"""
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.secret_key:
            return jsonify({'error': 'User does not have a secret key'}), 404
        
        return jsonify({
            'user_id': user.id,
            'username': user.username,
            'secret_key': user.secret_key
        }), 200
    
    @staticmethod
    def reset_user_secret_key(user_id):
        """Reset (clear) the secret key for a user (admin only)"""
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.secret_key = None
        db.session.commit()
        
        return jsonify({
            'message': 'Secret key reset successfully',
            'user_id': user.id,
            'username': user.username
        }), 200
    
    @staticmethod
    def set_user_secret_key(user_id):
        """Set a custom secret key for a user (admin only)"""
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        custom_key = data.get('secret_key')
        
        if not custom_key:
            return jsonify({'error': 'secret_key is required'}), 400
        
        if len(custom_key) < 16:
            return jsonify({'error': 'Secret key must be at least 16 characters long'}), 400
        
        # Check if key already exists
        existing_user = User.query.filter_by(secret_key=custom_key).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'This secret key is already in use'}), 409
        
        user.secret_key = custom_key
        db.session.commit()
        
        return jsonify({
            'message': 'Secret key set successfully',
            'user_id': user.id,
            'username': user.username
        }), 200
