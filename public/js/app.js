// Main Application Module
const App = {
    currentComponent: null,

    // Initialize the application
    init() {
        console.log('🛡️ Padhma Vyuham Security Vault initialized');
        this.hideLoading();
        
        // Initialize authentication
        Auth.init();
    },

    // Show a specific component
    showComponent(componentName) {
        this.currentComponent = componentName;
        const mainContent = document.getElementById('main-content');
        
        // Hide loading
        this.hideLoading();
        
        // Show component content
        switch (componentName) {
            case 'login':
                mainContent.innerHTML = Components.getLoginForm();
                this.bindLoginEvents();
                break;
            case 'register':
                mainContent.innerHTML = Components.getRegisterForm();
                this.bindRegisterEvents();
                break;
            case 'dashboard':
                mainContent.innerHTML = Components.getDashboard();
                break;
            case 'vault':
                mainContent.innerHTML = Components.getVault();
                break;
            case 'security':
                mainContent.innerHTML = Components.getSecurity();
                this.loadSecurityData();
                break;
            default:
                mainContent.innerHTML = Components.getLoginForm();
                this.bindLoginEvents();
        }
    },

    // Bind login form events
    bindLoginEvents() {
        const loginForm = document.getElementById('login-form');
        const switchToRegister = document.getElementById('switch-to-register');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                const masterKey = document.getElementById('login-master-key').value;
                
                const result = await Auth.login(email, password, masterKey);
                if (!result.success) {
                    this.showError(result.error);
                }
            });
        }
        
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showComponent('register');
            });
        }
    },

    // Bind register form events
    bindRegisterEvents() {
        const registerForm = document.getElementById('register-form');
        const switchToLogin = document.getElementById('switch-to-login');
        
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('register-email').value;
                const username = document.getElementById('register-username').value;
                const password = document.getElementById('register-password').value;
                const masterKey = document.getElementById('register-master-key').value;
                
                const result = await Auth.register(email, username, password, masterKey);
                if (result.success) {
                    this.showSuccess(result.message);
                    this.showComponent('login');
                } else {
                    this.showError(result.error);
                }
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showComponent('login');
            });
        }
    },

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    },

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    },

    // Show notification
    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    },

    // Show loading
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    },

    // Hide loading
    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    },

    // Load security data for the security component
    async loadSecurityData() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Load user security profile
            const profileResponse = await fetch(`${Auth.API_BASE}/security/profile/${Auth.user?.id || 'user-id'}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (profileResponse.ok) {
                const profile = await profileResponse.json();
                this.displaySecurityProfile(profile);
            }

            // Load security events
            const eventsResponse = await fetch(`${Auth.API_BASE}/security/events/${Auth.user?.id || 'user-id'}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (eventsResponse.ok) {
                const events = await eventsResponse.json();
                this.displaySecurityEvents(events.events);
            }

            // Bind test security button
            this.bindSecurityEvents();
        } catch (error) {
            console.error('Error loading security data:', error);
        }
    },

    // Display security profile data
    displaySecurityProfile(profile) {
        // Update overview cards
        document.getElementById('layer-count').textContent = profile.layers.length;
        document.getElementById('honeypot-count').textContent = profile.layers.reduce((sum, layer) => sum + layer.honeypotCount, 0);
        document.getElementById('ai-status').textContent = profile.aiGuardian ? 'ACTIVE' : 'INACTIVE';
        
        // Update threat level
        const threatLevel = document.getElementById('threat-level');
        const threatBar = document.getElementById('threat-bar');
        threatLevel.textContent = profile.threatLevel.toUpperCase();
        
        // Set threat bar color and width
        let threatColor = 'bg-green-500';
        let threatWidth = '25%';
        
        switch (profile.threatLevel) {
            case 'low':
                threatColor = 'bg-green-500';
                threatWidth = '25%';
                break;
            case 'medium':
                threatColor = 'bg-yellow-500';
                threatWidth = '50%';
                break;
            case 'high':
                threatColor = 'bg-orange-500';
                threatWidth = '75%';
                break;
            case 'critical':
                threatColor = 'bg-red-500';
                threatWidth = '100%';
                break;
        }
        
        threatBar.className = `${threatColor} h-2 rounded-full`;
        threatBar.style.width = threatWidth;
        
        // Update attack statistics
        document.getElementById('total-attacks').textContent = profile.attackCount;
        document.getElementById('last-attack').textContent = profile.lastAttack ? new Date(profile.lastAttack).toLocaleDateString() : 'Never';
        
        // Display security layers
        this.displaySecurityLayers(profile.layers);
    },

    // Display security layers
    displaySecurityLayers(layers) {
        const layersContainer = document.getElementById('security-layers');
        layersContainer.innerHTML = layers.map(layer => `
            <div class="bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                            <span class="text-xl">🛡️</span>
                        </div>
                        <div>
                            <h4 class="text-white font-semibold">${layer.name}</h4>
                            <p class="text-purple-300 text-sm">${layer.encryptionLevel.toUpperCase()} Encryption</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-400">Honeypots: <span class="text-red-400 font-semibold">${layer.honeypotCount}</span></div>
                        <div class="text-sm text-gray-400">Decoys: <span class="text-yellow-400 font-semibold">${layer.decoyDataCount}</span></div>
                        <div class="text-xs text-purple-400">Rotates every ${layer.rotationInterval} min</div>
                    </div>
                </div>
                <div class="mt-3 flex items-center">
                    <div class="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                        <div class="bg-purple-500 h-2 rounded-full" style="width: ${layer.isActive ? '100%' : '0%'}"></div>
                    </div>
                    <span class="text-xs ${layer.isActive ? 'text-green-400' : 'text-red-400'}">
                        ${layer.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                </div>
            </div>
        `).join('');
    },

    // Display security events
    displaySecurityEvents(events) {
        const eventsContainer = document.getElementById('security-events');
        if (events.length === 0) {
            eventsContainer.innerHTML = '<p class="text-gray-400 text-center py-4">No security events recorded</p>';
            return;
        }

        eventsContainer.innerHTML = events.map(event => `
            <div class="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-purple-500/20">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                        <span class="text-sm">📝</span>
                    </div>
                    <div>
                        <div class="text-white text-sm font-medium">${event.description}</div>
                        <div class="text-purple-300 text-xs">${new Date(event.timestamp).toLocaleString()}</div>
                    </div>
                </div>
                <div class="text-right">
                    <span class="px-2 py-1 rounded text-xs font-medium ${
                        event.severity === 'low' ? 'bg-green-500/20 text-green-400' :
                        event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                    }">${event.severity.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    },

    // Bind security component events
    bindSecurityEvents() {
        const testBtn = document.getElementById('test-security-btn');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testSecuritySystem());
        }
    },

    // Test security system
    async testSecuritySystem() {
        try {
            const testBtn = document.getElementById('test-security-btn');
            testBtn.disabled = true;
            testBtn.textContent = '🧪 Testing...';

            const response = await fetch(`${Auth.API_BASE}/security/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    attackType: 'sql_injection',
                    payload: 'SELECT * FROM users WHERE id = 1 OR 1=1',
                    ipAddress: '192.168.1.100',
                    userAgent: 'Mozilla/5.0 (Test Browser)'
                })
            });

            if (response.ok) {
                const result = await response.json();
                this.showSecurityTestResult(result);
            }
        } catch (error) {
            console.error('Security test error:', error);
            this.showError('Security test failed');
        } finally {
            const testBtn = document.getElementById('test-security-btn');
            testBtn.disabled = false;
            testBtn.textContent = '🧪 Test Security System';
        }
    },

    // Show security test result
    showSecurityTestResult(result) {
        const message = `🛡️ Security Test Result:\n\n` +
            `Maze Layer: ${result.mazeResult.mazeLayer}\n` +
            `Honeypot Triggered: ${result.mazeResult.honeypotTriggered ? 'Yes' : 'No'}\n` +
            `Trap Activated: ${result.mazeResult.trapActivated ? 'Yes' : 'No'}\n` +
            `Action: ${result.mazeResult.response.action}\n` +
            `Threat Level: ${result.mazeResult.response.threatLevel}`;

        this.showSuccess(message);
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
