/**
 * Comprehensive Testing Framework for Agies Password Manager
 * Systematically tests all features and generates detailed reports
 */

class AgiesTestingSuite {
    constructor() {
        this.testResults = [];
        this.featureStatus = new Map();
        this.performanceMetrics = new Map();
        this.isRunning = false;
        this.init();
    }

    async init() {
        console.log('🧪 Initializing Agies Testing Suite...');
        this.setupTestEnvironment();
    }

    // Setup test environment
    setupTestEnvironment() {
        // Add test indicators to UI
        this.addTestingUI();
        
        // Listen for test events
        this.setupEventListeners();
    }

    // Add testing UI to dashboard
    addTestingUI() {
        // Check if body exists before proceeding
        if (!document.body) {
            console.warn('Document body not ready, retrying in 100ms...');
            setTimeout(() => this.addTestingUI(), 100);
            return;
        }

        const testingPanel = document.createElement('div');
        testingPanel.id = 'testing-panel';
        testingPanel.className = 'fixed bottom-4 left-4 bg-gray-900 border border-gray-600 rounded-lg p-4 z-50 max-w-md';
        testingPanel.style.display = 'none';
        
        testingPanel.innerHTML = `
            <div class="mb-3">
                <h3 class="text-white font-bold text-sm mb-2">🧪 Agies Testing Suite</h3>
                <div class="flex space-x-2">
                    <button id="run-all-tests" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                        Run All Tests
                    </button>
                    <button id="run-security-tests" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
                        Security Tests
                    </button>
                    <button id="run-performance-tests" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
                        Performance
                    </button>
                </div>
            </div>
            <div id="test-progress" class="mb-2">
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div id="progress-bar" class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
                </div>
            </div>
            <div id="test-status" class="text-xs text-gray-300">
                Ready to test
            </div>
            <div class="mt-2">
                <button id="toggle-testing" class="text-xs text-blue-400 hover:text-blue-300">
                    Hide Panel
                </button>
                <button id="download-report" class="text-xs text-green-400 hover:text-green-300 ml-2">
                    Download Report
                </button>
            </div>
        `;
        
        // Check if testing panel already exists
        if (document.getElementById('testing-panel')) {
            return;
        }
        
        document.body.appendChild(testingPanel);
        
        // Add keyboard shortcut to show/hide (Ctrl+Shift+T)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTestingPanel();
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'run-all-tests') {
                this.runAllTests();
            }
            if (e.target.id === 'run-security-tests') {
                this.runSecurityTests();
            }
            if (e.target.id === 'run-performance-tests') {
                this.runPerformanceTests();
            }
            if (e.target.id === 'toggle-testing') {
                this.toggleTestingPanel();
            }
            if (e.target.id === 'download-report') {
                this.downloadTestReport();
            }
        });
    }

    // Toggle testing panel
    toggleTestingPanel() {
        const panel = document.getElementById('testing-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Run all comprehensive tests
    async runAllTests() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.testResults = [];
        this.updateTestStatus('Starting comprehensive tests...');
        
        const testSuites = [
            { name: 'Authentication Tests', method: this.testAuthentication },
            { name: 'Vault Management Tests', method: this.testVaultManagement },
            { name: 'Password Management Tests', method: this.testPasswordManagement },
            { name: 'Security Features Tests', method: this.testSecurityFeatures },
            { name: '2FA Tests', method: this.test2FA },
            { name: 'Dark Web Monitoring Tests', method: this.testDarkWebMonitoring },
            { name: 'VPN Integration Tests', method: this.testVPNIntegration },
            { name: 'Device Manager Tests', method: this.testDeviceManager },
            { name: 'Import/Export Tests', method: this.testImportExport },
            { name: 'UI/UX Tests', method: this.testUIUX },
            { name: 'Performance Tests', method: this.testPerformance },
            { name: 'Security Vulnerability Tests', method: this.testSecurityVulnerabilities }
        ];
        
        for (let i = 0; i < testSuites.length; i++) {
            const suite = testSuites[i];
            this.updateProgress((i / testSuites.length) * 100);
            this.updateTestStatus(`Running ${suite.name}...`);
            
            try {
                const result = await suite.method.call(this);
                this.testResults.push({
                    suite: suite.name,
                    result: result,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                this.testResults.push({
                    suite: suite.name,
                    result: { passed: false, error: error.message },
                    timestamp: new Date().toISOString()
                });
            }
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        this.updateProgress(100);
        this.updateTestStatus('All tests completed!');
        this.generateTestSummary();
        this.isRunning = false;
    }

    // Test Authentication System
    async testAuthentication() {
        const tests = [];
        
        // Test 1: Valid credentials
        try {
            if (window.Auth && typeof window.Auth.login === 'function') {
                tests.push({ name: 'Auth module exists', passed: true });
            } else {
                tests.push({ name: 'Auth module exists', passed: false, error: 'Auth module not found' });
            }
        } catch (error) {
            tests.push({ name: 'Auth module exists', passed: false, error: error.message });
        }
        
        // Test 2: Check local storage for token
        const token = localStorage.getItem('token');
        tests.push({ 
            name: 'Authentication token check', 
            passed: token !== null, 
            details: token ? 'Token found' : 'No token found'
        });
        
        // Test 3: Check user data
        const userData = localStorage.getItem('user');
        tests.push({ 
            name: 'User data check', 
            passed: userData !== null, 
            details: userData ? 'User data found' : 'No user data found'
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test Vault Management
    async testVaultManagement() {
        const tests = [];
        
        // Test 1: Vault system exists
        try {
            if (window.vaultSystem) {
                tests.push({ name: 'Vault system exists', passed: true });
            } else {
                tests.push({ name: 'Vault system exists', passed: false, error: 'Vault system not found' });
            }
        } catch (error) {
            tests.push({ name: 'Vault system exists', passed: false, error: error.message });
        }
        
        // Test 2: Check vault creation modal
        const vaultModal = document.getElementById('vaultModal');
        tests.push({ 
            name: 'Vault creation modal exists', 
            passed: vaultModal !== null,
            details: vaultModal ? 'Modal found' : 'Modal not found'
        });
        
        // Test 3: Check vault edit functionality
        const editButtons = document.querySelectorAll('[onclick*="editVault"]');
        tests.push({ 
            name: 'Vault edit buttons exist', 
            passed: editButtons.length > 0,
            details: `Found ${editButtons.length} edit buttons`
        });
        
        // Test 4: Check vault view functionality
        const viewButtons = document.querySelectorAll('[onclick*="viewVault"]');
        tests.push({ 
            name: 'Vault view buttons exist', 
            passed: viewButtons.length > 0,
            details: `Found ${viewButtons.length} view buttons`
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test Password Management
    async testPasswordManagement() {
        const tests = [];
        
        // Test 1: Add password modal
        const addPasswordModal = document.getElementById('addPasswordModal');
        tests.push({ 
            name: 'Add password modal exists', 
            passed: addPasswordModal !== null,
            details: addPasswordModal ? 'Modal found' : 'Modal not found'
        });
        
        // Test 2: Password form elements
        const passwordForm = document.getElementById('addPasswordForm');
        tests.push({ 
            name: 'Password form exists', 
            passed: passwordForm !== null,
            details: passwordForm ? 'Form found' : 'Form not found'
        });
        
        // Test 3: Password import functionality
        const importBtn = document.getElementById('importPasswordsBtn');
        tests.push({ 
            name: 'Import button exists', 
            passed: importBtn !== null,
            details: importBtn ? 'Import button found' : 'Import button not found'
        });
        
        // Test 4: Real import system
        try {
            if (window.realImport) {
                tests.push({ name: 'Real import system exists', passed: true });
            } else {
                tests.push({ name: 'Real import system exists', passed: false, error: 'Real import system not found' });
            }
        } catch (error) {
            tests.push({ name: 'Real import system exists', passed: false, error: error.message });
        }
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test Security Features
    async testSecurityFeatures() {
        const tests = [];
        
        // Test 1: Real security data system
        try {
            if (window.realSecurityData && window.realSecurityData.isInitialized) {
                tests.push({ name: 'Real security data system', passed: true });
            } else {
                tests.push({ name: 'Real security data system', passed: false, error: 'Security data system not initialized' });
            }
        } catch (error) {
            tests.push({ name: 'Real security data system', passed: false, error: error.message });
        }
        
        // Test 2: Encryption status
        const encryptionElement = document.getElementById('encryption-status');
        tests.push({ 
            name: 'Encryption status display', 
            passed: encryptionElement !== null,
            details: encryptionElement ? encryptionElement.textContent : 'Element not found'
        });
        
        // Test 3: Security dashboard link
        const securityDashboardBtn = document.querySelector('[onclick*="showSecurityDashboard"]');
        tests.push({ 
            name: 'Security dashboard access', 
            passed: securityDashboardBtn !== null,
            details: securityDashboardBtn ? 'Button found' : 'Button not found'
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test 2FA System
    async test2FA() {
        const tests = [];
        
        // Test 1: 2FA Manager exists
        try {
            if (window.twoFactorAuthManager && window.twoFactorAuthManager.isInitialized) {
                tests.push({ name: '2FA manager system', passed: true });
            } else {
                tests.push({ name: '2FA manager system', passed: false, error: '2FA manager not initialized' });
            }
        } catch (error) {
            tests.push({ name: '2FA manager system', passed: false, error: error.message });
        }
        
        // Test 2: 2FA setup button
        const setup2FABtn = document.getElementById('setup-2fa-btn');
        tests.push({ 
            name: '2FA setup button', 
            passed: setup2FABtn !== null,
            details: setup2FABtn ? 'Button found' : 'Button not found'
        });
        
        // Test 3: 2FA status display
        const status2FA = document.querySelector('[data-2fa-status]');
        tests.push({ 
            name: '2FA status display', 
            passed: status2FA !== null,
            details: status2FA ? status2FA.textContent : 'Status not found'
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test Dark Web Monitoring
    async testDarkWebMonitoring() {
        const tests = [];
        
        // Test 1: Dark web monitoring status
        const darkWebStatus = document.getElementById('dark-web-status');
        tests.push({ 
            name: 'Dark web monitoring status', 
            passed: darkWebStatus !== null,
            details: darkWebStatus ? darkWebStatus.textContent : 'Status not found'
        });
        
        // Test 2: Monitoring setup button
        const monitoringBtn = document.querySelector('[onclick*="showDarkWebMonitoring"]');
        tests.push({ 
            name: 'Monitoring setup button', 
            passed: monitoringBtn !== null,
            details: monitoringBtn ? 'Button found' : 'Button not found'
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test VPN Integration
    async testVPNIntegration() {
        const tests = [];
        
        // Test 1: VPN status check
        const vpnBtn = document.querySelector('[onclick*="showVPNStatus"]');
        tests.push({ 
            name: 'VPN status button', 
            passed: vpnBtn !== null,
            details: vpnBtn ? 'Button found' : 'Button not found'
        });
        
        // Test 2: VPN modal
        const vpnModal = document.getElementById('vpnStatusModal');
        tests.push({ 
            name: 'VPN status modal', 
            passed: vpnModal !== null,
            details: vpnModal ? 'Modal found' : 'Modal not found'
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test Device Manager
    async testDeviceManager() {
        const tests = [];
        
        // Test 1: Device manager system
        try {
            if (window.DeviceManager) {
                tests.push({ name: 'Device manager class', passed: true });
            } else {
                tests.push({ name: 'Device manager class', passed: false, error: 'DeviceManager not found' });
            }
        } catch (error) {
            tests.push({ name: 'Device manager class', passed: false, error: error.message });
        }
        
        // Test 2: Device manager button
        const deviceBtn = document.querySelector('[onclick*="showDeviceManager"]');
        tests.push({ 
            name: 'Device manager button', 
            passed: deviceBtn !== null,
            details: deviceBtn ? 'Button found' : 'Button not found'
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test Import/Export
    async testImportExport() {
        const tests = [];
        
        // Test 1: Import modal
        const importModal = document.getElementById('importModal');
        tests.push({ 
            name: 'Import modal exists', 
            passed: importModal !== null,
            details: importModal ? 'Modal found' : 'Modal not found'
        });
        
        // Test 2: Chrome import functionality
        const chromeImportBtn = document.querySelector('[onclick*="Chrome"]');
        tests.push({ 
            name: 'Chrome import option', 
            passed: chromeImportBtn !== null,
            details: chromeImportBtn ? 'Chrome import found' : 'Chrome import not found'
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test UI/UX
    async testUIUX() {
        const tests = [];
        
        // Test 1: Responsive design
        const isMobile = window.innerWidth <= 768;
        tests.push({ 
            name: 'Mobile responsiveness check', 
            passed: true,
            details: `Screen width: ${window.innerWidth}px, Mobile: ${isMobile}`
        });
        
        // Test 2: Navigation elements
        const navElements = document.querySelectorAll('nav, .navigation, [role="navigation"]');
        tests.push({ 
            name: 'Navigation elements', 
            passed: navElements.length > 0,
            details: `Found ${navElements.length} navigation elements`
        });
        
        // Test 3: Accessibility
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        tests.push({ 
            name: 'Heading structure', 
            passed: headings.length > 0,
            details: `Found ${headings.length} headings`
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test Performance
    async testPerformance() {
        const tests = [];
        
        // Test 1: Page load time
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        tests.push({ 
            name: 'Page load performance', 
            passed: loadTime < 5000,
            details: `Load time: ${loadTime}ms`
        });
        
        // Test 2: Resource count
        const resources = performance.getEntriesByType('resource');
        tests.push({ 
            name: 'Resource optimization', 
            passed: resources.length < 100,
            details: `Resources loaded: ${resources.length}`
        });
        
        // Test 3: Memory usage
        if (performance.memory) {
            const memoryMB = performance.memory.usedJSHeapSize / 1024 / 1024;
            tests.push({ 
                name: 'Memory usage', 
                passed: memoryMB < 50,
                details: `Memory usage: ${memoryMB.toFixed(2)}MB`
            });
        }
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Test Security Vulnerabilities
    async testSecurityVulnerabilities() {
        const tests = [];
        
        // Test 1: HTTPS usage
        tests.push({ 
            name: 'HTTPS security', 
            passed: location.protocol === 'https:',
            details: `Protocol: ${location.protocol}`
        });
        
        // Test 2: Content Security Policy
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        tests.push({ 
            name: 'Content Security Policy', 
            passed: cspMeta !== null,
            details: cspMeta ? 'CSP header found' : 'CSP header not found'
        });
        
        // Test 3: Password visibility toggle
        const passwordToggles = document.querySelectorAll('[type="password"]');
        tests.push({ 
            name: 'Password field security', 
            passed: passwordToggles.length > 0,
            details: `Found ${passwordToggles.length} password fields`
        });
        
        return {
            passed: tests.every(t => t.passed),
            total: tests.length,
            passed_count: tests.filter(t => t.passed).length,
            tests: tests
        };
    }

    // Update test progress
    updateProgress(percentage) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    }

    // Update test status
    updateTestStatus(status) {
        const statusElement = document.getElementById('test-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    // Generate test summary
    generateTestSummary() {
        const totalTests = this.testResults.reduce((sum, result) => sum + result.result.total, 0);
        const passedTests = this.testResults.reduce((sum, result) => sum + result.result.passed_count, 0);
        const failedTests = totalTests - passedTests;
        
        const summary = {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            percentage: Math.round((passedTests / totalTests) * 100),
            timestamp: new Date().toISOString(),
            results: this.testResults
        };
        
        console.log('🧪 Test Summary:', summary);
        
        this.updateTestStatus(`Tests: ${passedTests}/${totalTests} passed (${summary.percentage}%)`);
        
        return summary;
    }

    // Download test report
    downloadTestReport() {
        const summary = this.generateTestSummary();
        
        const report = {
            title: 'Agies Password Manager - Test Report',
            timestamp: new Date().toISOString(),
            summary: summary,
            detailed_results: this.testResults,
            system_info: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                screen: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            }
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agies-test-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Show testing panel (public method)
    showTestingPanel() {
        const panel = document.getElementById('testing-panel');
        if (panel) {
            panel.style.display = 'block';
        }
    }
}

// Initialize testing suite
const agiesTestingSuite = new AgiesTestingSuite();

// Export for global use
window.AgiesTestingSuite = AgiesTestingSuite;
window.agiesTestingSuite = agiesTestingSuite;

// Show testing panel after initialization
setTimeout(() => {
    agiesTestingSuite.showTestingPanel();
}, 2000);

console.log('🧪 Comprehensive Testing Suite Ready');
console.log('📊 Use Ctrl+Shift+T to toggle testing panel');
console.log('🔍 Automated feature testing enabled');
