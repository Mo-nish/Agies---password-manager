/**
 * Browser-compatible AI Guardian
 * Simplified version for frontend use
 */

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

class AgiesAIGuardian extends EventEmitter {
  constructor() {
    super();
    this.attackPatterns = new Map();
    this.threatLevels = new Map();
    this.adaptiveResponses = new Map();
    this.learningRate = 0.1;
    this.currentThreatLevel = 'low';
    this.isMonitoring = false;
  }

  initializeAIGuardian() {
    console.log('🧠 Initializing AI Guardian...');
    this.attackPatterns.set('brute_force', { pattern: 'multiple_failed_attempts', severity: 'medium' });
    this.attackPatterns.set('timing_attack', { pattern: 'suspicious_timing', severity: 'high' });
    this.attackPatterns.set('credential_stuffing', { pattern: 'common_passwords', severity: 'high' });
    console.log('✅ AI Guardian initialized with attack pattern recognition');
  }

  startMonitoring() {
    this.isMonitoring = true;
    console.log('👁️ AI Guardian monitoring started');

    // Simulate monitoring
    setInterval(() => {
      this.analyzeActivity();
    }, 10000); // Check every 10 seconds
  }

  stopMonitoring() {
    this.isMonitoring = false;
    console.log('⏹️ AI Guardian monitoring stopped');
  }

  analyzeActivity() {
    // Simulate activity analysis
    const randomActivity = Math.random();
    if (randomActivity > 0.95) {
      this.detectSuspiciousActivity({
        type: 'unusual_access_pattern',
        timestamp: Date.now(),
        source: 'simulated_detection'
      });
    }
  }

  detectSuspiciousActivity(activity) {
    console.log('⚠️ Suspicious activity detected:', activity);

    const threatLevel = this.assessThreat(activity);
    this.updateThreatLevel(threatLevel);

    if (threatLevel === 'high' || threatLevel === 'critical') {
      this.emit('threat_detected', {
        level: threatLevel,
        activity: activity,
        timestamp: Date.now()
      });
    }
  }

  assessThreat(activity) {
    // Simple threat assessment logic
    if (activity.type === 'brute_force') return 'high';
    if (activity.type === 'timing_attack') return 'critical';
    if (activity.type === 'credential_stuffing') return 'medium';
    return 'low';
  }

  updateThreatLevel(newLevel) {
    const oldLevel = this.currentThreatLevel;
    this.currentThreatLevel = newLevel;

    if (oldLevel !== newLevel) {
      console.log(`🚨 Threat level changed: ${oldLevel} → ${newLevel}`);
      this.emit('threat_level_changed', {
        oldLevel: oldLevel,
        newLevel: newLevel,
        timestamp: Date.now()
      });
    }
  }

  generateAdaptiveResponse(threat) {
    console.log('🛡️ Generating adaptive response for threat:', threat);

    const responses = {
      low: 'monitor_closely',
      medium: 'increase_monitoring',
      high: 'trigger_maze_shift',
      critical: 'activate_all_defenses'
    };

    return responses[threat] || 'monitor_closely';
  }

  getThreatIntelligence() {
    return {
      currentThreatLevel: this.currentThreatLevel,
      attackPatterns: Array.from(this.attackPatterns.keys()),
      monitoringStatus: this.isMonitoring ? 'active' : 'inactive',
      lastAnalysis: new Date().toISOString()
    };
  }

  analyzeAttackPattern(attacks) {
    if (!attacks || attacks.length === 0) return null;

    // Simple pattern analysis
    const intervals = [];
    for (let i = 1; i < attacks.length; i++) {
      intervals.push(attacks[i].timestamp - attacks[i-1].timestamp);
    }

    const avgInterval = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
    const variance = intervals.length > 0 ?
      intervals.reduce((acc, interval) => acc + Math.pow(interval - avgInterval, 2), 0) / intervals.length : 0;

    return {
      attackCount: attacks.length,
      avgInterval: avgInterval,
      intervalVariance: variance,
      patternType: variance < 1000 ? 'automated_attack' : 'manual_attack'
    };
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.AgiesAIGuardian = AgiesAIGuardian;
  window.EventEmitter = EventEmitter;
}
