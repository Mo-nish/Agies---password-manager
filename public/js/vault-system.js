// 🔐 Integrated Vault System with Sharing
// Handles vault management, password sharing, and VPN integration

class VaultSystem {
    constructor() {
        this.vaults = new Map();
        this.sharedVaults = new Map();
        this.vpnStatus = false;
        this.init();
    }

    init() {
        console.log('🔐 Initializing Integrated Vault System...');
        this.loadVaults();
        this.checkVPNStatus();
        this.setupEventListeners();
    }

    // 🏠 Create Vault with Type
    async createVault(name, type, description = '') {
        const vault = {
            id: this.generateVaultId(),
            name: name,
            type: type, // 'PERSONAL', 'FAMILY', 'TEAM', 'WORK'
            description: description,
            createdAt: Date.now(),
            passwords: [],
            members: type === 'PERSONAL' ? [] : [],
            permissions: type === 'PERSONAL' ? [] : [],
            expiresAt: null,
            securityLevel: this.getDefaultSecurityLevel(type),
            requiresVPN: type === 'TEAM' || type === 'WORK',
            isShared: type !== 'PERSONAL'
        };

        this.vaults.set(vault.id, vault);
        await this.saveVaults();
        
        console.log(`🏠 Vault "${name}" created successfully (${type})`);
        return vault;
    }

    // 🎯 Get Default Security Level
    getDefaultSecurityLevel(type) {
        switch (type) {
            case 'PERSONAL': return 'MEDIUM';
            case 'FAMILY': return 'HIGH';
            case 'TEAM': return 'HIGH';
            case 'WORK': return 'HIGH';
            default: return 'MEDIUM';
        }
    }

    // 🔐 Add Password to Vault
    async addPasswordToVault(vaultId, passwordData) {
        const vault = this.vaults.get(vaultId);
        if (!vault) {
            throw new Error('Vault not found');
        }

        const password = {
            id: this.generatePasswordId(),
            title: passwordData.title,
            username: passwordData.username,
            password: passwordData.password,
            url: passwordData.url,
            vaultId: vaultId,
            createdAt: Date.now(),
            lastUsed: null,
            isShared: false,
            shareSettings: null
        };

        // Ensure vault.passwords is initialized
        if (!vault.passwords) {
            vault.passwords = [];
        }
        vault.passwords.push(password);
        await this.saveVaults();
        
        console.log(`🔐 Password added to vault "${vault.name}"`);
        return password;
    }

    // 👥 Share Password
    async sharePassword(passwordId, recipients, options = {}) {
        const password = this.findPasswordById(passwordId);
        if (!password) {
            throw new Error('Password not found');
        }

        const {
            expiryMinutes = 60,
            maxAccesses = 1,
            requireVPN = false,
            securityLevel = 'MEDIUM'
        } = options;

        const shareRequest = {
            id: this.generateShareId(),
            passwordId: passwordId,
            vaultId: password.vaultId,
            recipients: recipients,
            createdAt: Date.now(),
            expiresAt: Date.now() + (expiryMinutes * 60 * 1000),
            maxAccesses: maxAccesses,
            currentAccesses: 0,
            requireVPN: requireVPN,
            securityLevel: securityLevel,
            status: 'ACTIVE',
            accessLog: []
        };

        // Mark password as shared
        password.isShared = true;
        password.shareSettings = {
            sharedAt: Date.now(),
            expiresAt: shareRequest.expiresAt,
            recipients: recipients.length
        };

        this.sharedVaults.set(shareRequest.id, shareRequest);
        await this.saveVaults();
        await this.saveSharedVaults();
        
        console.log(`⏰ Password shared with ${recipients.length} recipients`);
        return shareRequest;
    }

    // 🏠 Share Entire Vault
    async shareVault(vaultId, newMembers, permissions, options = {}) {
        const vault = this.vaults.get(vaultId);
        if (!vault) {
            throw new Error('Vault not found');
        }

        // Ensure vault has required properties
        if (!vault.type) vault.type = 'PERSONAL';
        if (!vault.members) vault.members = [];
        if (!vault.permissions) vault.permissions = [];
        
        if (vault.type === 'PERSONAL') {
            // Convert personal vault to shared
            vault.type = 'FAMILY';
            vault.members = newMembers;
            vault.permissions = permissions;
            vault.isShared = true;
            vault.requiresVPN = options.requireVPN || false;
            
            if (options.expiryDays) {
                vault.expiresAt = Date.now() + (options.expiryDays * 24 * 60 * 60 * 1000);
            }
        } else {
            // Add new members to existing shared vault
            vault.members.push(...newMembers);
            vault.permissions.push(...permissions);
        }

        await this.saveVaults();
        
        console.log(`🏠 Vault "${vault.name}" shared with ${newMembers.length} new members`);
        return vault;
    }

