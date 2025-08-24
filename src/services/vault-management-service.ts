import { EventEmitter } from 'events';
import * as crypto from 'crypto';

/**
 * Agies Vault Management Service
 * Handles vault creation, sharing, and icon management
 */
export class VaultManagementService extends EventEmitter {
  private vaults: Map<string, Vault> = new Map();
  private vaultShares: Map<string, VaultShare[]> = new Map();
  private vaultIcons: Map<string, IconData> = new Map();
  private userVaults: Map<string, string[]> = new Map();

  constructor() {
    super();
    this.initializeDefaultIcons();
    console.log('🗂️ Vault Management Service initialized');
  }

  // === VAULT CREATION AND MANAGEMENT ===

  public async createVault(
    userId: string,
    vaultData: {
      name: string;
      description?: string;
      category: 'personal' | 'work' | 'family' | 'shared' | 'business';
      iconId?: string;
      color?: string;
      securityLevel: 'basic' | 'advanced' | 'maximum';
    }
  ): Promise<{
    success: boolean;
    vaultId?: string;
    reason?: string;
  }> {
    try {
      const vaultId = crypto.randomUUID();

      // Generate default icon if not provided
      const iconId = vaultData.iconId || this.getDefaultIconForCategory(vaultData.category);

      const vault: Vault = {
        id: vaultId,
        name: vaultData.name,
        description: vaultData.description || '',
        category: vaultData.category,
        iconId,
        color: vaultData.color || this.getDefaultColorForCategory(vaultData.category),
        securityLevel: vaultData.securityLevel,
        ownerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isShared: false,
        shareCount: 0,
        passwordCount: 0,
        noteCount: 0,
        creditCardCount: 0,
        totalItems: 0,
        lastAccessed: new Date(),
        accessCount: 0
      };

      this.vaults.set(vaultId, vault);

      // Add to user's vaults
      const userVaults = this.userVaults.get(userId) || [];
      userVaults.push(vaultId);
      this.userVaults.set(userId, userVaults);

      this.emit('vault_created', {
        vaultId,
        userId,
        category: vaultData.category,
        timestamp: new Date()
      });

      return {
        success: true,
        vaultId
      };

    } catch (error) {
      console.error('Error creating vault:', error);
      return {
        success: false,
        reason: 'Failed to create vault'
      };
    }
  }

  public async updateVault(
    vaultId: string,
    userId: string,
    updates: Partial<{
      name: string;
      description: string;
      category: string;
      iconId: string;
      color: string;
      securityLevel: string;
    }>
  ): Promise<{
    success: boolean;
    reason?: string;
  }> {
    const vault = this.vaults.get(vaultId);

    if (!vault) {
      return {
        success: false,
        reason: 'Vault not found'
      };
    }

    if (vault.ownerId !== userId) {
      return {
        success: false,
        reason: 'Unauthorized to update vault'
      };
    }

    // Update vault
    const updatedVault = {
      ...vault,
      ...updates,
      updatedAt: new Date()
    };

    this.vaults.set(vaultId, updatedVault);

    this.emit('vault_updated', {
      vaultId,
      userId,
      updates,
      timestamp: new Date()
    });

    return {
      success: true
    };
  }

  public async deleteVault(
    vaultId: string,
    userId: string
  ): Promise<{
    success: boolean;
    reason?: string;
  }> {
    const vault = this.vaults.get(vaultId);

    if (!vault) {
      return {
        success: false,
        reason: 'Vault not found'
      };
    }

    if (vault.ownerId !== userId) {
      return {
        success: false,
        reason: 'Unauthorized to delete vault'
      };
    }

    // Remove vault
    this.vaults.delete(vaultId);

    // Remove from user's vaults
    const userVaults = this.userVaults.get(userId) || [];
    const filteredVaults = userVaults.filter(id => id !== vaultId);
    this.userVaults.set(userId, filteredVaults);

    // Remove vault shares
    this.vaultShares.delete(vaultId);

    this.emit('vault_deleted', {
      vaultId,
      userId,
      timestamp: new Date()
    });

    return {
      success: true
    };
  }

  // === ICON MANAGEMENT ===

