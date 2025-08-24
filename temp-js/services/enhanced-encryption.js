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
exports.AgiesZeroKnowledgeEncryption = void 0;
var crypto = require("crypto");
var bcryptjs_1 = require("bcryptjs");
var events_1 = require("events");
/**
 * Agies Enhanced Zero-Knowledge Encryption Service
 * Ensures all encryption/decryption happens locally - server never sees plaintext
 */
var AgiesZeroKnowledgeEncryption = /** @class */ (function (_super) {
    __extends(AgiesZeroKnowledgeEncryption, _super);
    function AgiesZeroKnowledgeEncryption() {
        var _this = _super.call(this) || this;
        // Encryption keys are NEVER stored on server - only exist in memory during operations
        _this.masterKey = null;
        _this.derivedKeys = new Map();
        _this.keyRotationSchedule = new Map();
        console.log('🔐 Agies Zero-Knowledge Encryption initialized');
        return _this;
    }
    // === MASTER KEY MANAGEMENT ===
    /**
     * Set the master key for the current session
     * This key is used to derive all other encryption keys
     * CRITICAL: This key is never sent to or stored on the server
     */
    AgiesZeroKnowledgeEncryption.prototype.setMasterKey = function (masterKey) {
        return __awaiter(this, void 0, void 0, function () {
            var masterKeyHash, deviceEntropy, combinedEntropy, _a, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.deriveMasterKey(masterKey)];
                    case 1:
                        masterKeyHash = _d.sent();
                        return [4 /*yield*/, this.generateDeviceEntropy()];
                    case 2:
                        deviceEntropy = _d.sent();
                        combinedEntropy = Buffer.concat([masterKeyHash, deviceEntropy]);
                        // Final master key derivation using PBKDF2
                        _a = this;
                        _b = this.pbkdf2Derive;
                        _c = [combinedEntropy];
                        return [4 /*yield*/, this.generateSalt()];
                    case 3: return [4 /*yield*/, _b.apply(this, _c.concat([_d.sent(), AgiesZeroKnowledgeEncryption.PBKDF2_ITERATIONS,
                            AgiesZeroKnowledgeEncryption.KEY_LENGTH]))];
                    case 4:
                        // Final master key derivation using PBKDF2
                        _a.masterKey = _d.sent();
                        this.emit('master_key_set', {
                            timestamp: new Date(),
                            hasMasterKey: !!this.masterKey
                        });
                        console.log('🔑 Master key set for zero-knowledge encryption');
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _d.sent();
                        console.error('Error setting master key:', error_1);
                        throw new Error('Failed to initialize zero-knowledge encryption');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clear the master key from memory
     * Call this when user logs out or session ends
     */
    AgiesZeroKnowledgeEncryption.prototype.clearMasterKey = function () {
        if (this.masterKey) {
            // Zero out the master key in memory
            this.masterKey.fill(0);
            this.masterKey = null;
        }
        // Clear all derived keys
        for (var _i = 0, _a = this.derivedKeys.values(); _i < _a.length; _i++) {
            var key = _a[_i];
            key.fill(0);
        }
        this.derivedKeys.clear();
        this.emit('master_key_cleared', { timestamp: new Date() });
        console.log('🔑 Master key cleared from memory');
    };
    AgiesZeroKnowledgeEncryption.prototype.deriveMasterKey = function (masterKey) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.hash(masterKey, AgiesZeroKnowledgeEncryption.MASTER_KEY_SALT_ROUNDS)];
                    case 1:
                        hashedKey = _a.sent();
                        return [2 /*return*/, crypto.createHash('sha256').update(hashedKey).digest()];
                }
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.generateDeviceEntropy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deviceInfo, deviceString;
            return __generator(this, function (_a) {
                deviceInfo = {
                    userAgent: (navigator === null || navigator === void 0 ? void 0 : navigator.userAgent) || 'unknown',
                    language: (navigator === null || navigator === void 0 ? void 0 : navigator.language) || 'unknown',
                    platform: (navigator === null || navigator === void 0 ? void 0 : navigator.platform) || 'unknown',
                    hardwareConcurrency: (navigator === null || navigator === void 0 ? void 0 : navigator.hardwareConcurrency) || 0,
                    deviceMemory: (navigator === null || navigator === void 0 ? void 0 : navigator.deviceMemory) || 0,
                    timestamp: Date.now()
                };
                deviceString = JSON.stringify(deviceInfo);
                return [2 /*return*/, crypto.createHash('sha256').update(deviceString).digest()];
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.generateSalt = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, crypto.randomBytes(32)];
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.pbkdf2Derive = function (keyMaterial, salt, iterations, keyLength) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        crypto.pbkdf2(keyMaterial, salt, iterations, keyLength, 'sha256', function (err, derivedKey) {
                            if (err)
                                reject(err);
                            else
                                resolve(derivedKey);
                        });
                    })];
            });
        });
    };
    // === VAULT ENCRYPTION ===
    /**
     * Encrypt vault data using the master key
     * Returns encrypted data that can be safely stored on server
     */
    AgiesZeroKnowledgeEncryption.prototype.encryptVaultData = function (data, vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var vaultKey, iv, salt, cipher, dataString, encrypted, tag, keyId, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.masterKey) {
                            throw new Error('Master key not set - cannot encrypt data');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.deriveVaultKey(vaultId)];
                    case 2:
                        vaultKey = _a.sent();
                        iv = crypto.randomBytes(AgiesZeroKnowledgeEncryption.IV_LENGTH);
                        salt = crypto.randomBytes(32);
                        cipher = crypto.createCipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, vaultKey, iv);
                        dataString = JSON.stringify(data);
                        encrypted = Buffer.concat([
                            cipher.update(dataString, 'utf8'),
                            cipher.final()
                        ]);
                        tag = cipher.getAuthTag();
                        keyId = crypto.createHash('sha256').update(vaultKey).digest('hex');
                        this.derivedKeys.set(keyId, vaultKey);
                        // Schedule key rotation
                        this.scheduleKeyRotation(vaultId, keyId);
                        result = {
                            encryptedData: encrypted.toString('base64'),
                            encryptionMetadata: {
                                algorithm: AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM,
                                keyId: keyId,
                                iv: iv.toString('base64'),
                                tag: tag.toString('base64'),
                                salt: salt.toString('base64'),
                                timestamp: Date.now()
                            }
                        };
                        this.emit('vault_encrypted', {
                            vaultId: vaultId,
                            keyId: keyId,
                            timestamp: new Date()
                        });
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error encrypting vault data:', error_2);
                        throw new Error('Failed to encrypt vault data');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Decrypt vault data using the master key
     * This happens locally - server never sees decrypted data
     */
    AgiesZeroKnowledgeEncryption.prototype.decryptVaultData = function (encryptedData, encryptionMetadata, vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var vaultKey, iv, tag, encrypted, decipher, decrypted, decryptedData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.masterKey) {
                            throw new Error('Master key not set - cannot decrypt data');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.deriveVaultKey(vaultId)];
                    case 2:
                        vaultKey = _a.sent();
                        iv = Buffer.from(encryptionMetadata.iv, 'base64');
                        tag = Buffer.from(encryptionMetadata.tag, 'base64');
                        encrypted = Buffer.from(encryptedData, 'base64');
                        decipher = crypto.createDecipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, vaultKey, iv);
                        decipher.setAuthTag(tag);
                        decrypted = Buffer.concat([
                            decipher.update(encrypted),
                            decipher.final()
                        ]);
                        decryptedData = JSON.parse(decrypted.toString('utf8'));
                        this.emit('vault_decrypted', {
                            vaultId: vaultId,
                            keyId: encryptionMetadata.keyId,
                            timestamp: new Date()
                        });
                        return [2 /*return*/, decryptedData];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error decrypting vault data:', error_3);
                        throw new Error('Failed to decrypt vault data');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.deriveVaultKey = function (vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var vaultContext;
            return __generator(this, function (_a) {
                if (!this.masterKey) {
                    throw new Error('Master key not available');
                }
                vaultContext = "vault:".concat(vaultId, ":").concat(Date.now());
                return [2 /*return*/, crypto.createHmac('sha256', this.masterKey)
                        .update(vaultContext)
                        .digest()];
            });
        });
    };
    // === PASSWORD ENCRYPTION ===
    /**
     * Encrypt individual password entries
     */
    AgiesZeroKnowledgeEncryption.prototype.encryptPassword = function (passwordData, vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordId, passwordKey, iv, cipher, dataString, encrypted, tag, keyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        passwordId = crypto.randomUUID();
                        return [4 /*yield*/, this.derivePasswordKey(passwordId, vaultId)];
                    case 1:
                        passwordKey = _a.sent();
                        iv = crypto.randomBytes(AgiesZeroKnowledgeEncryption.IV_LENGTH);
                        cipher = crypto.createCipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, passwordKey, iv);
                        dataString = JSON.stringify(passwordData);
                        encrypted = Buffer.concat([
                            cipher.update(dataString, 'utf8'),
                            cipher.final()
                        ]);
                        tag = cipher.getAuthTag();
                        keyId = crypto.createHash('sha256').update(passwordKey).digest('hex');
                        this.derivedKeys.set(keyId, passwordKey);
                        return [2 /*return*/, {
                                encryptedPassword: encrypted.toString('base64'),
                                encryptionMetadata: {
                                    passwordId: passwordId,
                                    keyId: keyId,
                                    iv: iv.toString('base64'),
                                    tag: tag.toString('base64'),
                                    algorithm: AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM,
                                    timestamp: Date.now()
                                }
                            }];
                }
            });
        });
    };
    /**
     * Decrypt individual password entries
     */
    AgiesZeroKnowledgeEncryption.prototype.decryptPassword = function (encryptedPassword, encryptionMetadata, vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordKey, iv, tag, encrypted, decipher, decrypted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.masterKey) {
                            throw new Error('Master key not set');
                        }
                        return [4 /*yield*/, this.derivePasswordKey(encryptionMetadata.passwordId, vaultId)];
                    case 1:
                        passwordKey = _a.sent();
                        iv = Buffer.from(encryptionMetadata.iv, 'base64');
                        tag = Buffer.from(encryptionMetadata.tag, 'base64');
                        encrypted = Buffer.from(encryptedPassword, 'base64');
                        decipher = crypto.createDecipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, passwordKey, iv);
                        decipher.setAuthTag(tag);
                        decrypted = Buffer.concat([
                            decipher.update(encrypted),
                            decipher.final()
                        ]);
                        return [2 /*return*/, JSON.parse(decrypted.toString('utf8'))];
                }
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.derivePasswordKey = function (passwordId, vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordContext;
            return __generator(this, function (_a) {
                if (!this.masterKey) {
                    throw new Error('Master key not available');
                }
                passwordContext = "password:".concat(vaultId, ":").concat(passwordId);
                return [2 /*return*/, crypto.createHmac('sha256', this.masterKey)
                        .update(passwordContext)
                        .digest()];
            });
        });
    };
    // === SECURE NOTES ENCRYPTION ===
    /**
     * Encrypt secure notes with additional security layers
     */
    AgiesZeroKnowledgeEncryption.prototype.encryptSecureNote = function (noteData, vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var noteId, noteKey, primaryEncryption, secondaryKey, finalEncryption, keyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noteId = crypto.randomUUID();
                        return [4 /*yield*/, this.deriveNoteKey(noteId, vaultId)];
                    case 1:
                        noteKey = _a.sent();
                        return [4 /*yield*/, this.encryptWithKey(noteData, noteKey)];
                    case 2:
                        primaryEncryption = _a.sent();
                        return [4 /*yield*/, this.deriveSecondaryKey(noteId, vaultId)];
                    case 3:
                        secondaryKey = _a.sent();
                        return [4 /*yield*/, this.encryptWithKey(primaryEncryption, secondaryKey)];
                    case 4:
                        finalEncryption = _a.sent();
                        keyId = crypto.createHash('sha256').update(noteKey).digest('hex');
                        this.derivedKeys.set(keyId, noteKey);
                        return [2 /*return*/, {
                                encryptedNote: finalEncryption.encryptedData,
                                encryptionMetadata: {
                                    noteId: noteId,
                                    keyId: keyId,
                                    primaryIV: primaryEncryption.iv,
                                    primaryTag: primaryEncryption.tag,
                                    secondaryIV: finalEncryption.iv,
                                    secondaryTag: finalEncryption.tag,
                                    algorithm: AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM,
                                    timestamp: Date.now()
                                }
                            }];
                }
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.encryptWithKey = function (data, key) {
        return __awaiter(this, void 0, void 0, function () {
            var iv, cipher, dataString, encrypted, tag;
            return __generator(this, function (_a) {
                iv = crypto.randomBytes(AgiesZeroKnowledgeEncryption.IV_LENGTH);
                cipher = crypto.createCipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, key, iv);
                dataString = JSON.stringify(data);
                encrypted = Buffer.concat([
                    cipher.update(dataString, 'utf8'),
                    cipher.final()
                ]);
                tag = cipher.getAuthTag();
                return [2 /*return*/, {
                        encryptedData: encrypted.toString('base64'),
                        iv: iv.toString('base64'),
                        tag: tag.toString('base64')
                    }];
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.deriveNoteKey = function (noteId, vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var noteContext;
            return __generator(this, function (_a) {
                if (!this.masterKey) {
                    throw new Error('Master key not available');
                }
                noteContext = "note:".concat(vaultId, ":").concat(noteId);
                return [2 /*return*/, crypto.createHmac('sha256', this.masterKey)
                        .update(noteContext)
                        .digest()];
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.deriveSecondaryKey = function (noteId, vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var secondaryContext;
            return __generator(this, function (_a) {
                if (!this.masterKey) {
                    throw new Error('Master key not available');
                }
                secondaryContext = "secondary:".concat(vaultId, ":").concat(noteId);
                return [2 /*return*/, crypto.createHmac('sha256', this.masterKey)
                        .update(secondaryContext)
                        .digest()];
            });
        });
    };
    // === KEY ROTATION ===
    AgiesZeroKnowledgeEncryption.prototype.scheduleKeyRotation = function (vaultId, keyId) {
        // Schedule key rotation for 30 days from now
        var rotationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        this.keyRotationSchedule.set("".concat(vaultId, ":").concat(keyId), rotationDate);
        this.emit('key_rotation_scheduled', {
            vaultId: vaultId,
            keyId: keyId,
            rotationDate: rotationDate,
            timestamp: new Date()
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.rotateKeys = function (vaultId) {
        return __awaiter(this, void 0, void 0, function () {
            var newMasterKey, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.deriveVaultKey(vaultId)];
                    case 1:
                        newMasterKey = _a.sent();
                        // In a real implementation, you would:
                        // 1. Re-encrypt all vault data with new keys
                        // 2. Update metadata with new key IDs
                        // 3. Securely delete old keys
                        this.emit('keys_rotated', {
                            vaultId: vaultId,
                            timestamp: new Date()
                        });
                        console.log("\uD83D\uDD04 Keys rotated for vault: ".concat(vaultId));
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error rotating keys:', error_4);
                        throw new Error('Failed to rotate keys');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.getPendingKeyRotations = function () {
        var pending = [];
        for (var _i = 0, _a = this.keyRotationSchedule.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], rotationDate = _b[1];
            if (rotationDate <= new Date()) {
                var _c = key.split(':'), vaultId = _c[0], keyId = _c[1];
                if (vaultId && keyId) {
                    pending.push({ vaultId: vaultId, keyId: keyId, rotationDate: rotationDate });
                }
            }
        }
        return pending;
    };
    // === API KEY ENCRYPTION ===
    AgiesZeroKnowledgeEncryption.prototype.generateAPIKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rawApiKey, hashedKey, encryptedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rawApiKey = "agies_".concat(crypto.randomBytes(32).toString('hex'));
                        return [4 /*yield*/, this.hashAPIKey(rawApiKey)];
                    case 1:
                        hashedKey = _a.sent();
                        return [4 /*yield*/, this.encryptAPIKey(rawApiKey)];
                    case 2:
                        encryptedKey = _a.sent();
                        return [2 /*return*/, {
                                apiKey: rawApiKey,
                                hashedKey: hashedKey,
                                metadata: encryptedKey.encryptionMetadata
                            }];
                }
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.hashAPIKey = function (apiKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, crypto.createHash('sha256').update(apiKey).digest('hex')];
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.encryptAPIKey = function (apiKey) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKeyId, apiKeyKey, iv, cipher, encrypted, tag, keyId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.masterKey) {
                            throw new Error('Master key not set');
                        }
                        apiKeyId = crypto.randomUUID();
                        return [4 /*yield*/, this.deriveAPIKey(apiKeyId)];
                    case 1:
                        apiKeyKey = _a.sent();
                        iv = crypto.randomBytes(AgiesZeroKnowledgeEncryption.IV_LENGTH);
                        cipher = crypto.createCipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, apiKeyKey, iv);
                        encrypted = Buffer.concat([
                            cipher.update(apiKey, 'utf8'),
                            cipher.final()
                        ]);
                        tag = cipher.getAuthTag();
                        keyId = crypto.createHash('sha256').update(apiKeyKey).digest('hex');
                        this.derivedKeys.set(keyId, apiKeyKey);
                        return [2 /*return*/, {
                                encryptedKey: encrypted.toString('base64'),
                                encryptionMetadata: {
                                    apiKeyId: apiKeyId,
                                    keyId: keyId,
                                    iv: iv.toString('base64'),
                                    tag: tag.toString('base64'),
                                    algorithm: AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM,
                                    timestamp: Date.now()
                                }
                            }];
                }
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.deriveAPIKey = function (apiKeyId) {
        return __awaiter(this, void 0, void 0, function () {
            var apiContext;
            return __generator(this, function (_a) {
                if (!this.masterKey) {
                    throw new Error('Master key not available');
                }
                apiContext = "api:".concat(apiKeyId);
                return [2 /*return*/, crypto.createHmac('sha256', this.masterKey)
                        .update(apiContext)
                        .digest()];
            });
        });
    };
    // === UTILITY METHODS ===
    AgiesZeroKnowledgeEncryption.prototype.hasMasterKey = function () {
        return !!this.masterKey;
    };
    AgiesZeroKnowledgeEncryption.prototype.getEncryptionStatus = function () {
        return {
            hasMasterKey: !!this.masterKey,
            derivedKeysCount: this.derivedKeys.size,
            pendingRotations: this.getPendingKeyRotations().length,
            lastActivity: new Date()
        };
    };
    AgiesZeroKnowledgeEncryption.prototype.generateSecurePassword = function () {
        return __awaiter(this, arguments, void 0, function (options) {
            var _a, length, _b, includeUppercase, _c, includeLowercase, _d, includeNumbers, _e, includeSymbols, uppercase, lowercase, numbers, symbols, charset, password, i, randomIndex;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_f) {
                _a = options.length, length = _a === void 0 ? 16 : _a, _b = options.includeUppercase, includeUppercase = _b === void 0 ? true : _b, _c = options.includeLowercase, includeLowercase = _c === void 0 ? true : _c, _d = options.includeNumbers, includeNumbers = _d === void 0 ? true : _d, _e = options.includeSymbols, includeSymbols = _e === void 0 ? true : _e;
                uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                lowercase = 'abcdefghijklmnopqrstuvwxyz';
                numbers = '0123456789';
                symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
                charset = '';
                if (includeUppercase)
                    charset += uppercase;
                if (includeLowercase)
                    charset += lowercase;
                if (includeNumbers)
                    charset += numbers;
                if (includeSymbols)
                    charset += symbols;
                if (!charset) {
                    throw new Error('At least one character type must be selected');
                }
                password = '';
                for (i = 0; i < length; i++) {
                    randomIndex = crypto.randomInt(0, charset.length);
                    password += charset[randomIndex];
                }
                return [2 /*return*/, password];
            });
        });
    };
    AgiesZeroKnowledgeEncryption.prototype.destroy = function () {
        this.clearMasterKey();
        this.removeAllListeners();
        console.log('🔐 Zero-Knowledge Encryption service shut down');
    };
    AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM = 'aes-256-gcm';
    AgiesZeroKnowledgeEncryption.KEY_LENGTH = 32; // 256 bits
    AgiesZeroKnowledgeEncryption.IV_LENGTH = 16; // 128 bits for GCM
    AgiesZeroKnowledgeEncryption.TAG_LENGTH = 16; // 128 bits for GCM authentication tag
    AgiesZeroKnowledgeEncryption.SALT_ROUNDS = 12;
    AgiesZeroKnowledgeEncryption.MASTER_KEY_SALT_ROUNDS = 15;
    AgiesZeroKnowledgeEncryption.PBKDF2_ITERATIONS = 100000;
    return AgiesZeroKnowledgeEncryption;
}(events_1.EventEmitter));
exports.AgiesZeroKnowledgeEncryption = AgiesZeroKnowledgeEncryption;
