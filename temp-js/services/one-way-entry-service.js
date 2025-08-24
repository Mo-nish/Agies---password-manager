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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneWayEntryService = void 0;
var events_1 = require("events");
var crypto = require("crypto");
/**
 * Agies One-Way Entry Service
 * Enforces the principle that data can enter easily but can only exit under strict verification
 */
var OneWayEntryService = /** @class */ (function (_super) {
    __extends(OneWayEntryService, _super);
    function OneWayEntryService() {
        var _this = _super.call(this) || this;
        _this.exitAttempts = new Map();
        _this.entryLog = new Map();
        _this.verificationTokens = new Map();
        _this.dataExportHistory = new Map();
        _this.config = _this.initializeDefaultConfig();
        console.log('🚪 One-Way Entry Service initialized');
        return _this;
    }
    OneWayEntryService.prototype.initializeDefaultConfig = function () {
        return {
            entryVerificationLevels: 2, // Easy entry
            exitVerificationLevels: 5, // Hard exit - One-Way Entry Principle
            maxEntryAttempts: 5,
            maxExitAttempts: 3, // Very strict exit limits
            entryCooldown: 5000, // 5 seconds
            exitCooldown: 30000, // 30 seconds - long cooldown for failed exits
            biometricRequired: false, // Optional for entry
            hardwareKeyRequired: true, // Required for exit - hardware security
            timeWindow: 300000 // 5 minutes exit window - limited time to extract
        };
    };
    // === DATA ENTRY (Easy) ===
    OneWayEntryService.prototype.processDataEntry = function (data, userId, source) {
        return __awaiter(this, void 0, void 0, function () {
            var entryId, userEntries, recentEntries, verificationLevel, allowed, entryRecord, entryRecord;
            var _this = this;
            return __generator(this, function (_a) {
                entryId = crypto.randomUUID();
                userEntries = this.entryLog.get(userId) || [];
                recentEntries = userEntries.filter(function (entry) {
                    return entry.timestamp > new Date(Date.now() - _this.config.entryCooldown);
                });
                if (recentEntries.length >= this.config.maxEntryAttempts) {
                    return [2 /*return*/, {
                            allowed: false,
                            entryId: entryId,
                            verificationLevel: 0,
                            reason: 'Entry rate limit exceeded'
                        }];
                }
                verificationLevel = this.determineEntryVerificationLevel(source);
                allowed = verificationLevel <= this.config.entryVerificationLevels;
                if (allowed) {
                    entryRecord = {
                        id: entryId,
                        userId: userId,
                        timestamp: new Date(),
                        source: source,
                        dataType: this.identifyDataType(data),
                        size: JSON.stringify(data).length,
                        verificationLevel: verificationLevel,
                        status: 'success'
                    };
                    userEntries.push(entryRecord);
                    this.entryLog.set(userId, userEntries);
                    this.emit('data_entry_success', {
                        entryId: entryId,
                        userId: userId,
                        source: source,
                        timestamp: new Date()
                    });
                    return [2 /*return*/, {
                            allowed: true,
                            entryId: entryId,
                            verificationLevel: verificationLevel
                        }];
                }
                else {
                    entryRecord = {
                        id: entryId,
                        userId: userId,
                        timestamp: new Date(),
                        source: source,
                        dataType: this.identifyDataType(data),
                        size: JSON.stringify(data).length,
                        verificationLevel: verificationLevel,
                        status: 'failed',
                        reason: 'Entry verification failed'
                    };
                    userEntries.push(entryRecord);
                    this.entryLog.set(userId, userEntries);
                    return [2 /*return*/, {
                            allowed: false,
                            entryId: entryId,
                            verificationLevel: verificationLevel,
                            reason: 'Entry verification failed'
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    OneWayEntryService.prototype.determineEntryVerificationLevel = function (source) {
        var levelMap = {
            'user_input': 1, // Easiest - direct user input
            'import': 2, // Import from external sources
            'sync': 3, // Sync between devices
            'api': 4 // API calls (most restricted for entry)
        };
        return levelMap[source] || 1;
    };
    OneWayEntryService.prototype.identifyDataType = function (data) {
        if (data.password && data.username)
            return 'password';
        if (data.content && data.title)
            return 'note';
        if (data.number && data.expiry)
            return 'credit_card';
        if (Array.isArray(data))
            return 'bulk_data';
        return 'unknown';
    };
    // === DATA EXIT (Hard) - One-Way Entry Principle ===
    OneWayEntryService.prototype.initiateDataExit = function (userId, dataType, dataId) {
        return __awaiter(this, void 0, void 0, function () {
            var exitId, userExitAttempts, recentExits, verificationToken, requiredSteps, exitAttempt;
            var _this = this;
            return __generator(this, function (_a) {
                exitId = crypto.randomUUID();
                userExitAttempts = this.exitAttempts.get(userId) || [];
                recentExits = userExitAttempts.filter(function (attempt) {
                    return attempt.timestamp > new Date(Date.now() - _this.config.exitCooldown);
                });
                if (recentExits.length >= this.config.maxExitAttempts) {
                    this.logSecurityEvent({
                        id: crypto.randomUUID(),
                        timestamp: new Date(),
                        eventType: 'exit_violation',
                        severity: 'critical',
                        description: "One-Way Entry Principle violation: Exit attempt limit exceeded for user ".concat(userId),
                        metadata: {
                            userId: userId,
                            exitId: exitId,
                            dataType: dataType,
                            attemptCount: recentExits.length,
                            maxAttempts: this.config.maxExitAttempts
                        },
                        ipAddress: 'unknown'
                    });
                    return [2 /*return*/, {
                            allowed: false,
                            exitId: exitId,
                            requiredSteps: [],
                            reason: 'Exit attempt limit exceeded - One-Way Entry Principle violation'
                        }];
                }
                verificationToken = this.generateVerificationToken(userId, exitId, dataType, dataId);
                requiredSteps = this.determineExitVerificationSteps(dataType);
                exitAttempt = {
                    id: exitId,
                    userId: userId,
                    timestamp: new Date(),
                    dataType: dataType,
                    dataId: dataId,
                    status: 'pending',
                    verificationToken: verificationToken.id,
                    requiredSteps: requiredSteps,
                    completedSteps: []
                };
                userExitAttempts.push(exitAttempt);
                this.exitAttempts.set(userId, userExitAttempts);
                this.emit('data_exit_initiated', {
                    exitId: exitId,
                    userId: userId,
                    dataType: dataType,
                    timestamp: new Date(),
                    requiredSteps: requiredSteps
                });
                return [2 /*return*/, {
                        allowed: true,
                        exitId: exitId,
                        verificationToken: verificationToken.token,
                        requiredSteps: requiredSteps
                    }];
            });
        });
    };
    OneWayEntryService.prototype.generateVerificationToken = function (userId, exitId, dataType, dataId) {
        var _this = this;
        var tokenId = crypto.randomUUID();
        var token = crypto.randomBytes(32).toString('hex');
        var verificationToken = {
            id: tokenId,
            token: token,
            userId: userId,
            exitId: exitId,
            dataType: dataType,
            dataId: dataId,
            expiresAt: new Date(Date.now() + this.config.timeWindow), // 5 minutes
            used: false,
            createdAt: new Date()
        };
        this.verificationTokens.set(tokenId, verificationToken);
        // Schedule token cleanup
        setTimeout(function () {
            _this.verificationTokens.delete(tokenId);
        }, this.config.timeWindow);
        return verificationToken;
    };
    OneWayEntryService.prototype.determineExitVerificationSteps = function (dataType) {
        var baseSteps = [
            'user_authentication',
            'device_verification',
            'time_window_check'
        ];
        var advancedSteps = [
            'biometric_verification',
            'hardware_key_verification',
            'security_questions',
            'two_factor_authentication',
            'session_verification'
        ];
        // Different requirements based on data sensitivity
        switch (dataType) {
            case 'password':
                return __spreadArray(__spreadArray([], baseSteps, true), ['two_factor_authentication'], false);
            case 'note':
                return __spreadArray(__spreadArray([], baseSteps, true), ['biometric_verification'], false);
            case 'credit_card':
                return __spreadArray(__spreadArray([], baseSteps, true), ['hardware_key_verification', 'two_factor_authentication'], false);
            case 'all':
                return __spreadArray(__spreadArray([], baseSteps, true), advancedSteps, true); // Maximum security for bulk export
            default:
                return baseSteps;
        }
    };
    OneWayEntryService.prototype.verifyExitStep = function (userId, exitId, step, verificationData) {
        return __awaiter(this, void 0, void 0, function () {
            var userExitAttempts, exitAttempt, stepResult, allStepsCompleted, nextStepIndex, nextStep;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userExitAttempts = this.exitAttempts.get(userId) || [];
                        exitAttempt = userExitAttempts.find(function (attempt) { return attempt.id === exitId; });
                        if (!exitAttempt) {
                            return [2 /*return*/, {
                                    success: false,
                                    reason: 'Exit attempt not found'
                                }];
                        }
                        return [4 /*yield*/, this.verifyStep(exitAttempt, step, verificationData)];
                    case 1:
                        stepResult = _a.sent();
                        if (stepResult.success) {
                            exitAttempt.completedSteps.push(step);
                            allStepsCompleted = exitAttempt.requiredSteps.every(function (step) {
                                return exitAttempt.completedSteps.includes(step);
                            });
                            if (allStepsCompleted) {
                                exitAttempt.status = 'verified';
                                this.exitAttempts.set(userId, userExitAttempts);
                                this.emit('data_exit_verified', {
                                    exitId: exitId,
                                    userId: userId,
                                    timestamp: new Date(),
                                    dataType: exitAttempt.dataType
                                });
                                return [2 /*return*/, {
                                        success: true,
                                        allStepsCompleted: true
                                    }];
                            }
                            else {
                                nextStepIndex = exitAttempt.completedSteps.length;
                                nextStep = exitAttempt.requiredSteps[nextStepIndex];
                                return [2 /*return*/, {
                                        success: true,
                                        nextStep: nextStep
                                    }];
                            }
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    reason: stepResult.reason || 'Step verification failed'
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    OneWayEntryService.prototype.verifyStep = function (exitAttempt, step, verificationData) {
        return __awaiter(this, void 0, void 0, function () {
            var verificationToken;
            return __generator(this, function (_a) {
                // In a real implementation, these would verify against actual user data
                switch (step) {
                    case 'user_authentication':
                        return [2 /*return*/, { success: true, reason: 'User authenticated' }];
                    case 'device_verification':
                        return [2 /*return*/, { success: true, reason: 'Device verified' }];
                    case 'time_window_check':
                        verificationToken = this.verificationTokens.get(exitAttempt.verificationToken);
                        if (verificationToken && verificationToken.expiresAt > new Date()) {
                            return [2 /*return*/, { success: true, reason: 'Within time window' }];
                        }
                        else {
                            return [2 /*return*/, { success: false, reason: 'Time window expired' }];
                        }
                    case 'biometric_verification':
                        if (this.config.biometricRequired) {
                            // Simulate biometric verification
                            return [2 /*return*/, { success: Math.random() > 0.1, reason: 'Biometric verification' }];
                        }
                        return [2 /*return*/, { success: true, reason: 'Biometric not required' }];
                    case 'hardware_key_verification':
                        if (this.config.hardwareKeyRequired) {
                            // Simulate hardware key verification
                            return [2 /*return*/, { success: Math.random() > 0.1, reason: 'Hardware key verification' }];
                        }
                        return [2 /*return*/, { success: true, reason: 'Hardware key not required' }];
                    case 'two_factor_authentication':
                        // Simulate 2FA verification
                        return [2 /*return*/, { success: Math.random() > 0.05, reason: '2FA verification' }];
                    case 'security_questions':
                        // Simulate security questions
                        return [2 /*return*/, { success: Math.random() > 0.2, reason: 'Security questions' }];
                    case 'session_verification':
                        // Simulate session verification
                        return [2 /*return*/, { success: Math.random() > 0.1, reason: 'Session verification' }];
                    default:
                        return [2 /*return*/, { success: false, reason: 'Unknown step' }];
                }
                return [2 /*return*/];
            });
        });
    };
    OneWayEntryService.prototype.executeDataExit = function (userId, exitId) {
        return __awaiter(this, void 0, void 0, function () {
            var userExitAttempts, exitAttempt, verificationToken, exportRecord;
            return __generator(this, function (_a) {
                userExitAttempts = this.exitAttempts.get(userId) || [];
                exitAttempt = userExitAttempts.find(function (attempt) { return attempt.id === exitId; });
                if (!exitAttempt) {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Exit attempt not found'
                        }];
                }
                if (exitAttempt.status !== 'verified') {
                    return [2 /*return*/, {
                            success: false,
                            reason: 'Exit not fully verified'
                        }];
                }
                verificationToken = this.verificationTokens.get(exitAttempt.verificationToken);
                if (verificationToken) {
                    verificationToken.used = true;
                }
                // Update exit attempt status
                exitAttempt.status = 'completed';
                this.exitAttempts.set(userId, userExitAttempts);
                exportRecord = {
                    id: crypto.randomUUID(),
                    userId: userId,
                    exitId: exitId,
                    dataType: exitAttempt.dataType,
                    dataId: exitAttempt.dataId,
                    timestamp: new Date(),
                    verificationLevel: exitAttempt.requiredSteps.length,
                    exportMethod: 'secure_export'
                };
                this.dataExportHistory.set(exportRecord.id, exportRecord);
                this.emit('data_exit_completed', {
                    exitId: exitId,
                    userId: userId,
                    exportId: exportRecord.id,
                    dataType: exitAttempt.dataType,
                    timestamp: new Date()
                });
                this.logSecurityEvent({
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                    eventType: 'data_export',
                    severity: 'info',
                    description: "Secure data export completed: ".concat(exitAttempt.dataType, " for user ").concat(userId),
                    metadata: {
                        userId: userId,
                        exitId: exitId,
                        exportId: exportRecord.id,
                        dataType: exitAttempt.dataType,
                        verificationSteps: exitAttempt.requiredSteps.length
                    },
                    ipAddress: 'unknown'
                });
                // In a real implementation, this would return the actual decrypted data
                // For security, we return a placeholder
                return [2 /*return*/, {
                        success: true,
                        data: {
                            message: 'Data export completed successfully',
                            exportId: exportRecord.id,
                            dataType: exitAttempt.dataType,
                            timestamp: new Date().toISOString()
                        }
                    }];
            });
        });
    };
    // === VIOLATION DETECTION ===
    OneWayEntryService.prototype.detectOneWayViolation = function (userId, action, data) {
        var _this = this;
        // Check for exit-related actions without proper verification
        var exitIndicators = [
            'export', 'download', 'copy', 'extract', 'backup',
            'GET /api/vaults/', 'password', 'secret', 'key',
            'data', 'file', 'document'
        ];
        var actionLower = action.toLowerCase();
        var isExitAction = exitIndicators.some(function (indicator) {
            return actionLower.includes(indicator.toLowerCase());
        });
        if (isExitAction) {
            // Check if there's a valid exit attempt for this action
            var userExitAttempts_1 = this.exitAttempts.get(userId) || [];
            var validExit = userExitAttempts_1.find(function (attempt) {
                return attempt.status === 'verified' &&
                    attempt.timestamp > new Date(Date.now() - _this.config.timeWindow);
            });
            if (!validExit) {
                this.logSecurityEvent({
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                    eventType: 'one_way_violation',
                    severity: 'critical',
                    description: "One-Way Entry Principle violation: Unauthorized data exit attempt by user ".concat(userId),
                    metadata: {
                        userId: userId,
                        action: action,
                        violationType: 'unauthorized_exit',
                        timestamp: new Date()
                    },
                    ipAddress: 'unknown'
                });
                return {
                    isViolation: true,
                    violationType: 'unauthorized_exit',
                    severity: 'critical'
                };
            }
        }
        // Check for rapid exit attempts
        var userExitAttempts = this.exitAttempts.get(userId) || [];
        var recentAttempts = userExitAttempts.filter(function (attempt) {
            return attempt.timestamp > new Date(Date.now() - _this.config.exitCooldown);
        });
        if (recentAttempts.length > this.config.maxExitAttempts) {
            return {
                isViolation: true,
                violationType: 'exit_rate_limit',
                severity: 'high'
            };
        }
        return {
            isViolation: false,
            violationType: 'none',
            severity: 'low'
        };
    };
    // === UTILITY METHODS ===
    OneWayEntryService.prototype.logSecurityEvent = function (event) {
        this.emit('security_event', event);
    };
    OneWayEntryService.prototype.getExitStatistics = function (userId) {
        var exitAttempts = [];
        var exportRecords = [];
        if (userId) {
            exitAttempts = this.exitAttempts.get(userId) || [];
            exportRecords = Array.from(this.dataExportHistory.values()).filter(function (record) { return record.userId === userId; });
        }
        else {
            exitAttempts = Array.from(this.exitAttempts.values()).flat();
            exportRecords = Array.from(this.dataExportHistory.values());
        }
        var successfulExits = exitAttempts.filter(function (attempt) { return attempt.status === 'completed'; }).length;
        var failedExits = exitAttempts.filter(function (attempt) { return attempt.status === 'failed'; }).length;
        var activeTokens = Array.from(this.verificationTokens.values()).filter(function (token) { return !token.used; }).length;
        var recentExports = exportRecords
            .sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })
            .slice(0, 10);
        return {
            totalExitAttempts: exitAttempts.length,
            successfulExits: successfulExits,
            failedExits: failedExits,
            activeTokens: activeTokens,
            recentExports: recentExports
        };
    };
    OneWayEntryService.prototype.updateConfig = function (newConfig) {
        this.config = __assign(__assign({}, this.config), newConfig);
        this.emit('config_updated', { config: this.config, timestamp: new Date() });
    };
    OneWayEntryService.prototype.getConfig = function () {
        return __assign({}, this.config);
    };
    OneWayEntryService.prototype.destroy = function () {
        this.removeAllListeners();
        this.exitAttempts.clear();
        this.entryLog.clear();
        this.verificationTokens.clear();
        this.dataExportHistory.clear();
        console.log('🚪 One-Way Entry Service shut down');
    };
    return OneWayEntryService;
}(events_1.EventEmitter));
exports.OneWayEntryService = OneWayEntryService;
