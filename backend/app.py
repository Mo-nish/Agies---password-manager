from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import sqlite3
import os
import json
import uuid
from datetime import datetime
import bcrypt

app = Flask(__name__, static_folder='../public', static_url_path='')
CORS(app)

# Database setup
DATABASE = 'agies.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    # Create users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
            FOREIGN KEY (vault_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database
init_db()

@app.route('/')
def home():
    return send_from_directory('../public', 'maze-password-manager.html')

@app.route('/login')
def login():
    return send_from_directory('../public', 'login.html')

@app.route('/maze')
def maze():
    return send_from_directory('../public', 'maze-password-manager.html')

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

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
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Get user
        c.execute('SELECT id, password_hash FROM users WHERE email = ?', (email,))
        user = c.fetchone()
        conn.close()
        
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Check password
        if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({
                "message": "Login successful",
                "user_id": user['id'],
                "token": str(uuid.uuid4())  # Simple token for demo
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get user profile
@app.route('/api/auth/profile', methods=['GET'])
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
def get_vaults():
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        c.execute('''
            SELECT v.*, COUNT(p.id) as password_count 
            FROM vaults v 
            LEFT JOIN passwords p ON v.id = p.vault_id 
            WHERE v.user_id = ? 
            GROUP BY v.id
        ''', (user_id,))
        
        vaults = []
        for row in c.fetchall():
            vault = dict(row)
            vault['password_count'] = vault['password_count'] or 0
            vaults.append(vault)
        
        conn.close()
        
        return jsonify(vaults), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create vault
@app.route('/api/vaults', methods=['POST'])
def create_vault():
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
        
        vault_id = str(uuid.uuid4())
        conn = get_db()
        c = conn.cursor()
        
        c.execute('''
            INSERT INTO vaults (id, user_id, name, description, icon) 
            VALUES (?, ?, ?, ?, ?)
        ''', (vault_id, user_id, name, description, icon))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "id": vault_id,
            "name": name,
            "description": description,
            "icon": icon,
            "password_count": 0,
            "created_at": datetime.now().isoformat()
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get vault passwords
@app.route('/api/vaults/<vault_id>/passwords', methods=['GET'])
def get_passwords(vault_id):
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
        
        # Get passwords
        c.execute('SELECT * FROM passwords WHERE vault_id = ? ORDER BY created_at DESC', (vault_id,))
        passwords = [dict(row) for row in c.fetchall()]
        
        conn.close()
        
        return jsonify(passwords), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add password
@app.route('/api/vaults/<vault_id>/passwords', methods=['POST'])
def add_password(vault_id):
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
            return jsonify({"error": "Title, username, and password required"}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Verify vault belongs to user
        c.execute('SELECT id FROM vaults WHERE id = ? AND user_id = ?', (vault_id, user_id))
        if not c.fetchone():
            conn.close()
            return jsonify({"error": "Vault not found"}), 404
        
        # Add password
        password_id = str(uuid.uuid4())
        c.execute('''
            INSERT INTO passwords (id, vault_id, title, username, password, url, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (password_id, vault_id, title, username, password, url, notes))
        
        # Update vault password count
        c.execute('UPDATE vaults SET password_count = password_count + 1 WHERE id = ?', (vault_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "id": password_id,
            "title": title,
            "username": username,
            "url": url,
            "notes": notes,
            "created_at": datetime.now().isoformat()
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update password
@app.route('/api/passwords/<password_id>', methods=['PUT'])
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
            return jsonify({"error": "Title, username, and password required"}), 400
        
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
def delete_password(password_id):
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        conn = get_db()
        c = conn.cursor()
        
        # Get vault ID for this password
        c.execute('''
            SELECT p.vault_id FROM passwords p 
            JOIN vaults v ON p.vault_id = v.id 
            WHERE p.id = ? AND v.user_id = ?
        ''', (password_id, user_id))
        
        result = c.fetchone()
        if not result:
            conn.close()
            return jsonify({"error": "Password not found"}), 404
        
        vault_id = result['vault_id']
        
        # Delete password
        c.execute('DELETE FROM passwords WHERE id = ?', (password_id,))
        
        # Update vault password count
        c.execute('UPDATE vaults SET password_count = password_count - 1 WHERE id = ?', (vault_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Password deleted successfully"}), 200
        
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

# Serve static files for frontend
@app.route('/<path:path>')
def serve_frontend(path):
    if path == '' or path == 'index.html':
        return send_from_directory('../public', 'index-simple.html')
    return send_from_directory('../public', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
