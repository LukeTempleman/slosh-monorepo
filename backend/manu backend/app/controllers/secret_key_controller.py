"""SecretKey controller"""

from flask import request
from app import db
from app.models import SecretKey, User
from flask_jwt_extended import get_jwt_identity


class SecretKeyController:
    """Controller for secret key management"""
    
    @staticmethod
    def get_secret_key():
        """Get the current active secret key (admin only)"""
        try:
            secret_key = SecretKey.query.filter_by(is_active=True).first()
            
            if not secret_key:
                return {"error": "No active secret key found"}, 404
            
            return secret_key.to_dict(include_key=True), 200
            
        except Exception as e:
            return {"error": str(e)}, 500
    
    @staticmethod
    def set_secret_key():
        """Set or update the secret key (admin only)"""
        try:
            data = request.get_json()
            
            if not data or not data.get("key_value"):
                return {"error": "key_value is required"}, 400
            
            key_value = data.get("key_value")
            description = data.get("description", "Global encryption secret key")
            user_id = get_jwt_identity()
            
            # Deactivate any existing secret key
            existing = SecretKey.query.filter_by(is_active=True).first()
            if existing:
                existing.is_active = False
            
            # Create new secret key
            secret_key = SecretKey(
                key_value=key_value,
                key_name="global_secret_key",
                description=description,
                is_active=True,
                updated_by=user_id
            )
            
            db.session.add(secret_key)
            db.session.commit()
            
            return {
                "message": "Secret key updated successfully",
                "secret_key": secret_key.to_dict(include_key=True)
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    @staticmethod
    def get_key_value_only():
        """Get only the key value (for making requests from GONXT)"""
        try:
            secret_key = SecretKey.query.filter_by(is_active=True).first()
            
            if not secret_key or not secret_key.key_value:
                return {"error": "No active secret key found"}, 404
            
            return {
                "key_value": secret_key.key_value,
                "id": secret_key.id
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500
