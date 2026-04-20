"""Scan Model - Records NFC scans of products"""
from datetime import datetime, timedelta
from app import db


class Scan(db.Model):
    __tablename__ = 'scans'

    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # Authentic, Suspicious, Failed
    location = db.Column(db.String(255), nullable=True)
    retailer = db.Column(db.String(255), nullable=True)
    device_id = db.Column(db.String(100), nullable=True)
    confidence = db.Column(db.Float, nullable=True, default=0.0)  # 0-100
    scanned_by = db.Column(db.String(255), nullable=True)  # User or device
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        """Convert scan to dictionary"""
        return {
            'id': self.id,
            'type': 'scan',
            'product': self.product_name,
            'status': self.status,
            'location': self.location,
            'retailer': self.retailer,
            'device_id': self.device_id,
            'confidence': self.confidence,
            'timestamp': self.created_at.isoformat()
        }

    @staticmethod
    def create_scan(product_name, status, location=None, retailer=None, device_id=None, confidence=None, scanned_by=None):
        """Create a new scan record"""
        scan = Scan(
            product_name=product_name,
            status=status,
            location=location,
            retailer=retailer,
            device_id=device_id,
            confidence=confidence or 0.0,
            scanned_by=scanned_by
        )
        db.session.add(scan)
        db.session.commit()
        return scan

    @staticmethod
    def get_recent_scans(limit=12):
        """Get recent scans, ordered by most recent first"""
        return Scan.query.order_by(Scan.created_at.desc()).limit(limit).all()

    @staticmethod
    def get_scans_by_status(status, limit=10):
        """Get scans filtered by status"""
        return Scan.query.filter_by(status=status).order_by(Scan.created_at.desc()).limit(limit).all()

    @staticmethod
    def get_scans_by_product(product_name, limit=10):
        """Get scans for a specific product"""
        return Scan.query.filter_by(product_name=product_name).order_by(Scan.created_at.desc()).limit(limit).all()

    @staticmethod
    def get_scans_by_date_range(start_date, end_date, limit=100):
        """Get scans within a date range"""
        return Scan.query.filter(
            Scan.created_at >= start_date,
            Scan.created_at <= end_date
        ).order_by(Scan.created_at.desc()).limit(limit).all()

    @staticmethod
    def get_scan_count_by_status():
        """Get count of scans by status"""
        from sqlalchemy import func
        results = db.session.query(
            Scan.status,
            func.count(Scan.id)
        ).group_by(Scan.status).all()
        return {status: count for status, count in results}

    def __repr__(self):
        return f"<Scan {self.id}: {self.product_name} - {self.status}>"
