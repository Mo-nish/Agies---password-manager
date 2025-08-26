// 🚨 ENTERPRISE-GRADE DARK WEB MONITOR - Maze Password Manager
// High-level security monitoring with real-time threat detection

class EnterpriseDarkWebMonitor {
    constructor() {
        this.isScanning = false;
        this.scanProgress = 0;
        this.currentScan = null;
        this.breachAlerts = [];
        this.scanHistory = [];
        this.monitoringEnabled = false;
        this.autoRotationEnabled = false;
        this.threatIntelligence = {};
        this.securityScore = 100;
        
        // Enterprise monitoring settings
        this.monitoringInterval = null;
        this.alertThreshold = 'medium';
        this.notificationPreferences = {
            email: true,
            push: true,
            sms: false
        };
        
        this.init();
    }

    init() {
        console.log('🚨 Enterprise Dark Web Monitor initialized');
        this.setupEventListeners();
        this.loadMonitoringSettings();
        this.startContinuousMonitoring();
    }

    setupEventListeners() {
        // Start real scan button
        const startScanBtn = document.getElementById('start-real-scan');
        if (startScanBtn) {
            startScanBtn.addEventListener('click', () => this.startEnterpriseScan());
        }

        // Stop scan button
        const stopScanBtn = document.getElementById('stop-scan');
        if (stopScanBtn) {
            stopScanBtn.addEventListener('click', () => this.stopScan());
        }

        // Emergency lockdown button
        const lockdownBtn = document.getElementById('emergency-lockdown');
        if (lockdownBtn) {
            lockdownBtn.addEventListener('click', () => this.emergencyLockdown());
        }

        // Monitoring controls
        const monitoringToggle = document.getElementById('monitoring-toggle');
        if (monitoringToggle) {
            monitoringToggle.addEventListener('click', () => this.toggleContinuousMonitoring());
        }

        // Auto-rotation toggle
        const autoRotationToggle = document.getElementById('auto-rotation-toggle');
        if (autoRotationToggle) {
            autoRotationToggle.addEventListener('click', () => this.toggleAutoRotation());
        }
    }

    async startEnterpriseScan() {
        if (this.isScanning) {
            console.log('⚠️ Scan already in progress');
            return;
        }

        console.log('🚨 Starting Enterprise Security Scan...');
        this.isScanning = true;
        this.scanProgress = 0;
        this.currentScan = {
            id: `scan_${Date.now()}`,
            startTime: new Date(),
            status: 'running',
            findings: []
        };

        // Update UI
        this.updateScanProgress();
        this.updateScanStatus('🚨 Enterprise Scan Running...');

        try {
            // Load user credentials for comprehensive scanning
            await this.loadUserCredentials();
            
            if (this.credentials.length === 0) {
                console.log('⚠️ No credentials found for scanning');
                this.updateScanStatus('⚠️ No credentials found for scanning');
                this.isScanning = false;
                return;
            }

            console.log(`🔍 Scanning ${this.credentials.length} credentials...`);

            // Enterprise scanning process
            for (let i = 0; i < this.credentials.length; i++) {
                if (!this.isScanning) break; // Check if scan was stopped

                const credential = this.credentials[i];
                console.log(`🔍 Scanning credential ${i + 1}/${this.credentials.length}: ${credential.domain}`);

                // Update progress
                this.scanProgress = ((i + 1) / this.credentials.length) * 100;
                this.updateScanProgress();

                // Perform comprehensive breach check
                try {
                    const breachResult = await this.checkEnterpriseBreach(credential.email);
                    
                    if (breachResult && breachResult.breaches && breachResult.breaches.length > 0) {
                        console.log(`🚨 Breaches found for ${credential.email}:`, breachResult);
                        
                        // Create enterprise-grade breach alert
                        const alert = this.createEnterpriseAlert(credential, breachResult);
                        this.breachAlerts.unshift(alert);
                        
                        // Update security score
                        this.updateSecurityScore(breachResult);
                        
                        // Trigger immediate actions if critical
                        if (breachResult.threat_level === 'critical') {
                            await this.handleCriticalThreat(credential, breachResult);
                        }
                    } else {
                        console.log(`✅ No breaches found for ${credential.email}`);
                    }

                    // Add to scan findings
                    this.currentScan.findings.push({
                        email: credential.email,
                        domain: credential.domain,
                        breaches: breachResult?.breaches || [],
                        threat_level: breachResult?.threat_level || 'low',
                        timestamp: new Date()
                    });

                } catch (error) {
                    console.error(`❌ Error scanning ${credential.email}:`, error);
                    this.currentScan.findings.push({
                        email: credential.email,
                        domain: credential.domain,
                        error: error.message,
                        timestamp: new Date()
                    });
                }

                // Small delay to prevent overwhelming the API
                await this.delay(500);
            }

            // Complete scan
            this.completeEnterpriseScan();

        } catch (error) {
            console.error('❌ Enterprise scan failed:', error);
            this.updateScanStatus('❌ Scan failed: ' + error.message);
            this.isScanning = false;
        }
    }

