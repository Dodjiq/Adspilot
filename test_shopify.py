#!/usr/bin/env python3
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Get auth token
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL')

print("Getting auth token...")
auth_url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
auth_data = {"email": "demo@easyecom.com", "password": "Demo2024!"}
auth_headers = {"apikey": SUPABASE_ANON_KEY, "Content-Type": "application/json"}

auth_response = requests.post(auth_url, json=auth_data, headers=auth_headers)
if auth_response.status_code != 200:
    print(f"Auth failed: {auth_response.status_code} - {auth_response.text}")
    exit(1)

token = auth_response.json().get('access_token')
print(f"Got token: {token[:20]}...")

# Test Shopify connect
print("\nTesting Shopify connect...")
shopify_url = f"{BASE_URL}/api/shopify/connect"
shopify_data = {"shopUrl": "hydrogen-demo.myshopify.com"}
shopify_headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

try:
    print(f"Making request to: {shopify_url}")
    shopify_response = requests.post(shopify_url, json=shopify_data, headers=shopify_headers, timeout=30)
    print(f"Status: {shopify_response.status_code}")
    print(f"Headers: {dict(shopify_response.headers)}")
    print(f"Response: {shopify_response.text}")
except requests.exceptions.Timeout:
    print("Request timed out")
except Exception as e:
    print(f"Error: {e}")