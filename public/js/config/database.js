/**
 * Browser-compatible Database Configuration
 * Simplified version for frontend use
 */

class DatabaseService {
  constructor() {
    this.storage = {
      users: new Map(),
      vaults: new Map(),
      passwords: new Map(),
      notes: new Map(),
      creditCards: new Map(),
      sessions: new Map(),
      securityEvents: new Map(),
      vaultShares: new Map()
    };
    this.isConnected = false;
    this.connectionTime = null;
  }

  async connect() {
    console.log('🔌 Connecting to database...');

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));

    this.isConnected = true;
    this.connectionTime = new Date();

    console.log('✅ Database connected successfully');
    return { success: true, message: 'Connected to database' };
  }

  async disconnect() {
    console.log('🔌 Disconnecting from database...');

    // Simulate cleanup
    await new Promise(resolve => setTimeout(resolve, 100));

    this.isConnected = false;
    console.log('✅ Database disconnected');
    return { success: true, message: 'Disconnected from database' };
  }

  // User operations
  async createUser(userData) {
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    const user = {
      id: userId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    this.storage.users.set(userId, user);
    console.log('👤 User created:', user.email);
    return user;
  }

  async getUserByEmail(email) {
    for (const user of this.storage.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getUserById(userId) {
    return this.storage.users.get(userId);
  }

  // Vault operations
  async createVault(vaultData) {
    const vaultId = 'vault_' + Math.random().toString(36).substr(2, 9);
    const vault = {
      id: vaultId,
      ...vaultData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    this.storage.vaults.set(vaultId, vault);
    console.log('🏗️ Vault created:', vault.name);
    return vault;
  }

  async getUserVaults(userId) {
    const vaults = [];
    for (const vault of this.storage.vaults.values()) {
      if (vault.ownerId === userId) {
        vaults.push(vault);
      }
    }
    return vaults;
  }

  async updateVault(vaultId, updates) {
    const vault = this.storage.vaults.get(vaultId);
    if (!vault) {
      throw new Error('Vault not found');
    }

    const updatedVault = {
      ...vault,
      ...updates,
      updatedAt: new Date()
    };

    this.storage.vaults.set(vaultId, updatedVault);
    return updatedVault;
  }

  async deleteVault(vaultId) {
    const vault = this.storage.vaults.get(vaultId);
    if (!vault) {
      return false;
    }

    this.storage.vaults.delete(vaultId);
    console.log('🗑️ Vault deleted:', vault.name);
    return true;
  }

  // Password operations
  async createPassword(passwordData) {
    const passwordId = 'pass_' + Math.random().toString(36).substr(2, 9);
    const password = {
      id: passwordId,
      ...passwordData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    this.storage.passwords.set(passwordId, password);
    return password;
  }

  async getVaultPasswords(vaultId) {
    const passwords = [];
    for (const password of this.storage.passwords.values()) {
      if (password.vaultId === vaultId) {
        passwords.push(password);
      }
    }
    return passwords;
  }

  // Security events
  async logSecurityEvent(eventData) {
    const eventId = 'event_' + Math.random().toString(36).substr(2, 9);
    const event = {
      id: eventId,
      ...eventData,
      timestamp: new Date()
    };

    this.storage.securityEvents.set(eventId, event);
    console.log('📝 Security event logged:', event.eventType);
    return event;
  }

  async getSecurityEvents(userId, limit = 100) {
    const events = [];
    for (const event of this.storage.securityEvents.values()) {
      if (event.userId === userId) {
        events.push(event);
      }
    }
    return events.slice(-limit);
  }

  // Vault sharing
  async shareVault(shareData) {
    const shareId = 'share_' + Math.random().toString(36).substr(2, 9);
    const share = {
      id: shareId,
      ...shareData,
      createdAt: new Date(),
      isActive: true
    };

    if (!this.storage.vaultShares.has(share.vaultId)) {
      this.storage.vaultShares.set(share.vaultId, []);
    }
    this.storage.vaultShares.get(share.vaultId).push(share);

    console.log('🤝 Vault shared with:', share.sharedWith);
    return share;
  }

  async getVaultShares(vaultId) {
    return this.storage.vaultShares.get(vaultId) || [];
  }

  // Session management
  async createSession(sessionData) {
    const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
    const session = {
      id: sessionId,
      ...sessionData,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    this.storage.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId) {
    return this.storage.sessions.get(sessionId);
  }

  async deleteSession(sessionId) {
    this.storage.sessions.delete(sessionId);
    return true;
  }

  // Database statistics
  getStats() {
    return {
      connectionStatus: this.isConnected ? 'connected' : 'disconnected',
      connectionTime: this.connectionTime,
      users: this.storage.users.size,
      vaults: this.storage.vaults.size,
      passwords: this.storage.passwords.size,
      notes: this.storage.notes.size,
      creditCards: this.storage.creditCards.size,
      securityEvents: this.storage.securityEvents.size,
      sessions: this.storage.sessions.size
    };
  }

  // Clear all data (for testing)
  async clearDatabase() {
    for (const store in this.storage) {
      this.storage[store].clear();
    }
    console.log('🧹 Database cleared');
    return true;
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.DatabaseService = DatabaseService;
}