    // 🔍 Find Password by ID
    findPasswordById(passwordId) {
        for (const vault of this.vaults.values()) {
            if (vault && vault.passwords && Array.isArray(vault.passwords)) {
                const password = vault.passwords.find(p => p && p.id === passwordId);
                if (password) return password;
            }
        }
        return null;
    }

    // 🌐 VPN Integration
    async checkVPNStatus() {
        try {
            // Check if user is using VPN
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            
            // In a real implementation, you'd check against known VPN IPs
            this.vpnStatus = this.isVPNIP(data.ip);
            
            console.log(`🌐 VPN Status: ${this.vpnStatus ? 'Connected' : 'Not Connected'}`);
            return this.vpnStatus;
        } catch (error) {
            console.error('Failed to check VPN status:', error);
            this.vpnStatus = false;
            return false;
        }
    }

    isVPNIP(ip) {
        // Simplified VPN detection - in reality, you'd use a VPN database
        const vpnRanges = [
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16'
        ];
        
        // This is a basic check - real implementation would be more sophisticated
        return ip.startsWith('10.') || ip.startsWith('172.') || ip.startsWith('192.168.');
    }

    // 📊 Get Vault Statistics
    getVaultStats() {
        const vaults = Array.from(this.vaults.values());
        
        // Filter vaults safely with defaults for missing properties
        const personalVaults = vaults.filter(v => (v && v.type) ? v.type === 'PERSONAL' : false).length;
        const familyVaults = vaults.filter(v => (v && v.type) ? v.type === 'FAMILY' : false).length;
        const teamVaults = vaults.filter(v => (v && v.type) ? v.type === 'TEAM' : false).length;
        const workVaults = vaults.filter(v => (v && v.type) ? v.type === 'WORK' : false).length;
        const sharedVaults = vaults.filter(v => (v && v.isShared) ? v.isShared : false).length;
        
        // Calculate passwords safely
        const totalPasswords = vaults.reduce((sum, vault) => {
            if (vault && vault.passwords && Array.isArray(vault.passwords)) {
                return sum + vault.passwords.length;
            }
            return sum;
        }, 0);
        
        const sharedPasswords = vaults.reduce((sum, vault) => {
            if (vault && vault.passwords && Array.isArray(vault.passwords)) {
                return sum + vault.passwords.filter(p => p && p.isShared).length;
            }
            return sum;
        }, 0);
        
        // Calculate active shares safely
        const activeShares = Array.from(this.sharedVaults.values()).filter(s => 
            s && s.expiresAt && s.status === 'ACTIVE' && Date.now() < s.expiresAt
        ).length;
        
        const stats = {
            totalVaults: this.vaults.size,
            personalVaults,
            familyVaults,
            teamVaults,
            workVaults,
            sharedVaults,
            totalPasswords,
            sharedPasswords,
            activeShares,
            vpnStatus: this.vpnStatus
        };

        return stats;
    }

    // 🗑️ Cleanup Expired Shares
    cleanupExpiredShares() {
        const now = Date.now();
        
        for (const [id, shareRequest] of this.sharedVaults) {
            if (now > shareRequest.expiresAt) {
                console.log(`🗑️ Removing expired share: ${id}`);
                this.sharedVaults.delete(id);
                
                // Reset password share status
                const password = this.findPasswordById(shareRequest.passwordId);
                if (password) {
                    password.isShared = false;
                    password.shareSettings = null;
                }
            }
        }

        this.saveSharedVaults();
        this.saveVaults();
    }

    // 💾 Data Persistence
    async saveVaults() {
        localStorage.setItem('agies_vaults', JSON.stringify(Array.from(this.vaults.entries())));
    }

    async saveSharedVaults() {
        localStorage.setItem('agies_shared_vaults', JSON.stringify(Array.from(this.sharedVaults.entries())));
    }

    loadVaults() {
        try {
            const saved = localStorage.getItem('agies_vaults');
            if (saved) {
                this.vaults = new Map(JSON.parse(saved));
                // Migrate old vault data to new structure
                this.migrateVaultData();
            }
            
            const sharedSaved = localStorage.getItem('agies_shared_vaults');
            if (sharedSaved) {
                this.sharedVaults = new Map(JSON.parse(sharedSaved));
            }
        } catch (error) {
            console.error('Failed to load vaults:', error);
        }
    }
    
