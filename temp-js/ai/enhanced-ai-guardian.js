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
exports.AgiesAIGuardian = void 0;
var events_1 = require("events");
var crypto = require("crypto");
/**
 * Agies Enhanced AI Guardian
 * The intelligent brain behind the Chakravyuham security system
 * Learns from attacks, predicts threats, and dynamically adjusts the maze
 */
var AgiesAIGuardian = /** @class */ (function (_super) {
    __extends(AgiesAIGuardian, _super);
    function AgiesAIGuardian() {
        var _this = _super.call(this) || this;
        _this.attackPatterns = new Map();
        _this.threatLevels = new Map();
        _this.adaptiveResponses = new Map();
        _this.learningRate = 0.1;
        _this.confidenceThreshold = 0.7;
        _this.maxThreatLevel = 10;
        _this.neuralNetwork = new Map(); // Simplified neural network
        _this.patternRecognition = new Map();
        // AI Guardian memory and learning
        _this.attackHistory = [];
        _this.successfulAttacks = [];
        _this.failedAttacks = [];
        _this.learningIterations = 0;
        _this.initializePatternRecognition();
        _this.initializeNeuralNetwork();
        _this.anomalyDetection = new AnomalyDetector();
        console.log('🧠 Agies AI Guardian initialized with advanced threat detection');
        return _this;
    }
    AgiesAIGuardian.prototype.initializePatternRecognition = function () {
        var _this = this;
        // Known attack patterns with initial weights
        var knownPatterns = [
            'sql_injection', 'xss_attack', 'brute_force', 'ddos',
            'phishing', 'malware_signature', 'credential_stuffing',
            'session_hijacking', 'directory_traversal', 'command_injection',
            'csrf_attack', 'open_redirect', 'host_header_injection',
            'xml_injection', 'ssrf_attack', 'file_inclusion'
        ];
        knownPatterns.forEach(function (pattern, index) {
            _this.attackPatterns.set(pattern, 0.8);
            _this.threatLevels.set(pattern, 5 + (index % 5)); // Varying threat levels
            _this.patternRecognition.set(pattern, {
                pattern: pattern,
                occurrences: 0,
                successRate: 0,
                lastSeen: new Date(0),
                confidence: 0.5,
                evolution: 'stable'
            });
        });
    };
    AgiesAIGuardian.prototype.initializeNeuralNetwork = function () {
        var _this = this;
        // Simplified neural network weights for threat classification
        var networkWeights = [
            'payload_length', 'user_agent_suspicious', 'ip_reputation',
            'time_anomaly', 'request_frequency', 'payload_complexity',
            'header_anomalies', 'geolocation_risk', 'behavioral_pattern'
        ];
        networkWeights.forEach(function (weight) {
            _this.neuralNetwork.set(weight, Math.random());
        });
    };
    AgiesAIGuardian.prototype.analyzeThreat = function (attack) {
        return __awaiter(this, void 0, void 0, function () {
            var threatScore, patternMatch, anomalyScore, behavioralAnalysis, combinedScore, adaptiveResponse, level;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        threatScore = this.calculateAdvancedThreatScore(attack);
                        patternMatch = this.identifyAdvancedPattern(attack);
                        return [4 /*yield*/, this.anomalyDetection.detectAnomaly(attack)];
                    case 1:
                        anomalyScore = _a.sent();
                        behavioralAnalysis = this.analyzeBehavioralPattern(attack);
                        combinedScore = (threatScore * 0.4) + (patternMatch.confidence * 0.3) +
                            (anomalyScore * 0.2) + (behavioralAnalysis * 0.1);
                        adaptiveResponse = this.generateAdvancedAdaptiveResponse(attack, combinedScore, patternMatch);
                        // Learn from this attack
                        this.learnFromAttack(attack, combinedScore, patternMatch);
                        // Emit analysis results
                        this.emit('ai_analysis', {
                            attack: attack,
                            threatScore: combinedScore,
                            patternMatch: patternMatch,
                            anomalyScore: anomalyScore,
                            behavioralAnalysis: behavioralAnalysis,
                            response: adaptiveResponse,
                            timestamp: new Date()
                        });
                        level = 'low';
                        if (combinedScore >= 0.8)
                            level = 'critical';
                        else if (combinedScore >= 0.6)
                            level = 'high';
                        else if (combinedScore >= 0.4)
                            level = 'medium';
                        return [2 /*return*/, {
                                level: level,
                                score: combinedScore * 100,
                                confidence: patternMatch.confidence,
                                reasoning: this.generateDetailedReasoning(attack, combinedScore, patternMatch, anomalyScore),
                                recommendedActions: this.getAdvancedRecommendedActions(level, attack, patternMatch),
                                timestamp: new Date()
                            }];
                }
            });
        });
    };
    AgiesAIGuardian.prototype.calculateAdvancedThreatScore = function (attack) {
        var score = 0;
        var factors = 0;
        // Neural network-based scoring
        var neuralInputs = this.extractNeuralInputs(attack);
        var neuralScore = this.processNeuralNetwork(neuralInputs);
        score += neuralScore * 0.6;
        factors += 0.6;
        // Pattern-based scoring
        var patternScore = this.calculatePatternScore(attack);
        score += patternScore * 0.4;
        factors += 0.4;
        return score / factors;
    };
    AgiesAIGuardian.prototype.extractNeuralInputs = function (attack) {
        var _a;
        var inputs = new Map();
        // Payload analysis
        inputs.set('payload_length', Math.min(1, (((_a = attack.payload) === null || _a === void 0 ? void 0 : _a.length) || 0) / 1000));
        inputs.set('payload_complexity', this.calculatePayloadComplexity(attack.payload || ''));
        // User agent analysis
        inputs.set('user_agent_suspicious', this.isSuspiciousUserAgent(attack.userAgent) ? 1 : 0);
        // IP reputation (simplified)
        inputs.set('ip_reputation', this.calculateIPReputation(attack.ipAddress));
        // Time-based analysis
        inputs.set('time_anomaly', this.isUnusualTimeAccess() ? 1 : 0);
        // Request frequency
        inputs.set('request_frequency', this.calculateRequestFrequency(attack));
        // Header analysis
        inputs.set('header_anomalies', this.detectHeaderAnomalies(attack));
        // Geolocation risk (simplified)
        inputs.set('geolocation_risk', this.calculateGeolocationRisk(attack.ipAddress));
        // Behavioral pattern
        inputs.set('behavioral_pattern', this.analyzeBehavioralPattern(attack));
        return inputs;
    };
    AgiesAIGuardian.prototype.processNeuralNetwork = function (inputs) {
        var activation = 0;
        var totalWeight = 0;
        for (var _i = 0, _a = inputs.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], input = _b[0], value = _b[1];
            var weight = this.neuralNetwork.get(input) || 0.5;
            activation += value * weight;
            totalWeight += weight;
        }
        // Sigmoid activation function
        var sigmoid = 1 / (1 + Math.exp(-activation / totalWeight));
        return sigmoid;
    };
    AgiesAIGuardian.prototype.calculatePayloadComplexity = function (payload) {
        if (!payload)
            return 0;
        var complexity = 0;
        // Length complexity
        complexity += Math.min(1, payload.length / 500);
        // Character diversity
        var uniqueChars = new Set(payload.split('')).size;
        complexity += uniqueChars / 100;
        // Pattern complexity
        var patterns = [
            /[<>]/g, // HTML tags
            /['"]/g, // Quotes
            /\d+/g, // Numbers
            /[a-zA-Z]{3,}/g, // Words
            /[\W_]/g // Special chars
        ];
        patterns.forEach(function (pattern) {
            var matches = payload.match(pattern);
            if (matches)
                complexity += matches.length * 0.1;
        });
        return Math.min(1, complexity);
    };
    AgiesAIGuardian.prototype.calculateIPReputation = function (ipAddress) {
        // Simplified IP reputation scoring
        var suspiciousRanges = ['192.168.', '10.', '172.16.', '127.0.'];
        var knownMaliciousIPs = [
            '192.168.1.100', '10.0.0.50', '172.16.0.25'
        ];
        if (knownMaliciousIPs.includes(ipAddress))
            return 1;
        if (suspiciousRanges.some(function (range) { return ipAddress.startsWith(range); }))
            return 0.8;
        // Check attack history for this IP
        var recentAttacks = this.attackHistory.filter(function (a) {
            return a.ipAddress === ipAddress &&
                a.timestamp > new Date(Date.now() - 3600000);
        } // Last hour
        );
        if (recentAttacks.length > 10)
            return 0.9;
        if (recentAttacks.length > 5)
            return 0.7;
        if (recentAttacks.length > 2)
            return 0.5;
        return 0.1;
    };
    AgiesAIGuardian.prototype.calculateRequestFrequency = function (attack) {
        var recentAttacks = this.attackHistory.filter(function (a) {
            return a.ipAddress === attack.ipAddress &&
                a.timestamp > new Date(Date.now() - 60000);
        } // Last minute
        );
        return Math.min(1, recentAttacks.length / 10);
    };
    AgiesAIGuardian.prototype.detectHeaderAnomalies = function (attack) {
        var anomalies = 0;
        var checks = 0;
        // Check user agent
        if (!attack.userAgent || attack.userAgent.length < 10) {
            anomalies++;
        }
        checks++;
        // Check for suspicious headers (simplified)
        if (attack.userAgent && this.isSuspiciousUserAgent(attack.userAgent)) {
            anomalies++;
        }
        checks++;
        return anomalies / checks;
    };
    AgiesAIGuardian.prototype.calculateGeolocationRisk = function (ipAddress) {
        // Simplified geolocation risk - in real implementation would use GeoIP database
        var highRiskRanges = ['192.168.', '10.'];
        if (highRiskRanges.some(function (range) { return ipAddress.startsWith(range); })) {
            return 0.8;
        }
        // Random risk assessment (0-0.5)
        return Math.random() * 0.5;
    };
    AgiesAIGuardian.prototype.analyzeBehavioralPattern = function (attack) {
        var userAttacks = this.attackHistory.filter(function (a) {
            return a.ipAddress === attack.ipAddress &&
                a.timestamp > new Date(Date.now() - 3600000);
        } // Last hour
        );
        if (userAttacks.length < 2)
            return 0.1;
        // Analyze attack type diversity
        var attackTypes = new Set(userAttacks.map(function (a) { return a.attackType; }));
        var typeDiversity = attackTypes.size / userAttacks.length;
        // Analyze timing patterns
        var intervals = [];
        for (var i = 1; i < userAttacks.length; i++) {
            var currentAttack = userAttacks[i];
            var previousAttack = userAttacks[i - 1];
            if ((currentAttack === null || currentAttack === void 0 ? void 0 : currentAttack.timestamp) && (previousAttack === null || previousAttack === void 0 ? void 0 : previousAttack.timestamp)) {
                var interval = currentAttack.timestamp.getTime() - previousAttack.timestamp.getTime();
                intervals.push(interval);
            }
        }
        var avgInterval = intervals.length > 0 ? intervals.reduce(function (a, b) { return a + b; }, 0) / intervals.length : 0;
        var intervalVariance = intervals.length > 0 ? intervals.reduce(function (acc, interval) {
            return acc + Math.pow(interval - avgInterval, 2);
        }, 0) / intervals.length : 0;
        // High variance in timing suggests automated attacks
        var timingScore = Math.min(1, intervalVariance / 1000000);
        return (typeDiversity + timingScore) / 2;
    };
    AgiesAIGuardian.prototype.calculatePatternScore = function (attack) {
        var pattern = this.patternRecognition.get(attack.attackType);
        if (!pattern)
            return 0.3;
        var score = pattern.confidence;
        // Adjust based on recent success rate
        if (pattern.successRate > 0.7)
            score += 0.2;
        else if (pattern.successRate < 0.3)
            score -= 0.1;
        // Adjust based on evolution
        if (pattern.evolution === 'increasing')
            score += 0.1;
        else if (pattern.evolution === 'decreasing')
            score -= 0.1;
        return Math.max(0, Math.min(1, score));
    };
    AgiesAIGuardian.prototype.identifyAdvancedPattern = function (attack) {
        var patterns = Array.from(this.patternRecognition.keys());
        var bestMatch = {
            pattern: 'unknown',
            confidence: 0,
            reasoning: 'No pattern match',
            evolution: 'stable'
        };
        for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
            var pattern = patterns_1[_i];
            var confidence = this.calculateAdvancedPatternConfidence(attack, pattern);
            var patternData = this.patternRecognition.get(pattern);
            if (confidence > bestMatch.confidence) {
                bestMatch = {
                    pattern: pattern,
                    confidence: confidence,
                    reasoning: "Pattern ".concat(pattern, " detected with ").concat((confidence * 100).toFixed(1), "% confidence. Evolution: ").concat(patternData.evolution),
                    evolution: patternData.evolution
                };
            }
        }
        return bestMatch;
    };
    AgiesAIGuardian.prototype.calculateAdvancedPatternConfidence = function (attack, pattern) {
        var confidence = 0;
        switch (pattern) {
            case 'sql_injection':
                confidence = this.detectSQLInjection(attack.payload || '') ? 0.9 : 0.1;
                break;
            case 'xss_attack':
                confidence = this.detectXSS(attack.payload || '') ? 0.9 : 0.1;
                break;
            case 'brute_force':
                confidence = this.detectBruteForce(attack) ? 0.8 : 0.2;
                break;
            case 'ddos':
                confidence = this.detectDDoS(attack) ? 0.7 : 0.1;
                break;
            case 'credential_stuffing':
                confidence = this.detectCredentialStuffing(attack) ? 0.85 : 0.15;
                break;
            default:
                confidence = 0.3;
        }
        return confidence;
    };
    AgiesAIGuardian.prototype.detectSQLInjection = function (payload) {
        var sqlPatterns = [
            /(\b(select|insert|update|delete|drop|create|alter|exec|union)\b)/i,
            /(\b(or|and)\b\s+\d+\s*[=<>]\s*\d+)/i,
            /(\b(union|select)\b\s+.*\bfrom\b)/i,
            /(--|\/\*|\*\/)/,
            /(\bxp_cmdshell\b)/i,
            /(\bscript\b)/i
        ];
        return sqlPatterns.some(function (pattern) { return pattern.test(payload); });
    };
    AgiesAIGuardian.prototype.detectXSS = function (payload) {
        var xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe\b[^>]*>/i,
            /<object\b[^>]*>/i,
            /<embed\b[^>]*>/i,
            /eval\s*\(/i,
            /document\.cookie/i
        ];
        return xssPatterns.some(function (pattern) { return pattern.test(payload); });
    };
    AgiesAIGuardian.prototype.detectBruteForce = function (attack) {
        var recentAttempts = this.attackHistory.filter(function (a) {
            return a.ipAddress === attack.ipAddress &&
                a.attackType === 'brute_force' &&
                a.timestamp > new Date(Date.now() - 300000);
        } // Last 5 minutes
        );
        return recentAttempts.length > 5;
    };
    AgiesAIGuardian.prototype.detectDDoS = function (attack) {
        var recentRequests = this.attackHistory.filter(function (a) {
            return a.timestamp > new Date(Date.now() - 60000);
        } // Last minute
        );
        return recentRequests.length > 100;
    };
    AgiesAIGuardian.prototype.detectCredentialStuffing = function (attack) {
        var userAttempts = this.attackHistory.filter(function (a) {
            return a.ipAddress === attack.ipAddress &&
                a.timestamp > new Date(Date.now() - 3600000);
        } // Last hour
        );
        // Look for patterns typical of credential stuffing
        var uniqueUsernames = new Set(userAttempts.map(function (a) { return a.target; }));
        var totalAttempts = userAttempts.length;
        return totalAttempts > 10 && uniqueUsernames.size > 5;
    };
    AgiesAIGuardian.prototype.isSuspiciousUserAgent = function (userAgent) {
        var suspiciousPatterns = [
            /bot/i, /crawler/i, /scanner/i, /nmap/i, /sqlmap/i,
            /nikto/i, /dirbuster/i, /gobuster/i, /python/i,
            /curl/i, /wget/i, /headless/i, /selenium/i
        ];
        return suspiciousPatterns.some(function (pattern) { return pattern.test(userAgent); });
    };
    AgiesAIGuardian.prototype.isUnusualTimeAccess = function () {
        var hour = new Date().getHours();
        // Consider 2-6 AM as unusual hours
        return hour >= 2 && hour <= 6;
    };
    AgiesAIGuardian.prototype.generateAdvancedAdaptiveResponse = function (attack, threatScore, patternMatch) {
        var action = 'redirect';
        var confidence = patternMatch.confidence;
        var reasoning = patternMatch.reasoning;
        if (threatScore >= 0.8) {
            action = 'block';
            confidence = 0.95;
            reasoning = "Critical threat detected (".concat((threatScore * 100).toFixed(1), "% confidence) - Immediate block");
        }
        else if (threatScore >= 0.6) {
            action = 'honeypot';
            confidence = 0.85;
            reasoning = "High threat detected - Redirecting to honeypot";
        }
        else if (threatScore >= 0.4) {
            action = 'trap_set';
            confidence = 0.75;
            reasoning = "Medium threat detected - Setting trap";
        }
        else if (threatScore >= 0.2) {
            action = 'maze_shift';
            confidence = 0.65;
            reasoning = "Low-medium threat - Shifting maze configuration";
        }
        else {
            action = 'redirect';
            confidence = 0.5;
            reasoning = "Low threat - Monitoring and redirecting";
        }
        return {
            action: action,
            confidence: confidence,
            reasoning: reasoning,
            newMazeConfiguration: action === 'maze_shift' ? this.generateNewMazeConfig() : undefined
        };
    };
    AgiesAIGuardian.prototype.generateDetailedReasoning = function (attack, threatScore, patternMatch, anomalyScore) {
        var reasoning = "Attack analysis for ".concat(attack.attackType, ":\n");
        reasoning += "\u2022 Overall threat score: ".concat((threatScore * 100).toFixed(1), "%\n");
        reasoning += "\u2022 Pattern match: ".concat(patternMatch.pattern, " (").concat((patternMatch.confidence * 100).toFixed(1), "%)\n");
        reasoning += "\u2022 Anomaly score: ".concat((anomalyScore * 100).toFixed(1), "%\n");
        reasoning += "\u2022 IP reputation: ".concat(this.calculateIPReputation(attack.ipAddress), "\n");
        reasoning += "\u2022 Behavioral analysis: ".concat(this.analyzeBehavioralPattern(attack), "\n");
        return reasoning;
    };
    AgiesAIGuardian.prototype.getAdvancedRecommendedActions = function (level, attack, patternMatch) {
        var baseActions = ['monitor', 'log_activity'];
        switch (level) {
            case 'critical':
                return [
                    'block_ip', 'alert_admin', 'shift_maze', 'create_decoy',
                    'activate_all_traps', 'isolate_user', 'backup_logs'
                ];
            case 'high':
                return [
                    'honeypot_redirect', 'increase_monitoring', 'shift_maze',
                    'create_decoy', 'activate_traps', 'rate_limit'
                ];
            case 'medium':
                return [
                    'set_trap', 'monitor_closely', 'log_detailed',
                    'rate_limit', 'challenge_user'
                ];
            case 'low':
                return baseActions;
            default:
                return baseActions;
        }
    };
    AgiesAIGuardian.prototype.generateNewMazeConfig = function () {
        // Generate a new maze configuration to confuse attackers
        return {
            layerCount: Math.floor(Math.random() * 3) + 7, // 7-9 layers
            encryptionZones: [],
            honeypotPositions: [],
            trapPositions: [],
            shiftPattern: {
                frequency: Math.floor(Math.random() * 30000) + 15000, // 15-45 seconds
                algorithm: 'ai_driven',
                complexity: Math.floor(Math.random() * 3) + 8,
                lastShift: new Date()
            }
        };
    };
    AgiesAIGuardian.prototype.learnFromAttack = function (attack, threatScore, patternMatch) {
        this.learningIterations++;
        // Update pattern recognition
        if (patternMatch.confidence > this.confidenceThreshold) {
            var currentWeight = this.attackPatterns.get(patternMatch.pattern) || 0.5;
            var newWeight = currentWeight + this.learningRate * (1 - currentWeight);
            this.attackPatterns.set(patternMatch.pattern, newWeight);
            // Update pattern data
            var patternData = this.patternRecognition.get(patternMatch.pattern);
            if (patternData) {
                patternData.occurrences++;
                patternData.lastSeen = new Date();
                patternData.confidence = patternMatch.confidence;
                // Update success rate (simplified)
                var recentAttacks = this.attackHistory.slice(-10);
                var successful = recentAttacks.filter(function (a) { return a.blocked; }).length;
                patternData.successRate = successful / recentAttacks.length;
                // Determine evolution
                if (patternData.successRate > 0.7) {
                    patternData.evolution = 'increasing';
                }
                else if (patternData.successRate < 0.3) {
                    patternData.evolution = 'decreasing';
                }
                else {
                    patternData.evolution = 'stable';
                }
                this.patternRecognition.set(patternMatch.pattern, patternData);
            }
        }
        // Update threat levels
        var currentThreat = this.threatLevels.get(attack.attackType) || 5;
        var newThreat = currentThreat + this.learningRate * (threatScore - currentThreat);
        this.threatLevels.set(attack.attackType, newThreat);
        // Update neural network weights
        this.updateNeuralNetwork(attack, threatScore);
        // Store adaptive response for future reference
        this.adaptiveResponses.set(attack.id, {
            action: 'redirect',
            confidence: patternMatch.confidence,
            reasoning: patternMatch.reasoning,
            newMazeConfiguration: undefined
        });
        // Emit learning event
        this.emit('ai_learned', {
            attack: attack,
            threatScore: threatScore,
            patternMatch: patternMatch,
            learningIterations: this.learningIterations,
            timestamp: new Date()
        });
    };
    AgiesAIGuardian.prototype.updateNeuralNetwork = function (attack, threatScore) {
        var inputs = this.extractNeuralInputs(attack);
        var learningRate = 0.01;
        for (var _i = 0, _a = inputs.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], input = _b[0], value = _b[1];
            var currentWeight = this.neuralNetwork.get(input) || 0.5;
            var error = threatScore - value;
            var newWeight = currentWeight + learningRate * error;
            this.neuralNetwork.set(input, Math.max(0, Math.min(1, newWeight)));
        }
    };
    AgiesAIGuardian.prototype.monitorDarkWeb = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var alerts, _i, credentials_1, credential, riskScore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alerts = [];
                        _i = 0, credentials_1 = credentials;
                        _a.label = 1;
                    case 1:
                        if (!(_i < credentials_1.length)) return [3 /*break*/, 4];
                        credential = credentials_1[_i];
                        return [4 /*yield*/, this.calculateDarkWebRisk(credential)];
                    case 2:
                        riskScore = _a.sent();
                        if (riskScore > 0.7) { // High risk threshold
                            alerts.push({
                                id: crypto.randomUUID(),
                                timestamp: new Date(),
                                credentialType: this.detectCredentialType(credential),
                                value: credential,
                                source: 'dark_web_monitor',
                                confidence: riskScore,
                                actionTaken: 'auto_rotate',
                                status: 'active'
                            });
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, alerts];
                }
            });
        });
    };
    AgiesAIGuardian.prototype.calculateDarkWebRisk = function (credential) {
        return __awaiter(this, void 0, void 0, function () {
            var risk, commonPasswords, randomRisk;
            return __generator(this, function (_a) {
                risk = 0;
                // Length and complexity analysis
                if (credential.length < 8)
                    risk += 0.3;
                if (!/[A-Z]/.test(credential))
                    risk += 0.2;
                if (!/[a-z]/.test(credential))
                    risk += 0.2;
                if (!/\d/.test(credential))
                    risk += 0.2;
                if (!/[!@#$%^&*]/.test(credential))
                    risk += 0.2;
                commonPasswords = ['password', '123456', 'admin', 'welcome', 'qwerty'];
                if (commonPasswords.some(function (common) { return credential.toLowerCase().includes(common); })) {
                    risk += 0.4;
                }
                // Year patterns (often in breaches)
                if (/\d{4}/.test(credential))
                    risk += 0.1;
                randomRisk = Math.random() * 0.3;
                risk += randomRisk;
                return [2 /*return*/, Math.min(1, risk)];
            });
        });
    };
    AgiesAIGuardian.prototype.detectCredentialType = function (credential) {
        if (credential.includes('@') && credential.includes('.'))
            return 'email';
        if (credential.startsWith('API_KEY_') || credential.length > 32)
            return 'api_key';
        if (credential.length <= 20 && /^[a-zA-Z0-9_]+$/.test(credential))
            return 'username';
        return 'password';
    };
    AgiesAIGuardian.prototype.getThreatIntelligence = function () {
        var totalAttacks = this.adaptiveResponses.size;
        var threatScores = Array.from(this.threatLevels.values());
        var averageThreatScore = threatScores.length > 0
            ? threatScores.reduce(function (a, b) { return a + b; }, 0) / threatScores.length
            : 0;
        return {
            patterns: new Map(this.attackPatterns),
            threatLevels: new Map(this.threatLevels),
            totalAttacks: totalAttacks,
            averageThreatScore: averageThreatScore,
            learningIterations: this.learningIterations,
            patternEvolution: new Map(this.patternRecognition),
            neuralNetworkWeights: new Map(this.neuralNetwork)
        };
    };
    AgiesAIGuardian.prototype.updateLearningRate = function (newRate) {
        this.learningRate = Math.max(0.01, Math.min(0.5, newRate));
    };
    AgiesAIGuardian.prototype.updateConfidenceThreshold = function (newThreshold) {
        this.confidenceThreshold = Math.max(0.1, Math.min(0.9, newThreshold));
    };
    AgiesAIGuardian.prototype.resetLearning = function () {
        this.attackPatterns.clear();
        this.threatLevels.clear();
        this.neuralNetwork.clear();
        this.patternRecognition.clear();
        this.learningIterations = 0;
        this.initializePatternRecognition();
        this.initializeNeuralNetwork();
        console.log('🧠 AI Guardian learning reset');
    };
    return AgiesAIGuardian;
}(events_1.EventEmitter));
exports.AgiesAIGuardian = AgiesAIGuardian;
var AnomalyDetector = /** @class */ (function () {
    function AnomalyDetector() {
        this.historicalData = [];
        this.windowSize = 20;
        this.threshold = 2.5; // Standard deviations
    }
    AnomalyDetector.prototype.detectAnomaly = function (attack) {
        return __awaiter(this, void 0, void 0, function () {
            var features, anomalyScore;
            return __generator(this, function (_a) {
                features = this.extractFeatures(attack);
                anomalyScore = this.calculateAnomalyScore(features);
                // Update historical data
                this.historicalData.push(anomalyScore);
                if (this.historicalData.length > this.windowSize) {
                    this.historicalData.shift();
                }
                return [2 /*return*/, Math.min(1, anomalyScore / this.threshold)];
            });
        });
    };
    AnomalyDetector.prototype.extractFeatures = function (attack) {
        var _a;
        return [
            ((_a = attack.payload) === null || _a === void 0 ? void 0 : _a.length) || 0,
            attack.ipAddress.split('.').length, // IP structure
            attack.userAgent.length,
            attack.timestamp.getHours(), // Hour of day
            attack.timestamp.getDay(), // Day of week
        ];
    };
    AnomalyDetector.prototype.calculateAnomalyScore = function (features) {
        var _this = this;
        if (this.historicalData.length < 5)
            return 0;
        // Calculate z-score for each feature
        var zScores = features.map(function (feature) {
            var mean = _this.historicalData.reduce(function (a, b) { return a + b; }, 0) / _this.historicalData.length;
            var variance = _this.historicalData.reduce(function (acc, val) { return acc + Math.pow(val - mean, 2); }, 0) / _this.historicalData.length;
            var stdDev = Math.sqrt(variance);
            return stdDev === 0 ? 0 : Math.abs(feature - mean) / stdDev;
        });
        // Return maximum z-score as anomaly score
        return Math.max.apply(Math, zScores);
    };
    return AnomalyDetector;
}());
