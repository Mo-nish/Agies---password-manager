import {
  AttackAttempt,
  AIResponse,
  MazeConfiguration,
  SecurityEvent,
  DarkWebAlert,
  AIThreatLevel
} from '../core/types';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';

/**
 * Agies Enhanced AI Guardian
 * The intelligent brain behind the Chakravyuham security system
 * Learns from attacks, predicts threats, and dynamically adjusts the maze
 */
export class AgiesAIGuardian extends EventEmitter {
  private attackPatterns: Map<string, number> = new Map();
  private threatLevels: Map<string, number> = new Map();
  private adaptiveResponses: Map<string, AIResponse> = new Map();
  private learningRate: number = 0.1;
  private confidenceThreshold: number = 0.7;
  private maxThreatLevel: number = 10;
  private neuralNetwork: Map<string, number> = new Map(); // Simplified neural network
  private patternRecognition: Map<string, PatternData> = new Map();
  private anomalyDetection: AnomalyDetector;

  // AI Guardian memory and learning
  private attackHistory: AttackAttempt[] = [];
  private successfulAttacks: AttackAttempt[] = [];
  private failedAttacks: AttackAttempt[] = [];
  private learningIterations: number = 0;

  constructor() {
    super();
    this.initializePatternRecognition();
    this.initializeNeuralNetwork();
    this.anomalyDetection = new AnomalyDetector();
    console.log('🧠 Agies AI Guardian initialized with advanced threat detection');
  }

  private initializePatternRecognition(): void {
    // Known attack patterns with initial weights
    const knownPatterns = [
      'sql_injection', 'xss_attack', 'brute_force', 'ddos',
      'phishing', 'malware_signature', 'credential_stuffing',
      'session_hijacking', 'directory_traversal', 'command_injection',
      'csrf_attack', 'open_redirect', 'host_header_injection',
      'xml_injection', 'ssrf_attack', 'file_inclusion'
    ];

    knownPatterns.forEach((pattern, index) => {
      this.attackPatterns.set(pattern, 0.8);
      this.threatLevels.set(pattern, 5 + (index % 5)); // Varying threat levels
      this.patternRecognition.set(pattern, {
        pattern,
        occurrences: 0,
        successRate: 0,
        lastSeen: new Date(0),
        confidence: 0.5,
        evolution: 'stable'
      });
    });
  }

  private initializeNeuralNetwork(): void {
    // Simplified neural network weights for threat classification
    const networkWeights = [
      'payload_length', 'user_agent_suspicious', 'ip_reputation',
      'time_anomaly', 'request_frequency', 'payload_complexity',
      'header_anomalies', 'geolocation_risk', 'behavioral_pattern'
    ];

    networkWeights.forEach(weight => {
      this.neuralNetwork.set(weight, Math.random());
    });
  }

  public async analyzeThreat(attack: AttackAttempt): Promise<AIThreatLevel> {
    const threatScore = this.calculateAdvancedThreatScore(attack);
    const patternMatch = this.identifyAdvancedPattern(attack);
    const anomalyScore = await this.anomalyDetection.detectAnomaly(attack);
    const behavioralAnalysis = this.analyzeBehavioralPattern(attack);

    // Combine all analysis methods
    const combinedScore = (threatScore * 0.4) + (patternMatch.confidence * 0.3) +
                          (anomalyScore * 0.2) + (behavioralAnalysis * 0.1);

    const adaptiveResponse = this.generateAdvancedAdaptiveResponse(attack, combinedScore, patternMatch);

    // Learn from this attack
    this.learnFromAttack(attack, combinedScore, patternMatch);

    // Emit analysis results
    this.emit('ai_analysis', {
      attack,
      threatScore: combinedScore,
      patternMatch,
      anomalyScore,
      behavioralAnalysis,
      response: adaptiveResponse,
      timestamp: new Date()
    });

    // Determine threat level
    let level: AIThreatLevel['level'] = 'low';
    if (combinedScore >= 0.8) level = 'critical';
    else if (combinedScore >= 0.6) level = 'high';
    else if (combinedScore >= 0.4) level = 'medium';

    return {
      level,
      score: combinedScore * 100,
      confidence: patternMatch.confidence,
      reasoning: this.generateDetailedReasoning(attack, combinedScore, patternMatch, anomalyScore),
      recommendedActions: this.getAdvancedRecommendedActions(level, attack, patternMatch),
      timestamp: new Date()
    };
  }

