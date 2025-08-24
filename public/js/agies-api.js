/**
 * Agies API Service
 * Central service for connecting frontend to all backend security systems
 */

class AgiesAPI {
  constructor() {
    this.baseURL = 'http://localhost:3002/api';
    this.token = localStorage.getItem('agies_token');
    this.user = JSON.parse(localStorage.getItem('agies_user') || 'null');
    this.masterKey = localStorage.getItem('agies_master_key');

    // Initialize security services
    this.vaultManagement = null;
    this.encryptionService = null;
    this.aiGuardian = null;
    this.honeytokenService = null;
    this.oneWayEntryService = null;
    this.darkWebMonitor = null;
    this.databaseService = null;
    this.vaultSharingService = null;

    this.initializeServices();
  }

  async initializeServices() {
    try {
      // Initialize vault management service
      if (window.VaultManagementService) {
        this.vaultManagement = new window.VaultManagementService();
      }

      // Initialize encryption service
      if (window.AgiesZeroKnowledgeEncryption) {
        this.encryptionService = new window.AgiesZeroKnowledgeEncryption();

        // Set master key if available
        if (this.masterKey) {
          await this.encryptionService.setMasterKey(this.masterKey);
        }
      }

      // Initialize AI Guardian
      if (window.AgiesAIGuardian) {
        this.aiGuardian = new window.AgiesAIGuardian();
      }

      // Initialize Honeytoken Service
      if (window.HoneytokenService) {
        this.honeytokenService = new window.HoneytokenService();
      }

      // Initialize One-Way Entry Service
      if (window.OneWayEntryService) {
        this.oneWayEntryService = new window.OneWayEntryService();
      }

      // Initialize Dark Web Monitor
      if (window.AgiesDarkWebMonitor) {
        this.darkWebMonitor = new window.AgiesDarkWebMonitor();
      }

      // Initialize Database Service
      if (window.AgiesDatabaseService) {
        this.databaseService = new window.AgiesDatabaseService();
      }

      // Initialize Vault Sharing Service
      if (window.AgiesVaultSharingService) {
        this.vaultSharingService = new window.AgiesVaultSharingService();
      }

      console.log('🌀 Agies API services initialized');
    } catch (error) {
      console.error('Error initializing Agies services:', error);
    }
  }

  // === AUTHENTICATION METHODS ===

