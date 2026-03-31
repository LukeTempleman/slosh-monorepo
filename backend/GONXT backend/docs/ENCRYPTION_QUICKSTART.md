# Dual Encryption API - Quick Start

## What is It?

The GONXT backend uses **dual encryption** to securely generate and verify API codes. Instead of traditional API keys, you get:

1. **Original Code** (e.g., "hello") - Your reference
2. **Manufacturers Code** (e.g., "desk") - For internal databases
3. **API Verification Code** (e.g., "polar bear") - For API requests

## 5-Minute Setup

### 1. Generate Encryption Key

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Copy the output and add to `.env`:
```
ENCRYPTION_KEY=paste_your_key_here
```

### 2. Start the Server

```bash
python run.py
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin@123"
  }'
```

Save the `access_token`.

### 4. Create API Code

```bash
curl -X POST http://localhost:5000/api/keys \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Code",
    "description": "For testing"
  }'
```

**Response:**
```json
{
  "code": "hello",
  "manufacturers_code": "desk",
  "api_verification_code": "polar bear",
  "message": "⚠️ Save these codes immediately! You won't see them again."
}
```

**Save these three codes!**

### 5. Verify Code

```bash
curl -X POST http://localhost:5000/api/keys/verify \
  -H "Content-Type: application/json" \
  -d '{
    "code": "polar bear"
  }'
```

**Response:**
```json
{
  "verified": true,
  "code": "hello",
  "user_id": "...",
  "key_name": "My API Code"
}
```

You got the original code back! ✅

## How It Works

```
CREATE API CODE
│
├─ Generate random code
│  └─ "hello"
│
├─ Encrypt once (Manufacturers DB)
│  └─ "desk"
│
└─ Encrypt again (API Verification)
   └─ "polar bear"

VERIFY CODE
│
├─ Send encrypted code to API
│  └─ "polar bear"
│
├─ API decrypts using secret key
│  └─ "hello"
│
├─ Compare with stored encrypted code
│  └─ Match! ✓
│
└─ Return original code
   └─ "hello"
```

## API Endpoints

### Create Code
```
POST /api/keys
Authorization: Bearer <token>
{
  "name": "Code Name",
  "description": "Optional"
}
```

### Verify Code
```
POST /api/keys/verify
{
  "code": "your_api_verification_code"
}
```

### List Codes
```
GET /api/keys
Authorization: Bearer <token>
```

### Get Code Info
```
GET /api/keys/{code_id}
Authorization: Bearer <token>
```

### Delete Code
```
DELETE /api/keys/{code_id}
Authorization: Bearer <token>
```

## Using with Postman

1. Import `GONXT_API.postman_collection.json`
2. Create environment with variables:
   - `access_token` (auto-filled)
   - `code` (auto-filled)
   - `manufacturers_code` (auto-filled)
   - `api_verification_code` (auto-filled)
3. Run "Login" first
4. Run "Create API Code"
5. Run "Verify Code" with saved code

## Security notes

✅ **Do:**
- Save all three codes securely
- Store in password manager or vault
- Share only manufacturer code with partners
- Rotate codes periodically
- Monitor usage via `last_used_at`

❌ **Don't:**
- Commit codes to version control
- Share codes via email
- Use same code across systems
- Reuse old codes after deletion
- Store in plain text files

## Troubleshooting

### "Invalid verification code"
- Make sure you're using the correct encrypted code (`api_verification_code`)
- Verify `ENCRYPTION_KEY` is set correctly
- Check if code is still active

### Lost codes?
- Generate a new code
- Delete the old one
- Can't recover - always save immediately!

### Encryption key changed?
- Old codes won't verify
- Generate new codes
- Update systems to use new codes

## Testing

```bash
pytest -v -k "encryption"
```

## See Also

- [DUAL_ENCRYPTION.md](DUAL_ENCRYPTION.md) - Full documentation
- [README.md](README.md) - API reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production setup
