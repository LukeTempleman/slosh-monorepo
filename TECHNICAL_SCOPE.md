# Slosh Platform - Technical Scope

**Document Version:** 1.0  
**Last Updated:** March 31, 2026  
**Organization:** SupportGonxt

---

## Executive Summary

This document defines the technical architecture, technology stack, system components, integrations, and implementation details for the Slosh Platform - an enterprise product authentication and supply chain integrity system.

### System Overview

**Architecture Pattern:** Microservices with monorepo structure  
**Deployment Model:** Containerized (Docker) with multi-environment support  
**Security Model:** Zero-trust with JWT authentication and role-based access control  
**Data Strategy:** PostgreSQL with isolated tenant schemas  
**API Design:** RESTful with JSON payloads  

---

## 1. Technology Stack

### 1.1 Backend Technologies

#### **GONXT Backend Service**
- **Runtime**: Python 3.11+
- **Framework**: Flask 2.3.3
- **Database ORM**: SQLAlchemy 3.0.5
- **Authentication**: Flask-JWT-Extended 4.5.2
- **Database**: PostgreSQL 13+ (psycopg2-binary 2.9.9)
- **Security**: 
  - bcrypt 4.0.1 (password hashing)
  - cryptography 41.0.7 (Fernet encryption)
- **API**: Flask-CORS 4.0.0
- **Config Management**: python-dotenv 1.0.0
- **Testing**: pytest 7.4.2, pytest-cov 4.1.0
- **Serialization**: marshmallow 3.20.1

#### **Manufacturing Backend Service**
- **Runtime**: Python 3.11+
- **Framework**: Flask 2.3.3
- **Database ORM**: SQLAlchemy 3.0.5
- **Authentication**: Flask-JWT-Extended 4.5.2
- **Database**: PostgreSQL 13+ (psycopg2-binary 2.9.7)
- **Server**: Gunicorn 21.2.0 (production)
- **Security**: Werkzeug 2.3.7
- **Config Management**: python-dotenv 1.0.0

### 1.2 Frontend Technologies

#### **All Frontend Applications** (Manufacture, Risk Assessment, NFC Scanner)
- **Framework**: React 18+ with TypeScript
- **UI Components**: shadcn/ui component library
- **UI Primitives**:
  - Table components (sorting, filtering)
  - Button, Badge, Select components
  - Dialog, Toast notifications
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **HTTP Client**: fetch API (native)
- **Build Tool**: Vite (inferred from VITE_API_URL references)

### 1.3 Infrastructure & DevOps

- **Containerization**: Docker 20.10+
- **Orchestration**: Docker Compose 1.29+
- **Version Control**: Git
- **CI/CD**: GitHub Actions (recommended)
- **Monitoring**: Health check endpoints
- **API Testing**: Postman collections included

### 1.4 Database Technology

- **Primary Database**: PostgreSQL 13+
- **Connection Pooling**: SQLAlchemy engine pooling
- **Migrations**: SQLAlchemy with db.create_all() (future: Alembic recommended)
- **Isolation**: Separate databases per service
  - `gonxt_db` - GONXT backend
  - `slosh_manu_db` - Manufacturing backend

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │   Manufacturing  │  │ Risk Assessment  │  │ NFC Scanner  │ │
│  │   Frontend (SPA) │  │  Frontend (SPA)  │  │Frontend (SPA)│ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │                     │                    │         │
│           └─────────────────────┴────────────────────┘         │
│                                 │                              │
│                          REST API (HTTPS)                      │
└─────────────────────────────────┼──────────────────────────────┘
                                  │
┌─────────────────────────────────┼──────────────────────────────┐
│                        API GATEWAY LAYER                        │
│                    (Future: NGINX/API Gateway)                  │
└─────────────────────────────────┼──────────────────────────────┘
                                  │
            ┌─────────────────────┴──────────────────────┐
            │                                            │
