"""SecretKey model for storing global encryption secret key"""

from app import db
from datetime import datetime
import uuid


class SecretKey(db.Model):
    """Global secret key model for code encryption/decryption"""
    __tablename__ = "secret_keys"
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    key_value = db.Column(db.String(255), nullable=False)  # The actual secret key
    key_name = db.Column(db.String(100), default="global_secret_key", nullable=False)
    description = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    updated_by = db.Column(db.String(36), nullable=True)  # Admin user ID who updated it
    
    def to_dict(self, include_key=False):
        """Convert to dictionary"""
        data = {
            "id": self.id,
            "key_name": self.key_name,
            "description": self.description,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "updated_by": self.updated_by,
            "has_key": self.key_value is not None
        }
        
        # Only include key value if explicitly requested and is_active
        if include_key and self.is_active:
            data["key_value"] = self.key_value
        
        return data
