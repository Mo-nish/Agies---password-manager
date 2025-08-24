// 🧪 Security Demo Script
// Demonstrates the Chakravyuham Maze Engine features

class SecurityDemo {
    constructor() {
        this.mazeEngine = null;
        this.demoInterval = null;
        this.init();
    }

    async init() {
        console.log('🧪 Initializing Security Demo...');
        
        // Wait for maze engine
        await this.waitForMazeEngine();
        
        // Start demo
        this.startDemo();
    }

    async waitForMazeEngine() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.agiesChakravyuham && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.agiesChakravyuham) {
            throw new Error('Chakravyuham Maze Engine not found');
        }
        
        this.mazeEngine = window.agiesChakravyuham;
        console.log('🔗 Connected to Maze Engine for demo');
    }

    startDemo() {
        console.log('🎬 Starting Security Demo...');
        
        // Run different demo scenarios
        this.demoInterval = setInterval(() => {
            this.runRandomDemo();
        }, 10000); // Every 10 seconds
        
        // Run initial demos
        setTimeout(() => this.demoThreatDetection(), 2000);
        setTimeout(() => this.demoHoneypotSystem(), 5000);
        setTimeout(() => this.demoAIGuardians(), 8000);
    }

    runRandomDemo() {
        const demos = [
            () => this.demoThreatDetection(),
            () => this.demoHoneypotSystem(),
            () => this.demoAIGuardians(),
            () => this.demoDecoyVaults(),
            () => this.demoMazeReconfiguration()
        ];
        
        const randomDemo = demos[Math.floor(Math.random() * demos.length)];
        randomDemo();
    }

    async demoThreatDetection() {
        console.log('🚨 Demo: Threat Detection');
        
        // Simulate different threat levels
        const threats = [
            { score: 0.3, type: 'LOW_THREAT', source: 'Demo System' },
            { score: 0.6, type: 'MEDIUM_THREAT', source: 'Demo System' },
            { score: 0.9, type: 'HIGH_THREAT', source: 'Demo System' }
        ];
        
        for (const threat of threats) {
            const prediction = {
                threatScore: threat.score,
                confidence: 0.8 + Math.random() * 0.2,
                classification: threat.score > 0.7 ? 'THREAT' : 'SAFE'
            };
            
            await this.mazeEngine.handleThreatDetection(prediction, threat.source);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    async demoHoneypotSystem() {
        console.log('🎭 Demo: Honeypot System');
        
        // Simulate honeypot interactions
        for (const [type, honeypot] of this.mazeEngine.honeypots) {
            if (Math.random() < 0.3) { // 30% chance to trigger
                honeypot.interactions++;
                honeypot.lastTriggered = Date.now();
                honeypot.threatLevel = this.getRandomThreatLevel();
                
                console.log(`🎭 Honeypot ${type} triggered! Interactions: ${honeypot.interactions}`);
            }
        }
    }

    async demoAIGuardians() {
        console.log('🤖 Demo: AI Guardian System');
        
        // Simulate AI guardian learning
        for (const [type, guardian] of this.mazeEngine.guardians) {
            // Add some learning data
            const newData = {
                timestamp: Date.now(),
                source: 'Demo System',
                pattern: Math.random(),
                threat: Math.random() > 0.5
            };
            
            guardian.learningData.push(newData);
            
            // Simulate model updates
            if (guardian.learningData.length > 50) {
                console.log(`🤖 ${type} has enough data for retraining`);
            }
        }
    }

    async demoDecoyVaults() {
        console.log('🎭 Demo: Decoy Vault System');
        
        // Simulate decoy vault access
        let accessCount = 0;
        for (const [id, vault] of this.mazeEngine.decoyVaults) {
            if (Math.random() < 0.1) { // 10% chance to access
                vault.accessCount++;
                vault.lastAccessed = Date.now();
                accessCount++;
            }
        }
        
        if (accessCount > 0) {
            console.log(`🎭 ${accessCount} decoy vaults accessed by potential attackers`);
        }
    }

    async demoMazeReconfiguration() {
        console.log('🔄 Demo: Maze Reconfiguration');
        
        // Simulate maze changes
        await this.mazeEngine.reconfigureMaze();
        
        // Update some layer configurations
        for (const [name, layer] of this.mazeEngine.layers) {
            if (Math.random() < 0.2) { // 20% chance to update
                layer.metrics.threatLevel = this.getRandomThreatLevel();
                layer.lastCheck = Date.now();
            }
        }
    }

    getRandomThreatLevel() {
        const levels = ['LOW', 'MEDIUM', 'HIGH'];
        return levels[Math.floor(Math.random() * levels.length)];
    }

    // Interactive demo functions
    simulateAttack() {
        console.log('⚔️ Simulating attack scenario...');
        
        // Create a high-threat scenario
        const attackPrediction = {
            threatScore: 0.95,
            confidence: 0.98,
            classification: 'THREAT'
        };
        
        this.mazeEngine.handleThreatDetection(attackPrediction, 'Simulated Attack');
        
        // Show emergency protocol activation
        setTimeout(() => {
            console.log('🔴 Emergency Protocol would be activated in real scenario');
            console.log('🔒 All access would be locked');
            console.log('🎭 All decoys would be activated');
        }, 2000);
    }

    testZeroKnowledge() {
        console.log('🔐 Testing Zero Knowledge++ Architecture...');
        
        const zeroKnowledge = this.mazeEngine.implementZeroKnowledgePlus();
        
        // Test encryption
        const testData = 'Sensitive password data';
        const userKey = 'user-secret-key';
        
        const encrypted = zeroKnowledge.encrypt(testData, userKey);
        console.log('🔐 Data encrypted with Zero Knowledge++');
        
        // Test decryption
        const decrypted = zeroKnowledge.decrypt(encrypted, userKey);
        console.log('🔓 Data decrypted successfully');
        
        console.log('✅ Zero Knowledge++ test completed');
    }

    testOneWayEntry() {
        console.log('🚪 Testing One-Way Entry Principle...');
        
        const oneWayEntry = this.mazeEngine.implementOneWayEntry();
        
        // Test easy entry
        const entryResult = oneWayEntry.allowEntry('New password data');
        console.log('✅ Data entry successful:', entryResult);
        
        // Test complex exit
        oneWayEntry.requireExit({ user: 'demo', operation: 'extract' })
            .then(result => {
                console.log('🔓 Exit verification result:', result);
            })
            .catch(error => {
                console.log('❌ Exit verification failed:', error);
            });
    }

    // Cleanup
    destroy() {
        if (this.demoInterval) {
            clearInterval(this.demoInterval);
        }
        console.log('🧪 Security Demo stopped');
    }
}

// Global demo functions
function startSecurityDemo() {
    if (!window.securityDemo) {
        window.securityDemo = new SecurityDemo();
        showNotification('Security demo started! Check console for details.', 'success');
    } else {
        showNotification('Security demo already running!', 'info');
    }
}

function stopSecurityDemo() {
    if (window.securityDemo) {
        window.securityDemo.destroy();
        window.securityDemo = null;
        showNotification('Security demo stopped.', 'info');
    }
}

function simulateAttack() {
    if (window.securityDemo) {
        window.securityDemo.simulateAttack();
        showNotification('Attack simulation started! Check console for details.', 'warning');
    } else {
        showNotification('Please start security demo first!', 'error');
    }
}

function testZeroKnowledge() {
    if (window.securityDemo) {
        window.securityDemo.testZeroKnowledge();
        showNotification('Zero Knowledge++ test completed! Check console for details.', 'success');
    } else {
        showNotification('Please start security demo first!', 'error');
    }
}

function testOneWayEntry() {
    if (window.securityDemo) {
        window.securityDemo.testOneWayEntry();
        showNotification('One-Way Entry test completed! Check console for details.', 'success');
    } else {
        showNotification('Please start security demo first!', 'error');
    }
}

// Auto-start demo if on security dashboard
if (window.location.pathname.includes('security-dashboard')) {
    setTimeout(() => {
        startSecurityDemo();
    }, 3000); // Start after 3 seconds
}

console.log('🧪 Security Demo Script loaded');
console.log('Available functions:');
console.log('- startSecurityDemo() - Start the security demo');
console.log('- stopSecurityDemo() - Stop the security demo');
console.log('- simulateAttack() - Simulate an attack scenario');
console.log('- testZeroKnowledge() - Test Zero Knowledge++ architecture');
console.log('- testOneWayEntry() - Test One-Way Entry principle');
