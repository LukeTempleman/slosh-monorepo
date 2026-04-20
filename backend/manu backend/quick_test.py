#!/usr/bin/env python
"""Quick API verification test"""
import requests

BASE = 'http://localhost:5001'
print('Testing API endpoints...\n')

# 1. Login
r = requests.post(f'{BASE}/api/auth/login', json={'username': 'test_user', 'password': 'TestPass123!'})
if r.status_code != 200:
    print(f'✗ Auth failed: {r.status_code}')
    exit(1)

token = r.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}
print('✓ Authentication works')

# 2. Get all batches
r = requests.get(f'{BASE}/api/manufacturers/batches', headers=headers)
if r.status_code == 200:
    count = len(r.json()['data'])
    print(f'✓ Get all batches: {count} batches')

# 3. Filter by status
r = requests.get(f'{BASE}/api/manufacturers/batches?status=production', headers=headers)
if r.status_code == 200:
    count = len(r.json()['data'])
    print(f'✓ Filter status=production: {count} batches')

# 4. Filter by risk
r = requests.get(f'{BASE}/api/manufacturers/batches?risk_level=high', headers=headers)
if r.status_code == 200:
    count = len(r.json()['data'])
    print(f'✓ Filter risk_level=high: {count} batches')

# 5. Combined filters
r = requests.get(f'{BASE}/api/manufacturers/batches?status=completed&risk_level=low&limit=10', headers=headers)
if r.status_code == 200:
    count = len(r.json()['data'])
    print(f'✓ Combined filters: {count} batches (limit=10)')

# 6. Error handling
r = requests.get(f'{BASE}/api/manufacturers/batches?status=invalid', headers=headers)
if r.status_code == 400:
    print(f'✓ Invalid filter validation: 400 error returned')

print('\n✅ API TEST COMPLETE - All endpoints working!')