  private initializeDefaultIcons(): void {
    const defaultIcons: IconData[] = [
      // Personal icons
      { id: 'icon_personal_1', name: 'User', category: 'personal', iconType: 'svg', data: this.getUserIconSVG() },
      { id: 'icon_personal_2', name: 'Home', category: 'personal', iconType: 'svg', data: this.getHomeIconSVG() },
      { id: 'icon_personal_3', name: 'Heart', category: 'personal', iconType: 'svg', data: this.getHeartIconSVG() },

      // Work icons
      { id: 'icon_work_1', name: 'Briefcase', category: 'work', iconType: 'svg', data: this.getBriefcaseIconSVG() },
      { id: 'icon_work_2', name: 'Office', category: 'work', iconType: 'svg', data: this.getOfficeIconSVG() },
      { id: 'icon_work_3', name: 'Computer', category: 'work', iconType: 'svg', data: this.getComputerIconSVG() },

      // Family icons
      { id: 'icon_family_1', name: 'Family', category: 'family', iconType: 'svg', data: this.getFamilyIconSVG() },
      { id: 'icon_family_2', name: 'Children', category: 'family', iconType: 'svg', data: this.getChildrenIconSVG() },
      { id: 'icon_family_3', name: 'Tree', category: 'family', iconType: 'svg', data: this.getTreeIconSVG() },

      // Shared icons
      { id: 'icon_shared_1', name: 'Group', category: 'shared', iconType: 'svg', data: this.getGroupIconSVG() },
      { id: 'icon_shared_2', name: 'Network', category: 'shared', iconType: 'svg', data: this.getNetworkIconSVG() },
      { id: 'icon_shared_3', name: 'Share', category: 'shared', iconType: 'svg', data: this.getShareIconSVG() },

      // Business icons
      { id: 'icon_business_1', name: 'Building', category: 'business', iconType: 'svg', data: this.getBuildingIconSVG() },
      { id: 'icon_business_2', name: 'Money', category: 'business', iconType: 'svg', data: this.getMoneyIconSVG() },
      { id: 'icon_business_3', name: 'Chart', category: 'business', iconType: 'svg', data: this.getChartIconSVG() }
    ];

    defaultIcons.forEach(icon => {
      this.vaultIcons.set(icon.id, icon);
    });
  }

  public getAvailableIcons(category?: string): IconData[] {
    const icons = Array.from(this.vaultIcons.values());

    if (category) {
      return icons.filter(icon => icon.category === category);
    }

    return icons;
  }

  public getIcon(iconId: string): IconData | null {
    return this.vaultIcons.get(iconId) || null;
  }

  public async uploadCustomIcon(
    userId: string,
    iconData: {
      name: string;
      category: 'personal' | 'work' | 'family' | 'shared' | 'business';
      data: string; // Base64 encoded image
      iconType: 'png' | 'jpg' | 'svg';
    }
  ): Promise<{
    success: boolean;
    iconId?: string;
    reason?: string;
  }> {
    try {
      const iconId = `custom_${userId}_${Date.now()}`;

      const customIcon: IconData = {
        id: iconId,
        name: iconData.name,
        category: iconData.category,
        iconType: iconData.iconType,
        data: iconData.data,
        isCustom: true,
        uploadedBy: userId,
        uploadedAt: new Date()
      };

      this.vaultIcons.set(iconId, customIcon);

      this.emit('custom_icon_uploaded', {
        iconId,
        userId,
        category: iconData.category,
        timestamp: new Date()
      });

      return {
        success: true,
        iconId
      };

    } catch (error) {
      console.error('Error uploading custom icon:', error);
      return {
        success: false,
        reason: 'Failed to upload custom icon'
      };
    }
  }

  private getDefaultIconForCategory(category: string): string {
    const defaultIcons = {
      'personal': 'icon_personal_1',
      'work': 'icon_work_1',
      'family': 'icon_family_1',
      'shared': 'icon_shared_1',
      'business': 'icon_business_1'
    };

    return defaultIcons[category] || 'icon_personal_1';
  }

  private getDefaultColorForCategory(category: string): string {
    const defaultColors = {
      'personal': '#3B82F6', // Blue
      'work': '#10B981',     // Green
      'family': '#F59E0B',   // Yellow
      'shared': '#8B5CF6',   // Purple
      'business': '#EF4444'  // Red
    };

    return defaultColors[category] || '#6B7280'; // Gray default
  }

  // === VAULT SHARING ===

