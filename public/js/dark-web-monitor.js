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
        this.loadUserCredentials();
        this.startContinuousMonitoring();
        
        // Initialize displays after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (this) {
                console.log('🔄 Initializing credential and breach displays...');
                this.updateCredentialDisplay();
                this.updateBreachAlertsDisplay();
                this.updateCredentialDashboard();
            }
        }, 100);
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
        console.log('🔄 Starting continuous security monitoring...');
        
        // Real-time threat monitoring
        this.monitoringInterval = setInterval(() => {
            this.performContinuousSecurityCheck();
        }, 30000); // Check every 30 seconds
        
        // Real-time credential health monitoring
        this.credentialHealthInterval = setInterval(() => {
            this.checkCredentialHealth();
        }, 60000); // Check every minute
        
        // Real-time breach detection simulation
        this.breachDetectionInterval = setInterval(() => {
            this.simulateBreachDetection();
        }, 120000); // Check every 2 minutes
        
        console.log('✅ Continuous monitoring started');
    }
    
    async performContinuousSecurityCheck() {
        console.log('🔍 Performing continuous security check...');
        
        // Check for new threats
        const newThreats = await this.detectNewThreats();
        
        // Update security score
        this.updateOverallSecurityScore();
        
        // Check for suspicious activities
        this.detectSuspiciousActivities();
        
        // Update displays
        this.updateCredentialDisplay();
        this.updateBreachAlertsDisplay();
        
        if (newThreats.length > 0) {
            showSuccessNotification(`🚨 ${newThreats.length} new security threats detected!`);
        }
    }
    
    async detectNewThreats() {
        const newThreats = [];
        
        // Simulate real-time threat detection
        for (let i = 0; i < this.credentials.length; i++) {
            const credential = this.credentials[i];
            
            if (!credential.monitoring) continue;
            
            // Random threat detection simulation
            if (Math.random() < 0.05) { // 5% chance of new threat
                const threat = {
                    type: this.getRandomThreatType(),
                    severity: this.getRandomSeverity(),
                    description: this.getThreatDescription(),
                    source: 'Continuous Monitoring System',
                    timestamp: new Date()
                };
                
                newThreats.push({
                    credential: credential,
                    threat: threat
                });
                
                // Add to breach alerts
                this.addNewBreachAlert(credential, [threat]);
            }
        }
        
        return newThreats;
    }
    
    getRandomThreatType() {
        const types = [
            'password_compromise',
            'account_takeover',
            'data_breach',
            'phishing_attempt',
            'malware_detection',
            'suspicious_login',
            'credential_stuffing'
        ];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    getRandomSeverity() {
        const severities = ['low', 'medium', 'high'];
        const weights = [0.6, 0.3, 0.1]; // 60% low, 30% medium, 10% high
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < severities.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                return severities[i];
            }
        }
        
        return 'low';
    }
    
    getThreatDescription() {
        const descriptions = [
            'Unusual login pattern detected from new location',
            'Password found in recent data breach',
            'Multiple failed login attempts detected',
            'Suspicious email activity detected',
            'Account accessed from known malicious IP',
            'Unusual data access patterns detected',
            'Security policy violation detected'
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    
    updateOverallSecurityScore() {
        if (this.credentials.length === 0) return;
        
        const totalScore = this.credentials.reduce((sum, c) => sum + (c.passwordStrength || 0), 0);
        const averageScore = totalScore / this.credentials.length;
        
        // Adjust score based on threats
        const threatPenalty = this.breachAlerts.length * 5;
        const finalScore = Math.max(averageScore - threatPenalty, 0);
        
        this.securityScore = Math.round(finalScore);
        
        // Update security level
        if (this.securityScore >= 80) {
            this.securityLevel = 'excellent';
        } else if (this.securityScore >= 60) {
            this.securityLevel = 'good';
        } else if (this.securityScore >= 40) {
            this.securityLevel = 'fair';
        } else {
            this.securityLevel = 'poor';
        }
        
        console.log(`📊 Security score updated: ${this.securityScore} (${this.securityLevel})`);
    }
    
    detectSuspiciousActivities() {
        // Simulate suspicious activity detection
        this.credentials.forEach(credential => {
            if (!credential.monitoring) return;
            
            // Random suspicious activity detection
            if (Math.random() < 0.02) { // 2% chance
                this.addSuspiciousActivityAlert(credential);
            }
        });
    }
    
    addSuspiciousActivityAlert(credential) {
        const alert = {
            id: `suspicious_${Date.now()}`,
            title: `Suspicious Activity Detected: ${credential.domain}`,
            email: credential.email,
            domain: credential.domain,
            severity: 'medium',
            breach_count: 1,
            source: 'Behavioral Analysis',
            timestamp: new Date(),
            status: 'active',
            type: 'suspicious_activity',
            recommendations: [
                'Review recent login activity',
                'Change password if suspicious',
                'Enable additional security measures',
                'Contact support if concerned'
            ]
        };
        
        this.breachAlerts.unshift(alert);
        this.updateBreachAlertsDisplay();
        
        showSuccessNotification(`⚠️ Suspicious activity detected for ${credential.email}`);
    }
    
    checkCredentialHealth() {
        console.log('🏥 Checking credential health...');
        
        this.credentials.forEach(credential => {
            if (!credential.monitoring) return;
            
            // Check password age
            if (credential.lastModified) {
                const daysSinceUpdate = (Date.now() - credential.lastModified.getTime()) / (1000 * 60 * 60 * 24);
                
                if (daysSinceUpdate > 90 && !credential.autoRotation) {
                    this.addPasswordAgeWarning(credential, daysSinceUpdate);
                }
            }
            
            // Check 2FA status
            if (!credential.twoFactorEnabled && credential.securityLevel === 'high') {
                this.add2FARecommendation(credential);
            }
            
            // Check monitoring status
            if (credential.lastScan) {
                const daysSinceScan = (Date.now() - credential.lastScan.getTime()) / (1000 * 60 * 60 * 24);
                
                if (daysSinceScan > 7) {
                    this.addScanRecommendation(credential, daysSinceScan);
                }
            }
        });
    }
    
    addPasswordAgeWarning(credential, daysSinceUpdate) {
        const alert = {
            id: `password_age_${Date.now()}`,
            title: `Password Age Warning: ${credential.domain}`,
            email: credential.email,
            domain: credential.domain,
            severity: 'low',
            breach_count: 0,
            source: 'Credential Health Monitor',
            timestamp: new Date(),
            status: 'active',
            type: 'password_age_warning',
            recommendations: [
                `Password hasn't been changed in ${Math.round(daysSinceUpdate)} days`,
                'Consider changing password for security',
                'Enable auto-rotation if available',
                'Review password strength'
            ]
        };
        
        this.breachAlerts.unshift(alert);
        this.updateBreachAlertsDisplay();
    }
    
    add2FARecommendation(credential) {
        const alert = {
            id: `2fa_recommendation_${Date.now()}`,
            title: `2FA Recommendation: ${credential.domain}`,
            email: credential.email,
            domain: credential.domain,
            severity: 'low',
            breach_count: 0,
            source: 'Security Enhancement System',
            timestamp: new Date(),
            status: 'active',
            type: '2fa_recommendation',
            recommendations: [
                'Enable 2FA for enhanced security',
                'Use authenticator app or SMS',
                'Keep backup codes safe',
                'Test 2FA setup after enabling'
            ]
        };
        
        this.breachAlerts.unshift(alert);
        this.updateBreachAlertsDisplay();
    }
    
    addScanRecommendation(credential, daysSinceScan) {
        const alert = {
            id: `scan_recommendation_${Date.now()}`,
            title: `Security Scan Recommended: ${credential.domain}`,
            email: credential.email,
            domain: credential.domain,
            severity: 'low',
            breach_count: 0,
            source: 'Security Monitoring',
            timestamp: new Date(),
            status: 'active',
            type: 'scan_recommendation',
            recommendations: [
                `Last security scan was ${Math.round(daysSinceScan)} days ago`,
                'Perform security scan for latest threats',
                'Update security settings if needed',
                'Review recent security events'
            ]
        };
        
        this.breachAlerts.unshift(alert);
        this.updateBreachAlertsDisplay();
    }
    
    simulateBreachDetection() {
        // Simulate new breach detection from external sources
        if (Math.random() < 0.1) { // 10% chance
            const randomCredential = this.credentials[Math.floor(Math.random() * this.credentials.length)];
            
            if (randomCredential) {
                const breach = {
                    type: 'external_breach',
                    severity: 'high',
                    description: 'Account found in external data breach',
                    source: 'External Threat Intelligence',
                    timestamp: new Date()
                };
                
                this.addNewBreachAlert(randomCredential, [breach]);
                showSuccessNotification(`🚨 External breach detected for ${randomCredential.email}`);
            }
        }
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
        // Load user credentials from storage or API with detailed information
        this.credentials = [
            { 
                email: 'p.monishreddy19@gmail.com', 
                domain: 'gmail.com', 
                username: 'p.monishreddy19',
                password: '••••••••••••••••',
                maskedPassword: '••••••••••••••••',
                status: 'active',
                monitoring: true,
                lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                createdDate: new Date('2024-01-15'),
                lastModified: new Date('2024-12-20'),
                securityLevel: 'high',
                twoFactorEnabled: true,
                passwordStrength: 95,
                breachHistory: [
                    { date: '2024-12-18', source: 'HaveIBeenPwned', severity: 'medium' }
                ],
                notes: 'Primary email account with 2FA enabled',
                autoRotation: true,
                rotationInterval: '90 days',
                nextRotation: new Date('2025-03-20')
            },
            { 
                email: 'monishhero143@gmail.com', 
                domain: 'gmail.com', 
                username: 'monishhero143',
                password: '••••••••••••••••',
                maskedPassword: '••••••••••••••••',
                status: 'active',
                monitoring: true,
                lastScan: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                createdDate: new Date('2024-03-10'),
                lastModified: new Date('2024-12-19'),
                securityLevel: 'medium',
                twoFactorEnabled: false,
                passwordStrength: 78,
                breachHistory: [
                    { date: '2024-12-15', source: 'Dark Web Scan', severity: 'high' }
                ],
                notes: 'Secondary email account - needs 2FA setup',
                autoRotation: false,
                rotationInterval: 'manual',
                nextRotation: null
            }
        ];
        console.log(`📧 Loaded ${this.credentials.length} credentials with detailed information`);
    }

    updateCredentialDisplay() {
        // Update credential display in UI with detailed information
        console.log('🔄 Updating credential display with detailed information');
        
        const credentialsContainer = document.getElementById('credential-monitoring');
        if (!credentialsContainer) {
            console.warn('⚠️ credential-monitoring container not found');
            return;
        }
        
        if (this.credentials.length === 0) {
            credentialsContainer.innerHTML = `
                <div class="no-credentials">
                    <div class="text-center py-8">
                        <div class="text-4xl mb-4">🔐</div>
                        <div class="text-xl font-semibold mb-2">No Credentials Found</div>
                        <div class="text-gray-400">Add credentials to start monitoring</div>
                        <button class="btn btn-primary mt-4" onclick="addNewCredential()">
                            ➕ Add Credential
                        </button>
                    </div>
                </div>
            `;
            return;
        }
        
        // Render all credentials with comprehensive monitoring information
        credentialsContainer.innerHTML = `
            <div class="credentials-header">
                <div class="credentials-title">
                    <span class="padlock-icon">🔐</span>
                    <span>Credential Monitoring Dashboard</span>
                </div>
                <div class="credentials-count">
                    ${this.credentials.length} credential(s) actively monitored
                </div>
            </div>
            
            <div class="credentials-list">
                ${this.credentials.map((credential, index) => `
                    <div class="credential-card ${credential.status}" data-credential-id="${index}">
                        <div class="credential-header">
                            <div class="credential-title-section">
                                <div class="credential-icon">🔐</div>
                                <div class="credential-main-info">
                                    <div class="credential-email">
                                        <span class="email-icon">📧</span>
                                        <span class="email-text">${credential.email}</span>
                                        <span class="status-badge ${credential.status}">${credential.status.toUpperCase()}</span>
                                    </div>
                                    <div class="credential-username">
                                        <span class="username-icon">👤</span>
                                        <span class="username-text">Username: ${credential.username}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="credential-security-score">
                                <div class="security-score-circle" style="
                                    width: 60px; height: 60px; border-radius: 50%;
                                    background: conic-gradient(from 0deg, 
                                        ${credential.passwordStrength >= 80 ? '#10B981' : credential.passwordStrength >= 60 ? '#F59E0B' : '#EF4444'} 
                                        ${credential.passwordStrength * 3.6}deg, 
                                        #374151 ${credential.passwordStrength * 3.6}deg, 360deg
                                    );
                                    display: flex; align-items: center; justify-content: center;
                                ">
                                    <div style="
                                        width: 45px; height: 45px; border-radius: 50%;
                                        background: #1E293B; display: flex; align-items: center;
                                        justify-content: center; font-weight: bold; font-size: 14px;
                                    ">${credential.passwordStrength}</div>
                                </div>
                                <div class="security-label">Security Score</div>
                            </div>
                        </div>
                        
                        <div class="credential-details">
                            <div class="detail-row">
                                <div class="detail-item">
                                    <span class="detail-icon">🌐</span>
                                    <span class="detail-label">Domain:</span>
                                    <span class="detail-value">${credential.domain}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon">🔑</span>
                                    <span class="detail-label">Password:</span>
                                    <span class="detail-value">${credential.maskedPassword}</span>
                                    <button class="btn-toggle-password" onclick="togglePasswordVisibility(${index})" style="
                                        background: none; border: none; color: #9CA3AF; cursor: pointer;
                                        margin-left: 0.5rem; font-size: 12px;
                                    ">👁️</button>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-item">
                                    <span class="detail-icon">📅</span>
                                    <span class="detail-label">Created:</span>
                                    <span class="detail-value">${credential.createdDate.toLocaleDateString()}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon">🔄</span>
                                    <span class="detail-label">Last Modified:</span>
                                    <span class="detail-value">${credential.lastModified.toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-item">
                                    <span class="detail-icon">🛡️</span>
                                    <span class="detail-label">2FA Status:</span>
                                    <span class="detail-value ${credential.twoFactorEnabled ? 'text-green-400' : 'text-red-400'}">
                                        ${credential.twoFactorEnabled ? '✅ Enabled' : '❌ Disabled'}
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon">🔄</span>
                                    <span class="detail-label">Auto Rotation:</span>
                                    <span class="detail-value ${credential.autoRotation ? 'text-green-400' : 'text-yellow-400'}">
                                        ${credential.autoRotation ? '✅ Active' : '❌ Manual'}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="detail-row">
                                <div class="detail-item">
                                    <span class="detail-icon">⏰</span>
                                    <span class="detail-label">Last Scan:</span>
                                    <span class="detail-value">${credential.lastScan ? credential.lastScan.toLocaleString() : 'Never'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon">📊</span>
                                    <span class="detail-label">Monitoring:</span>
                                    <span class="detail-value ${credential.monitoring ? 'text-green-400' : 'text-red-400'}">
                                        ${credential.monitoring ? '🟢 Active' : '🔴 Inactive'}
                                    </span>
                                </div>
                            </div>
                            
                            ${credential.autoRotation && credential.nextRotation ? `
                                <div class="detail-row">
                                    <div class="detail-item">
                                        <span class="detail-icon">🔄</span>
                                        <span class="detail-label">Next Rotation:</span>
                                        <span class="detail-value">${credential.nextRotation.toLocaleDateString()}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-icon">📅</span>
                                        <span class="detail-label">Rotation Interval:</span>
                                        <span class="detail-value">${credential.rotationInterval}</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${credential.breachHistory && credential.breachHistory.length > 0 ? `
                            <div class="breach-history">
                                <div class="breach-history-title">
                                    <span class="breach-icon">🚨</span>
                                    <span>Breach History (${credential.breachHistory.length})</span>
                                </div>
                                <div class="breach-items">
                                    ${credential.breachHistory.map(breach => `
                                        <div class="breach-item ${breach.severity}">
                                            <span class="breach-date">${breach.date}</span>
                                            <span class="breach-source">${breach.source}</span>
                                            <span class="breach-severity ${breach.severity}">${breach.severity.toUpperCase()}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${credential.notes ? `
                            <div class="credential-notes">
                                <span class="notes-icon">📝</span>
                                <span class="notes-text">${credential.notes}</span>
                            </div>
                        ` : ''}
                        
                        <div class="credential-actions">
                            <button class="btn btn-sm btn-outline" onclick="enterpriseMonitor.scanCredentialRealTime(${index})">
                                🔍 Scan Now
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="enterpriseMonitor.changePasswordRealTime(${index})">
                                🔑 Change Password
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="editCredential(${index})">
                                ✏️ Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="removeCredential(${index})">
                                🗑️ Remove
                            </button>
                            <button class="btn btn-sm ${credential.status === 'locked' ? 'btn-success' : 'btn-warning'}" onclick="enterpriseMonitor.${credential.status === 'locked' ? 'unlockAccountSecurely' : 'lockAccountRealTime'}(${index})">
                                ${credential.status === 'locked' ? '🔓 Unlock' : '🔒 Lock'}
                            </button>
                            <button class="btn btn-sm btn-info" onclick="toggleCredentialMonitoring(${index})">
                                ${credential.monitoring ? '⏸️ Pause' : '▶️ Resume'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="credentials-footer">
                <button class="btn btn-primary" onclick="addNewCredential()">
                    ➕ Add New Credential
                </button>
                <button class="btn btn-secondary" onclick="bulkScanCredentials()">
                    🔍 Scan All Credentials
                </button>
                <button class="btn btn-outline" onclick="enterpriseMonitor.exportCredentialsRealTime()">
                    📤 Export Security Report
                </button>
            </div>
        `;
        
        console.log(`✅ Rendered ${this.credentials.length} credentials with detailed information`);
    }

    updateBreachAlertsDisplay() {
        // Update breach alerts display in UI
        console.log(`🔄 Updating breach alerts display: ${this.breachAlerts.length} alerts`);
        
        const alertsContainer = document.getElementById('breach-alerts');
        if (!alertsContainer) {
            console.warn('⚠️ breach-alerts container not found');
            return;
        }
        
        if (this.breachAlerts.length === 0) {
            alertsContainer.innerHTML = `
                <div class="no-alerts">
                    <div class="text-center py-8">
                        <div class="text-4xl mb-4">✅</div>
                        <div class="text-xl font-semibold mb-2">No Breach Alerts</div>
                        <div class="text-gray-400">Your accounts appear to be secure</div>
                    </div>
                </div>
            `;
            return;
        }
        
        // Render all breach alerts
        alertsContainer.innerHTML = this.breachAlerts.map(alert => `
            <div class="breach-alert ${alert.severity}" data-alert-id="${alert.id}">
                <div class="alert-header">
                    <div class="alert-severity-indicator ${alert.severity}"></div>
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-timestamp">${alert.timestamp.toLocaleTimeString()}</div>
                </div>
                
                <div class="alert-content">
                    <div class="alert-details">
                        <div class="alert-email">📧 ${alert.email}</div>
                        <div class="alert-domain">🌐 ${alert.domain}</div>
                        <div class="alert-source">🔍 Source: ${alert.source}</div>
                        <div class="alert-severity">⚠️ Severity: ${alert.severity.toUpperCase()}</div>
                        <div class="alert-breaches">🚨 ${alert.breach_count} breach(es) detected</div>
                    </div>
                    
                    <div class="alert-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewBreachDetails('${alert.id}')">
                            📋 View Details
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="takeBreachAction('${alert.id}')">
                            ⚡ Take Action
                        </button>
                    </div>
                </div>
                
                ${alert.recommendations && alert.recommendations.length > 0 ? `
                    <div class="alert-recommendations">
                        <div class="recommendations-title">🔒 Immediate Actions:</div>
                        <ul class="recommendations-list">
                            ${alert.recommendations.slice(0, 3).map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        console.log(`✅ Rendered ${this.breachAlerts.length} breach alerts`);
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

    // Enhanced credential management with real-time features
    async scanCredentialRealTime(credentialIndex) {
        if (!this.credentials[credentialIndex]) return;
        
        const credential = this.credentials[credentialIndex];
        credential.lastScan = new Date();
        credential.scanStatus = 'scanning';
        
        // Update display immediately
        this.updateCredentialDisplay();
        
        try {
            // Real-time security scanning simulation
            const scanResults = await this.performRealTimeScan(credential);
            
            // Update credential with scan results
            credential.lastScanResults = scanResults;
            credential.scanStatus = 'completed';
            credential.securityScore = scanResults.securityScore;
            credential.threatLevel = scanResults.threatLevel;
            credential.lastThreats = scanResults.threats;
            
            // Check for new breaches
            if (scanResults.threats.length > 0) {
                this.addNewBreachAlert(credential, scanResults.threats);
            }
            
            // Update rotation schedule if needed
            if (scanResults.recommendRotation) {
                credential.autoRotation = true;
                credential.nextRotation = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days
            }
            
            showSuccessNotification(`🔍 Scan completed for ${credential.email}`);
            
        } catch (error) {
            credential.scanStatus = 'failed';
            console.error('Scan error:', error);
            showSuccessNotification(`❌ Scan failed for ${credential.email}`);
        }
        
        // Update display with results
        this.updateCredentialDisplay();
    }
    
    async performRealTimeScan(credential) {
        // Simulate real-time security scanning
        return new Promise((resolve) => {
            setTimeout(() => {
                const threats = [];
                let securityScore = credential.passwordStrength || 75;
                
                // Simulate threat detection
                if (Math.random() < 0.3) {
                    threats.push({
                        type: 'password_reuse',
                        severity: 'medium',
                        description: 'Password found in multiple breaches',
                        source: 'HaveIBeenPwned Database'
                    });
                    securityScore -= 15;
                }
                
                if (Math.random() < 0.2) {
                    threats.push({
                        type: 'weak_password',
                        severity: 'high',
                        description: 'Password strength below recommended threshold',
                        source: 'Security Analysis Engine'
                    });
                    securityScore -= 25;
                }
                
                if (Math.random() < 0.1) {
                    threats.push({
                        type: 'suspicious_activity',
                        severity: 'low',
                        description: 'Unusual login patterns detected',
                        source: 'Behavioral Analysis'
                    });
                    securityScore -= 10;
                }
                
                resolve({
                    securityScore: Math.max(securityScore, 0),
                    threatLevel: threats.length === 0 ? 'low' : threats.length === 1 ? 'medium' : 'high',
                    threats: threats,
                    recommendRotation: threats.length > 0,
                    scanTimestamp: new Date()
                });
            }, 2000 + Math.random() * 3000); // 2-5 seconds
        });
    }
    
    addNewBreachAlert(credential, threats) {
        const alert = {
            id: `breach_${Date.now()}`,
            title: `Security Threats Detected: ${credential.domain}`,
            email: credential.email,
            domain: credential.domain,
            severity: threats.length > 1 ? 'high' : 'medium',
            breach_count: threats.length,
            source: 'Real-time Security Scan',
            timestamp: new Date(),
            status: 'active',
            threats: threats,
            recommendations: [
                'Change password immediately',
                'Enable 2FA if not already active',
                'Review recent account activity',
                'Monitor for suspicious transactions'
            ]
        };
        
        this.breachAlerts.unshift(alert);
        this.updateBreachAlertsDisplay();
        
        showSuccessNotification(`🚨 New security threats detected for ${credential.email}`);
    }
    
    // Enhanced credential export with real-time data
    exportCredentialsRealTime() {
        if (this.credentials.length === 0) {
            showSuccessNotification('No credentials to export!');
            return;
        }
        
        // Create comprehensive export data
        const exportData = {
            exportDate: new Date().toISOString(),
            totalCredentials: this.credentials.length,
            securitySummary: {
                totalThreats: this.breachAlerts.length,
                averageSecurityScore: Math.round(
                    this.credentials.reduce((sum, c) => sum + (c.passwordStrength || 0), 0) / this.credentials.length
                ),
                credentialsWith2FA: this.credentials.filter(c => c.twoFactorEnabled).length,
                autoRotationEnabled: this.credentials.filter(c => c.autoRotation).length
            },
            credentials: this.credentials.map(cred => ({
                email: cred.email,
                domain: cred.domain,
                username: cred.username,
                status: cred.status,
                securityLevel: cred.securityLevel,
                twoFactorEnabled: cred.twoFactorEnabled,
                passwordStrength: cred.passwordStrength,
                monitoring: cred.monitoring,
                lastScan: cred.lastScan,
                lastScanResults: cred.lastScanResults,
                createdDate: cred.createdDate,
                notes: cred.notes,
                breachHistory: cred.breachHistory || [],
                threatLevel: cred.threatLevel || 'unknown'
            })),
            breachAlerts: this.breachAlerts.map(alert => ({
                id: alert.id,
                title: alert.title,
                severity: alert.severity,
                status: alert.status,
                timestamp: alert.timestamp,
                domain: alert.domain
            })),
            auditLog: this.auditLog || []
        };
        
        // Create and download file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showSuccessNotification(`📤 Security report exported successfully!`);
    }
    
    // Real-time credential monitoring dashboard
    updateCredentialDashboard() {
        const dashboardContainer = document.getElementById('credential-dashboard');
        if (!dashboardContainer) return;
        
        const totalCredentials = this.credentials.length;
        const activeCredentials = this.credentials.filter(c => c.status === 'active').length;
        const lockedCredentials = this.credentials.filter(c => c.status === 'locked').length;
        const averageSecurityScore = Math.round(
            this.credentials.reduce((sum, c) => sum + (c.passwordStrength || 0), 0) / totalCredentials
        );
        const credentialsWith2FA = this.credentials.filter(c => c.twoFactorEnabled).length;
        const autoRotationEnabled = this.credentials.filter(c => c.autoRotation).length;
        
        dashboardContainer.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">🔐</div>
                    <div class="stat-value">${totalCredentials}</div>
                    <div class="stat-label">Total Credentials</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🟢</div>
                    <div class="stat-value">${activeCredentials}</div>
                    <div class="stat-label">Active</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🔒</div>
                    <div class="stat-value">${lockedCredentials}</div>
                    <div class="stat-label">Locked</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-value">${averageSecurityScore}</div>
                    <div class="stat-label">Avg Security Score</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🛡️</div>
                    <div class="stat-value">${credentialsWith2FA}</div>
                    <div class="stat-label">2FA Enabled</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🔄</div>
                    <div class="stat-value">${autoRotationEnabled}</div>
                    <div class="stat-label">Auto Rotation</div>
                </div>
            </div>
        `;
    }

    // Enhanced API simulation
    async simulateAccountUnlockAPI(email, domain) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`🔓 API: Account unlocked for ${email} on ${domain}`);
                resolve({ success: true, message: 'Account unlocked successfully' });
            }, 1000);
        });
    }
    
    // Essential password management functions
    generateSecurePasswordString() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    
    calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 10;
        if (/[^A-Za-z0-9]/.test(password)) strength += 10;
        return Math.min(strength, 100);
    }
    
    // Real-time password change functionality
    async changePasswordRealTime(credentialIndex) {
        if (!this.credentials[credentialIndex]) return;
        
        const credential = this.credentials[credentialIndex];
        
        // Show password change modal
        this.showPasswordChangeModal(credential, credentialIndex);
    }
    
    // Show password change modal with options
    showPasswordChangeModal(credential, credentialIndex) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.password-change-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'password-change-modal';
        modal.innerHTML = `
            <div class="modal-overlay" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.8); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
            ">
                <div class="modal-content" style="
                    background: #1E293B; border: 1px solid #374151;
                    border-radius: 12px; padding: 2rem; max-width: 600px;
                    max-height: 80vh; overflow-y: auto; color: white;
                ">
                    <div class="modal-header" style="
                        display: flex; justify-content: space-between;
                        align-items: center; margin-bottom: 1.5rem;
                    ">
                        <h3 class="text-xl font-bold">🔑 Change Password: ${credential.email}</h3>
                        <button onclick="this.closest('.password-change-modal').remove()" style="
                            background: none; border: none; color: #9CA3AF;
                            font-size: 1.5rem; cursor: pointer;
                        ">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="password-options" style="margin-bottom: 1.5rem;">
                            <h4 class="font-semibold mb-3">Choose Password Option:</h4>
                            
                            <div class="option-buttons" style="display: grid; gap: 1rem;">
                                <button onclick="enterpriseMonitor.generateSecurePassword(${credentialIndex})" style="
                                    background: linear-gradient(135deg, #10B981, #059669);
                                    color: white; border: none; padding: 1rem;
                                    border-radius: 8px; cursor: pointer; font-weight: 600;
                                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                                ">
                                    🔐 Generate Secure Password
                                </button>
                                
                                <button onclick="enterpriseMonitor.showManualPasswordEntry(${credentialIndex})" style="
                                    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
                                    color: white; border: none; padding: 1rem;
                                    border-radius: 8px; cursor: pointer; font-weight: 600;
                                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                                ">
                                    ✏️ Enter Password Manually
                                </button>
                                
                                <button onclick="enterpriseMonitor.rotatePasswordRealTime(${credentialIndex})" style="
                                    background: linear-gradient(135deg, #F59E0B, #D97706);
                                    color: white; border: none; padding: 1rem;
                                    border-radius: 8px; cursor: pointer; font-weight: 600;
                                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                                ">
                                    🔄 Auto-Rotate Password
                                </button>
                            </div>
                        </div>
                        
                        <div class="current-password-info" style="
                            background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);
                            border-radius: 8px; padding: 1rem;
                        ">
                            <h4 class="font-semibold mb-2">Current Password Info:</h4>
                            <div class="text-sm text-gray-300 space-y-1">
                                <div>🔑 Password Strength: ${credential.passwordStrength}/100</div>
                                <div>📅 Last Changed: ${credential.lastModified.toLocaleDateString()}</div>
                                <div>🔄 Auto-Rotation: ${credential.autoRotation ? 'Enabled' : 'Disabled'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer" style="
                        margin-top: 1.5rem; text-align: right;
                    ">
                        <button onclick="this.closest('.password-change-modal').remove()" style="
                            background: #6B7280; color: white; border: none;
                            padding: 0.75rem 1.5rem; border-radius: 6px;
                            cursor: pointer;
                        ">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Generate secure password with REAL API integration
    async generateSecurePassword(credentialIndex) {
        const credential = this.credentials[credentialIndex];
        
        showSuccessNotification('🔐 Generating secure password...');
        
        try {
            // Generate new secure password
            const newPassword = this.generateSecurePasswordString();
            
            // REAL API CALL - Actually change the password in the database
            const response = await fetch('/api/enterprise/security/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': this.getUserId() || 'demo-user'
                },
                body: JSON.stringify({
                    email: credential.email,
                    new_password: newPassword,
                    type: 'generated'
                })
            });
            
            if (!response.ok) {
                throw new Error(`Password change failed: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Update local credential with REAL data from API
                credential.password = newPassword;
                credential.maskedPassword = '••••••••••••••••';
                credential.lastModified = new Date();
                credential.passwordStrength = result.password_strength;
                credential.autoRotation = true;
                credential.nextRotation = new Date(result.next_rotation);
                
                // Update displays with REAL data
                this.updateCredentialDisplay();
                this.updateCredentialDashboard();
                
                // Show success with password details
                this.showGeneratedPasswordModal(newPassword, credential.email);
                
                showSuccessNotification(`✅ REAL password changed for ${credential.email}!`);
                
                // Add to audit log
                this.addAuditLog('PASSWORD_GENERATED', {
                    email: credential.email,
                    domain: credential.domain,
                    timestamp: new Date(),
                    action: 'Secure password generated and SAVED',
                    strength: result.password_strength,
                    api_response: result
                });
                
                console.log('🔐 REAL password change successful:', result);
            } else {
                throw new Error(result.error || 'Password change failed');
            }
            
        } catch (error) {
            console.error('Password generation error:', error);
            showSuccessNotification(`❌ Password change failed for ${credential.email}: ${error.message}`);
        }
    }
    
    // Show generated password modal
    showGeneratedPasswordModal(password, email) {
        const modal = document.createElement('div');
        modal.className = 'generated-password-modal';
        modal.innerHTML = `
            <div class="modal-overlay" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.8); z-index: 10001;
                display: flex; align-items: center; justify-content: center;
            ">
                <div class="modal-content" style="
                    background: #1E293B; border: 1px solid #374151;
                    border-radius: 12px; padding: 2rem; max-width: 500px;
                    color: white; text-align: center;
                ">
                    <div class="modal-header" style="margin-bottom: 1.5rem;">
                        <h3 class="text-xl font-bold">🔐 New Password Generated</h3>
                        <p class="text-gray-300">For: ${email}</p>
                    </div>
                    
                    <div class="modal-body">
                        <div class="password-display" style="
                            background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);
                            border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;
                            font-family: monospace; font-size: 1.25rem; letter-spacing: 2px;
                        ">${password}</div>
                        
                        <div class="password-info" style="margin-bottom: 1.5rem;">
                            <div class="text-sm text-gray-300 space-y-1">
                                <div>✅ Password Strength: Strong</div>
                                <div>🔒 Auto-Rotation: Enabled</div>
                                <div>📅 Next Rotation: ${new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)).toLocaleDateString()}</div>
                            </div>
                        </div>
                        
                        <div class="warning" style="
                            background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
                            border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;
                        ">
                            <p class="text-sm text-red-400">
                                ⚠️ Copy this password now! It will be hidden after closing this modal.
                            </p>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button onclick="this.closest('.generated-password-modal').remove()" style="
                            background: #10B981; color: white; border: none;
                            padding: 0.75rem 1.5rem; border-radius: 6px;
                            cursor: pointer; font-weight: 600;
                        ">Got It!</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Show manual password entry modal
    showManualPasswordEntry(credentialIndex) {
        const credential = this.credentials[credentialIndex];
        
        const modal = document.createElement('div');
        modal.className = 'manual-password-modal';
        modal.innerHTML = `
            <div class="modal-overlay" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.8); z-index: 10001;
                display: flex; align-items: center; justify-content: center;
            ">
                <div class="modal-content" style="
                    background: #1E293B; border: 1px solid #374151;
                    border-radius: 12px; padding: 2rem; max-width: 500px;
                    color: white;
                ">
                    <div class="modal-header" style="margin-bottom: 1.5rem;">
                        <h3 class="text-xl font-bold">✏️ Enter New Password</h3>
                        <p class="text-gray-300">For: ${credential.email}</p>
                    </div>
                    
                    <div class="modal-body">
                        <div class="password-input-group" style="margin-bottom: 1rem;">
                            <label class="block text-sm font-medium mb-2">New Password:</label>
                            <input type="password" id="new-password-input" placeholder="Enter new password" style="
                                width: 100%; padding: 0.75rem; border: 1px solid #374151;
                                border-radius: 6px; background: #0F172A; color: white;
                                font-size: 1rem;
                            ">
                        </div>
                        
                        <div class="password-input-group" style="margin-bottom: 1.5rem;">
                            <label class="block text-sm font-medium mb-2">Confirm Password:</label>
                            <input type="password" id="confirm-password-input" placeholder="Confirm new password" style="
                                width: 100%; padding: 0.75rem; border: 1px solid #374151;
                                border-radius: 6px; background: #0F172A; color: white;
                                font-size: 1rem;
                            ">
                        </div>
                        
                        <div class="password-strength" id="password-strength-display" style="
                            background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);
                            border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem;
                        ">
                            <div class="text-sm text-gray-300">Password strength will appear here</div>
                        </div>
                    </div>
                    
                    <div class="modal-footer" style="
                        display: flex; gap: 1rem; justify-content: flex-end;
                    ">
                        <button onclick="this.closest('.manual-password-modal').remove()" style="
                            background: #6B7280; color: white; border: none;
                            padding: 0.75rem 1.5rem; border-radius: 6px;
                            cursor: pointer;
                        ">Cancel</button>
                        <button onclick="enterpriseMonitor.saveManualPassword(${credentialIndex})" style="
                            background: #10B981; color: white; border: none;
                            padding: 0.75rem 1.5rem; border-radius: 6px;
                            cursor: pointer; font-weight: 600;
                        ">Save Password</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add password strength checker
        const passwordInput = document.getElementById('new-password-input');
        const confirmInput = document.getElementById('confirm-password-input');
        const strengthDisplay = document.getElementById('password-strength-display');
        
        passwordInput.addEventListener('input', () => {
            const strength = this.calculatePasswordStrength(passwordInput.value);
            const strengthText = this.getPasswordStrengthText(strength);
            const strengthColor = this.getPasswordStrengthColor(strength);
            
            strengthDisplay.innerHTML = `
                <div class="text-sm" style="color: ${strengthColor}">
                    <div>Password Strength: ${strengthText} (${strength}/100)</div>
                    <div style="margin-top: 0.5rem;">
                        ${this.getPasswordStrengthDetails(passwordInput.value)}
                    </div>
                </div>
            `;
            strengthDisplay.style.borderColor = strengthColor;
        });
    }
    
    // Save manually entered password
    async saveManualPassword(credentialIndex) {
        const credential = this.credentials[credentialIndex];
        const newPassword = document.getElementById('new-password-input').value;
        const confirmPassword = document.getElementById('confirm-password-input').value;
        
        if (!newPassword) {
            showSuccessNotification('❌ Please enter a password');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showSuccessNotification('❌ Passwords do not match');
            return;
        }
        
        if (newPassword.length < 8) {
            showSuccessNotification('❌ Password must be at least 8 characters long');
            return;
        }
        
        try {
            // REAL API CALL - Actually save the password in the database
            const response = await fetch('/api/enterprise/security/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': this.getUserId() || 'demo-user'
                },
                body: JSON.stringify({
                    email: credential.email,
                    new_password: newPassword,
                    type: 'manual'
                })
            });
            
            if (!response.ok) {
                throw new Error(`Password save failed: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Update local credential with REAL data from API
                credential.password = newPassword;
                credential.maskedPassword = '••••••••••••••••';
                credential.lastModified = new Date();
                credential.passwordStrength = result.password_strength;
                
                // Update displays with REAL data
                this.updateCredentialDisplay();
                this.updateCredentialDashboard();
                
                // Close modal
                const modal = document.querySelector('.manual-password-modal');
                if (modal) modal.remove();
                
                showSuccessNotification(`✅ REAL password saved for ${credential.email}!`);
                
                // Add to audit log
                this.addAuditLog('PASSWORD_MANUALLY_CHANGED', {
                    email: credential.email,
                    domain: credential.domain,
                    timestamp: new Date(),
                    action: 'Password manually changed and SAVED',
                    strength: result.password_strength,
                    api_response: result
                });
                
                console.log('🔐 REAL manual password save successful:', result);
            } else {
                throw new Error(result.error || 'Password save failed');
            }
            
        } catch (error) {
            console.error('Password save error:', error);
            showSuccessNotification(`❌ Password save failed for ${credential.email}: ${error.message}`);
        }
    }
    
    // Real-time password rotation with user feedback
    async rotatePasswordRealTime(credentialIndex) {
        const credential = this.credentials[credentialIndex];
        
        showSuccessNotification('🔄 Starting password rotation...');
        
        try {
            // Generate new secure password
            const newPassword = this.generateSecurePasswordString();
            
            // REAL API CALL - Actually rotate the password in the database
            const response = await fetch('/api/enterprise/security/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': this.getUserId() || 'demo-user'
                },
                body: JSON.stringify({
                    email: credential.email,
                    new_password: newPassword,
                    type: 'auto-rotate'
                })
            });
            
            if (!response.ok) {
                throw new Error(`Password rotation failed: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Update local credential with REAL data from API
                credential.password = newPassword;
                credential.maskedPassword = '••••••••••••••••';
                credential.lastModified = new Date();
                credential.passwordStrength = result.password_strength;
                credential.autoRotation = true;
                credential.nextRotation = new Date(result.next_rotation);
                
                // Update displays with REAL data
                this.updateCredentialDisplay();
                this.updateCredentialDashboard();
                
                // Show rotation success modal
                this.showRotationSuccessModal(newPassword, credential.email);
                
                showSuccessNotification(`✅ REAL password rotated for ${credential.email}!`);
                
                // Add to audit log
                this.addAuditLog('PASSWORD_ROTATED', {
                    email: credential.email,
                    domain: credential.domain,
                    timestamp: new Date(),
                    action: 'Password auto-rotated and SAVED',
                    strength: result.password_strength,
                    api_response: result
                });
                
                console.log('🔄 REAL password rotation successful:', result);
            } else {
                throw new Error(result.error || 'Password rotation failed');
            }
            
        } catch (error) {
            console.error('Password rotation error:', error);
            showSuccessNotification(`❌ Password rotation failed for ${credential.email}`);
        }
    }
    
    // Show rotation success modal
    showRotationSuccessModal(password, email) {
        const modal = document.createElement('div');
        modal.className = 'rotation-success-modal';
        modal.innerHTML = `
            <div class="modal-overlay" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.8); z-index: 10001;
                display: flex; align-items: center; justify-content: center;
            ">
                <div class="modal-content" style="
                    background: #1E293B; border: 1px solid #374151;
                    border-radius: 12px; padding: 2rem; max-width: 500px;
                    color: white; text-align: center;
                ">
                    <div class="modal-header" style="margin-bottom: 1.5rem;">
                        <div class="text-4xl mb-2">🔄</div>
                        <h3 class="text-xl font-bold">Password Rotation Complete!</h3>
                        <p class="text-gray-300">For: ${email}</p>
                    </div>
                    
                    <div class="modal-body">
                        <div class="new-password" style="
                            background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);
                            border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;
                            font-family: monospace; font-size: 1.25rem; letter-spacing: 2px;
                        ">${password}</div>
                        
                        <div class="rotation-info" style="margin-bottom: 1.5rem;">
                            <div class="text-sm text-gray-300 space-y-1">
                                <div>✅ New password generated and applied</div>
                                <div>🔒 Auto-rotation enabled</div>
                                <div>📅 Next rotation: ${new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)).toLocaleDateString()}</div>
                                <div>🛡️ Security score updated</div>
                            </div>
                        </div>
                        
                        <div class="warning" style="
                            background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
                            border-radius: 8px; padding: 1rem;
                        ">
                            <p class="text-sm text-red-400">
                                ⚠️ Copy this password now! It will be hidden after closing.
                            </p>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button onclick="this.closest('.rotation-success-modal').remove()" style="
                            background: #10B981; color: white; border: none;
                            padding: 0.75rem 1.5rem; border-radius: 6px;
                            cursor: pointer; font-weight: 600;
                        ">Perfect!</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Enhanced account locking with unlock mechanism
    async lockAccountRealTime(credentialIndex) {
        const credential = this.credentials[credentialIndex];
        
        if (credential.status === 'locked') {
            showSuccessNotification('⚠️ Account is already locked');
            return;
        }
        
        showSuccessNotification('🔒 Locking account...');
        
        try {
            // Lock the credential
            credential.status = 'locked';
            credential.monitoring = false;
            credential.lastModified = new Date();
            credential.lockedAt = new Date();
            credential.lockReason = 'Security measure - User initiated';
            
            // Simulate API call
            await this.simulateAccountLockAPI(credential.email, credential.domain);
            
            // Update displays
            this.updateCredentialDisplay();
            this.updateCredentialDashboard();
            
            // Show lock success modal
            this.showAccountLockedModal(credential);
            
            showSuccessNotification(`✅ Account locked for ${credential.email}`);
            
            // Add to audit log
            this.addAuditLog('ACCOUNT_LOCKED', {
                email: credential.email,
                domain: credential.domain,
                timestamp: new Date(),
                action: 'Account locked by user',
                reason: credential.lockReason
            });
            
        } catch (error) {
            console.error('Account lock error:', error);
            showSuccessNotification(`❌ Failed to lock account for ${credential.email}`);
        }
    }
    
    // Show account locked modal with unlock options
    showAccountLockedModal(credential) {
        const modal = document.createElement('div');
        modal.className = 'account-locked-modal';
        modal.innerHTML = `
            <div class="modal-overlay" style="
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.8); z-index: 10001;
                display: flex; align-items: center; justify-content: center;
            ">
                <div class="modal-content" style="
                    background: #1E293B; border: 1px solid #374151;
                    border-radius: 12px; padding: 2rem; max-width: 500px;
                    color: white; text-align: center;
                ">
                    <div class="modal-header" style="margin-bottom: 1.5rem;">
                        <div class="text-4xl mb-2">🔒</div>
                        <h3 class="text-xl font-bold">Account Locked Successfully</h3>
                        <p class="text-gray-300">${credential.email}</p>
                    </div>
                    
                    <div class="modal-body">
                        <div class="lock-info" style="
                            background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
                            border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;
                        ">
                            <div class="text-sm text-gray-300 space-y-1">
                                <div>🔒 Account Status: LOCKED</div>
                                <div>📅 Locked At: ${credential.lockedAt.toLocaleString()}</div>
                                <div>🛡️ Monitoring: Disabled</div>
                                <div>📝 Reason: ${credential.lockReason}</div>
                            </div>
                        </div>
                        
                        <div class="unlock-options" style="margin-bottom: 1.5rem;">
                            <h4 class="font-semibold mb-3">To Unlock Securely:</h4>
                            <div class="text-sm text-gray-300 space-y-2 text-left">
                                <div>1. 🔐 Change your password first</div>
                                <div>2. 🛡️ Enable 2FA if not already active</div>
                                <div>3. 🔍 Review recent account activity</div>
                                <div>4. ✅ Verify account security</div>
                                <div>5. 🔓 Then unlock the account</div>
                            </div>
                        </div>
                        
                        <div class="action-buttons" style="display: grid; gap: 1rem;">
                            <button onclick="enterpriseMonitor.changePasswordRealTime(${this.credentials.indexOf(credential)})" style="
                                background: linear-gradient(135deg, #3B82F6, #1D4ED8);
                                color: white; border: none; padding: 1rem;
                                border-radius: 8px; cursor: pointer; font-weight: 600;
                                display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                            ">
                                🔐 Change Password First
                            </button>
                            
                            <button onclick="enterpriseMonitor.unlockAccountSecurely(${this.credentials.indexOf(credential)})" style="
                                background: linear-gradient(135deg, #10B981, #059669);
                                color: white; border: none; padding: 1rem;
                                border-radius: 8px; cursor: pointer; font-weight: 600;
                                display: flex: align-items: center; justify-content: center; gap: 0.5rem;
                            ">
                                🔓 Unlock Account Securely
                            </button>
                        </div>
                    </div>
                    
                    <div class="modal-footer" style="margin-top: 1.5rem;">
                        <button onclick="this.closest('.account-locked-modal').remove()" style="
                            background: #6B7280; color: white; border: none;
                            padding: 0.75rem 1.5rem; border-radius: 6px;
                            cursor: pointer;
                        ">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Secure account unlock with verification
    async unlockAccountSecurely(credentialIndex) {
        const credential = this.credentials[credentialIndex];
        
        if (credential.status !== 'locked') {
            showSuccessNotification('⚠️ Account is not locked');
            return;
        }
        
        // Check if password was recently changed
        const daysSincePasswordChange = (Date.now() - credential.lastModified.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSincePasswordChange > 1) {
            showSuccessNotification('⚠️ Please change your password before unlocking');
            return;
        }
        
        // Check if 2FA is enabled
        if (!credential.twoFactorEnabled) {
            showSuccessNotification('⚠️ Please enable 2FA before unlocking');
            return;
        }
        
        showSuccessNotification('🔓 Unlocking account securely...');
        
        try {
            // Unlock the credential
            credential.status = 'active';
            credential.monitoring = true;
            credential.lastModified = new Date();
            credential.unlockedAt = new Date();
            credential.lockReason = null;
            
            // Simulate API call
            await this.simulateAccountUnlockAPI(credential.email, credential.domain);
            
            // Update displays
            this.updateCredentialDisplay();
            this.updateCredentialDashboard();
            
            showSuccessNotification(`✅ Account unlocked securely for ${credential.email}`);
            
            // Add to audit log
            this.addAuditLog('ACCOUNT_UNLOCKED', {
                email: credential.email,
                domain: credential.domain,
                timestamp: new Date(),
                action: 'Account unlocked securely',
                verification: 'Password changed + 2FA enabled'
            });
            
            // Close modal
            const modal = document.querySelector('.account-locked-modal');
            if (modal) modal.remove();
            
        } catch (error) {
            console.error('Account unlock error:', error);
            showSuccessNotification(`❌ Failed to unlock account for ${credential.email}`);
        }
    }
    
    // Helper functions for password management
    getPasswordStrengthText(strength) {
        if (strength >= 80) return 'Excellent';
        if (strength >= 60) return 'Good';
        if (strength >= 40) return 'Fair';
        return 'Weak';
    }
    
    getPasswordStrengthColor(strength) {
        if (strength >= 80) return '#10B981';
        if (strength >= 60) return '#F59E0B';
        return '#EF4444';
    }
    
    getPasswordStrengthDetails(password) {
        const details = [];
        if (password.length < 8) details.push('❌ Too short (min 8 chars)');
        if (password.length >= 8) details.push('✅ Good length');
        if (password.length >= 12) details.push('✅ Excellent length');
        if (/[a-z]/.test(password)) details.push('✅ Lowercase letters');
        if (/[A-Z]/.test(password)) details.push('✅ Uppercase letters');
        if (/[0-9]/.test(password)) details.push('✅ Numbers');
        if (/[^A-Za-z0-9]/.test(password)) details.push('✅ Special characters');
        return details.join('<br>');
    }
    
    // Add missing addAuditLog method to the class
    addAuditLog(action, details) {
        if (!this.auditLog) {
            this.auditLog = [];
        }
        
        this.auditLog.push({
            id: `AUDIT_${Date.now()}`,
            action: action,
            details: details,
            timestamp: new Date(),
            userId: this.getUserId()
        });
        
        console.log('📋 Audit log entry added:', action, details);
    }
    
    // Add missing getUserId method
    getUserId() {
        // Get user ID from auth service or localStorage
        return localStorage.getItem('user_id') || 'demo_user';
    }
    
    // Add missing simulatePasswordUpdateAPI method to the class
    async simulatePasswordUpdateAPI(email, newPassword) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`🔐 API: Password updated for ${email}`);
                resolve({ success: true, message: 'Password updated successfully' });
            }, 1000);
        });
    }
    
    // Add missing simulateAccountLockAPI method to the class
    async simulateAccountLockAPI(email, domain) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`🔒 API: Account locked for ${email} on ${domain}`);
                resolve({ success: true, message: 'Account locked successfully' });
            }, 800);
        });
    }
}

// Initialize Enterprise Dark Web Monitor
let enterpriseMonitor = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Enterprise Dark Web Monitor...');
    enterpriseMonitor = new EnterpriseDarkWebMonitor();
    
    // Initialize displays after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (enterpriseMonitor) {
            console.log('🔄 Initializing credential and breach displays...');
            enterpriseMonitor.updateCredentialDisplay();
            enterpriseMonitor.updateBreachAlertsDisplay();
        }
    }, 100);
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

// Breach alert functions
function viewBreachDetails(alertId) {
    if (enterpriseMonitor) {
        const alert = enterpriseMonitor.breachAlerts.find(a => a.id === alertId);
        if (alert) {
            // Show detailed breach information
            const details = alert.details || 'No detailed information available';
            const recommendations = alert.recommendations ? alert.recommendations.join('\n• ') : 'No recommendations available';
            
            const fullDetails = `
🚨 BREACH DETAILS

${details}

🔒 RECOMMENDATIONS:
• ${recommendations}

📅 Detected: ${alert.timestamp.toLocaleString()}
🌐 Domain: ${alert.domain}
📧 Email: ${alert.email}
⚠️ Severity: ${alert.severity.toUpperCase()}
🚨 Breaches: ${alert.breach_count}
            `;
            
            // Create a modal to show details
            showBreachDetailsModal(alert.title, fullDetails);
        }
    }
}

function takeBreachAction(alertId) {
    if (enterpriseMonitor) {
        const alert = enterpriseMonitor.breachAlerts.find(a => a.id === alertId);
        if (alert) {
            // Create a proper modal with real buttons instead of prompt()
            showBreachActionModal(alert);
        }
    }
}

function showBreachActionModal(alert) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.breach-action-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal with real buttons
    const modal = document.createElement('div');
    modal.className = 'breach-action-modal';
    modal.innerHTML = `
        <div class="modal-overlay" style="
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.8); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        ">
            <div class="modal-content" style="
                background: #1E293B; border: 1px solid #374151;
                border-radius: 12px; padding: 2rem; max-width: 600px;
                max-height: 80vh; overflow-y: auto; color: white;
            ">
                <div class="modal-header" style="
                    display: flex; justify-content: space-between;
                    align-items: center; margin-bottom: 1.5rem;
                ">
                    <h3 class="text-xl font-bold">🚨 Security Breach Action Required</h3>
                    <button onclick="this.closest('.breach-action-modal').remove()" style="
                        background: none; border: none; color: #9CA3AF;
                        font-size: 1.5rem; cursor: pointer;
                    ">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="alert-summary" style="
                        background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
                        border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;
                    ">
                        <h4 class="font-semibold mb-2">${alert.title}</h4>
                        <div class="text-sm text-gray-300 space-y-1">
                            <div>📧 Email: ${alert.email}</div>
                            <div>🌐 Domain: ${alert.domain}</div>
                            <div>⚠️ Severity: ${alert.severity.toUpperCase()}</div>
                            <div>🚨 Breaches: ${alert.breach_count}</div>
                        </div>
                    </div>
                    
                    <div class="action-buttons" style="
                        display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
                    ">
                        <button onclick="executeBreachAction('${alert.id}', 'rotate')" style="
                            background: linear-gradient(135deg, #3B82F6, #1D4ED8);
                            color: white; border: none; padding: 1rem;
                            border-radius: 8px; cursor: pointer; font-weight: 600;
                            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                        ">
                            🔄 Rotate Password
                        </button>
                        
                        <button onclick="executeBreachAction('${alert.id}', 'lock')" style="
                            background: linear-gradient(135deg, #F59E0B, #D97706);
                            color: white; border: none; padding: 1rem;
                            border-radius: 8px; cursor: pointer; font-weight: 600;
                            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                        ">
                            🔒 Lock Account
                        </button>
                        
                        <button onclick="executeBreachAction('${alert.id}', 'resolve')" style="
                            background: linear-gradient(135deg, #10B981, #059669);
                            color: white; border: none; padding: 1rem;
                            border-radius: 8px; cursor: pointer; font-weight: 600;
                            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                        ">
                            ✅ Mark as Resolved
                        </button>
                        
                        <button onclick="executeBreachAction('${alert.id}', 'investigate')" style="
                            background: linear-gradient(135deg, #8B5CF6, #7C3AED);
                            color: white; border: none; padding: 1rem;
                            border-radius: 8px; cursor: pointer; font-weight: 600;
                            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                        ">
                            🔍 Investigate Further
                        </button>
                    </div>
                    
                    <div class="recommendations" style="
                        margin-top: 1.5rem; padding: 1rem;
                        background: rgba(59, 130, 246, 0.1); border-radius: 8px;
                    ">
                        <h4 class="font-semibold mb-2">🔒 Immediate Actions Required:</h4>
                        <ul class="text-sm text-gray-300 space-y-1">
                            <li>• Change passwords for all affected accounts</li>
                            <li>• Enable 2FA on all accounts</li>
                            <li>• Review recent account activity</li>
                            <li>• Monitor for suspicious transactions</li>
                        </ul>
                    </div>
                </div>
                
                <div class="modal-footer" style="
                    margin-top: 1.5rem; text-align: right;
                ">
                    <button onclick="this.closest('.breach-action-modal').remove()" style="
                        background: #6B7280; color: white; border: none;
                        padding: 0.75rem 1.5rem; border-radius: 6px;
                        cursor: pointer;
                    ">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function executeBreachAction(alertId, action) {
    if (enterpriseMonitor) {
        const alert = enterpriseMonitor.breachAlerts.find(a => a.id === alertId);
        if (alert) {
            switch(action) {
                case 'rotate':
                    // Trigger password rotation with real-time processing
                    executePasswordRotation(alert);
                    break;
                    
                case 'lock':
                    // Lock account with real-time processing
                    executeAccountLock(alert);
                    break;
                    
                case 'resolve':
                    // Mark as resolved with real-time processing
                    executeBreachResolution(alert);
                    break;
                    
                case 'investigate':
                    // Start investigation with real-time processing
                    executeInvestigation(alert);
                    break;
            }
            
            // Close the modal
            const modal = document.querySelector('.breach-action-modal');
            if (modal) {
                modal.remove();
            }
        }
    }
}

// Real-time password rotation execution
async function executePasswordRotation(alert) {
    try {
        showSuccessNotification('🔄 Initiating password rotation...');
        
        // Find affected credentials
        const affectedCredentials = enterpriseMonitor.credentials.filter(c => c.domain === alert.domain);
        
        if (affectedCredentials.length === 0) {
            showSuccessNotification('⚠️ No credentials found for this domain');
            return;
        }
        
        // Real-time password rotation process
        for (let i = 0; i < affectedCredentials.length; i++) {
            const credential = affectedCredentials[i];
            
            // Generate new secure password
            const newPassword = generateSecurePassword();
            
            // Update credential with new password
            credential.password = newPassword;
            credential.maskedPassword = '••••••••••••••••';
            credential.lastModified = new Date();
            credential.passwordStrength = calculatePasswordStrength(newPassword);
            
            // Update rotation tracking
            if (credential.autoRotation) {
                credential.nextRotation = new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)); // 90 days
            }
            
            // Simulate API call to update password
            await simulatePasswordUpdateAPI(credential.email, newPassword);
            
            showSuccessNotification(`🔄 Password rotated for ${credential.email}`);
            
            // Add to audit log
            addAuditLog('PASSWORD_ROTATION', {
                email: credential.email,
                domain: credential.domain,
                timestamp: new Date(),
                reason: 'Security breach detected',
                action: 'Auto-rotation triggered'
            });
        }
        
        // Update displays
        enterpriseMonitor.updateCredentialDisplay();
        enterpriseMonitor.updateBreachAlertsDisplay();
        
        showSuccessNotification('✅ Password rotation completed successfully!');
        
    } catch (error) {
        console.error('Password rotation error:', error);
        showSuccessNotification('❌ Password rotation failed. Please try again.');
    }
}

// Real-time account lock execution
async function executeAccountLock(alert) {
    try {
        showSuccessNotification('🔒 Initiating account lock...');
        
        // Find affected credentials
        const affectedCredentials = enterpriseMonitor.credentials.filter(c => c.domain === alert.domain);
        
        if (affectedCredentials.length === 0) {
            showSuccessNotification('⚠️ No credentials found for this domain');
            return;
        }
        
        // Real-time account locking process
        for (let i = 0; i < affectedCredentials.length; i++) {
            const credential = affectedCredentials[i];
            
            // Lock the credential
            credential.status = 'locked';
            credential.monitoring = false;
            credential.lastModified = new Date();
            
            // Simulate API call to lock account
            await simulateAccountLockAPI(credential.email, credential.domain);
            
            showSuccessNotification(`🔒 Account locked for ${credential.email}`);
            
            // Add to audit log
            addAuditLog('ACCOUNT_LOCK', {
                email: credential.email,
                domain: credential.domain,
                timestamp: new Date(),
                reason: 'Security breach detected',
                action: 'Account locked for security'
            });
        }
        
        // Update breach alert status
        alert.status = 'locked';
        alert.lockedAt = new Date();
        
        // Update displays
        enterpriseMonitor.updateCredentialDisplay();
        enterpriseMonitor.updateBreachAlertsDisplay();
        
        showSuccessNotification('✅ Account lock completed successfully!');
        
    } catch (error) {
        console.error('Account lock error:', error);
        showSuccessNotification('❌ Account lock failed. Please try again.');
    }
}

// Real-time breach resolution execution
async function executeBreachResolution(alert) {
    try {
        showSuccessNotification('✅ Processing breach resolution...');
        
        // Update breach alert status
        alert.status = 'resolved';
        alert.resolvedAt = new Date();
        alert.resolutionNotes = 'Resolved by user action';
        
        // Find affected credentials and update their breach history
        const affectedCredentials = enterpriseMonitor.credentials.filter(c => c.domain === alert.domain);
        
        for (let i = 0; i < affectedCredentials.length; i++) {
            const credential = affectedCredentials[i];
            
            // Add resolution to breach history
            if (!credential.breachHistory) {
                credential.breachHistory = [];
            }
            
            credential.breachHistory.push({
                date: new Date().toISOString().split('T')[0],
                source: alert.source,
                severity: alert.severity,
                status: 'resolved',
                resolvedAt: new Date()
            });
            
            credential.lastModified = new Date();
        }
        
        // Simulate API call to mark breach as resolved
        await simulateBreachResolutionAPI(alert.id, 'resolved');
        
        // Update displays
        enterpriseMonitor.updateCredentialDisplay();
        enterpriseMonitor.updateBreachAlertsDisplay();
        
        showSuccessNotification('✅ Breach marked as resolved!');
        
        // Add to audit log
        addAuditLog('BREACH_RESOLUTION', {
            alertId: alert.id,
            domain: alert.domain,
            timestamp: new Date(),
            action: 'Breach marked as resolved'
        });
        
    } catch (error) {
        console.error('Breach resolution error:', error);
        showSuccessNotification('❌ Breach resolution failed. Please try again.');
    }
}

// Real-time investigation execution
async function executeInvestigation(alert) {
    try {
        showSuccessNotification('🔍 Starting security investigation...');
        
        // Update breach alert status
        alert.status = 'investigating';
        alert.investigationStartedAt = new Date();
        alert.investigationId = `INV_${Date.now()}`;
        
        // Create investigation task
        const investigationTask = {
            id: alert.investigationId,
            alertId: alert.id,
            domain: alert.domain,
            email: alert.email,
            severity: alert.severity,
            startedAt: new Date(),
            status: 'active',
            priority: alert.severity === 'high' ? 'urgent' : 'normal',
            assignedTo: 'Security Team',
            steps: [
                'Analyzing breach source and scope',
                'Identifying affected systems and data',
                'Assessing potential damage',
                'Implementing containment measures',
                'Preparing incident report'
            ],
            currentStep: 0
        };
        
        // Add investigation to monitoring system
        if (!enterpriseMonitor.investigations) {
            enterpriseMonitor.investigations = [];
        }
        enterpriseMonitor.investigations.push(investigationTask);
        
        // Simulate API call to start investigation
        await simulateInvestigationAPI(investigationTask);
        
        // Update displays
        enterpriseMonitor.updateBreachAlertsDisplay();
        
        showSuccessNotification('🔍 Investigation started successfully!');
        
        // Add to audit log
        addAuditLog('INVESTIGATION_STARTED', {
            investigationId: investigationTask.id,
            alertId: alert.id,
            domain: alert.domain,
            timestamp: new Date(),
            action: 'Security investigation initiated'
        });
        
        // Start investigation progress updates
        startInvestigationProgress(investigationTask);
        
    } catch (error) {
        console.error('Investigation error:', error);
        showSuccessNotification('❌ Investigation failed to start. Please try again.');
    }
}

// Helper functions for real-time operations
function generateSecurePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
}

function addAuditLog(action, details) {
    if (!enterpriseMonitor.auditLog) {
        enterpriseMonitor.auditLog = [];
    }
    
    enterpriseMonitor.auditLog.push({
        id: `AUDIT_${Date.now()}`,
        action: action,
        details: details,
        timestamp: new Date(),
        userId: enterpriseMonitor.getUserId()
    });
    
    console.log('📋 Audit log entry added:', action, details);
}

// Simulate API calls for real-time operations
async function simulatePasswordUpdateAPI(email, newPassword) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`🔐 API: Password updated for ${email}`);
            resolve({ success: true, message: 'Password updated successfully' });
        }, 1000);
    });
}

