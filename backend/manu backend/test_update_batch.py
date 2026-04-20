#!/usr/bin/env python
"""
Test script for PATCH /api/manufacturers/batches/:id endpoint
"""

import requests
import json

BASE = 'http://localhost:5001'

def test_update_batch():
    # Get token first
    print('1. Getting token...')
    r = requests.post(f'{BASE}/api/auth/login', json={'username': 'test_user', 'password': 'TestPass123!'})
    if r.status_code != 200:
        print(f'❌ Login failed: {r.status_code}')
        print(r.text)
        return
    
    token = r.json()['access_token']
    print('✓ Token obtained')
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Test 1: Get initial batch status
    print('\n2. Fetching initial batch (BN0002)...')
    r = requests.get(f'{BASE}/api/manufacturers/batches/BN0002', headers=headers)
    batch = r.json()['batch']
    print(f'✓ Current status: {batch["status"]}')
    print(f'  Quality score: {batch["quality_score"]}')
    
    # Test 2: Update status from pending/production to production
    print('\n3. Testing status update from {} to production...'.format(batch["status"]))
    if batch["status"] == "pending":
        update_data = {"status": "production"}
    else:
        update_data = {"status": "production"}
    
    r = requests.patch(f'{BASE}/api/manufacturers/batches/BN0002', json=update_data, headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        updated = r.json()['batch']
        print(f'✓ Status updated to: {updated["status"]}')
    else:
        print(f'❌ Error: {r.json().get("error", r.text)}')
    
    # Test 3: Update quality score
    print('\n4. Updating quality score to 85.5...')
    r = requests.patch(
        f'{BASE}/api/manufacturers/batches/BN0002',
        json={"quality_score": 85.5},
        headers=headers
    )
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        updated = r.json()['batch']
        print(f'✓ Quality score updated to: {updated["quality_score"]}')
    else:
        print(f'❌ Error: {r.json().get("error", r.text)}')
    
    # Test 4: Update multiple fields
    print('\n5. Updating status, quality score, and notes...')
    r = requests.patch(
        f'{BASE}/api/manufacturers/batches/BN0002',
        json={
            "status": "completed",
            "quality_score": 92.0,
            "notes": "Batch passed QC inspection with excellent results"
        },
        headers=headers
    )
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        updated = r.json()['batch']
        print(f'✓ Batch updated successfully')
        print(f'  Status: {updated["status"]}')
        print(f'  Quality: {updated["quality_score"]}')
        print(f'  Notes: {updated["notes"]}')
    else:
        print(f'❌ Error: {r.json().get("error", r.text)}')
    
    # Test 5: Invalid quality score
    print('\n6. Testing invalid quality score (120)...')
    r = requests.patch(
        f'{BASE}/api/manufacturers/batches/BN0003',
        json={"quality_score": 120},
        headers=headers
    )
    print(f'Status: {r.status_code}')
    if r.status_code == 400:
        print(f'✓ Correctly returned 400: {r.json()["error"]}')
    else:
        print(f'❌ Expected 400, got {r.status_code}')
    
    # Test 6: Invalid status
    print('\n7. Testing invalid status (invalid_status)...')
    r = requests.patch(
        f'{BASE}/api/manufacturers/batches/BN0003',
        json={"status": "invalid_status"},
        headers=headers
    )
    print(f'Status: {r.status_code}')
    if r.status_code == 400:
        print(f'✓ Correctly returned 400: {r.json()["error"]}')
    else:
        print(f'❌ Expected 400, got {r.status_code}')
    
    # Test 7: Invalid risk level
    print('\n8. Testing invalid risk_level...')
    r = requests.patch(
        f'{BASE}/api/manufacturers/batches/BN0003',
        json={"risk_level": "extreme"},
        headers=headers
    )
    print(f'Status: {r.status_code}')
    if r.status_code == 400:
        print(f'✓ Correctly returned 400: {r.json()["error"]}')
    else:
        print(f'❌ Expected 400, got {r.status_code}')
    
    # Test 8: Non-existent batch
    print('\n9. Testing non-existent batch (BN9999)...')
    r = requests.patch(
        f'{BASE}/api/manufacturers/batches/BN9999',
        json={"status": "production"},
        headers=headers
    )
    print(f'Status: {r.status_code}')
    if r.status_code == 404:
        print(f'✓ Correctly returned 404')
    else:
        print(f'❌ Expected 404, got {r.status_code}')
    
    # Test 9: Without authentication
    print('\n10. Testing without authentication...')
    r = requests.patch(
        f'{BASE}/api/manufacturers/batches/BN0001',
        json={"status": "production"}
    )
    print(f'Status: {r.status_code}')
    if r.status_code == 401:
        print(f'✓ Correctly returned 401')
    else:
        print(f'❌ Expected 401, got {r.status_code}')
    
    print('\n✅ All tests completed!')

if __name__ == '__main__':
    test_update_batch()
