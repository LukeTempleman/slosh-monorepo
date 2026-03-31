"""Encryption and decryption utilities"""

import os
from cryptography.fernet import Fernet
import secrets
import string


# Generate or load encryption key
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    # Generate a new key if not provided
    ENCRYPTION_KEY = Fernet.generate_key().decode()

cipher = Fernet(ENCRYPTION_KEY.encode() if isinstance(ENCRYPTION_KEY, str) else ENCRYPTION_KEY)


def generate_random_code(length=10):
    """Generate random garbage code (10 characters)"""
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))


def encrypt_code(code: str) -> str:
    """Encrypt a code - stores encrypted version in manufacturers DB"""
    encrypted = cipher.encrypt(code.encode())
    return encrypted.decode()


def decrypt_code(encrypted_code: str) -> str:
    """Decrypt a code using secret key - used by API to validate"""
    try:
        decrypted = cipher.decrypt(encrypted_code.encode())
        return decrypted.decode()
    except Exception:
        return None


def verify_code(encrypted_request_code: str, stored_encrypted_code: str) -> bool:
    """
    Verify code from API request against stored encrypted code
    
    Flow:
    1. Get encrypted code from API request (e.g., "polar bear")
    2. Decrypt it using secret key
    3. Compare with stored encrypted code (after decrypting stored)
    4. Return True if match
    """
    try:
        # Decrypt the request code
        decrypted_request = decrypt_code(encrypted_request_code)
        if not decrypted_request:
            return False
        
        # Decrypt the stored code to compare
        decrypted_stored = decrypt_code(stored_encrypted_code)
        if not decrypted_stored:
            return False
        
        # Compare decrypted codes
        return decrypted_request == decrypted_stored
    except Exception:
        return False
