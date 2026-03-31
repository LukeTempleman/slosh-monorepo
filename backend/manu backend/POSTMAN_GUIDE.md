# Postman Collection Guide

Complete guide for testing the Slosh Backend API using the Postman collection.

## Import the Collection

1. **Open Postman**
2. **Click Import** (top left)
3. **Select Files** and choose `Slosh_Backend_API.postman_collection.json`
4. **The collection will be imported** with all endpoints organized by category

## Environment Variables

The collection uses these variables that you can customize:

| Variable | Default | Description |
|----------|---------|-------------|
| `baseUrl` | `http://localhost:5000` | API base URL |
| `access_token` | (empty) | JWT token for regular user |
| `admin_token` | (empty) | JWT token for admin user |
| `user_id` | `1` | Target user ID for admin operations |

### Set Variables

In Postman, go to **Variables** tab and update as needed, or copy from response.

## Testing Flow

### 1. Authentication Setup

**Step 1: Register a User**
- Go to `Authentication > Register User`
- Modify the body if desired (username, email, password)
- **Send** the request
- Note the response with user details

**Step 2: Register an Admin** (if needed)
- Go to `Authentication > Register Admin`
- Modify details if desired
- **Send** the request
- Note the admin user ID and response

**Step 3: Login as User**
- Go to `Authentication > Login`
- Ensure credentials match your registered user
- **Send** the request
- **Copy the `access_token`** from response
- **Paste into the Postman variable** `access_token`

**Step 4: Login as Admin**
- Go to `Authentication > Login Admin`
- Ensure credentials match your registered admin
- **Send** the request
- **Copy the `access_token`** from response
- **Paste into the Postman variable** `admin_token`

### 2. Test User Features

**Get Current User Profile**
- Go to `Authentication > Get Current User`
- Click **Send**
- Should show your user profile

**Set Your Secret Key**
- Go to `User Secret Key Management > Set My Secret Key`
- Modify the `secret_key` in the body to your custom key (min 16 chars)
- Click **Send**

**Get Your Secret Key**
- Go to `User Secret Key Management > Get My Secret Key`
- Click **Send**
- Returns your saved secret key

**Generate Your Secret Key**
- Go to `User Secret Key Management > Generate My Secret Key`
- Click **Send**
- Returns an auto-generated key (save it!)

**Reset Your Secret Key**
- Go to `User Secret Key Management > Reset My Secret Key`
- Click **Send**
- Clears your secret key

### 3. Test Admin Features

**List All Users**
- Go to `Admin - User Management > List All Users`
- Click **Send**
- Returns all users in the system
- Note user IDs for operations below

**Update User Role**
- Go to `Admin - User Management > Update User Role`
- Replace `{{user_id}}` placeholder with actual user ID (e.g., change URL to `/admin/users/2/role`)
- Change role in body to `"admin"` or `"user"`
- Click **Send**

**Update User Status**
- Go to `Admin - User Management > Update User Status`
- Replace `{{user_id}}` with target user ID
- Change `is_active` in body to `true` or `false`
- Click **Send**

### 4. Test Admin Secret Key Management

**Set User Secret Key**
- Go to `Admin - User Secret Key Management > Set User Secret Key`
- Replace `{{user_id}}` with target user ID
- Modify `secret_key` in body to your value
- Click **Send**

**Generate User Secret Key**
- Go to `Admin - User Secret Key Management > Generate User Secret Key`
- Replace `{{user_id}}` with target user ID
- Click **Send**
- Returns newly generated key

**Get User Secret Key**
- Go to `Admin - User Secret Key Management > Get User Secret Key`
- Replace `{{user_id}}` with target user ID
- Click **Send**
- Returns user's secret key

**Reset User Secret Key**
- Go to `Admin - User Secret Key Management > Reset User Secret Key`
- Replace `{{user_id}}` with target user ID
- Click **Send**

## Expected Responses

### Successful Login
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true,
    "has_secret_key": false,
    "created_at": "2024-03-25T10:00:00",
    "updated_at": "2024-03-25T10:00:00"
  }
}
```

### Successful Secret Key Set
```json
{
  "message": "Your secret key has been set successfully",
  "user_id": 1,
  "username": "admin"
}
```

### Error Response (e.g., Unauthorized)
```json
{
  "error": "Admin role required"
}
```

## Common Scenarios

### Scenario 1: Create Users and Manage Keys
1. Register User A (username: alice)
2. Register User B (username: bob)
3. Register Admin (username: admin)
4. Login as Admin, copy token to `admin_token`
5. List all users to see IDs
6. Login as Alice, copy token to `access_token`
7. Set Alice's secret key via `/me/secret-key`
8. Login as Admin
9. Get Alice's secret key via `/admin/users/{alice_id}/secret-key`

### Scenario 2: Role Promotion
1. Register testuser as regular user
2. Login as admin, copy token
3. List users to find testuser's ID
4. Use Update User Role endpoint to promote testuser to admin
5. Logout and login as the promoted user

### Scenario 3: Disable User Account
1. Login as admin
2. List users to find target user ID
3. Use Update User Status to set `is_active: false`
4. Try logging in as disabled user (should fail)

## Tips & Troubleshooting

**Token Expired**
- If you get "Invalid or expired token", login again and update the variable

**User Not Found**
- Ensure you're using the correct user ID (get from List All Users response)

**Admin Role Required**
- Ensure you're using `admin_token` for admin endpoints, not regular `access_token`

**Duplicate Username/Email**
- Each username and email must be unique in the system

**Secret Key Too Short**
- Secret keys must be at least 16 characters long

**Secret Key Already in Use**
- Each secret key must be unique across all users

## Docker Usage

If running with Docker:

```bash
# Start the app
docker-compose up -d

# API available at
http://localhost:5000

# View logs
docker-compose logs -f web
```

Then use `http://localhost:5000` as the `baseUrl` variable in Postman.

## API Documentation

For complete endpoint documentation, see [README.md](README.md) in the project.

## Export Results

To save test results in Postman:
1. Run collection via **Runner** (Collection icon > Run)
2. Test results will show pass/fail
3. Export results from runner interface

---

Happy testing! 🚀