  private calculateAdvancedThreatScore(attack: AttackAttempt): number {
    let score = 0;
    let factors = 0;

    // Neural network-based scoring
    const neuralInputs = this.extractNeuralInputs(attack);
    const neuralScore = this.processNeuralNetwork(neuralInputs);
    score += neuralScore * 0.6;
    factors += 0.6;

    // Pattern-based scoring
    const patternScore = this.calculatePatternScore(attack);
    score += patternScore * 0.4;
    factors += 0.4;

    return score / factors;
  }

  private extractNeuralInputs(attack: AttackAttempt): Map<string, number> {
    const inputs = new Map<string, number>();

    // Payload analysis
    inputs.set('payload_length', Math.min(1, (attack.payload?.length || 0) / 1000));
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
  }

  private processNeuralNetwork(inputs: Map<string, number>): number {
    let activation = 0;
    let totalWeight = 0;

    for (const [input, value] of inputs.entries()) {
      const weight = this.neuralNetwork.get(input) || 0.5;
      activation += value * weight;
      totalWeight += weight;
    }

    // Sigmoid activation function
    const sigmoid = 1 / (1 + Math.exp(-activation / totalWeight));
    return sigmoid;
  }

  private calculatePayloadComplexity(payload: string): number {
    if (!payload) return 0;

    let complexity = 0;

    // Length complexity
    complexity += Math.min(1, payload.length / 500);

    // Character diversity
    const uniqueChars = new Set(payload.split('')).size;
    complexity += uniqueChars / 100;

    // Pattern complexity
    const patterns = [
      /[<>]/g, // HTML tags
      /['"]/g, // Quotes
      /\d+/g, // Numbers
      /[a-zA-Z]{3,}/g, // Words
      /[\W_]/g // Special chars
    ];

    patterns.forEach(pattern => {
      const matches = payload.match(pattern);
      if (matches) complexity += matches.length * 0.1;
    });

    return Math.min(1, complexity);
  }

  private calculateIPReputation(ipAddress: string): number {
    // Simplified IP reputation scoring
    const suspiciousRanges = ['192.168.', '10.', '172.16.', '127.0.'];
    const knownMaliciousIPs = [
      '192.168.1.100', '10.0.0.50', '172.16.0.25'
    ];

    if (knownMaliciousIPs.includes(ipAddress)) return 1;
    if (suspiciousRanges.some(range => ipAddress.startsWith(range))) return 0.8;

    // Check attack history for this IP
    const recentAttacks = this.attackHistory.filter(a =>
      a.ipAddress === ipAddress &&
      a.timestamp > new Date(Date.now() - 3600000) // Last hour
    );

    if (recentAttacks.length > 10) return 0.9;
    if (recentAttacks.length > 5) return 0.7;
    if (recentAttacks.length > 2) return 0.5;

    return 0.1;
  }

  private calculateRequestFrequency(attack: AttackAttempt): number {
    const recentAttacks = this.attackHistory.filter(a =>
      a.ipAddress === attack.ipAddress &&
      a.timestamp > new Date(Date.now() - 60000) // Last minute
    );

    return Math.min(1, recentAttacks.length / 10);
  }

  private detectHeaderAnomalies(attack: AttackAttempt): number {
    let anomalies = 0;
    let checks = 0;

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
  }

  private calculateGeolocationRisk(ipAddress: string): number {
    // Simplified geolocation risk - in real implementation would use GeoIP database
    const highRiskRanges = ['192.168.', '10.'];

    if (highRiskRanges.some(range => ipAddress.startsWith(range))) {
      return 0.8;
    }

    // Random risk assessment (0-0.5)
    return Math.random() * 0.5;
  }

  private analyzeBehavioralPattern(attack: AttackAttempt): number {
    const userAttacks = this.attackHistory.filter(a =>
      a.ipAddress === attack.ipAddress &&
      a.timestamp > new Date(Date.now() - 3600000) // Last hour
    );

    if (userAttacks.length < 2) return 0.1;

    // Analyze attack type diversity
    const attackTypes = new Set(userAttacks.map(a => a.attackType));
    const typeDiversity = attackTypes.size / userAttacks.length;

    // Analyze timing patterns
    const intervals: number[] = [];
    for (let i = 1; i < userAttacks.length; i++) {
      const currentAttack = userAttacks[i];
      const previousAttack = userAttacks[i-1];
      if (currentAttack?.timestamp && previousAttack?.timestamp) {
        const interval = currentAttack.timestamp.getTime() - previousAttack.timestamp.getTime();
        intervals.push(interval);
      }
    }

    const avgInterval = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
    const intervalVariance = intervals.length > 0 ? intervals.reduce((acc, interval) => {
      return acc + Math.pow(interval - avgInterval, 2);
    }, 0) / intervals.length : 0;

    // High variance in timing suggests automated attacks
    const timingScore = Math.min(1, intervalVariance / 1000000);

    return (typeDiversity + timingScore) / 2;
  }

  private calculatePatternScore(attack: AttackAttempt): number {
    const pattern = this.patternRecognition.get(attack.attackType);
    if (!pattern) return 0.3;

    let score = pattern.confidence;

    // Adjust based on recent success rate
    if (pattern.successRate > 0.7) score += 0.2;
    else if (pattern.successRate < 0.3) score -= 0.1;

    // Adjust based on evolution
    if (pattern.evolution === 'increasing') score += 0.1;
    else if (pattern.evolution === 'decreasing') score -= 0.1;

    return Math.max(0, Math.min(1, score));
  }

  private identifyAdvancedPattern(attack: AttackAttempt): {
    pattern: string;
    confidence: number;
    reasoning: string;
    evolution: string;
  } {
    const patterns = Array.from(this.patternRecognition.keys());
    let bestMatch = {
      pattern: 'unknown',
      confidence: 0,
      reasoning: 'No pattern match',
      evolution: 'stable'
    };

    for (const pattern of patterns) {
      const confidence = this.calculateAdvancedPatternConfidence(attack, pattern);
      const patternData = this.patternRecognition.get(pattern)!;

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          pattern,
          confidence,
          reasoning: `Pattern ${pattern} detected with ${(confidence * 100).toFixed(1)}% confidence. Evolution: ${patternData.evolution}`,
          evolution: patternData.evolution
        };
      }
    }

