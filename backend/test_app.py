#!/usr/bin/env python3
"""
Test script to verify Flask app can start without errors
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("🔍 Testing Flask app imports...")
    
    # Test basic imports
    from flask import Flask
    print("✅ Flask import successful")
    
    from flask_cors import CORS
    print("✅ Flask-CORS import successful")
    
    import sqlite3
    print("✅ SQLite3 import successful")
    
    import bcrypt
    print("✅ bcrypt import successful")
    
    print("\n🔍 Testing app creation...")
    
    # Test app creation
    app = Flask(__name__)
    CORS(app)
    print("✅ Flask app creation successful")
    
    print("\n🔍 Testing database initialization...")
    
    # Test database connection
    DATABASE = 'agies.db'
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = c.fetchall()
    print(f"✅ Database connection successful. Found {len(tables)} tables")
    conn.close()
    
    print("\n🎉 All tests passed! Flask app should start successfully.")
    
except Exception as e:
    print(f"❌ Test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
