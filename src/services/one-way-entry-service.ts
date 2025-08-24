import {
  OneWayEntryConfig,
  SecurityEvent,
  AttackAttempt
} from '../core/types';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';

/**
 * Agies One-Way Entry Service
 * Enforces the principle that data can enter easily but can only exit under strict verification
 */
export class OneWayEntryService extends EventEmitter {
  private config: OneWayEntryConfig;
  private exitAttempts: Map<string, ExitAttempt[]> = new Map();
  private entryLog: Map<string, EntryRecord[]> = new Map();
  private verificationTokens: Map<string, VerificationToken> = new Map();
  private dataExportHistory: Map<string, ExportRecord> = new Map();

  constructor() {
    super();
    this.config = this.initializeDefaultConfig();
    console.log('🚪 One-Way Entry Service initialized');
  }

  private initializeDefaultConfig(): OneWayEntryConfig {
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
  }

  // === DATA ENTRY (Easy) ===

  public async processDataEntry(
    data: any,
    userId: string,
    source: 'user_input' | 'import' | 'sync' | 'api'
  ): Promise<{
    allowed: boolean;
    entryId: string;
    verificationLevel: number;
    reason?: string;
  }> {
    const entryId = crypto.randomUUID();
    const userEntries = this.entryLog.get(userId) || [];

    // Check entry limits
    const recentEntries = userEntries.filter(entry =>
      entry.timestamp > new Date(Date.now() - this.config.entryCooldown)
    );

    if (recentEntries.length >= this.config.maxEntryAttempts) {
      return {
        allowed: false,
        entryId,
        verificationLevel: 0,
        reason: 'Entry rate limit exceeded'
      };
    }

    // Easy entry - minimal verification
    const verificationLevel = this.determineEntryVerificationLevel(source);
    const allowed = verificationLevel <= this.config.entryVerificationLevels;

    if (allowed) {
      // Log successful entry
      const entryRecord: EntryRecord = {
        id: entryId,
        userId,
        timestamp: new Date(),
        source,
        dataType: this.identifyDataType(data),
        size: JSON.stringify(data).length,
        verificationLevel,
        status: 'success'
      };

      userEntries.push(entryRecord);
      this.entryLog.set(userId, userEntries);

      this.emit('data_entry_success', {
        entryId,
        userId,
        source,
        timestamp: new Date()
      });

      return {
        allowed: true,
        entryId,
        verificationLevel
      };
    } else {
      // Log failed entry
      const entryRecord: EntryRecord = {
        id: entryId,
        userId,
        timestamp: new Date(),
        source,
        dataType: this.identifyDataType(data),
        size: JSON.stringify(data).length,
        verificationLevel,
        status: 'failed',
        reason: 'Entry verification failed'
      };

      userEntries.push(entryRecord);
      this.entryLog.set(userId, userEntries);

      return {
        allowed: false,
        entryId,
        verificationLevel,
        reason: 'Entry verification failed'
      };
    }
  }

  private determineEntryVerificationLevel(source: string): number {
    const levelMap: Record<string, number> = {
      'user_input': 1, // Easiest - direct user input
      'import': 2,     // Import from external sources
      'sync': 3,       // Sync between devices
      'api': 4         // API calls (most restricted for entry)
    };

    return levelMap[source] || 1;
  }

  private identifyDataType(data: any): string {
    if (data.password && data.username) return 'password';
    if (data.content && data.title) return 'note';
    if (data.number && data.expiry) return 'credit_card';
    if (Array.isArray(data)) return 'bulk_data';
    return 'unknown';
  }

  // === DATA EXIT (Hard) - One-Way Entry Principle ===

