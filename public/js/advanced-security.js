/**
 * Advanced Security Features for Agies Password Manager
 * Biometric authentication, hardware keys, advanced threat detection
 */

class AdvancedSecurityFeatures {
    constructor() {
        this.isInitialized = false;
        this.biometricSupport = false;
        this.hardwareKeySupport = false;
        this.threatDetection = null;
        this.securityScore = 0;
        this.init();
    }

    async init() {
        try {
            await this.checkBiometricSupport();
            await this.checkHardwareKeySupport();
            await this.initializeThreatDetection();
            await this.setupAdvancedFeatures();
            this.isInitialized = true;
            console.log('✅ Advanced Security Features initialized');
        } catch (error) {
            console.error('❌ Advanced security initialization failed:', error);
        }
    }

    // Check for biometric authentication support
    async checkBiometricSupport() {
        try {
            if (window.PublicKeyCredential && 
                typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
                
                this.biometricSupport = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                console.log('🔐 Biometric support:', this.biometricSupport ? 'Available' : 'Not available');
            }
        } catch (error) {
            console.log('🔐 Biometric authentication not supported');
            this.biometricSupport = false;
        }
    }

    // Check for hardware key support (WebAuthn)
    async checkHardwareKeySupport() {
        try {
            if (window.PublicKeyCredential) {
                this.hardwareKeySupport = true;
                console.log('🔑 Hardware key support: Available');
            } else {
                this.hardwareKeySupport = false;
                console.log('🔑 Hardware key support: Not available');
            }
        } catch (error) {
            this.hardwareKeySupport = false;
        }
    }

    // Initialize advanced threat detection
    async initializeThreatDetection() {
        this.threatDetection = {
            suspiciousActivity: [],
            failedAttempts: 0,
            lastActivity: Date.now(),
            deviceFingerprint: await this.generateDeviceFingerprint(),
            behaviorProfile: this.createBehaviorProfile()
        };
    }

    // Generate device fingerprint
    async generateDeviceFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint test', 2, 2);
        
