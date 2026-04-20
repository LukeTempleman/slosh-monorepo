#!/usr/bin/env python
"""
Test script for GET /api/manufacturers/batches/:id endpoint
"""

import requests
import json

BASE = 'http://localhost:5001'

def test_get_batch():
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
    
    # Test 1: Get an existing batch
    print('\n2. Fetching existing batch (BN0001)...')
    r = requests.get(f'{BASE}/api/manufacturers/batches/BN0001', headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        batch = r.json()
        print('✓ Batch retrieved successfully')
        print(f'  Product: {batch["batch"]["product_name"]}')
        print(f'  Quantity: {batch["batch"]["quantity"]}')
        print(f'  Status: {batch["batch"]["status"]}')
        print(f'  Quality Score: {batch["batch"]["quality_score"]}')
        print(f'  Risk Level: {batch["batch"]["risk_level"]}')
        print(f'  Location: {batch["batch"]["location"]}')
        print(f'  Notes: {batch["batch"]["notes"]}')
        print(f'  Created By: {batch["batch"]["created_by"]}')
    else:
        print(f'❌ Error: {r.text}')
    
    # Test 2: Get another batch
    print('\n3. Fetching batch BN0002...')
    r = requests.get(f'{BASE}/api/manufacturers/batches/BN0002', headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        print('✓ Batch retrieved successfully')
        batch = r.json()['batch']
        print(f'  Product: {batch["product_name"]}')
        print(f'  Quality Score: {batch["quality_score"]}')
    else:
        print(f'❌ Error: {r.text}')
    
    # Test 3: Get non-existent batch
    print('\n4. Testing with non-existent batch (BN9999)...')
    r = requests.get(f'{BASE}/api/manufacturers/batches/BN9999', headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 404:
        print('✓ Correctly returned 404 for non-existent batch')
        print(f'  Error: {r.json()["error"]}')
    else:
        print(f'❌ Expected 404, got {r.status_code}')
    
    # Test 5: Get batch with lowercase id
    print('\n5. Testing with lowercase ID (bn0001)...')
    r = requests.get(f'{BASE}/api/manufacturers/batches/bn0001', headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 200:
        print('✓ Case-insensitive lookup works')
        print(f'  Product: {r.json()["batch"]["product_name"]}')
    else:
        print(f'❌ Error: {r.text}')
    
    # Test 6: Test without auth
    print('\n6. Testing without authentication...')
    r = requests.get(f'{BASE}/api/manufacturers/batches/BN0001')
    print(f'Status: {r.status_code}')
    if r.status_code == 401:
        print('✓ Correctly returned 401 for missing token')
    else:
        print(f'❌ Expected 401, got {r.status_code}')
    
    print('\n✅ All tests completed!')

if __name__ == '__main__':
    test_get_batch()
