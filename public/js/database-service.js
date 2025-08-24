/**
 * Agies Database Service
 * Handles PostgreSQL database operations with enhanced security
 * Integrated with Chakravyuham encryption and security systems
 */

class AgiesDatabaseService {
  constructor() {
    this.connection = null;
    this.encryptionService = null;
    this.isConnected = false;
    this.connectionConfig = {
      host: 'localhost',
      port: 5432,
      database: 'agies_maze_vault',
      user: 'agies_user',
      password: 'agies_secure_2024!',
      ssl: false,
      max: 20, // Maximum number of connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.initializeWhenReady();
  }

  async initializeWhenReady() {
    // Wait for encryption service to be available
    const maxAttempts = 20;
    let attempts = 0;

    const checkServices = () => {
      if (window.AgiesZeroKnowledgeEncryption) {
        this.encryptionService = new window.AgiesZeroKnowledgeEncryption();
        this.initializeDatabase();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkServices, 200);
      } else {
        console.error('❌ Failed to initialize Agies Database Service - Encryption service not available');
      }
    };

    checkServices();
  }

  async initializeDatabase() {
    console.log('🗄️ Initializing Agies Database Service...');

    try {
      // In a real implementation, you would use a PostgreSQL client like 'pg'
      // For now, we'll use fetch to communicate with the backend API
      this.isConnected = true;
      console.log('✅ Agies Database Service initialized');
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      this.isConnected = false;
    }
  }

  // ========================================
  // USER OPERATIONS
  // ========================================

