/**
 * Browser-compatible Vault Management Service
 * Simplified version for frontend use
 */

class VaultManagementService {
  constructor() {
    this.vaults = new Map();
    this.vaultShares = new Map();
    this.vaultIcons = new Map();
    this.defaultIcons = [
      { id: 'personal', emoji: '👤', category: 'personal', name: 'Personal' },
      { id: 'work', emoji: '💼', category: 'work', name: 'Work' },
      { id: 'family', emoji: '👨‍👩‍👧‍👦', category: 'family', name: 'Family' },
      { id: 'shared', emoji: '🤝', category: 'shared', name: 'Shared' },
      { id: 'business', emoji: '🏢', category: 'business', name: 'Business' },
      { id: 'security', emoji: '🛡️', category: 'security', name: 'Security' },
      { id: 'finance', emoji: '💰', category: 'finance', name: 'Finance' },
      { id: 'social', emoji: '📱', category: 'social', name: 'Social' },
      { id: 'entertainment', emoji: '🎮', category: 'entertainment', name: 'Entertainment' },
      { id: 'travel', emoji: '✈️', category: 'travel', name: 'Travel' }
    ];
  }

  createVault(vaultData) {
    const vaultId = 'vault_' + Math.random().toString(36).substr(2, 9);
    const vault = {
      id: vaultId,
      name: vaultData.name,
      description: vaultData.description || '',
      category: vaultData.category,
      iconId: vaultData.iconId,
      securityLevel: vaultData.securityLevel || 'standard',
      ownerId: 'current_user', // In real app, get from auth
      createdAt: new Date(),
      updatedAt: new Date(),
      isShared: false,
      totalItems: 0,
      lastAccessed: new Date(),
      accessCount: 0,
      color: vaultData.color || '#6366f1'
    };

    this.vaults.set(vaultId, vault);
    console.log('🏗️ Vault created:', vault.name);
    return vault;
  }

  updateVault(vaultId, updates) {
    const vault = this.vaults.get(vaultId);
    if (!vault) {
      throw new Error('Vault not found');
    }

    const updatedVault = {
      ...vault,
      ...updates,
      updatedAt: new Date()
    };

    this.vaults.set(vaultId, updatedVault);
    console.log('📝 Vault updated:', updatedVault.name);
    return updatedVault;
  }

  deleteVault(vaultId) {
    const vault = this.vaults.get(vaultId);
    if (!vault) {
      throw new Error('Vault not found');
    }

    // Remove all shares for this vault
    this.vaultShares.delete(vaultId);

    // Remove the vault
    this.vaults.delete(vaultId);
    console.log('🗑️ Vault deleted:', vault.name);
    return true;
  }

  getVault(vaultId) {
    return this.vaults.get(vaultId);
  }

  getAllVaults() {
    return Array.from(this.vaults.values());
  }

  shareVault(vaultId, shareData) {
    const vault = this.vaults.get(vaultId);
    if (!vault) {
      throw new Error('Vault not found');
    }

    const shareId = 'share_' + Math.random().toString(36).substr(2, 9);
    const share = {
      id: shareId,
      vaultId: vaultId,
      sharedBy: 'current_user', // In real app, get from auth
      sharedWith: shareData.email,
      permissions: shareData.permissions || ['read'],
      expiresAt: shareData.expiresAt,
      createdAt: new Date(),
      lastAccessed: null,
      accessCount: 0,
      isActive: true,
      message: shareData.message || ''
    };

    // Store share
    if (!this.vaultShares.has(vaultId)) {
      this.vaultShares.set(vaultId, []);
    }
    this.vaultShares.get(vaultId).push(share);

    // Mark vault as shared
    vault.isShared = true;
    this.vaults.set(vaultId, vault);

    console.log('🤝 Vault shared with:', shareData.email);
    return share;
  }

  getVaultShares(vaultId) {
    return this.vaultShares.get(vaultId) || [];
  }

  revokeShare(vaultId, shareId) {
    const shares = this.vaultShares.get(vaultId);
    if (!shares) return false;

    const shareIndex = shares.findIndex(share => share.id === shareId);
    if (shareIndex === -1) return false;

    shares.splice(shareIndex, 1);
    console.log('🚫 Share revoked:', shareId);
    return true;
  }

  getAvailableIcons() {
    return this.defaultIcons;
  }

  getIconById(iconId) {
    return this.defaultIcons.find(icon => icon.id === iconId);
  }

  uploadCustomIcon(file) {
    // Simulate icon upload
    const iconId = 'custom_' + Math.random().toString(36).substr(2, 9);
    const customIcon = {
      id: iconId,
      emoji: '📁', // Default emoji for custom icons
      category: 'custom',
      name: file.name,
      isCustom: true,
      uploadDate: new Date()
    };

    this.defaultIcons.push(customIcon);
    console.log('📤 Custom icon uploaded:', file.name);
    return customIcon;
  }

  getVaultStatistics() {
    const totalVaults = this.vaults.size;
    const sharedVaults = Array.from(this.vaults.values()).filter(v => v.isShared).length;
    const totalShares = Array.from(this.vaultShares.values()).reduce((sum, shares) => sum + shares.length, 0);

    return {
      totalVaults,
      sharedVaults,
      totalShares,
      categories: this.getVaultCategories()
    };
  }

  getVaultCategories() {
    const categories = {};
    this.vaults.forEach(vault => {
      categories[vault.category] = (categories[vault.category] || 0) + 1;
    });
    return categories;
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.VaultManagementService = VaultManagementService;
}
