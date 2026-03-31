"""API Keys routes"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import APIKeyController
from app.models import User

apikey_bp = Blueprint("apikeys", __name__)


@apikey_bp.route("", methods=["POST"])
@jwt_required()
def create_api_key():
    """
    Create a new API key with dual encryption
    
    Returns:
    - code: Original code (e.g., "hello")
    - manufacturers_code: Encrypted for manufacturers DB (e.g., "desk")
    - api_verification_code: Encrypted for API requests (e.g., "polar bear")
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    response, status_code = APIKeyController.create_key(user_id, data)
    return jsonify(response), status_code


@apikey_bp.route("", methods=["GET"])
@jwt_required()
def list_api_keys():
    """List all API keys for user"""
    user_id = get_jwt_identity()
    response, status_code = APIKeyController.list_keys(user_id)
    return jsonify(response), status_code


@apikey_bp.route("/<key_id>", methods=["DELETE"])
@jwt_required()
def delete_api_key(key_id):
    """Delete an API key"""
    user_id = get_jwt_identity()
    response, status_code = APIKeyController.delete_key(user_id, key_id)
    return jsonify(response), status_code


@apikey_bp.route("/<key_id>", methods=["GET"])
@jwt_required()
def get_api_key(key_id):
    """Get API key info"""
    user_id = get_jwt_identity()
    response, status_code = APIKeyController.get_key_info(user_id, key_id)
    return jsonify(response), status_code


@apikey_bp.route("/<key_id>/codes", methods=["GET"])
@jwt_required()
def get_api_key_codes(key_id):
    """
    Get all stored codes for an API key (authenticated)
    
    Returns all three codes:
    - code: Original code (e.g., "hello")
    - code_encrypted_db: Manufacturers code (e.g., "desk")
    - code_encrypted_api: API verification code (e.g., "polar bear")
    """
    user_id = get_jwt_identity()
    try:
        from app.models import APIKey
        
        api_key = APIKey.query.filter_by(
            id=key_id,
            user_id=user_id
        ).first()
        
        if not api_key:
            return jsonify({"error": "API key not found"}), 404
        
        return jsonify({
            "id": api_key.id,
            "name": api_key.name,
            "description": api_key.description,
            "code": api_key.code_plain,
            "code_encrypted_db": api_key.code_encrypted_db,
            "code_encrypted_api": api_key.code_encrypted_api,
            "is_active": api_key.is_active,
            "last_used_at": api_key.last_used_at.isoformat() if api_key.last_used_at else None,
            "created_at": api_key.created_at.isoformat(),
            "storage_info": {
                "all_three_codes_stored": True,
                "code": "Original code (for reference)",
                "code_encrypted_db": "For manufacturers database",
                "code_encrypted_api": "For API verification requests"
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@apikey_bp.route("/verify", methods=["POST"])
def verify_api_code():
    """
    Verify encrypted code from API request
    
    Request body:
    {
      "code": "encrypted_code_from_manufacturers"
    }
    
    Response:
    {
      "verified": true,
      "code": "original_code_hello",
      "user_id": "user-uuid",
      "key_name": "My API Key"
    }
    
    Flow:
    1. Receive encrypted code (e.g., "polar bear")
    2. Decrypt using secret key
    3. Compare with stored encrypted code
    4. Return original code (e.g., "hello") if valid
    """
    data = request.get_json()
    encrypted_code = data.get("code")
    
    if not encrypted_code:
        return jsonify({"error": "Code is required", "verified": False}), 400
    
    response, status_code = APIKeyController.verify_code(encrypted_code)
    return jsonify(response), status_code
