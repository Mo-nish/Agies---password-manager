/**
 * Team Management System for Business Plan
 * Provides user roles, permissions, admin controls, and team collaboration features
 */

class TeamManagement {
    constructor() {
        this.isInitialized = false;
        this.teamMembers = new Map();
        this.roles = new Map();
        this.permissions = new Map();
        this.invitations = new Map();
        this.teamActivity = [];
        this.init();
    }

    async init() {
        try {
            await this.initializeRoles();
            await this.initializePermissions();
            await this.loadTeamMembers();
            await this.loadTeamActivity();
            this.isInitialized = true;
            console.log('✅ Team Management initialized successfully');
        } catch (error) {
            console.error('❌ Team Management initialization failed:', error);
        }
    }

    // Initialize user roles
    async initializeRoles() {
        try {
            this.roles.set('owner', {
                name: 'Owner',
                description: 'Full system access and control',
                level: 100,
                permissions: ['*'],
                canManageRoles: true,
                canInviteUsers: true,
                canDeleteUsers: true,
                canManageBilling: true
            });

            this.roles.set('admin', {
                name: 'Administrator',
                description: 'System administration and user management',
                level: 80,
                permissions: ['user_management', 'vault_management', 'security_management', 'reports_access'],
                canManageRoles: true,
                canInviteUsers: true,
                canDeleteUsers: true,
                canManageBilling: false
            });

            this.roles.set('manager', {
                name: 'Manager',
                description: 'Team and vault management',
                level: 60,
                permissions: ['vault_management', 'user_management', 'reports_access'],
                canManageRoles: false,
                canInviteUsers: true,
                canDeleteUsers: false,
                canManageBilling: false
            });

            this.roles.set('user', {
                name: 'User',
                description: 'Standard user access',
                level: 40,
                permissions: ['vault_access', 'password_management'],
                canManageRoles: false,
                canInviteUsers: false,
                canDeleteUsers: false,
                canManageBilling: false
            });

            this.roles.set('viewer', {
                name: 'Viewer',
                description: 'Read-only access',
                level: 20,
                permissions: ['vault_read'],
                canManageRoles: false,
                canInviteUsers: false,
                canDeleteUsers: false,
                canManageBilling: false
            });

            console.log('✅ User roles initialized');
        } catch (error) {
            console.error('❌ Failed to initialize user roles:', error);
        }
    }

    // Initialize permissions
    async initializePermissions() {
        try {
            // System permissions
            this.permissions.set('system_admin', {
                name: 'System Administration',
                description: 'Full system control',
                category: 'system',
                level: 100
            });

            this.permissions.set('user_management', {
                name: 'User Management',
                description: 'Create, edit, and delete users',
                category: 'users',
                level: 80
            });

            this.permissions.set('role_management', {
                name: 'Role Management',
                description: 'Create and modify user roles',
                category: 'users',
                level: 90
            });

            // Vault permissions
            this.permissions.set('vault_management', {
                name: 'Vault Management',
                description: 'Create, edit, and delete vaults',
                category: 'vaults',
                level: 70
            });

            this.permissions.set('vault_access', {
                name: 'Vault Access',
                description: 'Access assigned vaults',
                category: 'vaults',
                level: 40
            });

            this.permissions.set('vault_sharing', {
                name: 'Vault Sharing',
                description: 'Share vaults with others',
                category: 'vaults',
                level: 50
            });

            // Security permissions
            this.permissions.set('security_management', {
                name: 'Security Management',
                description: 'Configure security settings',
                category: 'security',
                level: 80
            });

            this.permissions.set('audit_access', {
                name: 'Audit Access',
                description: 'View audit logs',
                category: 'security',
                level: 60
            });

            // Reporting permissions
            this.permissions.set('reports_access', {
                name: 'Reports Access',
                description: 'Generate and view reports',
                category: 'reports',
                level: 50
            });

            this.permissions.set('analytics_access', {
                name: 'Analytics Access',
                description: 'View analytics and metrics',
                category: 'reports',
                level: 40
            });

            // API permissions
            this.permissions.set('api_access', {
                name: 'API Access',
                description: 'Use REST API endpoints',
                category: 'api',
                level: 60
            });

            console.log('✅ Permissions initialized');
        } catch (error) {
            console.error('❌ Failed to initialize permissions:', error);
        }
    }