    // 🔄 Migrate old vault data to new structure
    migrateVaultData() {
        let migrated = false;
        
        for (const [id, vault] of this.vaults) {
            if (vault) {
                // Ensure vault has all required properties
                if (!vault.type) {
                    vault.type = 'PERSONAL';
                    migrated = true;
                }
                if (!vault.passwords) {
                    vault.passwords = [];
                    migrated = true;
                }
                if (!vault.members) {
                    vault.members = [];
                    migrated = true;
                }
                if (!vault.permissions) {
                    vault.permissions = [];
                    migrated = true;
                }
                if (!vault.securityLevel) {
                    vault.securityLevel = this.getDefaultSecurityLevel(vault.type);
                    migrated = true;
                }
                if (vault.requiresVPN === undefined) {
                    vault.requiresVPN = vault.type === 'TEAM' || vault.type === 'WORK';
                    migrated = true;
                }
                if (!vault.isShared) {
                    vault.isShared = vault.type !== 'PERSONAL';
                    migrated = true;
                }
                if (!vault.createdAt) {
                    vault.createdAt = Date.now();
                    migrated = true;
                }
            }
        }
        
        if (migrated) {
            console.log('🔄 Migrated old vault data to new structure');
            this.saveVaults();
        }
    }

    // 🔧 Utility Functions
    generateVaultId() {
        return 'VAULT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generatePasswordId() {
        return 'PASS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateShareId() {
        return 'SHARE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 🎯 Setup Event Listeners
    setupEventListeners() {
        // Cleanup expired shares every hour
        setInterval(() => {
            this.cleanupExpiredShares();
        }, 60 * 60 * 1000);

        // Check VPN status every 5 minutes
        setInterval(() => {
            this.checkVPNStatus();
        }, 5 * 60 * 1000);
    }

    // 🔐 Get Vault by ID
    getVaultById(vaultId) {
        return this.vaults.get(vaultId);
    }

    // 🔐 Get Passwords for Vault
    getPasswordsForVault(vaultId) {
        const vault = this.vaults.get(vaultId);
        if (vault && vault.passwords && Array.isArray(vault.passwords)) {
            return vault.passwords;
        }
        return [];
    }

    // 🔐 Get All Passwords
    getAllPasswords() {
        const allPasswords = [];
        for (const vault of this.vaults.values()) {
            if (vault && vault.passwords && Array.isArray(vault.passwords)) {
                allPasswords.push(...vault.passwords.map(p => ({ 
                    ...p, 
                    vaultName: vault.name || 'Unknown Vault', 
                    vaultType: vault.type || 'PERSONAL' 
                })));
            }
        }
        return allPasswords;
    }

    // 🔐 Search Passwords
    searchPasswords(query) {
        const allPasswords = this.getAllPasswords();
        const searchTerm = query.toLowerCase();
        
        return allPasswords.filter(password => 
            password.title.toLowerCase().includes(searchTerm) ||
            password.username.toLowerCase().includes(searchTerm) ||
            password.url.toLowerCase().includes(searchTerm) ||
            password.vaultName.toLowerCase().includes(searchTerm)
        );
    }

    // 🔐 Update Password
    async updatePassword(passwordId, updates) {
        const password = this.findPasswordById(passwordId);
        if (!password) {
            throw new Error('Password not found');
        }

        Object.assign(password, updates);
        password.lastModified = Date.now();
        
        await this.saveVaults();
        return password;
    }

    // 🔐 Delete Password
    async deletePassword(passwordId) {
        for (const vault of this.vaults.values()) {
            if (vault && vault.passwords && Array.isArray(vault.passwords)) {
                const index = vault.passwords.findIndex(p => p && p.id === passwordId);
                if (index !== -1) {
                    vault.passwords.splice(index, 1);
                    await this.saveVaults();
                    return true;
                }
            }
        }
        return false;
    }

    // 🏠 Delete Vault
    async deleteVault(vaultId) {
        const vault = this.vaults.get(vaultId);
        if (!vault) {
            throw new Error('Vault not found');
        }

        // Remove all shared passwords from this vault
        for (const [shareId, shareRequest] of this.sharedVaults) {
            if (shareRequest.vaultId === vaultId) {
                this.sharedVaults.delete(shareId);
            }
        }

        this.vaults.delete(vaultId);
        await this.saveVaults();
        await this.saveSharedVaults();
        
        return true;
    }
}

// 🌟 Export the Vault System
window.VaultSystem = VaultSystem;

// Auto-initialize
if (typeof window !== 'undefined') {
    window.vaultSystem = new VaultSystem();
}

console.log('🔐 Integrated Vault System loaded successfully');
