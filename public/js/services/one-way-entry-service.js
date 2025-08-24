/**
 * Browser-compatible One-Way Entry Service
 * Simplified version for frontend use
 */

class OneWayEntryService {
  constructor() {
    this.entryLogs = new Map();
    this.verificationLevels = new Map();
    this.rateLimits = new Map();
  }

  setVerificationLevel(vaultId, level) {
    this.verificationLevels.set(vaultId, level);
    console.log('🔐 Verification level set for vault:', vaultId, level);
  }

  requireHardwareKey(vaultId, required = true) {
    const currentLevel = this.verificationLevels.get(vaultId) || {};
    this.verificationLevels.set(vaultId, {
      ...currentLevel,
      hardwareKeyRequired: required
    });
    console.log('🔑 Hardware key requirement updated for vault:', vaultId);
  }

  setTimeWindow(vaultId, window) {
    const currentLevel = this.verificationLevels.get(vaultId) || {};
    this.verificationLevels.set(vaultId, {
      ...currentLevel,
      timeWindow: window
    });
    console.log('⏰ Time window set for vault:', vaultId, window);
  }

  setRateLimit(vaultId, limit) {
    this.rateLimits.set(vaultId, {
      attempts: 0,
      limit: limit,
      windowStart: Date.now(),
      windowMs: 3600000 // 1 hour
    });
    console.log('📊 Rate limit set for vault:', vaultId, limit);
  }

  logEntry(vaultId, action, details = {}) {
    const entryId = 'entry_' + Math.random().toString(36).substr(2, 9);
    const entry = {
      id: entryId,
      vaultId: vaultId,
      action: action,
      timestamp: Date.now(),
      details: details,
      ipAddress: 'browser_simulated',
      userAgent: navigator.userAgent,
      success: true
    };

    if (!this.entryLogs.has(vaultId)) {
      this.entryLogs.set(vaultId, []);
    }
    this.entryLogs.get(vaultId).push(entry);

    console.log('📝 Entry logged:', action, 'for vault:', vaultId);
    return entry;
  }

  verifyEntry(vaultId, action) {
    const verificationLevel = this.verificationLevels.get(vaultId);
    if (!verificationLevel) {
      return { success: true, message: 'No verification required' };
    }

    // Check rate limit
    const rateLimit = this.rateLimits.get(vaultId);
    if (rateLimit) {
      const now = Date.now();
      if (now - rateLimit.windowStart > rateLimit.windowMs) {
        // Reset window
        rateLimit.attempts = 0;
        rateLimit.windowStart = now;
      }

      if (rateLimit.attempts >= rateLimit.limit) {
        return {
          success: false,
          message: 'Rate limit exceeded',
          eventType: 'rate_limit_exceeded'
        };
      }
      rateLimit.attempts++;
    }

    // Check time window
    if (verificationLevel.timeWindow) {
      const now = new Date();
      const hour = now.getHours();
      const allowedStart = verificationLevel.timeWindow.start || 0;
      const allowedEnd = verificationLevel.timeWindow.end || 24;

      if (hour < allowedStart || hour > allowedEnd) {
        this.logEntry(vaultId, 'time_window_violation', {
          attemptedHour: hour,
          allowedWindow: `${allowedStart}-${allowedEnd}`
        });
        return {
          success: false,
          message: 'Access outside allowed time window',
          eventType: 'time_window_violation'
        };
      }
    }

    // Check hardware key (simulated)
    if (verificationLevel.hardwareKeyRequired) {
      // In a real implementation, this would check for hardware key presence
      const hasHardwareKey = Math.random() > 0.5; // Simulate
      if (!hasHardwareKey) {
        this.logEntry(vaultId, 'hardware_key_missing');
        return {
          success: false,
          message: 'Hardware key required but not found',
          eventType: 'hardware_key_missing'
        };
      }
    }

    // Log successful entry
    this.logEntry(vaultId, action, { verificationPassed: true });
    return { success: true, message: 'Verification successful' };
  }

  getEntryLogs(vaultId, limit = 50) {
    const logs = this.entryLogs.get(vaultId) || [];
    return logs.slice(-limit);
  }

  getVerificationStatus(vaultId) {
    const level = this.verificationLevels.get(vaultId);
    const rateLimit = this.rateLimits.get(vaultId);
    const logs = this.entryLogs.get(vaultId) || [];

    return {
      verificationLevel: level,
      rateLimit: rateLimit ? {
        current: rateLimit.attempts,
        limit: rateLimit.limit,
        remaining: rateLimit.limit - rateLimit.attempts
      } : null,
      totalEntries: logs.length,
      lastEntry: logs.length > 0 ? logs[logs.length - 1] : null
    };
  }

  resetRateLimit(vaultId) {
    const rateLimit = this.rateLimits.get(vaultId);
    if (rateLimit) {
      rateLimit.attempts = 0;
      rateLimit.windowStart = Date.now();
      console.log('🔄 Rate limit reset for vault:', vaultId);
    }
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.OneWayEntryService = OneWayEntryService;
}