  public async shareVault(
    vaultId: string,
    ownerId: string,
    shareData: {
      shareWithUserId: string;
      shareWithEmail: string;
      permissions: VaultPermission[];
      expiresAt?: Date;
      message?: string;
    }
  ): Promise<{
    success: boolean;
    shareId?: string;
    reason?: string;
  }> {
    const vault = this.vaults.get(vaultId);

    if (!vault) {
      return {
        success: false,
        reason: 'Vault not found'
      };
    }

    if (vault.ownerId !== ownerId) {
      return {
        success: false,
        reason: 'Unauthorized to share vault'
      };
    }

    try {
      const shareId = crypto.randomUUID();
      const share: VaultShare = {
        id: shareId,
        vaultId,
        sharedBy: ownerId,
        sharedWith: shareData.shareWithUserId,
        sharedWithEmail: shareData.shareWithEmail,
        permissions: shareData.permissions,
        status: 'pending',
        expiresAt: shareData.expiresAt,
        message: shareData.message,
        createdAt: new Date(),
        acceptedAt: undefined,
        lastAccessed: undefined,
        accessCount: 0
      };

      // Add to vault shares
      const vaultShares = this.vaultShares.get(vaultId) || [];
      vaultShares.push(share);
      this.vaultShares.set(vaultId, vaultShares);

      // Update vault share count
      vault.isShared = true;
      vault.shareCount = vaultShares.length;
      this.vaults.set(vaultId, vault);

      this.emit('vault_shared', {
        shareId,
        vaultId,
        ownerId,
        sharedWith: shareData.shareWithUserId,
        timestamp: new Date()
      });

      return {
        success: true,
        shareId
      };

    } catch (error) {
      console.error('Error sharing vault:', error);
      return {
        success: false,
        reason: 'Failed to share vault'
      };
    }
  }

  public async acceptVaultShare(
    shareId: string,
    userId: string
  ): Promise<{
    success: boolean;
    vaultId?: string;
    reason?: string;
  }> {
    // Find the share
    let foundShare: VaultShare | null = null;
    let vaultId: string | null = null;

    for (const [vaultIdKey, shares] of this.vaultShares.entries()) {
      const share = shares.find(s => s.id === shareId);
      if (share) {
        foundShare = share;
        vaultId = vaultIdKey;
        break;
      }
    }

    if (!foundShare || !vaultId) {
      return {
        success: false,
        reason: 'Share not found'
      };
    }

    if (foundShare.sharedWith !== userId) {
      return {
        success: false,
        reason: 'Unauthorized to accept this share'
      };
    }

    if (foundShare.status !== 'pending') {
      return {
        success: false,
        reason: 'Share already processed'
      };
    }

    // Check expiration
    if (foundShare.expiresAt && foundShare.expiresAt < new Date()) {
      foundShare.status = 'expired';
      return {
        success: false,
        reason: 'Share has expired'
      };
    }

    // Accept the share
    foundShare.status = 'accepted';
    foundShare.acceptedAt = new Date();

    // Update vault shares
    const vaultShares = this.vaultShares.get(vaultId)!;
    const shareIndex = vaultShares.findIndex(s => s.id === shareId);
    vaultShares[shareIndex] = foundShare;
    this.vaultShares.set(vaultId, vaultShares);

    // Add to user's vaults
    const userVaults = this.userVaults.get(userId) || [];
    if (!userVaults.includes(vaultId)) {
      userVaults.push(vaultId);
      this.userVaults.set(userId, userVaults);
    }

    this.emit('vault_share_accepted', {
      shareId,
      vaultId,
      userId,
      timestamp: new Date()
    });

    return {
      success: true,
      vaultId
    };
  }

  public async revokeVaultShare(
    shareId: string,
    ownerId: string
  ): Promise<{
    success: boolean;
    reason?: string;
  }> {
    // Find the share
    let foundShare: VaultShare | null = null;
    let vaultId: string | null = null;

    for (const [vaultIdKey, shares] of this.vaultShares.entries()) {
      const share = shares.find(s => s.id === shareId);
      if (share) {
        foundShare = share;
        vaultId = vaultIdKey;
        break;
      }
    }

    if (!foundShare || !vaultId) {
      return {
        success: false,
        reason: 'Share not found'
      };
    }

    // Check ownership
    const vault = this.vaults.get(vaultId);
    if (!vault || vault.ownerId !== ownerId) {
      return {
        success: false,
        reason: 'Unauthorized to revoke share'
      };
    }

    // Remove the share
    const vaultShares = this.vaultShares.get(vaultId)!;
    const filteredShares = vaultShares.filter(s => s.id !== shareId);
    this.vaultShares.set(vaultId, filteredShares);

    // Remove from shared user's vaults if accepted
    if (foundShare.status === 'accepted') {
      const sharedUserVaults = this.userVaults.get(foundShare.sharedWith) || [];
      const filteredUserVaults = sharedUserVaults.filter(id => id !== vaultId);
      this.userVaults.set(foundShare.sharedWith, filteredUserVaults);
    }

    // Update vault share count
    vault.shareCount = filteredShares.length;
    vault.isShared = filteredShares.length > 0;
    this.vaults.set(vaultId, vault);

    this.emit('vault_share_revoked', {
      shareId,
      vaultId,
      ownerId,
      timestamp: new Date()
    });

    return {
      success: true
    };
  }

  // === UTILITY METHODS ===

  public getUserVaults(userId: string): Vault[] {
    const userVaultIds = this.userVaults.get(userId) || [];
    return userVaultIds.map(vaultId => this.vaults.get(vaultId)!).filter(Boolean);
  }

