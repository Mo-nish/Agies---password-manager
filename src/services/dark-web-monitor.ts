import {
  DarkWebAlert,
  SecurityEvent,
  AttackAttempt
} from '../core/types';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import axios from 'axios';

/**
 * Agies Dark Web Monitor
 * Monitors dark web sources for compromised credentials and triggers automatic responses
 */
export class AgiesDarkWebMonitor extends EventEmitter {
  private monitoringServices: Map<string, MonitoringService> = new Map();
  private breachDatabases: Map<string, BreachData> = new Map();
  private alertHistory: DarkWebAlert[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private lastCheck: Date = new Date();

  // Configuration
  private readonly CHECK_INTERVAL = 3600000; // 1 hour
  private readonly API_KEYS = {
    'haveibeenpwned': process.env.HIBP_API_KEY || '',
    'leakcheck': process.env.LEAKCHECK_API_KEY || '',
    'dehashed': process.env.DEHASHED_API_KEY || ''
  };

  constructor() {
    super();
    this.initializeMonitoringServices();
    this.startMonitoring();
    console.log('🌑 Agies Dark Web Monitor initialized');
  }

  private initializeMonitoringServices(): void {
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
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.performDarkWebScan();
    }, this.CHECK_INTERVAL);
  }

  private async performDarkWebScan(): Promise<void> {
    try {
      console.log('🌑 Starting dark web scan...');

      for (const [serviceId, service] of this.monitoringServices.entries()) {
        if (service.status === 'active' && this.canUseService(service)) {
          await this.scanService(serviceId, service);
          service.lastUsed = new Date();
        }
      }

      this.lastCheck = new Date();

      this.emit('scan_completed', {
        timestamp: new Date(),
        servicesScanned: Array.from(this.monitoringServices.keys()),
        alertsGenerated: this.alertHistory.length
      });

    } catch (error) {
      console.error('Error during dark web scan:', error);
      this.emit('scan_error', { error, timestamp: new Date() });
    }
  }

  private canUseService(service: MonitoringService): boolean {
    const timeSinceLastUse = Date.now() - service.lastUsed.getTime();
    const rateLimitWindow = 60000; // 1 minute

    return timeSinceLastUse >= rateLimitWindow;
  }

  private async scanService(serviceId: string, service: MonitoringService): Promise<void> {
    try {
      switch (serviceId) {
        case 'hibp':
          await this.scanHIBP(service);
          break;
        case 'leakcheck':
          await this.scanLeakCheck(service);
          break;
        case 'dehashed':
          await this.scanDehashed(service);
          break;
        default:
          console.log(`Unknown service: ${serviceId}`);
      }
    } catch (error) {
      console.error(`Error scanning ${service.name}:`, error);
      service.status = 'error';
    }
  }

  private async scanHIBP(service: MonitoringService): Promise<void> {
    if (!service.apiKey) {
      console.log('HIBP API key not configured, skipping...');
      return;
    }

    try {
      // In real implementation, you would iterate through user emails
      // For demo purposes, we'll simulate some breached emails
      const testEmails = [
        'test@example.com',
        'admin@company.com',
        'user@gmail.com'
      ];

      for (const email of testEmails) {
        const response = await axios.get(
          `${service.url}/breachedaccount/${encodeURIComponent(email)}`,
          {
            headers: {
              'hibp-api-key': service.apiKey,
              'User-Agent': 'Agies-Security-Scanner'
            },
            timeout: 10000
          }
        );

        if (response.data && response.data.length > 0) {
          for (const breach of response.data) {
            await this.processBreach(email, breach, 'haveibeenpwned');
          }
        }
      }

    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response?.status !== 404) { // 404 just means no breach found
        throw error;
      }
    }
  }

  private async scanLeakCheck(service: MonitoringService): Promise<void> {
    // Simulated leak check service
    const simulatedBreaches = await this.simulateLeakCheck();

    for (const breach of simulatedBreaches) {
      await this.processBreach(breach.email, breach, 'leakcheck');
    }
  }

  private async scanDehashed(service: MonitoringService): Promise<void> {
    // Simulated Dehashed service
    const simulatedBreaches = await this.simulateDehashed();

    for (const breach of simulatedBreaches) {
      await this.processBreach(breach.email, breach, 'dehashed');
    }
  }

  private async processBreach(identifier: string, breach: any, source: string): Promise<void> {
    const breachId = `${source}_${breach.Name || breach.name}_${Date.now()}`;

    // Check if we already alerted for this breach
    const existingAlert = this.alertHistory.find(alert =>
      alert.value === identifier && alert.source === source
    );

    if (existingAlert) {
      return; // Already alerted
    }

    // Determine credential type and value
    const credentialType = this.determineCredentialType(identifier);
    const breachData = {
      name: breach.Name || breach.name || 'Unknown',
      domain: breach.Domain || breach.domain || 'unknown',
      date: breach.BreachDate || breach.date || new Date().toISOString(),
      description: breach.Description || breach.description || 'Data breach detected',
      dataClasses: breach.DataClasses || breach.dataClasses || ['Email addresses']
    };

    // Calculate confidence and risk score
    const confidence = this.calculateBreachConfidence(breach, source);
    const riskScore = this.calculateRiskScore(breachData);

    // Create alert
    const alert: DarkWebAlert = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      credentialType,
      value: identifier,
      source,
      confidence,
      actionTaken: riskScore > 0.7 ? 'auto_rotate' : 'notify_user',
      status: 'active'
    };

    this.alertHistory.push(alert);
    this.breachDatabases.set(breachId, {
      id: breachId,
      source,
      identifier,
      breachData,
      discoveredAt: new Date(),
      riskScore,
      alert
    });

    // Emit alert
    this.emit('breach_detected', {
      alert,
      breach: breachData,
      riskScore,
      timestamp: new Date()
    });

    // Log security event
    this.emit('security_event', {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: 'dark_web_breach',
      severity: riskScore > 0.7 ? 'critical' : 'warning',
      description: `Dark web breach detected: ${identifier} found in ${breachData.name}`,
      metadata: {
        alert,
        breach: breachData,
        riskScore,
        source
      },
      ipAddress: undefined
    });

    console.log(`🚨 Dark web breach detected: ${identifier} in ${breachData.name} (${source})`);
  }

  private determineCredentialType(identifier: string): DarkWebAlert['credentialType'] {
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
  }

  private calculateBreachConfidence(breach: any, source: string): number {
    let confidence = 0.5; // Base confidence

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
    if (breach.BreachDate || breach.date) confidence += 0.1;
    if (breach.Description || breach.description) confidence += 0.05;
    if (breach.DataClasses || breach.dataClasses) confidence += 0.1;

    return Math.min(1, confidence);
  }

  private calculateRiskScore(breachData: any): number {
    let risk = 0;

    // Recent breaches are higher risk
    if (breachData.date) {
      const breachDate = new Date(breachData.date);
      const daysSinceBreach = (Date.now() - breachDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceBreach < 30) risk += 0.3;
      else if (daysSinceBreach < 180) risk += 0.2;
      else if (daysSinceBreach < 365) risk += 0.1;
    }

    // Sensitive data types increase risk
    const sensitiveDataClasses = [
      'Passwords', 'Credit cards', 'Social security numbers',
      'Bank account numbers', 'Tax identification numbers'
    ];

    const dataClasses = breachData.dataClasses || [];
    const sensitiveCount = dataClasses.filter((dc: string) =>
      sensitiveDataClasses.some(sensitive => dc.toLowerCase().includes(sensitive.toLowerCase()))
    ).length;

    risk += (sensitiveCount / dataClasses.length) * 0.4;

    // Known high-profile breaches
    const highProfileBreaches = [
      'Yahoo', 'LinkedIn', 'MySpace', 'Adobe', 'Equifax',
      'Target', 'Home Depot', 'Anthem', 'Marriott'
    ];

    if (highProfileBreaches.some(hp => breachData.name.toLowerCase().includes(hp.toLowerCase()))) {
      risk += 0.2;
    }

    return Math.min(1, risk);
  }

  // Simulated services for demonstration
  private async simulateLeakCheck(): Promise<any[]> {
    // Simulate random breaches for demonstration
    const breaches = [];
    const breachChance = 0.05; // 5% chance per "check"

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

    return breaches;
  }

  private async simulateDehashed(): Promise<any[]> {
    // Simulate Dehashed-style results
    const breaches = [];
    const breachChance = 0.03; // 3% chance

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

    return breaches;
  }

  // Public API methods

  public async checkCredential(credential: string): Promise<DarkWebAlert[]> {
    const alerts: DarkWebAlert[] = [];

    for (const [serviceId, service] of this.monitoringServices.entries()) {
      if (service.status === 'active') {
        try {
          const result = await this.checkCredentialWithService(credential, serviceId, service);
          if (result) {
            alerts.push(result);
          }
        } catch (error) {
          console.error(`Error checking credential with ${service.name}:`, error);
        }
      }
    }

    return alerts;
  }

  private async checkCredentialWithService(
    credential: string,
    serviceId: string,
    service: MonitoringService
  ): Promise<DarkWebAlert | null> {
    // Simplified credential checking
    // In real implementation, would use service APIs

    if (Math.random() < 0.1) { // 10% chance of finding breach for demo
      return {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        credentialType: this.determineCredentialType(credential),
        value: credential,
        source: service.name,
        confidence: 0.8,
        actionTaken: 'auto_rotate',
        status: 'active'
      };
    }

    return null;
  }

  public getBreachHistory(): DarkWebAlert[] {
    return [...this.alertHistory];
  }

  public getMonitoringStatus(): {
    services: Map<string, MonitoringService>;
    lastCheck: Date;
    totalAlerts: number;
    activeAlerts: number;
  } {
    const activeAlerts = this.alertHistory.filter(alert => alert.status === 'active').length;

    return {
      services: new Map(this.monitoringServices),
      lastCheck: this.lastCheck,
      totalAlerts: this.alertHistory.length,
      activeAlerts
    };
  }

  public resolveAlert(alertId: string): boolean {
    const alert = this.alertHistory.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      this.emit('alert_resolved', { alert, timestamp: new Date() });
      return true;
    }
    return false;
  }

  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.removeAllListeners();
    console.log('🌑 Dark Web Monitor shut down');
  }
}

// Helper interfaces

interface MonitoringService {
  name: string;
  url: string;
  apiKey: string;
  rateLimit: number;
  lastUsed: Date;
  status: 'active' | 'inactive' | 'error';
}

interface BreachData {
  id: string;
  source: string;
  identifier: string;
  breachData: {
    name: string;
    domain: string;
    date: string;
    description: string;
    dataClasses: string[];
  };
  discoveredAt: Date;
  riskScore: number;
  alert: DarkWebAlert;
}