    return bestMatch;
  }

  private calculateAdvancedPatternConfidence(attack: AttackAttempt, pattern: string): number {
    let confidence = 0;

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
  }

  private detectSQLInjection(payload: string): boolean {
    const sqlPatterns = [
      /(\b(select|insert|update|delete|drop|create|alter|exec|union)\b)/i,
      /(\b(or|and)\b\s+\d+\s*[=<>]\s*\d+)/i,
      /(\b(union|select)\b\s+.*\bfrom\b)/i,
      /(--|\/\*|\*\/)/,
      /(\bxp_cmdshell\b)/i,
      /(\bscript\b)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(payload));
  }

  private detectXSS(payload: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe\b[^>]*>/i,
      /<object\b[^>]*>/i,
      /<embed\b[^>]*>/i,
      /eval\s*\(/i,
      /document\.cookie/i
    ];

    return xssPatterns.some(pattern => pattern.test(payload));
  }

  private detectBruteForce(attack: AttackAttempt): boolean {
    const recentAttempts = this.attackHistory.filter(a =>
      a.ipAddress === attack.ipAddress &&
      a.attackType === 'brute_force' &&
      a.timestamp > new Date(Date.now() - 300000) // Last 5 minutes
    );

    return recentAttempts.length > 5;
  }

  private detectDDoS(attack: AttackAttempt): boolean {
    const recentRequests = this.attackHistory.filter(a =>
      a.timestamp > new Date(Date.now() - 60000) // Last minute
    );

    return recentRequests.length > 100;
  }

  private detectCredentialStuffing(attack: AttackAttempt): boolean {
    const userAttempts = this.attackHistory.filter(a =>
      a.ipAddress === attack.ipAddress &&
      a.timestamp > new Date(Date.now() - 3600000) // Last hour
    );

    // Look for patterns typical of credential stuffing
    const uniqueUsernames = new Set(userAttempts.map(a => a.target));
    const totalAttempts = userAttempts.length;

    return totalAttempts > 10 && uniqueUsernames.size > 5;
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i, /crawler/i, /scanner/i, /nmap/i, /sqlmap/i,
      /nikto/i, /dirbuster/i, /gobuster/i, /python/i,
      /curl/i, /wget/i, /headless/i, /selenium/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  private isUnusualTimeAccess(): boolean {
    const hour = new Date().getHours();
    // Consider 2-6 AM as unusual hours
    return hour >= 2 && hour <= 6;
  }

  private generateAdvancedAdaptiveResponse(
    attack: AttackAttempt,
    threatScore: number,
    patternMatch: { pattern: string; confidence: number; reasoning: string }
  ): AIResponse {
    let action: AIResponse['action'] = 'redirect';
    let confidence = patternMatch.confidence;
    let reasoning = patternMatch.reasoning;

    if (threatScore >= 0.8) {
      action = 'block';
      confidence = 0.95;
      reasoning = `Critical threat detected (${(threatScore * 100).toFixed(1)}% confidence) - Immediate block`;
    } else if (threatScore >= 0.6) {
      action = 'honeypot';
      confidence = 0.85;
      reasoning = `High threat detected - Redirecting to honeypot`;
    } else if (threatScore >= 0.4) {
      action = 'trap_set';
      confidence = 0.75;
      reasoning = `Medium threat detected - Setting trap`;
    } else if (threatScore >= 0.2) {
      action = 'maze_shift';
      confidence = 0.65;
      reasoning = `Low-medium threat - Shifting maze configuration`;
    } else {
      action = 'redirect';
      confidence = 0.5;
      reasoning = `Low threat - Monitoring and redirecting`;
    }

    return {
      action,
      confidence,
      reasoning,
      newMazeConfiguration: action === 'maze_shift' ? this.generateNewMazeConfig() : undefined
    };
  }

  private generateDetailedReasoning(
    attack: AttackAttempt,
    threatScore: number,
    patternMatch: any,
    anomalyScore: number
  ): string {
    let reasoning = `Attack analysis for ${attack.attackType}:\n`;
    reasoning += `• Overall threat score: ${(threatScore * 100).toFixed(1)}%\n`;
    reasoning += `• Pattern match: ${patternMatch.pattern} (${(patternMatch.confidence * 100).toFixed(1)}%)\n`;
    reasoning += `• Anomaly score: ${(anomalyScore * 100).toFixed(1)}%\n`;
    reasoning += `• IP reputation: ${this.calculateIPReputation(attack.ipAddress)}\n`;
    reasoning += `• Behavioral analysis: ${this.analyzeBehavioralPattern(attack)}\n`;

    return reasoning;
  }

  private getAdvancedRecommendedActions(
    level: AIThreatLevel['level'],
    attack: AttackAttempt,
    patternMatch: any
  ): string[] {
    const baseActions = ['monitor', 'log_activity'];

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
  }

  private generateNewMazeConfig(): MazeConfiguration {
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
  }

  private learnFromAttack(
    attack: AttackAttempt,
    threatScore: number,
    patternMatch: { pattern: string; confidence: number; reasoning: string }
  ): void {
    this.learningIterations++;

    // Update pattern recognition
    if (patternMatch.confidence > this.confidenceThreshold) {
      const currentWeight = this.attackPatterns.get(patternMatch.pattern) || 0.5;
      const newWeight = currentWeight + this.learningRate * (1 - currentWeight);
      this.attackPatterns.set(patternMatch.pattern, newWeight);

      // Update pattern data
      const patternData = this.patternRecognition.get(patternMatch.pattern);
      if (patternData) {
        patternData.occurrences++;
        patternData.lastSeen = new Date();
        patternData.confidence = patternMatch.confidence;

        // Update success rate (simplified)
        const recentAttacks = this.attackHistory.slice(-10);
        const successful = recentAttacks.filter(a => a.blocked).length;
        patternData.successRate = successful / recentAttacks.length;

        // Determine evolution
        if (patternData.successRate > 0.7) {
          patternData.evolution = 'increasing';
        } else if (patternData.successRate < 0.3) {
          patternData.evolution = 'decreasing';
        } else {
          patternData.evolution = 'stable';
        }

        this.patternRecognition.set(patternMatch.pattern, patternData);
      }
    }

    // Update threat levels
    const currentThreat = this.threatLevels.get(attack.attackType) || 5;
    const newThreat = currentThreat + this.learningRate * (threatScore - currentThreat);
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
      attack,
      threatScore,
      patternMatch,
      learningIterations: this.learningIterations,
      timestamp: new Date()
    });
  }

  private updateNeuralNetwork(attack: AttackAttempt, threatScore: number): void {
    const inputs = this.extractNeuralInputs(attack);
    const learningRate = 0.01;

    for (const [input, value] of inputs.entries()) {
      const currentWeight = this.neuralNetwork.get(input) || 0.5;
      const error = threatScore - value;
      const newWeight = currentWeight + learningRate * error;
      this.neuralNetwork.set(input, Math.max(0, Math.min(1, newWeight)));
    }
  }

  public async monitorDarkWeb(credentials: string[]): Promise<DarkWebAlert[]> {
    const alerts: DarkWebAlert[] = [];

    for (const credential of credentials) {
      // In real implementation, this would check against dark web monitoring services
      // For now, simulate with advanced pattern matching
      const riskScore = await this.calculateDarkWebRisk(credential);

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
    }

    return alerts;
  }

  private async calculateDarkWebRisk(credential: string): Promise<number> {
    // Simplified dark web risk calculation
    // In real implementation, would use multiple dark web sources

    let risk = 0;

    // Length and complexity analysis
    if (credential.length < 8) risk += 0.3;
    if (!/[A-Z]/.test(credential)) risk += 0.2;
    if (!/[a-z]/.test(credential)) risk += 0.2;
    if (!/\d/.test(credential)) risk += 0.2;
    if (!/[!@#$%^&*]/.test(credential)) risk += 0.2;

    // Common password patterns
    const commonPasswords = ['password', '123456', 'admin', 'welcome', 'qwerty'];
    if (commonPasswords.some(common => credential.toLowerCase().includes(common))) {
      risk += 0.4;
    }

    // Year patterns (often in breaches)
    if (/\d{4}/.test(credential)) risk += 0.1;

    // Random chance to simulate real dark web detection
    const randomRisk = Math.random() * 0.3;
    risk += randomRisk;

    return Math.min(1, risk);
  }

  private detectCredentialType(credential: string): DarkWebAlert['credentialType'] {
    if (credential.includes('@') && credential.includes('.')) return 'email';
    if (credential.startsWith('API_KEY_') || credential.length > 32) return 'api_key';
    if (credential.length <= 20 && /^[a-zA-Z0-9_]+$/.test(credential)) return 'username';
    return 'password';
  }

  public getThreatIntelligence(): {
    patterns: Map<string, number>;
    threatLevels: Map<string, number>;
    totalAttacks: number;
    averageThreatScore: number;
    learningIterations: number;
    patternEvolution: Map<string, PatternData>;
    neuralNetworkWeights: Map<string, number>;
  } {
    const totalAttacks = this.adaptiveResponses.size;
    const threatScores = Array.from(this.threatLevels.values());
    const averageThreatScore = threatScores.length > 0
      ? threatScores.reduce((a, b) => a + b, 0) / threatScores.length
      : 0;

    return {
      patterns: new Map(this.attackPatterns),
      threatLevels: new Map(this.threatLevels),
      totalAttacks,
      averageThreatScore,
      learningIterations: this.learningIterations,
      patternEvolution: new Map(this.patternRecognition),
      neuralNetworkWeights: new Map(this.neuralNetwork)
    };
  }

  public updateLearningRate(newRate: number): void {
    this.learningRate = Math.max(0.01, Math.min(0.5, newRate));
  }

  public updateConfidenceThreshold(newThreshold: number): void {
    this.confidenceThreshold = Math.max(0.1, Math.min(0.9, newThreshold));
  }

  public resetLearning(): void {
    this.attackPatterns.clear();
    this.threatLevels.clear();
    this.neuralNetwork.clear();
    this.patternRecognition.clear();
    this.learningIterations = 0;
    this.initializePatternRecognition();
    this.initializeNeuralNetwork();
    console.log('🧠 AI Guardian learning reset');
  }
}

// Helper classes

interface PatternData {
  pattern: string;
  occurrences: number;
  successRate: number;
  lastSeen: Date;
  confidence: number;
  evolution: 'increasing' | 'decreasing' | 'stable';
}

class AnomalyDetector {
  private historicalData: number[] = [];
  private windowSize = 20;
  private threshold = 2.5; // Standard deviations

  async detectAnomaly(attack: AttackAttempt): Promise<number> {
    // Simplified anomaly detection using statistical methods
    const features = this.extractFeatures(attack);
    const anomalyScore = this.calculateAnomalyScore(features);

    // Update historical data
    this.historicalData.push(anomalyScore);
    if (this.historicalData.length > this.windowSize) {
      this.historicalData.shift();
    }

    return Math.min(1, anomalyScore / this.threshold);
  }

  private extractFeatures(attack: AttackAttempt): number[] {
    return [
      attack.payload?.length || 0,
      attack.ipAddress.split('.').length, // IP structure
      attack.userAgent.length,
      attack.timestamp.getHours(), // Hour of day
      attack.timestamp.getDay(), // Day of week
    ];
  }

  private calculateAnomalyScore(features: number[]): number {
    if (this.historicalData.length < 5) return 0;

    // Calculate z-score for each feature
    const zScores = features.map(feature => {
      const mean = this.historicalData.reduce((a, b) => a + b, 0) / this.historicalData.length;
      const variance = this.historicalData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / this.historicalData.length;
      const stdDev = Math.sqrt(variance);

      return stdDev === 0 ? 0 : Math.abs(feature - mean) / stdDev;
    });

    // Return maximum z-score as anomaly score
    return Math.max(...zScores);
  }
}