    // Load team members
    async loadTeamMembers() {
        try {
            const mockMembers = [
                {
                    id: 'member_001',
                    email: 'ceo@company.com',
                    name: 'John CEO',
                    role: 'owner',
                    status: 'active',
                    joinedAt: '2023-01-01T00:00:00Z',
                    lastActive: '2024-01-20T15:00:00Z',
                    vaults: ['vault_1', 'vault_2'],
                    permissions: ['*'],
                    twoFactorEnabled: true,
                    ipWhitelist: ['192.168.1.0/24']
                },
                {
                    id: 'member_002',
                    email: 'admin@company.com',
                    name: 'Sarah Admin',
                    role: 'admin',
                    status: 'active',
                    joinedAt: '2023-02-01T00:00:00Z',
                    lastActive: '2024-01-20T14:30:00Z',
                    vaults: ['vault_1', 'vault_2'],
                    permissions: ['user_management', 'vault_management', 'security_management'],
                    twoFactorEnabled: true,
                    ipWhitelist: ['192.168.1.0/24']
                },
                {
                    id: 'member_003',
                    email: 'manager@company.com',
                    name: 'Mike Manager',
                    role: 'manager',
                    status: 'active',
                    joinedAt: '2023-03-01T00:00:00Z',
                    lastActive: '2024-01-20T14:00:00Z',
                    vaults: ['vault_2'],
                    permissions: ['vault_management', 'user_management'],
                    twoFactorEnabled: true,
                    ipWhitelist: []
                },
                {
                    id: 'member_004',
                    email: 'user@company.com',
                    name: 'Alice User',
                    role: 'user',
                    status: 'active',
                    joinedAt: '2023-04-01T00:00:00Z',
                    lastActive: '2024-01-20T13:30:00Z',
                    vaults: ['vault_2'],
                    permissions: ['vault_access', 'password_management'],
                    twoFactorEnabled: false,
                    ipWhitelist: []
                },
                {
                    id: 'member_005',
                    email: 'viewer@company.com',
                    name: 'Bob Viewer',
                    role: 'viewer',
                    status: 'active',
                    joinedAt: '2023-05-01T00:00:00Z',
                    lastActive: '2024-01-20T13:00:00Z',
                    vaults: ['vault_2'],
                    permissions: ['vault_read'],
                    twoFactorEnabled: false,
                    ipWhitelist: []
                }
            ];

            mockMembers.forEach(member => {
                this.teamMembers.set(member.id, member);
            });

            console.log('✅ Team members loaded');
        } catch (error) {
            console.error('❌ Failed to load team members:', error);
        }
    }