  async createUser(userData) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`User creation failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('👤 User created successfully:', result.userId);
      return result;
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`User fetch failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.user;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/users/by-email/${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`User fetch failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.user;
    } catch (error) {
      console.error('Get user by email error:', error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`User update failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('👤 User updated successfully');
      return result;
    } catch (error) {
      console.error('User update error:', error);
      throw error;
    }
  }

  // ========================================
  // VAULT OPERATIONS
  // ========================================

  async createVault(vaultData) {
    if (!this.isConnected) throw new Error('Database not connected');
    if (!this.encryptionService) throw new Error('Encryption service not available');

    try {
      // Generate vault key and encrypt sensitive data
      const vaultKey = await this.encryptionService.generateVaultKey();
      const encryptedVaultData = await this.encryptionService.encryptVaultMetadata(vaultData);

      const vaultPayload = {
        ...vaultData,
        encryptedData: encryptedVaultData.encrypted,
        encryptionMetadata: {
          iv: encryptedVaultData.iv,
          authTag: encryptedVaultData.authTag,
          algorithm: 'aes-256-gcm',
          keyId: vaultKey.id
        }
      };

      const response = await fetch('/api/vaults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(vaultPayload)
      });

      if (!response.ok) {
        throw new Error(`Vault creation failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🗂️ Vault created successfully:', result.vaultId);
      return result;
    } catch (error) {
      console.error('Vault creation error:', error);
      throw error;
    }
  }

  async getUserVaults(userId) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/users/${userId}/vaults`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Vaults fetch failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Decrypt vault data if encryption service is available
      if (this.encryptionService && result.vaults) {
        const decryptedVaults = [];
        for (const vault of result.vaults) {
          try {
            const decrypted = await this.encryptionService.decryptVaultMetadata(
              vault.encryptedData,
              vault.encryptionMetadata
            );
            decryptedVaults.push({ ...vault, ...decrypted });
          } catch (error) {
            console.error('Error decrypting vault:', error);
            decryptedVaults.push(vault); // Add with encrypted data if decryption fails
          }
        }
        result.vaults = decryptedVaults;
      }

      return result.vaults;
    } catch (error) {
      console.error('Get vaults error:', error);
      throw error;
    }
  }

  async getVaultById(vaultId) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/vaults/${vaultId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Vault fetch failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Decrypt vault data if encryption service is available
      if (this.encryptionService && result.vault) {
        try {
          const decrypted = await this.encryptionService.decryptVaultMetadata(
            result.vault.encryptedData,
            result.vault.encryptionMetadata
          );
          result.vault = { ...result.vault, ...decrypted };
        } catch (error) {
          console.error('Error decrypting vault:', error);
        }
      }

      return result.vault;
    } catch (error) {
      console.error('Get vault error:', error);
      throw error;
    }
  }

  async updateVault(vaultId, updates) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      // Encrypt sensitive updates if encryption service is available
      let updatePayload = updates;
      if (this.encryptionService && updates.name) {
        const encrypted = await this.encryptionService.encryptVaultMetadata({
          name: updates.name,
          description: updates.description
        });
        updatePayload = {
          ...updates,
          encryptedData: encrypted.encrypted,
          encryptionMetadata: {
            iv: encrypted.iv,
            authTag: encrypted.authTag
          }
        };
      }

      const response = await fetch(`/api/vaults/${vaultId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error(`Vault update failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🗂️ Vault updated successfully');
      return result;
    } catch (error) {
      console.error('Vault update error:', error);
      throw error;
    }
  }

  async deleteVault(vaultId) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/vaults/${vaultId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Vault deletion failed: ${response.statusText}`);
      }

      console.log('🗂️ Vault deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Vault deletion error:', error);
      throw error;
    }
  }

  // ========================================
  // PASSWORD OPERATIONS
  // ========================================

  async savePassword(vaultId, passwordData) {
    if (!this.isConnected) throw new Error('Database not connected');
    if (!this.encryptionService) throw new Error('Encryption service not available');

    try {
      // Encrypt password data
      const encryptedResult = await this.encryptionService.encryptPassword(
        passwordData,
        vaultId
      );

      const passwordPayload = {
        vaultId,
        encryptedPassword: encryptedResult.encryptedPassword,
        encryptionMetadata: encryptedResult.encryptionMetadata,
        title: passwordData.title,
        url: passwordData.url,
        username: passwordData.username,
        category: passwordData.category,
        tags: passwordData.tags
      };

      const response = await fetch(`/api/vaults/${vaultId}/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(passwordPayload)
      });

      if (!response.ok) {
        throw new Error(`Password save failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🔐 Password saved successfully');
      return result;
    } catch (error) {
      console.error('Save password error:', error);
      throw error;
    }
  }

  async getVaultPasswords(vaultId) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/vaults/${vaultId}/passwords`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Passwords fetch failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Decrypt passwords if encryption service is available
      if (this.encryptionService && result.passwords) {
        const decryptedPasswords = [];
        for (const password of result.passwords) {
          try {
            const decrypted = await this.encryptionService.decryptPassword(
              password.encryptedPassword,
              password.encryptionMetadata,
              vaultId
            );
            decryptedPasswords.push({ ...password, ...decrypted });
          } catch (error) {
            console.error('Error decrypting password:', error);
            decryptedPasswords.push(password); // Add with encrypted data if decryption fails
          }
        }
        result.passwords = decryptedPasswords;
      }

      return result.passwords;
    } catch (error) {
      console.error('Get passwords error:', error);
      throw error;
    }
  }

  async updatePassword(vaultId, passwordId, updates) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      // Encrypt updates if encryption service is available
      let updatePayload = updates;
      if (this.encryptionService && (updates.password || updates.title)) {
        const encrypted = await this.encryptionService.encryptPassword({
          password: updates.password,
          title: updates.title,
          username: updates.username,
          url: updates.url
        }, vaultId);

        updatePayload = {
          ...updates,
          encryptedPassword: encrypted.encryptedPassword,
          encryptionMetadata: encrypted.encryptionMetadata
        };
      }

      const response = await fetch(`/api/vaults/${vaultId}/passwords/${passwordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error(`Password update failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🔐 Password updated successfully');
      return result;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  async deletePassword(vaultId, passwordId) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/vaults/${vaultId}/passwords/${passwordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Password deletion failed: ${response.statusText}`);
      }

      console.log('🔐 Password deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Delete password error:', error);
      throw error;
    }
  }

  // ========================================
  // SECURITY OPERATIONS
  // ========================================

  async logSecurityEvent(eventData) {
    if (!this.isConnected) return;

    try {
      const response = await fetch('/api/security/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        console.warn('Security event logging failed:', response.statusText);
      }
    } catch (error) {
      console.warn('Security event logging error:', error);
    }
  }

  async getSecurityEvents(userId, limit = 100) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/security/events?userId=${userId}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Security events fetch failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.events;
    } catch (error) {
      console.error('Get security events error:', error);
      throw error;
    }
  }

  async createHoneytoken(honeytokenData) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch('/api/honeytokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(honeytokenData)
      });

      if (!response.ok) {
        throw new Error(`Honeytoken creation failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🍯 Honeytoken created successfully');
      return result;
    } catch (error) {
      console.error('Create honeytoken error:', error);
      throw error;
    }
  }

  async triggerHoneytoken(honeytokenId) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/honeytokens/${honeytokenId}/trigger`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Honeytoken trigger failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🚨 Honeytoken triggered successfully');
      return result;
    } catch (error) {
      console.error('Trigger honeytoken error:', error);
      throw error;
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  getToken() {
    if (window.AgiesAPI && window.AgiesAPI.token) {
      return window.AgiesAPI.token;
    }
    return localStorage.getItem('agies_token');
  }

  async healthCheck() {
    try {
      const response = await fetch('/api/health', {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return {
        database: response.ok,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        database: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Transaction support (for complex operations)
  async executeTransaction(operations) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ operations })
      });

      if (!response.ok) {
        throw new Error(`Transaction failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🔄 Transaction executed successfully');
      return result;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }

  // Backup and export functionality
  async exportUserData(userId) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const response = await fetch(`/api/users/${userId}/export`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Data export failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📤 User data exported successfully');
      return result;
    } catch (error) {
      console.error('Export user data error:', error);
      throw error;
    }
  }

  // Search functionality
  async searchPasswords(userId, query, filters = {}) {
    if (!this.isConnected) throw new Error('Database not connected');

    try {
      const searchParams = new URLSearchParams({
        q: query,
        ...filters
      });

      const response = await fetch(`/api/users/${userId}/search?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  // Cleanup method
  disconnect() {
    this.isConnected = false;
    this.encryptionService = null;
    console.log('🔌 Database service disconnected');
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.AgiesDatabaseService = AgiesDatabaseService;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
      window.agiesDatabase = new AgiesDatabaseService();
    }
  });
}
