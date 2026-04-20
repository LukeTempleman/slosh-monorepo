#!/usr/bin/env python
"""
Test script for POST /api/manufacturers/batches endpoint
"""

import requests
import json

BASE = 'http://localhost:5001'

def test_create_batch():
    # Get token first
    print('1. Getting token...')
    r = requests.post(f'{BASE}/api/auth/login', json={'username': 'test_user', 'password': 'TestPass123!'})
    if r.status_code != 200:
        print(f'❌ Login failed: {r.status_code}')
        print(r.text)
        return
    
    token = r.json()['access_token']
    print('✓ Token obtained')
    
    # Test creating a batch
    headers = {'Authorization': f'Bearer {token}'}
    
    print('\n2. Creating batch with valid data...')
    batch_data = {
        'product_name': 'Patron Silver Tequila',
        'quantity': 2500,
        'location': 'Johannesburg',
        'quality_score': 95.5,
        'risk_level': 'low',
        'notes': 'Premium batch for retail distribution'
    }
    r = requests.post(f'{BASE}/api/manufacturers/batches', json=batch_data, headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 201:
        result = r.json()
        print('✓ Batch created successfully')
        batch = result['batch']
        print(f'  ID: {batch["id"]}')
        print(f'  Product: {batch["product_name"]}')
        print(f'  Status: {batch["status"]} (should be "pending")')
        print(f'  Quality Score: {batch["quality_score"]}')
        print(f'  Risk Level: {batch["risk_level"]}')
        print(f'  Created by: {batch["created_by"]}')
    else:
        print(f'❌ Error: {r.text}')
        return
    
    # Test validation errors
    print('\n3. Testing validation - empty product_name...')
    r = requests.post(f'{BASE}/api/manufacturers/batches', 
                     json={'product_name': '', 'quantity': 100}, 
                     headers=headers)
    print(f'Status: {r.status_code}')
    print(f'Error: {r.json().get("error", r.text)}')
    
    print('\n4. Testing validation - invalid quality_score (>100)...')
    r = requests.post(f'{BASE}/api/manufacturers/batches', 
                     json={'product_name': 'Test', 'quantity': 100, 'quality_score': 150}, 
                     headers=headers)
    print(f'Status: {r.status_code}')
    print(f'Error: {r.json().get("error", r.text)}')
    
    print('\n5. Testing validation - missing quantity...')
    r = requests.post(f'{BASE}/api/manufacturers/batches', 
                     json={'product_name': 'Test Product'}, 
                     headers=headers)
    print(f'Status: {r.status_code}')
    print(f'Error: {r.json().get("error", r.text)}')
    
    print('\n6. Testing validation - invalid risk_level...')
    r = requests.post(f'{BASE}/api/manufacturers/batches', 
                     json={'product_name': 'Test', 'quantity': 100, 'risk_level': 'extreme'}, 
                     headers=headers)
    print(f'Status: {r.status_code}')
    print(f'Error: {r.json().get("error", r.text)}')
    
    print('\n7. Testing with minimal data (only required fields)...')
    r = requests.post(f'{BASE}/api/manufacturers/batches', 
                     json={'product_name': 'Vodka Test', 'quantity': 500}, 
                     headers=headers)
    print(f'Status: {r.status_code}')
    if r.status_code == 201:
        batch = r.json()['batch']
        print('✓ Batch created with minimal data')
        print(f'  Status: {batch["status"]} (should be "pending")')
        print(f'  Quality Score: {batch["quality_score"]} (should be 0)')
        print(f'  Risk Level: {batch["risk_level"]} (should be "low")')
    else:
        print(f'Error: {r.json().get("error", r.text)}')
    
    print('\n✅ All tests completed!')

if __name__ == '__main__':
    test_create_batch()