    // Load team activity
    async loadTeamActivity() {
        try {
            this.teamActivity = [
                {
                    id: 'activity_001',
                    userId: 'member_002',
                    userEmail: 'admin@company.com',
                    action: 'user_invited',
                    details: 'Invited new team member: developer@company.com',
                    timestamp: '2024-01-20T15:00:00Z',
                    metadata: {
                        invitedEmail: 'developer@company.com',
                        role: 'user'
                    }
                },
                {
                    id: 'activity_002',
                    userId: 'member_003',
                    userEmail: 'manager@company.com',
                    action: 'vault_created',
                    details: 'Created new vault: Development Team',
                    timestamp: '2024-01-20T14:30:00Z',
                    metadata: {
                        vaultName: 'Development Team',
                        vaultType: 'WORK'
                    }
                },
                {
                    id: 'activity_003',
                    userId: 'member_001',
                    userEmail: 'ceo@company.com',
                    action: 'role_updated',
                    details: 'Updated role for Sarah Admin: Enhanced permissions',
                    timestamp: '2024-01-20T14:00:00Z',
                    metadata: {
                        targetUser: 'member_002',
                        oldRole: 'manager',
                        newRole: 'admin'
                    }
                },
                {
                    id: 'activity_004',
                    userId: 'member_004',
                    userEmail: 'user@company.com',
                    action: 'password_shared',
                    details: 'Shared password with team member',
                    timestamp: '2024-01-20T13:30:00Z',
                    metadata: {
                        passwordId: 'pass_123',
                        sharedWith: 'member_005'
                    }
                },
                {
                    id: 'activity_005',
                    userId: 'member_002',
                    userEmail: 'admin@company.com',
                    action: 'security_audit',
                    details: 'Completed security audit for Q1 2024',
                    timestamp: '2024-01-20T13:00:00Z',
                    metadata: {
                        auditType: 'quarterly',
                        period: 'Q1 2024',
                        score: 95.2
                    }
                }
            ];

            console.log('✅ Team activity loaded');
        } catch (error) {
            console.error('❌ Failed to load team activity:', error);
        }
    }

    // ========================================
    // TEAM MEMBER MANAGEMENT
    // ========================================

    // Get all team members
    async getTeamMembers(filters = {}) {
        try {
            let members = Array.from(this.teamMembers.values());

            // Apply filters
            if (filters.role) {
                members = members.filter(member => member.role === filters.role);
            }

            if (filters.status) {
                members = members.filter(member => member.status === filters.status);
            }

            if (filters.vaultId) {
                members = members.filter(member => member.vaults.includes(filters.vaultId));
            }

            return {
                success: true,
                data: members,
                total: members.length
            };
        } catch (error) {
            console.error('❌ Failed to get team members:', error);
            throw error;
        }
    }

    // Get team member by ID
    async getTeamMember(memberId) {
        try {
            const member = this.teamMembers.get(memberId);
            if (!member) {
                throw new Error('Team member not found');
            }

            return {
                success: true,
                data: member
            };
        } catch (error) {
            console.error('❌ Failed to get team member:', error);
            throw error;
        }
    }

    // Invite team member
    async inviteTeamMember(inviteData) {
        try {
            const { email, name, role, vaults, message } = inviteData;

            // Validate role
            if (!this.roles.has(role)) {
                throw new Error('Invalid role specified');
            }

            // Check if user already exists
            const existingMember = Array.from(this.teamMembers.values()).find(m => m.email === email);
            if (existingMember) {
                throw new Error('User already exists in team');
            }

            // Create invitation
            const invitation = {
                id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                email,
                name,
                role,
                vaults: vaults || [],
                message: message || '',
                invitedBy: 'current_user_id', // In real app, get from auth context
                invitedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
                status: 'pending'
            };

            this.invitations.set(invitation.id, invitation);

            // In a real implementation, send email invitation
            console.log('📧 Invitation sent to:', email);

            return {
                success: true,
                invitationId: invitation.id,
                message: 'Team member invited successfully'
            };
        } catch (error) {
            console.error('❌ Failed to invite team member:', error);
            throw error;
        }
    }

    // Accept invitation
    async acceptInvitation(invitationId, userData) {
        try {
            const invitation = this.invitations.get(invitationId);
            if (!invitation) {
                throw new Error('Invitation not found');
            }

            if (invitation.status !== 'pending') {
                throw new Error('Invitation already processed');
            }

            if (new Date() > new Date(invitation.expiresAt)) {
                throw new Error('Invitation has expired');
            }

            // Create team member
            const member = {
                id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                email: invitation.email,
                name: userData.name || invitation.name,
                role: invitation.role,
                status: 'active',
                joinedAt: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                vaults: invitation.vaults,
                permissions: this.getRolePermissions(invitation.role),
                twoFactorEnabled: false,
                ipWhitelist: []
            };

            this.teamMembers.set(member.id, member);

            // Update invitation status
            invitation.status = 'accepted';
            invitation.acceptedAt = new Date().toISOString();

            return {
                success: true,
                memberId: member.id,
                message: 'Invitation accepted successfully'
            };
        } catch (error) {
            console.error('❌ Failed to accept invitation:', error);
            throw error;
        }
    }