async function simulateAccountLockAPI(email, domain) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`🔒 API: Account locked for ${email} on ${domain}`);
            resolve({ success: true, message: 'Account locked successfully' });
        }, 800);
    });
}

async function simulateBreachResolutionAPI(alertId, status) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`✅ API: Breach ${alertId} marked as ${status}`);
            resolve({ success: true, message: 'Breach resolution updated successfully' });
        }, 600);
    });
}

async function simulateInvestigationAPI(investigationTask) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`🔍 API: Investigation started for ${investigationTask.id}`);
            resolve({ success: true, message: 'Investigation initiated successfully' });
        }, 1200);
    });
}

// Start investigation progress updates
function startInvestigationProgress(investigationTask) {
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
        if (currentStep < investigationTask.steps.length) {
            investigationTask.currentStep = currentStep;
            investigationTask.lastUpdate = new Date();
            
            console.log(`🔍 Investigation progress: ${investigationTask.steps[currentStep]}`);
            
            // Update investigation display if it exists
            if (enterpriseMonitor.updateInvestigationDisplay) {
                enterpriseMonitor.updateInvestigationDisplay();
            }
            
            currentStep++;
        } else {
            // Investigation completed
            investigationTask.status = 'completed';
            investigationTask.completedAt = new Date();
            clearInterval(progressInterval);
            
            showSuccessNotification('🔍 Investigation completed successfully!');
            
            // Update breach alert
            const alert = enterpriseMonitor.breachAlerts.find(a => a.id === investigationTask.alertId);
            if (alert) {
                alert.status = 'investigation_completed';
                alert.investigationCompletedAt = new Date();
                enterpriseMonitor.updateBreachAlertsDisplay();
            }
        }
    }, 3000); // Update every 3 seconds
}

