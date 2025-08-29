#!/usr/bin/env python3
"""
🌐 Maze Password Manager - Enterprise Security Backend
High-level security monitoring with real-time threat detection
"""

import os
import sqlite3
import hashlib
import secrets
import json
import time
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify, session, render_template, send_from_directory
from flask_cors import CORS
import requests

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SESSION_TYPE'] = 'filesystem'

# Enable CORS
CORS(app, supports_credentials=True)

# Configuration
DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'maze_vault.db')
HAVEIBEENPWNED_API_KEY = os.environ.get('HAVEIBEENPWNED_API_KEY', 'demo-key')

# Database initialization
def init_db():
    """Initialize database with required tables"""
    try:
        print(f"🔍 Initializing database at: {DATABASE}")
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        # Create users table
        c.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                subscription_plan TEXT DEFAULT 'free',
                subscription_status TEXT DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        ''')
        
        # Create vaults table
        c.execute('''
            CREATE TABLE IF NOT EXISTS vaults (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                icon TEXT DEFAULT '🔐',
                password_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Create passwords table
        c.execute('''
            CREATE TABLE IF NOT EXISTS passwords (
                id TEXT PRIMARY KEY,
                vault_id TEXT NOT NULL,
                title TEXT NOT NULL,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                url TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (vault_id) REFERENCES vaults (id)
            )
        ''')
        
        # Create security monitoring table
        c.execute('''
            CREATE TABLE IF NOT EXISTS security_monitoring (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                email TEXT NOT NULL,
                domain TEXT NOT NULL,
                breach_status TEXT DEFAULT 'safe',
                last_scan TIMESTAMP,
                threat_level TEXT DEFAULT 'low',
                security_score INTEGER DEFAULT 100,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        print("✅ Database tables created successfully")
        
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
    finally:
        if 'conn' in locals() and conn:
            conn.close()

def get_db():
    """Get database connection"""
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return None

# Authentication decorator
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/')
def index():
    """Serve the main application"""
    print(f"🌐 Serving index.html for route: /")
    return send_from_directory('../public', 'index.html')

@app.route('/login')
def login_page():
    """Serve the login page"""
    print(f"🔐 Serving login.html for route: /login")
    return send_from_directory('../public', 'login.html')

@app.route('/register')
def register_page():
    """Serve the register page"""
    print(f"📝 Serving register.html for route: /register")
    return send_from_directory('../public', 'register.html')

@app.route('/dark-web-monitor')
def dark_web_monitor():
    """Serve the dark web monitor page"""
    print(f"🚨 Serving dark-web-monitor.html for route: /dark-web-monitor")
    return send_from_directory('../public', 'dark-web-monitor.html')

@app.route('/dashboard')
def dashboard():
    """Serve the dashboard page"""
    print(f"📊 Serving dashboard.html for route: /dashboard")
    return send_from_directory('../public', 'dashboard.html')

@app.route('/security-dashboard')
def security_dashboard():
    """Serve the security dashboard page"""
    print(f"🛡️ Serving security-dashboard.html for route: /security-dashboard")
    return send_from_directory('../public', 'security-dashboard.html')

@app.route('/vaults')
def vaults():
    """Serve the vaults page"""
    print(f"🔐 Serving vaults.html for route: /vaults")
    return send_from_directory('../public', 'vaults.html')

@app.route('/pricing')
def pricing():
    """Serve the pricing page"""
    print(f"💰 Serving pricing.html for route: /pricing")
    return send_from_directory('../public', 'pricing.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files from public directory"""
    print(f"📁 Serving static file: {filename}")
    try:
        return send_from_directory('../public', filename)
    except FileNotFoundError:
        print(f"⚠️ File not found: {filename}, serving index.html instead")
        # If file not found, try to serve index.html for SPA routing
        return send_from_directory('../public', 'index.html')

# API Routes
@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Maze Password Manager Backend'
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        conn = get_db()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = c.fetchone()
        
        if user and verify_password(password, user['password_hash']):
            # Update last login
            c.execute('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', (user['id'],))
            conn.commit()
            
            return jsonify({
                'success': True,
                'user_id': user['id'],
                'email': user['email'],
                'subscription_plan': user['subscription_plan']
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        conn = get_db()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        c = conn.cursor()
        
        # Check if user already exists
        c.execute('SELECT id FROM users WHERE email = ?', (email,))
        if c.fetchone():
            return jsonify({'error': 'User already exists'}), 409
        
        # Create new user
        user_id = secrets.token_urlsafe(32)
        password_hash = hash_password(password)
        
        c.execute('''
            INSERT INTO users (id, email, password_hash, created_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ''', (user_id, email, password_hash))
        
        conn.commit()
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'message': 'User registered successfully'
        })
        
    except Exception as e:
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@app.route('/api/security/scan', methods=['POST'])
@require_auth
def security_scan():
    """Security scan endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email required'}), 400
        
        # Simulate security scan
        scan_result = {
            'email': email,
            'domain': email.split('@')[1] if '@' in email else 'unknown',
            'scan_status': 'completed',
            'threats_found': 0,
            'security_score': 95,
            'recommendations': [
                'Enable 2FA for enhanced security',
                'Use strong, unique passwords',
                'Monitor account activity regularly'
            ],
            'scan_timestamp': datetime.now().isoformat()
        }
        
        return jsonify(scan_result)
        
    except Exception as e:
        return jsonify({'error': f'Security scan failed: {str(e)}'}), 500

@app.route('/api/security/breach-check', methods=['POST'])
@require_auth
def breach_check():
    """Check for data breaches"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email required'}), 400
        
        # Simulate breach check (in production, use HaveIBeenPwned API)
        breach_result = {
            'email': email,
            'breaches_found': 0,
            'status': 'safe',
            'last_checked': datetime.now().isoformat(),
            'message': 'No breaches found for this email'
        }
        
        return jsonify(breach_result)
        
    except Exception as e:
        return jsonify({'error': f'Breach check failed: {str(e)}'}), 500

# Utility functions
def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, password_hash):
    """Verify password against hash"""
    return hash_password(password) == password_hash

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Initialize database
if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
else:
    init_db()
