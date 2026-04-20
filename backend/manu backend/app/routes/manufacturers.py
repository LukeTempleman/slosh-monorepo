"""Manufacturer routes"""

from flask import Blueprint, jsonify, request
from app.controllers.manufacturers_controller import ManufacturersController
from app.utils.decorators import login_required

manufacturers_bp = Blueprint('manufacturers', __name__)

@manufacturers_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Get dashboard statistics"""
    return ManufacturersController.get_dashboard_stats()

@manufacturers_bp.route('/batches', methods=['GET'])
@login_required
def get_batches():
    """Get batch management data with filtering
    
    Query Parameters:
    - status: pending, production, completed, rejected
    - created_at_from: ISO format date (e.g., 2026-04-15)
    - created_at_to: ISO format date (e.g., 2026-04-15)
    - quality_score_min: numeric value
    - quality_score_max: numeric value
    - risk_level: low, medium, high
    - limit: max results (default: 100)
    - offset: pagination offset (default: 0)
    """
    # Extract query parameters
    status = request.args.get('status')
    created_at_from = request.args.get('created_at_from')
    created_at_to = request.args.get('created_at_to')
    quality_score_min = request.args.get('quality_score_min', type=float)
    quality_score_max = request.args.get('quality_score_max', type=float)
    risk_level = request.args.get('risk_level')
    limit = request.args.get('limit', default=100, type=int)
    offset = request.args.get('offset', default=0, type=int)
    
    return ManufacturersController.get_filtered_batches(
        status=status,
        created_at_from=created_at_from,
        created_at_to=created_at_to,
        quality_score_min=quality_score_min,
        quality_score_max=quality_score_max,
        risk_level=risk_level,
        limit=limit,
        offset=offset
    )

@manufacturers_bp.route('/batches', methods=['POST'])
@login_required
def create_batch():
    """Create a new batch
    
    Request Body:
    {
        "product_name": "string (required, max 255)",
        "quantity": "integer (required, > 0)",
        "location": "string (optional, max 255)",
        "quality_score": "float (optional, 0-100, default: 0)",
        "risk_level": "string (optional, low/medium/high, default: low)",
        "notes": "string (optional, max 1000)"
    }
    
    Returns:
        JSON response with created batch data
    """
    return ManufacturersController.create_batch(request)

@manufacturers_bp.route('/batches/<batch_id>', methods=['GET'])
@login_required
def get_batch(batch_id):
    """Get a single batch by ID
    
    Path Parameters:
        batch_id: The batch ID (e.g., BN0001)
    
    Returns:
        JSON response with batch details including:
        - id, product_name, quantity, status, quality_score, risk_level, location, notes
        - created_at, updated_at, created_by
    """
    return ManufacturersController.get_batch(batch_id)

@manufacturers_bp.route('/batches/<batch_id>', methods=['PATCH'])
@login_required
def update_batch(batch_id):
    """Update batch details
    
    Path Parameters:
        batch_id: The batch ID (e.g., BN0001)
    
    Request Body:
    {
        "status": "string (optional, pending/production/completed/rejected)",
        "quality_score": "float (optional, 0-100)",
        "risk_level": "string (optional, low/medium/high)",
        "notes": "string (optional, max 1000)"
    }
    
    Returns:
        JSON response with updated batch data
    """
    return ManufacturersController.update_batch(batch_id, request)

@manufacturers_bp.route('/batches/<batch_id>', methods=['DELETE'])
@login_required
def delete_batch(batch_id):
    """Delete a batch (soft or hard delete)
    
    Path Parameters:
        batch_id: The batch ID (e.g., BN0001)
    
    Query Parameters:
        hard_delete: Set to 'true' for hard delete (permanent removal).
                    Default: false (soft delete only marks as deleted)
    
    Returns:
        JSON response confirming deletion or error
    """
    return ManufacturersController.delete_batch(batch_id, request)

@manufacturers_bp.route('/batches/metrics', methods=['GET'])
@login_required
def get_batch_metrics():
    """Get aggregate KPIs for batches
    
    Returns:
        JSON response with metrics:
        - total: total number of batches (non-deleted)
        - active: batches in pending or production status
        - completed: batches with completed status
        - rejected: batches with rejected status
        - avg_quality: average quality score
        - by_status: breakdown by status
        - by_risk: breakdown by risk level
        - quality_distribution: breakdown by quality ranges
    """
    return ManufacturersController.get_batch_metrics()

@manufacturers_bp.route('/analytics', methods=['GET'])
@login_required
def get_analytics():
    """Get analytics data"""
    return ManufacturersController.get_analytics()

@manufacturers_bp.route('/reports', methods=['GET'])
@login_required
def get_reports():
    """Get compliance and risk reports"""
    return ManufacturersController.get_reports()

@manufacturers_bp.route('/feed', methods=['GET'])
@login_required
def get_feed():
    """Get live activity feed"""
    return ManufacturersController.get_live_feed()

@manufacturers_bp.route('/scan', methods=['POST'])
@login_required
def record_scan():
    """Record a new scan from NFC scanner
    
    Request body:
    {
        "product_name": "Product Name",
        "status": "Authentic|Suspicious|Failed",
        "location": "Location (optional)",
        "retailer": "Retailer Name (optional)",
        "device_id": "Device ID (optional)",
        "confidence": 95.5
    }
    """
    data = request.get_json()
    
    product_name = data.get('product_name')
    status = data.get('status')
    location = data.get('location')
    retailer = data.get('retailer')
    device_id = data.get('device_id')
    confidence = data.get('confidence')
    
    if not product_name or not status:
        return jsonify({"error": "product_name and status are required"}), 400
    
    return ManufacturersController.record_scan(
        product_name=product_name,
        status=status,
        location=location,
        retailer=retailer,
        device_id=device_id,
        confidence=confidence
    )

@manufacturers_bp.route('/settings', methods=['GET'])
def get_settings():
    """Get system settings"""
    return ManufacturersController.get_settings()
