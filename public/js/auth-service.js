// 🔐 Authentication Service - Maze Password Manager
// Handles user authentication, session management, and API calls

class AuthService {
    constructor() {
        this.baseURL = '';
        this.user = null;
        this.token = null;
        this.init();
    }

    init() {
        // Load user data from localStorage
        this.loadUserData();
        
        // Check if user is authenticated
        if (this.isAuthenticated()) {
            this.user = {
                id: localStorage.getItem('user_id'),
                email: localStorage.getItem('user_email')
            };
        }
    }

    // Load user data from localStorage
    loadUserData() {
        this.token = localStorage.getItem('auth_token');
        this.user = {
            id: localStorage.getItem('user_id'),
            email: localStorage.getItem('user_email')
        };
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!(this.token && this.user && this.user.id);
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Get auth token
    getToken() {
        return this.token;
    }

    // Get auth headers for API calls
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'X-User-ID': this.user?.id || '',
            'Authorization': `Bearer ${this.token || ''}`
        };
    }

    // User registration
    async register(email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // User login
    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();
            
            // Store user data
            this.storeUserData(data.user_id, data.token, email);
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // User logout
    async logout() {
        try {
            // Call logout API
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: this.getAuthHeaders()
            });
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Clear local data
            this.clearUserData();
        }
    }

    // Store user data in localStorage
    storeUserData(userId, token, email) {
        localStorage.setItem('user_id', userId);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_email', email);
        
        // Update current state
        this.user = { id: userId, email };
        this.token = token;
    }

    // Clear user data
    clearUserData() {
        localStorage.removeItem('user_id');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        
        // Clear current state
        this.user = null;
        this.token = null;
    }

    // Get user profile
    async getProfile() {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to get profile');
            }

            return await response.json();
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }

    // Get user vaults
    async getVaults() {
        try {
            const response = await fetch('/api/vaults', {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to get vaults');
            }

            return await response.json();
        } catch (error) {
            console.error('Get vaults error:', error);
            throw error;
        }
    }

    // Create new vault
    async createVault(name, description = '', icon = '🔐') {
        try {
            const response = await fetch('/api/vaults', {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ name, description, icon })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create vault');
            }

            return await response.json();
        } catch (error) {
            console.error('Create vault error:', error);
            throw error;
        }
    }

    // Get passwords for a vault
    async getPasswords(vaultId) {
        try {
            const response = await fetch(`/api/vaults/${vaultId}/passwords`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to get passwords');
            }

            return await response.json();
        } catch (error) {
            console.error('Get passwords error:', error);
            throw error;
        }
    }

    // Redirect to dashboard if authenticated
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = '/dashboard';
            return true;
        }
        return false;
    }

    // Redirect to login if not authenticated
    redirectIfNotAuthenticated() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login';
            return true;
        }
        return false;
    }

    // Check if user can access a page
    canAccessPage() {
        return this.isAuthenticated();
    }
}

// Create global instance
window.authService = new AuthService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}
