// 🛡️ Agies Security Dashboard Controller
// Interfaces with the Chakravyuham Maze Engine to display real-time security information

class SecurityDashboard {
    constructor() {
        this.mazeEngine = null;
        this.updateInterval = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🛡️ Initializing Security Dashboard...');
            
            // Wait for the maze engine to be available
            await this.waitForMazeEngine();
            
            // Initialize dashboard
            await this.initializeDashboard();
            
            // Start real-time updates
            this.startRealTimeUpdates();
            
            this.isInitialized = true;
            console.log('✅ Security Dashboard initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Security Dashboard:', error);
            this.showError('Failed to initialize security dashboard');
        }
    }

    async waitForMazeEngine() {
        let attempts = 0;
        const maxAttempts = 50; // Wait up to 5 seconds
        
        while (!window.agiesChakravyuham && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.agiesChakravyuham) {
            throw new Error('Chakravyuham Maze Engine not found');
        }
        
        this.mazeEngine = window.agiesChakravyuham;
        console.log('🔗 Connected to Chakravyuham Maze Engine');
    }

    async initializeDashboard() {
        // Wait for maze engine to fully initialize
        while (!this.mazeEngine.isInitialized) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Populate all sections
        this.updateSecurityOverview();
        this.populateSecurityLayers();
        this.populateAIGuardians();
        this.populateHoneypotSystem();
        this.populateDecoyVaults();
        this.updateThreatMonitoring();
        this.updateSecurityMetrics();
        
        console.log('📊 Dashboard populated with security data');
    }

    updateSecurityOverview() {
        const metrics = this.mazeEngine.getSecurityMetrics();
        
        // Update status cards
        document.getElementById('maze-status').textContent = this.mazeEngine.isInitialized ? 'ACTIVE' : 'INITIALIZING';
        document.getElementById('security-level').textContent = metrics.securityLevel;
        document.getElementById('threats-detected').textContent = metrics.threatsDetected;
        document.getElementById('honeypots-active').textContent = metrics.honeypotsActive;
        
        // Update status colors based on values
        this.updateStatusColors();
    }

    updateStatusColors() {
        const threatsElement = document.getElementById('threats-detected');
        const threats = parseInt(threatsElement.textContent);
        
        if (threats === 0) {
            threatsElement.className = 'text-2xl font-bold text-green-400';
        } else if (threats < 5) {
            threatsElement.className = 'text-2xl font-bold text-yellow-400';
        } else {
            threatsElement.className = 'text-2xl font-bold text-red-400';
        }
    }

    populateSecurityLayers() {
        const container = document.getElementById('security-layers');
        container.innerHTML = '';
        
        for (const [name, layer] of this.mazeEngine.layers) {
            const layerCard = this.createLayerCard(layer);
            container.appendChild(layerCard);
        }
    }

    createLayerCard(layer) {
        const card = document.createElement('div');
        card.className = 'bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30';
        
        const statusColor = layer.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400';
        const threatLevelColor = this.getThreatLevelColor(layer.metrics.threatLevel);
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">${layer.name}</h4>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor} bg-black/20">
                    ${layer.status}
                </span>
            </div>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-purple-300">Level:</span>
                    <span class="font-mono">${layer.level}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Threat Level:</span>
                    <span class="font-mono ${threatLevelColor}">${layer.metrics.threatLevel}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Blocked:</span>
                    <span class="font-mono">${layer.metrics.blockedAttempts}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Passed:</span>
                    <span class="font-mono">${layer.metrics.passedRequests}</span>
                </div>
            </div>
        `;
        
        return card;
    }

    getThreatLevelColor(level) {
        if (level === 'LOW') return 'text-green-400';
        if (level === 'MEDIUM') return 'text-yellow-400';
        if (level === 'HIGH') return 'text-red-400';
        return 'text-purple-400';
    }

    populateAIGuardians() {
        const container = document.getElementById('ai-guardians');
        container.innerHTML = '';
        
        for (const [type, guardian] of this.mazeEngine.guardians) {
            const guardianCard = this.createGuardianCard(guardian);
            container.appendChild(guardianCard);
        }
    }

    createGuardianCard(guardian) {
        const card = document.createElement('div');
        card.className = 'bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30';
        
        const statusColor = guardian.isActive ? 'text-green-400' : 'text-red-400';
        const statusText = guardian.isActive ? 'ACTIVE' : 'INACTIVE';
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">${guardian.type}</h4>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor} bg-black/20">
                    ${statusText}
                </span>
            </div>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-purple-300">Model Version:</span>
                    <span class="font-mono">${guardian.model?.version || 'N/A'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Accuracy:</span>
                    <span class="font-mono">${guardian.model?.accuracy ? (guardian.model.accuracy * 100).toFixed(1) + '%' : 'N/A'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Threshold:</span>
                    <span class="font-mono">${(guardian.threatThreshold * 100).toFixed(0)}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Learning Data:</span>
                    <span class="font-mono">${guardian.learningData.length}</span>
                </div>
            </div>
        `;
        
        return card;
    }

    populateHoneypotSystem() {
        const container = document.getElementById('honeypot-system');
        container.innerHTML = '';
        
        for (const [type, honeypot] of this.mazeEngine.honeypots) {
            const honeypotCard = this.createHoneypotCard(honeypot);
            container.appendChild(honeypotCard);
        }
    }

    createHoneypotCard(honeypot) {
        const card = document.createElement('div');
        card.className = 'bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30';
        
        const statusColor = honeypot.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400';
        const threatColor = this.getThreatLevelColor(honeypot.threatLevel);
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">${honeypot.type}</h4>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor} bg-black/20">
                    ${honeypot.status}
                </span>
            </div>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-purple-300">ID:</span>
                    <span class="font-mono text-xs">${honeypot.id.substring(0, 8)}...</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Interactions:</span>
                    <span class="font-mono">${honeypot.interactions}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Threat Level:</span>
                    <span class="font-mono ${threatColor}">${honeypot.threatLevel}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Last Triggered:</span>
                    <span class="font-mono text-xs">${honeypot.lastTriggered ? new Date(honeypot.lastTriggered).toLocaleTimeString() : 'Never'}</span>
                </div>
            </div>
        `;
        
        return card;
    }

    populateDecoyVaults() {
        const container = document.getElementById('decoy-vaults');
        container.innerHTML = '';
        
        let count = 0;
        for (const [id, vault] of this.mazeEngine.decoyVaults) {
            if (count >= 12) break; // Show only first 12 for performance
            
            const vaultCard = this.createDecoyVaultCard(vault);
            container.appendChild(vaultCard);
            count++;
        }
        
        // Add a summary card
        const summaryCard = document.createElement('div');
        summaryCard.className = 'bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 col-span-full';
        summaryCard.innerHTML = `
            <div class="text-center">
                <div class="text-2xl font-bold mb-2">🎭 Decoy Vault Summary</div>
                <div class="text-lg">Total Decoys: ${this.mazeEngine.decoyVaults.size}</div>
                <div class="text-sm text-purple-200">Showing first 12 decoys for performance</div>
            </div>
        `;
        container.appendChild(summaryCard);
    }

    createDecoyVaultCard(vault) {
        const card = document.createElement('div');
        card.className = 'bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30';
        
        const typeColor = this.getDecoyTypeColor(vault.type);
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">${vault.name}</h4>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${typeColor} bg-black/20">
                    ${vault.type}
                </span>
            </div>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-purple-300">Passwords:</span>
                    <span class="font-mono">${vault.passwords.length}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Access Count:</span>
                    <span class="font-mono">${vault.accessCount}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Last Accessed:</span>
                    <span class="font-mono text-xs">${new Date(vault.lastAccessed).toLocaleDateString()}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Trap Level:</span>
                    <span class="font-mono">${vault.trapLevel}/5</span>
                </div>
            </div>
        `;
        
        return card;
    }

    getDecoyTypeColor(type) {
        const colors = {
            'HONEYPOT': 'text-red-400',
            'CAMOUFLAGE': 'text-blue-400',
            'MISDIRECTION': 'text-yellow-400',
            'TRAP': 'text-purple-400',
            'DECOY': 'text-green-400'
        };
        return colors[type] || 'text-gray-400';
    }

    updateThreatMonitoring() {
        // Update status indicators
        document.getElementById('dark-web-status').textContent = 'ACTIVE';
        document.getElementById('behavioral-status').textContent = 'ACTIVE';
        document.getElementById('ai-sentinel-status').textContent = 'ACTIVE';
        
        // Update threat log
        this.updateThreatLog();
    }

    updateThreatLog() {
        const container = document.getElementById('threat-log');
        const events = JSON.parse(localStorage.getItem('agies_security_events') || '[]');
        
        if (events.length === 0) {
            container.innerHTML = '<div class="text-center text-purple-300">No security events recorded yet</div>';
            return;
        }
        
        // Show last 20 events
        const recentEvents = events.slice(-20).reverse();
        container.innerHTML = '';
        
        recentEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'mb-2 p-2 rounded bg-black/20 border-l-4 border-purple-500';
            
            const levelColor = this.getEventLevelColor(event.level);
            
            eventElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="font-semibold ${levelColor}">${event.type}</div>
                        <div class="text-sm text-purple-200">${event.message}</div>
                    </div>
                    <div class="text-xs text-purple-300 ml-2">
                        ${new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                </div>
            `;
            
            container.appendChild(eventElement);
        });
    }

    getEventLevelColor(level) {
        const colors = {
            'INFO': 'text-blue-400',
            'MEDIUM': 'text-yellow-400',
            'HIGH': 'text-orange-400',
            'CRITICAL': 'text-red-400'
        };
        return colors[level] || 'text-purple-400';
    }

    updateSecurityMetrics() {
        const metrics = this.mazeEngine.getSecurityMetrics();
        
        // Update system health
        const uptimeMs = metrics.uptime;
        const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
        const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('uptime').textContent = `${uptimeHours}h ${uptimeMinutes}m`;
        document.getElementById('last-update').textContent = new Date(metrics.lastUpdate).toLocaleString();
        
        const events = JSON.parse(localStorage.getItem('agies_security_events') || '[]');
        document.getElementById('security-events').textContent = events.length;
        
        // Update recommendations
        this.updateRecommendations();
    }

    updateRecommendations() {
        const container = document.getElementById('recommendations');
        const recommendations = this.mazeEngine.generateRecommendations();
        
        container.innerHTML = '';
        recommendations.forEach(rec => {
            const recElement = document.createElement('div');
            recElement.className = 'flex items-start space-x-2 text-sm';
            recElement.innerHTML = `
                <span class="text-green-400 mt-1">•</span>
                <span>${rec}</span>
            `;
            container.appendChild(recElement);
        });
    }

    startRealTimeUpdates() {
        // Update dashboard every 5 seconds
        this.updateInterval = setInterval(() => {
            if (this.isInitialized) {
                this.updateSecurityOverview();
                this.updateThreatLog();
                this.updateSecurityMetrics();
            }
        }, 5000);
        
        console.log('🔄 Real-time updates started');
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    // Cleanup
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Global functions for button interactions
function toggleDecoyVaults() {
    const container = document.getElementById('decoy-vaults');
    const button = document.getElementById('decoy-toggle-text');
    
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        button.textContent = 'Hide Decoy Vaults';
    } else {
        container.classList.add('hidden');
        button.textContent = 'Show Decoy Vaults';
    }
}

async function reconfigureMaze() {
    try {
        if (window.agiesChakravyuham) {
            await window.agiesChakravyuham.reconfigureMaze();
            
            // Refresh dashboard
            if (window.securityDashboard) {
                window.securityDashboard.populateSecurityLayers();
                window.securityDashboard.populateHoneypotSystem();
                window.securityDashboard.populateDecoyVaults();
            }
            
            showNotification('Maze reconfigured successfully!', 'success');
        }
    } catch (error) {
        console.error('Failed to reconfigure maze:', error);
        showNotification('Failed to reconfigure maze', 'error');
    }
}

async function generateSecurityReport() {
    try {
        if (window.agiesChakravyuham) {
            const report = window.agiesChakravyuham.generateSecurityReport();
            
            // Create downloadable report
            const reportText = JSON.stringify(report, null, 2);
            const blob = new Blob([reportText], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `agies-security-report-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            showNotification('Security report generated and downloaded!', 'success');
        }
    } catch (error) {
        console.error('Failed to generate report:', error);
        showNotification('Failed to generate security report', 'error');
    }
}

async function testSecuritySystem() {
    try {
        if (window.agiesChakravyuham) {
            // Simulate a threat to test the system
            const testData = {
                url: 'https://test-malicious-site.com',
                userAgent: 'Test Bot',
                timestamp: Date.now()
            };
            
            // Trigger threat detection
            const prediction = {
                threatScore: 0.8,
                confidence: 0.9,
                classification: 'THREAT'
            };
            
            await window.agiesChakravyuham.handleThreatDetection(prediction, 'TEST_SYSTEM');
            
            showNotification('Security test completed! Check threat log for details.', 'success');
            
            // Refresh threat log
            if (window.securityDashboard) {
                window.securityDashboard.updateThreatLog();
            }
        }
    } catch (error) {
        console.error('Failed to test security system:', error);
        showNotification('Failed to test security system', 'error');
    }
}

function showNotification(message, type = 'info') {
    const colors = {
        'success': 'bg-green-600',
        'error': 'bg-red-600',
        'info': 'bg-blue-600'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.securityDashboard = new SecurityDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.securityDashboard) {
        window.securityDashboard.destroy();
    }
});

console.log('🛡️ Security Dashboard Controller loaded');
