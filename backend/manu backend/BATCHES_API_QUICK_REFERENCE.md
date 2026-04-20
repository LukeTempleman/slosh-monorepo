# Batches API - Quick Reference Guide

## 🚀 Quick Start

### 1. Get JWT Token
```powershell
$body = @{username="test_user"; password="TestPass123!"} | ConvertTo-Json
$resp = Invoke-WebRequest -Uri "http://localhost:5001/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = ($resp.Content | ConvertFrom-Json).access_token
Write-Host "Token: $token"
```

### 2. Make First API Call
```powershell
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Uri "http://localhost:5001/api/batches" -Headers $headers | ConvertFrom-Json
```

---

## 📋 Common API Patterns

### Get All Batches
```powershell
$headers = @{Authorization="Bearer $token"}
$response = Invoke-WebRequest -Uri "http://localhost:5001/api/batches" -Headers $headers
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

### Filter by Status
```powershell
$uri = "http://localhost:5001/api/batches?status=completed"
Invoke-WebRequest -Uri $uri -Headers $headers | ConvertFrom-Json
```

### Filter by Risk Level
```powershell
$uri = "http://localhost:5001/api/batches?risk_level=high"
Invoke-WebRequest -Uri $uri -Headers $headers | ConvertFrom-Json
```

### Filter by Quality Score
```powershell
$uri = "http://localhost:5001/api/batches?quality_score_min=80&quality_score_max=95"
Invoke-WebRequest -Uri $uri -Headers $headers | ConvertFrom-Json
```

### Filter by Date Range
```powershell
# Get batches from last 7 days
$date = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
$uri = "http://localhost:5001/api/batches?created_at_from=$date"
Invoke-WebRequest -Uri $uri -Headers $headers | ConvertFrom-Json
```

### Pagination
```powershell
# Get first 10 results
$uri = "http://localhost:5001/api/batches?limit=10&offset=0"
Invoke-WebRequest -Uri $uri -Headers $headers | ConvertFrom-Json
```

### Combined Filters
```powershell
$uri = "http://localhost:5001/api/batches?status=production&risk_level=medium&quality_score_min=75&limit=50"
Invoke-WebRequest -Uri $uri -Headers $headers | ConvertFrom-Json
```

---

## 🧪 Expected Response Example

### Success (200 OK)
```json
{
  "data": [
    {
      "id": "BN0001",
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
    }
  ],
  "pagination": {
    "total": 145,
    "limit": 100,
    "offset": 0,
    "returned": 1
  },
  "filters_applied": {
    "status": null,
    "created_at_from": null,
    "created_at_to": null,
    "quality_score_min": null,
    "quality_score_max": null,
    "risk_level": null
  }
}
```

### Error (400 Bad Request)
```json
{
  "error": "Invalid status. Must be one of: pending, production, completed, rejected"
}
```

### Unauthorized (401)
```json
{
  "error": "Missing Authorization Header"
}
```

---

## ⚡ Valid Values

### Status
- `pending`
- `production`
- `completed`
- `rejected`

### Risk Level
- `low`
- `medium`
- `high`

### Quality Score Range
- Minimum: 0
- Maximum: 100

### Date Format
- Format: ISO date format (YYYY-MM-DD)
- Example: 2026-04-15

---

## 🔍 Debugging Tips

### Check if Backend is Running
```powershell
Invoke-WebRequest -Uri "http://localhost:5001/api/health"
```

### Verify Token is Valid
```powershell
$headers = @{Authorization="Bearer $token"}
Invoke-WebRequest -Uri "http://localhost:5001/auth/me" -Headers $headers
```

### Check Database Connection
The batches endpoint requires the database to have the `batches` table.
If you get a 500 error, check:
```powershell
# Check backend logs
docker logs -f manu_flask
```

### Full Error Details
```powershell
try {
    $uri = "http://localhost:5001/api/batches?status=invalid"
    $resp = Invoke-WebRequest -Uri $uri -Headers $headers
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Error: $($_.Exception.Response | ConvertFrom-Json)"
}
```

---

## 📊 Filtering Combinations

### High Risk Items in Production
```
status=production&risk_level=high
```

### Low Quality Completed Batches
```
status=completed&quality_score_max=70
```

### Recent Medium Risk Items
```
created_at_from=2026-04-10&risk_level=medium
```

### Excellence Batches (Quality > 95% AND low risk)
```
quality_score_min=95&risk_level=low
```

---

## 🚀 Frontend Integration

### React Example
```javascript
const fetchBatches = async (filters) => {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  
  const response = await fetch(
    `http://localhost:5001/api/batches?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.json();
};
```

### Usage
```javascript
// Get high-risk production batches
fetchBatches({
  status: 'production',
  risk_level: 'high',
  limit: 50
}).then(data => console.log(data));
```

---

## ✅ Testing Checklist

Use this to verify the endpoint works in your environment:

- [ ] Backend running: `docker ps | grep manu_flask`
- [ ] Get token successfully
- [ ] Get all batches (200 OK)
- [ ] Filter by status (check each: pending, production, completed, rejected)
- [ ] Filter by risk level (check: low, medium, high)
- [ ] Filter by quality score range
- [ ] Filter by date range
- [ ] Pagination works (limit/offset)
- [ ] Invalid filters return 400
- [ ] No token returns 401
- [ ] Combined filters work
- [ ] Response has correct structure

---

## 📞 Support

**For issues:**
1. Check backend logs: `docker logs -f manu_flask`
2. Verify token is valid
3. Confirm database has batches table
4. Check if sample data was seeded

**See detailed documentation:**
- Read: `docs/BATCHES_API.md`
