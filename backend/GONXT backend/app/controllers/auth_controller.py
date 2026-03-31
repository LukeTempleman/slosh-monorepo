"""Authentication controller"""

from app import db
from app.models import User
from flask_jwt_extended import create_access_token, create_refresh_token


class AuthController:
    """Controller for authentication operations"""
    
    @staticmethod
    def register(data):
        """Register a new user"""
        try:
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            
            # Validation
            if not all([username, email, password]):
                return {"error": "Missing required fields"}, 400
            
            # Check if user exists
            if User.query.filter_by(username=username).first():
                return {"error": "Username already exists"}, 409
            
            if User.query.filter_by(email=email).first():
                return {"error": "Email already exists"}, 409
            
            # Create user
            role = data.get("role", "user")  # Allow admin role specification
            user = User(username=username, email=email, role=role)
            user.set_password(password)
            
            db.session.add(user)
            db.session.commit()
            
            return {
                "message": "User registered successfully",
                "user": user.to_dict()
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    @staticmethod
    def login(data):
        """Login user and return JWT tokens"""
        try:
            username = data.get("username")
            password = data.get("password")
            
            if not all([username, password]):
                return {"error": "Missing username or password"}, 400
            
            user = User.query.filter_by(username=username).first()
            
            if not user or not user.check_password(password):
                return {"error": "Invalid credentials"}, 401
            
            if not user.is_active:
                return {"error": "User account is inactive"}, 403
            
            # Create tokens
            access_token = create_access_token(
                identity=str(user.id),
                additional_claims={"role": user.role, "username": user.username}
            )
            refresh_token = create_refresh_token(identity=str(user.id))
            
            return {
                "message": "Login successful",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": user.to_dict()
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500
    
    @staticmethod
    def refresh(user_id):
        """Create new access token from refresh token"""
        try:
            user = User.query.get(user_id)
            
            if not user:
                return {"error": "User not found"}, 404
            
            access_token = create_access_token(
                identity=user.id,
                additional_claims={"role": user.role, "username": user.username}
            )
            
            return {
                "access_token": access_token
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500
