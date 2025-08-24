import {
  HoneypotPosition,
  DecoyVault,
  AttackAttempt,
  SecurityEvent
} from '../core/types';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';

/**
 * Agies Honeytoken & Decoy Vault Service
 * Creates and manages deceptive security elements to trap attackers
 */
export class HoneytokenService extends EventEmitter {
  private honeypots: Map<string, HoneypotPosition> = new Map();
  private decoyVaults: Map<string, DecoyVault> = new Map();
  private triggeredHoneypots: Set<string> = new Set();
  private triggeredDecoyVaults: Set<string> = new Set();
  private attackPatterns: Map<string, number> = new Map();

  constructor() {
    super();
    this.initializeDefaultHoneypots();
    this.initializeDefaultDecoyVaults();
    console.log('🍯 Agies Honeytoken Service initialized');
  }

  // === HONEYPOT MANAGEMENT ===

  private initializeDefaultHoneypots(): void {
    // Create honeypots for each chakra layer
    const chakraLayers = ['muladhara', 'svadhishthana', 'manipura', 'anahata', 'vishuddha', 'ajna', 'sahasrara'];

    chakraLayers.forEach((chakra, layer) => {
      // Create multiple honeypots per layer
      for (let i = 0; i < 3 + layer; i++) {
        const honeypotId = `${chakra}_honeypot_${i}`;
        const honeypot: HoneypotPosition = {
          id: honeypotId,
          layer: layer,
          position: this.generateRandomPosition(),
          fakeData: this.generateFakeDataForLayer(layer),
          triggerConditions: this.generateTriggerConditionsForLayer(layer),
          responseDelay: this.calculateResponseDelay(layer)
        };

        this.honeypots.set(honeypotId, honeypot);
      }
    });
  }

  private generateRandomPosition(): number {
    return Math.floor(Math.random() * 100);
  }

  private generateFakeDataForLayer(layer: number): string {
    const fakeDataSets = [
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

    const layerData = fakeDataSets[layer] || fakeDataSets[0];
    return layerData[Math.floor(Math.random() * layerData.length)]!;
  }

  private generateTriggerConditionsForLayer(layer: number): string[] {
    const baseConditions = ['rapid_requests', 'suspicious_pattern', 'known_attacker_ip'];
    const advancedConditions = [
      'unusual_time_access', 'geographic_anomaly', 'device_fingerprint_mismatch',
      'behavioral_pattern_change', 'credential_stuffing_indicators',
      'automated_access', 'unusual_request_pattern', 'brute_force_attempt'
    ];

    if (layer < 3) {
      return baseConditions.slice(0, Math.floor(Math.random() * 2) + 1);
    } else {
      const mixedConditions = [...baseConditions, ...advancedConditions];
      return mixedConditions.slice(0, Math.floor(Math.random() * 5) + 2);
    }
  }

  private calculateResponseDelay(layer: number): number {
    // Inner layers have more realistic delays to make them convincing
    return Math.floor(Math.random() * 3000) + (layer * 500) + 1000;
  }

  public async triggerHoneypot(honeypotId: string, attack: AttackAttempt): Promise<HoneypotPosition | null> {
    const honeypot = this.honeypots.get(honeypotId);
    if (!honeypot || this.triggeredHoneypots.has(honeypotId)) {
      return null;
    }

    this.triggeredHoneypots.add(honeypotId);

    // Log honeypot trigger
    this.emit('honeypot_triggered', {
      honeypot,
      attack,
      timestamp: new Date(),
      type: 'honeypot_trigger'
    });

    // Generate security event
    const securityEvent: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: 'honeypot_triggered',
      severity: 'warning',
      description: `Honeypot triggered in layer ${honeypot.layer}: ${honeypotId}`,
      metadata: {
        honeypot,
        attack,
        layer: honeypot.layer,
        fakeData: honeypot.fakeData
      },
      ipAddress: attack.ipAddress
    };

    this.emit('security_event', securityEvent);

    // Wait for response delay
    await this.delay(honeypot.responseDelay);

    return honeypot;
  }

