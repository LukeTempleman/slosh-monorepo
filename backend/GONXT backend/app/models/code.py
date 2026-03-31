"""Code model for storing generated codes with dual encryption"""

from app import db
from datetime import datetime
import uuid
import secrets
import string


class Code(db.Model):
    """Code model - stores original code and hashed version"""
    __tablename__ = "codes"
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Original randomly generated code (10 characters)
    original_code = db.Column(db.String(100), nullable=False)  # e.g., "hello"
    
    # Hashed version using secret key
    hashed_code = db.Column(db.String(500), nullable=False)  # e.g., "polar bear" (encrypted)
    
    # Metadata
    code_name = db.Column(db.String(100), nullable=True)  # Name/description for this code
    description = db.Column(db.String(500), nullable=True)
    purpose = db.Column(db.String(50), default="verification", nullable=False)  # e.g., verification, authentication
    
    # Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)  # Has it been verified?
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    verified_at = db.Column(db.DateTime, nullable=True)
    expires_at = db.Column(db.DateTime, nullable=True)  # Optional expiration
    
    # Relationships
    user = db.relationship("User", backref="codes", lazy=True)
    
    def to_dict(self, include_codes=False):
        """Convert to dictionary"""
        data = {
            "id": self.id,
            "code_name": self.code_name,
            "description": self.description,
            "purpose": self.purpose,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat(),
            "verified_at": self.verified_at.isoformat() if self.verified_at else None,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }
        
        # Only include actual codes if explicitly requested
        if include_codes:
            data["original_code"] = self.original_code
            data["hashed_code"] = self.hashed_code
        
        return data
    
    @staticmethod
    def generate_random_code(length=10):
        """Generate 10 random characters of garbage"""
        characters = string.ascii_letters + string.digits + string.punctuation
        return ''.join(secrets.choice(characters) for _ in range(length))
