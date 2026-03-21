#!/usr/bin/env python3
"""
Backend API Testing for Easy-Ecom
Tests all API endpoints with proper authentication
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://easy-shop-templates.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

# Test credentials
TEST_EMAIL = "demo@easyecom.com"
TEST_PASSWORD = "Demo2024!"

class EasyEcomAPITester:
    def __init__(self):
        self.auth_token = None
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'EasyEcom-Test/1.0'
        })
    
    def get_auth_token(self):
        """Get authentication token from Supabase"""
        try:
            print("🔐 Getting authentication token...")
            
            # Sign in to get access token
            auth_url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
            auth_data = {
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            }
            auth_headers = {
                "apikey": SUPABASE_ANON_KEY,
                "Content-Type": "application/json"
            }
            
            response = requests.post(auth_url, json=auth_data, headers=auth_headers)
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get('access_token')
                if self.auth_token:
                    print("✅ Authentication token obtained successfully")
                    return True
                else:
                    print("❌ No access token in response")
                    print(f"Response: {data}")
                    return False
            else:
                print(f"❌ Authentication failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Authentication error: {str(e)}")
            return False
    
    def make_request(self, method, endpoint, data=None, auth_required=True):
        """Make API request with optional authentication"""
        url = f"{API_BASE}/{endpoint}"
        headers = {}
        
        if auth_required and self.auth_token:
            headers['Authorization'] = f'Bearer {self.auth_token}'
        
        try:
            # Set timeout for requests
            timeout = 30
            
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers, timeout=timeout)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, headers=headers, timeout=timeout)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers, timeout=timeout)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.Timeout:
            print(f"❌ Request timeout for {method} {endpoint}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"❌ Request error for {method} {endpoint}: {str(e)}")
            return None
        except Exception as e:
            print(f"❌ Unexpected error for {method} {endpoint}: {str(e)}")
            return None
    
    def test_health_endpoint(self):
        """Test GET /api/health"""
        print("\n🏥 Testing Health Endpoint...")
        
        try:
            response = self.make_request('GET', 'health', auth_required=False)
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get('status') == 'ok' and 'timestamp' in data:
                    print("✅ Health endpoint working correctly")
                    return True
                else:
                    print(f"❌ Unexpected health response: {data}")
                    return False
            else:
                print(f"❌ Health endpoint failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Health endpoint error: {str(e)}")
            return False
    
    def test_templates_endpoint(self):
        """Test GET /api/templates"""
        print("\n📋 Testing Templates Endpoint...")
        
        try:
            response = self.make_request('GET', 'templates', auth_required=False)
            
            if response and response.status_code == 200:
                data = response.json()
                templates = data.get('templates', [])
                if len(templates) == 12:
                    print(f"✅ Templates endpoint working - found {len(templates)} templates")
                    # Verify template structure
                    template = templates[0]
                    required_fields = ['id', 'title', 'description', 'niche', 'format']
                    if all(field in template for field in required_fields):
                        print("✅ Template structure is correct")
                        return True
                    else:
                        print(f"❌ Template missing required fields: {template}")
                        return False
                else:
                    print(f"❌ Expected 12 templates, got {len(templates)}")
                    return False
            else:
                print(f"❌ Templates endpoint failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Templates endpoint error: {str(e)}")
            return False
    
    def test_templates_seed(self):
        """Test POST /api/templates/seed"""
        print("\n🌱 Testing Templates Seed Endpoint...")
        
        try:
            response = self.make_request('POST', 'templates/seed', auth_required=False)
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('count') == 12:
                    print("✅ Templates seed working correctly")
                    return True
                else:
                    print(f"❌ Unexpected seed response: {data}")
                    return False
            else:
                print(f"❌ Templates seed failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Templates seed error: {str(e)}")
            return False
    
    def test_save_template(self):
        """Test POST /api/templates/save"""
        print("\n💾 Testing Save Template Endpoint...")
        
        if not self.auth_token:
            print("❌ No auth token available for save template test")
            return False
        
        try:
            # Test saving a template
            save_data = {"template_id": "t1", "action": "save"}
            response = self.make_request('POST', 'templates/save', data=save_data)
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print("✅ Save template working correctly")
                    
                    # Test unsaving the template
                    unsave_data = {"template_id": "t1", "action": "unsave"}
                    unsave_response = self.make_request('POST', 'templates/save', data=unsave_data)
                    
                    if unsave_response and unsave_response.status_code == 200:
                        unsave_result = unsave_response.json()
                        if unsave_result.get('success'):
                            print("✅ Unsave template working correctly")
                            return True
                        else:
                            print(f"❌ Unsave failed: {unsave_result}")
                            return False
                    else:
                        print(f"❌ Unsave request failed: {unsave_response.status_code if unsave_response else 'No response'}")
                        return False
                else:
                    print(f"❌ Save template failed: {data}")
                    return False
            else:
                print(f"❌ Save template request failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Save template error: {str(e)}")
            return False
    
    def test_saved_templates(self):
        """Test GET /api/templates/saved"""
        print("\n📚 Testing Saved Templates Endpoint...")
        
        if not self.auth_token:
            print("❌ No auth token available for saved templates test")
            return False
        
        try:
            response = self.make_request('GET', 'templates/saved')
            
            if response and response.status_code == 200:
                data = response.json()
                if 'saved' in data:
                    saved_templates = data['saved']
                    print(f"✅ Saved templates endpoint working - found {len(saved_templates)} saved templates")
                    return True
                else:
                    print(f"❌ Unexpected saved templates response: {data}")
                    return False
            else:
                print(f"❌ Saved templates failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Saved templates error: {str(e)}")
            return False
    
    def test_shopify_connect(self):
        """Test POST /api/shopify/connect"""
        print("\n🛍️ Testing Shopify Connect Endpoint...")
        
        if not self.auth_token:
            print("❌ No auth token available for Shopify connect test")
            return False
        
        try:
            # Test with a real public Shopify store that has accessible products.json
            connect_data = {"shopUrl": "allbirds.com"}
            print(f"Making request to: {API_BASE}/shopify/connect")
            print(f"With data: {connect_data}")
            
            response = self.make_request('POST', 'shopify/connect', data=connect_data)
            
            if response:
                print(f"Response status: {response.status_code}")
                print(f"Response headers: {dict(response.headers)}")
                print(f"Response text: {response.text[:500]}...")
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if data.get('success') and 'store' in data:
                            store = data['store']
                            required_fields = ['id', 'user_id', 'shopify_domain', 'shop_name']
                            if all(field in store for field in required_fields):
                                print("✅ Shopify connect working correctly")
                                print(f"Connected store: {store['shop_name']} ({store['shopify_domain']})")
                                return True
                            else:
                                print(f"❌ Store object missing required fields: {store}")
                                return False
                        else:
                            print(f"❌ Shopify connect failed: {data}")
                            return False
                    except json.JSONDecodeError as e:
                        print(f"❌ Invalid JSON response: {e}")
                        return False
                else:
                    print(f"❌ Shopify connect request failed with status: {response.status_code}")
                    return False
            else:
                print("❌ No response received")
                return False
                
        except Exception as e:
            print(f"❌ Shopify connect error: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
    
    def test_get_store(self):
        """Test GET /api/store"""
        print("\n🏪 Testing Get Store Endpoint...")
        
        if not self.auth_token:
            print("❌ No auth token available for get store test")
            return False
        
        try:
            response = self.make_request('GET', 'store')
            
            if response and response.status_code == 200:
                data = response.json()
                if 'store' in data:
                    store = data['store']
                    if store is None:
                        print("✅ Get store working - no store connected")
                        return True
                    else:
                        print(f"✅ Get store working - store found: {store.get('shop_name', 'Unknown')}")
                        return True
                else:
                    print(f"❌ Unexpected get store response: {data}")
                    return False
            else:
                print(f"❌ Get store failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Get store error: {str(e)}")
            return False
    
    def test_disconnect_store(self):
        """Test POST /api/store/disconnect"""
        print("\n🔌 Testing Disconnect Store Endpoint...")
        
        if not self.auth_token:
            print("❌ No auth token available for disconnect store test")
            return False
        
        try:
            response = self.make_request('POST', 'store/disconnect')
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print("✅ Disconnect store working correctly")
                    return True
                else:
                    print(f"❌ Disconnect store failed: {data}")
                    return False
            else:
                print(f"❌ Disconnect store request failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Disconnect store error: {str(e)}")
            return False
    
    def test_get_profile(self):
        """Test GET /api/profile"""
        print("\n👤 Testing Get Profile Endpoint...")
        
        if not self.auth_token:
            print("❌ No auth token available for get profile test")
            return False
        
        try:
            response = self.make_request('GET', 'profile')
            
            if response and response.status_code == 200:
                data = response.json()
                if 'profile' in data:
                    profile = data['profile']
                    if profile is None:
                        print("✅ Get profile working - no profile found")
                        return True
                    else:
                        print(f"✅ Get profile working - profile found")
                        return True
                else:
                    print(f"❌ Unexpected get profile response: {data}")
                    return False
            else:
                print(f"❌ Get profile failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Get profile error: {str(e)}")
            return False
    
    def test_update_profile(self):
        """Test POST /api/profile"""
        print("\n✏️ Testing Update Profile Endpoint...")
        
        if not self.auth_token:
            print("❌ No auth token available for update profile test")
            return False
        
        try:
            profile_data = {
                "full_name": "Jean Kouame",
                "business_name": "Beauté Africaine",
                "business_niche": "beaute"
            }
            response = self.make_request('POST', 'profile', data=profile_data)
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print("✅ Update profile working correctly")
                    return True
                else:
                    print(f"❌ Update profile failed: {data}")
                    return False
            else:
                print(f"❌ Update profile request failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Update profile error: {str(e)}")
            return False
    
    def test_auth_protection(self):
        """Test that protected endpoints return 401 without auth"""
        print("\n🔒 Testing Auth Protection...")
        
        protected_endpoints = [
            ('GET', 'templates/saved'),
            ('POST', 'templates/save'),
            ('POST', 'shopify/connect'),
            ('GET', 'store'),
            ('POST', 'store/disconnect'),
            ('GET', 'profile'),
            ('POST', 'profile')
        ]
        
        all_protected = True
        
        for method, endpoint in protected_endpoints:
            try:
                # Make request without auth token
                url = f"{API_BASE}/{endpoint}"
                if method == 'GET':
                    response = self.session.get(url)
                else:
                    response = self.session.post(url, json={})
                
                if response.status_code == 401:
                    print(f"✅ {method} /{endpoint} properly protected")
                else:
                    print(f"❌ {method} /{endpoint} not protected (status: {response.status_code})")
                    all_protected = False
                    
            except Exception as e:
                print(f"❌ Error testing protection for {method} /{endpoint}: {str(e)}")
                all_protected = False
        
        return all_protected
    
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Easy-Ecom Backend API Tests")
        print("=" * 50)
        
        results = {}
        
        # Test non-auth endpoints first
        results['health'] = self.test_health_endpoint()
        results['templates'] = self.test_templates_endpoint()
        results['templates_seed'] = self.test_templates_seed()
        results['auth_protection'] = self.test_auth_protection()
        
        # Get auth token for protected endpoints
        if self.get_auth_token():
            results['save_template'] = self.test_save_template()
            results['saved_templates'] = self.test_saved_templates()
            results['shopify_connect'] = self.test_shopify_connect()
            results['get_store'] = self.test_get_store()
            results['disconnect_store'] = self.test_disconnect_store()
            results['get_profile'] = self.test_get_profile()
            results['update_profile'] = self.test_update_profile()
        else:
            print("⚠️ Skipping authenticated endpoint tests due to auth failure")
            auth_endpoints = ['save_template', 'saved_templates', 'shopify_connect', 
                            'get_store', 'disconnect_store', 'get_profile', 'update_profile']
            for endpoint in auth_endpoints:
                results[endpoint] = False
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name.replace('_', ' ').title()}: {status}")
        
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️ {total - passed} tests failed")
            return False

if __name__ == "__main__":
    tester = EasyEcomAPITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)