# Manufacturing Backend - Batches API Documentation

## Overview
The Batches API provides endpoints for retrieving and filtering batch data for the manufacturing system. All endpoints require JWT authentication.

---

## Authentication
All endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

To obtain a token, use the `/auth/login` endpoint first.

---

## Endpoints

### GET `/api/batches`

Retrieve filtered batch data with JWT authentication.

#### Authentication
- **Required**: Yes (JWT token)
- **Role**: Any authenticated user

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `status` | string | No | Filter by batch status | `pending`, `production`, `completed`, `rejected` |
| `created_at_from` | string | No | Filter batches created from this date (ISO format) | `2026-04-01` |
| `created_at_to` | string | No | Filter batches created until this date (ISO format) | `2026-04-15` |
| `quality_score_min` | number | No | Minimum quality score (0-100) | `80` |
| `quality_score_max` | number | No | Maximum quality score (0-100) | `95` |
| `risk_level` | string | No | Filter by risk level | `low`, `medium`, `high` |
| `limit` | number | No | Max results to return (default: 100, max: 500) | `50` |
| `offset` | number | No | Pagination offset (default: 0) | `100` |

#### Request Examples

**Basic request (all batches):**
```bash
curl -X GET http://localhost:5001/api/batches \
  -H "Authorization: Bearer <jwt_token>"
```

**Filter by status:**
```bash
curl -X GET "http://localhost:5001/api/batches?status=completed" \
  -H "Authorization: Bearer <jwt_token>"
```

**Filter by date range:**
```bash
curl -X GET "http://localhost:5001/api/batches?created_at_from=2026-04-01&created_at_to=2026-04-15" \
  -H "Authorization: Bearer <jwt_token>"
```

**Filter by quality score:**
```bash
curl -X GET "http://localhost:5001/api/batches?quality_score_min=80&quality_score_max=95" \
  -H "Authorization: Bearer <jwt_token>"
```

**Filter by risk level:**
```bash
curl -X GET "http://localhost:5001/api/batches?risk_level=high" \
  -H "Authorization: Bearer <jwt_token>"
```

**Combined filters with pagination:**
```bash
curl -X GET "http://localhost:5001/api/batches?status=production&risk_level=medium&quality_score_min=75&limit=50&offset=0" \
  -H "Authorization: Bearer <jwt_token>"
```

#### Response Format

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "BN001",
      "product_name": "Jameson Irish Whiskey",
      "quantity": 5000,
      "status": "production",
      "quality_score": 92.5,
      "risk_level": "low",
      "location": "Johannesburg",
      "created_at": "2026-04-10T14:30:00",
      "updated_at": "2026-04-15T09:45:00",
      "created_by": 1,
      "notes": "Standard production batch"
    },
    {
      "id": "BN002",
      "product_name": "Chivas Regal 12 Year",
      "quantity": 3200,
      "status": "production",
      "quality_score": 88.3,
      "risk_level": "medium",
      "location": "Cape Town",
      "created_at": "2026-04-12T10:15:00",
      "updated_at": "2026-04-14T16:20:00",
      "created_by": 1,
      "notes": "Quality control passed"
    }
  ],
  "pagination": {
    "total": 145,
    "limit": 50,
    "offset": 0,
    "returned": 2
  },
  "filters_applied": {
    "status": "production",
    "created_at_from": null,
    "created_at_to": null,
    "quality_score_min": null,
    "quality_score_max": null,
    "risk_level": "medium"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid status. Must be one of: pending, production, completed, rejected"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Missing Authorization Header"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Error retrieving batches: [error details]"
}
```

---

### GET `/api/manufacturers/batches/:id`

Retrieve a single batch with all details including quality score, risk level, status, and notes.

#### Authentication
- **Required**: Yes (JWT token)
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | Yes | Batch ID (case-insensitive) | `BN0001` |

#### Request Examples

**Fetch a specific batch:**
```bash
curl -X GET http://localhost:5001/api/manufacturers/batches/BN0001 \
  -H "Authorization: Bearer <jwt_token>"