  public async initiateDataExit(
    userId: string,
    dataType: 'password' | 'note' | 'credit_card' | 'all',
    dataId?: string
  ): Promise<{
    allowed: boolean;
    exitId: string;
    verificationToken?: string;
    requiredSteps: string[];
    reason?: string;
  }> {
    const exitId = crypto.randomUUID();
    const userExitAttempts = this.exitAttempts.get(userId) || [];

    // Check exit limits
    const recentExits = userExitAttempts.filter(attempt =>
      attempt.timestamp > new Date(Date.now() - this.config.exitCooldown)
    );

    if (recentExits.length >= this.config.maxExitAttempts) {
      this.logSecurityEvent({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        eventType: 'exit_violation',
        severity: 'critical',
        description: `One-Way Entry Principle violation: Exit attempt limit exceeded for user ${userId}`,
        metadata: {
          userId,
          exitId,
          dataType,
          attemptCount: recentExits.length,
          maxAttempts: this.config.maxExitAttempts
        },
        ipAddress: 'unknown'
      });

      return {
        allowed: false,
        exitId,
        requiredSteps: [],
        reason: 'Exit attempt limit exceeded - One-Way Entry Principle violation'
      };
    }

    // Generate verification token
    const verificationToken = this.generateVerificationToken(userId, exitId, dataType, dataId);

    // Determine required verification steps
    const requiredSteps = this.determineExitVerificationSteps(dataType);

    // Log exit attempt
    const exitAttempt: ExitAttempt = {
      id: exitId,
      userId,
      timestamp: new Date(),
      dataType,
      dataId,
      status: 'pending',
      verificationToken: verificationToken.id,
      requiredSteps,
      completedSteps: []
    };

    userExitAttempts.push(exitAttempt);
    this.exitAttempts.set(userId, userExitAttempts);

    this.emit('data_exit_initiated', {
      exitId,
      userId,
      dataType,
      timestamp: new Date(),
      requiredSteps
    });

    return {
      allowed: true,
      exitId,
      verificationToken: verificationToken.token,
      requiredSteps
    };
  }

  private generateVerificationToken(
    userId: string,
    exitId: string,
    dataType: string,
    dataId?: string
  ): VerificationToken {
    const tokenId = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString('hex');

    const verificationToken: VerificationToken = {
      id: tokenId,
      token,
      userId,
      exitId,
      dataType,
      dataId,
      expiresAt: new Date(Date.now() + this.config.timeWindow), // 5 minutes
      used: false,
      createdAt: new Date()
    };

    this.verificationTokens.set(tokenId, verificationToken);

    // Schedule token cleanup
    setTimeout(() => {
      this.verificationTokens.delete(tokenId);
    }, this.config.timeWindow);

    return verificationToken;
  }

  private determineExitVerificationSteps(dataType: string): string[] {
    const baseSteps = [
      'user_authentication',
      'device_verification',
      'time_window_check'
    ];

    const advancedSteps = [
      'biometric_verification',
      'hardware_key_verification',
      'security_questions',
      'two_factor_authentication',
      'session_verification'
    ];

    // Different requirements based on data sensitivity
    switch (dataType) {
      case 'password':
        return [...baseSteps, 'two_factor_authentication'];
      case 'note':
        return [...baseSteps, 'biometric_verification'];
      case 'credit_card':
        return [...baseSteps, 'hardware_key_verification', 'two_factor_authentication'];
      case 'all':
        return [...baseSteps, ...advancedSteps]; // Maximum security for bulk export
      default:
        return baseSteps;
    }
  }

  public async verifyExitStep(
    userId: string,
    exitId: string,
    step: string,
    verificationData?: any
  ): Promise<{
    success: boolean;
    nextStep?: string;
    allStepsCompleted?: boolean;
    reason?: string;
  }> {
    const userExitAttempts = this.exitAttempts.get(userId) || [];
    const exitAttempt = userExitAttempts.find(attempt => attempt.id === exitId);

    if (!exitAttempt) {
      return {
        success: false,
        reason: 'Exit attempt not found'
      };
    }

    // Verify step
    const stepResult = await this.verifyStep(exitAttempt, step, verificationData);

    if (stepResult.success) {
      exitAttempt.completedSteps.push(step);

      // Check if all steps are completed
      const allStepsCompleted = exitAttempt.requiredSteps.every(step =>
        exitAttempt.completedSteps.includes(step)
      );

      if (allStepsCompleted) {
        exitAttempt.status = 'verified';
        this.exitAttempts.set(userId, userExitAttempts);

        this.emit('data_exit_verified', {
          exitId,
          userId,
          timestamp: new Date(),
          dataType: exitAttempt.dataType
        });

        return {
          success: true,
          allStepsCompleted: true
        };
      } else {
        const nextStepIndex = exitAttempt.completedSteps.length;
        const nextStep = exitAttempt.requiredSteps[nextStepIndex];

        return {
          success: true,
          nextStep
        };
      }
    } else {
      return {
        success: false,
        reason: stepResult.reason || 'Step verification failed'
      };
    }
  }

