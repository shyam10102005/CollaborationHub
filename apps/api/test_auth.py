import httpx

base = 'http://localhost:8000/api/v1'

# 1. Register
r = httpx.post(f'{base}/auth/register', json={'email': 'demo@collabhub.io', 'password': 'password123', 'display_name': 'Demo Creator'})
print('REGISTER:', r.status_code, r.text[:200])
tokens = r.json()

# 2. Get profile
r2 = httpx.get(f'{base}/auth/me', headers={'Authorization': f"Bearer {tokens['access_token']}"})
print('GET ME:', r2.status_code, r2.text[:300])

# 3. Login
r3 = httpx.post(f'{base}/auth/login', json={'email': 'demo@collabhub.io', 'password': 'password123'})
print('LOGIN:', r3.status_code, r3.text[:200])
