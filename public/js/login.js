class AuthManager {
    constructor() {
        this.API_BASE = 'http://localhost:3002/api';
        this.init();
    }

    init() {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/dashboard';
            return;
        }

        this.bindEvents();
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form-submit');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.register();
            });
        }

        // Toggle between login and register
        const showRegisterBtn = document.getElementById('show-register');
        const showLoginBtn = document.getElementById('show-login');
        
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', () => {
                this.showRegisterForm();
            });
        }
        
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', () => {
                this.showLoginForm();
            });
        }
    }

    async login() {
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const masterKey = document.getElementById('master-key').value;

            if (!email || !password || !masterKey) {
                this.showError('All fields are required');
                return;
            }

            this.showLoading(true);

            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    masterKey
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Store token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                this.showSuccess('Login successful! Redirecting...');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message || 'Login failed');
        } finally {
            this.showLoading(false);
        }
    }

    async register() {
        try {
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const masterKey = document.getElementById('reg-master-key').value;

            if (!username || !email || !password || !masterKey) {
                this.showError('All fields are required');
                return;
            }

            this.showLoading(true);

            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    masterKey
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                this.showSuccess('Account created successfully! Please login.');
                
                // Switch back to login form
                setTimeout(() => {
                    this.showLoginForm();
                }, 1500);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showError(error.message || 'Registration failed');
        } finally {
            this.showLoading(false);
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('login-form').parentElement;
        const registerForm = document.getElementById('register-form');
        
        if (loginForm && registerForm) {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        }
    }

    showRegisterForm() {
        const loginForm = document.getElementById('login-form').parentElement;
        const registerForm = document.getElementById('register-form');
        
        if (loginForm && registerForm) {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.toggle('hidden', !show);
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-3 rounded-lg shadow-lg z-50 text-sm ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize auth manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