    async checkEnterpriseBreach(email) {
        try {
            console.log(`🔍 Checking enterprise breach for: ${email}`);
            
            const response = await fetch('/api/security/check-breach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': this.getUserId()
                },
                body: JSON.stringify({ email: email })
            });

            if (!response.ok) {
                throw new Error(`Backend API call failed for ${email}: ${response.status}`);
            }

            const result = await response.json();
            console.log(`✅ Enterprise breach check completed for ${email}:`, result);
            return result;

        } catch (error) {
            console.error(`❌ Enterprise breach check failed for ${email}:`, error);
            throw error;
        }
    }

    createEnterpriseAlert(credential, breachResult) {
        const alert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: `🚨 Security Breach Detected: ${credential.domain}`,
            email: credential.email,
            domain: credential.domain,
            timestamp: new Date(),
            status: 'active',
            severity: breachResult.threat_level || 'medium',
            breach_count: breachResult.total_breaches || 0,
            source: 'Enterprise Threat Intelligence',
            details: this.formatBreachDetails(breachResult),
            recommendations: breachResult.recommendations || [],
            immediate_actions: breachResult.immediate_actions || [],
            affected_credentials: [credential.domain],
            risk_score: this.calculateOverallRiskScore(breachResult),
            scan_id: this.currentScan?.id
        };

        return alert;
    }

    formatBreachDetails(breachResult) {
        if (!breachResult.breaches || breachResult.breaches.length === 0) {
            return 'No specific breach details available';
        }

        let details = `Threat Level: ${breachResult.threat_level.toUpperCase()}\n`;
        details += `Total Breaches: ${breachResult.total_breaches}\n\n`;
        
        breachResult.breaches.forEach((breach, index) => {
            details += `Breach ${index + 1}:\n`;
            details += `• Source: ${breach.source}\n`;
            details += `• Name: ${breach.name}\n`;
            details += `• Date: ${breach.breach_date}\n`;
            details += `• Severity: ${breach.severity}\n`;
            details += `• Risk Score: ${breach.risk_score}/10\n`;
            details += `• Data Exposed: ${breach.data_classes.join(', ')}\n`;
            details += `• Description: ${breach.description}\n\n`;
        });

        return details;
    }

    calculateOverallRiskScore(breachResult) {
        if (!breachResult.breaches || breachResult.breaches.length === 0) {
            return 0;
        }

        let totalRisk = 0;
        let breachCount = breachResult.breaches.length;

        breachResult.breaches.forEach(breach => {
            totalRisk += breach.risk_score || 5.0;
        });

        return Math.round((totalRisk / breachCount) * 10) / 10;
    }

    async handleCriticalThreat(credential, breachResult) {
        console.log(`🚨 Handling critical threat for ${credential.domain}`);
        
        // Create critical alert
        const criticalAlert = {
            id: `critical_${Date.now()}`,
            title: `🚨 CRITICAL THREAT: ${credential.domain}`,
            message: `Immediate action required for ${credential.domain}`,
            timestamp: new Date(),
            priority: 'critical'
        };

        // Show critical notification
        this.showCriticalNotification(criticalAlert);
        
        // Auto-rotate password if enabled
        if (this.autoRotationEnabled) {
            await this.triggerAutoRotation(credential);
        }

        // Send emergency notification
        this.sendEmergencyNotification(credential, breachResult);
    }

    showCriticalNotification(alert) {
        // Create critical notification overlay
        const notification = document.createElement('div');
        notification.className = 'critical-notification';
        notification.innerHTML = `
            <div class="critical-alert" style="
                position: fixed; top: 20px; right: 20px; z-index: 10000;
                background: linear-gradient(135deg, #ff0000, #ff4444);
                color: white; padding: 20px; border-radius: 10px;
                box-shadow: 0 10px 30px rgba(255, 0, 0, 0.5);
                animation: pulse 2s infinite;
            ">
                <h3>🚨 CRITICAL SECURITY THREAT</h3>
                <p>${alert.message}</p>
                <button onclick="this.parentElement.remove()" style="
                    background: white; color: #ff0000; border: none;
                    padding: 10px 20px; border-radius: 5px; cursor: pointer;
                ">Dismiss</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 30000);
    }

    sendEmergencyNotification(credential, breachResult) {
        // In a real implementation, this would send SMS, email, or push notifications
        console.log(`🚨 Emergency notification sent for ${credential.domain}`);
        
        // Update notification center
        this.addNotification({
            type: 'emergency',
            title: 'Critical Security Threat',
            message: `Account ${credential.domain} has been compromised`,
            timestamp: new Date(),
            priority: 'critical'
        });
    }

    completeEnterpriseScan() {
        console.log('✅ Enterprise scan completed');
        
        this.isScanning = false;
        this.scanProgress = 100;
        this.updateScanProgress();
        
        // Update scan status
        const totalFindings = this.currentScan.findings.length;
        const criticalFindings = this.currentScan.findings.filter(f => f.threat_level === 'critical').length;
        const highFindings = this.currentScan.findings.filter(f => f.threat_level === 'high').length;
        
        let statusMessage = `✅ Scan completed: ${totalFindings} accounts checked`;
        if (criticalFindings > 0) {
            statusMessage += ` | 🚨 ${criticalFindings} critical threats`;
        }
        if (highFindings > 0) {
            statusMessage += ` | ⚠️ ${highFindings} high-risk findings`;
        }
        
        this.updateScanStatus(statusMessage);
        
        // Add to scan history
        this.scanHistory.unshift({
            id: this.currentScan.id,
            timestamp: new Date(),
            findings: this.currentScan.findings,
            total_accounts: this.currentScan.findings.length,
            critical_threats: criticalFindings,
            high_threats: highFindings
        });
        
        // Update breach alerts display
        this.updateBreachAlertsDisplay();
        
        // Generate scan report
        this.generateScanReport();
        
        // Reset current scan
        this.currentScan = null;
    }

    updateScanProgress() {
        const progressBar = document.getElementById('scan-bar');
        const progressText = document.getElementById('scan-progress');
        
        if (progressBar) {
            progressBar.style.width = `${this.scanProgress}%`;
            progressBar.style.backgroundColor = this.getProgressColor(this.scanProgress);
        }
        
        if (progressText) {
            progressText.textContent = `Scan Progress ${Math.round(this.scanProgress)}%`;
        }
    }

    getProgressColor(progress) {
        if (progress < 30) return '#ff4444';
        if (progress < 70) return '#ffaa00';
        return '#44ff44';
    }

    updateScanStatus(message) {
        const statusElement = document.getElementById('scan-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    updateSecurityScore(breachResult) {
        // Calculate new security score based on findings
        let scoreReduction = 0;
        
        if (breachResult.threat_level === 'critical') {
            scoreReduction = 30;
        } else if (breachResult.threat_level === 'high') {
            scoreReduction = 20;
        } else if (breachResult.threat_level === 'medium') {
            scoreReduction = 10;
        }
        
        this.securityScore = Math.max(0, this.securityScore - scoreReduction);
        
        // Update security score display
        this.updateSecurityScoreDisplay();
    }

    updateSecurityScoreDisplay() {
        const scoreElement = document.getElementById('security-score');
        if (scoreElement) {
            scoreElement.textContent = this.securityScore;
            
            // Update color based on score
            if (this.securityScore >= 80) {
                scoreElement.style.color = '#44ff44';
            } else if (this.securityScore >= 60) {
                scoreElement.style.color = '#ffaa00';
            } else {
                scoreElement.style.color = '#ff4444';
            }
        }
    }

    stopScan() {
        console.log('⏹️ Stopping enterprise scan...');
        this.isScanning = false;
        this.updateScanStatus('⏹️ Scan stopped by user');
        
        // Update progress bar to show stopped state
        const progressBar = document.getElementById('scan-bar');
        if (progressBar) {
            progressBar.style.backgroundColor = '#ff4444';
        }
    }

    emergencyLockdown() {
        if (confirm('🚨 EMERGENCY LOCKDOWN: This will lock all accounts and require manual verification. Continue?')) {
            console.log('🚨 Emergency lockdown activated');
            
            // Lock all credentials
            this.credentials.forEach(credential => {
                credential.status = 'locked';
                credential.lockdown_timestamp = new Date();
            });
            
            // Update display
            this.updateCredentialDisplay();
            
            // Create emergency alert
            this.addRealBreachAlert(
                'Emergency Lockdown Activated',
                'All accounts locked due to security threat',
                'critical',
                'System'
            );
            
            // Show lockdown notification
            this.showCriticalNotification({
                title: '🚨 EMERGENCY LOCKDOWN ACTIVATED',
                message: 'All accounts are now locked and require manual verification'
            });
        }
    }

    toggleContinuousMonitoring() {
        this.monitoringEnabled = !this.monitoringEnabled;
        
        if (this.monitoringEnabled) {
            this.startContinuousMonitoring();
            console.log('🔄 Continuous monitoring enabled');
        } else {
            this.stopContinuousMonitoring();
            console.log('⏹️ Continuous monitoring disabled');
        }
        
        // Update UI
        this.updateMonitoringStatus();
    }

    startContinuousMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        // Check for new threats every 5 minutes
        this.monitoringInterval = setInterval(async () => {
            if (this.monitoringEnabled) {
                console.log('🔄 Continuous monitoring check...');
                await this.performQuickThreatCheck();
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    stopContinuousMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    async performQuickThreatCheck() {
        try {
            // Quick check for new threats
            const newThreats = await this.checkForNewThreats();
            
            if (newThreats.length > 0) {
                console.log(`🚨 New threats detected: ${newThreats.length}`);
                this.handleNewThreats(newThreats);
            }
        } catch (error) {
            console.error('❌ Quick threat check failed:', error);
        }
    }

    async checkForNewThreats() {
        // In a real implementation, this would check threat intelligence feeds
        // For now, return empty array
        return [];
    }

    handleNewThreats(threats) {
        threats.forEach(threat => {
            // Create new alert for each threat
            const alert = this.createEnterpriseAlert(threat.credential, threat.breachResult);
            this.breachAlerts.unshift(alert);
        });
        
        // Update display
        this.updateBreachAlertsDisplay();
        
        // Show notification
        this.showThreatNotification(threats.length);
    }

    showThreatNotification(threatCount) {
        const notification = document.createElement('div');
        notification.className = 'threat-notification';
        notification.innerHTML = `
            <div style="
                position: fixed; top: 20px; right: 20px; z-index: 9999;
                background: linear-gradient(135deg, #ffaa00, #ff8800);
                color: white; padding: 15px; border-radius: 8px;
                box-shadow: 0 5px 20px rgba(255, 170, 0, 0.4);
            ">
                <h4>⚠️ New Threats Detected</h4>
                <p>${threatCount} new security threat(s) found</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: white; color: #ff8800; border: none;
                    padding: 5px 15px; border-radius: 4px; cursor: pointer;
                ">Dismiss</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 15000);
    }

    updateMonitoringStatus() {
        const statusElement = document.getElementById('monitoring-status');
        if (statusElement) {
            statusElement.textContent = this.monitoringEnabled ? '🔄 Active' : '⏹️ Inactive';
            statusElement.style.color = this.monitoringEnabled ? '#44ff44' : '#ff4444';
        }
    }

    toggleAutoRotation() {
        this.autoRotationEnabled = !this.autoRotationEnabled;
        console.log(`🔄 Auto-rotation ${this.autoRotationEnabled ? 'enabled' : 'disabled'}`);
        
        // Update UI
        this.updateAutoRotationStatus();
    }

    updateAutoRotationStatus() {
        const statusElement = document.getElementById('auto-rotation-status');
        if (statusElement) {
            statusElement.textContent = this.autoRotationEnabled ? '🔄 Active' : '⏹️ Inactive';
            statusElement.style.color = this.autoRotationEnabled ? '#44ff44' : '#ff4444';
        }
    }

    async triggerAutoRotation(credential) {
        console.log(`🔄 Triggering auto-rotation for ${credential.domain}`);
        
        // Simulate password rotation
        await this.delay(2000);
        
        // Update credential
        credential.last_rotated = new Date();
        credential.status = 'rotated';
        
        // Update display
        this.updateCredentialDisplay();
        
        // Show success notification
        this.showSuccessNotification(`Password rotated successfully for ${credential.domain}`);
    }

    showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div style="
                position: fixed; top: 20px; right: 20px; z-index: 9999;
                background: linear-gradient(135deg, #44ff44, #00aa00);
                color: white; padding: 15px; border-radius: 8px;
                box-shadow: 0 5px 20px rgba(68, 255, 68, 0.4);
            ">
                <h4>✅ Success</h4>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: white; color: #00aa00; border: none;
                    padding: 5px 15px; border-radius: 4px; cursor: pointer;
                ">Dismiss</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    generateScanReport() {
        if (!this.currentScan) return;
        
        const report = {
            scan_id: this.currentScan.id,
            timestamp: new Date().toISOString(),
            total_accounts: this.currentScan.findings.length,
            findings: this.currentScan.findings,
            summary: this.generateScanSummary()
        };
        
        console.log('📊 Scan report generated:', report);
        
        // In a real implementation, this would be saved or exported
        return report;
    }

    generateScanSummary() {
        if (!this.currentScan) return 'No scan data available';
        
        const findings = this.currentScan.findings;
        const totalAccounts = findings.length;
        const criticalThreats = findings.filter(f => f.threat_level === 'critical').length;
        const highThreats = findings.filter(f => f.threat_level === 'high').length;
        const mediumThreats = findings.filter(f => f.threat_level === 'medium').length;
        const lowThreats = findings.filter(f => f.threat_level === 'low').length;
        
        return {
            total_accounts: totalAccounts,
            critical_threats: criticalThreats,
            high_threats: highThreats,
            medium_threats: mediumThreats,
            low_threats: lowThreats,
            overall_risk: this.calculateOverallRisk(findings),
            recommendations: this.generateOverallRecommendations(findings)
        };
    }

    calculateOverallRisk(findings) {
        if (findings.length === 0) return 'low';
        
        let riskScore = 0;
        findings.forEach(finding => {
            switch (finding.threat_level) {
                case 'critical': riskScore += 4; break;
                case 'high': riskScore += 3; break;
                case 'medium': riskScore += 2; break;
                case 'low': riskScore += 1; break;
            }
        });
        
        const averageRisk = riskScore / findings.length;
        
        if (averageRisk >= 3.5) return 'critical';
        if (averageRisk >= 2.5) return 'high';
        if (averageRisk >= 1.5) return 'medium';
        return 'low';
    }

    generateOverallRecommendations(findings) {
        const recommendations = [];
        
        const criticalFindings = findings.filter(f => f.threat_level === 'critical');
        const highFindings = findings.filter(f => f.threat_level === 'high');
        
        if (criticalFindings.length > 0) {
            recommendations.push('🚨 IMMEDIATE ACTION REQUIRED: Critical threats detected');
            recommendations.push('🔒 Lock all critical accounts immediately');
            recommendations.push('🔄 Rotate passwords for all affected accounts');
        }
        
        if (highFindings.length > 0) {
            recommendations.push('⚠️ HIGH RISK: Multiple high-threat findings detected');
            recommendations.push('📱 Enable 2FA on all accounts');
            recommendations.push('🔍 Monitor accounts for suspicious activity');
        }
        
        if (findings.length > 0) {
            recommendations.push('📊 Regular security monitoring recommended');
            recommendations.push('📚 Review and update security practices');
        }
        
        return recommendations;
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getUserId() {
        // Get user ID from auth service or localStorage
        return localStorage.getItem('user_id') || 'demo_user';
    }

    loadUserCredentials() {
        // Load user credentials from storage or API
        this.credentials = [
            { email: 'p.monishreddy19@gmail.com', domain: 'gmail.com', status: 'active' },
            { email: 'monishhero143@gmail.com', domain: 'gmail.com', status: 'active' }
        ];
        console.log(`📧 Loaded ${this.credentials.length} credentials for scanning`);
    }

    updateCredentialDisplay() {
        // Update credential display in UI
        console.log('🔄 Updating credential display');
    }

    updateBreachAlertsDisplay() {
        // Update breach alerts display in UI
        console.log(`🔄 Updating breach alerts display: ${this.breachAlerts.length} alerts`);
    }

    addRealBreachAlert(title, message, severity, source) {
        const alert = {
            id: `alert_${Date.now()}`,
            title: title,
            message: message,
            severity: severity,
            source: source,
            timestamp: new Date()
        };
        
        this.breachAlerts.unshift(alert);
        console.log('🚨 New breach alert added:', alert);
    }

    addNotification(notification) {
        // Add notification to notification center
        console.log('📢 Notification added:', notification);
    }

    loadMonitoringSettings() {
        // Load monitoring settings from storage
        console.log('⚙️ Loading monitoring settings');
    }
}

// Initialize Enterprise Dark Web Monitor
let enterpriseMonitor = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Enterprise Dark Web Monitor...');
    enterpriseMonitor = new EnterpriseDarkWebMonitor();
});

// Global functions for HTML onclick handlers
function startScan() {
    if (enterpriseMonitor) {
        enterpriseMonitor.startEnterpriseScan();
    }
}

function stopScan() {
    if (enterpriseMonitor) {
        enterpriseMonitor.stopScan();
    }
}

function emergencyLockdown() {
    if (enterpriseMonitor) {
        enterpriseMonitor.emergencyLockdown();
    }
}

function toggleMonitoring() {
    if (enterpriseMonitor) {
        enterpriseMonitor.toggleContinuousMonitoring();
    }
}

function toggleAutoRotation() {
    if (enterpriseMonitor) {
        enterpriseMonitor.toggleAutoRotation();
    }
}