        const fingerprint = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            canvas: canvas.toDataURL(),
            webgl: this.getWebGLFingerprint(),
            audio: await this.getAudioFingerprint()
        };
        
        // Create hash of fingerprint
        const fingerprintString = JSON.stringify(fingerprint);
        const hash = await this.hashString(fingerprintString);
        
        return {
            hash: hash,
            components: fingerprint
        };
    }

    // Get WebGL fingerprint
    getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            if (!gl) return null;
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            };
        } catch (error) {
            return null;
        }
    }

    // Get audio fingerprint
    async getAudioFingerprint() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(analyser);
            analyser.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 1000;
            gainNode.gain.value = 0;
            
            oscillator.start();
            
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            
            oscillator.stop();
            audioContext.close();
            
            return Array.from(dataArray).slice(0, 10).join(',');
        } catch (error) {
            return null;
        }
    }

    // Hash string using SubtleCrypto
    async hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Create behavior profile
    createBehaviorProfile() {
        return {
            typingPattern: [],
            mouseMovements: [],
            clickPatterns: [],
            navigationPatterns: [],
            timePatterns: []
        };
    }

    // Setup advanced security features
    async setupAdvancedFeatures() {
        this.setupBehaviorAnalysis();
        this.setupAnomalyDetection();
        this.setupSecurityMonitoring();
        this.updateSecurityUI();
    }

    // Setup behavior analysis
    setupBehaviorAnalysis() {
        // Keyboard behavior analysis
        document.addEventListener('keydown', (e) => {
            this.recordKeystroke(e);
        });

        // Mouse behavior analysis
        document.addEventListener('mousemove', (e) => {
            this.recordMouseMovement(e);
        });

        // Click pattern analysis
        document.addEventListener('click', (e) => {
            this.recordClick(e);
        });
    }

    // Record keystroke patterns
    recordKeystroke(event) {
        const keystroke = {
            key: event.key,
            timestamp: Date.now(),
            duration: null,
            pressure: event.force || 0
        };
        
        this.threatDetection.behaviorProfile.typingPattern.push(keystroke);
        
        // Keep only last 100 keystrokes
        if (this.threatDetection.behaviorProfile.typingPattern.length > 100) {
            this.threatDetection.behaviorProfile.typingPattern.shift();
        }
    }

    // Record mouse movements
    recordMouseMovement(event) {
        const movement = {
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now(),
            velocity: this.calculateMouseVelocity(event)
        };
        
        this.threatDetection.behaviorProfile.mouseMovements.push(movement);
        
        // Keep only last 50 movements
        if (this.threatDetection.behaviorProfile.mouseMovements.length > 50) {
            this.threatDetection.behaviorProfile.mouseMovements.shift();
        }
    }

    // Calculate mouse velocity
    calculateMouseVelocity(event) {
        const lastMovement = this.threatDetection.behaviorProfile.mouseMovements.slice(-1)[0];
        if (!lastMovement) return 0;
        
        const distance = Math.sqrt(
            Math.pow(event.clientX - lastMovement.x, 2) + 
            Math.pow(event.clientY - lastMovement.y, 2)
        );
        const time = Date.now() - lastMovement.timestamp;
        
        return time > 0 ? distance / time : 0;
    }

    // Record click patterns
    recordClick(event) {
        const click = {
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now(),
            element: event.target.tagName,
            button: event.button
        };
        
        this.threatDetection.behaviorProfile.clickPatterns.push(click);
        
        // Keep only last 30 clicks
        if (this.threatDetection.behaviorProfile.clickPatterns.length > 30) {
            this.threatDetection.behaviorProfile.clickPatterns.shift();
        }
    }

    // Setup anomaly detection
    setupAnomalyDetection() {
        // Check for suspicious activity every 30 seconds
        setInterval(() => {
            this.detectAnomalies();
        }, 30000);
    }

    // Detect behavioral anomalies
    detectAnomalies() {
        const anomalies = [];
        
        // Check typing speed anomalies
        const typingAnomaly = this.detectTypingAnomalies();
        if (typingAnomaly) anomalies.push(typingAnomaly);
        
        // Check mouse movement anomalies
        const mouseAnomaly = this.detectMouseAnomalies();
        if (mouseAnomaly) anomalies.push(mouseAnomaly);
        
        // Check time-based anomalies
        const timeAnomaly = this.detectTimeAnomalies();
        if (timeAnomaly) anomalies.push(timeAnomaly);
        
        if (anomalies.length > 0) {
            this.handleAnomalies(anomalies);
        }
    }

    // Detect typing anomalies
    detectTypingAnomalies() {
        const keystrokes = this.threatDetection.behaviorProfile.typingPattern;
        if (keystrokes.length < 10) return null;
        
        // Calculate average typing speed
        const speeds = [];
        for (let i = 1; i < keystrokes.length; i++) {
            const timeDiff = keystrokes[i].timestamp - keystrokes[i-1].timestamp;
            speeds.push(timeDiff);
        }
        
        const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
        const currentSpeed = speeds.slice(-5).reduce((a, b) => a + b, 0) / 5;
        
        // Check if current speed deviates significantly from average
        if (Math.abs(currentSpeed - avgSpeed) > avgSpeed * 0.5) {
            return {
                type: 'typing_anomaly',
                severity: 'medium',
                details: `Typing speed deviation: ${Math.round((currentSpeed - avgSpeed) / avgSpeed * 100)}%`
            };
        }
        
        return null;
    }

    // Detect mouse movement anomalies
    detectMouseAnomalies() {
        const movements = this.threatDetection.behaviorProfile.mouseMovements;
        if (movements.length < 10) return null;
        
        // Check for unnatural mouse movements (too fast or too straight)
        const recentMovements = movements.slice(-10);
        const avgVelocity = recentMovements.reduce((sum, m) => sum + m.velocity, 0) / recentMovements.length;
        
        if (avgVelocity > 5) { // Threshold for unnatural speed
            return {
                type: 'mouse_anomaly',
                severity: 'high',
                details: `Unnatural mouse velocity: ${avgVelocity.toFixed(2)}`
            };
        }
        
        return null;
    }

    // Detect time-based anomalies
    detectTimeAnomalies() {
        const now = Date.now();
        const timeSinceLastActivity = now - this.threatDetection.lastActivity;
        
        // Check for activity at unusual hours
        const hour = new Date().getHours();
        if (hour < 6 || hour > 23) {
            return {
                type: 'time_anomaly',
                severity: 'low',
                details: `Activity at unusual hour: ${hour}:00`
            };
        }
        
        return null;
    }

    // Handle detected anomalies
    handleAnomalies(anomalies) {
        console.warn('🚨 Security anomalies detected:', anomalies);
        
        // Add to suspicious activity log
        this.threatDetection.suspiciousActivity.push({
            timestamp: Date.now(),
            anomalies: anomalies,
            deviceFingerprint: this.threatDetection.deviceFingerprint.hash
        });
        
        // Calculate threat level
        const threatLevel = this.calculateThreatLevel(anomalies);
        
        // Take action based on threat level
        if (threatLevel === 'high') {
            this.triggerSecurityAlert(anomalies);
        } else if (threatLevel === 'medium') {
            this.requireAdditionalVerification();
        }
        
        // Update security score
        this.updateSecurityScore();
    }

    // Calculate threat level
    calculateThreatLevel(anomalies) {
        const highSeverityCount = anomalies.filter(a => a.severity === 'high').length;
        const mediumSeverityCount = anomalies.filter(a => a.severity === 'medium').length;
        
        if (highSeverityCount > 0) return 'high';
        if (mediumSeverityCount > 1) return 'medium';
        return 'low';
    }

    // Trigger security alert
    triggerSecurityAlert(anomalies) {
        const alertModal = document.createElement('div');
        alertModal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
        alertModal.innerHTML = `
            <div class="bg-red-900 border border-red-600 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center mb-4">
                    <div class="text-4xl mb-2">🚨</div>
                    <h2 class="text-xl font-bold text-white">Security Alert</h2>
                    <p class="text-red-200">Suspicious activity detected</p>
                </div>
                <div class="mb-4">
                    <h3 class="font-semibold text-white mb-2">Anomalies Detected:</h3>
                    <ul class="text-red-200 text-sm">
                        ${anomalies.map(a => `<li>• ${a.details}</li>`).join('')}
                    </ul>
                </div>
                <div class="flex space-x-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                        I'm the legitimate user
                    </button>
                    <button onclick="window.location.href='/login'" 
                            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        Logout for security
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(alertModal);
    }

    // Require additional verification
    requireAdditionalVerification() {
        console.log('🔐 Additional verification required');
        
        // Show 2FA prompt or other verification
        if (window.twoFactorAuthManager) {
            this.show2FAVerification();
        }
    }

    // Show 2FA verification prompt
    show2FAVerification() {
        const verificationModal = document.createElement('div');
        verificationModal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
        verificationModal.innerHTML = `
            <div class="bg-gray-900 border border-gray-600 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center mb-4">
                    <div class="text-4xl mb-2">🔐</div>
                    <h2 class="text-xl font-bold text-white">Additional Verification Required</h2>
                    <p class="text-gray-300">Please verify your identity</p>
                </div>
                <div class="mb-4">
                    <label class="block text-white mb-2">Enter 2FA Code:</label>
                    <input type="text" id="verification-code" maxlength="6" 
                           class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                           placeholder="000000">
                </div>
                <div class="flex space-x-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Verify
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(verificationModal);
    }

    // Setup security monitoring
    setupSecurityMonitoring() {
        // Monitor for failed login attempts
        this.monitorFailedAttempts();
        
        // Monitor for suspicious network activity
        this.monitorNetworkActivity();
        
        // Monitor for device changes
        this.monitorDeviceChanges();
    }

    // Monitor failed login attempts
    monitorFailedAttempts() {
        // This would integrate with the authentication system
        // For now, we'll simulate monitoring
        setInterval(() => {
            // Check for repeated failed attempts
            if (this.threatDetection.failedAttempts > 3) {
                this.handleMultipleFailedAttempts();
            }
        }, 60000); // Check every minute
    }

    // Handle multiple failed attempts
    handleMultipleFailedAttempts() {
        console.warn('🚨 Multiple failed login attempts detected');
        
        // Implement progressive delays or account lockout
        this.implementRateLimiting();
    }

    // Implement rate limiting
    implementRateLimiting() {
        const delayTime = Math.min(this.threatDetection.failedAttempts * 1000, 30000); // Max 30 seconds
        
        console.log(`🔒 Rate limiting activated: ${delayTime}ms delay`);
        
        // Disable login for delay period
        const loginButtons = document.querySelectorAll('button[type="submit"], .login-btn');
        loginButtons.forEach(btn => {
            btn.disabled = true;
            const originalText = btn.textContent;
            const countdown = setInterval(() => {
                const remaining = Math.ceil((delayTime - (Date.now() % delayTime)) / 1000);
                btn.textContent = `Try again in ${remaining}s`;
            }, 1000);
            
            setTimeout(() => {
                clearInterval(countdown);
                btn.disabled = false;
                btn.textContent = originalText;
            }, delayTime);
        });
    }

    // Monitor network activity
    monitorNetworkActivity() {
        // Monitor fetch requests for suspicious patterns
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            this.logNetworkRequest(args[0]);
            return originalFetch.apply(window, args);
        };
    }

    // Log network requests
    logNetworkRequest(url) {
        // Basic monitoring - in production this would be more sophisticated
        console.log('🌐 Network request:', url);
        
        // Update last activity time
        this.threatDetection.lastActivity = Date.now();
    }

    // Monitor device changes
    monitorDeviceChanges() {
        setInterval(async () => {
            const currentFingerprint = await this.generateDeviceFingerprint();
            
            if (currentFingerprint.hash !== this.threatDetection.deviceFingerprint.hash) {
                this.handleDeviceChange(currentFingerprint);
            }
        }, 300000); // Check every 5 minutes
    }

    // Handle device fingerprint change
    handleDeviceChange(newFingerprint) {
        console.warn('🔄 Device fingerprint changed');
        
        // This could indicate device sharing or compromise
        this.threatDetection.suspiciousActivity.push({
            type: 'device_change',
            timestamp: Date.now(),
            oldFingerprint: this.threatDetection.deviceFingerprint.hash,
            newFingerprint: newFingerprint.hash
        });
        
        // Update fingerprint
        this.threatDetection.deviceFingerprint = newFingerprint;
        
        // Require re-authentication or additional verification
        this.requireAdditionalVerification();
    }

    // Update security score
    updateSecurityScore() {
        let score = 100;
        
        // Deduct points for suspicious activity
        score -= this.threatDetection.suspiciousActivity.length * 5;
        
        // Deduct points for failed attempts
        score -= this.threatDetection.failedAttempts * 10;
        
        // Add points for security features
        if (this.biometricSupport) score += 10;
        if (this.hardwareKeySupport) score += 10;
        if (window.twoFactorAuthManager?.get2FAStatus().enabled) score += 15;
        
        this.securityScore = Math.max(0, Math.min(100, score));
        
        // Update UI
        this.updateSecurityScoreUI();
    }

    // Update security score in UI
    updateSecurityScoreUI() {
        const scoreElement = document.getElementById('security-score');
        if (scoreElement) {
            scoreElement.textContent = this.securityScore;
            
            // Update color based on score
            scoreElement.className = scoreElement.className.replace(/text-\w+-\d+/, '');
            if (this.securityScore >= 80) {
                scoreElement.classList.add('text-green-500');
            } else if (this.securityScore >= 60) {
                scoreElement.classList.add('text-yellow-500');
            } else {
                scoreElement.classList.add('text-red-500');
            }
        }
    }

    // Update security UI with advanced features
    updateSecurityUI() {
        // Add advanced security status to dashboard
        this.addAdvancedSecurityWidget();
    }

    // Add advanced security widget
    addAdvancedSecurityWidget() {
        const securitySection = document.querySelector('.glass-effect'); // First glass effect section
        if (!securitySection) return;
        
        const advancedWidget = document.createElement('div');
        advancedWidget.className = 'mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl';
        advancedWidget.innerHTML = `
            <h3 class="text-lg font-semibold text-white mb-3">🛡️ Advanced Security</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-300">Security Score:</span>
                    <span id="security-score" class="font-bold ml-2">${this.securityScore}</span>
                </div>
                <div>
                    <span class="text-gray-300">Biometric:</span>
                    <span class="ml-2 ${this.biometricSupport ? 'text-green-400' : 'text-gray-500'}">
                        ${this.biometricSupport ? 'Available' : 'Not Available'}
                    </span>
                </div>
                <div>
                    <span class="text-gray-300">Hardware Keys:</span>
                    <span class="ml-2 ${this.hardwareKeySupport ? 'text-green-400' : 'text-gray-500'}">
                        ${this.hardwareKeySupport ? 'Supported' : 'Not Supported'}
                    </span>
                </div>
                <div>
                    <span class="text-gray-300">Threat Level:</span>
                    <span class="ml-2 text-green-400">Low</span>
                </div>
            </div>
            <div class="mt-3">
                <button onclick="window.advancedSecurity.showSecurityReport()" 
                        class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs">
                    View Security Report
                </button>
            </div>
        `;
        
        securitySection.appendChild(advancedWidget);
    }

    // Show detailed security report
    showSecurityReport() {
        const reportModal = document.createElement('div');
        reportModal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
        reportModal.innerHTML = `
            <div class="bg-gray-900 border border-gray-600 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-white">🛡️ Security Report</h2>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-gray-400 hover:text-white">✕</button>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-gray-800 rounded-lg p-4">
                        <h3 class="font-semibold text-white mb-2">Security Score: ${this.securityScore}/100</h3>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full" 
                                 style="width: ${this.securityScore}%"></div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-800 rounded-lg p-4">
                        <h3 class="font-semibold text-white mb-2">Device Security</h3>
                        <ul class="text-gray-300 text-sm space-y-1">
                            <li>Biometric Support: ${this.biometricSupport ? '✅ Available' : '❌ Not Available'}</li>
                            <li>Hardware Key Support: ${this.hardwareKeySupport ? '✅ Supported' : '❌ Not Supported'}</li>
                            <li>Device Fingerprint: ${this.threatDetection.deviceFingerprint.hash.substring(0, 16)}...</li>
                        </ul>
                    </div>
                    
                    <div class="bg-gray-800 rounded-lg p-4">
                        <h3 class="font-semibold text-white mb-2">Threat Detection</h3>
                        <ul class="text-gray-300 text-sm space-y-1">
                            <li>Suspicious Activities: ${this.threatDetection.suspiciousActivity.length}</li>
                            <li>Failed Attempts: ${this.threatDetection.failedAttempts}</li>
                            <li>Behavior Profile: Active</li>
                            <li>Anomaly Detection: Running</li>
                        </ul>
                    </div>
                    
                    <div class="bg-gray-800 rounded-lg p-4">
                        <h3 class="font-semibold text-white mb-2">Recent Activity</h3>
                        <div class="text-gray-300 text-sm">
                            ${this.threatDetection.suspiciousActivity.length > 0 ? 
                                this.threatDetection.suspiciousActivity.slice(-3).map(activity => 
                                    `<div class="mb-1">• ${new Date(activity.timestamp).toLocaleString()}: ${activity.type || 'Suspicious activity'}</div>`
                                ).join('') :
                                '<div>No suspicious activity detected</div>'
                            }
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 flex space-x-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Close
                    </button>
                    <button onclick="window.advancedSecurity.downloadSecurityReport()" 
                            class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        Download Report
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reportModal);
    }

    // Download security report
    downloadSecurityReport() {
        const report = {
            title: 'Agies Advanced Security Report',
            timestamp: new Date().toISOString(),
            securityScore: this.securityScore,
            deviceSecurity: {
                biometricSupport: this.biometricSupport,
                hardwareKeySupport: this.hardwareKeySupport,
                deviceFingerprint: this.threatDetection.deviceFingerprint
            },
            threatDetection: {
                suspiciousActivities: this.threatDetection.suspiciousActivity,
                failedAttempts: this.threatDetection.failedAttempts,
                behaviorProfile: this.threatDetection.behaviorProfile
            },
            recommendations: this.getSecurityRecommendations()
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agies-security-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Get security recommendations
    getSecurityRecommendations() {
        const recommendations = [];
        
        if (!this.biometricSupport) {
            recommendations.push('Consider using a device that supports biometric authentication for enhanced security');
        }
        
        if (!this.hardwareKeySupport) {
            recommendations.push('Upgrade to a modern browser that supports hardware security keys');
        }
        
        if (!window.twoFactorAuthManager?.get2FAStatus().enabled) {
            recommendations.push('Enable Two-Factor Authentication for an additional layer of security');
        }
        
        if (this.threatDetection.suspiciousActivity.length > 0) {
            recommendations.push('Review recent suspicious activities and consider changing your password');
        }
        
        if (this.securityScore < 80) {
            recommendations.push('Improve your security score by enabling additional security features');
        }
        
        return recommendations;
    }

    // Get advanced security status
    getSecurityStatus() {
        return {
            isInitialized: this.isInitialized,
            securityScore: this.securityScore,
            biometricSupport: this.biometricSupport,
            hardwareKeySupport: this.hardwareKeySupport,
            threatLevel: this.calculateCurrentThreatLevel(),
            recommendations: this.getSecurityRecommendations()
        };
    }

    // Calculate current threat level
    calculateCurrentThreatLevel() {
        if (this.threatDetection.suspiciousActivity.length > 3) return 'high';
        if (this.threatDetection.suspiciousActivity.length > 1) return 'medium';
        return 'low';
    }
}

// Initialize advanced security features
const advancedSecurity = new AdvancedSecurityFeatures();

// Export for global use
window.AdvancedSecurityFeatures = AdvancedSecurityFeatures;
window.advancedSecurity = advancedSecurity;

console.log('🛡️ Advanced Security Features Ready');
console.log('🔐 Biometric and hardware key support enabled');
console.log('🚨 Advanced threat detection active');
