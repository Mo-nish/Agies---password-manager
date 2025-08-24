"use strict";
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
exports.UserService = void 0;
var database_1 = require("../config/database");
var database_2 = require("../config/database");
var encryption_1 = require("./encryption");
var jsonwebtoken_1 = require("jsonwebtoken");
var JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
var UserService = /** @class */ (function () {
    function UserService() {
    }
    /**
     * Register a new user with Padhma Vyuham security
     */
    UserService.registerUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var client, existingUser, passwordHash, masterKeyHash, userResult, user, vaultResult, vault, token, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 12, 14, 15]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, client.query('SELECT id FROM users WHERE email = $1 OR username = $2', [userData.email, userData.username])];
                    case 4:
                        existingUser = _a.sent();
                        if (existingUser.rows.length > 0) {
                            throw new Error('User with this email or username already exists');
                        }
                        return [4 /*yield*/, (0, encryption_1.hashPassword)(userData.password)];
                    case 5:
                        passwordHash = _a.sent();
                        return [4 /*yield*/, (0, encryption_1.hashMasterKey)(userData.masterKey)];
                    case 6:
                        masterKeyHash = _a.sent();
                        return [4 /*yield*/, client.query("INSERT INTO users (email, username, password_hash, master_key_hash, subscription_tier)\n         VALUES ($1, $2, $3, $4, 'free')\n         RETURNING id, email, username, subscription_tier, subscription_status, created_at, last_login, two_factor_enabled, hardware_key_registered", [userData.email, userData.username, passwordHash, masterKeyHash])];
                    case 7:
                        userResult = _a.sent();
                        user = userResult.rows[0];
                        return [4 /*yield*/, client.query('SELECT * FROM vaults WHERE user_id = $1 AND is_default = true', [user.id])];
                    case 8:
                        vaultResult = _a.sent();
                        vault = vaultResult.rows[0];
                        token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, subscription: user.subscription_tier }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
                        // Store session in Redis
                        return [4 /*yield*/, database_2.redisClient.setEx("session:".concat(token), 86400, JSON.stringify({
                                userId: user.id,
                                email: user.email,
                                subscription: user.subscription_tier,
                                createdAt: new Date().toISOString()
                            }))];
                    case 9:
                        // Store session in Redis
                        _a.sent();
                        // Log security event
                        return [4 /*yield*/, client.query("INSERT INTO security_events (user_id, event_type, description, severity, action_taken)\n         VALUES ($1, 'user_registration', 'New user registered successfully', 'low', 'account_created')", [user.id])];
                    case 10:
                        // Log security event
                        _a.sent();
                        return [4 /*yield*/, client.query('COMMIT')];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, { user: user, token: token, vault: vault }];
                    case 12:
                        error_1 = _a.sent();
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 13:
                        _a.sent();
                        throw error_1;
                    case 14:
                        client.release();
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Authenticate user login
     */
    UserService.loginUser = function (loginData) {
        return __awaiter(this, void 0, void 0, function () {
            var client, userResult, user, isPasswordValid, isMasterKeyValid, deviceId, vaultsResult, vaults, token;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.connect()];
                    case 1:
                        client = _f.sent();
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, , 15, 16]);
                        return [4 /*yield*/, client.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [loginData.email])];
                    case 3:
                        userResult = _f.sent();
                        if (userResult.rows.length === 0) {
                            throw new Error('Invalid credentials');
                        }
                        user = userResult.rows[0];
                        return [4 /*yield*/, (0, encryption_1.verifyPassword)(loginData.password, user.password_hash)];
                    case 4:
                        isPasswordValid = _f.sent();
                        if (!!isPasswordValid) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.logFailedLogin(client, user.id, loginData.deviceInfo)];
                    case 5:
                        _f.sent();
                        throw new Error('Invalid credentials');
                    case 6: return [4 /*yield*/, (0, encryption_1.verifyMasterKey)(loginData.masterKey, user.master_key_hash)];
                    case 7:
                        isMasterKeyValid = _f.sent();
                        if (!!isMasterKeyValid) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.logFailedLogin(client, user.id, loginData.deviceInfo)];
                    case 8:
                        _f.sent();
                        throw new Error('Invalid master key');
                    case 9:
                        deviceId = ((_a = loginData.deviceInfo) === null || _a === void 0 ? void 0 : _a.deviceId) ||
                            (0, encryption_1.generateDeviceFingerprint)(((_b = loginData.deviceInfo) === null || _b === void 0 ? void 0 : _b.userAgent) || '', ((_c = loginData.deviceInfo) === null || _c === void 0 ? void 0 : _c.ipAddress) || '');
                        // Update last login
                        return [4 /*yield*/, client.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id])];
                    case 10:
                        // Update last login
                        _f.sent();
                        return [4 /*yield*/, client.query('SELECT * FROM vaults WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC', [user.id])];
                    case 11:
                        vaultsResult = _f.sent();
                        vaults = vaultsResult.rows;
                        token = jsonwebtoken_1.default.sign({
                            userId: user.id,
                            email: user.email,
                            subscription: user.subscription_tier,
                            deviceId: deviceId
                        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
                        // Store session in Redis
                        return [4 /*yield*/, database_2.redisClient.setEx("session:".concat(token), 86400, JSON.stringify({
                                userId: user.id,
                                email: user.email,
                                subscription: user.subscription_tier,
                                deviceId: deviceId,
                                createdAt: new Date().toISOString()
                            }))];
                    case 12:
                        // Store session in Redis
                        _f.sent();
                        // Log successful login
                        return [4 /*yield*/, client.query("INSERT INTO security_events (user_id, event_type, description, severity, action_taken, ip_address, user_agent)\n         VALUES ($1, 'login_success', 'User logged in successfully', 'low', 'access_granted', $2, $3)", [user.id, (_d = loginData.deviceInfo) === null || _d === void 0 ? void 0 : _d.ipAddress, (_e = loginData.deviceInfo) === null || _e === void 0 ? void 0 : _e.userAgent])];
                    case 13:
                        // Log successful login
                        _f.sent();
                        // Update or create browser session
                        return [4 /*yield*/, client.query("INSERT INTO browser_sessions (user_id, device_id, extension_version, browser_type, os_info, last_sync)\n         VALUES ($1, $2, 'web', 'web', 'web', CURRENT_TIMESTAMP)\n         ON CONFLICT (user_id, device_id) \n         DO UPDATE SET last_sync = CURRENT_TIMESTAMP, is_active = true", [user.id, deviceId])];
                    case 14:
                        // Update or create browser session
                        _f.sent();
                        return [2 /*return*/, { user: user, token: token, vaults: vaults }];
                    case 15:
                        client.release();
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log failed login attempt
     */
    UserService.logFailedLogin = function (client, userId, deviceInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.query("INSERT INTO security_events (user_id, event_type, description, severity, action_taken, ip_address, user_agent)\n       VALUES ($1, 'login_failed', 'Failed login attempt', 'medium', 'access_denied', $2, $3)", [userId, deviceInfo === null || deviceInfo === void 0 ? void 0 : deviceInfo.ipAddress, deviceInfo === null || deviceInfo === void 0 ? void 0 : deviceInfo.userAgent])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get user by ID
     */
    UserService.getUserById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.query('SELECT id, email, username, subscription_tier, subscription_status, created_at, last_login, two_factor_enabled, hardware_key_registered FROM users WHERE id = $1 AND is_active = true', [userId])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    /**
     * Get user vaults
     */
    UserService.getUserVaults = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.query('SELECT * FROM vaults WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC', [userId])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    /**
     * Create new vault
     */
    UserService.createVault = function (userId, vaultData) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.query("INSERT INTO vaults (user_id, name, description, icon, color)\n       VALUES ($1, $2, $3, $4, $5)\n       RETURNING *", [
                            userId,
                            vaultData.name,
                            vaultData.description,
                            vaultData.icon || '🔒',
                            vaultData.color || '#6366f1'
                        ])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    /**
     * Get vault passwords
     */
    UserService.getVaultPasswords = function (vaultId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.query("SELECT p.* FROM passwords p\n       JOIN vaults v ON p.vault_id = v.id\n       WHERE v.id = $1 AND v.user_id = $2\n       ORDER BY p.favorite DESC, p.last_used DESC NULLS LAST, p.created_at DESC", [vaultId, userId])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    /**
     * Add password to vault
     */
    UserService.addPassword = function (vaultId, userId, passwordData) {
        return __awaiter(this, void 0, void 0, function () {
            var vaultResult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.query('SELECT id FROM vaults WHERE id = $1 AND user_id = $2', [vaultId, userId])];
                    case 1:
                        vaultResult = _a.sent();
                        if (vaultResult.rows.length === 0) {
                            throw new Error('Vault not found or access denied');
                        }
                        return [4 /*yield*/, database_1.pgPool.query("INSERT INTO passwords (vault_id, website, website_url, username, title, notes, tags, favorite)\n       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\n       RETURNING *", [
                                vaultId,
                                passwordData.website,
                                passwordData.website_url,
                                passwordData.username,
                                passwordData.title,
                                passwordData.notes,
                                passwordData.tags || [],
                                passwordData.favorite || false
                            ])];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    /**
     * Generate API key for Chrome extension
     */
    UserService.generateAPIKey = function (userId, keyName) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKey, keyHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiKey = (0, encryption_1.generateAPIKey)();
                        keyHash = (0, encryption_1.hashAPIKey)(apiKey);
                        return [4 /*yield*/, database_1.pgPool.query("INSERT INTO api_keys (user_id, key_name, key_hash, permissions, expires_at)\n       VALUES ($1, $2, $3, $4, $5)", [
                                userId,
                                keyName,
                                keyHash,
                                JSON.stringify(['read_passwords', 'write_passwords', 'sync']),
                                new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { apiKey: apiKey, keyHash: keyHash }];
                }
            });
        });
    };
    /**
     * Generate one-time verification code
     */
    UserService.generateOTPCode = function (userId_1, codeType_1) {
        return __awaiter(this, arguments, void 0, function (userId, codeType, expiresInMinutes) {
            var code, expiresAt;
            if (expiresInMinutes === void 0) { expiresInMinutes = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = (0, encryption_1.generateOTPCode)(6);
                        expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
                        return [4 /*yield*/, database_1.pgPool.query("INSERT INTO one_time_codes (user_id, code_type, code_value, expires_at)\n       VALUES ($1, $2, $3, $4)", [userId, codeType, code, expiresAt])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, code];
                }
            });
        });
    };
    /**
     * Verify one-time code
     */
    UserService.verifyOTPCode = function (userId, code, codeType) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.query("UPDATE one_time_codes \n       SET used = true, used_at = CURRENT_TIMESTAMP\n       WHERE user_id = $1 AND code_value = $2 AND code_type = $3 \n       AND expires_at > CURRENT_TIMESTAMP AND used = false\n       RETURNING id", [userId, code, codeType])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows.length > 0];
                }
            });
        });
    };
    /**
     * Get user security profile
     */
    UserService.getUserSecurityProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.query("SELECT sl.*, \n              COUNT(h.id) as actual_honeypot_count,\n              COUNT(se.id) as security_event_count\n       FROM security_layers sl\n       LEFT JOIN honeypots h ON sl.id = h.layer_id AND h.is_active = true\n       LEFT JOIN security_events se ON sl.user_id = se.user_id\n       WHERE sl.user_id = $1\n       GROUP BY sl.id\n       ORDER BY sl.layer_order", [userId])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    /**
     * Log security event
     */
    UserService.logSecurityEvent = function (userId, eventData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pgPool.query("INSERT INTO security_events (user_id, event_type, description, severity, action_taken, ip_address, user_agent, metadata)\n       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [
                            userId,
                            eventData.type,
                            eventData.description,
                            eventData.severity || 'low',
                            eventData.action,
                            eventData.ipAddress,
                            eventData.userAgent,
                            JSON.stringify(eventData.metadata || {})
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate JWT token
     */
    UserService.validateToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, session, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                        return [4 /*yield*/, database_2.redisClient.get("session:".concat(token))];
                    case 1:
                        session = _a.sent();
                        if (!session) {
                            throw new Error('Session expired');
                        }
                        return [2 /*return*/, decoded];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error('Invalid token');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Logout user (invalidate session)
     */
    UserService.logoutUser = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_2.redisClient.del("session:".concat(token))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
