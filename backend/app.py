from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import sqlite3
import os
import json
import uuid
from datetime import datetime
import bcrypt
import time

app = Flask(__name__)
CORS(app)

# Database setup
DATABASE = 'agies.db'

# Subscription plans and features
SUBSCRIPTION_PLANS = {
    'free': {
        'name': 'Free Plan',
        'price': 0,
        'currency': 'INR',
        'features': {
            'max_passwords': 50,
            'max_vaults': 2,
            'dark_web_monitoring': False,
            'ai_security': False,
            'priority_support': False,
            'team_sharing': False,
            'advanced_analytics': False,
            'custom_themes': False
        }
    },
    'pro': {
        'name': 'Pro Plan',
        'price': 299,
        'currency': 'INR',
        'billing_cycle': 'monthly',
        'features': {
            'max_passwords': 1000,
            'max_vaults': 10,
            'dark_web_monitoring': True,
            'ai_security': True,
            'priority_support': False,
            'team_sharing': False,
            'advanced_analytics': False,
            'custom_themes': True
        }
    },
    'premium': {
        'name': 'Premium Plan',
        'price': 599,
        'currency': 'INR',
        'billing_cycle': 'monthly',
        'features': {
            'max_passwords': 10000,
            'max_vaults': 50,
            'dark_web_monitoring': True,
            'ai_security': True,
            'priority_support': True,
            'team_sharing': True,
            'advanced_analytics': True,
            'custom_themes': True
        }
    },
    'enterprise': {
        'name': 'Enterprise Plan',
        'price': 1499,
        'currency': 'INR',
        'billing_cycle': 'monthly',
        'features': {
            'max_passwords': 100000,
            'max_vaults': 100,
            'dark_web_monitoring': True,
            'ai_security': True,
            'priority_support': True,
            'team_sharing': True,
            'advanced_analytics': True,
            'custom_themes': True,
            'sso_integration': True,
            'api_access': True
        }
    }
}

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    # Create users table with subscription info
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            subscription_plan TEXT DEFAULT 'free',
            subscription_status TEXT DEFAULT 'active',
            subscription_start_date TIMESTAMP,
            subscription_end_date TIMESTAMP,
            payment_provider TEXT,
            payment_customer_id TEXT,
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
    
    # Create subscriptions table
    c.execute('''
        CREATE TABLE IF NOT EXISTS subscriptions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            plan_name TEXT NOT NULL,
            status TEXT NOT NULL,
            amount INTEGER NOT NULL,
            currency TEXT DEFAULT 'INR',
            payment_provider TEXT,
            payment_id TEXT,
            start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            end_date TIMESTAMP,
            auto_renew BOOLEAN DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create payments table
    c.execute('''
        CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            subscription_id TEXT,
            amount INTEGER NOT NULL,
            currency TEXT DEFAULT 'INR',
            payment_provider TEXT NOT NULL,
            payment_id TEXT NOT NULL,
            status TEXT NOT NULL,
            payment_method TEXT,
            upi_transaction_id TEXT,
            payment_screenshot TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
        )
    ''')
    
    # Create admin notifications table
    c.execute('''
        CREATE TABLE IF NOT EXISTS admin_notifications (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            user_id TEXT NOT NULL,
            payment_id TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (payment_id) REFERENCES payments (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db():
    """Get database connection with row factory set to return dictionaries"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # This will allow us to access columns by name
    return conn

# Initialize database
init_db()

# Database migration function - Enhanced for existing deployments
def migrate_database():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    try:
        print("Starting database migration...")
        
        # Check if subscription columns exist in users table
        c.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in c.fetchall()]
        
        # Add missing subscription columns if they don't exist
        if 'subscription_plan' not in columns:
            c.execute('ALTER TABLE users ADD COLUMN subscription_plan TEXT DEFAULT "free"')
            print("✅ Added subscription_plan column")
            
        if 'subscription_status' not in columns:
            c.execute('ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT "active"')
            print("✅ Added subscription_status column")
            
        if 'subscription_start_date' not in columns:
            c.execute('ALTER TABLE users ADD COLUMN subscription_start_date TIMESTAMP')
            print("✅ Added subscription_start_date column")
            
        if 'subscription_end_date' not in columns:
            c.execute('ALTER TABLE users ADD COLUMN subscription_end_date TIMESTAMP')
            print("✅ Added subscription_end_date column")
            
        if 'payment_provider' not in columns:
            c.execute('ALTER TABLE users ADD COLUMN payment_provider TEXT')
            print("✅ Added payment_provider column")
            
        if 'payment_customer_id' not in columns:
            c.execute('ALTER TABLE users ADD COLUMN payment_customer_id TEXT')
            print("✅ Added payment_customer_id column")
        
        # Update existing users to have free plan
        c.execute('UPDATE users SET subscription_plan = "free" WHERE subscription_plan IS NULL')
        print("✅ Updated existing users to free plan")
        
        # Check if subscriptions table exists
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='subscriptions'")
        if not c.fetchone():
            c.execute('''
                CREATE TABLE subscriptions (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    plan_name TEXT NOT NULL,
                    status TEXT NOT NULL,
                    amount INTEGER NOT NULL,
                    currency TEXT DEFAULT 'INR',
                    payment_provider TEXT,
                    payment_id TEXT,
                    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    end_date TIMESTAMP,
                    auto_renew BOOLEAN DEFAULT 1,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            ''')
            print("✅ Created subscriptions table")
        
        # Check if payments table exists
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='payments'")
        if not c.fetchone():
            c.execute('''
                CREATE TABLE payments (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    subscription_id TEXT,
                    amount INTEGER NOT NULL,
                    currency TEXT DEFAULT 'INR',
                    payment_provider TEXT NOT NULL,
                    payment_id TEXT NOT NULL,
                    status TEXT NOT NULL,
                    payment_method TEXT,
                    upi_transaction_id TEXT,
                    payment_screenshot TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
                )
            ''')
            print("✅ Created payments table")
        
        # Check if admin_notifications table exists
        c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_notifications'")
        if not c.fetchone():
            c.execute('''
                CREATE TABLE admin_notifications (
                    id TEXT PRIMARY KEY,
                    type TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    payment_id TEXT,
                    message TEXT NOT NULL,
                    status TEXT DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (payment_id) REFERENCES payments (id)
                )
            ''')
            print("✅ Created admin_notifications table")
        
        # Create a test subscription for demonstration
        c.execute("SELECT COUNT(*) FROM subscriptions")
        if c.fetchone()[0] == 0:
            # Create a demo subscription to show the system works
            demo_sub_id = str(uuid.uuid4())
            c.execute('''
                INSERT INTO subscriptions (id, user_id, plan_name, status, amount, currency, payment_provider, payment_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (demo_sub_id, 'demo-user', 'pro', 'active', 299, 'INR', 'demo', 'demo-payment'))
            print("✅ Created demo subscription for testing")
        
        conn.commit()
        print("🎉 Database migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        conn.rollback()
    finally:
        conn.close()

# Enhanced subscription checking with better error handling
def get_user_subscription_plan(user_id):
    try:
        conn = get_db()
        c = conn.cursor()
        
        c.execute('SELECT subscription_plan FROM users WHERE id = ?', (user_id,))
        user = c.fetchone()
        conn.close()
        
        if not user or not user['subscription_plan']:
            return 'free'  # Default to free plan
            
        return user['subscription_plan']
        
    except Exception as e:
        print(f"Error getting user subscription: {e}")
        return 'free'  # Default to free plan on error

# Check if user can add more passwords - Enhanced
def can_add_password(user_id):
    try:
        plan = get_user_subscription_plan(user_id)
        max_passwords = SUBSCRIPTION_PLANS[plan]['features']['max_passwords']
        
        conn = get_db()
        c = conn.cursor()
        
        # Count current passwords
        c.execute('''
            SELECT COUNT(*) as count FROM passwords p 
            JOIN vaults v ON p.vault_id = v.id 
            WHERE v.user_id = ?
        ''', (user_id,))
        
        current_count = c.fetchone()['count']
        conn.close()
        
        can_add = current_count < max_passwords
        print(f"User {user_id}: {current_count}/{max_passwords} passwords - Can add: {can_add}")
        
        return can_add
        
    except Exception as e:
        print(f"Error checking password limit: {e}")
        return True  # Allow on error to prevent blocking

# Check if user can add more vaults - Enhanced
def can_add_vault(user_id):
    try:
        plan = get_user_subscription_plan(user_id)
        max_vaults = SUBSCRIPTION_PLANS[plan]['features']['max_vaults']
        
        conn = get_db()
        c = conn.cursor()
        
        # Count current vaults
        c.execute('SELECT COUNT(*) as count FROM vaults WHERE user_id = ?', (user_id,))
        current_count = c.fetchone()['count']
        conn.close()
        
        can_add = current_count < max_vaults
        print(f"User {user_id}: {current_count}/{max_vaults} vaults - Can add: {can_add}")
        
        return can_add
        
    except Exception as e:
        print(f"Error checking vault limit: {e}")
        return True  # Allow on error to prevent blocking

# Authentication middleware
def require_auth(f):
    def decorated_function(*args, **kwargs):
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# Main routes for the application
@app.route('/')
def home():
    try:
        # Try multiple possible paths for the public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.getcwd(), 'public'),
            os.path.join(os.path.dirname(__file__), 'public')
        ]
        
        for path in possible_paths:
            if os.path.exists(os.path.join(path, 'index.html')):
                return send_from_directory(path, 'index.html')
        
        # If no path works, return debug info
        return jsonify({
            "error": "index.html not found",
            "possible_paths": possible_paths,
            "current_dir": os.getcwd(),
            "files_in_current": os.listdir('.') if os.path.exists('.') else []
        }), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving home page: {str(e)}"}), 500

@app.route('/login')
def login():
    try:
        # Try multiple possible paths for the public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.getcwd(), 'public'),
            os.path.join(os.path.dirname(__file__), '..', 'public')
        ]
        
        for path in possible_paths:
            if os.path.exists(os.path.join(path, 'login.html')):
                return send_from_directory(path, 'login.html')
        
        return jsonify({"error": "login.html not found"}), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving login page: {str(e)}"}), 500

@app.route('/dashboard')
def dashboard():
    try:
        # Try multiple possible paths for the public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.getcwd(), 'public'),
            os.path.join(os.path.dirname(__file__), '..', 'public')
        ]
        
        for path in possible_paths:
            if os.path.exists(os.path.join(path, 'dashboard-working.html')):
                return send_from_directory(path, 'dashboard-working.html')
        
        return jsonify({"error": "dashboard-working.html not found"}), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving dashboard: {str(e)}"}), 500

@app.route('/maze')
def maze():
    try:
        # Try multiple possible paths for the public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.path.dirname(__file__), '..', 'public')
        ]
        
        for path in possible_paths:
            if os.path.exists(os.path.join(path, 'maze-password-manager.html')):
                return send_from_directory(path, 'maze-password-manager.html')
        
        return jsonify({"error": "maze-password-manager.html not found"}), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving maze page: {str(e)}"}), 500

@app.route('/security')
def security():
    try:
        # Try multiple possible paths for the public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.getcwd(), 'public'),
            os.path.join(os.path.dirname(__file__), '..', 'public')
        ]
        
        for path in possible_paths:
            if os.path.exists(os.path.join(path, 'security-dashboard-working.html')):
                return send_from_directory(path, 'security-dashboard-working.html')
        
        return jsonify({"error": "security-dashboard-working.html not found"}), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving security page: {str(e)}"}), 500

@app.route('/pricing')
def pricing():
    try:
        # Try multiple possible paths for the public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.getcwd(), 'public'),
            os.path.join(os.path.dirname(__file__), '..', 'public')
        ]
        
        for path in possible_paths:
            if os.path.exists(os.path.join(path, 'pricing.html')):
                return send_from_directory(path, 'pricing.html')
        
        return jsonify({"error": "pricing.html not found"}), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving pricing page: {str(e)}"}), 500

@app.route('/vault-interface')
def vault_interface():
    try:
        # Try multiple possible paths for the public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.getcwd(), 'public'),
            os.path.join(os.path.dirname(__file__), '..', 'public')
        ]
        
        for path in possible_paths:
            if os.path.exists(os.path.join(path, 'vault-interface.html')):
                return send_from_directory(path, 'vault-interface.html')
        
        return jsonify({"error": "vault-interface.html not found"}), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving vault interface: {str(e)}"}), 500

@app.route('/vaults')
def vaults():
    try:
        # Try multiple possible paths for the public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.getcwd(), 'public'),
            os.path.join(os.path.dirname(__file__), '..', 'public')
        ]
        
        for path in possible_paths:
            if os.path.exists(os.path.join(path, 'vaults.html')):
                return send_from_directory(path, 'vaults.html')
        
        return jsonify({"error": "vaults.html not found"}), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving vaults page: {str(e)}"}), 500

# Debug route to check data persistence
@app.route('/api/debug/user-data/<user_id>', methods=['GET'])
def debug_user_data(user_id):
    try:
        conn = get_db()
        c = conn.cursor()
        
        # Get user info
        c.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = c.fetchone()
        
        if not user:
            conn.close()
            return jsonify({"error": "User not found"}), 404
        
        # Get user's vaults
        c.execute('SELECT * FROM vaults WHERE user_id = ?', (user_id,))
        vaults = c.fetchall()
        
        # Get total password count
        c.execute('''
            SELECT COUNT(*) as count FROM passwords p 
            JOIN vaults v ON p.vault_id = v.id 
            WHERE v.user_id = ?
        ''', (user_id,))
        total_passwords = c.fetchone()['count']
        
        # Get passwords by vault
        vault_passwords = {}
        for vault in vaults:
            c.execute('SELECT * FROM passwords WHERE vault_id = ?', (vault['id'],))
            passwords = c.fetchall()
            vault_passwords[vault['name']] = passwords
        
        conn.close()
        
        return jsonify({
            "user": {
                "id": user['id'],
                "email": user['email'],
                "subscription_plan": user.get('subscription_plan', 'free'),
                "created_at": user['created_at'],
                "last_login": user.get('last_login')
            },
            "vaults": [{
                "id": v['id'],
                "name": v['name'],
                "description": v['description'],
                "icon": v['icon'],
                "password_count": v['password_count'],
                "created_at": v['created_at']
            } for v in vaults],
            "total_passwords": total_passwords,
            "passwords_by_vault": vault_passwords,
            "debug_info": {
                "vault_count": len(vaults),
                "timestamp": datetime.now().isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check route
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT 1')
        conn.close()
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

# User registration
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user_id = str(uuid.uuid4())
        conn = get_db()
        c = conn.cursor()
        
        # Check if user exists
        c.execute('SELECT id FROM users WHERE email = ?', (email,))
        if c.fetchone():
            conn.close()
            return jsonify({"error": "User already exists"}), 409
        
        # Insert user
        c.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
                 (user_id, email, password_hash.decode('utf-8')))
        
        # Create default vault
        vault_id = str(uuid.uuid4())
        c.execute('INSERT INTO vaults (id, user_id, name, description, icon) VALUES (?, ?, ?, ?, ?)',
                 (vault_id, user_id, 'Personal Vault', 'Your personal passwords', '🔐'))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "User registered successfully",
            "user_id": user_id,
            "default_vault_id": vault_id
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# User login
@app.route('/api/auth/login', methods=['POST'])
def login_api():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Get user with subscription info
        try:
            c.execute('''
                SELECT id, password_hash, subscription_plan, subscription_status 
                FROM users WHERE email = ?
            ''', (email,))
        except sqlite3.OperationalError:
            # If subscription_plan column doesn't exist, create it
            try:
                c.execute('ALTER TABLE users ADD COLUMN subscription_plan TEXT DEFAULT "free"')
                c.execute('ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT "active"')
                conn.commit()
                print("✅ Added subscription columns during login")
                
                # Try the query again
                c.execute('''
                    SELECT id, password_hash, subscription_plan, subscription_status 
                    FROM users WHERE email = ?
                ''', (email,))
            except Exception as e:
                print(f"Error adding columns: {e}")
                # Fallback to basic user query
        c.execute('SELECT id, password_hash FROM users WHERE email = ?', (email,))
        
        user_result = c.fetchone()
        
        if not user_result:
            conn.close()
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Convert Row object to dictionary
        if hasattr(user_result, 'keys'):
            # It's already a Row object
            user = dict(user_result)
        else:
            # It's a tuple, convert to dict
            columns = [description[0] for description in c.description]
            user = dict(zip(columns, user_result))
        
        # Check password
        if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            # Generate a more secure token
            token = str(uuid.uuid4()) + '_' + str(int(time.time()))
            
            # Ensure user has subscription info
            subscription_plan = user.get('subscription_plan', 'free')
            subscription_status = user.get('subscription_status', 'active')
            
            # Update user's last login time and ensure subscription columns exist
            try:
                c.execute('''
                    UPDATE users 
                    SET last_login = CURRENT_TIMESTAMP,
                        subscription_plan = ?,
                        subscription_status = ?
                    WHERE id = ?
                ''', (subscription_plan, subscription_status, user['id']))
            except sqlite3.OperationalError:
                # If columns don't exist, try to add them
                try:
                    c.execute('ALTER TABLE users ADD COLUMN last_login TIMESTAMP')
                    c.execute('ALTER TABLE users ADD COLUMN subscription_plan TEXT DEFAULT "free"')
                    c.execute('ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT "active"')
                    conn.commit()
                    
                    # Update again
                    c.execute('''
                        UPDATE users 
                        SET last_login = CURRENT_TIMESTAMP,
                            subscription_plan = ?,
                            subscription_status = ?
                        WHERE id = ?
                    ''', (subscription_plan, subscription_status, user['id']))
                except Exception as e:
                    print(f"Error updating user: {e}")
            
            conn.commit()
            conn.close()
            
            return jsonify({
                "message": "Login successful",
                "user_id": user['id'],
                "email": email,
                "token": token,
                "subscription_plan": subscription_plan,
                "subscription_status": subscription_status
            }), 200
        else:
            conn.close()
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# User logout
@app.route('/api/auth/logout', methods=['POST'])
def logout():
    try:
        # In a real app, you'd invalidate the token
        # For now, just return success
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get user profile
@app.route('/api/auth/profile', methods=['GET'])
@require_auth
def get_profile():
    try:
        # Simple auth check (in production, use JWT)
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        c.execute('SELECT id, email, created_at FROM users WHERE id = ?', (user_id,))
        user = c.fetchone()
        conn.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "id": user['id'],
            "email": user['email'],
            "created_at": user['created_at']
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get user vaults
@app.route('/api/vaults', methods=['GET'])
@require_auth
def get_vaults():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        c.execute('SELECT * FROM vaults WHERE user_id = ?', (user_id,))
        vaults = c.fetchall()
        conn.close()
        
        vault_list = []
        for vault in vaults:
            vault_list.append({
                'id': vault['id'],
                'name': vault['name'],
                'description': vault['description'],
                'icon': vault['icon'],
                'password_count': vault['password_count'],
                'created_at': vault['created_at']
            })
        
        return jsonify(vault_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create new vault
@app.route('/api/vaults', methods=['POST'])
@require_auth
def create_vault():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        # Check vault limit based on subscription
        if not can_add_vault(user_id):
            return jsonify({
                "error": "Vault limit reached for your plan",
                "upgrade_required": True,
                "current_plan": "free",
                "suggested_plan": "pro"
            }), 403
        
        data = request.get_json()
        name = data.get('name')
        description = data.get('description', '')
        icon = data.get('icon', '🔐')
        
        if not name:
            return jsonify({"error": "Vault name required"}), 400
        
        vault_id = str(uuid.uuid4())
        conn = get_db()
        c = conn.cursor()
        
        c.execute('INSERT INTO vaults (id, user_id, name, description, icon) VALUES (?, ?, ?, ?, ?)',
                 (vault_id, user_id, name, description, icon))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Vault created successfully",
            "vault_id": vault_id
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get passwords for a vault
@app.route('/api/vaults/<vault_id>/passwords', methods=['GET'])
@require_auth
def get_passwords(vault_id):
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        # Verify vault belongs to user
        c.execute('SELECT id FROM vaults WHERE id = ? AND user_id = ?', (vault_id, user_id))
        vault = c.fetchone()
        if not vault:
            conn.close()
            return jsonify({"error": "Vault not found"}), 404
        
        c.execute('SELECT * FROM passwords WHERE vault_id = ?', (vault_id,))
        passwords = c.fetchall()
        conn.close()
        
        password_list = []
        for password in passwords:
            password_list.append({
                'id': password['id'],
                'title': password['title'],
                'username': password['username'],
                'password': password['password'],  # In production, decrypt this
                'url': password['url'],
                'notes': password['notes'],
                'created_at': password['created_at'],
                'updated_at': password['updated_at']
            })
        
        return jsonify(password_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add password to vault
@app.route('/api/vaults/<vault_id>/passwords', methods=['POST'])
@require_auth
def add_password(vault_id):
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        # Check password limit based on subscription
        if not can_add_password(user_id):
            return jsonify({
                "error": "Password limit reached for your plan",
                "upgrade_required": True,
                "current_plan": "free",
                "suggested_plan": "pro"
            }), 403
        
        data = request.get_json()
        title = data.get('title')
        username = data.get('username')
        password = data.get('password')
        url = data.get('url', '')
        notes = data.get('notes', '')
        
        if not title or not username or not password:
            return jsonify({"error": "Title, username, and password are required"}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Verify vault belongs to user
        c.execute('SELECT id FROM vaults WHERE id = ? AND user_id = ?', (vault_id, user_id))
        if not c.fetchone():
            conn.close()
            return jsonify({"error": "Vault not found"}), 404
        
        # Create password
        password_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO passwords (id, vault_id, title, username, password, url, notes, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ''', (password_id, vault_id, title, username, password, url, notes))
        
        # Update vault password count
        c.execute('UPDATE vaults SET password_count = password_count + 1 WHERE id = ?', (vault_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Password added successfully",
            "password_id": password_id
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update password
@app.route('/api/passwords/<password_id>', methods=['PUT'])
@require_auth
def update_password(password_id):
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        title = data.get('title')
        username = data.get('username')
        password = data.get('password')
        url = data.get('url', '')
        notes = data.get('notes', '')
        
        if not title or not username or not password:
            return jsonify({"error": "Title, username, and password are required"}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Verify password belongs to user's vault
        c.execute('''
            SELECT p.id FROM passwords p 
            JOIN vaults v ON p.vault_id = v.id 
            WHERE p.id = ? AND v.user_id = ?
        ''', (password_id, user_id))
        
        if not c.fetchone():
            conn.close()
            return jsonify({"error": "Password not found"}), 404
        
        # Update password
        c.execute('''
            UPDATE passwords 
            SET title = ?, username = ?, password = ?, url = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        ''', (title, username, password, url, notes, password_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Password updated successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete password
@app.route('/api/passwords/<password_id>', methods=['DELETE'])
@require_auth
def delete_password(password_id):
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        # Get vault_id before deleting
        c.execute('SELECT vault_id FROM passwords WHERE id = ?', (password_id,))
        password = c.fetchone()
        if not password:
            conn.close()
            return jsonify({"error": "Password not found"}), 404
        
        vault_id = password['vault_id']
        
        # Verify password belongs to user's vault
        c.execute('''
            SELECT p.id FROM passwords p 
            JOIN vaults v ON p.vault_id = v.id 
            WHERE p.id = ? AND v.user_id = ?
        ''', (password_id, user_id))
        
        if not c.fetchone():
            conn.close()
            return jsonify({"error": "Password not found"}), 404
        
        # Delete password
        c.execute('DELETE FROM passwords WHERE id = ?', (password_id,))
        
        # Update vault password count
        c.execute('UPDATE vaults SET password_count = password_count - 1 WHERE id = ?', (vault_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Password deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/vaults/<int:vault_id>', methods=['GET'])
@require_auth
def get_vault(vault_id):
    """Get a specific vault by ID"""
    try:
        user_id = request.headers.get('X-User-ID')
        db = get_db()
        
        vault = db.execute(
            'SELECT * FROM vaults WHERE id = ? AND user_id = ?',
            (vault_id, user_id)
        ).fetchone()
        
        if not vault:
            return jsonify({"error": "Vault not found"}), 404
            
        return jsonify(dict(vault))
        
    except Exception as e:
        return jsonify({"error": f"Error retrieving vault: {str(e)}"}), 500

@app.route('/api/vaults/<int:vault_id>', methods=['PUT'])
@require_auth
def update_vault(vault_id):
    """Update a vault"""
    try:
        user_id = request.headers.get('X-User-ID')
        data = request.get_json()
        
        if not data or 'name' not in data:
            return jsonify({"error": "Vault name is required"}), 400
            
        db = get_db()
        
        # Check if vault exists and belongs to user
        vault = db.execute(
            'SELECT * FROM vaults WHERE id = ? AND user_id = ?',
            (vault_id, user_id)
        ).fetchone()
        
        if not vault:
            return jsonify({"error": "Vault not found"}), 404
            
        # Update vault
        db.execute(
            '''UPDATE vaults 
               SET name = ?, description = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ? AND user_id = ?''',
            (data['name'], data.get('description', ''), data.get('icon', '🔐'), vault_id, user_id)
        )
        
        db.commit()
        
        return jsonify({"message": "Vault updated successfully"})
        
    except Exception as e:
        return jsonify({"error": f"Error updating vault: {str(e)}"}), 500

@app.route('/api/vaults/<int:vault_id>', methods=['DELETE'])
@require_auth
def delete_vault(vault_id):
    """Delete a vault and all its passwords"""
    try:
        user_id = request.headers.get('X-User-ID')
        db = get_db()
        
        # Check if vault exists and belongs to user
        vault = db.execute(
            'SELECT * FROM vaults WHERE id = ? AND user_id = ?',
            (vault_id, user_id)
        ).fetchone()
        
        if not vault:
            return jsonify({"error": "Vault not found"}), 404
            
        # Delete all passwords in the vault first
        db.execute('DELETE FROM passwords WHERE vault_id = ?', (vault_id,))
        
        # Delete the vault
        db.execute('DELETE FROM vaults WHERE id = ? AND user_id = ?', (vault_id, user_id))
        
        db.commit()
        
        return jsonify({"message": "Vault deleted successfully"})
        
    except Exception as e:
        return jsonify({"error": f"Error deleting vault: {str(e)}"}), 500

# Search passwords
@app.route('/api/passwords/search', methods=['GET'])
@require_auth
def search_passwords():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        query = request.args.get('q', '')
        if not query:
            return jsonify({"error": "Search query required"}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Search passwords in user's vaults
        c.execute('''
            SELECT p.*, v.name as vault_name 
            FROM passwords p 
            JOIN vaults v ON p.vault_id = v.id 
            WHERE v.user_id = ? AND (
                p.title LIKE ? OR 
                p.username LIKE ? OR 
                p.url LIKE ? OR 
                p.notes LIKE ?
            )
            ORDER BY p.updated_at DESC
        ''', (user_id, f'%{query}%', f'%{query}%', f'%{query}%', f'%{query}%'))
        
        passwords = c.fetchall()
        conn.close()
        
        password_list = []
        for password in passwords:
            password_list.append({
                'id': password['id'],
                'title': password['title'],
                'username': password['username'],
                'password': password['password'],
                'url': password['url'],
                'notes': password['notes'],
                'vault_name': password['vault_name'],
                'created_at': password['created_at'],
                'updated_at': password['updated_at']
            })
        
        return jsonify(password_list), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update vault
@app.route('/api/vaults/<vault_id>', methods=['PUT'])
def update_vault(vault_id):
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        name = data.get('name')
        description = data.get('description', '')
        icon = data.get('icon', '🔐')
        
        if not name:
            return jsonify({"error": "Vault name required"}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Verify vault belongs to user
        c.execute('SELECT id FROM vaults WHERE id = ? AND user_id = ?', (vault_id, user_id))
        if not c.fetchone():
            conn.close()
            return jsonify({"error": "Vault not found"}), 404
        
        # Update vault
        c.execute('''
            UPDATE vaults 
            SET name = ?, description = ?, icon = ? 
            WHERE id = ?
        ''', (name, description, icon, vault_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Vault updated successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete vault
@app.route('/api/vaults/<vault_id>', methods=['DELETE'])
def delete_vault(vault_id):
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        # Verify vault belongs to user
        c.execute('SELECT id FROM vaults WHERE id = ? AND user_id = ?', (vault_id, user_id))
        if not c.fetchone():
            conn.close()
            return jsonify({"error": "Vault not found"}), 404
        
        # Delete all passwords in vault
        c.execute('DELETE FROM passwords WHERE vault_id = ?', (vault_id,))
        
        # Delete vault
        c.execute('DELETE FROM vaults WHERE id = ?', (vault_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Vault deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve static files for frontend (catch-all for remaining static files)
@app.route('/<path:path>')
def serve_frontend(path):
    # Skip API routes
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found"}), 404
    
    # Skip specific routes we've already defined
    if path in ['', 'login', 'dashboard', 'maze', 'security', 'vaults', 'index.html']:
        return jsonify({"error": "Route not found"}), 404
    
    # Serve static files from public directory
    try:
        # Check if file exists in public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.getcwd(), 'public'),
            os.path.join(os.path.dirname(__file__), '..', 'public')
        ]
        
        for base_path in possible_paths:
            file_path = os.path.join(base_path, path)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                return send_from_directory(base_path, path)
        
        # If file not found, return 404
        return jsonify({"error": f"File not found: {path}"}), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving file: {str(e)}"}), 500

# Test subscription system
@app.route('/api/test/subscription', methods=['GET'])
def test_subscription():
    try:
        conn = get_db()
        c = conn.cursor()
        
        # Get user count
        c.execute('SELECT COUNT(*) as count FROM users')
        user_count = c.fetchone()['count']
        
        # Get subscription plans
        c.execute('SELECT subscription_plan, COUNT(*) as count FROM users GROUP BY subscription_plan')
        plan_distribution = c.fetchall()
        
        # Get vault count
        c.execute('SELECT COUNT(*) as count FROM vaults')
        vault_count = c.fetchone()['count']
        
        # Get password count
        c.execute('SELECT COUNT(*) as count FROM passwords')
        password_count = c.fetchone()['count']
        
        conn.close()
        
        return jsonify({
            "status": "Subscription system working!",
            "total_users": user_count,
            "plan_distribution": [{"plan": p['subscription_plan'], "count": p['count']} for p in plan_distribution],
            "total_vaults": vault_count,
            "total_passwords": password_count,
            "available_plans": list(SUBSCRIPTION_PLANS.keys()),
            "free_plan_features": SUBSCRIPTION_PLANS['free']['features']
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Manual database migration route
@app.route('/api/admin/migrate', methods=['POST'])
def admin_migrate():
    try:
        migrate_database()
        return jsonify({"message": "Database migration completed successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Migration failed: {str(e)}"}), 500

# UPI Payment Integration - Easy Setup for India
UPI_PAYMENT_METHODS = {
    'phonepe': {
        'name': 'PhonePe',
        'icon': '📱',
        'description': 'Pay with PhonePe UPI',
        'setup_required': False,
        'instant_settlement': True
    },
    'googlepay': {
        'name': 'Google Pay',
        'icon': '📱',
        'description': 'Pay with Google Pay UPI',
        'setup_required': False,
        'instant_settlement': True
    },
    'paytm': {
        'name': 'Paytm',
        'icon': '📱',
        'description': 'Pay with Paytm UPI',
        'setup_required': False,
        'instant_settlement': True
    },
    'bhim': {
        'name': 'BHIM UPI',
        'icon': '🏦',
        'description': 'Direct UPI transfer',
        'setup_required': False,
        'instant_settlement': True
    },
    'amazonpay': {
        'name': 'Amazon Pay',
        'icon': '📦',
        'description': 'Pay with Amazon Pay UPI',
        'setup_required': False,
        'instant_settlement': True
    }
}

# Create UPI payment order
@app.route('/api/payments/upi/create-order', methods=['POST'])
@require_auth
def create_upi_order():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        plan_name = data.get('plan')
        payment_method = data.get('payment_method')  # phonepe, googlepay, paytm, etc.
        
        if plan_name not in SUBSCRIPTION_PLANS:
            return jsonify({"error": "Invalid plan"}), 400
        
        if payment_method not in UPI_PAYMENT_METHODS:
            return jsonify({"error": "Invalid payment method"}), 400
        
        plan = SUBSCRIPTION_PLANS[plan_name]
        
        # Generate unique order ID
        order_id = f"order_{str(uuid.uuid4()).replace('-', '')}"
        
        # Create payment order
        conn = get_db()
        c = conn.cursor()
        
        # Insert payment order
        c.execute('''
            INSERT INTO payments (id, user_id, amount, currency, payment_provider, payment_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (order_id, user_id, plan['price'], plan['currency'], payment_method, order_id, 'pending'))
        
        conn.commit()
        conn.close()
        
        # Generate UPI payment link
        upi_payment_link = generate_upi_payment_link(order_id, plan['price'], plan['name'])
        
        return jsonify({
            "order_id": order_id,
            "amount": plan['price'],
            "currency": plan['currency'],
            "plan": plan_name,
            "payment_method": payment_method,
            "upi_payment_link": upi_payment_link,
            "qr_code_data": f"upi://pay?pa=your-upi-id@bank&pn=MazePasswordManager&tn={plan['name']}Subscription&am={plan['price']}&cu=INR&ref={order_id}",
            "instructions": f"Pay ₹{plan['price']} using {UPI_PAYMENT_METHODS[payment_method]['name']} to complete your subscription"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Generate UPI payment link
def generate_upi_payment_link(order_id, amount, plan_name):
    # Replace 'your-upi-id@bank' with your actual UPI ID
    # Example: monishreddy@sbicard, monishreddy@ybl, etc.
    upi_id = "7013984388@ybl"  # Your actual UPI ID
    
    upi_link = f"upi://pay?pa={upi_id}&pn=MazePasswordManager&tn={plan_name}Subscription&am={amount}&cu=INR&ref={order_id}"
    
    return upi_link

# Verify UPI payment (manual verification)
@app.route('/api/payments/upi/verify', methods=['POST'])
@require_auth
def verify_upi_payment():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        order_id = data.get('order_id')
        upi_transaction_id = data.get('upi_transaction_id')
        payment_screenshot = data.get('payment_screenshot')  # Base64 encoded image
        
        if not order_id or not upi_transaction_id:
            return jsonify({"error": "Order ID and UPI transaction ID required"}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Get payment order
        c.execute('SELECT * FROM payments WHERE id = ? AND user_id = ?', (order_id, user_id))
        payment = c.fetchone()
        
        if not payment:
            conn.close()
            return jsonify({"error": "Payment order not found"}), 404
        
        if payment['status'] == 'completed':
            conn.close()
            return jsonify({"error": "Payment already completed"}), 400
        
        # Update payment with UPI transaction details
        c.execute('''
            UPDATE payments 
            SET status = 'pending_verification', 
                payment_method = 'upi',
                upi_transaction_id = ?,
                payment_screenshot = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (upi_transaction_id, payment_screenshot, order_id))
        
        # Create admin notification for manual verification
        notification_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO admin_notifications (id, type, user_id, payment_id, message, status)
            VALUES (?, 'payment_verification', ?, ?, ?, 'pending')
        ''', (notification_id, user_id, order_id, f"UPI payment verification required for order {order_id}"))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Payment verification submitted successfully",
            "status": "pending_verification",
            "instructions": "Your payment will be verified within 24 hours. You'll receive an email confirmation once verified."
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get available UPI payment methods
@app.route('/api/payments/upi/methods', methods=['GET'])
def get_upi_payment_methods():
    try:
        return jsonify(UPI_PAYMENT_METHODS), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin routes for payment verification and management
@app.route('/api/admin/verify-payment/<int:payment_id>', methods=['POST'])
def admin_verify_payment(payment_id):
    try:
        data = request.get_json()
        admin_key = data.get('admin_key')
        
        # Simple admin key verification (in production, use proper admin authentication)
        if admin_key != 'maze_admin_2024':
            return jsonify({"error": "Invalid admin key"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        # Get payment details
        c.execute('SELECT * FROM payments WHERE id = ?', (payment_id,))
        payment = c.fetchone()
        
        if not payment:
            return jsonify({"error": "Payment not found"}), 404
        
        # Update payment status
        c.execute('UPDATE payments SET status = "verified", verified_at = CURRENT_TIMESTAMP WHERE id = ?', (payment_id,))
        
        # Update user subscription
        c.execute('''
            UPDATE users 
            SET subscription_plan = ?, subscription_status = "active", subscription_start_date = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (payment['plan'], payment['user_id']))
        
        # Add admin notification
        c.execute('''
            INSERT INTO admin_notifications (user_id, payment_id, action, details, created_at)
            VALUES (?, ?, "payment_verified", "Payment verified and subscription activated", CURRENT_TIMESTAMP)
        ''', (payment['user_id'], payment_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Payment verified successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/reject-payment/<int:payment_id>', methods=['POST'])
def admin_reject_payment(payment_id):
    try:
        data = request.get_json()
        admin_key = data.get('admin_key')
        reason = data.get('reason', 'No reason provided')
        
        # Simple admin key verification
        if admin_key != 'maze_admin_2024':
            return jsonify({"error": "Invalid admin key"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        # Get payment details
        c.execute('SELECT * FROM payments WHERE id = ?', (payment_id,))
        payment = c.fetchone()
        
        if not payment:
            return jsonify({"error": "Payment not found"}), 404
        
        # Update payment status
        c.execute('UPDATE payments SET status = "rejected", rejected_at = CURRENT_TIMESTAMP WHERE id = ?', (payment_id,))
        
        # Add admin notification
        c.execute('''
            INSERT INTO admin_notifications (user_id, payment_id, action, details, created_at)
            VALUES (?, ?, "payment_rejected", ?, CURRENT_TIMESTAMP)
        ''', (payment['user_id'], payment_id, f"Payment rejected: {reason}"))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Payment rejected successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/pending-payments', methods=['GET'])
def admin_pending_payments():
    try:
        conn = get_db()
        c = conn.cursor()
        
        c.execute('''
            SELECT p.*, u.email, u.subscription_plan
            FROM payments p
            JOIN users u ON p.user_id = u.id
            WHERE p.status = "pending"
            ORDER BY p.created_at DESC
        ''')
        
        payments = c.fetchall()
        conn.close()
        
        return jsonify([dict(payment) for payment in payments]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/statistics', methods=['GET'])
def admin_statistics():
    try:
        conn = get_db()
        c = conn.cursor()
        
        # Get total users
        c.execute('SELECT COUNT(*) as total_users FROM users')
        total_users = c.fetchone()['total_users']
        
        # Get plan distribution
        c.execute('''
            SELECT subscription_plan, COUNT(*) as count
            FROM users
            GROUP BY subscription_plan
        ''')
        plan_distribution = {row['subscription_plan'] or 'free': row['count'] for row in c.fetchall()}
        
        # Get total revenue
        c.execute('''
            SELECT SUM(amount) as total_revenue
            FROM payments
            WHERE status = "verified"
        ''')
        total_revenue = c.fetchone()['total_revenue'] or 0
        
        # Get total vaults
        c.execute('SELECT COUNT(*) as total_vaults FROM vaults')
        total_vaults = c.fetchone()['total_vaults']
        
        # Get total passwords
        c.execute('SELECT COUNT(*) as total_passwords FROM passwords')
        total_passwords = c.fetchone()['total_passwords']
        
        conn.close()
        
        return jsonify({
            "total_users": total_users,
            "total_revenue": total_revenue,
            "total_vaults": total_vaults,
            "total_passwords": total_passwords,
            "free_users": plan_distribution.get('free', 0),
            "pro_users": plan_distribution.get('pro', 0),
            "premium_users": plan_distribution.get('premium', 0),
            "enterprise_users": plan_distribution.get('enterprise', 0)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
def admin_get_users():
    try:
        conn = get_db()
        c = conn.cursor()
        
        c.execute('''
            SELECT id, email, subscription_plan, subscription_status, created_at
            FROM users
            ORDER BY created_at DESC
        ''')
        
        users = c.fetchall()
        conn.close()
        
        return jsonify([dict(user) for user in users]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/recent-activity', methods=['GET'])
def admin_recent_activity():
    try:
        conn = get_db()
        c = conn.cursor()
        
        c.execute('''
            SELECT an.*, u.email
            FROM admin_notifications an
            JOIN users u ON an.user_id = u.id
            ORDER BY an.created_at DESC
            LIMIT 20
        ''')
        
        activities = c.fetchall()
        conn.close()
        
        return jsonify([dict(activity) for activity in activities]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin route to get user details
@app.route('/api/admin/user/<user_id>', methods=['GET'])
def get_user_details(user_id):
    try:
        conn = get_db()
        c = conn.cursor()
        
        # Get user details
        c.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = c.fetchone()
        
        if not user:
            conn.close()
            return jsonify({"error": "User not found"}), 404
        
        # Get user's vaults
        c.execute('SELECT * FROM vaults WHERE user_id = ?', (user_id,))
        vaults = c.fetchall()
        
        # Get user's passwords count
        c.execute('''
            SELECT COUNT(*) as count FROM passwords p 
            JOIN vaults v ON p.vault_id = v.id 
            WHERE v.user_id = ?
        ''', (user_id,))
        password_count = c.fetchone()['count']
        
        # Get user's payments
        c.execute('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
        payments = c.fetchall()
        
        conn.close()
        
        return jsonify({
            'user': {
                'id': user['id'],
                'email': user['email'],
                'subscription_plan': user.get('subscription_plan', 'free'),
                'subscription_status': user.get('subscription_status', 'inactive'),
                'created_at': user['created_at'],
                'last_login': user.get('last_login')
            },
            'vaults': [{
                'id': v['id'],
                'name': v['name'],
                'description': v['description'],
                'created_at': v['created_at']
            } for v in vaults],
            'password_count': password_count,
            'payments': [{
                'id': p['id'],
                'amount': p['amount'],
                'status': p['status'],
                'payment_provider': p['payment_provider'],
                'created_at': p['created_at']
            } for p in payments]
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin route to serve admin dashboard
@app.route('/admin')
def admin_dashboard():
    try:
        # Try multiple possible paths for the public directory
        possible_paths = [
            'public',
            '../public', 
            './public',
            os.path.join(os.getcwd(), 'public'),
            os.path.join(os.path.dirname(__file__), '..', 'public')
        ]
        
        for path in possible_paths:
            if os.path.exists(os.path.join(path, 'admin-dashboard.html')):
                return send_from_directory(path, 'admin-dashboard.html')
        
        return jsonify({"error": "admin-dashboard.html not found"}), 404
        
    except Exception as e:
        return jsonify({"error": f"Error serving admin dashboard: {str(e)}"}), 500

# Get user subscription info
@app.route('/api/user/subscription', methods=['GET'])
@require_auth
def get_user_subscription():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        c.execute('''
            SELECT subscription_plan, subscription_status, subscription_start_date, subscription_end_date,
                   payment_provider, payment_customer_id
            FROM users WHERE id = ?
        ''', (user_id,))
        
        user = c.fetchone()
        conn.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        plan_info = SUBSCRIPTION_PLANS.get(user['subscription_plan'], SUBSCRIPTION_PLANS['free'])
        
        return jsonify({
            "plan": user['subscription_plan'],
            "status": user['subscription_status'],
            "plan_name": plan_info['name'],
            "price": plan_info['price'],
            "currency": plan_info['currency'],
            "features": plan_info['features'],
            "start_date": user['subscription_start_date'],
            "end_date": user['subscription_end_date'],
            "payment_provider": user['payment_provider']
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get available plans
@app.route('/api/plans', methods=['GET'])
def get_plans():
    try:
        return jsonify(SUBSCRIPTION_PLANS), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create Stripe payment intent
@app.route('/api/payments/stripe/create-intent', methods=['POST'])
@require_auth
def create_stripe_payment_intent():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        plan_name = data.get('plan')
        
        if plan_name not in SUBSCRIPTION_PLANS:
            return jsonify({"error": "Invalid plan"}), 400
        
        plan = SUBSCRIPTION_PLANS[plan_name]
        
        # In production, you would use Stripe's Python library
        # For now, we'll simulate the payment intent creation
        payment_intent = {
            "id": f"pi_{str(uuid.uuid4()).replace('-', '')}",
            "amount": plan['price'] * 100,  # Stripe uses cents
            "currency": plan['currency'].lower(),
            "client_secret": f"pi_{str(uuid.uuid4()).replace('-', '')}_secret_{str(uuid.uuid4()).replace('-', '')}",
            "plan": plan_name
        }
        
        return jsonify(payment_intent), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create Razorpay order
@app.route('/api/payments/razorpay/create-order', methods=['POST'])
@require_auth
def create_razorpay_order():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        plan_name = data.get('plan')
        
        if plan_name not in SUBSCRIPTION_PLANS:
            return jsonify({"error": "Invalid plan"}), 400
        
        plan = SUBSCRIPTION_PLANS[plan_name]
        
        # In production, you would use Razorpay's Python library
        # For now, we'll simulate the order creation
        order = {
            "id": f"order_{str(uuid.uuid4()).replace('-', '')}",
            "amount": plan['price'] * 100,  # Razorpay uses paise
            "currency": plan['currency'],
            "plan": plan_name,
            "receipt": f"receipt_{str(uuid.uuid4()).replace('-', '')}"
        }
        
        return jsonify(order), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Confirm payment and upgrade subscription
@app.route('/api/payments/confirm', methods=['POST'])
@require_auth
def confirm_payment():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        data = request.get_json()
        plan_name = data.get('plan')
        payment_provider = data.get('payment_provider')  # 'stripe' or 'razorpay'
        payment_id = data.get('payment_id')
        
        if plan_name not in SUBSCRIPTION_PLANS:
            return jsonify({"error": "Invalid plan"}), 400
        
        plan = SUBSCRIPTION_PLANS[plan_name]
        
        conn = get_db()
        c = conn.cursor()
        
        # Update user subscription
        c.execute('''
            UPDATE users 
            SET subscription_plan = ?, subscription_status = 'active', 
                subscription_start_date = CURRENT_TIMESTAMP,
                payment_provider = ?, payment_customer_id = ?
            WHERE id = ?
        ''', (plan_name, payment_provider, payment_id, user_id))
        
        # Create subscription record
        subscription_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO subscriptions (id, user_id, plan_name, status, amount, currency, payment_provider, payment_id)
            VALUES (?, ?, ?, 'active', ?, ?, ?, ?)
        ''', (subscription_id, user_id, plan_name, plan['price'], plan['currency'], payment_provider, payment_id))
        
        # Create payment record
        payment_record_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO payments (id, user_id, subscription_id, amount, currency, payment_provider, payment_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')
        ''', (payment_record_id, user_id, subscription_id, plan['price'], plan['currency'], payment_provider, payment_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Subscription upgraded successfully",
            "plan": plan_name,
            "plan_name": plan['name'],
            "features": plan['features']
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Cancel subscription
@app.route('/api/user/subscription/cancel', methods=['POST'])
@require_auth
def cancel_subscription():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        # Update user subscription to free
        c.execute('''
            UPDATE users 
            SET subscription_plan = 'free', subscription_status = 'cancelled'
            WHERE id = ?
        ''', (user_id,))
        
        # Update subscription record
        c.execute('''
            UPDATE subscriptions 
            SET status = 'cancelled', end_date = CURRENT_TIMESTAMP
            WHERE user_id = ? AND status = 'active'
        ''', (user_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Subscription cancelled successfully",
            "plan": "free",
            "plan_name": SUBSCRIPTION_PLANS['free']['name']
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Initialize database and run migrations
    init_db()
    migrate_database()
    
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
