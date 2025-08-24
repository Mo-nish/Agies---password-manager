"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultManagementService = void 0;
var events_1 = require("events");
var crypto = require("crypto");
/**
 * Agies Vault Management Service
 * Handles vault creation, sharing, and icon management
 */
var VaultManagementService = /** @class */ (function (_super) {
    __extends(VaultManagementService, _super);
    function VaultManagementService() {
        var _this = _super.call(this) || this;
        _this.vaults = new Map();
        _this.vaultShares = new Map();
        _this.vaultIcons = new Map();
        _this.userVaults = new Map();
        _this.initializeDefaultIcons();
        console.log('🗂️ Vault Management Service initialized');
        return _this;
    }
    // === VAULT CREATION AND MANAGEMENT ===
    VaultManagementService.prototype.createVault = function (userId, vaultData) {
        return __awaiter(this, void 0, void 0, function () {
            var vaultId, iconId, vault, userVaults;
            return __generator(this, function (_a) {
                try {
                    vaultId = crypto.randomUUID();
                    iconId = vaultData.iconId || this.getDefaultIconForCategory(vaultData.category);
                    vault = {
                        id: vaultId,
                        name: vaultData.name,
                        description: vaultData.description || '',
                        category: vaultData.category,
                        iconId: iconId,
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
                    userVaults = this.userVaults.get(userId) || [];
                    userVaults.push(vaultId);
                    this.userVaults.set(userId, userVaults);
                    this.emit('vault_created', {
                        vaultId: vaultId,
                        userId: userId,
                        category: vaultData.category,
                        timestamp: new Date()
                    });
                    return [2 /*return*/, {
                            success: true,
                            vaultId: vaultId
                        }];
                }
                catch (error) {
                    console.error('Error creating vault:', error);
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Failed to create vault'
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    VaultManagementService.prototype.updateVault = function (vaultId, userId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var vault, updatedVault;
            return __generator(this, function (_a) {
                vault = this.vaults.get(vaultId);
                if (!vault) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Vault not found'
                        }];
                }
                if (vault.ownerId !== userId) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Unauthorized to update vault'
                        }];
                }
                updatedVault = __assign(__assign(__assign({}, vault), updates), { updatedAt: new Date() });
                this.vaults.set(vaultId, updatedVault);
                this.emit('vault_updated', {
                    vaultId: vaultId,
                    userId: userId,
                    updates: updates,
                    timestamp: new Date()
                });
                return [2 /*return*/, {
                        success: true
                    }];
            });
        });
    };
    VaultManagementService.prototype.deleteVault = function (vaultId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var vault, userVaults, filteredVaults;
            return __generator(this, function (_a) {
                vault = this.vaults.get(vaultId);
                if (!vault) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Vault not found'
                        }];
                }
                if (vault.ownerId !== userId) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Unauthorized to delete vault'
                        }];
                }
                // Remove vault
                this.vaults.delete(vaultId);
                userVaults = this.userVaults.get(userId) || [];
                filteredVaults = userVaults.filter(function (id) { return id !== vaultId; });
                this.userVaults.set(userId, filteredVaults);
                // Remove vault shares
                this.vaultShares.delete(vaultId);
                this.emit('vault_deleted', {
                    vaultId: vaultId,
                    userId: userId,
                    timestamp: new Date()
                });
                return [2 /*return*/, {
                        success: true
                    }];
            });
        });
    };
    // === ICON MANAGEMENT ===
    VaultManagementService.prototype.initializeDefaultIcons = function () {
        var _this = this;
        var defaultIcons = [
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
        defaultIcons.forEach(function (icon) {
            _this.vaultIcons.set(icon.id, icon);
        });
    };
    VaultManagementService.prototype.getAvailableIcons = function (category) {
        var icons = Array.from(this.vaultIcons.values());
        if (category) {
            return icons.filter(function (icon) { return icon.category === category; });
        }
        return icons;
    };
    VaultManagementService.prototype.getIcon = function (iconId) {
        return this.vaultIcons.get(iconId) || null;
    };
    VaultManagementService.prototype.uploadCustomIcon = function (userId, iconData) {
        return __awaiter(this, void 0, void 0, function () {
            var iconId, customIcon;
            return __generator(this, function (_a) {
                try {
                    iconId = "custom_".concat(userId, "_").concat(Date.now());
                    customIcon = {
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
                        iconId: iconId,
                        userId: userId,
                        category: iconData.category,
                        timestamp: new Date()
                    });
                    return [2 /*return*/, {
                            success: true,
                            iconId: iconId
                        }];
                }
                catch (error) {
                    console.error('Error uploading custom icon:', error);
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Failed to upload custom icon'
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    VaultManagementService.prototype.getDefaultIconForCategory = function (category) {
        var defaultIcons = {
            'personal': 'icon_personal_1',
            'work': 'icon_work_1',
            'family': 'icon_family_1',
            'shared': 'icon_shared_1',
            'business': 'icon_business_1'
        };
        return defaultIcons[category] || 'icon_personal_1';
    };
    VaultManagementService.prototype.getDefaultColorForCategory = function (category) {
        var defaultColors = {
            'personal': '#3B82F6', // Blue
            'work': '#10B981', // Green
            'family': '#F59E0B', // Yellow
            'shared': '#8B5CF6', // Purple
            'business': '#EF4444' // Red
        };
        return defaultColors[category] || '#6B7280'; // Gray default
    };
    // === VAULT SHARING ===
    VaultManagementService.prototype.shareVault = function (vaultId, ownerId, shareData) {
        return __awaiter(this, void 0, void 0, function () {
            var vault, shareId, share, vaultShares;
            return __generator(this, function (_a) {
                vault = this.vaults.get(vaultId);
                if (!vault) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Vault not found'
                        }];
                }
                if (vault.ownerId !== ownerId) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Unauthorized to share vault'
                        }];
                }
                try {
                    shareId = crypto.randomUUID();
                    share = {
                        id: shareId,
                        vaultId: vaultId,
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
                    vaultShares = this.vaultShares.get(vaultId) || [];
                    vaultShares.push(share);
                    this.vaultShares.set(vaultId, vaultShares);
                    // Update vault share count
                    vault.isShared = true;
                    vault.shareCount = vaultShares.length;
                    this.vaults.set(vaultId, vault);
                    this.emit('vault_shared', {
                        shareId: shareId,
                        vaultId: vaultId,
                        ownerId: ownerId,
                        sharedWith: shareData.shareWithUserId,
                        timestamp: new Date()
                    });
                    return [2 /*return*/, {
                            success: true,
                            shareId: shareId
                        }];
                }
                catch (error) {
                    console.error('Error sharing vault:', error);
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Failed to share vault'
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    VaultManagementService.prototype.acceptVaultShare = function (shareId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var foundShare, vaultId, _i, _a, _b, vaultIdKey, shares, share, vaultShares, shareIndex, userVaults;
            return __generator(this, function (_c) {
                foundShare = null;
                vaultId = null;
                for (_i = 0, _a = this.vaultShares.entries(); _i < _a.length; _i++) {
                    _b = _a[_i], vaultIdKey = _b[0], shares = _b[1];
                    share = shares.find(function (s) { return s.id === shareId; });
                    if (share) {
                        foundShare = share;
                        vaultId = vaultIdKey;
                        break;
                    }
                }
                if (!foundShare || !vaultId) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Share not found'
                        }];
                }
                if (foundShare.sharedWith !== userId) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Unauthorized to accept this share'
                        }];
                }
                if (foundShare.status !== 'pending') {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Share already processed'
                        }];
                }
                // Check expiration
                if (foundShare.expiresAt && foundShare.expiresAt < new Date()) {
                    foundShare.status = 'expired';
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Share has expired'
                        }];
                }
                // Accept the share
                foundShare.status = 'accepted';
                foundShare.acceptedAt = new Date();
                vaultShares = this.vaultShares.get(vaultId);
                shareIndex = vaultShares.findIndex(function (s) { return s.id === shareId; });
                vaultShares[shareIndex] = foundShare;
                this.vaultShares.set(vaultId, vaultShares);
                userVaults = this.userVaults.get(userId) || [];
                if (!userVaults.includes(vaultId)) {
                    userVaults.push(vaultId);
                    this.userVaults.set(userId, userVaults);
                }
                this.emit('vault_share_accepted', {
                    shareId: shareId,
                    vaultId: vaultId,
                    userId: userId,
                    timestamp: new Date()
                });
                return [2 /*return*/, {
                        success: true,
                        vaultId: vaultId
                    }];
            });
        });
    };
    VaultManagementService.prototype.revokeVaultShare = function (shareId, ownerId) {
        return __awaiter(this, void 0, void 0, function () {
            var foundShare, vaultId, _i, _a, _b, vaultIdKey, shares, share, vault, vaultShares, filteredShares, sharedUserVaults, filteredUserVaults;
            return __generator(this, function (_c) {
                foundShare = null;
                vaultId = null;
                for (_i = 0, _a = this.vaultShares.entries(); _i < _a.length; _i++) {
                    _b = _a[_i], vaultIdKey = _b[0], shares = _b[1];
                    share = shares.find(function (s) { return s.id === shareId; });
                    if (share) {
                        foundShare = share;
                        vaultId = vaultIdKey;
                        break;
                    }
                }
                if (!foundShare || !vaultId) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Share not found'
                        }];
                }
                vault = this.vaults.get(vaultId);
                if (!vault || vault.ownerId !== ownerId) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Unauthorized to revoke share'
                        }];
                }
                vaultShares = this.vaultShares.get(vaultId);
                filteredShares = vaultShares.filter(function (s) { return s.id !== shareId; });
                this.vaultShares.set(vaultId, filteredShares);
                // Remove from shared user's vaults if accepted
                if (foundShare.status === 'accepted') {
                    sharedUserVaults = this.userVaults.get(foundShare.sharedWith) || [];
                    filteredUserVaults = sharedUserVaults.filter(function (id) { return id !== vaultId; });
                    this.userVaults.set(foundShare.sharedWith, filteredUserVaults);
                }
                // Update vault share count
                vault.shareCount = filteredShares.length;
                vault.isShared = filteredShares.length > 0;
                this.vaults.set(vaultId, vault);
                this.emit('vault_share_revoked', {
                    shareId: shareId,
                    vaultId: vaultId,
                    ownerId: ownerId,
                    timestamp: new Date()
                });
                return [2 /*return*/, {
                        success: true
                    }];
            });
        });
    };
    // === UTILITY METHODS ===
    VaultManagementService.prototype.getUserVaults = function (userId) {
        var _this = this;
        var userVaultIds = this.userVaults.get(userId) || [];
        return userVaultIds.map(function (vaultId) { return _this.vaults.get(vaultId); }).filter(Boolean);
    };
    VaultManagementService.prototype.getVaultShares = function (vaultId, ownerId) {
        var vault = this.vaults.get(vaultId);
        if (ownerId && vault && vault.ownerId !== ownerId) {
            return [];
        }
        return this.vaultShares.get(vaultId) || [];
    };
    VaultManagementService.prototype.getVault = function (vaultId, userId) {
        var vault = this.vaults.get(vaultId);
        if (!vault)
            return null;
        // Check if user has access
        if (userId) {
            var userVaults = this.userVaults.get(userId) || [];
            if (!userVaults.includes(vaultId)) {
                return null;
            }
        }
        return vault;
    };
    VaultManagementService.prototype.updateVaultStats = function (vaultId, stats) {
        var vault = this.vaults.get(vaultId);
        if (vault) {
            if (stats.passwordCount !== undefined)
                vault.passwordCount = stats.passwordCount;
            if (stats.noteCount !== undefined)
                vault.noteCount = stats.noteCount;
            if (stats.creditCardCount !== undefined)
                vault.creditCardCount = stats.creditCardCount;
            vault.totalItems = vault.passwordCount + vault.noteCount + vault.creditCardCount;
            vault.updatedAt = new Date();
            this.vaults.set(vaultId, vault);
        }
    };
    VaultManagementService.prototype.recordVaultAccess = function (vaultId, userId) {
        var vault = this.vaults.get(vaultId);
        if (vault) {
            vault.lastAccessed = new Date();
            vault.accessCount++;
            this.vaults.set(vaultId, vault);
            this.emit('vault_accessed', {
                vaultId: vaultId,
                userId: userId,
                timestamp: new Date()
            });
        }
    };
    // === SVG ICON DATA ===
    VaultManagementService.prototype.getUserIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\"/></svg>";
    };
    VaultManagementService.prototype.getHomeIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z\"/></svg>";
    };
    VaultManagementService.prototype.getHeartIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\"/></svg>";
    };
    VaultManagementService.prototype.getBriefcaseIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0V4h-4v2h4z\"/></svg>";
    };
    VaultManagementService.prototype.getOfficeIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z\"/></svg>";
    };
    VaultManagementService.prototype.getComputerIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4zm0 3h16v2H4z\"/></svg>";
    };
    VaultManagementService.prototype.getFamilyIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.016 3.016 0 0 0 17.07 7c-.83 0-1.59.41-2.07 1.08L12 12.5 9.07 8.08C8.59 7.41 7.83 7 7 7c-1.18 0-2.25.69-2.73 1.73L2.5 16H5v6h14zM5.5 6c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm9 8h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2z\"/></svg>";
    };
    VaultManagementService.prototype.getChildrenIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z\"/></svg>";
    };
    VaultManagementService.prototype.getTreeIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 2L13.09 8.26L22 9.27L17.77 13.14L19.18 21.02L12 16.77L4.82 21.02L6.23 13.14L2 9.27L10.91 8.26L12 2Z\"/></svg>";
    };
    VaultManagementService.prototype.getGroupIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.016 3.016 0 0 0 17.07 7c-.83 0-1.59.41-2.07 1.08L12 12.5 9.07 8.08C8.59 7.41 7.83 7 7 7c-1.18 0-2.25.69-2.73 1.73L2.5 16H5v6h14z\"/></svg>";
    };
    VaultManagementService.prototype.getNetworkIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\"/></svg>";
    };
    VaultManagementService.prototype.getShareIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z\"/></svg>";
    };
    VaultManagementService.prototype.getBuildingIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z\"/></svg>";
    };
    VaultManagementService.prototype.getMoneyIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"/></svg>";
    };
    VaultManagementService.prototype.getChartIconSVG = function () {
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z\"/></svg>";
    };
    VaultManagementService.prototype.destroy = function () {
        this.removeAllListeners();
        this.vaults.clear();
        this.vaultShares.clear();
        this.vaultIcons.clear();
        this.userVaults.clear();
        console.log('🗂️ Vault Management Service shut down');
    };
    return VaultManagementService;
}(events_1.EventEmitter));
exports.VaultManagementService = VaultManagementService;