  public getVaultShares(vaultId: string, ownerId?: string): VaultShare[] {
    const vault = this.vaults.get(vaultId);

    if (ownerId && vault && vault.ownerId !== ownerId) {
      return [];
    }

    return this.vaultShares.get(vaultId) || [];
  }

  public getVault(vaultId: string, userId?: string): Vault | null {
    const vault = this.vaults.get(vaultId);

    if (!vault) return null;

    // Check if user has access
    if (userId) {
      const userVaults = this.userVaults.get(userId) || [];
      if (!userVaults.includes(vaultId)) {
        return null;
      }
    }

    return vault;
  }

  public updateVaultStats(vaultId: string, stats: {
    passwordCount?: number;
    noteCount?: number;
    creditCardCount?: number;
  }): void {
    const vault = this.vaults.get(vaultId);
    if (vault) {
      if (stats.passwordCount !== undefined) vault.passwordCount = stats.passwordCount;
      if (stats.noteCount !== undefined) vault.noteCount = stats.noteCount;
      if (stats.creditCardCount !== undefined) vault.creditCardCount = stats.creditCardCount;

      vault.totalItems = vault.passwordCount + vault.noteCount + vault.creditCardCount;
      vault.updatedAt = new Date();

      this.vaults.set(vaultId, vault);
    }
  }

  public recordVaultAccess(vaultId: string, userId: string): void {
    const vault = this.vaults.get(vaultId);
    if (vault) {
      vault.lastAccessed = new Date();
      vault.accessCount++;
      this.vaults.set(vaultId, vault);

      this.emit('vault_accessed', {
        vaultId,
        userId,
        timestamp: new Date()
      });
    }
  }

  // === SVG ICON DATA ===

  private getUserIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
  }

  private getHomeIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;
  }

  private getHeartIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  }

  private getBriefcaseIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0V4h-4v2h4z"/></svg>`;
  }

  private getOfficeIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z"/></svg>`;
  }

  private getComputerIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4zm0 3h16v2H4z"/></svg>`;
  }

  private getFamilyIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.016 3.016 0 0 0 17.07 7c-.83 0-1.59.41-2.07 1.08L12 12.5 9.07 8.08C8.59 7.41 7.83 7 7 7c-1.18 0-2.25.69-2.73 1.73L2.5 16H5v6h14zM5.5 6c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm9 8h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2z"/></svg>`;
  }

  private getChildrenIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z"/></svg>`;
  }

  private getTreeIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L13.09 8.26L22 9.27L17.77 13.14L19.18 21.02L12 16.77L4.82 21.02L6.23 13.14L2 9.27L10.91 8.26L12 2Z"/></svg>`;
  }

  private getGroupIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.016 3.016 0 0 0 17.07 7c-.83 0-1.59.41-2.07 1.08L12 12.5 9.07 8.08C8.59 7.41 7.83 7 7 7c-1.18 0-2.25.69-2.73 1.73L2.5 16H5v6h14z"/></svg>`;
  }

  private getNetworkIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
  }

  private getShareIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>`;
  }

  private getBuildingIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z"/></svg>`;
  }

  private getMoneyIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
  }

  private getChartIconSVG(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>`;
  }

  public destroy(): void {
    this.removeAllListeners();
    this.vaults.clear();
    this.vaultShares.clear();
    this.vaultIcons.clear();
    this.userVaults.clear();
    console.log('🗂️ Vault Management Service shut down');
  }
}

// === TYPE DEFINITIONS ===

interface Vault {
  id: string;
  name: string;
  description: string;
  category: 'personal' | 'work' | 'family' | 'shared' | 'business';
  iconId: string;
  color: string;
  securityLevel: 'basic' | 'advanced' | 'maximum';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;
  shareCount: number;
  passwordCount: number;
  noteCount: number;
  creditCardCount: number;
  totalItems: number;
  lastAccessed: Date;
  accessCount: number;
}

interface IconData {
  id: string;
  name: string;
  category: 'personal' | 'work' | 'family' | 'shared' | 'business';
  iconType: 'svg' | 'png' | 'jpg';
  data: string;
  isCustom?: boolean;
  uploadedBy?: string;
  uploadedAt?: Date;
}

interface VaultShare {
  id: string;
  vaultId: string;
  sharedBy: string;
  sharedWith: string;
  sharedWithEmail: string;
  permissions: VaultPermission[];
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'revoked';
  expiresAt?: Date;
  message?: string;
  createdAt: Date;
  acceptedAt?: Date;
  lastAccessed?: Date;
  accessCount: number;
}

type VaultPermission = 'read' | 'write' | 'delete' | 'share' | 'admin';