```

**Case-insensitive lookup:**
```bash
curl -X GET http://localhost:5001/api/manufacturers/batches/bn0001 \
  -H "Authorization: Bearer <jwt_token>"
```

#### Success Response (200 OK)

```json
{
  "message": "Batch retrieved successfully",
  "batch": {
    "id": "BN0001",
    "product_name": "Grey Goose Vodka",
    "quantity": 6073,
    "status": "production",
    "quality_score": 73.47,
    "risk_level": "medium",
    "location": "Cape Town",
    "created_at": "2026-04-12T08:30:15",
    "updated_at": "2026-04-14T16:45:22",
    "created_by": 1,
    "notes": "Sample batch for testing. Status: production"
  }
}
```

#### Error Responses

**404 Not Found (Batch doesn't exist):**
```json
{
  "error": "Batch BN9999 not found"
}
```

**400 Bad Request (Invalid ID format):**
```json
{
  "error": "Invalid batch ID format"
}
```

**401 Unauthorized:**
```json
{
  "error": "Missing or invalid Authorization header"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error retrieving batch: [error details]"
}
```

---

### POST `/api/manufacturers/batches`

Create a new batch. Status is automatically set to `pending` and the batch is linked to the authenticated user.

#### Authentication
- **Required**: Yes (JWT token)
- **Role**: Any authenticated user

#### Request Body

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|------------|
| `product_name` | string | Yes | Name of the product | Max 255 chars, cannot be empty |
| `quantity` | integer | Yes | Number of units | Must be > 0 |
| `location` | string | No | Geographic location | Max 255 chars |
| `quality_score` | number | No | Quality score (default: 0) | 0-100 |
| `risk_level` | string | No | Risk level (default: "low") | `low`, `medium`, `high` |
| `notes` | string | No | Additional notes | Max 1000 chars |

#### Request Examples

**Create batch with minimum required fields:**
```bash
curl -X POST http://localhost:5001/api/manufacturers/batches \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Vodka Test",
    "quantity": 500
  }'
```

**Create batch with all fields:**
```bash
curl -X POST http://localhost:5001/api/manufacturers/batches \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Patron Silver Tequila",
    "quantity": 2500,
    "location": "Johannesburg",
    "quality_score": 95.5,
    "risk_level": "low",
    "notes": "Premium batch for retail distribution"
  }'
```

#### Success Response (201 Created)

```json
{
  "message": "Batch created successfully",
  "batch": {
    "id": "BN0031",
    "product_name": "Patron Silver Tequila",
    "quantity": 2500,
    "status": "pending",
    "quality_score": 95.5,
    "risk_level": "low",
    "location": "Johannesburg",
    "created_at": "2026-04-15T14:30:00",
    "updated_at": "2026-04-15T14:30:00",
    "created_by": 2,
    "notes": "Premium batch for retail distribution"
  }
}
```

#### Error Responses

**400 Bad Request (Missing required field):**
```json
{
  "error": "product_name is required and cannot be empty"
}
```

**400 Bad Request (Invalid quantity):**
```json
{
  "error": "quantity must be a positive integer"
}
```

**400 Bad Request (Invalid quality_score):**
```json
{
  "error": "quality_score must be between 0 and 100"
}
```

**400 Bad Request (Invalid risk_level):**
```json
{
  "error": "risk_level must be one of: low, medium, high"
}
```

**400 Bad Request (Field too long):**
```json
{
  "error": "product_name must not exceed 255 characters"
}
```

**401 Unauthorized:**
```json
{
  "error": "Missing or invalid Authorization header"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error creating batch: [error details]"
}
```

---

### PATCH `/api/manufacturers/batches/:id`

Update batch details including status, quality score, risk level, and notes. Supports status transitions with validation (pending → production → completed/rejected).

#### Authentication
- **Required**: Yes (JWT token)
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | Yes | Batch ID (case-insensitive) | `BN0001` |

#### Request Body (all fields optional)

| Field | Type | Description | Constraints |
|-------|------|-------------|------------|
| `status` | string | New batch status | valid transitions: pending→[production, rejected], production→[completed, rejected] |
| `quality_score` | number | Updated quality score | 0-100 |
| `risk_level` | string | Updated risk level | `low`, `medium`, `high` |
| `notes` | string | Updated notes | Max 1000 chars |

#### Request Examples

**Update status to production:**
```bash
curl -X PATCH http://localhost:5001/api/manufacturers/batches/BN0001 \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "production"}'
```

**Update multiple fields:**
```bash
curl -X PATCH http://localhost:5001/api/manufacturers/batches/BN0001 \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "quality_score": 95.5,
    "risk_level": "low",
    "notes": "Batch passed all QC inspections"
  }'
