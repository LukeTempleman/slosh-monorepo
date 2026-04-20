# Login Debugging Guide

**Issue:** Login accepts any email/username and password

---

## 🔍 **Step 1: Check Browser Console Logs**

1. Open your browser's Developer Tools (`F12`)
2. Go to **Console** tab
3. Try to login with invalid credentials
4. Look for logs like:
   - `📝 Attempting login with: testuser`
   - `❌ Login error: Invalid credentials` or similar

**Expected behavior:** You should see error messages

---

## 🔍 **Step 2: Test Backend Directly (Using Postman or curl)**

### Test 1: Register a user first
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "TestPassword123!",
    "role": "user"
  }'
```

**Expected response:** Status 201 with user data

### Test 2: Try login with WRONG password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "WrongPassword123!"
  }'
```

**Expected response:** ❌ Status 401 with error message like `"Invalid credentials"`

### Test 3: Try login with CORRECT password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "TestPassword123!"
  }'
```

**Expected response:** ✅ Status 200 with access_token, refresh_token, and user data

---

## 🔍 **Step 3: Check Backend Logs**

### View Docker container logs
```bash
docker logs -f gonxt_flask
```

Look for:
- `POST /api/auth/login` entries
- Any Python errors
- Database connection messages

---

## ⚠️ **Common Issues & Fixes**

### Issue 1: Backend returning 200 for any credentials
**Cause:** Backend validation not working properly  
**Fix:** Check backend's `auth_controller.py` to ensure `check_password()` is being called

### Issue 2: Frontend redirecting even with wrong credentials
**Cause:** Error not being caught properly  
**Fix:** Check if `AuthService.login()` is throwing errors correctly

### Issue 3: No users in database
**Cause:** Never registered any users  
**Fix:** Create test users using curl commands above

### Issue 4: API URL pointing to wrong backend
**Cause:** Constants pointing to wrong port  
**Fix:** Verify `apps/manufacture/src/lib/constants.ts` and `apps/nfc-scanner/src/lib/constants.ts`

---

## ✅ **Testing Checklist**

- [ ] Docker containers running (`docker ps`)
- [ ] Backend responding to health check: `http://localhost:5000/api/health`
- [ ] Can register user via curl (gets status 201)
- [ ] Wrong password rejected via curl (gets status 401)
- [ ] Correct password accepted via curl (gets status 200)
- [ ] Browser console shows error messages on invalid login
- [ ] Frontend login page shows red error text
- [ ] Frontend redirects only on successful login

---

## 📋 **Verification Steps**

**1. Check if users exist in database:**
```bash
docker exec -it gonxt_postgres psql -U gonxt_user -d gonxt_db
  \dt users;
  SELECT * FROM users;
  \q
```

**2. Check if tokens are being created:**
```bash
# After successful login, check localStorage:
localStorage.getItem('auth_token')
localStorage.getItem('user')
```

Should return actual token data, not empty/null.

---

## 🚨 **If Everything Fails**

1. **Restart containers:**
   ```bash
   docker-compose -f docker-compose.global.yml down
   docker-compose -f docker-compose.global.yml up -d
   ```

2. **Check container health:**
   ```bash
   docker ps  # All containers should show "Up"
   docker-compose logs  # Check for startup errors
   ```

3. **Clear browser data:**
   - Clear localStorage: `localStorage.clear()`
   - Clear session storage
   - Hard refresh: `Ctrl+Shift+R`

4. **Check CORS:**
   - Backend should allow requests from frontend
   - Check for CORS errors in browser console

---

## 📞 **Need Help?**

Run these commands to get full diagnostic info:

```bash
# Backend health
curl -v http://localhost:5000/api/health

# Backend logs
docker logs gonxt_flask

# Database connection
docker exec -it gonxt_postgres psql -U gonxt_user -d gonxt_db -c "SELECT COUNT(*) FROM users;"

# Container status
docker-compose ps
```

Share the output of these commands for proper debugging.

---

**Status:** Run through the checklist and report which step fails ❌
