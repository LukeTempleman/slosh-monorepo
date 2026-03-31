"""Code controller for code generation and verification"""

from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app import db
from app.models import Code, User
from datetime import datetime
import requests
import os


class CodeController:
    """Controller for code generation and verification"""
    
    MANU_BACKEND_URL = os.getenv("MANU_BACKEND_URL", "http://manu_flask:5000")
    
    @staticmethod
    def hash_code_with_secret(code: str, secret_key: str) -> str:
        """
        Hash a code using the secret key using Fernet encryption
        
        This creates the hashed version ("polar bear")
        """
        try:
            from cryptography.fernet import Fernet
            # Ensure secret_key is bytes
            if isinstance(secret_key, str):
                secret_key_bytes = secret_key.encode('utf-8')
            else:
                secret_key_bytes = secret_key
            
            cipher = Fernet(secret_key_bytes)
            hashed = cipher.encrypt(code.encode('utf-8'))
            return hashed.decode('utf-8')
        except Exception as e:
            print(f"Hash error: {str(e)}")
            return None
    
    @staticmethod
    def generate_code():
        """Generate a new random code (admin only)"""
        try:
            data = request.get_json()
            user_id = get_jwt_identity()
            
            # Verify user is admin
            user = User.query.get(user_id)
            if not user or user.role != "admin":
                return {"error": "Admin access required"}, 403
            
            # Get secret key from Manufacturers backend
            try:
                manu_url = os.getenv("MANU_BACKEND_URL", "http://manu_flask:5000")
                endpoint = f"{manu_url}/api/internal/secret-key/value"
                
                response = requests.get(endpoint, timeout=5)
                if response.status_code != 200:
                    return {"error": f"Could not retrieve secret key: {response.status_code}"}, 500
                
                secret_data = response.json()
                secret_key = secret_data.get("key_value")
                
                if not secret_key:
                    return {"error": "Secret key not configured on backend"}, 500
                    
            except requests.exceptions.ConnectionError as e:
                return {"error": f"Cannot connect to Manufacturers backend: {str(e)}"}, 503
            except requests.exceptions.Timeout:
                return {"error": "Manufacturers backend request timeout"}, 504
            except Exception as e:
                return {"error": f"Backend error: {str(e)}"}, 500
            
            # Generate random code
            original_code = Code.generate_random_code(10)
            
            # Hash the code using secret key
            hashed_code = CodeController.hash_code_with_secret(original_code, secret_key)
            
            if not hashed_code:
                return {"error": "Failed to hash code"}, 500
            
            # Save to database
            code_obj = Code(
                user_id=user_id,
                original_code=original_code,
                hashed_code=hashed_code,
                code_name=data.get("code_name", f"Code-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"),
                description=data.get("description"),
                purpose=data.get("purpose", "verification")
            )
            
            db.session.add(code_obj)
            db.session.commit()
            
            return {
                "message": "Code generated successfully",
                "code": {
                    "id": code_obj.id,
                    "code_name": code_obj.code_name,
                    "original_code": code_obj.original_code,
                    "hashed_code": code_obj.hashed_code,
                    "created_at": code_obj.created_at.isoformat()
                }
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    @staticmethod
    def verify_code():
        """Verify a hashed code and return the original code (users)"""
        try:
            data = request.get_json()
            user_id = get_jwt_identity()
            
            if not data or not data.get("hashed_code") or not data.get("secret_key"):
                return {"error": "hashed_code and secret_key are required"}, 400
            
            hashed_code_request = data.get("hashed_code")
            secret_key = data.get("secret_key")
            
            # Find the code in database
            code_obj = Code.query.filter_by(hashed_code=hashed_code_request, is_active=True).first()
            
            if not code_obj:
                return {"error": "Code not found or invalid"}, 404
            
            # Verify the hashed code by decrypting with secret key
            try:
                from cryptography.fernet import Fernet
                
                # Ensure secret_key is bytes
                if isinstance(secret_key, str):
                    secret_key_bytes = secret_key.encode('utf-8')
                else:
                    secret_key_bytes = secret_key
                
                cipher = Fernet(secret_key_bytes)
                
                # hashed_code_request is already a base64-encoded string from Fernet
                # Encode it as UTF-8 bytes to pass to cipher.decrypt()
                if isinstance(hashed_code_request, str):
                    hashed_bytes = hashed_code_request.encode('utf-8')
                else:
                    hashed_bytes = hashed_code_request
                
                decrypted = cipher.decrypt(hashed_bytes)
                decrypted_code = decrypted.decode('utf-8')
                
                # Check if decrypted code matches stored original
                if decrypted_code != code_obj.original_code:
                    return {"error": "Code verification failed"}, 400
                
            except Exception as e:
                return {"error": f"Decryption failed: {str(e)}"}, 400
            
            # Mark as verified
            code_obj.is_verified = True
            code_obj.verified_at = datetime.utcnow()
            db.session.commit()
            
            return {
                "message": "Code verified successfully",
                "original_code": code_obj.original_code,
                "code": {
                    "id": code_obj.id,
                    "code_name": code_obj.code_name,
                    "description": code_obj.description,
                    "original_code": code_obj.original_code,
                    "is_verified": code_obj.is_verified,
                    "verified_at": code_obj.verified_at.isoformat()
                }
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    @staticmethod
    def list_codes():
        """List all codes for the current user (admin sees all)"""
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return {"error": "User not found"}, 404
            
            if user.role == "admin":
                codes = Code.query.filter_by(is_active=True).all()
            else:
                codes = Code.query.filter_by(user_id=user_id, is_active=True).all()
            
            return {
                "codes": [code.to_dict(include_codes=False) for code in codes]
            }, 200
            
        except Exception as e:
            return {"error": str(e)}, 500
    
    @staticmethod
    def get_code_details(code_id):
        """Get details of a specific code (admin or owner only)"""
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            code_obj = Code.query.get(code_id)
            if not code_obj:
                return {"error": "Code not found"}, 404
            
            # Check permissions
            if user.role != "admin" and code_obj.user_id != user_id:
                return {"error": "Access denied"}, 403
            
            return code_obj.to_dict(include_codes=True), 200
            
        except Exception as e:
            return {"error": str(e)}, 500
    
    @staticmethod
    def delete_code(code_id):
        """Delete/deactivate a code (admin or owner)"""
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            code_obj = Code.query.get(code_id)
            if not code_obj:
                return {"error": "Code not found"}, 404
            
            # Check permissions
            if user.role != "admin" and code_obj.user_id != user_id:
                return {"error": "Access denied"}, 403
            
            code_obj.is_active = False
            db.session.commit()
            
            return {"message": "Code deleted successfully"}, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
