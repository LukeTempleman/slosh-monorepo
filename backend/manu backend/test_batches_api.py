#!/usr/bin/env python
"""
Test Script for Batches API
Tests all filtering parameters and validates responses
Run: python test_batches_api.py
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:5001"
AUTH_ENDPOINT = f"{BASE_URL}/api/auth/login"
BATCHES_ENDPOINT = f"{BASE_URL}/api/manufacturers/batches"

# Test credentials
TEST_USERNAME = "test_user"
TEST_PASSWORD = "TestPass123!"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def get_token():
    """Get JWT token for testing"""
    print(f"\n{Colors.BLUE}1. Getting JWT token...{Colors.END}")
    
    response = requests.post(AUTH_ENDPOINT, json={
        "username": TEST_USERNAME,
        "password": TEST_PASSWORD
    })
    
    if response.status_code == 200:
        token = response.json().get("access_token")
        print(f"{Colors.GREEN}✓ Token obtained{Colors.END}")
        return token
    else:
        print(f"{Colors.RED}✗ Failed to get token: {response.text}{Colors.END}")
        return None

def test_api(test_name, endpoint, token, expected_status=200):
    """Generic API test function"""
    print(f"\n{Colors.BLUE}Testing: {test_name}{Colors.END}")
    print(f"URL: {endpoint}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(endpoint, headers=headers)
        
        if response.status_code == expected_status:
            print(f"{Colors.GREEN}✓ Status {response.status_code} OK{Colors.END}")
            data = response.json()
            
            # Print relevant info
            if "data" in data:
                print(f"  Results returned: {len(data['data'])}")
                if "pagination" in data:
                    print(f"  Total available: {data['pagination']['total']}")
            
            print(f"  Response preview:")
            print(f"  {json.dumps(data, indent=2)[:500]}...")
            return True
        else:
            print(f"{Colors.RED}✗ Expected {expected_status}, got {response.status_code}{Colors.END}")
            print(f"  Error: {response.json()}")
            return False
    
    except Exception as e:
        print(f"{Colors.RED}✗ Request failed: {str(e)}{Colors.END}")
        return False

def test_unauthorized():
    """Test without authentication"""
    print(f"\n{Colors.BLUE}Testing: Unauthorized Access (No Token){Colors.END}")
    print(f"URL: {BATCHES_ENDPOINT}")
    
    try:
        response = requests.get(BATCHES_ENDPOINT)
        
        if response.status_code == 401:
            print(f"{Colors.GREEN}✓ Correctly returned 401 Unauthorized{Colors.END}")
            print(f"  Response: {response.json()}")
            return True
        else:
            print(f"{Colors.RED}✗ Expected 401, got {response.status_code}{Colors.END}")
            return False
    
    except Exception as e:
        print(f"{Colors.RED}✗ Request failed: {str(e)}{Colors.END}")
        return False

def test_invalid_filters(token):
    """Test invalid filter values"""
    print(f"\n{Colors.YELLOW}=== Testing Invalid Filters ==={Colors.END}")
    
    tests = [
        ("Invalid status", f"{BATCHES_ENDPOINT}?status=invalid_status", 400),
        ("Invalid risk level", f"{BATCHES_ENDPOINT}?risk_level=invalid_level", 400),
        ("Invalid quality min", f"{BATCHES_ENDPOINT}?quality_score_min=150", 400),
        ("Invalid quality max", f"{BATCHES_ENDPOINT}?quality_score_max=-50", 400),
        ("Invalid date format", f"{BATCHES_ENDPOINT}?created_at_from=2026/04/01", 400),
    ]
    
    for test_name, endpoint, expected_status in tests:
        test_api(test_name, endpoint, token, expected_status)

def run_all_tests():
    """Run all API tests"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"BATCHES API TEST SUITE")
    print(f"{'='*60}{Colors.END}")
    
    # Step 1: Get token
    token = get_token()
    if not token:
        print(f"\n{Colors.RED}✗ Cannot proceed without token{Colors.END}")
        return
    
    print(f"\n{Colors.YELLOW}=== Basic Tests ==={Colors.END}")
    
    # Step 2: Test basic access
    test_api("Get all batches (no filters)", BATCHES_ENDPOINT, token)
    
    # Step 3: Test status filters
    print(f"\n{Colors.YELLOW}=== Status Filters ==={Colors.END}")
    test_api("Filter: status=pending", f"{BATCHES_ENDPOINT}?status=pending", token)
    test_api("Filter: status=production", f"{BATCHES_ENDPOINT}?status=production", token)
    test_api("Filter: status=completed", f"{BATCHES_ENDPOINT}?status=completed", token)
    test_api("Filter: status=rejected", f"{BATCHES_ENDPOINT}?status=rejected", token)
    
    # Step 4: Test risk level filters
    print(f"\n{Colors.YELLOW}=== Risk Level Filters ==={Colors.END}")
    test_api("Filter: risk_level=low", f"{BATCHES_ENDPOINT}?risk_level=low", token)
    test_api("Filter: risk_level=medium", f"{BATCHES_ENDPOINT}?risk_level=medium", token)
    test_api("Filter: risk_level=high", f"{BATCHES_ENDPOINT}?risk_level=high", token)
    
    # Step 5: Test quality score filters
    print(f"\n{Colors.YELLOW}=== Quality Score Filters ==={Colors.END}")
    test_api("Filter: quality_score_min=80", f"{BATCHES_ENDPOINT}?quality_score_min=80", token)
    test_api("Filter: quality_score_max=90", f"{BATCHES_ENDPOINT}?quality_score_max=90", token)
    test_api("Filter: quality_score_min=75&quality_score_max=85", 
             f"{BATCHES_ENDPOINT}?quality_score_min=75&quality_score_max=85", token)
    
    # Step 6: Test date range filters
    print(f"\n{Colors.YELLOW}=== Date Range Filters ==={Colors.END}")
    today = datetime.now().date()
    week_ago = (datetime.now() - timedelta(days=7)).date()
    test_api("Filter: created_at_from=7 days ago", 
             f"{BATCHES_ENDPOINT}?created_at_from={week_ago}", token)
    test_api("Filter: created_at_from=today&created_at_to=today", 
             f"{BATCHES_ENDPOINT}?created_at_from={today}&created_at_to={today}", token)
    
    # Step 7: Test pagination
    print(f"\n{Colors.YELLOW}=== Pagination Tests ==={Colors.END}")
    test_api("Pagination: limit=10&offset=0", f"{BATCHES_ENDPOINT}?limit=10&offset=0", token)
    test_api("Pagination: limit=20&offset=10", f"{BATCHES_ENDPOINT}?limit=20&offset=10", token)
    
    # Step 8: Test combined filters
    print(f"\n{Colors.YELLOW}=== Combined Filters ==={Colors.END}")
    test_api("Combined: status=production&risk_level=medium", 
             f"{BATCHES_ENDPOINT}?status=production&risk_level=medium", token)
    test_api("Combined: status=production&quality_score_min=80&risk_level=high", 
             f"{BATCHES_ENDPOINT}?status=production&quality_score_min=80&risk_level=high", token)
    test_api("Combined: with pagination", 
             f"{BATCHES_ENDPOINT}?status=completed&limit=5&offset=0", token)
    
    # Step 9: Test invalid filters
    test_invalid_filters(token)
    
    # Step 10: Test unauthorized
    print(f"\n{Colors.YELLOW}=== Security Tests ==={Colors.END}")
    test_unauthorized()
    
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"TEST SUITE COMPLETED")
    print(f"{'='*60}{Colors.END}")
    print(f"\n{Colors.GREEN}✓ All manual tests completed!{Colors.END}")
    print(f"Check the results above to verify all endpoints work correctly.\n")

if __name__ == '__main__':
    print("\n⚠️  Make sure:")
    print("  1. Backend is running: docker-compose -f docker-compose.global.yml up -d")
    print("  2. Sample data is seeded: python seed_batches.py")
    print("  3. Test user 'test_user' exists in database\n")
    
    run_all_tests()