    // Update team member
    async updateTeamMember(memberId, updateData) {
        try {
            const member = this.teamMembers.get(memberId);
            if (!member) {
                throw new Error('Team member not found');
            }

            // Validate role update
            if (updateData.role && !this.roles.has(updateData.role)) {
                throw new Error('Invalid role specified');
            }

            // Update member data
            Object.assign(member, updateData);
            member.lastModified = new Date().toISOString();

            // Update permissions if role changed
            if (updateData.role) {
                member.permissions = this.getRolePermissions(updateData.role);
            }

            return {
                success: true,
                message: 'Team member updated successfully'
            };
        } catch (error) {
            console.error('❌ Failed to update team member:', error);
            throw error;
        }
    }

    // Remove team member
    async removeTeamMember(memberId) {
        try {
            const member = this.teamMembers.get(memberId);
            if (!member) {
                throw new Error('Team member not found');
            }

            // Check if user can be removed
            if (member.role === 'owner') {
                throw new Error('Cannot remove owner from team');
            }

            // Remove member
            this.teamMembers.delete(memberId);

            // Log activity
            await this.logTeamActivity({
                userId: 'current_user_id',
                action: 'user_removed',
                details: `Removed team member: ${member.email}`,
                metadata: {
                    removedUserId: memberId,
                    removedUserEmail: member.email,
                    removedUserRole: member.role
                }
            });

            return {
                success: true,
                message: 'Team member removed successfully'
            };
        } catch (error) {
            console.error('❌ Failed to remove team member:', error);
            throw error;
        }
    }

    // ========================================
    // ROLE & PERMISSION MANAGEMENT
    // ========================================

    // Get all roles
    async getRoles() {
        try {
            return {
                success: true,
                data: Array.from(this.roles.values())
            };
        } catch (error) {
            console.error('❌ Failed to get roles:', error);
            throw error;
        }
    }

    // Get role by name
    async getRole(roleName) {
        try {
            const role = this.roles.get(roleName);
            if (!role) {
                throw new Error('Role not found');
            }

            return {
                success: true,
                data: role
            };
        } catch (error) {
            console.error('❌ Failed to get role:', error);
            throw error;
        }
    }

    // Create custom role
    async createCustomRole(roleData) {
        try {
            const { name, description, permissions, level } = roleData;

            // Validate role name
            if (this.roles.has(name)) {
                throw new Error('Role name already exists');
            }

            // Validate level
            if (level < 0 || level > 100) {
                throw new Error('Role level must be between 0 and 100');
            }

            // Create role
            const role = {
                name,
                description,
                level,
                permissions: permissions || [],
                canManageRoles: level >= 80,
                canInviteUsers: level >= 50,
                canDeleteUsers: level >= 80,
                canManageBilling: level >= 100
            };

            this.roles.set(name, role);

            return {
                success: true,
                message: 'Custom role created successfully'
            };
        } catch (error) {
            console.error('❌ Failed to create custom role:', error);
            throw error;
        }
    }

    // Update role
    async updateRole(roleName, updateData) {
        try {
            const role = this.roles.get(roleName);
            if (!role) {
                throw new Error('Role not found');
            }

            // Prevent updating system roles
            if (['owner', 'admin'].includes(roleName)) {
                throw new Error('Cannot modify system roles');
            }

            // Update role
            Object.assign(role, updateData);

            return {
                success: true,
                message: 'Role updated successfully'
            };
        } catch (error) {
            console.error('❌ Failed to update role:', error);
            throw error;
        }
    }

