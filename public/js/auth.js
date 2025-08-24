// Authentication Module
const Auth = {
    API_BASE: 'http://localhost:3002/api',
    token: localStorage.getItem('token'),
    user: null,

    // Initialize authentication
    init() {
        if (this.token) {
            this.validateToken();
        } else {
            this.showLogin();
        }
    },

    // Validate existing token
    async validateToken() {
        try {
            const response = await fetch(`${this.API_BASE}/security/status`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Token is valid, show dashboard
                this.user = {
                    id: 'user-id',
                    email: 'user@example.com',
                    username: 'User'
                };
                this.showDashboard();
            } else {
                // Token is invalid
                this.logout();
            }
        } catch (error) {
            console.error('Token validation error:', error);
            this.logout();
        }
    },

    // Login user
    async login(email, password, masterKey) {
        try {
            // Basic validation
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Check for demo credentials (for testing purposes)
            if (email === 'demo@agies.com' && password === 'demo123') {
                // Demo user - generate demo token
                this.token = 'demo_token_' + Date.now();
                this.user = {
                    id: 'demo_user',
                    email: 'demo@agies.com',
                    username: 'Demo User',
                    plan: 'premium'
                };
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                this.showDashboard();
                return { success: true };
            }

            // For real implementation, this would call your backend
            // For now, we'll simulate a failed login for any other credentials
            throw new Error('Invalid credentials. Use demo@agies.com / demo123 for testing.');

            // Real implementation would be:
            /*
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, masterKey })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            this.token = data.token;
            this.user = data.user;
            localStorage.setItem('token', this.token);
            
            this.showDashboard();
            return { success: true };
            */
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    // Register user
    async register(email, username, password, masterKey) {
        try {
            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, password, masterKey })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Registration failed');
            }

            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },

    // Logout user
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        this.showLogin();
    },

    // Show login page
    showLogin() {
        App.showComponent('login');
        document.getElementById('logout-btn').classList.add('hidden');
        document.getElementById('nav-links').innerHTML = '';
    },

    // Show dashboard
    showDashboard() {
        App.showComponent('dashboard');
        this.updateNavigation();
        this.updateDashboardStats();
    },

    // Update navigation based on authentication
    updateNavigation() {
        // Navigation is now handled by the dashboard header
        this.bindDashboardEvents();
    },

    // Update dashboard statistics
    updateDashboardStats() {
        const userName = document.getElementById('user-name');
        if (userName && this.user) {
            userName.textContent = this.user.username || 'User';
        }
    },

    // Bind dashboard events
    bindDashboardEvents() {
        // Add password button
        const addPasswordBtn = document.getElementById('add-password-btn');
        if (addPasswordBtn) {
            addPasswordBtn.addEventListener('click', () => {
                this.showAddPasswordModal();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // View all passwords button
        const viewAllPasswordsBtn = document.getElementById('view-all-passwords');
        if (viewAllPasswordsBtn) {
            viewAllPasswordsBtn.addEventListener('click', () => {
                App.showComponent('vault');
            });
        }

        // Back to dashboard buttons
        document.querySelectorAll('#back-to-dashboard').forEach(btn => {
            btn.addEventListener('click', () => {
                App.showComponent('dashboard');
            });
        });

        // Generate API key button
        const generateApiKeyBtn = document.getElementById('generate-api-key-btn');
        if (generateApiKeyBtn) {
            generateApiKeyBtn.addEventListener('click', () => {
                this.generateApiKey();
            });
        }
    },

    // Show add password modal
    showAddPasswordModal() {
        const modal = document.getElementById('add-password-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.bindAddPasswordEvents();
        }
    },

    // Hide add password modal
    hideAddPasswordModal() {
        const modal = document.getElementById('add-password-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    // Bind add password form events
    bindAddPasswordEvents() {
        const form = document.getElementById('add-password-form');
        const closeBtn = document.getElementById('close-add-modal');
        const cancelBtn = document.getElementById('cancel-add-password');
        const generateBtn = document.getElementById('generate-password-btn');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddPassword();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideAddPasswordModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideAddPasswordModal();
            });
        }

        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generatePassword();
            });
        }
    },

    // Handle add password
    async handleAddPassword() {
        const website = document.getElementById('password-website').value;
        const username = document.getElementById('password-username').value;
        const password = document.getElementById('password-value').value;
        const notes = document.getElementById('password-notes').value;

        if (!website || !username || !password) {
            this.showError('Please fill in all required fields');
            return;
        }

        // For now, just show success (will integrate with API later)
        this.showSuccess('Password added successfully!');
        this.hideAddPasswordModal();
        
        // Clear form
        document.getElementById('add-password-form').reset();
    },

    // Generate secure password
    generatePassword() {
        const length = 16;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        document.getElementById('password-value').value = password;
        this.showSuccess('Secure password generated!');
    },

    // Generate API key for Chrome extension
    async generateApiKey() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                this.showError('Please login first');
                return;
            }

            const response = await fetch(`${this.API_BASE}/security/api-key`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    keyName: 'Chrome Extension'
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Show the API key in a modal
                this.showApiKeyModal(data.apiKey);
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate API key');
            }
        } catch (error) {
            this.showError('Failed to generate API key: ' + error.message);
        }
    },

    // Show API key modal
    showApiKeyModal(apiKey) {
        // Remove existing modal
        const existing = document.getElementById('api-key-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'api-key-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-8 w-full max-w-md mx-4">
                <div class="text-center mb-6">
                    <h3 class="text-xl font-semibold text-white mb-2">🔑 Your API Key</h3>
                    <p class="text-gray-300">Use this key to connect your Chrome extension</p>
                </div>
                
                <div class="bg-gray-700 rounded-lg p-4 mb-6">
                    <p class="text-sm text-gray-400 mb-2">Copy this API key:</p>
                    <div class="flex items-center space-x-2">
                        <input type="text" value="${apiKey}" readonly 
                               class="flex-1 bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 font-mono text-sm">
                        <button id="copy-api-key-btn" 
                                class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors">
                            Copy
                        </button>
                    </div>
                </div>
                
                <div class="text-center">
                    <button id="close-api-key-modal-btn" 
                            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const copyBtn = modal.querySelector('#copy-api-key-btn');
        const closeBtn = modal.querySelector('#close-api-key-modal-btn');
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(apiKey).then(() => {
                    this.showSuccess('API key copied to clipboard!');
                }).catch(() => {
                    this.showError('Failed to copy API key');
                });
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
        }
    },

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    },

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    },

    // Show notification
    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
};

// Add logout event listener
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        Auth.logout();
    });
});
