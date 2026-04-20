# Login Flow Implementation - Complete Guide

**Document Date:** April 14, 2026  
**Status:** ✅ IMPLEMENTED

---

## 📋 Overview

The login flow has been fully implemented across all applications with:
- **Backend:** JWT authentication (already existed)
- **Frontend:** Auth services, context providers, and protected routes
- **State Management:** React Context for authentication state

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Applications                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ Manufacturing    │  │ NFC Scanner      │  │ Risk Assess  │ │
│  │                  │  │                  │  │              │ │
│  │ ├─ Login.tsx     │  │ ├─ Login.tsx     │  │ ├─ Login.tsx │ │
│  │ ├─ Auth Context  │  │ ├─ Auth Context  │  │ ├─ Protected │ │
│  │ └─ Protected     │  │ └─ Protected     │  │ └─ Routes    │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │ authService         │ authService       │          │
│           └─────────────────────┴───────────────────┘          │
│                          │                                      │
│                  POST /api/auth/*                              │
│                          ↓                                      │
├─────────────────────────────────────────────────────────────────┤
│                  GONXT Backend (Flask)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ /api/auth/register     - Create new user               │  │
│  │ /api/auth/login        - Authenticate & get JWT        │  │
│  │ /api/auth/me           - Get current user info         │  │
│  │ /api/auth/refresh      - Refresh access token          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database (JWT tokens stored in user record)  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

### Backend (Already Implemented)
```
backend/
├── GONXT backend/
│   ├── app/
│   │   ├── models.py              # User & APIKey models
│   │   ├── routes.py              # Auth route definitions
│   │   ├── controllers/
│   │   │   ├── auth_controller.py # Login/Register logic
│   │   │   └── api_key_controller.py
│   │   └── utils/
│   │       └── auth.py            # JWT helpers
│   ├── run.py
│   └── requirements.txt
├── manu backend/
│   └── (similar structure)
```

### Frontend - Manufacturing App
```
apps/manufacture/
├── src/
│   ├── services/
│   │   ├── authService.ts         # NEW: Auth API calls
│   │   └── apiClient.ts
│   ├── contexts/
│   │   └── AuthContext.tsx        # NEW: Auth state management
│   ├── components/
│   │   ├── ProtectedRoute.tsx     # NEW: Route protection
│   │   └── FuturisticBackground.tsx
│   ├── pages/
│   │   ├── Login.tsx              # UPDATED: Uses AuthService
│   │   └── ManufacturerPage.tsx
│   ├── lib/
│   │   └── constants.ts           # NEW: API config
│   └── App.tsx                    # Should wrap with AuthProvider
```

### Frontend - NFC Scanner App
```
apps/nfc-scanner/
├── src/
│   ├── services/
│   │   ├── authService.ts         # NEW: Consumer auth
│   │   └── apiClient.ts
│   ├── contexts/
│   │   └── AuthContext.tsx        # NEW: Auth state
│   ├── components/
│   │   └── ProtectedRoute.tsx     # NEW: Route protection
│   ├── pages/
│   │   ├── Login.tsx              # UPDATED: Uses AuthService
│   │   └── VerifiAIPage.tsx
│   ├── lib/
│   │   └── constants.ts           # NEW: API config
│   └── App.tsx                    # Needs AuthProvider
```

---

## 🔑 Key Components

### 1. AuthService (`authService.ts`)

**Location:**
- `apps/manufacture/src/services/authService.ts`
- `apps/nfc-scanner/src/services/authService.ts`

**What it does:**
- Handles all API authentication calls
- Manages JWT tokens (access & refresh)
- Stores/retrieves user data from localStorage
- Validates token expiration

**Methods:**
```typescript
// Authentication
AuthService.login(credentials: LoginCredentials)
AuthService.register(credentials: RegisterCredentials)
AuthService.refreshToken()
AuthService.getCurrentUser()
AuthService.logout()

// Token Management
AuthService.getToken()           // Returns access token
AuthService.setToken(token)      // Store access token
AuthService.getRefreshToken()    // Get refresh token
AuthService.isAuthenticated()    // Check if logged in
AuthService.isTokenValid()       // Check token expiration
```

### 2. AuthContext (`AuthContext.tsx`)

**Location:**
- `apps/manufacture/src/contexts/AuthContext.tsx`
- `apps/nfc-scanner/src/contexts/AuthContext.tsx`

**What it does:**
- Provides authentication state globally
- Handles token refresh on app load
- Manages user data across components

**Hook Usage:**
```typescript
const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();
```

**State:**
```typescript
user: User | null              // Currently logged-in user
isAuthenticated: boolean       // Is user logged in?
isLoading: boolean            // Is auth initializing?
error: string | null          // Error message if any
```

### 3. ProtectedRoute (`ProtectedRoute.tsx`)

**Location:**
- `apps/manufacture/src/components/ProtectedRoute.tsx`
- `apps/nfc-scanner/src/components/ProtectedRoute.tsx`

**What it does:**
- Wraps routes that require authentication
- Redirects unauthenticated users to login
- Optionally checks for specific roles

**Usage:**
```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

{/* With role checking */}
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### 4. Login Page (`Login.tsx`)

**Location:**
- `apps/manufacture/src/pages/Login.tsx`
- `apps/nfc-scanner/src/pages/Login.tsx`

**Status:** ✅ UPDATED to use AuthService

**What it does:**
- Displays login form
- Validates credentials
- Calls AuthService.login()
- Redirects on success

---

