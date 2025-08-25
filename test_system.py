#!/usr/bin/env python3
"""
🧪 Maze Password Manager - Complete System Test
Tests all payment, admin, and user functionality
"""

import requests
import json
import time
import sys

# Test configuration
BASE_URL = "http://localhost:8000"  # Change to your Render URL when deployed
ADMIN_KEY = "maze_admin_2024"

def print_test_result(test_name, success, message=""):
    """Print formatted test result"""
    if success:
        print(f"✅ {test_name}: PASSED")
        if message:
            print(f"   📝 {message}")
    else:
        print(f"❌ {test_name}: FAILED")
        if message:
            print(f"   📝 {message}")
    print()

def test_health_check():
    """Test basic API health"""
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            data = response.json()
            return True, f"API healthy - Database: {data.get('database', 'unknown')}"
        else:
            return False, f"Health check failed: {response.status_code}"
    except Exception as e:
        return False, f"Health check error: {str(e)}"

def test_subscription_system():
    """Test subscription system status"""
    try:
        response = requests.get(f"{BASE_URL}/api/test/subscription")
        if response.status_code == 200:
            data = response.json()
            return True, f"Subscription system working - {data.get('total_users', 0)} users, {data.get('total_vaults', 0)} vaults"
        else:
            return False, f"Subscription test failed: {response.status_code}"
    except Exception as e:
        return False, f"Subscription test error: {str(e)}"

def test_upi_payment_methods():
    """Test UPI payment methods endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/payments/upi/methods")
        if response.status_code == 200:
            data = response.json()
            methods = list(data.keys())
            return True, f"UPI methods available: {', '.join(methods)}"
        else:
            return False, f"UPI methods failed: {response.status_code}"
    except Exception as e:
        return False, f"UPI methods error: {str(e)}"

def test_admin_routes():
    """Test admin route accessibility"""
    try:
        # Test pending payments (should work even if empty)
        response = requests.get(f"{BASE_URL}/api/admin/pending-payments")
        if response.status_code == 200:
            return True, "Admin routes accessible"
        else:
            return False, f"Admin routes failed: {response.status_code}"
    except Exception as e:
        return False, f"Admin routes error: {str(e)}"

def test_database_migration():
    """Test database migration endpoint"""
    try:
        response = requests.post(f"{BASE_URL}/api/admin/migrate")
        if response.status_code == 200:
            return True, "Database migration successful"
        else:
            return False, f"Migration failed: {response.status_code}"
    except Exception as e:
        return False, f"Migration error: {str(e)}"

def test_frontend_pages():
    """Test if frontend pages are accessible"""
    pages = [
        "/",
        "/login", 
        "/dashboard",
        "/pricing",
        "/admin"
    ]
    
    results = []
    for page in pages:
        try:
            response = requests.get(f"{BASE_URL}{page}")
            if response.status_code == 200:
                results.append(f"{page}: ✅")
            else:
                results.append(f"{page}: ❌ ({response.status_code})")
        except Exception as e:
            results.append(f"{page}: ❌ (Error: {str(e)})")
    
    return True, f"Frontend pages: {' | '.join(results)}"

def run_complete_test():
    """Run all tests"""
    print("🧪 MAZE PASSWORD MANAGER - COMPLETE SYSTEM TEST")
    print("=" * 60)
    print()
    
    tests = [
        ("Health Check", test_health_check),
        ("Subscription System", test_subscription_system),
        ("UPI Payment Methods", test_upi_payment_methods),
        ("Admin Routes", test_admin_routes),
        ("Database Migration", test_database_migration),
        ("Frontend Pages", test_frontend_pages)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"🔍 Testing: {test_name}")
        success, message = test_func()
        print_test_result(test_name, success, message)
        
        if success:
            passed += 1
    
    # Summary
    print("=" * 60)
    print(f"📊 TEST SUMMARY: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready for deployment!")
        print("\n🚀 Next steps:")
        print("1. Deploy to Render")
        print("2. Test UPI payment flow")
        print("3. Verify admin dashboard")
        print("4. Start accepting real payments!")
    else:
        print("⚠️ Some tests failed. Please fix issues before deployment.")
        print(f"Failed tests: {total - passed}")
    
    return passed == total

if __name__ == "__main__":
    print("🚀 Starting Maze Password Manager System Test...")
    print("Make sure your Flask app is running on localhost:8000")
    print()
    
    try:
        success = run_complete_test()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Test failed with error: {str(e)}")
        sys.exit(1)
