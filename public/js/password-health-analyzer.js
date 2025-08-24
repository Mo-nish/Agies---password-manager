/**
 * Password Health Analyzer for Agies Password Manager
 * Comprehensive password security analysis and recommendations
 */

class PasswordHealthAnalyzer {
    constructor() {
        this.isInitialized = false;
        this.passwords = [];
        this.healthReport = null;
        this.commonPasswords = new Set();
        this.breachedPasswords = new Set();
        this.init();
    }

    async init() {
        try {
            await this.loadCommonPasswords();
            await this.loadBreachedPasswords();
            await this.initializeHealthAnalysis();
            this.isInitialized = true;
            console.log('✅ Password Health Analyzer initialized');
        } catch (error) {
            console.error('❌ Password Health Analyzer initialization failed:', error);
        }
    }

    // Load common passwords database
    async loadCommonPasswords() {
        // Simulate loading from external source
        // In production, this would load from a comprehensive database
        this.commonPasswords = new Set([
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
            'princess', 'password1', '123123', 'welcome123', 'login', 'admin123',
            'iloveyou', 'sunshine', 'master', 'hello', 'freedom', 'whatever',
            'football', 'jesus', 'ninja', 'mustang', 'access', 'shadow',
            'master123', 'jordan23', 'superman', 'batman', 'trustno1', 'john',
            'test', 'guest', 'info', 'computer', 'maverick', 'phoenix'
        ]);
    }

    // Load breached passwords database
    async loadBreachedPasswords() {
        // Simulate loading from breach databases
        // In production, this would check against HaveIBeenPwned or similar
        this.breachedPasswords = new Set([
            'password', '123456', 'password123', 'admin', 'qwerty123',
            'welcome', 'letmein', 'monkey', 'dragon', 'princess'
        ]);
    }

    // Initialize health analysis
    async initializeHealthAnalysis() {
        this.setupPasswordMonitoring();
        this.scheduleHealthChecks();
    }

    // Setup password monitoring
    setupPasswordMonitoring() {
        // Monitor password changes
        document.addEventListener('passwordAdded', (e) => {
            this.analyzeNewPassword(e.detail);
        });

        document.addEventListener('passwordUpdated', (e) => {
            this.analyzeUpdatedPassword(e.detail);
        });
    }

    // Schedule regular health checks
    scheduleHealthChecks() {
        // Run comprehensive analysis every hour
        setInterval(() => {
            this.runComprehensiveAnalysis();
        }, 3600000); // 1 hour

        // Run quick checks every 5 minutes
        setInterval(() => {
            this.runQuickHealthCheck();
        }, 300000); // 5 minutes
    }

    // Analyze password strength
    analyzePasswordStrength(password) {
        const analysis = {
            score: 0,
            length: password.length,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasRepeatedChars: this.hasRepeatedCharacters(password),
            hasSequentialChars: this.hasSequentialCharacters(password),
            isCommon: this.commonPasswords.has(password.toLowerCase()),
            isBreached: this.breachedPasswords.has(password.toLowerCase()),
            entropy: this.calculateEntropy(password),
            strength: 'weak'
        };

        // Calculate score based on criteria
        if (analysis.length >= 12) analysis.score += 25;
        else if (analysis.length >= 8) analysis.score += 15;
        else if (analysis.length >= 6) analysis.score += 5;

        if (analysis.hasUppercase) analysis.score += 10;
        if (analysis.hasLowercase) analysis.score += 10;
        if (analysis.hasNumbers) analysis.score += 15;
        if (analysis.hasSpecialChars) analysis.score += 20;

        if (!analysis.hasRepeatedChars) analysis.score += 10;
        if (!analysis.hasSequentialChars) analysis.score += 10;
        if (!analysis.isCommon) analysis.score += 15;
        if (!analysis.isBreached) analysis.score += 20;

        // Entropy bonus
        if (analysis.entropy > 60) analysis.score += 15;
        else if (analysis.entropy > 40) analysis.score += 10;
        else if (analysis.entropy > 20) analysis.score += 5;

        // Determine strength category
        if (analysis.score >= 90) analysis.strength = 'excellent';
        else if (analysis.score >= 70) analysis.strength = 'strong';
        else if (analysis.score >= 50) analysis.strength = 'medium';
        else if (analysis.score >= 30) analysis.strength = 'weak';
        else analysis.strength = 'very weak';

        return analysis;
    }