```

**Update only quality score:**
```bash
curl -X PATCH http://localhost:5001/api/manufacturers/batches/BN0001 \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"quality_score": 87.0}'
```

#### Success Response (200 OK)

```json
{
  "message": "Batch updated successfully",
  "batch": {
    "id": "BN0001",
    "product_name": "Grey Goose Vodka",
    "quantity": 6073,
    "status": "completed",
    "quality_score": 95.5,
    "risk_level": "low",
    "location": "Cape Town",
    "created_at": "2026-04-12T08:30:15",
    "updated_at": "2026-04-15T14:30:00",
    "created_by": 1,
    "notes": "Batch passed all QC inspections"
  }
}
```

#### Error Responses

**400 Bad Request (Invalid status transition):**
```json
{
  "error": "Cannot transition from completed to production. Valid transitions: "
}
```

**400 Bad Request (Already in status):**
```json
{
  "error": "Batch is already in production status"
}
```

**400 Bad Request (Invalid quality score):**
```json
{
  "error": "quality_score must be between 0 and 100"
}
```

**400 Bad Request (Invalid risk level):**
```json
{
  "error": "risk_level must be one of: low, medium, high"
}
```

**404 Not Found:**
```json
{
  "error": "Batch BN9999 not found"
}
```

**401 Unauthorized:**
```json
{
  "error": "Missing or invalid Authorization header"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error updating batch: [error details]"
}
```

---

### DELETE `/api/manufacturers/batches/:id`

Delete a batch with options for soft or hard delete. Soft delete marks the batch as deleted while preserving data integrity. Hard delete permanently removes the batch from the database.

#### Authentication
- **Required**: Yes (JWT token)
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch ID (e.g., BN0001) |

#### Query Parameters

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `hard_delete` | boolean | No | If 'true', permanently removes batch. If 'false', marks as deleted (soft delete) | `false` |

#### Request Examples

**Soft delete (mark as deleted, preserve data):**
```bash
curl -X DELETE http://localhost:5001/api/manufacturers/batches/BN0001 \
  -H "Authorization: Bearer <jwt_token>"
```

**Hard delete (permanently remove, cannot be undone):**
```bash
curl -X DELETE "http://localhost:5001/api/manufacturers/batches/BN0001?hard_delete=true" \
  -H "Authorization: Bearer <jwt_token>"