┌───────────┼──────────────────┐          ┌──────────────┼────────┐
│  GONXT BACKEND SERVICE       │          │  MANUFACTURING SERVICE │
│  (Port 5000)                 │          │  (Port 5001)           │
├──────────────────────────────┤          ├────────────────────────┤
│                              │          │                        │
│  ┌────────────────────────┐ │          │  ┌──────────────────┐  │
│  │   Auth Controller      │ │          │  │  Auth Controller │  │
│  │   - Register/Login     │ │          │  │  - Register      │  │
│  │   - JWT Management     │ │          │  │  - Login         │  │
│  │   - User CRUD          │ │          │  │  - User Mgmt     │  │
│  └────────────────────────┘ │          │  └──────────────────┘  │
│                              │          │                        │
│  ┌────────────────────────┐ │          │  ┌──────────────────┐  │
│  │   API Key Controller   │ │          │  │ Secret Key Ctrl  │  │
│  │   - Generate Keys      │ │          │  │ - Generate       │  │
│  │   - Dual Encryption    │ │          │  │ - Retrieve       │  │
│  │   - 3-Code System      │ │          │  │ - Update         │  │
│  └────────────────────────┘ │          │  └──────────────────┘  │
│                              │          │                        │
│  ┌────────────────────────┐ │          │  ┌──────────────────┐  │
│  │  Code Verification     │ │          │  │  Batch Services  │  │
│  │  - Public Endpoint     │ │          │  │  (Future API)    │  │
│  │  - Decrypt & Verify    │ │          │  └──────────────────┘  │
│  └────────────────────────┘ │          │                        │
│                              │          └────────────────────────┘
│  ┌────────────────────────┐ │                      │
│  │   Encryption Utils     │ │                      │
│  │   - Fernet Cipher      │ │                      │
│  │   - bcrypt Hashing     │ │          ┌───────────▼──────────┐
│  └────────────────────────┘ │          │   PostgreSQL DB      │
│                              │          │   (slosh_manu_db)    │
└──────────────┬───────────────┘          │                      │
               │                          │   Tables:            │
    ┌──────────▼─────────────┐            │   - users            │
    │   PostgreSQL DB        │            │   - secret_keys      │
    │   (gonxt_db)           │            └──────────────────────┘
    │                        │
    │   Tables:              │
    │   - users              │
    │   - api_keys           │
    │   - codes              │
    └────────────────────────┘
```

### 2.2 Frontend Architecture (All Apps)

```
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND APPLICATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    PAGES LAYER                          │   │
│  │  - Entry points for features                            │   │
│  │  - Orchestrate hooks, services, components              │   │
│  │  - Handle routing and navigation                        │   │
│  └─────────────────┬───────────────────────────────────────┘   │
│                    │                                            │
│  ┌─────────────────▼───────────────────────────────────────┐   │
│  │                   HOOKS LAYER                           │   │
│  │  - Custom React hooks (useBatchManager, etc.)           │   │
│  │  - State management                                     │   │
│  │  - Side effect coordination                             │   │
│  │  - Business logic abstraction                           │   │
│  └─────────────────┬───────────────────────────────────────┘   │
│                    │                                            │
│  ┌─────────────────▼───────────────────────────────────────┐   │
│  │                 SERVICES LAYER                          │   │
│  │  - API communication (batchService, riskService, etc.)  │   │
│  │  - Data transformation                                  │   │
│  │  - Mock data generation (dev/demo)                      │   │
│  │  - Utility functions                                    │   │
│  └─────────────────┬───────────────────────────────────────┘   │
│                    │                                            │
│  ┌─────────────────▼───────────────────────────────────────┐   │
│  │                COMPONENTS LAYER                         │   │
│  │  - Presentation-only (no business logic)                │   │
│  │  - shadcn/ui components (Table, Button, Badge, etc.)    │   │
│  │  - Receive data and callbacks via props                 │   │
│  └─────────────────┬───────────────────────────────────────┘   │
│                    │                                            │
│  ┌─────────────────▼───────────────────────────────────────┐   │
│  │                  TYPES LAYER                            │   │
│  │  - TypeScript interfaces and types                      │   │
│  │  - Domain models                                        │   │
│  │  - API request/response types                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Specifications

### 3.1 GONXT Backend Service

#### **Purpose**
API key generation, dual-encryption code management, and public product verification.

#### **Core Modules**

| Module | File Path | Responsibilities |
|--------|-----------|------------------|
| **Application Factory** | `app/__init__.py` | Flask app creation, config loading, extensions init |
| **Models** | `app/models/` | User, APIKey, Code SQLAlchemy models |
| **Controllers** | `app/controllers/` | Business logic for auth, API keys, codes |
| **Routes** | `app/routes/` | HTTP endpoint definitions |
| **Encryption Utils** | `app/utils/encryption.py` | Fernet cipher, key derivation, encrypt/decrypt |
| **Decorators** | `app/utils/decorators.py` | JWT protection, role-based access |
| **Config** | `config.py` | Environment-based configuration |
| **Entry Point** | `run.py` | Application startup, DB initialization |

