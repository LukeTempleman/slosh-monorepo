"""API Key model"""

from app import db
from datetime import datetime
import uuid
from app.utils.encryption import generate_random_code, encrypt_code, decrypt_code


class APIKey(db.Model):
    """API Key model with dual encryption verification"""
    __tablename__ = "api_keys"
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    
    # CODE: Original random 10-char string (e.g., "hello") - STORED
    code_plain = db.Column(db.String(255), nullable=False, unique=True, index=True)
    
    # Encrypted code for manufacturers DB (e.g., "desk")
    code_encrypted_db = db.Column(db.String(500), nullable=False, unique=True, index=True)
    
    # Encrypted code for API verification (e.g., "polar bear")
    code_encrypted_api = db.Column(db.String(500), nullable=False, unique=True, index=True)
    
    # Metadata
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    last_used_at = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    @staticmethod
    def generate_new_key(name: str, description: str = ""):
        """
        Generate a new API key with dual encryption
        
        Returns:
            - Original code (hello)
            - Encrypted for DB (desk) - for manufacturers portal
            - Encrypted for API (polar bear) - for API verification
        """
        # Generate random 10-char code
        plain_code = generate_random_code(10)
        
        # Create first encrypted version for manufacturers DB
        encrypted_db = encrypt_code(plain_code)
        
        # Create second encrypted version for API verification
        encrypted_api = encrypt_code(plain_code)
        
        return {
            "plain_code": plain_code,
            "encrypted_db": encrypted_db,
            "encrypted_api": encrypted_api,
            "name": name,
            "description": description
        }
    
    def verify_code(self, api_request_encrypted_code: str) -> bool:
        """
        Verify API request code against stored encrypted code
        
        Flow:
        1. Decrypt the encrypted code from API request
        2. Decrypt the stored encrypted API code
        3. Compare decoded values
        4. Return Original code (hello) if valid
        """
        try:
            # Decrypt the request code
            decrypted_request = decrypt_code(api_request_encrypted_code)
            if not decrypted_request:
                return False
            
            # Decrypt the stored API code
            decrypted_stored = decrypt_code(self.code_encrypted_api)
            if not decrypted_stored:
                return False
            
            # Verify they match
            return decrypted_request == decrypted_stored
        except Exception:
            return False
    
    def get_original_code(self) -> str:
        """Get the original code by decrypting"""
        return decrypt_code(self.code_encrypted_db)
    
    def to_dict(self, include_plain_code=False, include_db_code=False):
        """Convert to dictionary"""
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
            "last_used_at": self.last_used_at.isoformat() if self.last_used_at else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
        
        # Include all codes if requested (for authorized retrieval)
        if include_plain_code:
            data["code"] = self.code_plain
            data["code_encrypted_db"] = self.code_encrypted_db
            data["code_encrypted_api"] = self.code_encrypted_api
        
        # Include DB code if requested (for manufacturers portal)
        if include_db_code:
            data["code_encrypted_db"] = self.code_encrypted_db
        
        return data

