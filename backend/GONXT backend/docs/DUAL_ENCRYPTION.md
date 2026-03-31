# GONXT Backend - Dual Encryption API Key Verification

## Overview

The GONXT backend uses a **dual encryption system** for API key verification. This allows secure code generation, storage, and verification across multiple systems.

## System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   API KEY GENERATION                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Generate Random Code                                   │
│     └─ 10 characters of garbage (e.g., "hello")           │
│                                                             │
│  2. Create First Encryption (Manufacturers DB)            │
│     └─ Encrypt code → "desk" (stored in Mfg portal)       │
│                                                             │
│  3. Create Second Encryption (API Verification)           │
│     └─ Encrypt code → "polar bear" (for API requests)     │
│                                                             │
│  Storage in GONXT Database:                               │
│  ├─ code_plain = "hello" (STORED)                         │
│  ├─ code_encrypted_db = "desk" (STORED)                   │
│  └─ code_encrypted_api = "polar bear" (STORED)            │
│                                                             │
│  User receives ALL THREE codes at creation                │
│  └─ Can retrieve later with authentication                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              API VERIFICATION REQUEST                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Request from Client/Manufacturer:                         │
│  {                                                          │
│    "code": "polar bear"  ← API verification code          │
│  }                                                          │
│                                                             │
│  1. Decrypt "polar bear" using secret key                 │
│     └─ Result: "hello" (original code)                    │
│                                                             │
│  2. Decrypt stored "code_encrypted_api"                   │
│     └─ Result: "hello" (stored original)                  │
│                                                             │
│  3. Compare decrypted values                              │
│     └─ If match: Verification successful ✓               │
│     └─ If no match: Verification failed ✗                │
│                                                             │
│  4. Return Response:                                       │
│     {                                                      │
│       "verified": true,                                   │
│       "code": "hello",  ← Original code sent back         │
│       "user_id": "...",                                   │
│       "key_name": "My API Key"                           │
│     }                                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### api_keys table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to user |
| `code_plain` | String | **STORED** - Original code (e.g., "hello") |
| `code_encrypted_db` | String | Encrypted for manufacturers DB (e.g., "desk") |
| `code_encrypted_api` | String | Encrypted for API verification (e.g., "polar bear") |
| `name` | String | User-friendly name |
| `description` | Text | Optional description |
| `last_used_at` | DateTime | Tracking |
| `is_active` | Boolean | Enable/disable |
| `created_at` | DateTime | Audit |
| `updated_at` | DateTime | Audit |

**Important:** All three codes are stored in the database for retrieval and management.

## API Endpoints

### Create API Key

**Endpoint:** `POST /api/keys`
**Auth:** Required (JWT token)

**Request:**
```json
{
  "name": "Payment API Key",
  "description": "For processing payments"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Payment API Key",
  "description": "For processing payments",
  "code": "hello",
  "manufacturers_code": "desk",
  "api_verification_code": "polar bear",
  "message": "✓ Codes created and stored in database. Retrieve with authentication.",
  "help": {
    "code": "Original code (e.g., 'hello')",
    "manufacturers_code": "Use in manufacturers portal (e.g., 'desk')",
    "api_verification_code": "Use in API requests (e.g., 'polar bear')"
  },
  "is_active": true,
  "created_at": "2024-01-20T10:00:00"
}
```

### Verify Code (Decryption)

**Endpoint:** `POST /api/keys/verify`
**Auth:** Not required (public endpoint)

**Request:**
```json
{
  "code": "polar bear"
}
```

**Response (200) - Success:**
```json
{
  "verified": true,
  "code": "hello",
  "user_id": "500e8400-e29b-41d4-a716-446655440000",
  "key_name": "Payment API Key",
  "message": "Code verified! Original: hello"
}
```

**Response (401) - Failure:**
```json
{
  "verified": false,
  "error": "Invalid verification code"
}
```

### List API Keys

**Endpoint:** `GET /api/keys`
**Auth:** Required (JWT token)

**Response (200):**
```json
{
  "keys": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Payment API Key",
      "description": "For processing payments",
      "is_active": true,
      "last_used_at": "2024-01-20T10:30:00",
      "created_at": "2024-01-20T10:00:00",
      "updated_at": "2024-01-20T10:00:00"
    }
  ]
}
```

### Get API Key Info

**Endpoint:** `GET /api/keys/{key_id}`
**Auth:** Required (JWT token)

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Payment API Key",
  "description": "For processing payments",
  "is_active": true,
  "last_used_at": "2024-01-20T10:30:00",
  "created_at": "2024-01-20T10:00:00",
  "updated_at": "2024-01-20T10:00:00"
}
```

### Retrieve All Codes

**Endpoint:** `GET /api/keys/{key_id}/codes`
**Auth:** Required (JWT token)

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Payment API Key",
  "description": "For processing payments",
  "code": "hello",
  "code_encrypted_db": "desk",
  "code_encrypted_api": "polar bear",
  "is_active": true,
  "last_used_at": "2024-01-20T10:30:00",
  "created_at": "2024-01-20T10:00:00",
  "storage_info": {
    "all_three_codes_stored": true,
    "code": "Original code (for reference)",
    "code_encrypted_db": "For manufacturers database",
    "code_encrypted_api": "For API verification requests"
  }
}
```

### Delete API Key

**Endpoint:** `DELETE /api/keys/{key_id}`
**Auth:** Required (JWT token)

**Response (200):**
```json
{
  "message": "API key deleted"
}
```

## Encryption Details

### Secret Key