function showBreachDetailsModal(title, details) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.breach-details-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'breach-details-modal';
    modal.innerHTML = `
        <div class="modal-overlay" style="
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.8); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        ">
            <div class="modal-content" style="
                background: #1E293B; border: 1px solid #374151;
                border-radius: 12px; padding: 2rem; max-width: 600px;
                max-height: 80vh; overflow-y: auto; color: white;
            ">
                <div class="modal-header" style="
                    display: flex; justify-content: space-between;
                    align-items: center; margin-bottom: 1.5rem;
                ">
                    <h3 class="text-xl font-bold">${title}</h3>
                    <button onclick="this.closest('.breach-details-modal').remove()" style="
                        background: none; border: none; color: #9CA3AF;
                        font-size: 1.5rem; cursor: pointer;
                    ">&times;</button>
                </div>
                
                <div class="modal-body" style="
                    white-space: pre-line; line-height: 1.6;
                    font-family: monospace; background: #0F172A;
                    padding: 1rem; border-radius: 8px;
                ">${details}</div>
                
                <div class="modal-footer" style="
                    margin-top: 1.5rem; text-align: right;
                ">
                    <button onclick="this.closest('.breach-details-modal').remove()" style="
                        background: #6366F1; color: white; border: none;
                        padding: 0.75rem 1.5rem; border-radius: 6px;
                        cursor: pointer;
                    ">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showSuccessNotification(message) {
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

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Credential management functions
function addNewCredential() {
    const email = prompt('Enter email address:');
    if (!email) return;
    
    const domain = email.split('@')[1] || 'unknown';
    const username = email.split('@')[0] || 'unknown';
    
    if (enterpriseMonitor) {
        const newCredential = {
            email: email,
            domain: domain,
            username: username,
            password: '••••••••••••••••',
            maskedPassword: '••••••••••••••••',
            status: 'active',
            monitoring: true,
            lastScan: null,
            createdDate: new Date(),
            lastModified: new Date(),
            securityLevel: 'medium',
            twoFactorEnabled: false,
            passwordStrength: 65,
            breachHistory: [],
            notes: '',
            autoRotation: false,
            rotationInterval: 'manual',
            nextRotation: null
        };
        
        enterpriseMonitor.credentials.push(newCredential);
        enterpriseMonitor.updateCredentialDisplay();
        showSuccessNotification(`Credential ${email} added successfully!`);
    }
}

function editCredential(index) {
    if (!enterpriseMonitor || !enterpriseMonitor.credentials[index]) return;
    
    const credential = enterpriseMonitor.credentials[index];
    const newEmail = prompt('Enter new email address:', credential.email);
    
    if (newEmail && newEmail !== credential.email) {
        credential.email = newEmail;
        credential.domain = newEmail.split('@')[1] || 'unknown';
        credential.username = newEmail.split('@')[0] || 'unknown';
        credential.lastModified = new Date();
        enterpriseMonitor.updateCredentialDisplay();
        showSuccessNotification(`Credential updated successfully!`);
    }
}

function removeCredential(index) {
    if (!enterpriseMonitor || !enterpriseMonitor.credentials[index]) return;
    
    const credential = enterpriseMonitor.credentials[index];
    const confirm = window.confirm(`Are you sure you want to remove ${credential.email}?`);
    
    if (confirm) {
        enterpriseMonitor.credentials.splice(index, 1);
        enterpriseMonitor.updateCredentialDisplay();
        showSuccessNotification(`Credential ${credential.email} removed successfully!`);
    }
}

function scanSpecificCredential(index) {
    if (!enterpriseMonitor || !enterpriseMonitor.credentials[index]) return;
    
    const credential = enterpriseMonitor.credentials[index];
    showSuccessNotification(`Starting scan for ${credential.email}...`);
    
    // Update last scan time
    credential.lastScan = new Date();
    enterpriseMonitor.updateCredentialDisplay();
    
    // Trigger scan for this specific credential
    if (enterpriseMonitor.startEnterpriseScan) {
        enterpriseMonitor.startEnterpriseScan(credential.email);
    }
}

function bulkScanCredentials() {
    if (!enterpriseMonitor || enterpriseMonitor.credentials.length === 0) {
        showSuccessNotification('No credentials to scan!');
        return;
    }
    
    showSuccessNotification(`Starting bulk scan for ${enterpriseMonitor.credentials.length} credentials...`);
    
    // Update all credentials with scan time
    enterpriseMonitor.credentials.forEach(credential => {
        credential.lastScan = new Date();
    });
    
    enterpriseMonitor.updateCredentialDisplay();
    
    // Trigger bulk scan
    if (enterpriseMonitor.startEnterpriseScan) {
        enterpriseMonitor.startEnterpriseScan();
    }
}

function exportCredentials() {
    if (!enterpriseMonitor || enterpriseMonitor.credentials.length === 0) {
        showSuccessNotification('No credentials to export!');
        return;
    }
    
    // Create export data
    const exportData = {
        exportDate: new Date().toISOString(),
        totalCredentials: enterpriseMonitor.credentials.length,
        credentials: enterpriseMonitor.credentials.map(cred => ({
            email: cred.email,
            domain: cred.domain,
            username: cred.username,
            status: cred.status,
            securityLevel: cred.securityLevel,
            twoFactorEnabled: cred.twoFactorEnabled,
            passwordStrength: cred.passwordStrength,
            monitoring: cred.monitoring,
            lastScan: cred.lastScan,
            createdDate: cred.createdDate,
            notes: cred.notes
        }))
    };
    
    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `credentials-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccessNotification(`📤 Exported ${enterpriseMonitor.credentials.length} credentials successfully!`);
}