```

#### Success Response (200 OK)

**Soft Delete Response:**
```json
{
  "message": "Batch BN0001 marked as deleted",
  "delete_type": "soft",
  "batch": {
    "id": "BN0001",
    "product_name": "Grey Goose Vodka",
    "quantity": 6073,
    "status": "completed",
    "quality_score": 95.5,
    "risk_level": "low",
    "location": "Cape Town",
    "created_at": "2026-04-12T08:30:15",
    "updated_at": "2026-04-15T14:35:00",
    "created_by": 1,
    "notes": "Batch passed all QC inspections",
    "deleted_at": "2026-04-15T14:35:00"
  }
}
```

**Hard Delete Response:**
```json
{
  "message": "Batch BN0001 permanently deleted",
  "delete_type": "hard"
}
```

#### Error Responses

**404 Not Found:**
```json
{
  "error": "Batch BN9999 not found"
}
```

**410 Gone (Already Deleted):**
```json
{
  "error": "Batch BN0001 has already been deleted"
}
```

**400 Bad Request (Invalid ID Format):**
```json
{
  "error": "Invalid batch ID format"
}
```

**401 Unauthorized:**
```json
{
  "error": "Missing or invalid Authorization header"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error deleting batch: [error details]"
}
```

#### Delete Behavior

**Soft Delete (default):**
- Marks batch with `deleted_at` timestamp
- Batch data remains in database
- Can be identified by checking if `deleted_at` is not null
- Useful for audit trails and compliance
- Can theoretically be "restored" by clearing the `deleted_at` field

**Hard Delete:**
- Permanently removes batch from database
- Cannot be undone
- Frees up storage space
- Important: In future versions, may cascade delete related NFC tags and audit records
- Recommended only for test data or when compliance allows permanent deletion

---

### GET `/api/manufacturers/batches/metrics`

Retrieve aggregate KPIs and metrics for all batches. Useful for dashboards and analytics.

#### Authentication
- **Required**: Yes (JWT token)
- **Role**: Any authenticated user

#### Query Parameters
None - metrics are always for all batches

#### Request Example

```bash
curl -X GET http://localhost:5001/api/manufacturers/batches/metrics \
  -H "Authorization: Bearer <jwt_token>"