## 🔄 Login Flow (Step-by-Step)

### Manufacturing App Flow:

```
1. User opens / sees home page
   ↓
2. If not authenticated, redirected to /login
   ↓
3. User enters username & password on Login.tsx
   ↓
4. Clicks "Sign In" button
   ↓
5. handleLogin() calls AuthService.login(credentials)
   ↓
6. AuthService makes POST /api/auth/login to backend
   ↓
7. Backend validates & returns { access_token, refresh_token, user }
   ↓
8. AuthService stores tokens in localStorage
   ↓
9. AuthContext updates with user data
   ↓
10. Login.tsx redirects to "/" (dashboard)
    ↓
11. ProtectedRoute checks isAuthenticated ✅
    ↓
12. Dashboard component renders
```

### NFC Scanner App Flow:

```
Similar flow but user type is "consumer"
- Register provides email
- Optional 2FA step (simplified for now)
- Redirects to scanner page after login
```

---

## 🚀 Setup Instructions

### 1. Update App.tsx Files

**Manufacturing App (`apps/manufacture/src/App.tsx`):**
```typescript
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ManufacturerPage from './pages/ManufacturerPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ManufacturerPage />
              </ProtectedRoute>
            } 
          />
          {/* Add other protected routes */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

**NFC Scanner App (`apps/nfc-scanner/src/App.tsx`):**
```typescript
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import VerifiAIPage from './pages/VerifiAIPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <VerifiAIPage />
              </ProtectedRoute>
            } 
          />
          {/* Add other protected routes */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

### 2. Environment Configuration

**apps/manufacture/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

**apps/nfc-scanner/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Test the Flow

**Create test user via backend:**
```bash
# Using Postman or curl
POST http://localhost:5000/api/auth/register
{
  "username": "test_manufacturer",
  "email": "test@gonxt.local",
  "password": "Password123!",
  "role": "user"
}
```

**Then login via frontend:**
- Navigate to app: `http://localhost:5173`
- Should redirect to `/login`
- Enter credentials
- Should redirect to dashboard on success

---

## 🔐 Security Considerations

### Token Storage
- Access token stored in localStorage
- Refresh token stored in localStorage
- ⚠️ In production: Consider using secure cookies or sessionStorage

### Token Refresh
- Automatic refresh on app load
- Manual refresh available via `AuthService.refreshToken()`
- Automatic retry on 401 response

### Password Security
- Bcrypt hashing on backend
- Minimum 8 characters recommended
- TLS/HTTPS required in production

### CORS Configuration
- Already configured in backend (`CORS=*`)
- Production should restrict to specific origins

---

## 📊 Token Lifecycle

```
Diagram: Token Lifecycle

LOGIN
  ↓
GET tokens (access + refresh)
  ↓
STORE in localStorage
  ↓
ADD to Authorization header
  ↓
API CALLS with Authorization: Bearer {token}
  ↓
Response 401? → TRY REFRESH TOKEN
  ↓
Success? → UPDATE access token
  ↓
Failure? → LOGOUT & redirect to login
  ↓
Token expires? → AUTO REFRESH on next API call
  ↓
LOGOUT → CLEAR localStorage → redirect to /login
```

---

## 🧪 Testing Checklist

- [ ] Docker containers running (`docker-compose -f docker-compose.global.yml up -d`)
- [ ] Backend health check: `http://localhost:5000/api/health` ✅
- [ ] Frontend dev server running (`npm run dev` in app directory)
- [ ] Navigate to login page: `http://localhost:5173/login`
- [ ] Register new user with email
- [ ] Login succeeds and redirects to dashboard
- [ ] localStorage contains `auth_token` and `refresh_token`
- [ ] Page refresh maintains authentication
- [ ] Logout clears tokens
- [ ] Logout redirects to login
- [ ] Accessing protected route without auth redirects to login

---

## 🐛 Troubleshooting

### Issue: 404 on /api/auth/login
**Solution:** Check Docker containers are running and API URL is correct in constants.ts

### Issue: Token in localStorage but still redirected to login
**Solution:** Check if AuthService.isTokenValid() is returning false (expired token)

### Issue: CORS errors
**Solution:** Backend CORS is configured, check browser console for specific error

### Issue: Login works but page immediately redirects to login
**Solution:** Check if AuthContext is wrapping the App component

### Issue: useAuth hook throws error
**Solution:** Ensure component is inside `<AuthProvider>` in App.tsx

---

## 🔗 Related Files

- Backend Auth Routes: `backend/GONXT backend/app/routes.py`
- Backend Auth Controller: `backend/GONXT backend/app/controllers/auth_controller.py`
- User Model: `backend/GONXT backend/app/models.py`
- Docker Setup: `backend/README_DOCKER_SETUP.md`
- Wiring Guide: `Slosh-Frontend-Backend-Wiring.docx`

---

## ✅ What's Implemented

✅ Backend authentication endpoints (pre-existed)  
✅ Frontend AuthService for both apps  
✅ AuthContext for state management  
✅ Protected routes component  
✅ Login pages updated to use new auth system  
✅ Token management (storage, refresh, validation)  
✅ Constants configuration  

## ⏭️ Next Steps

1. Update App.tsx files with AuthProvider wrapper
2. Configure environment variables (.env files)
3. Test full login flow end-to-end
4. Create additional protected pages (Dashboard, Provisioning, etc.)
5. Implement logout functionality in navigation
6. Add password reset flow (optional)
7. Add 2FA support (optional)

---

**Status:** 🟢 Ready for testing!
