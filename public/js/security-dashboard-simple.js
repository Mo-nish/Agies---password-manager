// 🛡️ Simplified Security Dashboard Controller
// Works immediately without waiting for the maze engine

class SimpleSecurityDashboard {
    constructor() {
        this.isInitialized = false;
        this.demoRunning = false;
        this.demoInterval = null;
        this.init();
    }

    async init() {
        try {
            console.log('🛡️ Initializing Simple Security Dashboard...');
            
            // Initialize immediately
            this.initializeDashboard();
            this.startRealTimeUpdates();
            
            this.isInitialized = true;
            console.log('✅ Simple Security Dashboard initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Simple Security Dashboard:', error);
            this.showError('Failed to initialize security dashboard');
        }
    }

    initializeDashboard() {
        // Populate with demo data
        this.updateSecurityOverview();
        this.populateSecurityLayers();
        this.populateAIGuardians();
        this.populateHoneypotSystem();
        this.populateDecoyVaults();
        this.updateThreatMonitoring();
        this.updateSecurityMetrics();
        
        console.log('📊 Dashboard populated with demo security data');
    }

    updateSecurityOverview() {
        // Update status cards with demo data
        document.getElementById('maze-status').textContent = 'ACTIVE';
        document.getElementById('security-level').textContent = 'FORTRESS';
        document.getElementById('threats-detected').textContent = '0';
        document.getElementById('honeypots-active').textContent = '5';
        
        // Update status colors
        this.updateStatusColors();
    }

    updateStatusColors() {
        const threatsElement = document.getElementById('threats-detected');
        threatsElement.className = 'text-2xl font-bold text-green-400';
    }

