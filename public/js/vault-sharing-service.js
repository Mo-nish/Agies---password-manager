/**
 * Agies Vault Sharing Service
 * Handles secure vault sharing with granular permissions
 * Integrated with Chakravyuham security systems
 */

class AgiesVaultSharingService {
  constructor() {
    this.api = null;
    this.databaseService = null;
    this.encryptionService = null;
    this.isInitialized = false;

    this.initializeWhenReady();
  }

  async initializeWhenReady() {
    const maxAttempts = 20;
    let attempts = 0;

    const checkServices = () => {
      if (window.AgiesDatabaseService && window.AgiesZeroKnowledgeEncryption) {
        this.api = window.AgiesAPI || {};
        this.databaseService = new window.AgiesDatabaseService();
        this.encryptionService = new window.AgiesZeroKnowledgeEncryption();
        this.initializeService();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkServices, 200);
      } else {
        console.error('❌ Failed to initialize Vault Sharing Service - Required services not available');
      }
    };

    checkServices();
  }

  async initializeService() {
    console.log('🤝 Initializing Agies Vault Sharing Service...');
    this.isInitialized = true;
    console.log('✅ Vault Sharing Service initialized');
  }

  // ========================================
  // VAULT SHARING METHODS
  // ========================================

  async shareVault(vaultId, shareData) {
    if (!this.isInitialized) {
      throw new Error('Vault sharing service not initialized');
    }

    const { email, permissions, expiresAt, message } = shareData;

    // Validate input
    if (!email || !permissions || permissions.length === 0) {
      throw new Error('Email and permissions are required');
    }

    // Validate permissions
    const validPermissions = ['read', 'write', 'delete', 'share', 'admin'];
    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
    if (invalidPermissions.length > 0) {
      throw new Error(`Invalid permissions: ${invalidPermissions.join(', ')}`);
    }

    console.log('📤 Starting vault sharing process...');

    try {
      // Generate secure invitation token
      const invitationToken = this.generateInvitationToken();

      // Create sharing record
      const sharingRecord = {
        vaultId,
        ownerId: this.api.user.id,
        sharedWithEmail: email,
        permissionLevel: this.calculatePermissionLevel(permissions),
        permissions: permissions,
        expiresAt: expiresAt || null,
        invitationToken: invitationToken,
        invitationMessage: message || '',
        status: 'pending'
      };

      // Use database service to create sharing record
      if (this.databaseService) {
        const result = await this.databaseService.createSharingRecord(sharingRecord);

        // Send invitation email
        await this.sendVaultInvitation(vaultId, email, invitationToken, message);

        // Log security event
        await this.logSharingEvent('vault_shared', {
          vaultId,
          sharedWithEmail: email,
          permissions: permissions,
          shareId: result.shareId
        });

        console.log('✅ Vault sharing invitation sent successfully');
        return result;
      } else {
        throw new Error('Database service not available');
      }
    } catch (error) {
      console.error('Vault sharing error:', error);
      this.logSharingEvent('vault_sharing_failed', {
        vaultId,
        sharedWithEmail: email,
        error: error.message
      });
      throw error;
    }
  }

  async acceptVaultInvitation(invitationToken) {
    if (!this.isInitialized) {
      throw new Error('Vault sharing service not initialized');
    }

    try {
      console.log('📥 Accepting vault invitation...');

      // Find invitation by token
      const invitation = await this.getInvitationByToken(invitationToken);
      if (!invitation) {
        throw new Error('Invalid invitation token');
      }

      // Check if invitation has expired
      if (invitation.expiresAt && new Date() > new Date(invitation.expiresAt)) {
        throw new Error('Invitation has expired');
      }

      // Check if user can accept this invitation
      if (invitation.sharedWithEmail !== this.api.user.email) {
        throw new Error('This invitation is not for your email address');
      }

      // Update invitation status
      await this.updateInvitationStatus(invitationToken, 'accepted', this.api.user.id);

      // Add user to vault with specified permissions
      await this.addUserToVault(invitation.vaultId, this.api.user.id, invitation.permissions);

      // Log security event
      await this.logSharingEvent('vault_invitation_accepted', {
        vaultId: invitation.vaultId,
        userId: this.api.user.id,
        invitationToken: invitationToken
      });

      console.log('✅ Vault invitation accepted successfully');
      return { success: true, vaultId: invitation.vaultId };
    } catch (error) {
      console.error('Accept invitation error:', error);
      throw error;
    }
  }

  async revokeVaultAccess(vaultId, userId) {
    if (!this.isInitialized) {
      throw new Error('Vault sharing service not initialized');
    }

    try {
      console.log('🚫 Revoking vault access...');

      // Remove user from vault
      await this.removeUserFromVault(vaultId, userId);

      // Update any active invitations
      await this.updateInvitationStatusByEmail(vaultId, userId, 'revoked');

      // Log security event
      await this.logSharingEvent('vault_access_revoked', {
        vaultId,
        userId: userId
      });

      console.log('✅ Vault access revoked successfully');
      return { success: true };
    } catch (error) {
      console.error('Revoke access error:', error);
      throw error;
    }
  }

  async updateVaultPermissions(vaultId, userId, newPermissions) {
    if (!this.isInitialized) {
      throw new Error('Vault sharing service not initialized');
    }

    try {
      console.log('🔄 Updating vault permissions...');

      // Validate permissions
      const validPermissions = ['read', 'write', 'delete', 'share', 'admin'];
      const invalidPermissions = newPermissions.filter(p => !validPermissions.includes(p));
      if (invalidPermissions.length > 0) {
        throw new Error(`Invalid permissions: ${invalidPermissions.join(', ')}`);
      }

      // Update user permissions for vault
      await this.updateUserPermissions(vaultId, userId, newPermissions);

      // Log security event
      await this.logSharingEvent('vault_permissions_updated', {
        vaultId,
        userId: userId,
        newPermissions: newPermissions
      });

      console.log('✅ Vault permissions updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update permissions error:', error);
      throw error;
    }
  }

  // ========================================
  // SHARING MANAGEMENT METHODS
  // ========================================

  async getVaultShares(vaultId) {
    if (!this.isInitialized) {
      throw new Error('Vault sharing service not initialized');
    }

    try {
      if (this.databaseService) {
        const shares = await this.databaseService.getVaultShares(vaultId);
        return shares;
      } else {
        throw new Error('Database service not available');
      }
    } catch (error) {
      console.error('Get vault shares error:', error);
      throw error;
    }
  }

  async getUserSharedVaults(userId) {
    if (!this.isInitialized) {
      throw new Error('Vault sharing service not initialized');
    }

    try {
      if (this.databaseService) {
        const vaults = await this.databaseService.getUserSharedVaults(userId);
        return vaults;
      } else {
        throw new Error('Database service not available');
      }
    } catch (error) {
      console.error('Get shared vaults error:', error);
      throw error;
    }
  }

  async getPendingInvitations(vaultId) {
    if (!this.isInitialized) {
      throw new Error('Vault sharing service not initialized');
    }

    try {
      if (this.databaseService) {
        const invitations = await this.databaseService.getPendingInvitations(vaultId);
        return invitations;
      } else {
        throw new Error('Database service not available');
      }
    } catch (error) {
      console.error('Get pending invitations error:', error);
      throw error;
    }
  }

  // ========================================
  // PERMISSION CHECKING METHODS
  // ========================================

  async checkUserPermission(vaultId, userId, permission) {
    if (!this.isInitialized) {
      return false;
    }

    try {
      const userPermissions = await this.getUserPermissions(vaultId, userId);
      return userPermissions.includes(permission);
    } catch (error) {
      console.error('Check permission error:', error);
      return false;
    }
  }

  async getUserPermissions(vaultId, userId) {
    if (!this.isInitialized) {
      return [];
    }

    try {
      if (this.databaseService) {
        const permissions = await this.databaseService.getUserPermissions(vaultId, userId);
        return permissions;
      }
      return [];
    } catch (error) {
      console.error('Get user permissions error:', error);
      return [];
    }
  }

  async canUserAccessVault(vaultId, userId) {
    if (!this.isInitialized) {
      return false;
    }

    try {
      // Check if user is owner
      const vault = await this.databaseService.getVaultById(vaultId);
      if (vault.userId === userId) {
        return true;
      }

      // Check if user has any permissions for this vault
      const permissions = await this.getUserPermissions(vaultId, userId);
      return permissions.length > 0;
    } catch (error) {
      console.error('Can access vault error:', error);
      return false;
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  generateInvitationToken() {
    return 'share_' + crypto.randomUUID() + '_' + Date.now();
  }

  calculatePermissionLevel(permissions) {
    if (permissions.includes('admin')) return 'admin';
    if (permissions.includes('write') || permissions.includes('delete')) return 'write';
    if (permissions.includes('share')) return 'share';
    return 'read';
  }

  // ========================================
  // DATABASE INTEGRATION METHODS
  // ========================================

  async createSharingRecord(record) {
    if (!this.databaseService) {
      throw new Error('Database service not available');
    }

    // This would call the database service method
    // For now, we'll simulate the API call
    const response = await fetch('/api/vaults/' + record.vaultId + '/shares', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.api.token}`
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      throw new Error(`Create sharing record failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async getInvitationByToken(token) {
    if (!this.databaseService) {
      throw new Error('Database service not available');
    }

    const response = await fetch('/api/invitations/' + token, {
      headers: {
        'Authorization': `Bearer ${this.api.token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Get invitation failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateInvitationStatus(token, status, userId = null) {
    const response = await fetch('/api/invitations/' + token + '/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.api.token}`
      },
      body: JSON.stringify({ status, userId })
    });

    if (!response.ok) {
      throw new Error(`Update invitation status failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async addUserToVault(vaultId, userId, permissions) {
    const response = await fetch('/api/vaults/' + vaultId + '/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.api.token}`
      },
      body: JSON.stringify({ userId, permissions })
    });

    if (!response.ok) {
      throw new Error(`Add user to vault failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async removeUserFromVault(vaultId, userId) {
    const response = await fetch('/api/vaults/' + vaultId + '/users/' + userId, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.api.token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Remove user from vault failed: ${response.statusText}`);
    }

    return { success: true };
  }

  async updateUserPermissions(vaultId, userId, permissions) {
    const response = await fetch('/api/vaults/' + vaultId + '/users/' + userId + '/permissions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.api.token}`
      },
      body: JSON.stringify({ permissions })
    });

    if (!response.ok) {
      throw new Error(`Update user permissions failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // ========================================
  // COMMUNICATION METHODS
  // ========================================

  async sendVaultInvitation(vaultId, email, invitationToken, message = '') {
    try {
      // Get vault information
      const vault = await this.databaseService.getVaultById(vaultId);

      // Send invitation email via backend API
      const response = await fetch('/api/vaults/' + vaultId + '/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.api.token}`
        },
        body: JSON.stringify({
          email,
          invitationToken,
          message,
          vaultName: vault.name
        })
      });

      if (!response.ok) {
        console.warn('Failed to send invitation email:', response.statusText);
      }
    } catch (error) {
      console.warn('Send invitation email error:', error);
    }
  }

  // ========================================
  // SECURITY EVENT LOGGING
  // ========================================

  async logSharingEvent(eventType, metadata) {
    try {
      if (this.api && this.api.emit) {
        this.api.emit('security_event', {
          eventType,
          severity: 'info',
          description: `Vault sharing event: ${eventType}`,
          metadata: {
            ...metadata,
            userId: this.api.user?.id
          }
        });
      }
    } catch (error) {
      console.warn('Failed to log sharing event:', error);
    }
  }

  // ========================================
  // PUBLIC API METHODS
  // ========================================

  async getSharingStats(vaultId) {
    try {
      const shares = await this.getVaultShares(vaultId);
      const pending = await this.getPendingInvitations(vaultId);

      return {
        totalShares: shares.length,
        pendingInvitations: pending.length,
        activeShares: shares.filter(s => s.isActive).length
      };
    } catch (error) {
      console.error('Get sharing stats error:', error);
      return { totalShares: 0, pendingInvitations: 0, activeShares: 0 };
    }
  }

  async getUserSharingSummary(userId) {
    try {
      const ownedVaults = await this.databaseService.getUserVaults(userId);
      const sharedVaults = await this.getUserSharedVaults(userId);

      let totalShares = 0;
      for (const vault of ownedVaults) {
        const stats = await this.getSharingStats(vault.id);
        totalShares += stats.totalShares;
      }

      return {
        ownedVaultsCount: ownedVaults.length,
        sharedVaultsCount: sharedVaults.length,
        totalShares
      };
    } catch (error) {
      console.error('Get user sharing summary error:', error);
      return { ownedVaultsCount: 0, sharedVaultsCount: 0, totalShares: 0 };
    }
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.AgiesVaultSharingService = AgiesVaultSharingService;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
      window.agiesVaultSharing = new AgiesVaultSharingService();
    }
  });
}