  private async verifyStep(
    exitAttempt: ExitAttempt,
    step: string,
    verificationData?: any
  ): Promise<{
    success: boolean;
    reason?: string;
  }> {
    // In a real implementation, these would verify against actual user data
    switch (step) {
      case 'user_authentication':
        return { success: true, reason: 'User authenticated' };

      case 'device_verification':
        return { success: true, reason: 'Device verified' };

      case 'time_window_check':
        const verificationToken = this.verificationTokens.get(exitAttempt.verificationToken);
        if (verificationToken && verificationToken.expiresAt > new Date()) {
          return { success: true, reason: 'Within time window' };
        } else {
          return { success: false, reason: 'Time window expired' };
        }

      case 'biometric_verification':
        if (this.config.biometricRequired) {
          // Simulate biometric verification
          return { success: Math.random() > 0.1, reason: 'Biometric verification' };
        }
        return { success: true, reason: 'Biometric not required' };

      case 'hardware_key_verification':
        if (this.config.hardwareKeyRequired) {
          // Simulate hardware key verification
          return { success: Math.random() > 0.1, reason: 'Hardware key verification' };
        }
        return { success: true, reason: 'Hardware key not required' };

      case 'two_factor_authentication':
        // Simulate 2FA verification
        return { success: Math.random() > 0.05, reason: '2FA verification' };

      case 'security_questions':
        // Simulate security questions
        return { success: Math.random() > 0.2, reason: 'Security questions' };

      case 'session_verification':
        // Simulate session verification
        return { success: Math.random() > 0.1, reason: 'Session verification' };

      default:
        return { success: false, reason: 'Unknown step' };
    }
  }

  public async executeDataExit(
    userId: string,
    exitId: string
  ): Promise<{
    success: boolean;
    data?: any;
    reason?: string;
  }> {
    const userExitAttempts = this.exitAttempts.get(userId) || [];
    const exitAttempt = userExitAttempts.find(attempt => attempt.id === exitId);

    if (!exitAttempt) {
      return {
        success: false,
        reason: 'Exit attempt not found'
      };
    }

    if (exitAttempt.status !== 'verified') {
      return {
        success: false,
        reason: 'Exit not fully verified'
      };
    }

    // Mark token as used
    const verificationToken = this.verificationTokens.get(exitAttempt.verificationToken);
    if (verificationToken) {
      verificationToken.used = true;
    }

    // Update exit attempt status
    exitAttempt.status = 'completed';
    this.exitAttempts.set(userId, userExitAttempts);

    // Log successful data exit
    const exportRecord: ExportRecord = {
      id: crypto.randomUUID(),
      userId,
      exitId,
      dataType: exitAttempt.dataType,
      dataId: exitAttempt.dataId,
      timestamp: new Date(),
      verificationLevel: exitAttempt.requiredSteps.length,
      exportMethod: 'secure_export'
    };

    this.dataExportHistory.set(exportRecord.id, exportRecord);

    this.emit('data_exit_completed', {
      exitId,
      userId,
      exportId: exportRecord.id,
      dataType: exitAttempt.dataType,
      timestamp: new Date()
    });

    this.logSecurityEvent({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: 'data_export',
      severity: 'info',
      description: `Secure data export completed: ${exitAttempt.dataType} for user ${userId}`,
      metadata: {
        userId,
        exitId,
        exportId: exportRecord.id,
        dataType: exitAttempt.dataType,
        verificationSteps: exitAttempt.requiredSteps.length
      },
      ipAddress: 'unknown'
    });

    // In a real implementation, this would return the actual decrypted data
    // For security, we return a placeholder
    return {
      success: true,
      data: {
        message: 'Data export completed successfully',
        exportId: exportRecord.id,
        dataType: exitAttempt.dataType,
        timestamp: new Date().toISOString()
      }
    };
  }