    // Delete custom role
    async deleteRole(roleName) {
        try {
            const role = this.roles.get(roleName);
            if (!role) {
                throw new Error('Role not found');
            }

            // Prevent deleting system roles
            if (['owner', 'admin', 'user', 'viewer'].includes(roleName)) {
                throw new Error('Cannot delete system roles');
            }

            // Check if role is in use
            const usersWithRole = Array.from(this.teamMembers.values()).filter(m => m.role === roleName);
            if (usersWithRole.length > 0) {
                throw new Error('Cannot delete role that is currently assigned to users');
            }

            // Delete role
            this.roles.delete(roleName);

            return {
                success: true,
                message: 'Role deleted successfully'
            };
        } catch (error) {
            console.error('❌ Failed to delete role:', error);
            throw error;
        }
    }

    // Get permissions for role
    getRolePermissions(roleName) {
        const role = this.roles.get(roleName);
        if (!role) return [];

        if (role.permissions.includes('*')) {
            return Array.from(this.permissions.keys());
        }

        return role.permissions;
    }

    // Check if user has permission
    async hasPermission(userId, permission) {
        try {
            const member = this.teamMembers.get(userId);
            if (!member) return false;

            const role = this.roles.get(member.role);
            if (!role) return false;

            return role.permissions.includes('*') || role.permissions.includes(permission);
        } catch (error) {
            console.error('❌ Failed to check permission:', error);
            return false;
        }
    }

    // ========================================
    // TEAM ACTIVITY & AUDITING
    // ========================================

    // Get team activity
    async getTeamActivity(filters = {}, pagination = {}) {
        try {
            let activities = [...this.teamActivity];

            // Apply filters
            if (filters.userId) {
                activities = activities.filter(activity => activity.userId === filters.userId);
            }

            if (filters.action) {
                activities = activities.filter(activity => activity.action === filters.action);
            }

            if (filters.dateFrom) {
                activities = activities.filter(activity => new Date(activity.timestamp) >= new Date(filters.dateFrom));
            }

            if (filters.dateTo) {
                activities = activities.filter(activity => new Date(activity.timestamp) <= new Date(filters.dateTo));
            }

            // Apply pagination
            const page = pagination.page || 1;
            const limit = pagination.limit || 10;
            const start = (page - 1) * limit;
            const end = start + limit;

            const paginatedActivities = activities.slice(start, end);

            return {
                success: true,
                data: paginatedActivities,
                pagination: {
                    total: activities.length,
                    page: page,
                    limit: limit,
                    pages: Math.ceil(activities.length / limit)
                }
            };
        } catch (error) {
            console.error('❌ Failed to get team activity:', error);
            throw error;
        }
    }

    // Log team activity
    async logTeamActivity(activityData) {
        try {
            const activity = {
                id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString(),
                ...activityData
            };

            this.teamActivity.unshift(activity);

            // Keep only last 1000 activities
            if (this.teamActivity.length > 1000) {
                this.teamActivity = this.teamActivity.slice(0, 1000);
            }

            return { success: true, activityId: activity.id };
        } catch (error) {
            console.error('❌ Failed to log team activity:', error);
            throw error;
        }
    }

    // ========================================
    // TEAM COLLABORATION
    // ========================================

    // Get team statistics
    async getTeamStatistics() {
        try {
            const members = Array.from(this.teamMembers.values());
            const roles = Array.from(this.roles.values());

            const stats = {
                totalMembers: members.length,
                activeMembers: members.filter(m => m.status === 'active').length,
                pendingInvitations: Array.from(this.invitations.values()).filter(i => i.status === 'pending').length,
                roleDistribution: {},
                recentActivity: this.teamActivity.slice(0, 5),
                vaultAccess: this.getVaultAccessStats(members)
            };

            // Calculate role distribution
            roles.forEach(role => {
                stats.roleDistribution[role.name] = members.filter(m => m.role === role.name).length;
            });

            return {
                success: true,
                data: stats
            };
        } catch (error) {
            console.error('❌ Failed to get team statistics:', error);
            throw error;
        }
    }