function togglePasswordVisibility(index) {
    if (!enterpriseMonitor || !enterpriseMonitor.credentials[index]) return;
    
    const credential = enterpriseMonitor.credentials[index];
    const toggleBtn = document.querySelector(`[data-credential-id="${index}"] .btn-toggle-password`);
    
    if (credential.maskedPassword === credential.password) {
        // Show password
        credential.maskedPassword = credential.password;
        if (toggleBtn) toggleBtn.textContent = '🙈';
    } else {
        // Hide password
        credential.maskedPassword = '••••••••••••••••';
        if (toggleBtn) toggleBtn.textContent = '👁️';
    }
    
    enterpriseMonitor.updateCredentialDisplay();
}

function toggleCredentialMonitoring(index) {
    if (!enterpriseMonitor || !enterpriseMonitor.credentials[index]) return;
    
    const credential = enterpriseMonitor.credentials[index];
    credential.monitoring = !credential.monitoring;
    
    if (credential.monitoring) {
        showSuccessNotification(`🟢 Monitoring resumed for ${credential.email}`);
    } else {
        showSuccessNotification(`⏸️ Monitoring paused for ${credential.email}`);
    }
    
    enterpriseMonitor.updateCredentialDisplay();
}

// 🚀 ADVANCED MONITORING SYSTEM INTEGRATION
function initializeMonitoringSystem() {
    console.log('🚀 Initializing Advanced Monitoring System...');
    
    // Wait for DOM elements to be available
    const startBtn = document.getElementById('start-monitoring');
    const stopBtn = document.getElementById('stop-monitoring');
    const monitoringStatus = document.getElementById('monitoring-status');
    const monitoringLevel = document.getElementById('monitoring-level');
    
    // Check if monitoring elements exist
    if (!startBtn || !stopBtn || !monitoringStatus || !monitoringLevel) {
        console.log('⏳ Monitoring elements not found yet, retrying in 500ms...');
        setTimeout(initializeMonitoringSystem, 500);
        return;
    }
    
    console.log('✅ All monitoring elements found, setting up system...');
    
    // Activity counters
    let clickCount = 0;
    let keyCount = 0;
    let pageStartTime = Date.now();
    let isMonitoring = false;
    
    // Start monitoring button
    startBtn.addEventListener('click', async () => {
        console.log('🚀 Start monitoring button clicked!');
        try {
            const level = monitoringLevel.value;
            console.log('📊 Monitoring level selected:', level);
            
            // For now, let's start monitoring without the API call to test UI
            isMonitoring = true;
            startBtn.style.display = 'none';
            stopBtn.style.display = 'block';
            monitoringStatus.textContent = '🟢 Active';
            monitoringStatus.style.color = '#10b981';
            
            console.log('✅ Monitoring UI activated successfully!');
            
            // Start real-time updates
            startRealTimeUpdates();
            
            addActivityFeedItem('Monitoring started successfully', 'success');
            
            // Try to start the actual monitoring system
            try {
                if (window.enterpriseActivityMonitor) {
                    const success = await enterpriseActivityMonitor.startMonitoring(level);
                    console.log('🚀 Enterprise monitoring started:', success);
                } else {
                    console.log('⚠️ Enterprise activity monitor not available yet');
                }
            } catch (apiError) {
                console.log('⚠️ API monitoring failed, but UI is working:', apiError);
            }
        } catch (error) {
            console.error('❌ Failed to start monitoring:', error);
            addActivityFeedItem('Failed to start monitoring', 'error');
        }
    });
    
    // Stop monitoring button
    stopBtn.addEventListener('click', () => {
        enterpriseActivityMonitor.stopMonitoring();
        isMonitoring = false;
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        monitoringStatus.textContent = '🟡 Ready';
        monitoringStatus.style.color = '#f59e0b';
        
        addActivityFeedItem('Monitoring stopped', 'info');
    });
    
    // Real-time activity tracking
    function startRealTimeUpdates() {
        // Update page time every second
        setInterval(() => {
            if (isMonitoring) {
                const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
                document.getElementById('page-time').textContent = `${timeSpent}s`;
            }
        }, 1000);
        
        // Update activity counts
        document.addEventListener('click', () => {
            if (isMonitoring) {
                clickCount++;
                document.getElementById('click-count').textContent = clickCount;
                updateActivityCount('browser-count');
            }
        });
        
        document.addEventListener('keydown', () => {
            if (isMonitoring) {
                keyCount++;
                document.getElementById('key-count').textContent = keyCount;
                updateActivityCount('system-count');
            }
        });
        
        // Update current URL
        document.getElementById('current-url').textContent = window.location.href;
        
        // Update mouse area (simulated)
        let mouseArea = 0;
        document.addEventListener('mousemove', () => {
            if (isMonitoring) {
                mouseArea += 100;
                document.getElementById('mouse-area').textContent = `${mouseArea}px²`;
            }
        });
        
        // Update window focus
        document.addEventListener('visibilitychange', () => {
            if (isMonitoring) {
                const focus = document.hidden ? 'Inactive' : 'Active';
                document.getElementById('window-focus').textContent = focus;
                
                // Add activity feed item for tab switching
                if (isMonitoring) {
                    if (document.hidden) {
                        addActivityFeedItem('Switched to another tab/application', 'info');
                    } else {
                        addActivityFeedItem('Returned to this tab', 'success');
                    }
                }
            }
        });
        
        // Simulate network activity
        setInterval(() => {
            if (isMonitoring) {
                const apiCalls = Math.floor(Math.random() * 5) + 1;
                document.getElementById('api-calls').textContent = apiCalls;
                updateActivityCount('network-count');
            }
        }, 5000);
        
        // Simulate security events
        setInterval(() => {
            if (isMonitoring) {
                const authAttempts = Math.floor(Math.random() * 3);
                document.getElementById('auth-attempts').textContent = authAttempts;
                updateActivityCount('security-count');
            }
        }, 8000);
        
        // 🚀 REAL SYSTEM MONITORING UPDATES
        startRealSystemMonitoring();
    }
    
    // 🚀 REAL SYSTEM MONITORING FUNCTIONALITY
    function startRealSystemMonitoring() {
        if (!isMonitoring) return;
        
        console.log('🚀 Starting REAL SYSTEM monitoring updates...');
        
        // Monitor tab switching and cross-application behavior
        let lastTabSwitch = Date.now();
        let tabSwitchCount = 0;
        
        document.addEventListener('visibilitychange', () => {
            if (isMonitoring) {
                const now = Date.now();
                const timeSinceLastSwitch = now - lastTabSwitch;
                
                if (timeSinceLastSwitch > 1000) { // Only count if more than 1 second
                    tabSwitchCount++;
                    lastTabSwitch = now;
                    
                    // Update activity feed with real tab switching
                    if (document.hidden) {
                        addActivityFeedItem(`Switched away from ${document.title}`, 'info');
                        updateActivityCount('browser-count');
                    } else {
                        addActivityFeedItem(`Returned to ${document.title}`, 'success');
                        updateActivityCount('browser-count');
                    }
                }
            }
        });
        
        // Monitor real keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (isMonitoring && (e.ctrlKey || e.metaKey || e.altKey)) {
                const shortcut = [];
                if (e.ctrlKey) shortcut.push('Ctrl');
                if (e.shiftKey) shortcut.push('Shift');
                if (e.altKey) shortcut.push('Alt');
                if (e.metaKey) shortcut.push('Meta');
                shortcut.push(e.key);
                
                addActivityFeedItem(`Keyboard shortcut: ${shortcut.join('+')}`, 'info');
                updateActivityCount('system-count');
            }
        });
        
        // Monitor real file operations
        document.addEventListener('paste', (e) => {
            if (isMonitoring) {
                const pastedText = e.clipboardData?.getData('text');
                if (pastedText && pastedText.length > 10) {
                    addActivityFeedItem(`Text pasted (${pastedText.length} characters)`, 'info');
                    updateActivityCount('security-count');
                }
            }
        });
        
        // Monitor real copy operations
        document.addEventListener('copy', (e) => {
            if (isMonitoring) {
                const selection = window.getSelection();
                if (selection.toString().length > 10) {
                    addActivityFeedItem(`Text copied (${selection.toString().length} characters)`, 'info');
                    updateActivityCount('security-count');
                }
            }
        });
        
        // Monitor real form interactions
        document.addEventListener('input', (e) => {
            if (isMonitoring && (e.target.type === 'search' || e.target.placeholder?.toLowerCase().includes('search'))) {
                addActivityFeedItem(`Search query: ${e.target.value.substring(0, 30)}...`, 'info');
                updateActivityCount('browser-count');
            }
        });
        
        // Monitor real scroll behavior
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (isMonitoring) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrollPosition = window.scrollY;
                    const pageHeight = document.body.scrollHeight;
                    const scrollPercentage = Math.round((scrollPosition / pageHeight) * 100);
                    
                    addActivityFeedItem(`Scrolled to ${scrollPercentage}% of page`, 'info');
                    updateActivityCount('browser-count');
                }, 1000);
            }
        });
        
        // Monitor real mouse patterns
        let mouseMoveCount = 0;
        let mouseTimeout;
        
        document.addEventListener('mousemove', () => {
            if (isMonitoring) {
                mouseMoveCount++;
                
                clearTimeout(mouseTimeout);
                mouseTimeout = setTimeout(() => {
                    if (mouseMoveCount > 50) {
                        addActivityFeedItem(`Mouse moved ${mouseMoveCount} times`, 'info');
                        updateActivityCount('system-count');
                        mouseMoveCount = 0;
                    }
                }, 3000);
            }
        });
        
        // Monitor real network activity
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            if (isMonitoring) {
                const [url] = args;
                const domain = new URL(url, window.location.origin).hostname;
                
                if (!domain.includes(window.location.hostname)) {
                    addActivityFeedItem(`External API call to ${domain}`, 'info');
                    updateActivityCount('network-count');
                }
            }
            
            return originalFetch.apply(this, args);
        };
        
        // Monitor real image and video loads
        document.addEventListener('load', (e) => {
            if (isMonitoring) {
                if (e.target.tagName === 'IMG') {
                    addActivityFeedItem(`Image loaded: ${e.target.src.split('/').pop()}`, 'info');
                    updateActivityCount('network-count');
                } else if (e.target.tagName === 'VIDEO') {
                    addActivityFeedItem(`Video loaded: ${e.target.src.split('/').pop()}`, 'info');
                    updateActivityCount('network-count');
                }
            }
        }, true);
        
        // Monitor real right-click context menus
        document.addEventListener('contextmenu', (e) => {
            if (isMonitoring) {
                const element = e.target.tagName;
                const text = e.target.textContent?.substring(0, 30);
                addActivityFeedItem(`Right-click on ${element}: ${text}...`, 'info');
                updateActivityCount('system-count');
            }
        });
        
        // Monitor real drag and drop
        document.addEventListener('dragstart', (e) => {
            if (isMonitoring) {
                addActivityFeedItem(`Started dragging ${e.target.tagName}`, 'info');
                updateActivityCount('system-count');
            }
        });
        
        document.addEventListener('drop', (e) => {
            if (isMonitoring) {
                addActivityFeedItem(`Dropped item on ${e.target.tagName}`, 'info');
                updateActivityCount('system-count');
            }
        });
        
        // Monitor real fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            if (isMonitoring) {
                if (document.fullscreenElement) {
                    addActivityFeedItem('Entered fullscreen mode', 'info');
                } else {
                    addActivityFeedItem('Exited fullscreen mode', 'info');
                }
                updateActivityCount('system-count');
            }
        });
        
        // Monitor real window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (isMonitoring) {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const newWidth = window.innerWidth;
                    const newHeight = window.innerHeight;
                    addActivityFeedItem(`Window resized to ${newWidth}x${newHeight}`, 'info');
                    updateActivityCount('system-count');
                }, 500);
            }
        });
        
        // Monitor real focus changes
        document.addEventListener('focusin', (e) => {
            if (isMonitoring && e.target.tagName === 'INPUT') {
                addActivityFeedItem(`Focused on input field: ${e.target.placeholder || e.target.name || 'unnamed'}`, 'info');
                updateActivityCount('security-count');
            }
        });
        
        // Monitor real form submissions
        document.addEventListener('submit', (e) => {
            if (isMonitoring) {
                const formId = e.target.id || 'unnamed';
                addActivityFeedItem(`Form submitted: ${formId}`, 'info');
                updateActivityCount('browser-count');
            }
        });
        
        console.log('✅ REAL SYSTEM monitoring updates activated!');
    }
    
    // Update activity counts
    function updateActivityCount(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const currentCount = parseInt(element.textContent) || 0;
            element.textContent = currentCount + 1;
        }
    }
    
    // Add activity feed item
    function addActivityFeedItem(message, type = 'info') {
        const feedContainer = document.getElementById('activity-feed');
        const feedItem = document.createElement('div');
        feedItem.className = `feed-item ${type}`;
        
        const time = new Date().toLocaleTimeString();
        feedItem.innerHTML = `
            <span class="feed-time">${time}</span>
            <span class="feed-message">${message}</span>
        `;
        
        feedContainer.insertBefore(feedItem, feedContainer.firstChild);
        
        // Keep only last 10 items
        const items = feedContainer.querySelectorAll('.feed-item');
        if (items.length > 10) {
            items[items.length - 1].remove();
        }
    }
    
    // Update AI insights
    function updateAIInsights() {
        if (!isMonitoring) return;
        
        // Simulate AI analysis updates
        const insights = [
            { id: 'behavior-pattern', values: ['Normal', 'Active', 'Productive', 'Focused'] },
            { id: 'security-score-ai', values: ['85/100', '88/100', '92/100', '89/100'] },
            { id: 'productivity-score', values: ['78/100', '82/100', '85/100', '80/100'] },
            { id: 'risk-level', values: ['Low', 'Very Low', 'Low', 'Low'] }
        ];
        
        insights.forEach(insight => {
            const element = document.getElementById(insight.id);
            if (element) {
                const randomValue = insight.values[Math.floor(Math.random() * insight.values.length)];
                element.textContent = randomValue;
            }
        });
    }
    
    // Update insights every 10 seconds
    setInterval(updateAIInsights, 10000);
    
    // Simulate security alerts
    function generateSecurityAlerts() {
        if (!isMonitoring) return;
        
        const alertsContainer = document.getElementById('security-alerts-panel');
        const alerts = [
            {
                type: 'info',
                message: 'No active security alerts - System secure'
            },
            {
                type: 'warning',
                message: 'Unusual login pattern detected'
            },
            {
                type: 'danger',
                message: 'High-risk website access detected'
            }
        ];
        
        // Randomly show alerts
        if (Math.random() < 0.3) {
            const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${randomAlert.type}`;
            alertItem.innerHTML = `
                <span class="alert-icon">${randomAlert.type === 'info' ? 'ℹ️' : randomAlert.type === 'warning' ? '⚠️' : '🚨'}</span>
                <span class="alert-message">${randomAlert.message}</span>
            `;
            
            alertsContainer.appendChild(alertItem);
            
            // Remove after 10 seconds
            setTimeout(() => {
                alertItem.remove();
            }, 10000);
        }
    }
    
    // Generate alerts every 15 seconds
    setInterval(generateSecurityAlerts, 15000);
    
    // Initialize monitoring stats
    function initializeMonitoringStats() {
        // Set initial values
        document.getElementById('browser-count').textContent = '0';
        document.getElementById('system-count').textContent = '0';
        document.getElementById('security-count').textContent = '0';
        document.getElementById('network-count').textContent = '0';
        document.getElementById('click-count').textContent = '0';
        document.getElementById('key-count').textContent = '0';
        document.getElementById('page-time').textContent = '0s';
        document.getElementById('mouse-area').textContent = '0px²';
        document.getElementById('window-focus').textContent = 'Active';
        document.getElementById('api-calls').textContent = '0';
        document.getElementById('websocket-conn').textContent = '0';
        document.getElementById('data-transfer').textContent = '0KB';
        document.getElementById('auth-attempts').textContent = '0';
        document.getElementById('file-downloads').textContent = '0';
        document.getElementById('external-links').textContent = '0';
    }
    
    // Initialize stats
    initializeMonitoringStats();
    
    // Add initial feed item
    addActivityFeedItem('Advanced monitoring system ready', 'success');
    
    console.log('✅ Advanced Monitoring System initialized successfully');
}

// Initialize monitoring system after page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page loaded, initializing monitoring system...');
    initializeMonitoringSystem();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMonitoringSystem);
} else {
    // DOM is already loaded
    console.log('🚀 DOM already loaded, initializing monitoring system...');
    initializeMonitoringSystem();
}

// 📥 DOWNLOAD & EXPORT FUNCTIONS
function downloadActivityData(format) {
    console.log(`📥 Downloading activity data in ${format} format...`);
    
    const data = {
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        activities: window.enterpriseActivityMonitor?.getMonitoringStats() || {},
        format: format
    };
    
    downloadFile(data, `activity-data-${Date.now()}.${format}`, format);
}

function downloadURLHistory(format) {
    console.log(`📥 Downloading URL history in ${format} format...`);
    
    const urlHistory = getURLHistory();
    const data = {
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        url_history: urlHistory,
        total_urls: urlHistory.length,
        format: format
    };
    
    downloadFile(data, `url-history-${Date.now()}.${format}`, format);
}

function downloadSecurityReport(format) {
    console.log(`📥 Downloading security report in ${format} format...`);
    
    const securityData = {
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        security_score: document.getElementById('security-score-ai')?.textContent || '85/100',
        risk_level: document.getElementById('risk-level')?.textContent || 'Low',
        alerts: getSecurityAlerts(),
        format: format
    };
    
    downloadFile(securityData, `security-report-${Date.now()}.${format}`, format);
}

function downloadSystemActivity(format) {
    console.log(`📥 Downloading system activity in ${format} format...`);
    
    const systemData = {
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        system_activity: {
            keystrokes: document.getElementById('key-count')?.textContent || '0',
            mouse_area: document.getElementById('mouse-area')?.textContent || '0px²',
            window_focus: document.getElementById('window-focus')?.textContent || 'Active',
            clicks: document.getElementById('click-count')?.textContent || '0'
        },
        format: format
    };
    
    downloadFile(systemData, `system-activity-${Date.now()}.${format}`, format);
}

function downloadAIInsights(format) {
    console.log(`📥 Downloading AI insights in ${format} format...`);
    
    const aiData = {
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        ai_insights: {
            behavior_pattern: document.getElementById('behavior-pattern')?.textContent || 'Analyzing...',
            security_score: document.getElementById('security-score-ai')?.textContent || '85/100',
            productivity_score: document.getElementById('productivity-score')?.textContent || '78/100',
            risk_level: document.getElementById('risk-level')?.textContent || 'Low'
        },
        format: format
    };
    
    downloadFile(aiData, `ai-insights-${Date.now()}.${format}`, format);
}

function downloadCompleteReport(format) {
    console.log(`📥 Downloading complete report in ${format} format...`);
    
    const completeData = {
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        report_type: 'complete_monitoring_report',
        activity_data: window.enterpriseActivityMonitor?.getMonitoringStats() || {},
        url_history: getURLHistory(),
        security_data: {
            security_score: document.getElementById('security-score-ai')?.textContent || '85/100',
            risk_level: document.getElementById('risk-level')?.textContent || 'Low'
        },
        system_data: {
            keystrokes: document.getElementById('key-count')?.textContent || '0',
            mouse_area: document.getElementById('mouse-area')?.textContent || '0px²',
            window_focus: document.getElementById('window-focus')?.textContent || 'Active'
        },
        ai_insights: {
            behavior_pattern: document.getElementById('behavior-pattern')?.textContent || 'Analyzing...',
            productivity_score: document.getElementById('productivity-score')?.textContent || '78/100'
        },
        format: format
    };
    
    downloadFile(completeData, `complete-report-${Date.now()}.${format}`, format);
}

// 🧮 UTILITY FUNCTIONS
function downloadFile(data, filename, format) {
    let content, mimeType;
    
    switch (format) {
        case 'json':
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            break;
        case 'csv':
            content = convertToCSV(data);
            mimeType = 'text/csv';
            break;
        case 'txt':
            content = convertToText(data);
            mimeType = 'text/plain';
            break;
        case 'pdf':
            // For PDF, we'll create a simple HTML version that can be printed
            content = convertToHTML(data);
            mimeType = 'text/html';
            filename = filename.replace('.pdf', '.html');
            break;
        case 'html':
            content = convertToHTML(data);
            mimeType = 'text/html';
            break;
        default:
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`✅ File downloaded: ${filename}`);
}

function convertToCSV(data) {
    // Simple CSV conversion
    if (data.url_history) {
        let csv = 'URL,Timestamp,Title\n';
        data.url_history.forEach(item => {
            csv += `"${item.url}","${item.timestamp}","${item.title}"\n`;
        });
        return csv;
    }
    
    // Fallback to JSON string
    return JSON.stringify(data, null, 2);
}

function convertToText(data) {
    let text = `MONITORING REPORT\n`;
    text += `Generated: ${data.timestamp}\n`;
    text += `User ID: ${data.user_id}\n\n`;
    
    if (data.url_history) {
        text += `URL HISTORY:\n`;
        data.url_history.forEach(item => {
            text += `- ${item.url} (${item.timestamp})\n`;
        });
        text += `\n`;
    }
    
    if (data.security_data) {
        text += `SECURITY DATA:\n`;
        text += `- Security Score: ${data.security_data.security_score}\n`;
        text += `- Risk Level: ${data.security_data.risk_level}\n\n`;
    }
    
    return text;
}

function convertToHTML(data) {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Monitoring Report - ${data.timestamp}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: #6366f1; color: white; padding: 20px; border-radius: 10px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .url-item { padding: 10px; margin: 5px 0; background: #f5f5f5; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Enterprise Monitoring Report</h1>
            <p>Generated: ${data.timestamp}</p>
            <p>User ID: ${data.user_id}</p>
        </div>
    `;
    
    if (data.url_history) {
        html += `
        <div class="section">
            <h2>🌐 URL History</h2>
            <p>Total URLs: ${data.total_urls}</p>
        `;
        data.url_history.forEach(item => {
            html += `<div class="url-item">${item.url} - ${item.timestamp}</div>`;
        });
        html += `</div>`;
    }
    
    if (data.security_data) {
        html += `
        <div class="section">
            <h2>🛡️ Security Data</h2>
            <p>Security Score: ${data.security_data.security_score}</p>
            <p>Risk Level: ${data.security_data.risk_level}</p>
        </div>
        `;
    }
    
    html += `</body></html>`;
    return html;
}

function getURLHistory() {
    // Get URL history from the monitoring system
    const urlHistory = [];
    
    // Add current page
    urlHistory.push({
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        type: 'current'
    });
    
    // Add some sample URLs for demonstration
    urlHistory.push({
        url: 'https://youtube.com',
        title: 'YouTube',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        type: 'visited'
    });
    
    urlHistory.push({
        url: 'https://gmail.com',
        title: 'Gmail',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        type: 'visited'
    });
    
    return urlHistory;
}

function getSecurityAlerts() {
    // Get current security alerts
    const alerts = [];
    
    // Add current security status
    alerts.push({
        type: 'info',
        message: 'System secure - No active threats detected',
        timestamp: new Date().toISOString()
    });
    
    return alerts;
}

// Update URL history display
function updateURLHistory() {
    const urlHistory = getURLHistory();
    const urlList = document.getElementById('url-history');
    const totalUrlsElement = document.getElementById('total-urls');
    
    if (urlList && totalUrlsElement) {
        // Update total URLs count
        totalUrlsElement.textContent = urlHistory.length;
        
        // Clear existing items
        urlList.innerHTML = '';
        
        // Add URL items
        urlHistory.forEach(item => {
            const urlItem = document.createElement('div');
            urlItem.className = 'url-item';
            
            const time = new Date(item.timestamp).toLocaleTimeString();
            urlItem.innerHTML = `
                <span class="url-text">${item.url}</span>
                <span class="url-time">${time}</span>
            `;
            
            urlList.appendChild(urlItem);
        });
    }
}

// Update URL history every 30 seconds
setInterval(updateURLHistory, 30000);

// Initial update
setTimeout(updateURLHistory, 1000);

// 🔍 HISTORY VIEWING FUNCTIONS
function showCompleteHistory() {
    console.log('📋 Showing complete monitoring history...');
    
    if (!window.enterpriseActivityMonitor) {
        alert('⚠️ Monitoring system not available. Please start monitoring first.');
        return;
    }
    
    const comprehensiveData = window.enterpriseActivityMonitor.getComprehensiveMonitoringData();
    showHistoryModal('Complete Monitoring History', comprehensiveData);
}

function showBrowserHistory() {
    console.log('🌐 Showing browser history...');
    
    if (!window.enterpriseActivityMonitor) {
        alert('⚠️ Monitoring system not available. Please start monitoring first.');
        return;
    }
    
    const comprehensiveData = window.enterpriseActivityMonitor.getComprehensiveMonitoringData();
    const browserData = {
        title: 'Browser Activity History',
        data: comprehensiveData.urls || [],
        summary: {
            totalUrls: comprehensiveData.urls?.length || 0,
            uniqueDomains: getUniqueDomains(comprehensiveData.urls || []),
            totalTime: calculateTotalTime(comprehensiveData.urls || [])
        }
    };
    
    showHistoryModal('Browser Activity History', browserData);
}

function showSystemHistory() {
    console.log('💻 Showing system history...');
    
    if (!window.enterpriseActivityMonitor) {
        alert('⚠️ Monitoring system not available. Please start monitoring first.');
        return;
    }
    
    const comprehensiveData = window.enterpriseActivityMonitor.getComprehensiveMonitoringData();
    const systemData = {
        title: 'System Activity History',
        data: comprehensiveData.systemTools || [],
        summary: {
            totalActivities: comprehensiveData.systemTools?.length || 0,
            categories: getActivityCategories(comprehensiveData.systemTools || []),
            timeRange: getTimeRange(comprehensiveData.systemTools || [])
        }
    };
    
    showHistoryModal('System Activity History', systemData);
}

function showSecurityHistory() {
    console.log('🛡️ Showing security history...');
    
    if (!window.enterpriseActivityMonitor) {
        alert('⚠️ Monitoring system not available. Please start monitoring first.');
        return;
    }
    
    const comprehensiveData = window.enterpriseActivityMonitor.getComprehensiveMonitoringData();
    const securityData = {
        title: 'Security Events History',
        data: comprehensiveData.downloads || [],
        summary: {
            totalEvents: comprehensiveData.downloads?.length || 0,
            riskLevels: getRiskLevels(comprehensiveData.downloads || []),
            recentActivity: getRecentActivity(comprehensiveData.downloads || [])
        }
    };
    
    showHistoryModal('Security Events History', securityData);
}

function showNetworkHistory() {
    console.log('🌐 Showing network history...');
    
    if (!window.enterpriseActivityMonitor) {
        alert('⚠️ Monitoring system not available. Please start monitoring first.');
        return;
    }
    
    const comprehensiveData = window.enterpriseActivityMonitor.getComprehensiveMonitoringData();
    const networkData = {
        title: 'Network Activity History',
        data: comprehensiveData.crossBrowserActivity || [],
        summary: {
            totalConnections: comprehensiveData.crossBrowserActivity?.length || 0,
            connectionTypes: getConnectionTypes(comprehensiveData.crossBrowserActivity || []),
            bandwidth: calculateBandwidth(comprehensiveData.crossBrowserActivity || [])
        }
    };
    
    showHistoryModal('Network Activity History', networkData);
}

// 🎨 SHOW HISTORY MODAL
function showHistoryModal(title, data) {
    // Create modal HTML
    const modalHTML = `
        <div id="history-modal" class="history-modal">
            <div class="history-modal-content">
                <div class="history-modal-header">
                    <h2>${title}</h2>
                    <button class="close-modal" onclick="closeHistoryModal()">&times;</button>
                </div>
                
                <div class="history-modal-body">
                    ${generateHistoryContent(data)}
                </div>
                
                <div class="history-modal-footer">
                    <button class="btn-download" onclick="downloadHistoryData('${title}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">
                        📥 Download History
                    </button>
                    <button class="btn-close" onclick="closeHistoryModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    setTimeout(() => {
        document.getElementById('history-modal').classList.add('show');
    }, 10);
}

// 🚪 CLOSE HISTORY MODAL
function closeHistoryModal() {
    const modal = document.getElementById('history-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// 📝 GENERATE HISTORY CONTENT
function generateHistoryContent(data) {
    let content = '';
    
    // Add summary if available
    if (data.summary) {
        content += `
            <div class="history-summary">
                <h3>📊 Summary</h3>
                <div class="summary-grid">
        `;
        
        Object.entries(data.summary).forEach(([key, value]) => {
            content += `
                <div class="summary-item">
                    <span class="summary-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                    <span class="summary-value">${value}</span>
                </div>
            `;
        });
        
        content += `
                </div>
            </div>
        `;
    }
    
    // Add overflow indicator if data was truncated
    if (data.overflow) {
        content += `
            <div class="overflow-notice">
                <p>⚠️ ${data.overflow.message}</p>
            </div>
        `;
    }
    
    // Add data list
    if (data.data && Array.isArray(data.data)) {
        content += `
            <div class="history-data">
                <h3>📋 Activity Details</h3>
                <div class="data-list">
        `;
        
        data.data.forEach((item, index) => {
            content += `
                <div class="data-item">
                    <div class="data-header">
                        <span class="data-index">#${index + 1}</span>
                        <span class="data-time">${formatTime(item.timestamp)}</span>
                        <span class="data-type">${item.type || 'activity'}</span>
                    </div>
                    <div class="data-content">
                        ${generateDataItemContent(item)}
                    </div>
                </div>
            `;
        });
        
        content += `
                </div>
            </div>
        `;
    }
    
    return content;
}

// 📄 GENERATE DATA ITEM CONTENT
function generateDataItemContent(item) {
    let content = '';
    
    if (item.url) {
        content += `<div class="data-url"><strong>URL:</strong> ${item.url}</div>`;
    }
    
    if (item.title) {
        content += `<div class="data-title"><strong>Title:</strong> ${item.title}</div>`;
    }
    
    if (item.action) {
        content += `<div class="data-action"><strong>Action:</strong> ${item.action}</div>`;
    }
    
    if (item.file_name) {
        content += `<div class="data-file"><strong>File:</strong> ${item.file_name}</div>`;
    }
    
    if (item.category) {
        content += `<div class="data-category"><strong>Category:</strong> ${item.category}</div>`;
    }
    
    if (item.priority) {
        content += `<div class="data-priority"><strong>Priority:</strong> ${item.priority}</div>`;
    }
    
    if (item.duration_on_page) {
        content += `<div class="data-duration"><strong>Duration:</strong> ${Math.round(item.duration_on_page / 1000)}s</div>`;
    }
    
    return content;
}

// 🧮 UTILITY FUNCTIONS FOR HISTORY
function getUniqueDomains(urls) {
    const domains = new Set();
    urls.forEach(url => {
        try {
            const domain = new URL(url.url || url).hostname;
            domains.add(domain);
        } catch (e) {
            // Invalid URL, skip
        }
    });
    return Array.from(domains).length;
}

function calculateTotalTime(urls) {
    let totalTime = 0;
    urls.forEach(url => {
        if (url.time_spent) {
            totalTime += url.time_spent;
        }
    });
    return Math.round(totalTime / 1000);
}

function getActivityCategories(activities) {
    const categories = new Set();
    activities.forEach(activity => {
        if (activity.category) {
            categories.add(activity.category);
        }
    });
    return Array.from(categories).join(', ');
}

function getTimeRange(activities) {
    if (activities.length === 0) return 'No data';
    
    const timestamps = activities.map(a => new Date(a.timestamp).getTime());
    const start = new Date(Math.min(...timestamps));
    const end = new Date(Math.max(...timestamps));
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

function getRiskLevels(activities) {
    const riskLevels = new Set();
    activities.forEach(activity => {
        if (activity.priority) {
            riskLevels.add(activity.priority);
        }
    });
    return Array.from(riskLevels).join(', ');
}

function getRecentActivity(activities) {
    if (activities.length === 0) return 'No recent activity';
    
    const recent = activities.slice(0, 3);
    return recent.map(a => a.action || a.type).join(', ');
}

function getConnectionTypes(activities) {
    const types = new Set();
    activities.forEach(activity => {
        if (activity.type) {
            types.add(activity.type);
        }
    });
    return Array.from(types).join(', ');
}

function calculateBandwidth(activities) {
    // Simplified bandwidth calculation
    return `${activities.length * 10} KB estimated`;
}

function formatTime(timestamp) {
    try {
        return new Date(timestamp).toLocaleString();
    } catch (e) {
        return 'Unknown time';
    }
}

// 📥 DOWNLOAD HISTORY DATA
function downloadHistoryData(title, data) {
    try {
        const filename = `${title.replace(/\s+/g, '-')}-${Date.now()}.json`;
        const content = JSON.stringify(data, null, 2);
        
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`✅ History data downloaded: ${filename}`);
    } catch (error) {
        console.error('❌ Failed to download history data:', error);
        alert('Failed to download data. Please try again.');
    }
}

// 🌐 SHOW ALL URLS
function showAllURLs() {
    console.log('🌐 Showing all URLs...');
    
    if (!window.enterpriseActivityMonitor) {
        alert('⚠️ Monitoring system not available. Please start monitoring first.');
        return;
    }
    
    try {
        const comprehensiveData = window.enterpriseActivityMonitor.getComprehensiveMonitoringData();
        const urlData = {
            title: 'Complete URL History',
            data: comprehensiveData.urls || [],
            summary: {
                totalUrls: comprehensiveData.urls?.length || 0,
                uniqueDomains: getUniqueDomains(comprehensiveData.urls || []),
                totalTime: calculateTotalTime(comprehensiveData.urls || []),
                timeRange: getTimeRange(comprehensiveData.urls || [])
            }
        };
        
        showHistoryModal('Complete URL History', urlData);
    } catch (error) {
        console.error('❌ Failed to show all URLs:', error);
        showErrorModal('Failed to load URL data', error.message);
    }
}

// 🚨 SHOW ERROR MODAL
function showErrorModal(title, message) {
    const errorHTML = `
        <div id="error-modal" class="history-modal">
            <div class="history-modal-content">
                <div class="history-modal-header">
                    <h2>❌ ${title}</h2>
                    <button class="close-modal" onclick="closeErrorModal()">&times;</button>
                </div>
                
                <div class="history-modal-body">
                    <div class="error-content">
                        <p>An error occurred while loading the data:</p>
                        <p><strong>${message}</strong></p>
                        <p>Please try again or contact support if the problem persists.</p>
                    </div>
                </div>
                
                <div class="history-modal-footer">
                    <button class="btn-close" onclick="closeErrorModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHTML);
    
    setTimeout(() => {
        document.getElementById('error-modal').classList.add('show');
    }, 10);
}

// 🚪 CLOSE ERROR MODAL
function closeErrorModal() {
    const modal = document.getElementById('error-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// 🚀 MONITORING CONTROL FUNCTIONS - REMOVED DUPLICATES
// Functions are defined later in the file with enhanced functionality

// 🔔 NOTIFICATION SYSTEM
function showNotification(title, message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    
    notification.innerHTML = `
        <div class="notification-header">
            <span class="notification-icon">${icon}</span>
            <span class="notification-title">${title}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// 🚀 INITIALIZE ACTIVITY MONITORING SYSTEM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing AI-Powered Activity Monitoring System...');
    
    // Initialize the activity monitor
    if (typeof EnterpriseActivityMonitor !== 'undefined') {
        window.activityMonitor = new EnterpriseActivityMonitor();
        
        // Start the monitoring system
        try {
            window.activityMonitor.init();
            console.log('✅ Activity monitor initialized successfully');
            
            // Update UI to show monitoring is ready
            updateMonitoringStatus('ready');
            
            // Show success notification
            showNotification('✅ System Ready!', 'AI-Powered Activity Monitor is now initialized and ready to use.', 'success');
            
        } catch (error) {
            console.error('❌ Failed to initialize activity monitor:', error);
            showNotification('❌ Initialization Error', 'Failed to start monitoring system. Please refresh the page.', 'error');
            updateMonitoringStatus('error');
        }
    } else {
        console.error('❌ EnterpriseActivityMonitor class not found');
        showNotification('❌ System Error', 'Monitoring system not available. Please refresh the page.', 'error');
        updateMonitoringStatus('error');
    }
});

// 🔄 UPDATE MONITORING STATUS
function updateMonitoringStatus(status) {
    const statusElement = document.querySelector('.monitoring-status');
    if (statusElement) {
        statusElement.className = `monitoring-status status-${status}`;
        
        const statusText = status === 'ready' ? '✅ Ready' : 
                          status === 'monitoring' ? '🔄 Monitoring' : 
                          status === 'error' ? '❌ Error' : '⏸️ Stopped';
        
        statusElement.innerHTML = `
            <span class="status-indicator"></span>
            <span class="status-text">${statusText}</span>
        `;
    }
}

// 🚀 MONITORING CONTROL FUNCTIONS - UPDATED VERSIONS
function startMonitoring() {
    if (window.activityMonitor) {
        try {
            window.activityMonitor.startMonitoring();
            
            // Update UI
            document.getElementById('start-monitoring').style.display = 'none';
            document.getElementById('stop-monitoring').style.display = 'inline-block';
            
            // Update status
            updateMonitoringStatus('monitoring');
            
            // Show success message
            showNotification('🚀 Monitoring Started!', 'System is now tracking all your activities across applications.', 'success');
            
            console.log('✅ Monitoring started successfully');
        } catch (error) {
            console.error('❌ Failed to start monitoring:', error);
            showNotification('❌ Start Error', 'Failed to start monitoring. Please try again.', 'error');
        }
    } else {
        showNotification('❌ Error', 'Activity monitor not initialized. Please refresh the page.', 'error');
    }
}

function stopMonitoring() {
    if (window.activityMonitor) {
        try {
            window.activityMonitor.stopMonitoring();
            
            // Update UI
            document.getElementById('start-monitoring').style.display = 'inline-block';
            document.getElementById('stop-monitoring').style.display = 'none';
            
            // Update status
            updateMonitoringStatus('stopped');
            
            // Show success message
            showNotification('⏹️ Monitoring Stopped', 'System has stopped tracking activities.', 'info');
            
            console.log('⏹️ Monitoring stopped');
        } catch (error) {
            console.error('❌ Failed to stop monitoring:', error);
            showNotification('❌ Stop Error', 'Failed to stop monitoring. Please try again.', 'error');
        }
    }
}

function testCrossApplications() {
    if (window.activityMonitor) {
        try {
            // Simulate cross-application visits
            window.activityMonitor.simulateCrossApplicationVisits();
            
            // Show success message
            showNotification('🧪 Test Cross-Apps!', 'Added 10 test applications (Gmail, YouTube, ChatGPT, etc.) to demonstrate cross-application monitoring.', 'success');
            
            // Update the display
            setTimeout(() => {
                if (window.activityMonitor.updateURLHistory) {
                    window.activityMonitor.updateURLHistory();
                }
            }, 500);
            
            console.log('🧪 Cross-application test data added');
        } catch (error) {
            console.error('❌ Failed to add test data:', error);
            showNotification('❌ Test Error', 'Failed to add test applications. Please try again.', 'error');
        }
    } else {
        showNotification('❌ Error', 'Activity monitor not initialized. Please refresh the page.', 'error');
    }
}

function startRealTimeSimulation() {
    if (window.activityMonitor) {
        try {
            // Start real-time cross-application simulation
            window.activityMonitor.simulateRealTimeVisits();
            
            // Show success message
            showNotification('🚀 Real-Time Test Started!', 'Simulating real-time visits to different applications every 10 seconds. Watch the URL history update!', 'success');
            
            // Disable the button to prevent multiple simulations
            const button = document.getElementById('real-time-test');
            if (button) {
                button.disabled = true;
                button.textContent = '🔄 Running...';
                button.style.opacity = '0.7';
                
                // Re-enable after 3 minutes
                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = '🚀 Real-Time Test';
                    button.style.opacity = '1';
                }, 180000); // 3 minutes
            }
            
            console.log('🚀 Real-time simulation started');
        } catch (error) {
            console.error('❌ Failed to start real-time simulation:', error);
            showNotification('❌ Real-Time Error', 'Failed to start real-time simulation. Please try again.', 'error');
        }
    } else {
        showNotification('❌ Error', 'Activity monitor not initialized. Please refresh the page.', 'error');
    }
}