```

#### Success Response (200 OK)

```json
{
  "message": "Metrics retrieved successfully",
  "metrics": {
    "summary": {
      "total": 30,
      "active": 12,
      "completed": 15,
      "rejected": 3,
      "avg_quality": 87.43
    },
    "by_status": {
      "pending": 5,
      "production": 7,
      "completed": 15,
      "rejected": 3
    },
    "by_risk": {
      "low": 18,
      "medium": 9,
      "high": 3
    },
    "quality_distribution": {
      "excellent": 18,
      "good": 8,
      "fair": 3,
      "poor": 1
    }
  }
}
```

#### Metrics Breakdown

**Summary:**
- `total`: Total number of non-deleted batches
- `active`: Batches in pending or production status (in progress)
- `completed`: Batches with completed status
- `rejected`: Batches with rejected status
- `avg_quality`: Average quality score across all batches (0-100)

**By Status:**
- Count of batches in each status (pending, production, completed, rejected)

**By Risk:**
- Count of batches by risk level (low, medium, high)

**Quality Distribution:**
- `excellent`: Quality score >= 90
- `good`: Quality score 75-89
- `fair`: Quality score 60-74
- `poor`: Quality score < 60

#### Error Responses

**401 Unauthorized:**
```json
{
  "error": "Missing or invalid Authorization header"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error retrieving metrics: [error details]"
}
```

---

## Status Transition Rules

The PATCH endpoint enforces strict status transitions:

- **pending** → can transition to: `production`, `rejected`
- **production** → can transition to: `completed`, `rejected`
- **completed** → cannot transition (terminal state)
- **rejected** → cannot transition (terminal state)

Any attempt to transition outside these rules will return a 400 Bad Request error.

---

## Response Fields Explanation

### Batch Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique batch identifier (e.g., BN001) |
| `product_name` | string | Name of the product in batch |
| `quantity` | number | Number of units in batch |
| `status` | string | Current status: `pending`, `production`, `completed`, `rejected` |
| `quality_score` | number | Quality assessment score (0-100) |
| `risk_level` | string | Risk level assessment: `low`, `medium`, `high` |
| `location` | string | Geographic location of batch |
| `created_at` | string | ISO timestamp when batch was created |
| `updated_at` | string | ISO timestamp of last update |
| `created_by` | number | User ID who created the batch |
| `notes` | string | Additional notes about batch |

### Pagination Object

| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total count of batches matching filters |
| `limit` | number | Max results returned in this request |
| `offset` | number | Starting position in results |
| `returned` | number | Actual count of results in this response |

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success - batches retrieved (GET) |
| 201 | Created - batch created successfully (POST) |
| 400 | Bad Request - invalid parameters |
| 401 | Unauthorized - missing or invalid JWT token |
| 403 | Forbidden - insufficient permissions |
| 500 | Server Error - internal server error |

---

## Filtering Logic

### Status Filter
- **Valid values**: `pending`, `production`, `completed`, `rejected`
- **Case-insensitive**: `COMPLETED` and `completed` both work
- Returns `400 Bad Request` if invalid status provided

### Date Range Filters
- **Format**: ISO format (YYYY-MM-DD HH:MM:SS or YYYY-MM-DD)
- **created_at_from**: Inclusive (batches created on or after this date)
- **created_at_to**: Inclusive (batches created on or before this date)
- To include entire day for `created_at_to`, pass the date and it will include until end of day
- Returns `400 Bad Request` if invalid date format

### Quality Score Filters
- **Range**: 0-100
- **created_at_min**: Inclusive lower bound
- **created_at_max**: Inclusive upper bound
- Both can be used together or separately
- Returns `400 Bad Request` if outside 0-100 range

### Risk Level Filter
- **Valid values**: `low`, `medium`, `high`
- **Case-insensitive**: `LOW` and `low` both work
- Returns `400 Bad Request` if invalid risk level provided

---

## Pagination

Default pagination:
- **limit**: 100 (max results per request)
- **offset**: 0 (start from first result)

### Example Pagination Flow

**First page (results 0-49):**
```
GET /api/batches?limit=50&offset=0
```

**Second page (results 50-99):**
```
GET /api/batches?limit=50&offset=50
```

**Third page (results 100-149):**
```
GET /api/batches?limit=50&offset=100
```

---

## Common Use Cases

### 1. Get all pending batches
```bash
GET /api/batches?status=pending
```

### 2. Get high-risk batches from last 7 days
```bash
GET /api/batches?risk_level=high&created_at_from=2026-04-08
```

### 3. Get completed batches with low quality scores
```bash
GET /api/batches?status=completed&quality_score_max=70
```

### 4. Get all batches with pagination (10 per page)
```bash
GET /api/batches?limit=10&offset=0
```

### 5. Get production batches with medium/high risk
```bash
GET /api/batches?status=production&risk_level=medium
GET /api/batches?status=production&risk_level=high
```

---

## Frontend Integration Guide

### JavaScript/TypeScript Example

```typescript
// Get filtered batches
async function fetchBatches(filters: {
  status?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  qualityScoreMin?: number;
  qualityScoreMax?: number;
  riskLevel?: string;
  limit?: number;
  offset?: number;
}) {
  const token = localStorage.getItem('access_token');
  
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.createdAtFrom) params.append('created_at_from', filters.createdAtFrom);
  if (filters.createdAtTo) params.append('created_at_to', filters.createdAtTo);
  if (filters.qualityScoreMin !== undefined) params.append('quality_score_min', String(filters.qualityScoreMin));
  if (filters.qualityScoreMax !== undefined) params.append('quality_score_max', String(filters.qualityScoreMax));
  if (filters.riskLevel) params.append('risk_level', filters.riskLevel);
  params.append('limit', String(filters.limit || 100));
  params.append('offset', String(filters.offset || 0));
  
  const response = await fetch(`http://localhost:5001/api/batches?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch batches');
  }
  
  return response.json();
}

// Usage
fetchBatches({ 
  status: 'production',
  risk_level: 'high',
  limit: 50 
})
.then(data => console.log(data))
.catch(error => console.error(error));

// Create a new batch
async function createBatch(batchData: {
  product_name: string;
  quantity: number;
  location?: string;
  quality_score?: number;
  risk_level?: string;
  notes?: string;
}) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:5001/api/manufacturers/batches', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(batchData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create batch');
  }
  
  const result = await response.json();
  console.log('Batch created:', result.batch);
  return result.batch;
}

// Usage: Create batch
createBatch({
  product_name: 'Patron Silver Tequila',
  quantity: 2500,
  location: 'Johannesburg',
  quality_score: 95.5,
  risk_level: 'low',
  notes: 'Premium batch for retail distribution'
})
.then(batch => console.log('Created batch:', batch))
.catch(error => console.error('Error creating batch:', error));

// Get a single batch by ID with full details
async function fetchBatchDetail(batchId: string) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`http://localhost:5001/api/manufacturers/batches/${batchId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 404) {
    throw new Error(`Batch ${batchId} not found`);
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch batch');
  }
  
  const result = await response.json();
  return result.batch; // Returns full batch object with quality_score, risk_level, notes
}

