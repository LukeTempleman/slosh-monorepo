"""Health check routes"""

from flask import Blueprint, jsonify
from app import db
from sqlalchemy import text

health_bp = Blueprint('health', __name__)


@health_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db.session.execute(text('SELECT 1'))
        db.session.close()
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return jsonify({
        "status": "healthy",
        "service": "GONXT Backend",
        "database": db_status
    }), 200


@health_bp.route('/internal/health', methods=['GET'])
def internal_health():
    """Internal health check endpoint (no auth required)"""
    try:
        db.session.execute(text('SELECT 1'))
        db.session.close()
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return jsonify({
        "status": "healthy",
        "service": "GONXT Backend",
        "database": db_status
    }), 200
