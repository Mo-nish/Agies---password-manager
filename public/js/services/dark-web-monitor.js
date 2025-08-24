/**
 * Browser-compatible Dark Web Monitor
 * Simplified version for frontend use
 */

class DarkWebMonitor {
  constructor() {
    this.monitoringServices = new Map();
    this.breachData = new Map();
    this.scanHistory = [];
    this.isMonitoring = false;
  }

  startMonitoring() {
    this.isMonitoring = true;
    console.log('🌐 Dark web monitoring started');

    // Simulate periodic scans
    setInterval(() => {
      this.performPeriodicScan();
    }, 60000); // Every minute for demo
  }

  stopMonitoring() {
    this.isMonitoring = false;
    console.log('⏹️ Dark web monitoring stopped');
  }

  addMonitoringService(serviceName, credentials) {
    const serviceId = 'service_' + Math.random().toString(36).substr(2, 9);
    const service = {
      id: serviceId,
      name: serviceName,
      credentials: credentials,
      lastScanned: null,
      breachFound: false,
      breachDate: null,
      isActive: true
    };

    this.monitoringServices.set(serviceId, service);
    console.log('📋 Monitoring service added:', serviceName);
    return serviceId;
  }

  removeMonitoringService(serviceId) {
    const service = this.monitoringServices.get(serviceId);
    if (service) {
      this.monitoringServices.delete(serviceId);
      console.log('🚫 Monitoring service removed:', service.name);
      return true;
    }
    return false;
  }

  async scanHaveIBeenPwned(email) {
    // Simulate API call to Have I Been Pwned
    console.log('🔍 Scanning Have I Been Pwned for:', email);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate breach detection (20% chance for demo)
    const breachFound = Math.random() < 0.2;

    if (breachFound) {
      const breach = {
        email: email,
        breachDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        breachSource: 'Simulated Breach',
        compromisedData: ['email', 'password'].concat(Math.random() > 0.5 ? ['credit_card'] : []),
        severity: 'high'
      };

      this.breachData.set(email, breach);
      this.logScan(email, 'breach_found', breach);
      return breach;
    }

    this.logScan(email, 'no_breach');
    return null;
  }

  async performPeriodicScan() {
    if (!this.isMonitoring) return;

    const services = Array.from(this.monitoringServices.values()).filter(s => s.isActive);

    for (const service of services) {
      try {
        const breach = await this.scanHaveIBeenPwned(service.credentials.email);
        if (breach) {
          this.handleBreachDetected(service, breach);
        }
        service.lastScanned = new Date();
      } catch (error) {
        console.error('Error scanning service:', service.name, error);
      }
    }
  }

  handleBreachDetected(service, breach) {
    service.breachFound = true;
    service.breachDate = breach.breachDate;

    console.log('🚨 Breach detected for service:', service.name);
    console.log('📧 Email:', breach.email);
    console.log('📅 Breach date:', breach.breachDate);
    console.log('💾 Compromised data:', breach.compromisedData.join(', '));

    // In a real implementation, this would:
    // 1. Notify the user
    // 2. Auto-rotate compromised passwords
    // 3. Trigger security measures
  }

  logScan(target, result, details = {}) {
    const scanEntry = {
      id: 'scan_' + Math.random().toString(36).substr(2, 9),
      target: target,
      result: result,
      timestamp: new Date(),
      details: details
    };

    this.scanHistory.push(scanEntry);
  }

  getBreachReport() {
    const breaches = Array.from(this.breachData.values());
    const services = Array.from(this.monitoringServices.values());

    return {
      totalServices: services.length,
      activeServices: services.filter(s => s.isActive).length,
      breachedServices: services.filter(s => s.breachFound).length,
      recentBreaches: breaches.slice(-10),
      scanHistory: this.scanHistory.slice(-50),
      monitoringStatus: this.isMonitoring ? 'active' : 'inactive'
    };
  }

  clearBreachData(email) {
    this.breachData.delete(email);
    console.log('🧹 Breach data cleared for:', email);
  }

  exportBreachReport() {
    const report = this.getBreachReport();
    const jsonReport = JSON.stringify(report, null, 2);

    // Create download link
    const blob = new Blob([jsonReport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dark-web-breach-report.json';
    a.click();
    URL.revokeObjectURL(url);

    console.log('📄 Breach report exported');
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.DarkWebMonitor = DarkWebMonitor;
}
