# Batches API Tests - PowerShell Script
# Run: .\test_batches_api.ps1

param(
    [string]$BaseUrl = "http://localhost:5001",
    [string]$Username = "test_user",
    [string]$Password = "TestPass123!"
)

# Color functions
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Blue
}

function Write-Section {
    param([string]$Title)
    Write-Host "`n" + "=" * 60 -ForegroundColor Yellow
    Write-Host $Title -ForegroundColor Yellow
    Write-Host "=" * 60 -ForegroundColor Yellow
}

# Get JWT Token
function Get-AuthToken {
    Write-Info "Getting JWT token..."
    
    try {
        $body = @{username = $Username; password = $Password} | ConvertTo-Json
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        $token = ($response.Content | ConvertFrom-Json).access_token
        Write-Success "Token obtained"
        return $token
    }
    catch {
        Write-ErrorMsg "Failed to get token: $_"
        return $null
    }
}

# Test API Endpoint
function Test-Endpoint {
    param(
        [string]$TestName,
        [string]$Endpoint,
        [string]$Token,
        [int]$ExpectedStatus = 200
    )
    
    Write-Info "Testing: $TestName"
    
    try {
        $headers = @{"Authorization" = "Bearer $Token"}
        $response = Invoke-WebRequest -Uri $Endpoint -Headers $headers -ErrorAction Stop
        
        $data = $response.Content | ConvertFrom-Json
        
        Write-Success "Status $($response.StatusCode) OK"
        
        if ($data.psobject.Properties.name -contains "data") {
            Write-Host "  Results: $($data.data.Count) items"
            if ($data.psobject.Properties.name -contains "pagination") {
                Write-Host "  Total available: $($data.pagination.total)"
            }
        }
        
        Write-Host "  Response preview (first 300 chars):"
        $preview = ($data | ConvertTo-Json -Depth 2) -replace "`n", "`n  "
        Write-Host "  $($preview.Substring(0, [Math]::Min(300, $preview.Length)))..." -ForegroundColor Gray
        
        return $true
    }
    catch {
        if ($_.Exception.Response.StatusCode.value__ -eq $ExpectedStatus) {
            Write-Success "Status $($_.Exception.Response.StatusCode.value__) OK (expected)"
            Write-Host "  Error: $($_.Exception.Response | ConvertFrom-Json | ConvertTo-Json)"
            return $true
        }
        else {
            Write-ErrorMsg "Status $($_.Exception.Response.StatusCode.value__) (expected $ExpectedStatus)"
            Write-Host "  Error: $_" -ForegroundColor Red
            return $false
        }
    }
}

# Main Test Suite
function Test-BatchesAPI {
    Write-Section "BATCHES API TEST SUITE"
    
    # Step 1: Get Token
    $token = Get-AuthToken
    if ($null -eq $token) {
        Write-ErrorMsg "Cannot proceed without valid token"
        exit 1
    }
    
    # Step 2: Basic Tests
    Write-Section "BASIC TESTS"
    Test-Endpoint "Get all batches (no filters)" "$BaseUrl/api/manufacturers/batches" $token
    
    # Step 3: Status Filters
    Write-Section "STATUS FILTERS"
    Test-Endpoint "Filter: status=pending" "$BaseUrl/api/manufacturers/batches?status=pending" $token
    Test-Endpoint "Filter: status=production" "$BaseUrl/api/manufacturers/batches?status=production" $token
    Test-Endpoint "Filter: status=completed" "$BaseUrl/api/manufacturers/batches?status=completed" $token
    Test-Endpoint "Filter: status=rejected" "$BaseUrl/api/manufacturers/batches?status=rejected" $token
    
    # Step 4: Risk Level Filters
    Write-Section "RISK LEVEL FILTERS"
    Test-Endpoint "Filter: risk_level=low" "$BaseUrl/api/manufacturers/batches?risk_level=low" $token
    Test-Endpoint "Filter: risk_level=medium" "$BaseUrl/api/manufacturers/batches?risk_level=medium" $token
    Test-Endpoint "Filter: risk_level=high" "$BaseUrl/api/manufacturers/batches?risk_level=high" $token
    
    # Step 5: Quality Score Filters
    Write-Section "QUALITY SCORE FILTERS"
    Test-Endpoint "Filter: quality_score_min=80" "$BaseUrl/api/manufacturers/batches?quality_score_min=80" $token
    Test-Endpoint "Filter: quality_score_max=90" "$BaseUrl/api/manufacturers/batches?quality_score_max=90" $token
    Test-Endpoint "Filter: quality_score_min=75&max=85" "$BaseUrl/api/manufacturers/batches?quality_score_min=75&quality_score_max=85" $token
    
    # Step 6: Date Range Filters
    Write-Section "DATE RANGE FILTERS"
    $today = (Get-Date).ToString("yyyy-MM-dd")
    $weekAgo = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
    Test-Endpoint "Filter: created_at_from=7 days ago" "$BaseUrl/api/manufacturers/batches?created_at_from=$weekAgo" $token
    Test-Endpoint "Filter: date range today" "$BaseUrl/api/manufacturers/batches?created_at_from=$today&created_at_to=$today" $token
    
    # Step 7: Pagination
    Write-Section "PAGINATION TESTS"
    Test-Endpoint "Pagination: limit=10&offset=0" "$BaseUrl/api/manufacturers/batches?limit=10&offset=0" $token
    Test-Endpoint "Pagination: limit=20&offset=10" "$BaseUrl/api/manufacturers/batches?limit=20&offset=10" $token
    
    # Step 8: Combined Filters
    Write-Section "COMBINED FILTERS"
    Test-Endpoint "Combined: status=production&risk_level=medium" "$BaseUrl/api/manufacturers/batches?status=production&risk_level=medium" $token
    Test-Endpoint "Combined: status=production&quality_score_min=80&risk_level=high" "$BaseUrl/api/manufacturers/batches?status=production&quality_score_min=80&risk_level=high" $token
    Test-Endpoint "Combined: with pagination" "$BaseUrl/api/manufacturers/batches?status=completed&limit=5&offset=0" $token
    
    # Step 9: Invalid Filters
    Write-Section "INVALID FILTER TESTS (Should return 400)"
    Test-Endpoint "Invalid status" "$BaseUrl/api/manufacturers/batches?status=invalid_status" $token 400
    Test-Endpoint "Invalid risk level" "$BaseUrl/api/manufacturers/batches?risk_level=invalid_level" $token 400
    Test-Endpoint "Invalid quality min" "$BaseUrl/api/manufacturers/batches?quality_score_min=150" $token 400
    Test-Endpoint "Invalid date format" "$BaseUrl/api/manufacturers/batches?created_at_from=2026/04/01" $token 400
    
    # Step 10: No Token
    Write-Section "SECURITY TESTS"
    Write-Info "Testing: No Authorization Header (Should return 401)"
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/manufacturers/batches" -ErrorAction Stop
        Write-ErrorMsg "Should have failed without token"
    }
    catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 401) {
            Write-Success "Correctly returned 401 Unauthorized"
        }
        else {
            Write-ErrorMsg "Unexpected status: $($_.Exception.Response.StatusCode.value__)"
        }
    }
    
    # Summary
    Write-Section "TEST SUITE COMPLETED"
    Write-Host "`nAll tests completed! Check results above." -ForegroundColor Green
    Write-Host "See BATCHES_API_QUICK_REFERENCE.md for more examples.`n"
}

# Run tests
Test-BatchesAPI