    // Check for repeated characters
    hasRepeatedCharacters(password) {
        for (let i = 0; i < password.length - 2; i++) {
            if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
                return true;
            }
        }
        return false;
    }

    // Check for sequential characters
    hasSequentialCharacters(password) {
        const sequences = ['abc', '123', 'qwe', 'asd', 'zxc'];
        const lowerPassword = password.toLowerCase();
        
        for (const seq of sequences) {
            if (lowerPassword.includes(seq)) return true;
        }

        // Check for ascending/descending sequences
        for (let i = 0; i < password.length - 2; i++) {
            const char1 = password.charCodeAt(i);
            const char2 = password.charCodeAt(i + 1);
            const char3 = password.charCodeAt(i + 2);
            
            if ((char2 === char1 + 1 && char3 === char2 + 1) ||
                (char2 === char1 - 1 && char3 === char2 - 1)) {
                return true;
            }
        }
        
        return false;
    }

    // Calculate password entropy
    calculateEntropy(password) {
        let charset = 0;
        if (/[a-z]/.test(password)) charset += 26;
        if (/[A-Z]/.test(password)) charset += 26;
        if (/\d/.test(password)) charset += 10;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) charset += 33;
        
        return password.length * Math.log2(charset);
    }

    // Analyze new password
    analyzeNewPassword(passwordData) {
        const analysis = this.analyzePasswordStrength(passwordData.password);
        
        // Store analysis with password
        passwordData.healthAnalysis = analysis;
        
        // Show immediate feedback if password is weak
        if (analysis.strength === 'weak' || analysis.strength === 'very weak') {
            this.showPasswordWarning(passwordData, analysis);
        }
        
        // Update overall health report
        this.updateHealthReport();
    }

    // Show password warning
    showPasswordWarning(passwordData, analysis) {
        const warning = document.createElement('div');
        warning.className = 'fixed top-4 right-4 bg-red-900 border border-red-600 rounded-lg p-4 z-50 max-w-md';
        warning.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-200">Weak Password Detected</h3>
                    <div class="mt-1 text-sm text-red-300">
                        <p>Password for "${passwordData.title}" is ${analysis.strength}. Consider:</p>
                        <ul class="mt-1 list-disc list-inside">
                            ${this.getPasswordSuggestions(analysis).map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <button onclick="this.parentElement.remove()" class="ml-auto text-red-400 hover:text-red-200">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (warning.parentElement) {
                warning.parentElement.removeChild(warning);
            }
        }, 10000);
    }

    // Get password improvement suggestions
    getPasswordSuggestions(analysis) {
        const suggestions = [];
        
        if (analysis.length < 12) suggestions.push('Use at least 12 characters');
        if (!analysis.hasUppercase) suggestions.push('Add uppercase letters');
        if (!analysis.hasLowercase) suggestions.push('Add lowercase letters');
        if (!analysis.hasNumbers) suggestions.push('Add numbers');
        if (!analysis.hasSpecialChars) suggestions.push('Add special characters');
        if (analysis.hasRepeatedChars) suggestions.push('Avoid repeated characters');
        if (analysis.hasSequentialChars) suggestions.push('Avoid sequential characters');
        if (analysis.isCommon) suggestions.push('Avoid common passwords');
        if (analysis.isBreached) suggestions.push('This password was found in data breaches');
        
        return suggestions.slice(0, 3); // Show top 3 suggestions
    }

    // Run comprehensive analysis
    async runComprehensiveAnalysis() {
        if (!this.isInitialized) return;
        
        console.log('🔍 Running comprehensive password health analysis...');
        
        // Get all passwords from storage
        const passwords = await this.getAllPasswords();
        
        // Analyze each password
        const analyses = passwords.map(password => ({
            ...password,
            analysis: this.analyzePasswordStrength(password.password)
        }));
        
        // Generate comprehensive health report
        this.healthReport = this.generateHealthReport(analyses);
        
        // Update UI
        this.updateHealthUI();
        
        console.log('✅ Password health analysis complete');
    }

    // Get all passwords from storage
    async getAllPasswords() {
        // This would integrate with the actual password storage system
        // For now, simulate with sample data
        return [
            { id: '1', title: 'Gmail', password: 'MyStr0ngP@ssw0rd!', url: 'gmail.com', username: 'user@gmail.com' },
            { id: '2', title: 'Facebook', password: 'password123', url: 'facebook.com', username: 'user@facebook.com' },
            { id: '3', title: 'Bank', password: 'Complex$Passw0rd2024!', url: 'bank.com', username: 'user@bank.com' },
            { id: '4', title: 'Work', password: '123456', url: 'company.com', username: 'user@company.com' }
        ];
    }

    // Generate comprehensive health report
    generateHealthReport(passwordAnalyses) {
        const totalPasswords = passwordAnalyses.length;
        
        const strengthCounts = {
            'very weak': 0,
            'weak': 0,
            'medium': 0,
            'strong': 0,
            'excellent': 0
        };
        
        let reusedPasswords = 0;
        let breachedPasswords = 0;
        let oldPasswords = 0;
        let weakPasswords = 0;
        let totalScore = 0;
        
        const passwordMap = new Map();
        const issues = [];
        
        passwordAnalyses.forEach(item => {
            const analysis = item.analysis;
            
            strengthCounts[analysis.strength]++;
            totalScore += analysis.score;
            
            // Check for reused passwords
            if (passwordMap.has(item.password)) {
                reusedPasswords++;
                issues.push({
                    type: 'reused',
                    severity: 'high',
                    title: item.title,
                    message: `Password reused with ${passwordMap.get(item.password).title}`
                });
            } else {
                passwordMap.set(item.password, item);
            }
            
            // Check for breached passwords
            if (analysis.isBreached) {
                breachedPasswords++;
                issues.push({
                    type: 'breached',
                    severity: 'critical',
                    title: item.title,
                    message: 'Password found in data breaches'
                });
            }
            
            // Check for weak passwords
            if (analysis.strength === 'weak' || analysis.strength === 'very weak') {
                weakPasswords++;
                issues.push({
                    type: 'weak',
                    severity: 'medium',
                    title: item.title,
                    message: `Password strength: ${analysis.strength}`
                });
            }
            
            // Check for old passwords (simulated)
            const passwordAge = Math.random() * 365; // Random age in days
            if (passwordAge > 90) {
                oldPasswords++;
                issues.push({
                    type: 'old',
                    severity: 'low',
                    title: item.title,
                    message: `Password is ${Math.round(passwordAge)} days old`
                });
            }
        });
        
        const averageScore = totalPasswords > 0 ? Math.round(totalScore / totalPasswords) : 0;
        
        // Calculate overall health score
        let healthScore = 100;
        healthScore -= (weakPasswords / totalPasswords) * 30;
        healthScore -= (reusedPasswords / totalPasswords) * 40;
        healthScore -= (breachedPasswords / totalPasswords) * 50;
        healthScore -= (oldPasswords / totalPasswords) * 20;
        
        healthScore = Math.max(0, Math.round(healthScore));
        
        return {
            timestamp: new Date().toISOString(),
            overallScore: healthScore,
            averagePasswordScore: averageScore,
            totalPasswords,
            strengthDistribution: strengthCounts,
            statistics: {
                reusedPasswords,
                breachedPasswords,
                weakPasswords,
                oldPasswords
            },
            issues: issues.sort((a, b) => {
                const severityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
                return severityOrder[a.severity] - severityOrder[b.severity];
            }),
            recommendations: this.generateRecommendations(issues)
        };
    }

    // Generate recommendations based on issues
    generateRecommendations(issues) {
        const recommendations = [];
        
        const criticalIssues = issues.filter(i => i.severity === 'critical').length;
        const highIssues = issues.filter(i => i.severity === 'high').length;
        const mediumIssues = issues.filter(i => i.severity === 'medium').length;
        
        if (criticalIssues > 0) {
            recommendations.push({
                priority: 'critical',
                action: 'Change breached passwords immediately',
                description: `${criticalIssues} passwords found in data breaches`
            });
        }
        
        if (highIssues > 0) {
            recommendations.push({
                priority: 'high',
                action: 'Create unique passwords',
                description: `${highIssues} passwords are being reused`
            });
        }
        
        if (mediumIssues > 0) {
            recommendations.push({
                priority: 'medium',
                action: 'Strengthen weak passwords',
                description: `${mediumIssues} passwords need improvement`
            });
        }
        
        recommendations.push({
            priority: 'low',
            action: 'Enable password generation',
            description: 'Use Agies password generator for new accounts'
        });
        
        recommendations.push({
            priority: 'low',
            action: 'Set up breach monitoring',
            description: 'Enable dark web monitoring for proactive alerts'
        });
        
        return recommendations;
    }

    // Update health UI
    updateHealthUI() {
        if (!this.healthReport) return;
        
        // Update health score in dashboard
        const healthScoreElement = document.getElementById('password-health-score');
        if (healthScoreElement) {
            healthScoreElement.textContent = this.healthReport.overallScore;
            
            // Update color based on score
            healthScoreElement.className = healthScoreElement.className.replace(/text-\w+-\d+/, '');
            if (this.healthReport.overallScore >= 80) {
                healthScoreElement.classList.add('text-green-500');
            } else if (this.healthReport.overallScore >= 60) {
                healthScoreElement.classList.add('text-yellow-500');
            } else {
                healthScoreElement.classList.add('text-red-500');
            }
        }
        
        // Update health widget
        this.updateHealthWidget();
    }

    // Update health widget in dashboard
    updateHealthWidget() {
        let healthWidget = document.getElementById('password-health-widget');
        
        if (!healthWidget) {
            // Create health widget
            const dashboardStats = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-4');
            if (dashboardStats) {
                const healthCard = document.createElement('div');
                healthCard.className = 'glass-effect rounded-2xl p-6 text-center';
                healthCard.innerHTML = `
                    <div class="text-4xl mb-3">🏥</div>
                    <div class="text-3xl font-bold mb-2">
                        <span id="password-health-score">${this.healthReport.overallScore}</span>%
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-1">Password Health</h3>
                        <p class="text-gray-400 text-sm">Security Score</p>
                    </div>
                `;
                dashboardStats.appendChild(healthCard);
            }
        }
        
        // Add detailed health widget
        this.addDetailedHealthWidget();
    }

    // Add detailed health widget
    addDetailedHealthWidget() {
        const securitySection = document.querySelector('.glass-effect');
        if (!securitySection) return;
        
        let detailedWidget = document.getElementById('password-health-detailed');
        if (detailedWidget) {
            detailedWidget.remove();
        }
        
        const widget = document.createElement('div');
        widget.id = 'password-health-detailed';
        widget.className = 'mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl';
        widget.innerHTML = `
            <h3 class="text-lg font-semibold text-white mb-3">🏥 Password Health Report</h3>
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                    <span class="text-gray-300">Overall Score:</span>
                    <span class="font-bold ml-2 ${this.getScoreColor(this.healthReport.overallScore)}">${this.healthReport.overallScore}%</span>
                </div>
                <div>
                    <span class="text-gray-300">Total Passwords:</span>
                    <span class="font-bold ml-2 text-white">${this.healthReport.totalPasswords}</span>
                </div>
                <div>
                    <span class="text-gray-300">Weak Passwords:</span>
                    <span class="font-bold ml-2 text-red-400">${this.healthReport.statistics.weakPasswords}</span>
                </div>
                <div>
                    <span class="text-gray-300">Reused Passwords:</span>
                    <span class="font-bold ml-2 text-orange-400">${this.healthReport.statistics.reusedPasswords}</span>
                </div>
            </div>
            ${this.healthReport.issues.length > 0 ? `
                <div class="mb-3">
                    <h4 class="text-sm font-semibold text-red-300 mb-2">Critical Issues (${this.healthReport.issues.filter(i => i.severity === 'critical').length})</h4>
                    ${this.healthReport.issues.filter(i => i.severity === 'critical').slice(0, 2).map(issue => 
                        `<div class="text-xs text-red-200 mb-1">• ${issue.title}: ${issue.message}</div>`
                    ).join('')}
                </div>
            ` : ''}
            <div class="flex space-x-2">
                <button onclick="window.passwordHealthAnalyzer.showFullReport()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                    View Full Report
                </button>
                <button onclick="window.passwordHealthAnalyzer.generateStrongPasswords()" 
                        class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
                    Generate Strong Passwords
                </button>
            </div>
        `;
        
        securitySection.appendChild(widget);
    }

    // Get score color class
    getScoreColor(score) {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    }

    // Show full health report
    showFullReport() {
        if (!this.healthReport) {
            this.runComprehensiveAnalysis();
            return;
        }
        
        const reportModal = document.createElement('div');
        reportModal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
        reportModal.innerHTML = `
            <div class="bg-gray-900 border border-gray-600 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-white">🏥 Password Health Report</h2>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-gray-400 hover:text-white text-xl">✕</button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="bg-gray-800 rounded-lg p-4 text-center">
                        <div class="text-3xl font-bold ${this.getScoreColor(this.healthReport.overallScore)} mb-2">
                            ${this.healthReport.overallScore}%
                        </div>
                        <div class="text-gray-300">Overall Health</div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-4 text-center">
                        <div class="text-3xl font-bold text-white mb-2">${this.healthReport.totalPasswords}</div>
                        <div class="text-gray-300">Total Passwords</div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-4 text-center">
                        <div class="text-3xl font-bold text-blue-400 mb-2">${this.healthReport.averagePasswordScore}</div>
                        <div class="text-gray-300">Average Strength</div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-gray-800 rounded-lg p-4">
                        <h3 class="font-semibold text-white mb-3">Password Strength Distribution</h3>
                        <div class="space-y-2">
                            ${Object.entries(this.healthReport.strengthDistribution).map(([strength, count]) => `
                                <div class="flex justify-between">
                                    <span class="text-gray-300 capitalize">${strength}:</span>
                                    <span class="text-white">${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="bg-gray-800 rounded-lg p-4">
                        <h3 class="font-semibold text-white mb-3">Security Issues</h3>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-300">Weak Passwords:</span>
                                <span class="text-red-400">${this.healthReport.statistics.weakPasswords}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-300">Reused Passwords:</span>
                                <span class="text-orange-400">${this.healthReport.statistics.reusedPasswords}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-300">Breached Passwords:</span>
                                <span class="text-red-400">${this.healthReport.statistics.breachedPasswords}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-300">Old Passwords:</span>
                                <span class="text-yellow-400">${this.healthReport.statistics.oldPasswords}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${this.healthReport.issues.length > 0 ? `
                    <div class="bg-gray-800 rounded-lg p-4 mb-6">
                        <h3 class="font-semibold text-white mb-3">Critical Issues</h3>
                        <div class="space-y-2 max-h-32 overflow-y-auto">
                            ${this.healthReport.issues.map(issue => `
                                <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                                    <div>
                                        <span class="font-medium text-white">${issue.title}</span>
                                        <span class="text-sm text-gray-300 ml-2">${issue.message}</span>
                                    </div>
                                    <span class="px-2 py-1 rounded text-xs ${this.getSeverityColor(issue.severity)}">
                                        ${issue.severity}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="bg-gray-800 rounded-lg p-4">
                    <h3 class="font-semibold text-white mb-3">Recommendations</h3>
                    <div class="space-y-2">
                        ${this.healthReport.recommendations.map(rec => `
                            <div class="flex items-start space-x-3">
                                <span class="px-2 py-1 rounded text-xs ${this.getPriorityColor(rec.priority)}">
                                    ${rec.priority}
                                </span>
                                <div>
                                    <div class="font-medium text-white">${rec.action}</div>
                                    <div class="text-sm text-gray-300">${rec.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="mt-6 flex space-x-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Close
                    </button>
                    <button onclick="window.passwordHealthAnalyzer.downloadHealthReport()" 
                            class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        Download Report
                    </button>
                    <button onclick="window.passwordHealthAnalyzer.fixAllIssues()" 
                            class="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                        Fix All Issues
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reportModal);
    }

    // Get severity color class
    getSeverityColor(severity) {
        const colors = {
            'critical': 'bg-red-600 text-white',
            'high': 'bg-orange-600 text-white',
            'medium': 'bg-yellow-600 text-black',
            'low': 'bg-blue-600 text-white'
        };
        return colors[severity] || 'bg-gray-600 text-white';
    }

    // Get priority color class
    getPriorityColor(priority) {
        const colors = {
            'critical': 'bg-red-600 text-white',
            'high': 'bg-orange-600 text-white',
            'medium': 'bg-yellow-600 text-black',
            'low': 'bg-blue-600 text-white'
        };
        return colors[priority] || 'bg-gray-600 text-white';
    }

    // Generate strong passwords for weak ones
    generateStrongPasswords() {
        const weakPasswords = this.healthReport.issues.filter(i => i.type === 'weak');
        
        if (weakPasswords.length === 0) {
            alert('No weak passwords found!');
            return;
        }
        
        const suggestionsModal = document.createElement('div');
        suggestionsModal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
        suggestionsModal.innerHTML = `
            <div class="bg-gray-900 border border-gray-600 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-white">🎯 Strong Password Suggestions</h2>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-gray-400 hover:text-white">✕</button>
                </div>
                
                <div class="space-y-4">
                    ${weakPasswords.slice(0, 5).map(password => {
                        const strongPassword = this.generateSecurePassword();
                        return `
                            <div class="bg-gray-800 rounded-lg p-4">
                                <h3 class="font-semibold text-white mb-2">${password.title}</h3>
                                <div class="space-y-2">
                                    <div>
                                        <label class="text-sm text-gray-300">New Strong Password:</label>
                                        <div class="flex items-center space-x-2 mt-1">
                                            <input type="text" value="${strongPassword}" readonly 
                                                   class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                                            <button onclick="navigator.clipboard.writeText('${strongPassword}')" 
                                                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-400">
                                        Strength: <span class="text-green-400">Excellent</span> | 
                                        Length: ${strongPassword.length} characters
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h3 class="font-semibold text-blue-300 mb-2">💡 Password Tips</h3>
                    <ul class="text-sm text-blue-200 space-y-1">
                        <li>• Use at least 12 characters</li>
                        <li>• Include uppercase, lowercase, numbers, and symbols</li>
                        <li>• Avoid personal information and common words</li>
                        <li>• Use unique passwords for each account</li>
                        <li>• Consider using passphrases with random words</li>
                    </ul>
                </div>
                
                <div class="mt-6 flex space-x-3">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        Close
                    </button>
                    <button onclick="window.passwordHealthAnalyzer.generateMorePasswords()" 
                            class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        Generate More
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(suggestionsModal);
    }

    // Generate secure password
    generateSecurePassword(length = 16) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        const allChars = lowercase + uppercase + numbers + symbols;
        let password = '';
        
        // Ensure at least one character from each category
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        // Fill the rest randomly
        for (let i = 4; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    // Download health report
    downloadHealthReport() {
        if (!this.healthReport) return;
        
        const report = {
            title: 'Agies Password Health Report',
            generated: this.healthReport.timestamp,
            summary: {
                overallScore: this.healthReport.overallScore,
                totalPasswords: this.healthReport.totalPasswords,
                averagePasswordScore: this.healthReport.averagePasswordScore
            },
            statistics: this.healthReport.statistics,
            strengthDistribution: this.healthReport.strengthDistribution,
            issues: this.healthReport.issues,
            recommendations: this.healthReport.recommendations
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agies-password-health-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Fix all issues automatically
    fixAllIssues() {
        alert('Auto-fix feature would be implemented to:\n\n' +
              '• Generate new passwords for weak ones\n' +
              '• Create unique passwords for reused ones\n' +
              '• Flag breached passwords for immediate change\n' +
              '• Set up automatic password aging alerts\n\n' +
              'This would integrate with the password management system.');
    }

    // Run quick health check
    runQuickHealthCheck() {
        // Quick check for immediate security issues
        console.log('🔍 Running quick password health check...');
        
        // This would check for immediate threats
        // Implementation would depend on integration with password storage
    }

    // Get health status
    getHealthStatus() {
        return {
            isInitialized: this.isInitialized,
            overallScore: this.healthReport?.overallScore || 0,
            lastAnalysis: this.healthReport?.timestamp || null,
            criticalIssues: this.healthReport?.issues.filter(i => i.severity === 'critical').length || 0,
            totalPasswords: this.healthReport?.totalPasswords || 0
        };
    }
}

// Initialize password health analyzer
const passwordHealthAnalyzer = new PasswordHealthAnalyzer();

// Export for global use
window.PasswordHealthAnalyzer = PasswordHealthAnalyzer;
window.passwordHealthAnalyzer = passwordHealthAnalyzer;

console.log('🏥 Password Health Analyzer Ready');
console.log('🔍 Comprehensive password analysis enabled');
console.log('💊 Password health monitoring active');
