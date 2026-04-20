from app import db
from datetime import datetime
from enum import Enum


class BatchStatus(str, Enum):
    """Batch status enumeration"""
    PENDING = "pending"
    PRODUCTION = "production"
    COMPLETED = "completed"
    REJECTED = "rejected"


class RiskLevel(str, Enum):
    """Risk level enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Batch(db.Model):
    """Batch model for batch management"""
    __tablename__ = 'batches'
    
    id = db.Column(db.String(50), primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default=BatchStatus.PENDING, nullable=False, index=True)
    quality_score = db.Column(db.Float, default=0.0, nullable=False, index=True)
    risk_level = db.Column(db.String(20), default=RiskLevel.LOW, nullable=False, index=True)
    location = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    notes = db.Column(db.Text)
    deleted_at = db.Column(db.DateTime, nullable=True, index=True)  # For soft delete
    
    def to_dict(self):
        """Convert batch to dictionary"""
        return {
            'id': self.id,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'status': self.status,
            'quality_score': self.quality_score,
            'risk_level': self.risk_level,
            'location': self.location,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'created_by': self.created_by,
            'notes': self.notes,
            'deleted_at': self.deleted_at.isoformat() if self.deleted_at else None
        }
    
    def __repr__(self):
        return f'<Batch {self.id}>'
