"""API Key controller"""

from app import db
from app.models import User, APIKey
from datetime import datetime


class APIKeyController:
    """Controller for API key operations with dual encryption"""
    
    @staticmethod
    def create_key(user_id, data):
        """
        Create a new API key with dual encryption
        
        Flow:
        1. Generate random 10-char code (e.g., "hello")
        2. Encrypt for manufacturers DB (e.g., "desk")
        3. Encrypt for API verification (e.g., "polar bear")
        4. Return all codes to user (shown only once)
        """
        try:
            user = User.query.get(user_id)
            if not user:
                return {"error": "User not found"}, 404
            
            name = data.get("name")
            description = data.get("description", "")
            
            if not name:
                return {"error": "Key name is required"}, 400
            
            # Generate new key with dual encryption
            key_data = APIKey.generate_new_key(name, description)
            
            # Create API key in database
            api_key = APIKey(
                user_id=user_id,
                name=name,
                description=description,
                code_plain=key_data["plain_code"],
                code_encrypted_db=key_data["encrypted_db"],
                code_encrypted_api=key_data["encrypted_api"]
            )
            
            db.session.add(api_key)
            db.session.commit()
            
            # Return response with all codes (shown at creation, stored in DB)
            response = {
                "id": api_key.id,
                "name": api_key.name,
                "description": api_key.description,
                "code": key_data["plain_code"],
                "manufacturers_code": key_data["encrypted_db"],
                "api_verification_code": key_data["encrypted_api"],
                "message": "✅ All codes saved in GONXT DB. Can retrieve later with authentication.",
                "storage": {
                    "code": "Stored as code_plain (encrypted in transit)",
                    "manufacturers_code": "Stored as code_encrypted_db",
                    "api_verification_code": "Stored as code_encrypted_api"
                },
                "is_active": True,
                "created_at": api_key.created_at.isoformat()
            }
            
            return response, 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    @staticmethod
    def list_keys(user_id):
        """List all API keys for user"""
        try:
            user = User.query.get(user_id)
            if not user:
                return {"error": "User not found"}, 404
            
            keys = APIKey.query.filter_by(user_id=user_id).all()
            
            return {
                "keys": [key.to_dict() for key in keys]
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500
    
    @staticmethod
    def delete_key(user_id, key_id):
        """Delete an API key"""
        try:
            api_key = APIKey.query.filter_by(
                id=key_id,
                user_id=user_id
            ).first()
            
            if not api_key:
                return {"error": "API key not found"}, 404
            
            db.session.delete(api_key)
            db.session.commit()
            
            return {"message": "API key deleted"}, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    @staticmethod
    def verify_code(encrypted_request_code: str):
        """
        Verify encrypted code from API request
        
        Flow:
        1. Receive encrypted code from API (e.g., "polar bear")
        2. Decrypt it using secret key
        3. Compare with stored encrypted code
        4. Return original code if valid (e.g., "hello")
        """
        try:
            api_keys = APIKey.query.filter_by(is_active=True).all()
            
            for key in api_keys:
                # Try to verify the code
                if key.verify_code(encrypted_request_code):
                    # Code verified! Get original code
                    original_code = key.get_original_code()
                    
                    # Update last used time
                    key.last_used_at = datetime.utcnow()
                    db.session.commit()
                    
                    return {
                        "verified": True,
                        "code": original_code,
                        "user_id": key.user_id,
                        "key_name": key.name,
                        "message": f"Code verified! Original: {original_code}"
                    }, 200
            
            # No valid key found
            return {
                "verified": False,
                "error": "Invalid verification code"
            }, 401
            
        except Exception as e:
            return {"error": str(e)}, 500
    
    @staticmethod
    def get_key_info(user_id, key_id):
        """Get API key info (without sensitive codes)"""
        try:
            api_key = APIKey.query.filter_by(
                id=key_id,
                user_id=user_id
            ).first()
            
            if not api_key:
                return {"error": "API key not found"}, 404
            
            return api_key.to_dict(), 200
            
        except Exception as e:
            return {"error": str(e)}, 500
