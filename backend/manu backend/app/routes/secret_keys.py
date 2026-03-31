"""Secret key routes for global encryption key management"""

from flask import Blueprint, jsonify
from app.controllers import SecretKeyController
from app.utils.decorators import admin_required, login_required

secret_key_bp = Blueprint('secret_keys', __name__)


# Global secret key management routes (admin only)
@secret_key_bp.route('/admin/secret-key', methods=['GET'])
@admin_required
def get_secret_key():
    """Get the global secret key (admin only)"""
    response, status_code = SecretKeyController.get_secret_key()
    return jsonify(response), status_code


@secret_key_bp.route('/admin/secret-key', methods=['POST'])
@admin_required
def set_secret_key():
    """Set or update the global secret key (admin only)"""
    response, status_code = SecretKeyController.set_secret_key()
    return jsonify(response), status_code


@secret_key_bp.route('/internal/secret-key/value', methods=['GET'])
def get_secret_key_value():
    """Get secret key value for internal use (from GONXT backend)
    
    Note: This endpoint is meant for internal backend-to-backend communication.
    Should be secured with network isolation or additional auth in production.
    """
    response, status_code = SecretKeyController.get_key_value_only()
    return jsonify(response), status_code