  public getActiveHoneypots(): HoneypotPosition[] {
    return Array.from(this.honeypots.values()).filter(hp => !this.triggeredHoneypots.has(hp.id));
  }

  public getTriggeredHoneypots(): HoneypotPosition[] {
    return Array.from(this.triggeredHoneypots).map(id => this.honeypots.get(id)!).filter(Boolean);
  }

  // === DECOY VAULT SYSTEM ===

  private initializeDefaultDecoyVaults(): void {
    // Create different types of decoy vaults
    const decoyTypes = [
      { type: 'personal', trigger: 'time_based' },
      { type: 'work', trigger: 'access_pattern' },
      { type: 'financial', trigger: 'ip_based' },
      { type: 'critical', trigger: 'ai_detected' }
    ];

    decoyTypes.forEach((config, index) => {
      const decoyId = `decoy_vault_${config.type}_${index}`;
      const decoyVault: DecoyVault = {
        id: decoyId,
        vaultId: `fake_vault_${crypto.randomUUID()}`, // Links to fake vault
        decoyData: this.generateDecoyData(config.type),
        triggerMechanism: config.trigger,
        activationThreshold: this.calculateDecoyThreshold(config.trigger),
        isActive: true,
        createdAt: new Date(),
        lastTriggered: undefined,
        triggerCount: 0
      };

      this.decoyVaults.set(decoyId, decoyVault);
    });
  }

  private generateDecoyData(vaultType: string): DecoyVault['decoyData'] {
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
  }

  private generatePersonalDecoyData(): DecoyVault['decoyData'] {
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
  }

  private generateWorkDecoyData(): DecoyVault['decoyData'] {
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
  }

  private generateFinancialDecoyData(): DecoyVault['decoyData'] {
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
  }

  private generateCriticalDecoyData(): DecoyVault['decoyData'] {
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
  }

  private generateGenericDecoyData(): DecoyVault['decoyData'] {
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
  }

  private calculateDecoyThreshold(triggerMechanism: DecoyVault['triggerMechanism']): number {
    switch (triggerMechanism) {
      case 'time_based': return 24 * 60 * 60 * 1000; // 24 hours
      case 'access_pattern': return 10; // 10 suspicious accesses
      case 'ip_based': return 3; // 3 different suspicious IPs
      case 'ai_detected': return 5; // 5 AI-detected threats
      default: return 10;
    }
  }

  public async triggerDecoyVault(decoyId: string, triggerReason: string): Promise<DecoyVault | null> {
    const decoy = this.decoyVaults.get(decoyId);
    if (!decoy || !decoy.isActive) {
      return null;
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
      decoy,
      triggerReason,
      timestamp: new Date(),
      triggerCount: decoy.triggerCount,
      type: 'decoy_vault_trigger'
    });