  // === VIOLATION DETECTION ===

  public detectOneWayViolation(
    userId: string,
    action: string,
    data: any
  ): {
    isViolation: boolean;
    violationType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  } {
    // Check for exit-related actions without proper verification
    const exitIndicators = [
      'export', 'download', 'copy', 'extract', 'backup',
      'GET /api/vaults/', 'password', 'secret', 'key',
      'data', 'file', 'document'
    ];

    const actionLower = action.toLowerCase();
    const isExitAction = exitIndicators.some(indicator =>
      actionLower.includes(indicator.toLowerCase())
    );

    if (isExitAction) {
      // Check if there's a valid exit attempt for this action
      const userExitAttempts = this.exitAttempts.get(userId) || [];
      const validExit = userExitAttempts.find(attempt =>
        attempt.status === 'verified' &&
        attempt.timestamp > new Date(Date.now() - this.config.timeWindow)
      );

      if (!validExit) {
        this.logSecurityEvent({
          id: crypto.randomUUID(),
          timestamp: new Date(),
          eventType: 'one_way_violation',
          severity: 'critical',
          description: `One-Way Entry Principle violation: Unauthorized data exit attempt by user ${userId}`,
          metadata: {
            userId,
            action,
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
    const userExitAttempts = this.exitAttempts.get(userId) || [];
    const recentAttempts = userExitAttempts.filter(attempt =>
      attempt.timestamp > new Date(Date.now() - this.config.exitCooldown)
    );

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
  }

  // === UTILITY METHODS ===

  private logSecurityEvent(event: SecurityEvent): void {
    this.emit('security_event', event);
  }

  public getExitStatistics(userId?: string): {
    totalExitAttempts: number;
    successfulExits: number;
    failedExits: number;
    activeTokens: number;
    recentExports: ExportRecord[];
  } {
    let exitAttempts: ExitAttempt[] = [];
    let exportRecords: ExportRecord[] = [];

    if (userId) {
      exitAttempts = this.exitAttempts.get(userId) || [];
      exportRecords = Array.from(this.dataExportHistory.values()).filter(record => record.userId === userId);
    } else {
      exitAttempts = Array.from(this.exitAttempts.values()).flat();
      exportRecords = Array.from(this.dataExportHistory.values());
    }

    const successfulExits = exitAttempts.filter(attempt => attempt.status === 'completed').length;
    const failedExits = exitAttempts.filter(attempt => attempt.status === 'failed').length;
    const activeTokens = Array.from(this.verificationTokens.values()).filter(token => !token.used).length;

    const recentExports = exportRecords
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalExitAttempts: exitAttempts.length,
      successfulExits,
      failedExits,
      activeTokens,
      recentExports
    };
  }

  public updateConfig(newConfig: Partial<OneWayEntryConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('config_updated', { config: this.config, timestamp: new Date() });
  }

  public getConfig(): OneWayEntryConfig {
    return { ...this.config };
  }

  public destroy(): void {
    this.removeAllListeners();
    this.exitAttempts.clear();
    this.entryLog.clear();
    this.verificationTokens.clear();
    this.dataExportHistory.clear();
    console.log('🚪 One-Way Entry Service shut down');
  }
}

// === TYPE DEFINITIONS ===

interface EntryRecord {
  id: string;
  userId: string;
  timestamp: Date;
  source: 'user_input' | 'import' | 'sync' | 'api';
  dataType: string;
  size: number;
  verificationLevel: number;
  status: 'success' | 'failed';
  reason?: string;
}

interface ExitAttempt {
  id: string;
  userId: string;
  timestamp: Date;
  dataType: 'password' | 'note' | 'credit_card' | 'all';
  dataId?: string;
  status: 'pending' | 'verified' | 'completed' | 'failed';
  verificationToken: string;
  requiredSteps: string[];
  completedSteps: string[];
}

interface VerificationToken {
  id: string;
  token: string;
  userId: string;
  exitId: string;
  dataType: string;
  dataId?: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

interface ExportRecord {
  id: string;
  userId: string;
  exitId: string;
  dataType: string;
  dataId?: string;
  timestamp: Date;
  verificationLevel: number;
  exportMethod: string;
}