    // Get vault access statistics
    getVaultAccessStats(members) {
        const vaultStats = {};

        members.forEach(member => {
            member.vaults.forEach(vaultId => {
                if (!vaultStats[vaultId]) {
                    vaultStats[vaultId] = {
                        memberCount: 0,
                        roles: new Set()
                    };
                }
                vaultStats[vaultId].memberCount++;
                vaultStats[vaultId].roles.add(member.role);
            });
        });

        // Convert Sets to Arrays
        Object.keys(vaultStats).forEach(vaultId => {
            vaultStats[vaultId].roles = Array.from(vaultStats[vaultId].roles);
        });

        return vaultStats;
    }

    // Get pending invitations
    async getPendingInvitations() {
        try {
            const pending = Array.from(this.invitations.values()).filter(inv => inv.status === 'pending');
            return {
                success: true,
                data: pending,
                total: pending.length
            };
        } catch (error) {
            console.error('❌ Failed to get pending invitations:', error);
            throw error;
        }
    }

    // Cancel invitation
    async cancelInvitation(invitationId) {
        try {
            const invitation = this.invitations.get(invitationId);
            if (!invitation) {
                throw new Error('Invitation not found');
            }

            if (invitation.status !== 'pending') {
                throw new Error('Invitation already processed');
            }

            invitation.status = 'cancelled';
            invitation.cancelledAt = new Date().toISOString();

            return {
                success: true,
                message: 'Invitation cancelled successfully'
            };
        } catch (error) {
            console.error('❌ Failed to cancel invitation:', error);
            throw error;
        }
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    // Get system status
    getSystemStatus() {
        return {
            isInitialized: this.isInitialized,
            totalMembers: this.teamMembers.size,
            totalRoles: this.roles.size,
            totalPermissions: this.permissions.size,
            pendingInvitations: Array.from(this.invitations.values()).filter(i => i.status === 'pending').length,
            lastUpdated: new Date().toISOString()
        };
    }

    // Export team data
    async exportTeamData(format = 'json') {
        try {
            const data = {
                members: Array.from(this.teamMembers.values()),
                roles: Array.from(this.roles.values()),
                permissions: Array.from(this.permissions.values()),
                activity: this.teamActivity.slice(0, 100), // Last 100 activities
                exportedAt: new Date().toISOString()
            };

            let exportData;
            switch (format.toLowerCase()) {
                case 'json':
                    exportData = JSON.stringify(data, null, 2);
                    break;
                case 'csv':
                    exportData = this.convertToCSV(data.members);
                    break;
                default:
                    throw new Error('Unsupported export format');
            }

            return {
                success: true,
                format: format,
                data: exportData,
                filename: `team_data_${new Date().toISOString().split('T')[0]}.${format}`
            };
        } catch (error) {
            console.error('❌ Failed to export team data:', error);
            throw error;
        }
    }

    // Convert data to CSV
    convertToCSV(data) {
        if (!Array.isArray(data) || data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];

        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                if (Array.isArray(value)) {
                    return `"${value.join('; ')}"`;
                }
                return typeof value === 'string' ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    }

    // Validate team member data
    validateTeamMemberData(memberData) {
        const errors = [];

        if (!memberData.email || !memberData.email.includes('@')) {
            errors.push('Valid email is required');
        }

        if (!memberData.name || memberData.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters');
        }

        if (!memberData.role || !this.roles.has(memberData.role)) {
            errors.push('Valid role is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// Export for use in other modules
window.TeamManagement = TeamManagement;