// Usage: Fetch single batch details
fetchBatchDetail('BN0001')
.then(batch => {
  console.log('Batch ID:', batch.id);
  console.log('Product:', batch.product_name);
  console.log('Status:', batch.status);
  console.log('Quality Score:', batch.quality_score);
  console.log('Risk Level:', batch.risk_level);
  console.log('Notes:', batch.notes);
})
.catch(error => console.error('Error fetching batch:', error));

// Update a batch
async function updateBatch(batchId: string, updates: {
  status?: 'pending' | 'production' | 'completed' | 'rejected';
  quality_score?: number;
  risk_level?: 'low' | 'medium' | 'high';
  notes?: string;
}) {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`http://localhost:5001/api/manufacturers/batches/${batchId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  if (response.status === 404) {
    throw new Error(`Batch ${batchId} not found`);
  }
  
  if (response.status === 400) {
    const error = await response.json();
    throw new Error(error.error || 'Invalid update parameters');
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update batch');
  }
  
  const result = await response.json();
  return result.batch;
}

// Usage: Update batch status to production
updateBatch('BN0001', { status: 'production' })
.then(batch => console.log('Batch status updated to:', batch.status))
.catch(error => console.error('Error updating batch:', error));

// Usage: Update multiple fields
updateBatch('BN0001', {
  status: 'completed',
  quality_score: 95.5,
  notes: 'Batch passed QC inspection'
})
.then(batch => console.log('Batch updated:', batch))
.catch(error => console.error('Error:', error));

// Delete a batch (soft delete)
async function deleteBatch(batchId: string, hardDelete: boolean = false) {
  const token = localStorage.getItem('access_token');
  
  const url = hardDelete 
    ? `http://localhost:5001/api/manufacturers/batches/${batchId}?hard_delete=true`
    : `http://localhost:5001/api/manufacturers/batches/${batchId}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 404) {
    throw new Error(`Batch ${batchId} not found`);
  }
  
  if (response.status === 410) {
    throw new Error(`Batch ${batchId} has already been deleted`);
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete batch');
  }
  
  const result = await response.json();
  return result;
}

// Usage: Soft delete (mark as deleted)
deleteBatch('BN0001')
.then(result => console.log('Batch marked as deleted:', result.message))
.catch(error => console.error('Error deleting batch:', error));

// Usage: Hard delete (permanently remove)
deleteBatch('BN0001', true)
.then(result => console.log('Batch permanently deleted:', result.message))
.catch(error => console.error('Error permanently deleting batch:', error));

// Get batch metrics and KPIs
async function getBatchMetrics() {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:5001/api/manufacturers/batches/metrics', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch metrics');
  }
  
  const result = await response.json();
  return result.metrics;
}

// Usage: Display metrics on dashboard
getBatchMetrics()
.then(metrics => {
  console.log('Total Batches:', metrics.summary.total);
  console.log('Active Batches:', metrics.summary.active);
  console.log('Completed:', metrics.summary.completed);
  console.log('Rejected:', metrics.summary.rejected);
  console.log('Average Quality:', metrics.summary.avg_quality + '%');
  
  // Display on dashboard UI
  document.getElementById('total-batches').textContent = metrics.summary.total;
  document.getElementById('active-batches').textContent = metrics.summary.active;
  document.getElementById('avg-quality').textContent = metrics.summary.avg_quality.toFixed(1) + '%';
})
.catch(error => console.error('Error fetching metrics:', error));
```

---

## Testing Checklist

**GET /api/manufacturers/batches (List)**
- [ ] Returns 200 with token
- [ ] Returns 401 without token
- [ ] ?status=pending filters correctly
- [ ] ?quality_score_min=80 filters correctly
- [ ] ?risk_level=high filters correctly
- [ ] ?created_at_from=2026-04-01 filters correctly
- [ ] Pagination works with limit and offset
- [ ] Invalid status returns 400
- [ ] Invalid date format returns 400
- [ ] Invalid quality score returns 400
- [ ] Invalid risk level returns 400

**POST /api/manufacturers/batches (Create)**
- [ ] Returns 201 with valid data
- [ ] Sets status to "pending" automatically
- [ ] Links batch to authenticated user (created_by)
- [ ] Auto-generates batch ID
- [ ] Returns 400 for missing product_name
- [ ] Returns 400 for missing quantity
- [ ] Returns 400 for quality_score outside 0-100
- [ ] Returns 400 for invalid risk_level
- [ ] Returns 401 without token

**GET /api/manufacturers/batches/:id (Single)**
- [ ] Returns 200 with valid batch ID
- [ ] Returns full batch details (quality_score, risk_level, notes)
- [ ] Works with case-insensitive batch ID
- [ ] Returns 404 for non-existent batch
- [ ] Returns 400 for invalid ID format
- [ ] Returns 401 without token

**PATCH /api/manufacturers/batches/:id (Update)**
- [ ] Returns 200 with valid updates
- [ ] Updates status with correct transitions
- [ ] Prevents invalid status transitions
- [ ] Updates quality_score (0-100)
- [ ] Updates risk_level (low/medium/high)
- [ ] Updates notes (max 1000 chars)
- [ ] Returns 400 for invalid status
- [ ] Returns 400 for invalid transitions
- [ ] Returns 400 for quality_score outside 0-100
- [ ] Returns 400 for invalid risk_level
- [ ] Returns 400 for notes exceeding 1000 chars
- [ ] Returns 404 for non-existent batch
- [ ] Returns 401 without token
- [ ] Updates timestamp automatically

**DELETE /api/manufacturers/batches/:id (Delete)**
- [ ] Soft delete returns 200 with delete_type: 'soft'
- [ ] Hard delete returns 200 with delete_type: 'hard'
- [ ] Soft delete marks batch with deleted_at timestamp
- [ ] Hard delete removes batch permanently
- [ ] Returns 404 for non-existent batch
- [ ] Returns 410 for already deleted batch
- [ ] Returns 400 for invalid ID format
- [ ] Returns 401 without token
- [ ] ?hard_delete=true parameter triggers permanent delete
- [ ] Soft delete preserves batch data in response

**GET /api/manufacturers/batches/metrics (Metrics)**
- [ ] Returns 200 with metrics object
- [ ] Summary includes total, active, completed, rejected, avg_quality
- [ ] by_status breakdown sums to total
- [ ] by_risk breakdown sums to total
- [ ] quality_distribution breakdown sums to total
- [ ] avg_quality is between 0-100
- [ ] Returns 401 without token
- [ ] Excludes soft-deleted batches from counts
- [ ] active count = pending + production
- [ ] All numbers are non-negative integers

---

## Error Handling

Always handle these error scenarios in your frontend:

```typescript
try {
  const response = await fetch(`/api/batches?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    // Redirect to login
  } else if (response.status === 400) {
    const error = await response.json();
    // Show user-friendly error message
    console.error(error.error);
  } else if (response.status === 404) {
    // Resource not found
    console.error('Batch not found');
  } else if (response.status === 500) {
    // Server error
    console.error('Server error');
  } else if (response.ok) {
    const data = await response.json();
    // Process successful response
  }
} catch (error) {
  console.error('Network error', error);
}
```

---

## Notes

- All timestamps are in UTC/ISO format
- Empty results return `{ "data": [], "pagination": {...} }` not an error
- Filters are AND'ed together (all must match)
- Results are sorted by `created_at` descending (newest first)
- Maximum limit is 500 results per request
