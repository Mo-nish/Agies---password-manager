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
exports.HoneytokenService = void 0;
var events_1 = require("events");
var crypto = require("crypto");
/**
 * Agies Honeytoken & Decoy Vault Service
 * Creates and manages deceptive security elements to trap attackers
 */
var HoneytokenService = /** @class */ (function (_super) {
    __extends(HoneytokenService, _super);
    function HoneytokenService() {
        var _this = _super.call(this) || this;
        _this.honeypots = new Map();
        _this.decoyVaults = new Map();
        _this.triggeredHoneypots = new Set();
        _this.triggeredDecoyVaults = new Set();
        _this.attackPatterns = new Map();
        _this.initializeDefaultHoneypots();
        _this.initializeDefaultDecoyVaults();
        console.log('🍯 Agies Honeytoken Service initialized');
        return _this;
    }
    // === HONEYPOT MANAGEMENT ===
    HoneytokenService.prototype.initializeDefaultHoneypots = function () {
        var _this = this;
        // Create honeypots for each chakra layer
        var chakraLayers = ['muladhara', 'svadhishthana', 'manipura', 'anahata', 'vishuddha', 'ajna', 'sahasrara'];
        chakraLayers.forEach(function (chakra, layer) {
            // Create multiple honeypots per layer
            for (var i = 0; i < 3 + layer; i++) {
                var honeypotId = "".concat(chakra, "_honeypot_").concat(i);
                var honeypot = {
                    id: honeypotId,
                    layer: layer,
                    position: _this.generateRandomPosition(),
                    fakeData: _this.generateFakeDataForLayer(layer),
                    triggerConditions: _this.generateTriggerConditionsForLayer(layer),
                    responseDelay: _this.calculateResponseDelay(layer)
                };
                _this.honeypots.set(honeypotId, honeypot);
            }
        });
    };
    HoneytokenService.prototype.generateRandomPosition = function () {
        return Math.floor(Math.random() * 100);
    };
    HoneytokenService.prototype.generateFakeDataForLayer = function (layer) {
        var fakeDataSets = [
            // Layer 0 - Basic decoys
            ['password123', 'admin@fake.com', 'API_KEY_FAKE'],
            // Layer 1 - Common patterns
            ['welcome123', 'user@test.com', 'token_abcdef'],
            // Layer 2 - Realistic but fake
            ['P@ssw0rd2024!', 'john.doe@company.com', 'Bearer_eyJ0eXAi'],
            // Layer 3 - Convincing
            ['SecureP@ss2024#', 'sarah.wilson@enterprise.com', 'sk-1234567890abcdef'],
            // Layer 4 - Production-like
            ['ProdAccess2024!', 'admin@production.com', 'xoxb-1234567890-abcdef'],
            // Layer 5 - Critical system fake
            ['RootAccess#2024', 'root@system.com', 'super-secret-api-key'],
            // Layer 6 - Ultimate decoy
            ['MasterKey2024$', 'master@agies.com', 'ultimate-master-token']
        ];
        var layerData = fakeDataSets[layer] || fakeDataSets[0];
        return layerData[Math.floor(Math.random() * layerData.length)];
    };
    HoneytokenService.prototype.generateTriggerConditionsForLayer = function (layer) {
        var baseConditions = ['rapid_requests', 'suspicious_pattern', 'known_attacker_ip'];
        var advancedConditions = [
            'unusual_time_access', 'geographic_anomaly', 'device_fingerprint_mismatch',
            'behavioral_pattern_change', 'credential_stuffing_indicators',
            'automated_access', 'unusual_request_pattern', 'brute_force_attempt'
        ];
        if (layer < 3) {
            return baseConditions.slice(0, Math.floor(Math.random() * 2) + 1);
        }
        else {
            var mixedConditions = __spreadArray(__spreadArray([], baseConditions, true), advancedConditions, true);
            return mixedConditions.slice(0, Math.floor(Math.random() * 5) + 2);
        }
    };
    HoneytokenService.prototype.calculateResponseDelay = function (layer) {
        // Inner layers have more realistic delays to make them convincing
        return Math.floor(Math.random() * 3000) + (layer * 500) + 1000;
    };
    HoneytokenService.prototype.triggerHoneypot = function (honeypotId, attack) {
        return __awaiter(this, void 0, void 0, function () {
            var honeypot, securityEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        honeypot = this.honeypots.get(honeypotId);
                        if (!honeypot || this.triggeredHoneypots.has(honeypotId)) {
                            return [2 /*return*/, null];
                        }
                        this.triggeredHoneypots.add(honeypotId);
                        // Log honeypot trigger
                        this.emit('honeypot_triggered', {
                            honeypot: honeypot,
                            attack: attack,
                            timestamp: new Date(),
                            type: 'honeypot_trigger'
                        });
                        securityEvent = {
                            id: crypto.randomUUID(),
                            timestamp: new Date(),
                            eventType: 'honeypot_triggered',
                            severity: 'warning',
                            description: "Honeypot triggered in layer ".concat(honeypot.layer, ": ").concat(honeypotId),
                            metadata: {
                                honeypot: honeypot,
                                attack: attack,
                                layer: honeypot.layer,
                                fakeData: honeypot.fakeData
                            },
                            ipAddress: attack.ipAddress
                        };
                        this.emit('security_event', securityEvent);
                        // Wait for response delay
                        return [4 /*yield*/, this.delay(honeypot.responseDelay)];
                    case 1:
                        // Wait for response delay
                        _a.sent();
                        return [2 /*return*/, honeypot];
                }
            });
        });
    };
    HoneytokenService.prototype.getActiveHoneypots = function () {
        var _this = this;
        return Array.from(this.honeypots.values()).filter(function (hp) { return !_this.triggeredHoneypots.has(hp.id); });
    };
    HoneytokenService.prototype.getTriggeredHoneypots = function () {
        var _this = this;
        return Array.from(this.triggeredHoneypots).map(function (id) { return _this.honeypots.get(id); }).filter(Boolean);
    };
    // === DECOY VAULT SYSTEM ===
    HoneytokenService.prototype.initializeDefaultDecoyVaults = function () {
        var _this = this;
        // Create different types of decoy vaults
        var decoyTypes = [
            { type: 'personal', trigger: 'time_based' },
            { type: 'work', trigger: 'access_pattern' },
            { type: 'financial', trigger: 'ip_based' },
            { type: 'critical', trigger: 'ai_detected' }
        ];
        decoyTypes.forEach(function (config, index) {
            var decoyId = "decoy_vault_".concat(config.type, "_").concat(index);
            var decoyVault = {
                id: decoyId,
                vaultId: "fake_vault_".concat(crypto.randomUUID()), // Links to fake vault
                decoyData: _this.generateDecoyData(config.type),
                triggerMechanism: config.trigger,
                activationThreshold: _this.calculateDecoyThreshold(config.trigger),
                isActive: true,
                createdAt: new Date(),
                lastTriggered: undefined,
                triggerCount: 0
            };
            _this.decoyVaults.set(decoyId, decoyVault);
        });
    };
    HoneytokenService.prototype.generateDecoyData = function (vaultType) {
        switch (vaultType) {
            case 'personal':
                return this.generatePersonalDecoyData();
            case 'work':
                return this.generateWorkDecoyData();
            case 'financial':
                return this.generateFinancialDecoyData();
            case 'critical':
                return this.generateCriticalDecoyData();
            default:
                return this.generateGenericDecoyData();
        }
    };
    HoneytokenService.prototype.generatePersonalDecoyData = function () {
        return {
            passwords: [
                { title: 'Gmail', username: 'fake@gmail.com', password: 'password123', url: 'https://mail.google.com' },
                { title: 'Facebook', username: 'fakeuser', password: 'welcome123', url: 'https://facebook.com' },
                { title: 'Instagram', username: 'fake_insta', password: 'insta2024!', url: 'https://instagram.com' }
            ],
            notes: [
                { title: 'Personal Notes', content: 'This is a fake personal note. Nothing important here.' },
                { title: 'Shopping List', content: 'Buy milk, eggs, bread, and some fake items.' }
            ],
            creditCards: [
                { name: 'Personal Card', number: '4111111111111111', expiry: '12/25', cvv: '123' }
            ]
        };
    };
    HoneytokenService.prototype.generateWorkDecoyData = function () {
        return {
            passwords: [
                { title: 'Corporate Email', username: 'employee@company.com', password: 'CorpAccess2024!', url: 'https://mail.company.com' },
                { title: 'Slack', username: 'employee', password: 'slack_token_123', url: 'https://slack.com' },
                { title: 'Jira', username: 'employee', password: 'jira_access_2024', url: 'https://jira.company.com' },
                { title: 'AWS Console', username: 'fake_aws_user', password: 'aws_access_key_123', url: 'https://aws.amazon.com' }
            ],
            notes: [
                { title: 'Meeting Notes', content: 'Fake meeting notes about project development.' },
                { title: 'API Documentation', content: 'This is fake API documentation with no real endpoints.' }
            ],
            creditCards: [
                { name: 'Corporate Card', number: '5555555555554444', expiry: '08/26', cvv: '456' }
            ]
        };
    };
    HoneytokenService.prototype.generateFinancialDecoyData = function () {
        return {
            passwords: [
                { title: 'Banking', username: 'account_holder', password: 'bank_access_2024', url: 'https://bank.com' },
                { title: 'PayPal', username: 'fake_paypal', password: 'paypal_secure_123', url: 'https://paypal.com' },
                { title: 'Credit Card Portal', username: 'card_holder', password: 'card_portal_2024', url: 'https://creditcard.com' }
            ],
            notes: [
                { title: 'Bank Details', content: 'Fake bank account details and routing numbers.' },
                { title: 'Investment Portfolio', content: 'This is a fake investment portfolio document.' }
            ],
            creditCards: [
                { name: 'Primary Card', number: '378282246310005', expiry: '05/27', cvv: '789' },
                { name: 'Backup Card', number: '6011111111111117', expiry: '11/28', cvv: '321' }
            ]
        };
    };
    HoneytokenService.prototype.generateCriticalDecoyData = function () {
        return {
            passwords: [
                { title: 'Root Access', username: 'root', password: 'MasterRoot2024!', url: 'https://system.admin.com' },
                { title: 'Database Admin', username: 'db_admin', password: 'DBMasterKey2024$', url: 'https://database.admin.com' },
                { title: 'API Gateway', username: 'api_admin', password: 'GatewayAccess2024#', url: 'https://api.admin.com' },
                { title: 'SSH Access', username: 'admin', password: 'SSHMasterKey2024!', url: 'ssh://admin.system.com' }
            ],
            notes: [
                { title: 'Master Credentials', content: 'These are the fake master credentials for the system.' },
                { title: 'Emergency Access', content: 'Fake emergency access procedures and backup codes.' },
                { title: 'Security Keys', content: 'This contains fake security keys and certificates.' }
            ],
            creditCards: [
                { name: 'Master Card', number: '6011000990139424', expiry: '12/29', cvv: '999' }
            ]
        };
    };
    HoneytokenService.prototype.generateGenericDecoyData = function () {
        return {
            passwords: [
                { title: 'Generic Service', username: 'user', password: 'password123', url: 'https://service.com' }
            ],
            notes: [
                { title: 'Generic Note', content: 'This is a generic fake note.' }
            ],
            creditCards: [
                { name: 'Generic Card', number: '4111111111111111', expiry: '12/25', cvv: '123' }
            ]
        };
    };
    HoneytokenService.prototype.calculateDecoyThreshold = function (triggerMechanism) {
        switch (triggerMechanism) {
            case 'time_based': return 24 * 60 * 60 * 1000; // 24 hours
            case 'access_pattern': return 10; // 10 suspicious accesses
            case 'ip_based': return 3; // 3 different suspicious IPs
            case 'ai_detected': return 5; // 5 AI-detected threats
            default: return 10;
        }
    };
    HoneytokenService.prototype.triggerDecoyVault = function (decoyId, triggerReason) {
        return __awaiter(this, void 0, void 0, function () {
            var decoy, securityEvent;
            return __generator(this, function (_a) {
                decoy = this.decoyVaults.get(decoyId);
                if (!decoy || !decoy.isActive) {
                    return [2 /*return*/, null];
                }
                decoy.lastTriggered = new Date();
                decoy.triggerCount++;
                // Mark as triggered if threshold exceeded
                if (decoy.triggerCount >= decoy.activationThreshold) {
                    this.triggeredDecoyVaults.add(decoyId);
                    decoy.isActive = false;
                }
                // Log decoy vault trigger
                this.emit('decoy_vault_triggered', {
                    decoy: decoy,
                    triggerReason: triggerReason,
                    timestamp: new Date(),
                    triggerCount: decoy.triggerCount,
                    type: 'decoy_vault_trigger'
                });
                securityEvent = {
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                    eventType: 'decoy_triggered',
                    severity: 'critical',
                    description: "Decoy vault triggered: ".concat(decoyId, " - ").concat(triggerReason),
                    metadata: {
                        decoy: decoy,
                        triggerReason: triggerReason,
                        triggerCount: decoy.triggerCount,
                        vaultType: decoy.vaultId.split('_')[1] // Extract type from fake vault ID
                    },
                    ipAddress: 'unknown'
                };
                this.emit('security_event', securityEvent);
                return [2 /*return*/, decoy];
            });
        });
    };
    HoneytokenService.prototype.getActiveDecoyVaults = function () {
        return Array.from(this.decoyVaults.values()).filter(function (dv) { return dv.isActive; });
    };
    HoneytokenService.prototype.getTriggeredDecoyVaults = function () {
        var _this = this;
        return Array.from(this.triggeredDecoyVaults).map(function (id) { return _this.decoyVaults.get(id); }).filter(Boolean);
    };
    // === ATTACK PATTERN ANALYSIS ===
    HoneytokenService.prototype.analyzeAttackPattern = function (attack) {
        var _this = this;
        var patterns = this.identifyAttackPatterns(attack);
        // Track pattern occurrences
        patterns.forEach(function (pattern) {
            var current = _this.attackPatterns.get(pattern) || 0;
            _this.attackPatterns.set(pattern, current + 1);
        });
        // Determine most likely pattern
        var primaryPattern = patterns[0] || 'unknown';
        var confidence = this.calculatePatternConfidence(primaryPattern, attack);
        var severity = this.calculatePatternSeverity(primaryPattern, attack);
        return {
            pattern: primaryPattern,
            confidence: confidence,
            severity: severity
        };
    };
    HoneytokenService.prototype.identifyAttackPatterns = function (attack) {
        var _a;
        var patterns = [];
        // SQL Injection patterns
        if (attack.payload && /union\s+select|select\s+.*\s+from|drop\s+table|insert\s+into/i.test(attack.payload)) {
            patterns.push('sql_injection');
        }
        // XSS patterns
        if (attack.payload && /<script|javascript:|on\w+\s*=|alert\s*\(/i.test(attack.payload)) {
            patterns.push('xss_attack');
        }
        // Brute force patterns
        if (attack.attackType === 'brute_force' || ((_a = attack.payload) === null || _a === void 0 ? void 0 : _a.includes('password'))) {
            patterns.push('brute_force');
        }
        // Credential stuffing
        if (attack.payload && /\w+@\w+\.\w+/.test(attack.payload) && attack.payload.includes('password')) {
            patterns.push('credential_stuffing');
        }
        // Directory traversal
        if (attack.payload && /\.\.[\/\\]|\.\.\//.test(attack.payload)) {
            patterns.push('directory_traversal');
        }
        // Command injection
        if (attack.payload && /[;&|`$()]/.test(attack.payload)) {
            patterns.push('command_injection');
        }
        return patterns.length > 0 ? patterns : ['unknown'];
    };
    HoneytokenService.prototype.calculatePatternConfidence = function (pattern, attack) {
        var baseConfidence = {
            'sql_injection': 0.85,
            'xss_attack': 0.80,
            'brute_force': 0.75,
            'credential_stuffing': 0.70,
            'directory_traversal': 0.60,
            'command_injection': 0.65,
            'unknown': 0.20
        };
        var confidence = baseConfidence[pattern] || 0.20;
        // Adjust based on attack characteristics
        if (attack.payload && attack.payload.length > 100) {
            confidence += 0.1;
        }
        if (attack.userAgent && this.isSuspiciousUserAgent(attack.userAgent)) {
            confidence += 0.1;
        }
        return Math.min(1, confidence);
    };
    HoneytokenService.prototype.calculatePatternSeverity = function (pattern, attack) {
        var severityMap = {
            'sql_injection': 'high',
            'xss_attack': 'medium',
            'brute_force': 'medium',
            'credential_stuffing': 'high',
            'directory_traversal': 'high',
            'command_injection': 'critical',
            'unknown': 'low'
        };
        var severity = severityMap[pattern] || 'low';
        // Escalate based on attack characteristics
        if (attack.payload && attack.payload.length > 1000) {
            if (severity === 'low')
                severity = 'medium';
            else if (severity === 'medium')
                severity = 'high';
            else if (severity === 'high')
                severity = 'critical';
        }
        return severity;
    };
    HoneytokenService.prototype.isSuspiciousUserAgent = function (userAgent) {
        var suspiciousPatterns = [
            /bot/i, /crawler/i, /scanner/i, /nmap/i, /sqlmap/i,
            /nikto/i, /dirbuster/i, /gobuster/i, /python/i,
            /curl/i, /wget/i, /headless/i, /selenium/i
        ];
        return suspiciousPatterns.some(function (pattern) { return pattern.test(userAgent); });
    };
    // === UTILITY METHODS ===
    HoneytokenService.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    HoneytokenService.prototype.getHoneytokenStats = function () {
        return {
            totalHoneypots: this.honeypots.size,
            activeHoneypots: this.getActiveHoneypots().length,
            triggeredHoneypots: this.triggeredHoneypots.size,
            totalDecoyVaults: this.decoyVaults.size,
            activeDecoyVaults: this.getActiveDecoyVaults().length,
            triggeredDecoyVaults: this.triggeredDecoyVaults.size
        };
    };
    HoneytokenService.prototype.resetHoneytokens = function () {
        this.triggeredHoneypots.clear();
        this.triggeredDecoyVaults.clear();
        this.attackPatterns.clear();
        // Reset decoy vaults
        for (var _i = 0, _a = this.decoyVaults.values(); _i < _a.length; _i++) {
            var decoy = _a[_i];
            decoy.isActive = true;
            decoy.lastTriggered = undefined;
            decoy.triggerCount = 0;
        }
        this.emit('honeytokens_reset', { timestamp: new Date() });
        console.log('🍯 Honeytoken system reset');
    };
    HoneytokenService.prototype.destroy = function () {
        this.removeAllListeners();
        this.honeypots.clear();
        this.decoyVaults.clear();
        this.triggeredHoneypots.clear();
        this.triggeredDecoyVaults.clear();
        this.attackPatterns.clear();
        console.log('🍯 Honeytoken Service shut down');
    };
    return HoneytokenService;
}(events_1.EventEmitter));
exports.HoneytokenService = HoneytokenService;
