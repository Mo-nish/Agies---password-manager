// 🚀 Agies API Service
// Connects frontend with Flask backend

class AgiesAPIService {
    constructor() {
        // In production, this will be your Render backend URL
        this.baseURL = 'https://agies-password-manager.onrender.com';
        this.userId = localStorage.getItem('agies_user_id');
        this.token = localStorage.getItem('agies_token');
    }

    // Set authentication headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.userId) {
            headers['X-User-ID'] = this.userId;
        }
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Update authentication data
    updateAuth(userId, token) {
        this.userId = userId;
        this.token = token;
        localStorage.setItem('agies_user_id', userId);
        localStorage.setItem('agies_token', token);
    }

    // Clear authentication
    clearAuth() {
        this.userId = null;
        this.token = null;
        localStorage.removeItem('agies_user_id');
        localStorage.removeItem('agies_token');
    }

    // User registration
    async register(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/api/auth/register`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Update auth data
            this.updateAuth(data.user_id, data.token);
            
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // User login
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/api/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Update auth data
            this.updateAuth(data.user_id, data.token);
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Get user profile
    async getProfile() {
        try {
            const response = await fetch(`${this.baseURL}/api/auth/profile`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get profile');
            }

            return data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }

    // Get user vaults
    async getVaults() {
        try {
            const response = await fetch(`${this.baseURL}/api/vaults`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get vaults');
            }

            return data;
        } catch (error) {
            console.error('Get vaults error:', error);
            throw error;
        }
    }

    // Create vault
    async createVault(name, description = '', icon = '🔐') {
        try {
            const response = await fetch(`${this.baseURL}/api/vaults`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ name, description, icon })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create vault');
            }

            return data;
        } catch (error) {
            console.error('Create vault error:', error);
            throw error;
        }
    }

    // Update vault
    async updateVault(vaultId, name, description = '', icon = '🔐') {
        try {
            const response = await fetch(`${this.baseURL}/api/vaults/${vaultId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ name, description, icon })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update vault');
            }

            return data;
        } catch (error) {
            console.error('Update vault error:', error);
            throw error;
        }
    }

    // Delete vault
    async deleteVault(vaultId) {
        try {
            const response = await fetch(`${this.baseURL}/api/vaults/${vaultId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete vault');
            }

            return data;
        } catch (error) {
            console.error('Delete vault error:', error);
            throw error;
        }
    }

    // Get vault passwords
    async getPasswords(vaultId) {
        try {
            const response = await fetch(`${this.baseURL}/api/vaults/${vaultId}/passwords`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get passwords');
            }

            return data;
        } catch (error) {
            console.error('Get passwords error:', error);
            throw error;
        }
    }

    // Add password
    async addPassword(vaultId, title, username, password, url = '', notes = '') {
        try {
            const response = await fetch(`${this.baseURL}/api/vaults/${vaultId}/passwords`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ title, username, password, url, notes })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add password');
            }

            return data;
        } catch (error) {
            console.error('Add password error:', error);
            throw error;
        }
    }

    // Update password
    async updatePassword(passwordId, title, username, password, url = '', notes = '') {
        try {
            const response = await fetch(`${this.baseURL}/api/passwords/${passwordId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ title, username, password, url, notes })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update password');
            }

            return data;
        } catch (error) {
            console.error('Update password error:', error);
            throw error;
        }
    }

    // Delete password
    async deletePassword(passwordId) {
        try {
            const response = await fetch(`${this.baseURL}/api/passwords/${passwordId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete password');
            }

            return data;
        } catch (error) {
            console.error('Delete password error:', error);
            throw error;
        }
    }

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            const data = await response.json();
            return data.status === 'healthy';
        } catch (error) {
            console.error('Health check error:', error);
            return false;
        }
    }

    // Check if backend is available
    async isBackendAvailable() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Logout method
    async logout() {
        try {
            // Clear local storage
            this.clearAuth();
            
            // Clear any other stored data
            localStorage.removeItem('agies_vaults');
            localStorage.removeItem('agies_passwords');
            
            // Redirect to login page
            window.location.href = '/';
            
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout error:', error);
            // Force redirect even if there's an error
            window.location.href = '/';
            throw error;
        }
    }
}

// Create global instance
window.agiesAPI = new AgiesAPIService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgiesAPIService;
}