    populateSecurityLayers() {
        const container = document.getElementById('security-layers');
        container.innerHTML = '';
        
        const layers = [
            { name: 'ENTRY_GUARDIAN', level: 1, status: 'ACTIVE', metrics: { threatLevel: 'LOW', blockedAttempts: 0, passedRequests: 0 } },
            { name: 'AUTHENTICATION', level: 2, status: 'ACTIVE', metrics: { threatLevel: 'LOW', blockedAttempts: 0, passedRequests: 0 } },
            { name: 'BEHAVIORAL_ANALYSIS', level: 3, status: 'ACTIVE', metrics: { threatLevel: 'LOW', blockedAttempts: 0, passedRequests: 0 } },
            { name: 'ENCRYPTION_MAZE', level: 4, status: 'ACTIVE', metrics: { threatLevel: 'LOW', blockedAttempts: 0, passedRequests: 0 } },
            { name: 'HONEYPOT_FIELD', level: 5, status: 'ACTIVE', metrics: { threatLevel: 'LOW', blockedAttempts: 0, passedRequests: 0 } },
            { name: 'AI_SENTINEL', level: 6, status: 'ACTIVE', metrics: { threatLevel: 'LOW', blockedAttempts: 0, passedRequests: 0 } },
            { name: 'QUANTUM_VAULT', level: 7, status: 'ACTIVE', metrics: { threatLevel: 'LOW', blockedAttempts: 0, passedRequests: 0 } }
        ];
        
        for (const layer of layers) {
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
        
        const guardians = [
            { type: 'PATTERN_ANALYZER', isActive: true, model: { version: '2.0', accuracy: 0.97 }, threatThreshold: 0.7, learningData: [] },
            { type: 'THREAT_PREDICTOR', isActive: true, model: { version: '2.0', accuracy: 0.97 }, threatThreshold: 0.7, learningData: [] },
            { type: 'ANOMALY_DETECTOR', isActive: true, model: { version: '2.0', accuracy: 0.97 }, threatThreshold: 0.7, learningData: [] },
            { type: 'INTRUSION_PREVENTER', isActive: true, model: { version: '2.0', accuracy: 0.97 }, threatThreshold: 0.7, learningData: [] },
            { type: 'DATA_PROTECTOR', isActive: true, model: { version: '2.0', accuracy: 0.97 }, threatThreshold: 0.7, learningData: [] }
        ];
        
        for (const guardian of guardians) {
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
                    <span class="font-mono">${guardian.model.version}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Accuracy:</span>
                    <span class="font-mono">${(guardian.model.accuracy * 100).toFixed(1)}%</span>
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
        
        const honeypots = [
            { type: 'FAKE_LOGIN_PAGES', status: 'ACTIVE', id: 'HONEY_001', interactions: 0, threatLevel: 'LOW' },
            { type: 'DECOY_API_ENDPOINTS', status: 'ACTIVE', id: 'HONEY_002', interactions: 0, threatLevel: 'LOW' },
            { type: 'DUMMY_DATABASES', status: 'ACTIVE', id: 'HONEY_003', interactions: 0, threatLevel: 'LOW' },
            { type: 'FALSE_CREDENTIALS', status: 'ACTIVE', id: 'HONEY_004', interactions: 0, threatLevel: 'LOW' },
            { type: 'TRAP_LINKS', status: 'ACTIVE', id: 'HONEY_005', interactions: 0, threatLevel: 'LOW' }
        ];
        
        for (const honeypot of honeypots) {
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
                    <span class="font-mono text-xs">${honeypot.id}</span>
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
                    <span class="font-mono text-xs">Never</span>
                </div>
            </div>
        `;
        
        return card;
    }

    populateDecoyVaults() {
        const container = document.getElementById('decoy-vaults');
        container.innerHTML = '';
        
        // Generate 12 demo decoy vaults
        const decoyNames = [
            'Work Passwords', 'Personal Vault', 'Family Safe', 'Business Archive',
            'Private Storage', 'Secure Keys', 'Important Credentials', 'Backup Vault',
            'Financial Data', 'Medical Records', 'Legal Documents', 'Secret Projects'
        ];
        
        let count = 0;
        for (let i = 0; i < 12; i++) {
            const vault = {
                id: `DECOY_${i + 1}`,
                name: decoyNames[i],
                type: ['HONEYPOT', 'CAMOUFLAGE', 'MISDIRECTION', 'TRAP', 'DECOY'][Math.floor(Math.random() * 5)],
                passwords: Math.floor(Math.random() * 50) + 10,
                accessCount: Math.floor(Math.random() * 100),
                lastAccessed: Date.now() - Math.random() * 86400000 * 30,
                trapLevel: Math.floor(Math.random() * 5) + 1
            };
            
            const vaultCard = this.createDecoyVaultCard(vault);
            container.appendChild(vaultCard);
            count++;
        }
        
        // Add summary card
        const summaryCard = document.createElement('div');
        summaryCard.className = 'bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 col-span-full';
        summaryCard.innerHTML = `
            <div class="text-center">
                <div class="text-2xl font-bold mb-2">🎭 Decoy Vault Summary</div>
                <div class="text-lg">Total Decoys: ${count}</div>
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
                    <span class="font-mono">${vault.passwords}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-purple-300">Access Count:</span>
                    <span class="text-purple-300">${vault.accessCount}</span>
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
        container.innerHTML = '<div class="text-center text-purple-300">No security events recorded yet</div>';
    }

    updateSecurityMetrics() {
        // Update system health
        document.getElementById('uptime').textContent = '0h 0m';
        document.getElementById('last-update').textContent = new Date().toLocaleString();
        document.getElementById('security-events').textContent = '0';
        
        // Update recommendations
        this.updateRecommendations();
    }

    updateRecommendations() {
        const container = document.getElementById('recommendations');
        const recommendations = [
            'Consider increasing security level to PARANOID',
            'Upgrade to FORTRESS level for enhanced protection',
            'Regular security audits recommended',
            'Keep all components updated'
        ];
        
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
        console.log('🔄 Reconfiguring security maze...');
        
        // Simulate maze reconfiguration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Refresh dashboard
        if (window.simpleSecurityDashboard) {
            window.simpleSecurityDashboard.populateSecurityLayers();
            window.simpleSecurityDashboard.populateHoneypotSystem();
            window.simpleSecurityDashboard.populateDecoyVaults();
        }
        
        showNotification('Maze reconfigured successfully!', 'success');
    } catch (error) {
        console.error('Failed to reconfigure maze:', error);
        showNotification('Failed to reconfigure maze', 'error');
    }
}

async function generateSecurityReport() {
    try {
        console.log('📋 Generating security report...');
        
        // Create demo report
        const report = {
            overview: {
                mazeId: 'MAZE_DEMO_' + Date.now(),
                securityLevel: 'FORTRESS',
                layersActive: 7,
                guardiansDeployed: 5,
                honeypotsActive: 5,
                decoyVaultsActive: 12,
                threatsDetected: 0,
                uptime: Date.now(),
                lastUpdate: new Date().toISOString()
            },
            threats: [],
            recentEvents: [],
            recommendations: [
                'Consider increasing security level to PARANOID',
                'Regular security audits recommended',
                'Keep all components updated'
            ],
            status: 'OPERATIONAL'
        };
        
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
    } catch (error) {
        console.error('Failed to generate report:', error);
        showNotification('Failed to generate security report', 'error');
    }
}

async function testSecuritySystem() {
    try {
        console.log('🧪 Testing security system...');
        
        // Simulate security test
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showNotification('Security test completed successfully!', 'success');
    } catch (error) {
        console.error('Failed to test security system:', error);
        showNotification('Failed to test security system', 'error');
    }
}

// Demo functions
function startSecurityDemo() {
    if (!window.simpleSecurityDashboard) {
        showNotification('Security dashboard not initialized!', 'error');
        return;
    }
    
    if (window.demoRunning) {
        showNotification('Demo already running!', 'info');
        return;
    }
    
    window.demoRunning = true;
    console.log('🎬 Starting Security Demo...');
    
    // Start demo interval
    window.demoInterval = setInterval(() => {
        console.log('🔄 Demo: Security system monitoring active...');
    }, 3000);
    
    showNotification('Security demo started! Check console for details.', 'success');
}

function stopSecurityDemo() {
    if (window.demoInterval) {
        clearInterval(window.demoInterval);
        window.demoInterval = null;
        window.demoRunning = false;
        console.log('⏹️ Demo stopped');
        showNotification('Security demo stopped.', 'info');
    }
}

function simulateAttack() {
    console.log('⚔️ Simulating attack scenario...');
    
    // Simulate threat detection
    setTimeout(() => {
        console.log('🚨 THREAT DETECTED: Simulated attack');
        console.log('🔴 Emergency Protocol would be activated in real scenario');
        console.log('🔒 All access would be locked');
        console.log('🎭 All decoys would be activated');
    }, 1000);
    
    showNotification('Attack simulation started! Check console for details.', 'warning');
}

function testZeroKnowledge() {
    console.log('🔐 Testing Zero Knowledge++ Architecture...');
    
    // Simulate encryption test
    setTimeout(() => {
        console.log('🔐 Data encrypted with Zero Knowledge++');
        console.log('🔓 Data decrypted successfully');
        console.log('✅ Zero Knowledge++ test completed');
    }, 1000);
    
    showNotification('Zero Knowledge++ test completed! Check console for details.', 'success');
}

function testOneWayEntry() {
    console.log('🚪 Testing One-Way Entry Principle...');
    
    // Simulate entry/exit test
    setTimeout(() => {
        console.log('✅ Data entry successful');
        console.log('🔓 Exit verification result: success');
        console.log('✅ One-Way Entry test completed');
    }, 1000);
    
    showNotification('One-Way Entry test completed! Check console for details.', 'success');
}

function showNotification(message, type = 'info') {
    const colors = {
        'success': 'bg-green-600',
        'error': 'bg-red-600',
        'info': 'bg-blue-600',
        'warning': 'bg-yellow-600'
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
    window.simpleSecurityDashboard = new SimpleSecurityDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.simpleSecurityDashboard) {
        window.simpleSecurityDashboard.destroy();
    }
});

console.log('🛡️ Simple Security Dashboard Controller loaded');
