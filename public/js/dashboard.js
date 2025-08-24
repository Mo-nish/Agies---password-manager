class Dashboard {
    constructor() {
        this.API_BASE = 'http://localhost:3002/api';
        this.init();
    }

    async init() {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            // Load dashboard data
            await this.loadDashboardData();
            
            // Bind events
            this.bindEvents();
            
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showError('Failed to initialize dashboard');
        }
    }

    bindEvents() {
        // Navigation buttons
        const manageVaultsBtn = document.getElementById('manage-vaults-btn');
        if (manageVaultsBtn) {
            manageVaultsBtn.addEventListener('click', () => {
                window.location.href = '/vaults';
            });
        }

        const securitySettingsBtn = document.getElementById('security-settings-btn');
        if (securitySettingsBtn) {
            securitySettingsBtn.addEventListener('click', () => {
                window.location.href = '/security';
            });
        }

        // Generate API key button
        const generateApiKeyBtn = document.getElementById('generate-api-key-btn');
        if (generateApiKeyBtn) {
            generateApiKeyBtn.addEventListener('click', () => {
                this.generateApiKey();
            });
        }

        // API key modal close button
        const closeApiModal = document.getElementById('close-api-modal');
        if (closeApiModal) {
            closeApiModal.addEventListener('click', () => {
                this.hideApiKeyModal();
            });
        }

        // Copy API key button
        const copyApiKeyBtn = document.getElementById('copy-api-key');
        if (copyApiKeyBtn) {
            copyApiKeyBtn.addEventListener('click', () => {
                this.copyApiKey();
            });
        }

        // Regenerate API key button
        const regenerateApiKeyBtn = document.getElementById('regenerate-api-key');
        if (regenerateApiKeyBtn) {
            regenerateApiKeyBtn.addEventListener('click', () => {
                this.regenerateApiKey();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    async loadDashboardData() {
        try {
            // Load user info
            await this.loadUserInfo();
            
            // Load vault stats
            await this.loadVaultStats();
            
            // Load recent activity
            this.loadRecentActivity();
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    async loadUserInfo() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const userNameElement = document.getElementById('user-name');
                if (userNameElement) {
                    userNameElement.textContent = data.username || 'User';
                }
            }
        } catch (error) {
            console.error('Failed to load user info:', error);
        }
    }

    async loadVaultStats() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/vaults`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const totalVaultsElement = document.getElementById('total-vaults');
                const totalPasswordsElement = document.getElementById('total-passwords');
                
                if (totalVaultsElement) {
                    totalVaultsElement.textContent = data.vaults?.length || 0;
                }
                
                if (totalPasswordsElement) {
                    // Calculate total passwords across all vaults
                    const totalPasswords = data.vaults?.reduce((total, vault) => total + (vault.password_count || 0), 0) || 0;
                    totalPasswordsElement.textContent = totalPasswords;
                }
            }
        } catch (error) {
            console.error('Failed to load vault stats:', error);
        }
    }

    loadRecentActivity() {
        // Set default activity values
        const lastLoginElement = document.getElementById('last-login');
        const vaultsAccessedElement = document.getElementById('vaults-accessed');
        const securityEventsElement = document.getElementById('security-events');
        
        if (lastLoginElement) {
            lastLoginElement.textContent = 'Just now';
        }
        
        if (vaultsAccessedElement) {
            vaultsAccessedElement.textContent = '0';
        }
        
        if (securityEventsElement) {
            securityEventsElement.textContent = '0';
        }
    }

    async generateApiKey() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/security/api-key`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.showApiKeyModal(data.apiKey);
            } else {
                throw new Error('Failed to generate API key');
            }
        } catch (error) {
            console.error('Failed to generate API key:', error);
            this.showError('Failed to generate API key');
        }
    }

    async regenerateApiKey() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/security/api-key`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const apiKeyDisplay = document.getElementById('api-key-display');
                if (apiKeyDisplay) {
                    apiKeyDisplay.textContent = data.apiKey;
                }
                this.showSuccess('API key regenerated successfully');
            } else {
                throw new Error('Failed to regenerate API key');
            }
        } catch (error) {
            console.error('Failed to regenerate API key:', error);
            this.showError('Failed to regenerate API key');
        }
    }

    showApiKeyModal(apiKey) {
        const modal = document.getElementById('api-key-modal');
        const apiKeyDisplay = document.getElementById('api-key-display');
        
        if (modal && apiKeyDisplay) {
            apiKeyDisplay.textContent = apiKey;
            modal.classList.remove('hidden');
        }
    }

    hideApiKeyModal() {
        const modal = document.getElementById('api-key-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    copyApiKey() {
        const apiKeyDisplay = document.getElementById('api-key-display');
        if (apiKeyDisplay) {
            const apiKey = apiKeyDisplay.textContent;
            navigator.clipboard.writeText(apiKey).then(() => {
                this.showSuccess('API key copied to clipboard');
            }).catch(() => {
                this.showError('Failed to copy API key');
            });
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
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

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
