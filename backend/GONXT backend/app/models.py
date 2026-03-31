"""Database models for GONXT Backend"""

from app import db
from datetime import datetime
import secrets
import bcrypt
import uuid


class User(db.Model):
    """User model with authentication"""
    __tablename__ = "users"
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="user", nullable=False)  # 'admin', 'user', 'viewer'
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    api_keys = db.relationship("APIKey", backref="user", lazy=True, cascade="all, delete-orphan")
    
    def set_password(self, password: str):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class APIKey(db.Model):
    """API Key model - stores generated and hashed keys"""
    __tablename__ = "api_keys"
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    
    # The actual key - only shown once at creation
    key_plain = db.Column(db.String(255), nullable=True)  # Stored temporarily for display
    
    # Hashed key for verification
    key_hash = db.Column(db.String(255), nullable=False, unique=True, index=True)
    
    # Metadata
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    last_used_at = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    @staticmethod
    def generate_key() -> str:
        """Generate a random API key"""
        return f"gnx_{secrets.token_urlsafe(32)}"
    
    def set_key_hash(self, key: str):
        """Hash the API key"""
        self.key_hash = bcrypt.hashpw(key.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_key(self, key: str) -> bool:
        """Verify API key against hash"""
        return bcrypt.checkpw(key.encode('utf-8'), self.key_hash.encode('utf-8'))
    
    def to_dict(self, include_plain_key=False):
        """Convert to dictionary"""
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
            "last_used_at": self.last_used_at.isoformat() if self.last_used_at else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
        
        if include_plain_key and self.key_plain:
            data["key"] = self.key_plain
            
        return data
