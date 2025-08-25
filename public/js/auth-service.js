// 🔐 Simple Authentication Service - Maze Password Manager
// Handles user authentication, session management, and API calls

class AuthService {
    constructor() {
        this.user = null;
        this.token = null;
        this.init();
    }

    init() {
        // Load user data from localStorage
        this.loadUserData();
        console.log('🔐 Auth Service initialized');
    }

    // Load user data from localStorage
    loadUserData() {
        try {
            this.token = localStorage.getItem('auth_token');
            const userId = localStorage.getItem('user_id');
            const userEmail = localStorage.getItem('user_email');
            
            if (this.token && userId && userEmail) {
                this.user = { id: userId, email: userEmail };
                console.log('✅ User data loaded from localStorage');
            } else {
                console.log('ℹ️ No stored user data found');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
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
            console.log('📝 Registering user:', email);
            
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
            console.log('✅ Registration successful');
            return data;
        } catch (error) {
            console.error('❌ Registration error:', error);
            throw error;
        }
    }

    // User login
    async login(email, password) {
        try {
            console.log('🔓 Logging in user:', email);
            
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
            console.log('✅ Login successful');
            
            return data;
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    }

    // User logout
    async logout() {
        try {
            console.log('🚪 Logging out user');
            
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
            console.log('✅ Logout completed');
        }
    }

    // Store user data in localStorage
    storeUserData(userId, token, email) {
        try {
            localStorage.setItem('user_id', userId);
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_email', email);
            
            // Update current state
            this.user = { id: userId, email };
            this.token = token;
            
            console.log('💾 User data stored');
        } catch (error) {
            console.error('Error storing user data:', error);
        }
    }

    // Clear user data
    clearUserData() {
        try {
            localStorage.removeItem('user_id');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_email');
            
            // Clear current state
            this.user = null;
            this.token = null;
            
            console.log('🗑️ User data cleared');
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
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

    // Add password to vault
    async addPassword(vaultId, passwordData) {
        try {
            const response = await fetch(`/api/vaults/${vaultId}/passwords`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(passwordData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add password');
            }

            return await response.json();
        } catch (error) {
            console.error('Add password error:', error);
            throw error;
        }
    }

    // Update password
    async updatePassword(passwordId, passwordData) {
        try {
            const response = await fetch(`/api/passwords/${passwordId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(passwordData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update password');
            }

            return await response.json();
        } catch (error) {
            console.error('Update password error:', error);
            throw error;
        }
    }

    // Delete password
    async deletePassword(passwordId) {
        try {
            const response = await fetch(`/api/passwords/${passwordId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete password');
            }

            return await response.json();
        } catch (error) {
            console.error('Delete password error:', error);
            throw error;
        }
    }

    // Get vault details
    async getVault(vaultId) {
        try {
            const response = await fetch(`/api/vaults/${vaultId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to get vault');
            }

            return await response.json();
        } catch (error) {
            console.error('Get vault error:', error);
            throw error;
        }
    }

    // Search passwords
    async searchPasswords(query) {
        try {
            const response = await fetch(`/api/passwords/search?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to search passwords');
            }

            return await response.json();
        } catch (error) {
            console.error('Search passwords error:', error);
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

    // Forgot password API
    async forgotPasswordAPI(email) {
        try {
            // For now, simulate success (implement real password reset later)
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, message: 'Reset link sent' };
        } catch (error) {
            console.error('Forgot password API error:', error);
            throw error;
        }
    }

    // Test API connection
    async testConnection() {
        try {
            const response = await fetch('/api/health');
            if (response.ok) {
                console.log('✅ Backend connection successful');
                return true;
            } else {
                console.error('❌ Backend connection failed');
                return false;
            }
        } catch (error) {
            console.error('❌ Backend connection error:', error);
            return false;
        }
    }
}

// Create global instance immediately
window.authService = new AuthService();

// Test connection on load
window.addEventListener('DOMContentLoaded', () => {
    if (window.authService) {
        window.authService.testConnection();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}
