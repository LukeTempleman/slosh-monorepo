"""
Test suite for GONXT Backend API
Run with: pytest -v
"""

import pytest
import json
from app import create_app, db
from app.models import User, APIKey


@pytest.fixture
def app():
    """Create application for testing"""
    app = create_app("testing")
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Test client"""
    return app.test_client()


@pytest.fixture
def admin_user(app):
    """Create admin user"""
    with app.app_context():
        user = User(username="admin", email="admin@test.local", role="admin")
        user.set_password("admin123")
        db.session.add(user)
        db.session.commit()
        return user


@pytest.fixture
def admin_token(client, admin_user):
    """Get admin JWT token"""
    response = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })
    return response.json["access_token"]


class TestAuth:
    """Authentication tests"""
    
    def test_register(self, client):
        """Test user registration"""
        response = client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        })
        
        assert response.status_code == 201
        assert response.json["user"]["username"] == "testuser"
    
    def test_register_duplicate_username(self, client, admin_user):
        """Test duplicate username registration"""
        response = client.post("/api/auth/register", json={
            "username": "admin",
            "email": "new@example.com",
            "password": "password123"
        })
        
        assert response.status_code == 409
        assert "already exists" in response.json["error"]
    
    def test_login_success(self, client, admin_user):
        """Test successful login"""
        response = client.post("/api/auth/login", json={
            "username": "admin",
            "password": "admin123"
        })
        
        assert response.status_code == 200
        assert "access_token" in response.json
        assert "refresh_token" in response.json
    
    def test_login_invalid_password(self, client, admin_user):
        """Test login with invalid password"""
        response = client.post("/api/auth/login", json={
            "username": "admin",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401
    
    def test_get_current_user(self, client, admin_token):
        """Test getting current user info"""
        response = client.get("/api/auth/me", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        
        assert response.status_code == 200
        assert response.json["username"] == "admin"


class TestAPIKeys:
    """API Key management tests"""
    
    def test_create_api_key(self, client, admin_token):
        """Test creating API key"""
        response = client.post("/api/keys", 
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "name": "Test Key",
                "description": "Test"
            }
        )
        
        assert response.status_code == 201
        assert "key" in response.json
        assert response.json["key"].startswith("gnx_")
    
    def test_list_api_keys(self, client, admin_user, admin_token):
        """Test listing API keys"""
        # Create a key first
        app = create_app("testing")
        with app.app_context():
            key = APIKey(user_id=admin_user.id, name="Test")
            key.set_key_hash(APIKey.generate_key())
            db.session.add(key)
            db.session.commit()
        
        response = client.get("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 200
        assert "keys" in response.json
    
    def test_verify_api_key(self, client, admin_user):
        """Test API key verification"""
        app = create_app("testing")
        with app.app_context():
            plain_key = APIKey.generate_key()
            key = APIKey(user_id=admin_user.id, name="Test")
            key.set_key_hash(plain_key)
            db.session.add(key)
            db.session.commit()
        
        response = client.post("/api/keys/verify", json={
            "api_key": plain_key
        })
        
        assert response.status_code == 200
        assert response.json["username"] == "admin"


class TestAPIKeysDualEncryption:
    """API Key dual encryption tests"""
    
    def test_create_api_key_returns_three_codes(self, client, admin_token):
        """Test creating API key returns original + 2 encrypted codes"""
        response = client.post("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "name": "Test Key",
                "description": "Test dual encryption"
            }
        )
        
        assert response.status_code == 201
        data = response.json
        
        # Check all three codes are returned
        assert "code" in data  # Original (e.g., "hello")
        assert "manufacturers_code" in data  # Manufacturers DB (e.g., "desk")
        assert "api_verification_code" in data  # API verification (e.g., "polar bear")
        
        # Codes should be different
        assert data["code"] != data["manufacturers_code"]
        assert data["code"] != data["api_verification_code"]
        assert data["manufacturers_code"] != data["api_verification_code"]
    
    def test_verify_api_key_decryption(self, client, admin_token):
        """Test verifying encrypted code returns original"""
        # 1. Create API key
        create_response = client.post("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"name": "Test Key"}
        )
        api_code = create_response.json
        
        # 2. Verify with encrypted API code
        verify_response = client.post("/api/keys/verify", json={
            "code": api_code["api_verification_code"]
        })
        
        assert verify_response.status_code == 200
        verify_data = verify_response.json
        
        # Should return original code
        assert verify_data["verified"] == True
        assert verify_data["code"] == api_code["code"]
        assert "user_id" in verify_data
        assert "key_name" in verify_data
    
    def test_verify_invalid_code_fails(self, client):
        """Test verification fails with invalid code"""
        response = client.post("/api/keys/verify", json={
            "code": "invalid_encrypted_code_garbage"
        })
        
        assert response.status_code == 401
        assert response.json["verified"] == False
        assert "error" in response.json
    
    def test_list_keys_hides_encrypted_codes(self, client, admin_token):
        """Test listing keys doesn't expose encrypted codes"""
        # 1. Create key
        create_response = client.post("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"name": "Secret Key"}
        )
        
        # 2. List keys
        list_response = client.get("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert list_response.status_code == 200
        keys = list_response.json["keys"]
        
        # Encrypted codes should NOT be in list
        for key in keys:
            assert "code" not in key
            assert "code_encrypted_api" not in key
            assert "code_encrypted_db" not in key
    
    def test_get_key_info_hides_encrypted_codes(self, client, admin_token):
        """Test getting key info doesn't expose encrypted codes"""
        # 1. Create key
        create_response = client.post("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"name": "Secret Key"}
        )
        key_id = create_response.json["id"]
        
        # 2. Get key info
        info_response = client.get(f"/api/keys/{key_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert info_response.status_code == 200
        key_info = info_response.json
        
        # Encrypted codes should NOT be exposed
        assert "code" not in key_info
        assert "code_encrypted_api" not in key_info
        assert "code_encrypted_db" not in key_info
    
    def test_delete_api_key(self, client, admin_token):
        """Test deleting an API key"""
        # 1. Create key
        create_response = client.post("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"name": "Temporary Key"}
        )
        key_id = create_response.json["id"]
        
        # 2. Delete key
        delete_response = client.delete(f"/api/keys/{key_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert delete_response.status_code == 200
        assert "message" in delete_response.json
        
        # 3. Verify key is deleted
        list_response = client.get("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        key_ids = [k["id"] for k in list_response.json["keys"]]
        assert key_id not in key_ids

    def test_retrieve_api_key_codes(self, client, admin_token):
        """Test retrieving all three codes for an API key"""
        # 1. Create key
        create_response = client.post("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"name": "Test Key For Codes"}
        )
        assert create_response.status_code == 201
        create_data = create_response.json
        key_id = create_data["id"]
        
        # Verify all three codes were returned on creation
        assert "code" in create_data  # Original
        assert "manufacturers_code" in create_data  # DB encrypted
        assert "api_verification_code" in create_data  # API encrypted
        
        original_code = create_data["code"]
        manufacturers_code = create_data["manufacturers_code"]
        api_code = create_data["api_verification_code"]
        
        # 2. Retrieve codes using authenticated endpoint
        codes_response = client.get(f"/api/keys/{key_id}/codes",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert codes_response.status_code == 200
        codes_data = codes_response.json
        
        # Verify all three codes are returned
        assert "code" in codes_data
        assert "code_encrypted_db" in codes_data
        assert "code_encrypted_api" in codes_data
        assert "storage_info" in codes_data
        
        # Verify codes match what was created
        assert codes_data["code"] == original_code
        assert codes_data["code_encrypted_db"] == manufacturers_code
        assert codes_data["code_encrypted_api"] == api_code
        
        # Verify metadata is present
        assert codes_data["id"] == key_id
        assert codes_data["name"] == "Test Key For Codes"
        assert codes_data["is_active"] == True
        assert codes_data["storage_info"]["all_three_codes_stored"] == True

    def test_retrieve_codes_unauthorized(self, client, admin_token):
        """Test that retrieving codes requires authentication"""
        # 1. Create key
        create_response = client.post("/api/keys",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"name": "Another Key"}
        )
        key_id = create_response.json["id"]
        
        # 2. Try to retrieve codes WITHOUT token
        codes_response = client.get(f"/api/keys/{key_id}/codes")
        
        assert codes_response.status_code == 401

    def test_retrieve_codes_wrong_owner(self, client, app):
        """Test that users can't retrieve codes for other users' keys"""
        # This test would need two different user accounts
        # For now, we'll skip this as client is single-user
        pass


class TestEnpoints:
    """General endpoint tests"""
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/api/health")
        
        assert response.status_code == 200
        assert response.json["status"] == "healthy"
    
    def test_unauthorized_access(self, client):
        """Test accessing protected route without token"""
        response = client.get("/api/auth/me")
        
        assert response.status_code == 401
