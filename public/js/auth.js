// Authentication Module
const Auth = {
    API_BASE: 'http://localhost:3002/api',
    token: localStorage.getItem('token'),
    user: null,
    masterKey: localStorage.getItem('masterKey'),
    isAuthenticated: false,

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

            // Real authentication with backend API
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    masterKey: masterKey || null 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();
            
            // Store authentication data
            this.token = data.token;
            this.user = data.user;
            this.masterKey = masterKey;
            
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            if (masterKey) {
                localStorage.setItem('masterKey', masterKey);
            }
            
            // Update authentication status
            this.isAuthenticated = true;
            
            // Show success message
            this.showSuccess('Login successful! Welcome back.');
            
            // Redirect to dashboard
            this.showDashboard();
            
            return { success: true, user: this.user };
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Show user-friendly error message
            let errorMessage = 'Login failed. Please check your credentials.';
            
            if (error.message.includes('Invalid credentials')) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (error.message.includes('User not found')) {
                errorMessage = 'Account not found. Please check your email or create a new account.';
            } else if (error.message.includes('Account locked')) {
                errorMessage = 'Account temporarily locked due to multiple failed attempts. Please try again later.';
            } else if (error.message.includes('Email not verified')) {
                errorMessage = 'Please verify your email address before logging in.';
            }
            
            this.showError(errorMessage);
            return { success: false, error: errorMessage };
        }
    },

    // Register user
    async register(email, username, password, masterKey) {
        try {
            // Basic validation
            if (!email || !username || !password) {
                throw new Error('All fields are required');
            }

            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            if (masterKey && masterKey.length < 12) {
                throw new Error('Master key must be at least 12 characters long');
            }

            // Real registration with backend API
            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email, 
                    username, 
                    password, 
                    masterKey: masterKey || null 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            
            // Show success message
            this.showSuccess('Registration successful! Please check your email to verify your account.');
            
            // Optionally auto-login after registration
            if (data.autoLogin) {
                return await this.login(email, password, masterKey);
            }
            
            return { success: true, message: data.message };
            
        } catch (error) {
            console.error('Registration error:', error);
            
            // Show user-friendly error message
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.message.includes('Email already exists')) {
                errorMessage = 'An account with this email already exists. Please use a different email or try logging in.';
            } else if (error.message.includes('Username already exists')) {
                errorMessage = 'This username is already taken. Please choose a different username.';
            } else if (error.message.includes('Invalid email')) {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.message.includes('Password too weak')) {
                errorMessage = 'Password is too weak. Please use a stronger password with at least 8 characters.';
            }
            
            this.showError(errorMessage);
            return { success: false, error: errorMessage };
        }
    },

    // Verify email
    async verifyEmail(token) {
        try {
            const response = await fetch(`${this.API_BASE}/auth/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Email verification failed');
            }

            const data = await response.json();
            this.showSuccess('Email verified successfully! You can now log in.');
            
            return { success: true, message: data.message };
            
        } catch (error) {
            console.error('Email verification error:', error);
            this.showError('Email verification failed. Please try again or contact support.');
            return { success: false, error: error.message };
        }
    },

    // Reset password
    async resetPassword(email) {
        try {
            if (!email) {
                throw new Error('Email is required');
            }

            const response = await fetch(`${this.API_BASE}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Password reset failed');
            }

            const data = await response.json();
            this.showSuccess('Password reset email sent! Please check your inbox.');
            
            return { success: true, message: data.message };
            
        } catch (error) {
            console.error('Password reset error:', error);
            this.showError('Password reset failed. Please try again.');
            return { success: false, error: error.message };
        }
    },

    // Confirm password reset
    async confirmPasswordReset(token, newPassword) {
        try {
            if (!token || !newPassword) {
                throw new Error('Token and new password are required');
            }

            if (newPassword.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            const response = await fetch(`${this.API_BASE}/auth/confirm-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPassword })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Password reset confirmation failed');
            }

            const data = await response.json();
            this.showSuccess('Password reset successfully! You can now log in with your new password.');
            
            return { success: true, message: data.message };
            
        } catch (error) {
            console.error('Password reset confirmation error:', error);
            this.showError('Password reset confirmation failed. Please try again.');
            return { success: false, error: error.message };
        }
    },

    // Validate token
    async validateToken() {
        try {
            if (!this.token) {
                return false;
            }

            const response = await fetch(`${this.API_BASE}/auth/validate`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
                this.isAuthenticated = true;
                return true;
            } else {
                // Token is invalid
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Token validation error:', error);
            this.logout();
            return false;
        }
    },

    // Get current user
    getCurrentUser() {
        if (this.user) {
            return this.user;
        }
        
        // Try to get from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
                return this.user;
            } catch (e) {
                console.error('Error parsing stored user:', e);
                return null;
            }
        }
        
        return null;
    },

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated && !!this.token && !!this.user;
    },

    // Get authentication headers for API calls
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        if (this.user && this.user.id) {
            headers['X-User-ID'] = this.user.id;
        }
        
        return headers;
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
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-xl">${type === 'success' ? '✅' : '❌'}</div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    },

    // Logout user
    logout() {
        this.token = null;
        this.user = null;
        this.masterKey = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('masterKey');
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
    }
};

// Add logout event listener
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        Auth.logout();
    });
});
