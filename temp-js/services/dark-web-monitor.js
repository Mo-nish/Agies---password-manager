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
exports.AgiesDarkWebMonitor = void 0;
var events_1 = require("events");
var crypto = require("crypto");
var axios_1 = require("axios");
/**
 * Agies Dark Web Monitor
 * Monitors dark web sources for compromised credentials and triggers automatic responses
 */
var AgiesDarkWebMonitor = /** @class */ (function (_super) {
    __extends(AgiesDarkWebMonitor, _super);
    function AgiesDarkWebMonitor() {
        var _this = _super.call(this) || this;
        _this.monitoringServices = new Map();
        _this.breachDatabases = new Map();
        _this.alertHistory = [];
        _this.monitoringInterval = null;
        _this.lastCheck = new Date();
        // Configuration
        _this.CHECK_INTERVAL = 3600000; // 1 hour
        _this.API_KEYS = {
            'haveibeenpwned': process.env.HIBP_API_KEY || '',
            'leakcheck': process.env.LEAKCHECK_API_KEY || '',
            'dehashed': process.env.DEHASHED_API_KEY || ''
        };
        _this.initializeMonitoringServices();
        _this.startMonitoring();
        console.log('🌑 Agies Dark Web Monitor initialized');
        return _this;
    }
    AgiesDarkWebMonitor.prototype.initializeMonitoringServices = function () {
        // Have I Been Pwned (HIBP)
        this.monitoringServices.set('hibp', {
            name: 'Have I Been Pwned',
            url: 'https://haveibeenpwned.com/api/v3',
            apiKey: this.API_KEYS.haveibeenpwned,
            rateLimit: 100,
            lastUsed: new Date(),
            status: 'active'
        });
        // Leak Check (simulated)
        this.monitoringServices.set('leakcheck', {
            name: 'Leak Check',
            url: 'https://leakcheck.io/api',
            apiKey: this.API_KEYS.leakcheck,
            rateLimit: 50,
            lastUsed: new Date(),
            status: 'active'
        });
        // Dehashed (simulated)
        this.monitoringServices.set('dehashed', {
            name: 'Dehashed',
            url: 'https://dehashed.com/api',
            apiKey: this.API_KEYS.dehashed,
            rateLimit: 25,
            lastUsed: new Date(),
            status: 'active'
        });
    };
    AgiesDarkWebMonitor.prototype.startMonitoring = function () {
        var _this = this;
        this.monitoringInterval = setInterval(function () {
            _this.performDarkWebScan();
        }, this.CHECK_INTERVAL);
    };
    AgiesDarkWebMonitor.prototype.performDarkWebScan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, serviceId, service, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        console.log('🌑 Starting dark web scan...');
                        _i = 0, _a = this.monitoringServices.entries();
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], serviceId = _b[0], service = _b[1];
                        if (!(service.status === 'active' && this.canUseService(service))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.scanService(serviceId, service)];
                    case 2:
                        _c.sent();
                        service.lastUsed = new Date();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.lastCheck = new Date();
                        this.emit('scan_completed', {
                            timestamp: new Date(),
                            servicesScanned: Array.from(this.monitoringServices.keys()),
                            alertsGenerated: this.alertHistory.length
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _c.sent();
                        console.error('Error during dark web scan:', error_1);
                        this.emit('scan_error', { error: error_1, timestamp: new Date() });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AgiesDarkWebMonitor.prototype.canUseService = function (service) {
        var timeSinceLastUse = Date.now() - service.lastUsed.getTime();
        var rateLimitWindow = 60000; // 1 minute
        return timeSinceLastUse >= rateLimitWindow;
    };
    AgiesDarkWebMonitor.prototype.scanService = function (serviceId, service) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        _a = serviceId;
                        switch (_a) {
                            case 'hibp': return [3 /*break*/, 1];
                            case 'leakcheck': return [3 /*break*/, 3];
                            case 'dehashed': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.scanHIBP(service)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 3: return [4 /*yield*/, this.scanLeakCheck(service)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, this.scanDehashed(service)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        console.log("Unknown service: ".concat(serviceId));
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_2 = _b.sent();
                        console.error("Error scanning ".concat(service.name, ":"), error_2);
                        service.status = 'error';
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    AgiesDarkWebMonitor.prototype.scanHIBP = function (service) {
        return __awaiter(this, void 0, void 0, function () {
            var testEmails, _i, testEmails_1, email, response, _a, _b, breach, error_3, axiosError;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!service.apiKey) {
                            console.log('HIBP API key not configured, skipping...');
                            return [2 /*return*/];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 9, , 10]);
                        testEmails = [
                            'test@example.com',
                            'admin@company.com',
                            'user@gmail.com'
                        ];
                        _i = 0, testEmails_1 = testEmails;
                        _d.label = 2;
                    case 2:
                        if (!(_i < testEmails_1.length)) return [3 /*break*/, 8];
                        email = testEmails_1[_i];
                        return [4 /*yield*/, axios_1.default.get("".concat(service.url, "/breachedaccount/").concat(encodeURIComponent(email)), {
                                headers: {
                                    'hibp-api-key': service.apiKey,
                                    'User-Agent': 'Agies-Security-Scanner'
                                },
                                timeout: 10000
                            })];
                    case 3:
                        response = _d.sent();
                        if (!(response.data && response.data.length > 0)) return [3 /*break*/, 7];
                        _a = 0, _b = response.data;
                        _d.label = 4;
                    case 4:
                        if (!(_a < _b.length)) return [3 /*break*/, 7];
                        breach = _b[_a];
                        return [4 /*yield*/, this.processBreach(email, breach, 'haveibeenpwned')];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _a++;
                        return [3 /*break*/, 4];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_3 = _d.sent();
                        axiosError = error_3;
                        if (((_c = axiosError.response) === null || _c === void 0 ? void 0 : _c.status) !== 404) { // 404 just means no breach found
                            throw error_3;
                        }
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    AgiesDarkWebMonitor.prototype.scanLeakCheck = function (service) {
        return __awaiter(this, void 0, void 0, function () {
            var simulatedBreaches, _i, simulatedBreaches_1, breach;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.simulateLeakCheck()];
                    case 1:
                        simulatedBreaches = _a.sent();
                        _i = 0, simulatedBreaches_1 = simulatedBreaches;
                        _a.label = 2;
                    case 2:
                        if (!(_i < simulatedBreaches_1.length)) return [3 /*break*/, 5];
                        breach = simulatedBreaches_1[_i];
                        return [4 /*yield*/, this.processBreach(breach.email, breach, 'leakcheck')];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AgiesDarkWebMonitor.prototype.scanDehashed = function (service) {
        return __awaiter(this, void 0, void 0, function () {
            var simulatedBreaches, _i, simulatedBreaches_2, breach;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.simulateDehashed()];
                    case 1:
                        simulatedBreaches = _a.sent();
                        _i = 0, simulatedBreaches_2 = simulatedBreaches;
                        _a.label = 2;
                    case 2:
                        if (!(_i < simulatedBreaches_2.length)) return [3 /*break*/, 5];
                        breach = simulatedBreaches_2[_i];
                        return [4 /*yield*/, this.processBreach(breach.email, breach, 'dehashed')];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AgiesDarkWebMonitor.prototype.processBreach = function (identifier, breach, source) {
        return __awaiter(this, void 0, void 0, function () {
            var breachId, existingAlert, credentialType, breachData, confidence, riskScore, alert;
            return __generator(this, function (_a) {
                breachId = "".concat(source, "_").concat(breach.Name || breach.name, "_").concat(Date.now());
                existingAlert = this.alertHistory.find(function (alert) {
                    return alert.value === identifier && alert.source === source;
                });
                if (existingAlert) {
                    return [2 /*return*/]; // Already alerted
                }
                credentialType = this.determineCredentialType(identifier);
                breachData = {
                    name: breach.Name || breach.name || 'Unknown',
                    domain: breach.Domain || breach.domain || 'unknown',
                    date: breach.BreachDate || breach.date || new Date().toISOString(),
                    description: breach.Description || breach.description || 'Data breach detected',
                    dataClasses: breach.DataClasses || breach.dataClasses || ['Email addresses']
                };
                confidence = this.calculateBreachConfidence(breach, source);
                riskScore = this.calculateRiskScore(breachData);
                alert = {
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                    credentialType: credentialType,
                    value: identifier,
                    source: source,
                    confidence: confidence,
                    actionTaken: riskScore > 0.7 ? 'auto_rotate' : 'notify_user',
                    status: 'active'
                };
                this.alertHistory.push(alert);
                this.breachDatabases.set(breachId, {
                    id: breachId,
                    source: source,
                    identifier: identifier,
                    breachData: breachData,
                    discoveredAt: new Date(),
                    riskScore: riskScore,
                    alert: alert
                });
                // Emit alert
                this.emit('breach_detected', {
                    alert: alert,
                    breach: breachData,
                    riskScore: riskScore,
                    timestamp: new Date()
                });
                // Log security event
                this.emit('security_event', {
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                    eventType: 'dark_web_breach',
                    severity: riskScore > 0.7 ? 'critical' : 'warning',
                    description: "Dark web breach detected: ".concat(identifier, " found in ").concat(breachData.name),
                    metadata: {
                        alert: alert,
                        breach: breachData,
                        riskScore: riskScore,
                        source: source
                    },
                    ipAddress: undefined
                });
                console.log("\uD83D\uDEA8 Dark web breach detected: ".concat(identifier, " in ").concat(breachData.name, " (").concat(source, ")"));
                return [2 /*return*/];
            });
        });
    };
    AgiesDarkWebMonitor.prototype.determineCredentialType = function (identifier) {
        if (identifier.includes('@') && identifier.includes('.')) {
            return 'email';
        }
        if (identifier.startsWith('API_KEY_') || identifier.length > 32) {
            return 'api_key';
        }
        if (identifier.length <= 20 && /^[a-zA-Z0-9_]+$/.test(identifier)) {
            return 'username';
        }
        return 'password';
    };
    AgiesDarkWebMonitor.prototype.calculateBreachConfidence = function (breach, source) {
        var confidence = 0.5; // Base confidence
        // Source reliability
        switch (source) {
            case 'haveibeenpwned':
                confidence += 0.3;
                break;
            case 'leakcheck':
                confidence += 0.2;
                break;
            case 'dehashed':
                confidence += 0.25;
                break;
        }
        // Breach data quality
        if (breach.BreachDate || breach.date)
            confidence += 0.1;
        if (breach.Description || breach.description)
            confidence += 0.05;
        if (breach.DataClasses || breach.dataClasses)
            confidence += 0.1;
        return Math.min(1, confidence);
    };
    AgiesDarkWebMonitor.prototype.calculateRiskScore = function (breachData) {
        var risk = 0;
        // Recent breaches are higher risk
        if (breachData.date) {
            var breachDate = new Date(breachData.date);
            var daysSinceBreach = (Date.now() - breachDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceBreach < 30)
                risk += 0.3;
            else if (daysSinceBreach < 180)
                risk += 0.2;
            else if (daysSinceBreach < 365)
                risk += 0.1;
        }
        // Sensitive data types increase risk
        var sensitiveDataClasses = [
            'Passwords', 'Credit cards', 'Social security numbers',
            'Bank account numbers', 'Tax identification numbers'
        ];
        var dataClasses = breachData.dataClasses || [];
        var sensitiveCount = dataClasses.filter(function (dc) {
            return sensitiveDataClasses.some(function (sensitive) { return dc.toLowerCase().includes(sensitive.toLowerCase()); });
        }).length;
        risk += (sensitiveCount / dataClasses.length) * 0.4;
        // Known high-profile breaches
        var highProfileBreaches = [
            'Yahoo', 'LinkedIn', 'MySpace', 'Adobe', 'Equifax',
            'Target', 'Home Depot', 'Anthem', 'Marriott'
        ];
        if (highProfileBreaches.some(function (hp) { return breachData.name.toLowerCase().includes(hp.toLowerCase()); })) {
            risk += 0.2;
        }
        return Math.min(1, risk);
    };
    // Simulated services for demonstration
    AgiesDarkWebMonitor.prototype.simulateLeakCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var breaches, breachChance;
            return __generator(this, function (_a) {
                breaches = [];
                breachChance = 0.05;
                if (Math.random() < breachChance) {
                    breaches.push({
                        email: 'demo@example.com',
                        name: 'DemoBreach',
                        domain: 'democompany.com',
                        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                        description: 'Simulated data breach for demonstration',
                        dataClasses: ['Email addresses', 'Passwords']
                    });
                }
                return [2 /*return*/, breaches];
            });
        });
    };
    AgiesDarkWebMonitor.prototype.simulateDehashed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var breaches, breachChance;
            return __generator(this, function (_a) {
                breaches = [];
                breachChance = 0.03;
                if (Math.random() < breachChance) {
                    breaches.push({
                        email: 'test@company.org',
                        name: 'EnterpriseBreach',
                        domain: 'enterprise.com',
                        date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
                        description: 'Enterprise system breach',
                        dataClasses: ['Email addresses', 'Passwords', 'Employee records']
                    });
                }
                return [2 /*return*/, breaches];
            });
        });
    };
    // Public API methods
    AgiesDarkWebMonitor.prototype.checkCredential = function (credential) {
        return __awaiter(this, void 0, void 0, function () {
            var alerts, _i, _a, _b, serviceId, service, result, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        alerts = [];
                        _i = 0, _a = this.monitoringServices.entries();
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        _b = _a[_i], serviceId = _b[0], service = _b[1];
                        if (!(service.status === 'active')) return [3 /*break*/, 5];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.checkCredentialWithService(credential, serviceId, service)];
                    case 3:
                        result = _c.sent();
                        if (result) {
                            alerts.push(result);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _c.sent();
                        console.error("Error checking credential with ".concat(service.name, ":"), error_4);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, alerts];
                }
            });
        });
    };
    AgiesDarkWebMonitor.prototype.checkCredentialWithService = function (credential, serviceId, service) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Simplified credential checking
                // In real implementation, would use service APIs
                if (Math.random() < 0.1) { // 10% chance of finding breach for demo
                    return [2 /*return*/, {
                            id: crypto.randomUUID(),
                            timestamp: new Date(),
                            credentialType: this.determineCredentialType(credential),
                            value: credential,
                            source: service.name,
                            confidence: 0.8,
                            actionTaken: 'auto_rotate',
                            status: 'active'
                        }];
                }
                return [2 /*return*/, null];
            });
        });
    };
    AgiesDarkWebMonitor.prototype.getBreachHistory = function () {
        return __spreadArray([], this.alertHistory, true);
    };
    AgiesDarkWebMonitor.prototype.getMonitoringStatus = function () {
        var activeAlerts = this.alertHistory.filter(function (alert) { return alert.status === 'active'; }).length;
        return {
            services: new Map(this.monitoringServices),
            lastCheck: this.lastCheck,
            totalAlerts: this.alertHistory.length,
            activeAlerts: activeAlerts
        };
    };
    AgiesDarkWebMonitor.prototype.resolveAlert = function (alertId) {
        var alert = this.alertHistory.find(function (a) { return a.id === alertId; });
        if (alert) {
            alert.status = 'resolved';
            this.emit('alert_resolved', { alert: alert, timestamp: new Date() });
            return true;
        }
        return false;
    };
    AgiesDarkWebMonitor.prototype.destroy = function () {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        this.removeAllListeners();
        console.log('🌑 Dark Web Monitor shut down');
    };
    return AgiesDarkWebMonitor;
}(events_1.EventEmitter));
exports.AgiesDarkWebMonitor = AgiesDarkWebMonitor;