#### **Database Schema**

**users table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt
    role VARCHAR(20) DEFAULT 'user',      -- admin, user, viewer
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**api_keys table**
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code_plain VARCHAR(255) NOT NULL,           -- Original code
    code_encrypted_db VARCHAR(512) NOT NULL,    -- For manufacturer DB
    code_encrypted_api VARCHAR(512) NOT NULL,   -- For API verification
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **API Endpoints**

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/health` | GET | None | Service health check |
| `/api/auth/register` | POST | None | User registration |
| `/api/auth/login` | POST | None | JWT token generation |
| `/api/auth/me` | GET | JWT | Current user info |
| `/api/auth/refresh` | POST | Refresh Token | Token refresh |
| `/api/keys` | POST | JWT | Create API key (3 codes) |
| `/api/keys` | GET | JWT | List user's API keys |
| `/api/keys/{id}` | GET | JWT | Get API key details |
| `/api/keys/{id}/codes` | GET | JWT | Retrieve all 3 codes |
| `/api/keys/{id}` | DELETE | JWT | Delete API key |
| `/api/keys/verify` | POST | None (Public) | Verify product code |
| `/api/auth/admin/users` | GET | Admin JWT | List all users |
| `/api/auth/admin/users/{id}/role` | PATCH | Admin JWT | Update user role |
| `/api/auth/admin/users/{id}/status` | PATCH | Admin JWT | Activate/deactivate user |

#### **Encryption Flow**

```python
# Key Generation
def generate_encryption_key(secret_key: str) -> bytes:
    """Derive Fernet key from secret key using PBKDF2"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=b'slosh_salt_2024',
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(secret_key.encode()))

# Encryption
def encrypt_code(code: str, secret_key: str) -> str:
    """Encrypt code using Fernet symmetric encryption"""
    key = generate_encryption_key(secret_key)
    cipher = Fernet(key)
    return cipher.encrypt(code.encode()).decode()

# Decryption
def decrypt_code(encrypted_code: str, secret_key: str) -> str:
    """Decrypt code using Fernet"""
    key = generate_encryption_key(secret_key)
    cipher = Fernet(key)
    return cipher.decrypt(encrypted_code.encode()).decode()
```

---

### 3.2 Manufacturing Backend Service

#### **Purpose**
User authentication, manufacturer-specific secret key management, and future batch management APIs.

#### **Core Modules**

| Module | File Path | Responsibilities |
|--------|-----------|------------------|
| **Application Factory** | `app/__init__.py` | Flask app creation, extensions init |
| **Models** | `app/models/` | User, SecretKey SQLAlchemy models |
| **Controllers** | `app/controllers/` | Auth logic, secret key management |
| **Routes** | `app/routes/` | HTTP endpoint definitions |
| **Decorators** | `app/utils/decorators.py` | JWT protection, admin checks |
| **Config** | `config.py` | Environment configuration |
| **Entry Point** | `run.py` | Application startup |

#### **Database Schema**

**users table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**secret_keys table**
```sql
CREATE TABLE secret_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    secret_key VARCHAR(512) NOT NULL,  -- Manufacturer's encryption key
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **API Endpoints**

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/health` | GET | None | Service health check |
| `/api/auth/register` | POST | None | User registration |
| `/api/auth/login` | POST | None | JWT token generation |
| `/api/auth/me` | GET | JWT | Current user info |
| `/api/auth/me/secret-key` | POST | JWT | Set user's secret key |
| `/api/auth/me/secret-key` | GET | JWT | Get user's secret key |
| `/api/auth/me/secret-key/generate` | POST | JWT | Auto-generate secret key |
| `/api/auth/me/secret-key` | DELETE | JWT | Delete secret key |
| `/api/auth/admin/users` | GET | Admin JWT | List all users |
| `/api/auth/admin/users/{id}/role` | PATCH | Admin JWT | Update user role |
| `/api/auth/admin/users/{id}/status` | PATCH | Admin JWT | Activate/deactivate |
| `/api/auth/admin/users/{id}/secret-key` | POST | Admin JWT | Set user's secret key |
| `/api/auth/admin/users/{id}/secret-key` | GET | Admin JWT | Get user's secret key |

---

### 3.3 Manufacturing Frontend Application

#### **Purpose**
Batch creation, production tracking, quality metrics, and KPI dashboards.

#### **Technology**
React + TypeScript, shadcn/ui components

#### **Domain Models (types/index.ts)**

```typescript
interface Batch {
  id: string;
  name: string;
  productName: string;
  quantity: number;
  status: BatchStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  notes?: string;
}

type BatchStatus = "pending" | "production" | "completed" | "rejected";

interface BatchMetrics {
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  rejectedBatches: number;
  totalProducts: number;
  successRate: number;
}

interface CreateBatchPayload {
  name: string;
  productName: string;
  quantity: number;
  notes?: string;
}
```

#### **Services (services/batchService.ts)**

```typescript
// Mock data generation
function generateMockBatches(): Batch[];

// KPI calculation
function calculateMetrics(batches: Batch[]): BatchMetrics;

// CRUD operations (currently mocked, future API integration)
function createBatch(payload: CreateBatchPayload): Promise<Batch>;
function updateBatchStatus(id: string, status: BatchStatus): Promise<Batch>;
function deleteBatch(id: string): Promise<void>;
```

#### **Hooks (hooks/useBatchManager.ts)**

```typescript
function useBatchManager() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [metrics, setMetrics] = useState<BatchMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load batches on mount
  useEffect(() => { /* ... */ }, []);

  // CRUD operations
  const createBatch = async (payload: CreateBatchPayload) => { /* ... */ };
  const updateStatus = async (id: string, status: BatchStatus) => { /* ... */ };
  const removeBatch = async (id: string) => { /* ... */ };

  return { batches, metrics, loading, error, createBatch, updateStatus, removeBatch };
}
```

#### **Components**

- `MetricsOverview.tsx` - KPI grid (6 metrics)
- `BatchList.tsx` - Data table with filtering, sorting

---

### 3.4 Risk Assessment Frontend Application

#### **Purpose**
Real-time risk monitoring, categorization, scoring, and mitigation recommendations.

#### **Domain Models (types/index.ts)**

```typescript
interface RiskAssessment {
  id: string;
  category: RiskCategory;
  level: RiskLevel;
  title: string;
  description: string;
  score: number;  // 0-100
  factors: RiskFactor[];
  recommendations: string[];
  status: "active" | "mitigated" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

type RiskCategory = "counterfeit" | "quality" | "supply_chain" | "regulatory" | "market";
type RiskLevel = "critical" | "high" | "medium" | "low";

interface RiskFactor {
  name: string;
  impact: number;  // Weight in overall score
}

interface RiskSummary {
  totalRisks: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  averageScore: number;
  trends: RiskTrend[];
}
```

#### **Services (services/riskService.ts)**

```typescript
function generateMockRisks(): RiskAssessment[];
function calculateRiskSummary(risks: RiskAssessment[]): RiskSummary;
function getRiskDistribution(risks: RiskAssessment[]): RiskDistribution;
function mitigateRisk(id: string): Promise<RiskAssessment>;
function resolveRisk(id: string): Promise<RiskAssessment>;
```

#### **Hooks (hooks/useRiskAssessment.ts)**

```typescript
function useRiskAssessment() {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [summary, setSummary] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(false);

  // Load and calculate on mount
  useEffect(() => { /* ... */ }, []);

  const updateRiskStatus = async (id: string, status: "mitigated" | "resolved") => {
    /* ... */
  };

  return { risks, summary, loading, updateRiskStatus };
}
```

---

### 3.5 NFC Scanner Frontend Application

#### **Purpose**
NFC tag reading, product verification, and authenticity confirmation.

#### **Domain Models (types/index.ts)**

```typescript
type ScanResult = "success" | "unmatch" | "unknown";

interface ScanData {
  productId: string;
  encryptedCode: string;
  timestamp: Date;
}

interface VerificationResponse {
  verified: boolean;
  result: ScanResult;
  productInfo?: {
    id: string;
    name: string;
    manufacturer: string;
    batchId: string;
  };
  message: string;
}
```

#### **Services (services/nfcService.ts)**

```typescript
// Parse NDEF records from NFC tag
function parseNDEFRecords(message: NDEFMessage): ScanData;

// Verify product with GONXT backend
async function verifyProduct(productId: string, code: string): Promise<VerificationResponse>;
```

#### **Hooks (hooks/useNFCScanner.ts)**

```typescript
function useNFCScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [lastScan, setLastScan] = useState<ScanData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startScan = async () => {
    if ('NDEFReader' in window) {
      const reader = new NDEFReader();
      await reader.scan();
      reader.addEventListener("reading", handleNFCRead);
    }
  };

  const handleNFCRead = async (event: NDEFReadingEvent) => {
    const scanData = parseNDEFRecords(event.message);
    const result = await verifyProduct(scanData.productId, scanData.encryptedCode);
    setScanResult(result.result);
  };

  return { scanning, scanResult, lastScan, error, startScan };
}
```

---

## 4. Security Architecture

### 4.1 Authentication & Authorization

**JWT Token Structure**
```json
{
  "sub": "user-uuid",
  "username": "john_doe",
  "role": "admin",
  "iat": 1711896000,
  "exp": 1711896900,
  "type": "access"
}
```

**Token Lifecycle**
- Access tokens: 15 minutes expiry
- Refresh tokens: 7 days expiry
- Stored securely (httpOnly cookies recommended for production)

**Role Hierarchy**
1. **Admin**: Full system access, user management, all CRUD operations
2. **User**: Standard operations, own data access, batch/risk management
3. **Viewer**: Read-only access (future role)

### 4.2 Encryption Strategy

**Password Security**
- Algorithm: bcrypt with cost factor 12-14
- Salted automatically
- Never stored in plain text

**Code Encryption (Dual System)**
- Algorithm: Fernet (symmetric encryption, AES128 CBC + HMAC)
- Key derivation: PBKDF2-HMAC-SHA256 with 100,000 iterations
- Two encryption contexts:
  1. **DB Encryption**: For manufacturer database storage
  2. **API Encryption**: For verification API requests

**HTTPS/TLS**
- All API communication over HTTPS in production
- TLS 1.2+ required
- Certificate pinning recommended for mobile apps

### 4.3 Data Protection

**At Rest**
- PostgreSQL with encrypted volumes (AWS RDS encryption, etc.)
- Backups encrypted with AES-256
- Secret keys stored in environment variables (not in code)

**In Transit**
- HTTPS/TLS for all API calls
- JWT tokens in Authorization header
- No sensitive data in query parameters

**PII Handling**
- Email addresses hashed for search indexes
- Username case-insensitive but preserves case
- GDPR compliance: data export and deletion endpoints

---

## 5. API Specifications

### 5.1 API Design Principles

- **RESTful**: Resources identified by URLs, HTTP verbs for actions
- **JSON**: Request and response bodies in JSON format
- **Versioning**: Currently v1 implicit, future: `/api/v2/...`
- **Error Handling**: Consistent error response structure
- **Pagination**: Future implementation for list endpoints
- **Rate Limiting**: 1000 requests/hour per IP for public endpoints

### 5.2 Standard Error Response

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Username or password is incorrect",
    "details": {},
    "timestamp": "2026-03-31T10:30:00Z"
  }
}
```

**HTTP Status Codes**
- `200 OK`: Successful GET, PATCH, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Duplicate resource (e.g., username exists)
- `500 Internal Server Error`: Server-side error

### 5.3 Request/Response Examples

**Create API Key (GONXT)**
```http
POST /api/keys HTTP/1.1
Host: api.slosh.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Production API Key",
  "description": "For batch verification endpoints"
}
```

**Response**
```json
{
  "message": "API key created successfully",
  "api_key": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Production API Key",
    "code_plain": "hx9Kd2mP4q",
    "code_encrypted_db": "gAAAAABh2...",
    "code_encrypted_api": "gAAAAABh3...",
    "created_at": "2026-03-31T10:30:00Z"
  }
}
```

**Verify Product (Public API)**
```http
POST /api/keys/verify HTTP/1.1
Host: api.slosh.com
Content-Type: application/json

{
  "code": "gAAAAABh3..."
}
```

**Response**
```json
{
  "verified": true,
  "code": "hx9Kd2mP4q",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "key_name": "Production API Key",
  "message": "Product code verified successfully"
}
```

---

## 6. Deployment Architecture

### 6.1 Docker Configuration

**docker-compose.global.yml**
```yaml
version: '3.8'

services:
  gonxt_backend:
    build: ./GONXT backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://gonxt_user:password@gonxt_db:5432/gonxt_db
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
    depends_on:
      - gonxt_db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
    networks:
      - gonxt_network

  gonxt_db:
    image: postgres:13
    environment:
      POSTGRES_USER: gonxt_user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: gonxt_db
    volumes:
      - gonxt_db_data:/var/lib/postgresql/data
    networks:
      - gonxt_network

  manu_backend:
    build: ./manu backend
    ports:
      - "5001:5000"
    environment:
      DATABASE_URL: postgresql://manu_user:password@manu_db:5432/slosh_manu_db
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
    depends_on:
      - manu_db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
    networks:
      - manu_network

  manu_db:
    image: postgres:13
    environment:
      POSTGRES_USER: manu_user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: slosh_manu_db
    volumes:
      - manu_db_data:/var/lib/postgresql/data
    networks:
      - manu_network

networks:
  gonxt_network:
    driver: bridge
  manu_network:
    driver: bridge

volumes:
  gonxt_db_data:
  manu_db_data:
```

### 6.2 Environment Variables

**GONXT Backend (.env)**
```bash
FLASK_ENV=production
DATABASE_URL=postgresql://gonxt_user:password@gonxt_db:5432/gonxt_db
JWT_SECRET_KEY=your-secret-key-here
SECRET_KEY=flask-secret-key
ENCRYPTION_SECRET=encryption-key-for-codes
CORS_ORIGINS=https://app.slosh.com,https://verify.slosh.com
```

**Manufacturing Backend (.env)**
```bash
FLASK_ENV=production
DATABASE_URL=postgresql://manu_user:password@manu_db:5432/slosh_manu_db
JWT_SECRET_KEY=your-secret-key-here
SECRET_KEY=flask-secret-key
CORS_ORIGINS=https://manufacture.slosh.com
```

**Frontend (.env.production)**
```bash
VITE_API_URL=https://api.slosh.com
VITE_GONXT_API_URL=https://api.slosh.com
VITE_MANU_API_URL=https://api-manu.slosh.com
```

### 6.3 Deployment Environments

| Environment | Purpose | URL Pattern | Database |
|-------------|---------|-------------|----------|
| **Development** | Local development | localhost:5000/5001 | Local PostgreSQL |
| **Staging** | QA and testing | staging-api.slosh.com | Staging DB (RDS) |
| **Production** | Live system | api.slosh.com | Production DB (RDS) |

---

## 7. Testing Strategy

### 7.1 Backend Testing

**Unit Tests (pytest)**
```python
# tests/test_api.py
def test_register_user(client):
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'SecurePass123'
    })
    assert response.status_code == 201
    assert 'user' in response.json

def test_create_api_key(client, auth_token):
    response = client.post('/api/keys', 
        headers={'Authorization': f'Bearer {auth_token}'},
        json={'name': 'Test Key'}
    )
    assert response.status_code == 201
    assert 'code_plain' in response.json['api_key']
```

**Integration Tests (Postman Collections)**
- `Code_Generation_Flow_Collection.postman_collection.json` (50+ tests)
- `Slosh_Multi_Backend_Collection.postman_collection.json`
- Automated token management
- Environment variable management
- Response validation

### 7.2 Frontend Testing (Future)

**Unit Tests (Jest + React Testing Library)**
```typescript
// hooks/useBatchManager.test.ts
test('creates batch successfully', async () => {
  const { result } = renderHook(() => useBatchManager());
  
  await act(async () => {
    await result.current.createBatch({
      name: 'Test Batch',
      productName: 'Product A',
      quantity: 100
    });
  });
  
  expect(result.current.batches).toHaveLength(1);
});
```

**E2E Tests (Playwright/Cypress)**
- User login flow
- Batch creation workflow
- Risk assessment viewing
- NFC scanning simulation

### 7.3 Test Coverage Goals

- Backend: 80%+ code coverage
- Frontend services: 70%+ coverage
- Critical paths: 100% coverage (auth, encryption, verification)

---

## 8. Performance Requirements

### 8.1 Response Time Targets

| Endpoint Type | Target | Acceptable |
|---------------|--------|------------|
| Health checks | < 100ms | < 200ms |
| Authentication | < 500ms | < 1s |
| API key creation | < 1s | < 2s |
| Verification (public) | < 300ms | < 500ms |
| List operations | < 500ms | < 1s |
| NFC scan to result | < 3s | < 5s |

### 8.2 Scalability Targets

- **Concurrent Users**: 10,000+ simultaneous users
- **Verifications/Second**: 1,000 TPS
- **Database Connections**: 100 pooled connections per service
- **Storage**: 1TB initial, 10TB within 3 years
- **Batch Creation Rate**: 10,000 batches/day

### 8.3 Availability SLA

- **Uptime**: 99.9% (8.76 hours downtime/year)
- **Planned Maintenance**: Monthly window (2 hours max)
- **Disaster Recovery**: RPO 1 hour, RTO 4 hours

---

## 9. Monitoring & Observability

### 9.1 Health Checks

All services expose `/api/health` endpoint:
```json
{
  "status": "healthy",
  "service": "gonxt-backend",
  "version": "1.0.0",
  "database": "connected",
  "timestamp": "2026-03-31T10:30:00Z"
}
```

### 9.2 Logging Strategy

**Log Levels**
- `DEBUG`: Development troubleshooting
- `INFO`: Normal operations (user actions, API calls)
- `WARNING`: Recoverable errors
- `ERROR`: Failures requiring attention
- `CRITICAL`: System-wide failures

**Log Format (JSON)**
```json
{
  "timestamp": "2026-03-31T10:30:00.123Z",
  "level": "INFO",
  "service": "gonxt-backend",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "endpoint": "/api/keys",
  "method": "POST",
  "status_code": 201,
  "duration_ms": 234,
  "message": "API key created successfully"
}
```

### 9.3 Metrics (Future: Prometheus)

- Request rate (req/sec)
- Error rate (4xx, 5xx)
- Response time (p50, p95, p99)
- Database connection pool usage
- JWT token generation rate
- Verification success/failure rates

### 9.4 Alerting (Future: PagerDuty/Opsgenie)

- Service downtime (health check failures)
- Error rate > 5%
- Response time > 2s (p95)
- Database connection pool exhaustion
- Disk space < 20%

---

## 10. Integration Points

### 10.1 Current Integrations

**None (Standalone System)**

### 10.2 Future Integrations

| System | Type | Purpose |
|--------|------|---------|
| **ERP Systems** | Bidirectional | Batch data sync (SAP, Oracle) |
| **Blockchain** | Outbound | Immutable audit trail |
| **IoT Sensors** | Inbound | Real-time environmental data |
| **Payment Gateways** | Outbound | Subscription billing |
| **SMS/Email** | Outbound | Notifications and alerts |
| **ML Platform** | Bidirectional | Risk prediction models |
| **Mobile SDKs** | Library | Third-party app integration |

---

## 11. Development Workflow

### 11.1 Local Development Setup

**Backend**
```bash
# GONXT Backend
cd "backend/GONXT backend"
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py

# Manufacturing Backend
cd "backend/manu backend"
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

**Frontend**
```bash
# Any frontend app
cd apps/manufacture  # or risk-assessment, nfc-scanner
npm install
npm run dev
```

### 11.2 Git Workflow

**Branch Strategy**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature development
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

**Commit Convention**
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(gonxt): add API key rotation endpoint

Implement automatic API key rotation with 90-day expiry.
Includes migration script and admin notification.

Closes #123
```

### 11.3 Code Review Process

1. Create feature branch
2. Implement changes
3. Run tests locally
4. Create pull request
5. Automated CI checks (tests, linting)
6. Peer code review (1+ approvals)
7. Merge to develop
8. Deploy to staging
9. QA validation
10. Merge to main
11. Production deployment

---

## 12. Technical Constraints & Limitations

### 12.1 Current Limitations

- **No Real-Time Updates**: Frontend requires manual refresh (WebSockets future)
- **Mock Data**: Frontend apps use mock services (backend APIs not integrated)
- **Single Region**: No multi-region deployment
- **Manual Scaling**: No auto-scaling configured
- **Limited Search**: No full-text search (PostgreSQL basic queries only)
- **No Caching**: Redis not implemented
- **Synchronous Processing**: No background job queue

### 12.2 Technical Debt

- **Database Migrations**: Using `db.create_all()` instead of Alembic
- **Frontend Testing**: No test suites implemented
- **API Documentation**: No OpenAPI/Swagger spec
- **Logging**: Console logs only (no centralized logging)
- **Metrics**: No Prometheus/Grafana integration
- **CI/CD**: Manual Docker builds (no GitHub Actions)

### 12.3 Browser/Device Compatibility

**Frontend**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**NFC Scanner**
- Android 10+ with NFC
- Chrome on Android (Web NFC API)
- iOS: Not supported (Safari doesn't support Web NFC) - QR fallback needed

---

## 13. Technical Roadmap

### 13.1 Q2 2026 (Next 3 months)

- [ ] Integrate frontend apps with backend APIs
- [ ] Implement Alembic database migrations
- [ ] Add Redis caching layer
- [ ] Setup GitHub Actions CI/CD
- [ ] Generate OpenAPI documentation
- [ ] Implement comprehensive logging (structured JSON)

### 13.2 Q3 2026 (3-6 months)

- [ ] Add Celery for background jobs
- [ ] Implement WebSocket real-time updates
- [ ] Setup Prometheus + Grafana monitoring
- [ ] Add full-text search (Elasticsearch)
- [ ] Horizontal scaling with Kubernetes
- [ ] Multi-region deployment

### 13.3 Q4 2026 (6-12 months)

- [ ] Blockchain integration (Hyperledger/Ethereum)
- [ ] Machine learning risk prediction models
- [ ] GraphQL API layer
- [ ] Mobile native apps (React Native)
- [ ] Advanced analytics engine
- [ ] IoT sensor integrations

---

## 14. Dependencies & Third-Party Services

### 14.1 Runtime Dependencies

**Backend (Python)**
- Flask 2.3.3 (Web framework)
- SQLAlchemy 3.0.5 (ORM)
- Flask-JWT-Extended 4.5.2 (Authentication)
- psycopg2-binary 2.9.9 (PostgreSQL driver)
- bcrypt 4.0.1 (Password hashing)
- cryptography 41.0.7 (Encryption)

**Frontend (JavaScript/TypeScript)**
- React 18+ (UI framework)
- TypeScript 5+ (Type safety)
- Vite (Build tool)
- shadcn/ui (Component library)

**Infrastructure**
- PostgreSQL 13+ (Database)
- Docker 20.10+ (Containerization)
- Docker Compose 1.29+ (Orchestration)

### 14.2 Development Dependencies

- pytest 7.4.2 (Testing)
- pytest-cov 4.1.0 (Code coverage)
- Postman (API testing)
- Git (Version control)

### 14.3 Future Services

- AWS RDS (Managed PostgreSQL)
- AWS S3 (File storage)
- AWS CloudFront (CDN)
- SendGrid (Email)
- Twilio (SMS)
- Stripe (Payments)
- Auth0 (Enterprise SSO)

---

## 15. Security Considerations

### 15.1 OWASP Top 10 Mitigation

| Vulnerability | Mitigation |
|---------------|------------|
| **Injection** | Parameterized queries (SQLAlchemy ORM) |
| **Broken Auth** | JWT tokens, bcrypt passwords, MFA (future) |
| **Sensitive Data Exposure** | HTTPS, encrypted DB fields, no logs |
| **XML External Entities** | N/A (JSON only) |
| **Broken Access Control** | RBAC, JWT validation, decorator checks |
| **Security Misconfiguration** | Environment-based configs, no defaults |
| **XSS** | React auto-escaping, CSP headers |
| **Insecure Deserialization** | JSON schema validation |
| **Components with Known Vulnerabilities** | Dependabot, regular updates |
| **Insufficient Logging** | Structured logging, audit trails |

### 15.2 Security Best Practices

- **Secret Management**: Environment variables, never in code
- **Least Privilege**: Minimal database permissions per service
- **Input Validation**: Server-side validation on all inputs
- **Output Encoding**: Prevent XSS attacks
- **CORS**: Whitelist allowed origins
- **Rate Limiting**: Prevent brute force and DDoS
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.

---

## 16. Glossary

| Term | Definition |
|------|------------|
| **API Key** | Unique identifier for authentication and authorization |
| **Batch** | A production run of products |
| **Code (Plain)** | Unencrypted original verification code |
| **Code (DB)** | Encrypted code for manufacturer database storage |
| **Code (API)** | Encrypted code for API verification requests |
| **Dual Encryption** | Two-layer encryption system (DB + API) |
| **JWT** | JSON Web Token for stateless authentication |
| **NFC** | Near-Field Communication for contactless data transfer |
| **RBAC** | Role-Based Access Control |
| **Secret Key** | Manufacturer-specific encryption key |
| **Risk Score** | 0-100 weighted assessment of risk level |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-31 | System Analysis | Initial technical scope document |

---

**For technical questions, contact:** engineering@supportgonxt.com