The encryption uses `cryptography.fernet.Fernet` symmetric encryption.

**Key Generation:**
```python
from cryptography.fernet import Fernet
key = Fernet.generate_key()  # Base64-encoded 32-byte key
```

**Environment Setup:**
```bash
# Generate key
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Set in .env
ENCRYPTION_KEY=your_generated_key_here
```

### Encryption Functions

**Generate Random Code:**
```python
from app.utils import generate_random_code

code = generate_random_code(10)  # Returns 10-char random string
# Example: "!@#$%^&*()"
```

**Encrypt Code:**
```python
from app.utils import encrypt_code

encrypted = encrypt_code("hello")  # Returns encrypted string
# Example: "gAAAAABknxyz..."
```

**Decrypt Code:**
```python
from app.utils import decrypt_code

decrypted = decrypt_code("gAAAAABknxyz...")  # Returns "hello"
```

## Security Features

1. **Dual Encryption**
   - Two independent encrypted versions of the same code
   - One for manufacturers portal, one for API verification
   - Prevents reuse of encrypted values

2. **Persistent Storage**
   - All three codes stored in database for retrieval and management
   - Users can retrieve codes later using authenticated endpoint
   - Codes remain in database until key is deleted

3. **Secret Key Protection**
   - Encryption key stored in environment variables
   - Never exposed in logs or responses
   - Must be securely managed in production

4. **Code Verification**
   - Decryption + comparison (not just hash matching)
   - Original code extracted during verification
   - Timestamp tracking of code usage

5. **Database Storage**
   - Only encrypted codes stored
   - No recovery of original code without secret key
   - Unique constraints on encrypted values prevent duplicates

## Implementation Example

### Python Client

```python
import requests

# 1. Login and get token
login_response = requests.post(
    "http://localhost:5000/api/auth/login",
    json={
        "username": "admin",
        "password": "admin@123"
    }
)
access_token = login_response.json()["access_token"]

# 2. Create API key
create_response = requests.post(
    "http://localhost:5000/api/keys",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "name": "My API Key",
        "description": "Test key"
    }
)
api_code = create_response.json()  # Save codes!
print(f"Original: {api_code['code']}")
print(f"Manufacturers: {api_code['manufacturers_code']}")
print(f"API Verification: {api_code['api_verification_code']}")

# 3. Verify code later
verify_response = requests.post(
    "http://localhost:5000/api/keys/verify",
    json={
        "code": api_code['api_verification_code']
    }
)
result = verify_response.json()
print(f"Verified: {result['verified']}")
print(f"Original Code: {result['code']}")
```

### cURL Examples

**Create API Key:**
```bash
curl -X POST http://localhost:5000/api/keys \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Key",
    "description": "Test"
  }'
```

**Verify Code:**
```bash
curl -X POST http://localhost:5000/api/keys/verify \
  -H "Content-Type: application/json" \
  -d '{
    "code": "polar bear"
  }'
```

## Workflow Summary

### For API Users

1. **Create Key:** POST `/api/keys` → Get 3 codes
2. **Save Codes:**
   - `code`: Original (reference)
   - `manufacturers_code`: For manufacturer portal
   - `api_verification_code`: For API requests
3. **Use Code:** Send `api_verification_code` in verify request
4. **Receive:** Original `code` back after successful verification

### For Verification

1. **Request:** Send encrypted code
2. **Decrypt:** Use secret key to decrypt
3. **Compare:** Check against stored encrypted version
4. **Response:** Return original code if match

## Configuration

### Environment Variables

```bash
# Encryption key (required in production)
ENCRYPTION_KEY=your_fernet_key_here

# Flask settings
FLASK_ENV=production
DEBUG=False
SECRET_KEY=your_flask_secret_key

# Database
DATABASE_URL=postgresql://user:pass@host/db

# JWT
JWT_SECRET_KEY=your_jwt_secret_key
```

## Troubleshooting

### Invalid Encryption Key

**Error:** `InvalidToken` during verification

**Solution:**
- Ensure `ENCRYPTION_KEY` is set correctly
- Key must be valid Fernet key (base64-encoded)
- Regenerate if corrupted:
  ```bash
  python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
  ```

### Code Verification Fails

**Error:** `Invalid verification code`

**Solutions:**
- Verify correct encrypted code is being sent
- Check `is_active` flag on API key (must be `true`)
- Ensure encryption key hasn't changed
- Codes are case-sensitive

### Cannot Recover Lost Codes

**Warning:** Codes shown only once!

**Solutions:**
- Generate a new API key
- Delete old key if no longer needed
- Store codes in secure vault initially

## Best Practices

1. **Store Codes Securely**
   - Use secure vaults (AWS Secrets, HashiCorp Vault)
   - Never commit to version control
   - Encrypt when storing

2. **Key Management**
   - Rotate encryption keys periodically
   - Use managed key services in production
   - Implement key versioning

3. **Auditing**
   - Monitor `last_used_at` for suspicious activity
   - Log all verification attempts
   - Alert on repeated failures

4. **Testing**
   - Test key rotation procedures
   - Verify disaster recovery process
   - Load test verification endpoints

## Security Considerations

- **Encryption Algorithm:** Fernet (AES-128 in CBC mode)
- **Key Length:** 128-bit (16 bytes)
- **Timestamp Verification:** Included in Fernet token
- **Tampering Protection:** HMAC-SHA256

For production deployments:
- Use HSM (Hardware Security Module) for key storage
- Implement key rotation policies
- Enable encryption in transit (TLS/HTTPS)
- Monitor and log all verification attempts