  async register(email, username, password, masterKey) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password, masterKey })
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Store authentication data
      this.token = data.token;
      this.user = data.user;
      this.masterKey = masterKey;

      localStorage.setItem('agies_token', this.token);
      localStorage.setItem('agies_user', JSON.stringify(this.user));
      localStorage.setItem('agies_master_key', this.masterKey);

      // Initialize encryption with master key
      if (this.encryptionService) {
        await this.encryptionService.setMasterKey(this.masterKey);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  async login(email, password, masterKey) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, masterKey })
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Store authentication data
      this.token = data.token;
      this.user = data.user;
      this.masterKey = masterKey;

      localStorage.setItem('agies_token', this.token);
      localStorage.setItem('agies_user', JSON.stringify(this.user));
      localStorage.setItem('agies_master_key', this.masterKey);

      // Initialize encryption with master key
      if (this.encryptionService) {
        await this.encryptionService.setMasterKey(this.masterKey);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  logout() {
    // Clear all authentication data
    this.token = null;
    this.user = null;
    this.masterKey = null;

    localStorage.removeItem('agies_token');
    localStorage.removeItem('agies_user');
    localStorage.removeItem('agies_master_key');

    // Clear encryption service
    if (this.encryptionService) {
      this.encryptionService.clearMasterKey();
    }

    return { success: true };
  }

  isAuthenticated() {
    return !!(this.token && this.user);
  }

  // === VAULT MANAGEMENT METHODS ===

  async createVault(vaultData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      // Use database service if available
      if (this.databaseService) {
        const result = await this.databaseService.createVault({
          ...vaultData,
          userId: this.user.id
        });
        return { success: true, vaultId: result.vaultId };
      }

      // Use vault management service if available
      if (this.vaultManagement) {
        const result = await this.vaultManagement.createVault(this.user.id, vaultData);
        return result;
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/vaults`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(vaultData)
      });

      if (!response.ok) {
        throw new Error(`Vault creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, vaultId: data.vaultId };
    } catch (error) {
      console.error('Vault creation error:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserVaults() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      // Use database service if available
      if (this.databaseService) {
        const vaults = await this.databaseService.getUserVaults(this.user.id);
        return { success: true, vaults };
      }

      // Use vault management service if available
      if (this.vaultManagement) {
        const vaults = this.vaultManagement.getUserVaults(this.user.id);
        return { success: true, vaults };
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/vaults`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vaults: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, vaults: data.vaults };
    } catch (error) {
      console.error('Get vaults error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateVault(vaultId, updates) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      if (this.vaultManagement) {
        const result = await this.vaultManagement.updateVault(vaultId, this.user.id, updates);
        return result;
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/vaults/${vaultId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Vault update failed: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Vault update error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteVault(vaultId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      if (this.vaultManagement) {
        const result = await this.vaultManagement.deleteVault(vaultId, this.user.id);
        return result;
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/vaults/${vaultId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Vault deletion failed: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Vault deletion error:', error);
      return { success: false, error: error.message };
    }
  }

  async shareVault(vaultId, shareData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      // Use vault sharing service if available
      if (this.vaultSharingService) {
        const result = await this.vaultSharingService.shareVault(vaultId, shareData);
        return { success: true, shareId: result.shareId };
      }

      // Use vault management service if available
      if (this.vaultManagement) {
        const result = await this.vaultManagement.shareVault(vaultId, this.user.id, shareData);
        return result;
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/vaults/${vaultId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(shareData)
      });

      if (!response.ok) {
        throw new Error(`Vault sharing failed: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, shareId: data.shareId };
    } catch (error) {
      console.error('Vault sharing error:', error);
      return { success: false, error: error.message };
    }
  }

  // === VAULT SHARING METHODS ===

  async getVaultShares(vaultId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      if (this.vaultSharingService) {
        const shares = await this.vaultSharingService.getVaultShares(vaultId);
        return { success: true, shares };
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/vaults/${vaultId}/shares`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vault shares: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, shares: data.shares };
    } catch (error) {
      console.error('Get vault shares error:', error);
      return { success: false, error: error.message };
    }
  }

  async revokeVaultShare(vaultId, shareId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      if (this.vaultSharingService) {
        // Get share details first
        const shares = await this.vaultSharingService.getVaultShares(vaultId);
        const share = shares.find(s => s.id === shareId);

        if (share && share.sharedWithUserId) {
          await this.vaultSharingService.revokeVaultAccess(vaultId, share.sharedWithUserId);
        }
        return { success: true };
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/vaults/${vaultId}/shares/${shareId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to revoke vault share: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Revoke vault share error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateVaultSharePermissions(vaultId, shareId, permissions) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      if (this.vaultSharingService) {
        // Get share details first
        const shares = await this.vaultSharingService.getVaultShares(vaultId);
        const share = shares.find(s => s.id === shareId);

        if (share && share.sharedWithUserId) {
          await this.vaultSharingService.updateVaultPermissions(vaultId, share.sharedWithUserId, permissions);
        }
        return { success: true };
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/vaults/${vaultId}/shares/${shareId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ permissions })
      });

      if (!response.ok) {
        throw new Error(`Failed to update share permissions: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Update share permissions error:', error);
      return { success: false, error: error.message };
    }
  }

  async getPendingInvitations(vaultId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      if (this.vaultSharingService) {
        const invitations = await this.vaultSharingService.getPendingInvitations(vaultId);
        return { success: true, invitations };
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/vaults/${vaultId}/invitations`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pending invitations: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, invitations: data.invitations };
    } catch (error) {
      console.error('Get pending invitations error:', error);
      return { success: false, error: error.message };
    }
  }

  async acceptVaultInvitation(invitationToken) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      if (this.vaultSharingService) {
        const result = await this.vaultSharingService.acceptVaultInvitation(invitationToken);
        return result;
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/invitations/${invitationToken}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ userId: this.user.id })
      });

      if (!response.ok) {
        throw new Error(`Failed to accept invitation: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Accept invitation error:', error);
      return { success: false, error: error.message };
    }
  }

  // === ICON MANAGEMENT METHODS ===

  async getAvailableIcons(category = null) {
    try {
      if (this.vaultManagement) {
        const icons = this.vaultManagement.getAvailableIcons(category);
        return { success: true, icons };
      }

      // API fallback
      const url = category ?
        `${this.baseURL}/icons?category=${category}` :
        `${this.baseURL}/icons`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch icons: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, icons: data.icons };
    } catch (error) {
      console.error('Get icons error:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadCustomIcon(iconData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      if (this.vaultManagement) {
        const result = await this.vaultManagement.uploadCustomIcon(this.user.id, iconData);
        return result;
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/icons/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(iconData)
      });

      if (!response.ok) {
        throw new Error(`Icon upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, iconId: data.iconId };
    } catch (error) {
      console.error('Icon upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // === PASSWORD MANAGEMENT METHODS ===

  async savePassword(vaultId, passwordData) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      // Use enhanced encryption for password data
      if (this.encryptionService) {
        const encryptedResult = await this.encryptionService.encryptPassword(passwordData, vaultId);

        // Save to database
        const response = await fetch(`${this.baseURL}/vaults/${vaultId}/passwords`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            encryptedPassword: encryptedResult.encryptedPassword,
            encryptionMetadata: encryptedResult.encryptionMetadata
          })
        });

        if (!response.ok) {
          throw new Error(`Password save failed: ${response.statusText}`);
        }

        return { success: true };
      }

      // Fallback without encryption
      const response = await fetch(`${this.baseURL}/vaults/${vaultId}/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        throw new Error(`Password save failed: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Save password error:', error);
      return { success: false, error: error.message };
    }
  }

  async getVaultPasswords(vaultId) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseURL}/vaults/${vaultId}/passwords`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch passwords: ${response.statusText}`);
      }

      const data = await response.json();

      // Decrypt passwords using enhanced encryption service
      if (this.encryptionService && data.passwords) {
        const decryptedPasswords = [];
        for (const encryptedPassword of data.passwords) {
          try {
            const decrypted = await this.encryptionService.decryptPassword(
              encryptedPassword.encryptedPassword,
              encryptedPassword.encryptionMetadata,
              vaultId
            );
            decryptedPasswords.push(decrypted);
          } catch (error) {
            console.error('Error decrypting password:', error);
            // Add placeholder for failed decryption
            decryptedPasswords.push({
              id: encryptedPassword.id,
              title: 'Decryption Error',
              error: true
            });
          }
        }
        return { success: true, passwords: decryptedPasswords };
      }

      return { success: true, passwords: data.passwords };
    } catch (error) {
      console.error('Get passwords error:', error);
      return { success: false, error: error.message };
    }
  }

  // === SECURITY MONITORING METHODS ===

  async getSecurityStatus() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseURL}/security/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get security status: ${response.statusText}`);
      }

      const data = await response.json();

      // Add local security service data
      if (this.aiGuardian) {
        const aiStatus = this.aiGuardian.getThreatIntelligence();
        data.aiGuardian = aiStatus;
      }

      if (this.honeytokenService) {
        const honeytokenStats = this.honeytokenService.getHoneytokenStats();
        data.honeytokenSystem = honeytokenStats;
      }

      if (this.encryptionService) {
        const encryptionStatus = this.encryptionService.getEncryptionStatus();
        data.encryptionStatus = encryptionStatus;
      }

      return { success: true, status: data };
    } catch (error) {
      console.error('Get security status error:', error);
      return { success: false, error: error.message };
    }
  }

  async getDarkWebAlerts() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      if (this.darkWebMonitor) {
        const alerts = this.darkWebMonitor.getBreachHistory();
        return { success: true, alerts };
      }

      // API fallback
      const response = await fetch(`${this.baseURL}/security/dark-web/alerts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get dark web alerts: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, alerts: data.alerts };
    } catch (error) {
      console.error('Get dark web alerts error:', error);
      return { success: false, error: error.message };
    }
  }

  // === UTILITY METHODS ===

  async generateSecurePassword(options = {}) {
    try {
      if (this.encryptionService) {
        const password = await this.encryptionService.generateSecurePassword(options);
        return { success: true, password };
      }

      // Fallback to API
      const response = await fetch(`${this.baseURL}/security/generate-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        throw new Error(`Password generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, password: data.password };
    } catch (error) {
      console.error('Password generation error:', error);
      return { success: false, error: error.message };
    }
  }

  // Event system for real-time updates
  on(event, callback) {
    if (!this.eventListeners) {
      this.eventListeners = {};
    }

    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }

    this.eventListeners[event].push(callback);
  }

  emit(event, data) {
    if (this.eventListeners && this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.AgiesAPI = AgiesAPI;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
      window.agiesAPI = new AgiesAPI();
    }
  });
}
