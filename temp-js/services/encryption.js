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
exports.decryptMetadata = exports.encryptMetadata = exports.generateDeviceFingerprint = exports.verifyDataHash = exports.createDataHash = exports.generateRecoveryCode = exports.generateOTPCode = exports.hashAPIKey = exports.generateAPIKey = exports.decryptSecureNote = exports.encryptSecureNote = exports.decryptPassword = exports.encryptPassword = exports.decrypt = exports.encrypt = exports.deriveKey = exports.verifyMasterKey = exports.hashMasterKey = exports.verifyPassword = exports.hashPassword = exports.generateSecureCode = exports.generateIV = exports.generateRandomKey = exports.EncryptionService = void 0;
var crypto = require("crypto");
var bcryptjs_1 = require("bcryptjs");
// Encryption configuration
var ENCRYPTION_ALGORITHM = 'aes-256-gcm';
var KEY_LENGTH = 32; // 256 bits
var IV_LENGTH = 16; // 128 bits
var SALT_ROUNDS = 12;
var MASTER_KEY_SALT_ROUNDS = 15;
var EncryptionService = /** @class */ (function () {
    function EncryptionService() {
    }
    /**
     * Generate a cryptographically secure random key
     */
    EncryptionService.generateRandomKey = function (length) {
        if (length === void 0) { length = KEY_LENGTH; }
        return crypto.randomBytes(length);
    };
    /**
     * Generate a cryptographically secure random IV
     */
    EncryptionService.generateIV = function () {
        return crypto.randomBytes(IV_LENGTH);
    };
    /**
     * Generate a secure random string for one-time codes
     */
    EncryptionService.generateSecureCode = function (length) {
        if (length === void 0) { length = 32; }
        return crypto.randomBytes(length).toString('hex');
    };
    /**
     * Hash a password using bcrypt
     */
    EncryptionService.hashPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.hash(password, SALT_ROUNDS)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Verify a password against its hash
     */
    EncryptionService.verifyPassword = function (password, hash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.compare(password, hash)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Hash a master key with higher security
     */
    EncryptionService.hashMasterKey = function (masterKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.hash(masterKey, MASTER_KEY_SALT_ROUNDS)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Verify a master key against its hash
     */
    EncryptionService.verifyMasterKey = function (masterKey, hash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.compare(masterKey, hash)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Derive encryption key from master password and salt
     */
    EncryptionService.deriveKey = function (masterPassword, salt, iterations) {
        if (iterations === void 0) { iterations = 100000; }
        return crypto.pbkdf2Sync(masterPassword, salt, iterations, KEY_LENGTH, 'sha256');
    };
    /**
     * Encrypt data using AES-256-GCM
     */
    EncryptionService.encrypt = function (data, key) {
        var iv = this.generateIV();
        var cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, key);
        cipher.setAAD(Buffer.from('padhma-vyuham', 'utf8')); // Additional authenticated data
        var encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
            encrypted: encrypted,
            iv: iv.toString('hex'),
            authTag: cipher.getAuthTag().toString('hex')
        };
    };
    /**
     * Decrypt data using AES-256-GCM
     */
    EncryptionService.decrypt = function (encryptedData, key, iv, authTag) {
        var decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, key);
        decipher.setAAD(Buffer.from('padhma-vyuham', 'utf8'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        var decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    };
    /**
     * Encrypt password data with additional security
     */
    EncryptionService.encryptPassword = function (password, encryptionKey) {
        var result = this.encrypt(password, encryptionKey);
        return {
            password_encrypted: result.encrypted,
            password_iv: result.iv,
            auth_tag: result.authTag
        };
    };
    /**
     * Decrypt password data
     */
    EncryptionService.decryptPassword = function (encryptedPassword, encryptionKey, iv, authTag) {
        return this.decrypt(encryptedPassword, encryptionKey, iv, authTag);
    };
    /**
     * Encrypt secure note content
     */
    EncryptionService.encryptSecureNote = function (content, encryptionKey) {
        var result = this.encrypt(content, encryptionKey);
        return {
            content_encrypted: result.encrypted,
            content_iv: result.iv,
            auth_tag: result.authTag
        };
    };
    /**
     * Decrypt secure note content
     */
    EncryptionService.decryptSecureNote = function (encryptedContent, encryptionKey, iv, authTag) {
        return this.decrypt(encryptedContent, encryptionKey, iv, authTag);
    };
    /**
     * Generate a secure API key
     */
    EncryptionService.generateAPIKey = function () {
        return "pv_".concat(crypto.randomBytes(32).toString('hex'));
    };
    /**
     * Hash an API key for storage
     */
    EncryptionService.hashAPIKey = function (apiKey) {
        return crypto.createHash('sha256').update(apiKey).digest('hex');
    };
    /**
     * Generate a one-time verification code
     */
    EncryptionService.generateOTPCode = function (length) {
        if (length === void 0) { length = 6; }
        var digits = '0123456789';
        var code = '';
        for (var i = 0; i < length; i++) {
            code += digits[crypto.randomInt(0, digits.length)];
        }
        return code;
    };
    /**
     * Generate a recovery code
     */
    EncryptionService.generateRecoveryCode = function () {
        var _a;
        return ((_a = crypto.randomBytes(16).toString('hex').toUpperCase().match(/.{4}/g)) === null || _a === void 0 ? void 0 : _a.join('-')) || '';
    };
    /**
     * Create a secure hash for data integrity
     */
    EncryptionService.createDataHash = function (data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    };
    /**
     * Verify data integrity using hash
     */
    EncryptionService.verifyDataHash = function (data, expectedHash) {
        var actualHash = this.createDataHash(data);
        return crypto.timingSafeEqual(Buffer.from(actualHash, 'hex'), Buffer.from(expectedHash, 'hex'));
    };
    /**
     * Generate a secure device fingerprint
     */
    EncryptionService.generateDeviceFingerprint = function (userAgent, ipAddress) {
        var data = "".concat(userAgent, "|").concat(ipAddress, "|").concat(Date.now());
        return crypto.createHash('sha256').update(data).digest('hex');
    };
    /**
     * Encrypt sensitive metadata
     */
    EncryptionService.encryptMetadata = function (metadata, key) {
        var jsonString = JSON.stringify(metadata);
        return this.encrypt(jsonString, key);
    };
    /**
     * Decrypt sensitive metadata
     */
    EncryptionService.decryptMetadata = function (encryptedMetadata, key, iv, authTag) {
        var decrypted = this.decrypt(encryptedMetadata, key, iv, authTag);
        return JSON.parse(decrypted);
    };
    return EncryptionService;
}());
exports.EncryptionService = EncryptionService;
// Export utility functions
exports.generateRandomKey = EncryptionService.generateRandomKey, exports.generateIV = EncryptionService.generateIV, exports.generateSecureCode = EncryptionService.generateSecureCode, exports.hashPassword = EncryptionService.hashPassword, exports.verifyPassword = EncryptionService.verifyPassword, exports.hashMasterKey = EncryptionService.hashMasterKey, exports.verifyMasterKey = EncryptionService.verifyMasterKey, exports.deriveKey = EncryptionService.deriveKey, exports.encrypt = EncryptionService.encrypt, exports.decrypt = EncryptionService.decrypt, exports.encryptPassword = EncryptionService.encryptPassword, exports.decryptPassword = EncryptionService.decryptPassword, exports.encryptSecureNote = EncryptionService.encryptSecureNote, exports.decryptSecureNote = EncryptionService.decryptSecureNote, exports.generateAPIKey = EncryptionService.generateAPIKey, exports.hashAPIKey = EncryptionService.hashAPIKey, exports.generateOTPCode = EncryptionService.generateOTPCode, exports.generateRecoveryCode = EncryptionService.generateRecoveryCode, exports.createDataHash = EncryptionService.createDataHash, exports.verifyDataHash = EncryptionService.verifyDataHash, exports.generateDeviceFingerprint = EncryptionService.generateDeviceFingerprint, exports.encryptMetadata = EncryptionService.encryptMetadata, exports.decryptMetadata = EncryptionService.decryptMetadata;