    // Generate security event
    const securityEvent: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: 'decoy_triggered',
      severity: 'critical',
      description: `Decoy vault triggered: ${decoyId} - ${triggerReason}`,
      metadata: {
        decoy,
        triggerReason,
        triggerCount: decoy.triggerCount,
        vaultType: decoy.vaultId.split('_')[1] // Extract type from fake vault ID
      },
      ipAddress: 'unknown'
    };

    this.emit('security_event', securityEvent);

    return decoy;
  }

  public getActiveDecoyVaults(): DecoyVault[] {
    return Array.from(this.decoyVaults.values()).filter(dv => dv.isActive);
  }

  public getTriggeredDecoyVaults(): DecoyVault[] {
    return Array.from(this.triggeredDecoyVaults).map(id => this.decoyVaults.get(id)!).filter(Boolean);
  }

  // === ATTACK PATTERN ANALYSIS ===

  public analyzeAttackPattern(attack: AttackAttempt): {
    pattern: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  } {
    const patterns = this.identifyAttackPatterns(attack);

    // Track pattern occurrences
    patterns.forEach(pattern => {
      const current = this.attackPatterns.get(pattern) || 0;
      this.attackPatterns.set(pattern, current + 1);
    });

    // Determine most likely pattern
    const primaryPattern = patterns[0] || 'unknown';
    const confidence = this.calculatePatternConfidence(primaryPattern, attack);
    const severity = this.calculatePatternSeverity(primaryPattern, attack);

    return {
      pattern: primaryPattern,
      confidence,
      severity
    };
  }

  private identifyAttackPatterns(attack: AttackAttempt): string[] {
    const patterns: string[] = [];

    // SQL Injection patterns
    if (attack.payload && /union\s+select|select\s+.*\s+from|drop\s+table|insert\s+into/i.test(attack.payload)) {
      patterns.push('sql_injection');
    }

    // XSS patterns
    if (attack.payload && /<script|javascript:|on\w+\s*=|alert\s*\(/i.test(attack.payload)) {
      patterns.push('xss_attack');
    }

    // Brute force patterns
    if (attack.attackType === 'brute_force' || attack.payload?.includes('password')) {
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
  }

  private calculatePatternConfidence(pattern: string, attack: AttackAttempt): number {
    const baseConfidence: Record<string, number> = {
      'sql_injection': 0.85,
      'xss_attack': 0.80,
      'brute_force': 0.75,
      'credential_stuffing': 0.70,
      'directory_traversal': 0.60,
      'command_injection': 0.65,
      'unknown': 0.20
    };

    let confidence = baseConfidence[pattern] || 0.20;

    // Adjust based on attack characteristics
    if (attack.payload && attack.payload.length > 100) {
      confidence += 0.1;
    }

    if (attack.userAgent && this.isSuspiciousUserAgent(attack.userAgent)) {
      confidence += 0.1;
    }

    return Math.min(1, confidence);
  }

  private calculatePatternSeverity(pattern: string, attack: AttackAttempt): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      'sql_injection': 'high',
      'xss_attack': 'medium',
      'brute_force': 'medium',
      'credential_stuffing': 'high',
      'directory_traversal': 'high',
      'command_injection': 'critical',
      'unknown': 'low'
    };

    let severity = severityMap[pattern] || 'low';

    // Escalate based on attack characteristics
    if (attack.payload && attack.payload.length > 1000) {
      if (severity === 'low') severity = 'medium';
      else if (severity === 'medium') severity = 'high';
      else if (severity === 'high') severity = 'critical';
    }

    return severity;
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i, /crawler/i, /scanner/i, /nmap/i, /sqlmap/i,
      /nikto/i, /dirbuster/i, /gobuster/i, /python/i,
      /curl/i, /wget/i, /headless/i, /selenium/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  // === UTILITY METHODS ===

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getHoneytokenStats(): {
    totalHoneypots: number;
    activeHoneypots: number;
    triggeredHoneypots: number;
    totalDecoyVaults: number;
    activeDecoyVaults: number;
    triggeredDecoyVaults: number;
  } {
    return {
      totalHoneypots: this.honeypots.size,
      activeHoneypots: this.getActiveHoneypots().length,
      triggeredHoneypots: this.triggeredHoneypots.size,
      totalDecoyVaults: this.decoyVaults.size,
      activeDecoyVaults: this.getActiveDecoyVaults().length,
      triggeredDecoyVaults: this.triggeredDecoyVaults.size
    };
  }

  public resetHoneytokens(): void {
    this.triggeredHoneypots.clear();
    this.triggeredDecoyVaults.clear();
    this.attackPatterns.clear();

    // Reset decoy vaults
    for (const decoy of this.decoyVaults.values()) {
      decoy.isActive = true;
      decoy.lastTriggered = undefined;
      decoy.triggerCount = 0;
    }

    this.emit('honeytokens_reset', { timestamp: new Date() });
    console.log('🍯 Honeytoken system reset');
  }

  public destroy(): void {
    this.removeAllListeners();
    this.honeypots.clear();
    this.decoyVaults.clear();
    this.triggeredHoneypots.clear();
    this.triggeredDecoyVaults.clear();
    this.attackPatterns.clear();
    console.log('🍯 Honeytoken Service shut down');
  }
}
