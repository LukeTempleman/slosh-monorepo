from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import secrets
import string

class User(db.Model):
    """User model with role-based access control"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    secret_key = db.Column(db.String(255), unique=True, nullable=True)  # Admin-provided secret key
    role = db.Column(db.String(20), default='user', nullable=False)  # 'admin' or 'user'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def generate_secret_key(self, length=32):
        """Generate a random secret key"""
        alphabet = string.ascii_letters + string.digits + string.punctuation
        self.secret_key = ''.join(secrets.choice(alphabet) for _ in range(length))
        return self.secret_key
    
    def to_dict(self, include_secret=False):
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'has_secret_key': self.secret_key is not None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        # Only include secret key if explicitly requested
        if include_secret and self.secret_key:
            data['secret_key'] = self.secret_key
        
        return data
    
    def __repr__(self):
        return f'<User {self.username}>'
