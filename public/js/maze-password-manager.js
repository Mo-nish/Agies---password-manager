// 🛡️ Maze Password Manager - Chakravyuham Vault
// The world's most advanced password protection system

class MazePasswordManager {
    constructor() {
        this.currentUser = null;
        this.vaults = new Map();
        this.passwords = new Map();
        this.securityLevel = 'FORTRESS';
        this.isAuthenticated = false;
        this.currentPage = 'dashboard';
        this.mazeEngine = null;
        this.aiGuardian = null;
        this.darkWebMonitor = null;
        this.encryptionEngine = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Maze Password Manager...');
        
        try {
            // Initialize core systems
            await this.initializeSecuritySystems();
            await this.initializeUI();
            await this.loadUserData();
            await this.setupEventListeners();
            
            // Start splash screen animation
            this.showSplashScreen();
            
            console.log('✅ Maze Password Manager initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Maze Password Manager:', error);
            this.showError('Initialization failed. Please refresh the page.');
        }
    }

    async initializeSecuritySystems() {
        // Initialize the Chakravyuham Maze Engine
        this.mazeEngine = new ChakravyuhamMazeEngine();
        
        // Initialize AI Guardian
        this.aiGuardian = new AIGuardian();
        
        // Initialize Dark Web Monitor
        this.darkWebMonitor = new DarkWebMonitor();
        
        // Initialize Encryption Engine
        this.encryptionEngine = new EncryptionEngine();
        
        // Wait for all systems to be ready
        await Promise.all([
            this.mazeEngine.init(),
            this.aiGuardian.init(),
            this.darkWebMonitor.init(),
            this.encryptionEngine.init()
        ]);
    }

    async initializeUI() {
        // Initialize GSAP animations
        gsap.registerPlugin(ScrollTrigger);
        
        // Setup page transitions
        this.setupPageTransitions();
        
        // Setup sidebar functionality
        this.setupSidebar();
        
        // Setup responsive design
        this.setupResponsiveDesign();
    }

    async loadUserData() {
        // Load user data from localStorage or API
        const userData = localStorage.getItem('maze_user_data');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isAuthenticated = true;
                this.updateUserDisplay();
            } catch (error) {
                console.error('Failed to parse user data:', error);
            }
        }
        
        // Load vaults and passwords
        await this.loadVaults();
        await this.loadPasswords();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Add password button
        document.getElementById('add-password-btn').addEventListener('click', () => {
            this.showAddPasswordModal();
        });

        // Generate password button
        document.getElementById('generate-password-btn').addEventListener('click', () => {
            this.generateSecurePassword();
        });

        // Modal events
        document.getElementById('cancel-add-password').addEventListener('click', () => {
            this.hideAddPasswordModal();
        });

        document.getElementById('add-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddPassword(e.target);
        });

        // Upgrade buttons
        document.getElementById('upgrade-pro-btn').addEventListener('click', () => {
            this.handleUpgrade('pro');
        });

        document.getElementById('upgrade-enterprise-btn').addEventListener('click', () => {
            this.handleUpgrade('enterprise');
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    showSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        const app = document.getElementById('app');
        
        // Animate maze logo
        gsap.to('.maze-layer', {
            rotation: 360,
            duration: 3,
            ease: 'power2.out',
            stagger: 0.2
        });
        
        // Show app after animation
        setTimeout(() => {
            gsap.to(splashScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    splashScreen.style.display = 'none';
                    app.classList.remove('hidden');
                    
                    // Animate app entrance
                    gsap.from(app, {
                        opacity: 0,
                        y: 20,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                    
                    // Animate dashboard cards
                    this.animateDashboardCards();
                }
            });
        }, 3000);
    }

    animateDashboardCards() {
        gsap.from('.fade-in', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    setupPageTransitions() {
        // Smooth page transitions with GSAP
        this.pages = document.querySelectorAll('.page');
    }

    setupSidebar() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.querySelector('main');
    }

    setupResponsiveDesign() {
        // Handle responsive behavior
        const handleResize = () => {
            if (window.innerWidth < 768) {
                this.sidebar.classList.remove('open');
                this.mainContent.style.marginLeft = '0';
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
        
        if (this.sidebar.classList.contains('open')) {
            this.mainContent.style.marginLeft = '16rem';
        } else {
            this.mainContent.style.marginLeft = '0';
        }
    }

    navigateToPage(pageName) {
        // Hide all pages
        this.pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            
            // Animate page entrance
            gsap.from(targetPage, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            // Load page-specific content
            this.loadPageContent(pageName);
        }
        
        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            this.toggleSidebar();
        }
    }

    loadPageContent(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.loadDashboardContent();
                break;
            case 'vault':
                this.loadVaultContent();
                break;
            case 'ai-guardian':
                this.loadAIGuardianContent();
                break;
            case 'dark-web':
                this.loadDarkWebContent();
                break;
            case 'settings':
                this.loadSettingsContent();
                break;
            case 'upgrade':
                this.loadUpgradeContent();
                break;
        }
    }

    loadDashboardContent() {
        // Update dashboard with real-time data
        this.updateSecurityMetrics();
        this.updateRecentActivity();
    }

    loadVaultContent() {
        // Load and display passwords
        this.displayPasswords();
        
        // Animate maze visualization
        this.animateMazeVisualization();
    }

    loadAIGuardianContent() {
        // Start AI Guardian monitoring
        this.aiGuardian.startMonitoring();
        
        // Display security alerts
        this.displaySecurityAlerts();
    }

    loadDarkWebContent() {
        // Start dark web monitoring
        this.darkWebMonitor.startMonitoring();
        
        // Display rotation queue
        this.displayRotationQueue();
    }

    loadSettingsContent() {
        // Load user settings
        this.loadUserSettings();
    }

    loadUpgradeContent() {
        // Load subscription information
        this.loadSubscriptionInfo();
    }

    showAddPasswordModal() {
        const modal = document.getElementById('add-password-modal');
        modal.classList.remove('hidden');
        
        // Animate modal entrance
        gsap.from(modal.querySelector('.glass-card'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    }

    hideAddPasswordModal() {
        const modal = document.getElementById('add-password-modal');
        
        // Animate modal exit
        gsap.to(modal.querySelector('.glass-card'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'back.in(1.7)',
            onComplete: () => {
                modal.classList.add('hidden');
                // Reset form
                document.getElementById('add-password-form').reset();
            }
        });
    }

    async handleAddPassword(form) {
        const formData = new FormData(form);
        const passwordData = {
            title: formData.get('title') || form.querySelector('input[placeholder="Title"]').value,
            username: formData.get('username') || form.querySelector('input[placeholder="Username"]').value,
            password: formData.get('password') || form.querySelector('input[placeholder="Password"]').value,
            url: formData.get('url') || form.querySelector('input[placeholder="URL"]').value
        };
        
        try {
            // Encrypt password data
            const encryptedData = await this.encryptionEngine.encryptPassword(passwordData);
            
            // Add to vault
            const password = await this.addPassword(encryptedData);
            
            // Show success message
            this.showSuccess('Password added successfully!');
            
            // Hide modal
            this.hideAddPasswordModal();
            
            // Refresh vault display
            this.displayPasswords();
            
        } catch (error) {
            console.error('Failed to add password:', error);
            this.showError('Failed to add password. Please try again.');
        }
    }

    async addPassword(passwordData) {
        const password = {
            id: this.generateId(),
            ...passwordData,
            createdAt: Date.now(),
            lastUsed: null,
            securityScore: this.calculatePasswordSecurity(passwordData.password)
        };
        
        this.passwords.set(password.id, password);
        await this.savePasswords();
        
        return password;
    }

    generateSecurePassword() {
        const length = 16;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        // Show password in a modal
        this.showGeneratedPassword(password);
    }

    showGeneratedPassword(password) {
        // Create and show password modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="glass-card p-6 rounded-xl w-full max-w-md">
                <h3 class="text-xl font-semibold mb-4">Generated Password</h3>
                <div class="bg-gray-800 p-4 rounded-lg mb-4 font-mono text-center">
                    ${password}
                </div>
                <div class="flex space-x-3">
                    <button id="copy-password" class="flex-1 p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                        Copy
                    </button>
                    <button id="close-password-modal" class="flex-1 p-3 bg-gray-600 rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('#copy-password').addEventListener('click', () => {
            navigator.clipboard.writeText(password);
            this.showSuccess('Password copied to clipboard!');
        });
        
        modal.querySelector('#close-password-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Animate entrance
        gsap.from(modal.querySelector('.glass-card'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    }

    displayPasswords() {
        const passwordsList = document.getElementById('passwords-list');
        passwordsList.innerHTML = '';
        
        if (this.passwords.size === 0) {
            passwordsList.innerHTML = `
                <div class="glass-card p-8 rounded-xl text-center">
                    <div class="text-4xl mb-4">🔐</div>
                    <h3 class="text-xl font-semibold mb-2">No Passwords Yet</h3>
                    <p class="text-gray-400 mb-4">Start building your secure password vault</p>
                    <button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all">
                        Add Your First Password
                    </button>
                </div>
            `;
            return;
        }
        
        // Display passwords
        this.passwords.forEach(password => {
            const passwordElement = this.createPasswordElement(password);
            passwordsList.appendChild(passwordElement);
        });
    }

    createPasswordElement(password) {
        const element = document.createElement('div');
        element.className = 'glass-card p-4 rounded-xl flex items-center justify-between';
        element.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span class="text-white text-xl">🔐</span>
                </div>
                <div>
                    <h4 class="font-semibold">${password.title}</h4>
                    <p class="text-sm text-gray-400">${password.username}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-xs px-2 py-1 rounded-full ${this.getSecurityScoreClass(password.securityScore)}">
                    ${password.securityScore}/100
                </span>
                <button class="p-2 hover:bg-gray-800/50 rounded-lg transition-all" onclick="copyPassword('${password.id}')">
                    📋
                </button>
                <button class="p-2 hover:bg-gray-800/50 rounded-lg transition-all" onclick="editPassword('${password.id}')">
                    ✏️
                </button>
                <button class="p-2 hover:bg-gray-800/50 rounded-lg transition-all" onclick="deletePassword('${password.id}')">
                    🗑️
                </button>
            </div>
        `;
        
        return element;
    }

    getSecurityScoreClass(score) {
        if (score >= 80) return 'bg-green-600/20 text-green-400';
        if (score >= 60) return 'bg-yellow-600/20 text-yellow-400';
        return 'bg-red-600/20 text-red-400';
    }

    animateMazeVisualization() {
        // Animate maze layers with GSAP
        gsap.to('.maze-layer', {
            rotation: 360,
            duration: 20,
            ease: 'none',
            repeat: -1,
            stagger: 0.2
        });
        
        // Add pulse effect to center lock
        gsap.to('.maze-layer .w-16', {
            scale: 1.1,
            duration: 2,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
        });
    }

    displaySecurityAlerts() {
        const alertsContainer = document.getElementById('security-alerts');
        alertsContainer.innerHTML = '';
        
        // Get alerts from AI Guardian
        const alerts = this.aiGuardian.getAlerts();
        
        if (alerts.length === 0) {
            alertsContainer.innerHTML = `
                <div class="glass-card p-6 rounded-xl text-center">
                    <div class="text-4xl mb-4">✅</div>
                    <h3 class="text-xl font-semibold mb-2">All Systems Secure</h3>
                    <p class="text-gray-400">No security threats detected</p>
                </div>
            `;
            return;
        }
        
        // Display alerts
        alerts.forEach(alert => {
            const alertElement = this.createAlertElement(alert);
            alertsContainer.appendChild(alertElement);
        });
    }

    createAlertElement(alert) {
        const element = document.createElement('div');
        element.className = `glass-card p-4 rounded-xl border-l-4 ${this.getAlertBorderClass(alert.level)}`;
        element.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3">
                    <div class="text-2xl">${this.getAlertIcon(alert.level)}</div>
                    <div>
                        <h4 class="font-semibold">${alert.title}</h4>
                        <p class="text-sm text-gray-400">${alert.description}</p>
                        <p class="text-xs text-gray-500 mt-1">${new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                <button class="text-gray-400 hover:text-white transition-colors">×</button>
            </div>
        `;
        
        return element;
    }

    getAlertBorderClass(level) {
        switch (level) {
            case 'LOW': return 'border-yellow-500';
            case 'MEDIUM': return 'border-orange-500';
            case 'HIGH': return 'border-red-500';
            case 'CRITICAL': return 'border-red-600';
            default: return 'border-gray-500';
        }
    }

    getAlertIcon(level) {
        switch (level) {
            case 'LOW': return '⚠️';
            case 'MEDIUM': return '🚨';
            case 'HIGH': return '🔥';
            case 'CRITICAL': return '💥';
            default: return 'ℹ️';
        }
    }

    displayRotationQueue() {
        const queueContainer = document.getElementById('rotation-queue');
        queueContainer.innerHTML = '';
        
        // Get rotation queue from Dark Web Monitor
        const queue = this.darkWebMonitor.getRotationQueue();
        
        if (queue.length === 0) {
            queueContainer.innerHTML = `
                <div class="text-center text-gray-400 py-4">
                    No passwords scheduled for rotation
                </div>
            `;
            return;
        }
        
        // Display rotation items
        queue.forEach(item => {
            const queueElement = this.createQueueElement(item);
            queueContainer.appendChild(queueElement);
        });
    }

    createQueueElement(item) {
        const element = document.createElement('div');
        element.className = 'glass-card p-4 rounded-xl flex items-center justify-between';
        element.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span class="text-white">🔐</span>
                </div>
                <div>
                    <h4 class="font-semibold">${item.title}</h4>
                    <p class="text-sm text-gray-400">${item.reason}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-sm text-gray-400">Scheduled for</div>
                <div class="font-semibold">${new Date(item.scheduledFor).toLocaleDateString()}</div>
            </div>
        `;
        
        return element;
    }

    async handleUpgrade(plan) {
        try {
            // Show loading state
            this.showLoading('Processing upgrade...');
            
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Update user subscription
            this.currentUser.subscription = plan;
            this.saveUserData();
            
            // Show success message
            this.showSuccess(`Successfully upgraded to ${plan} plan!`);
            
            // Refresh upgrade page
            this.loadUpgradeContent();
            
        } catch (error) {
            console.error('Upgrade failed:', error);
            this.showError('Upgrade failed. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    async logout() {
        try {
            // Clear user data
            this.currentUser = null;
            this.isAuthenticated = false;
            localStorage.removeItem('maze_user_data');
            
            // Stop all monitoring
            this.aiGuardian.stopMonitoring();
            this.darkWebMonitor.stopMonitoring();
            
            // Redirect to login
            window.location.href = 'login.html';
            
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: Quick search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showQuickSearch();
        }
        
        // Ctrl/Cmd + N: New password
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.showAddPasswordModal();
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    showQuickSearch() {
        // Implement quick search functionality
        console.log('Quick search triggered');
    }

    closeAllModals() {
        // Close all open modals
        const modals = document.querySelectorAll('[id$="-modal"]');
        modals.forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }

    // Utility methods
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    calculatePasswordSecurity(password) {
        let score = 0;
        
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 20;
        if (password.length >= 16) score += 20;
        
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^A-Za-z0-9]/.test(password)) score += 10;
        
        return Math.min(score, 100);
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showLoading(message) {
        // Implement loading indicator
        console.log('Loading:', message);
    }

    hideLoading() {
        // Hide loading indicator
        console.log('Loading complete');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg z-50 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 
            'bg-blue-600'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate entrance
        gsap.from(notification, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }

    // Data persistence
    async savePasswords() {
        try {
            localStorage.setItem('maze_passwords', JSON.stringify(Array.from(this.passwords.entries())));
        } catch (error) {
            console.error('Failed to save passwords:', error);
        }
    }

    async loadPasswords() {
        try {
            const saved = localStorage.getItem('maze_passwords');
            if (saved) {
                this.passwords = new Map(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load passwords:', error);
        }
    }

    async saveUserData() {
        try {
            localStorage.setItem('maze_user_data', JSON.stringify(this.currentUser));
        } catch (error) {
            console.error('Failed to save user data:', error);
        }
    }

    async loadVaults() {
        // Load vaults from storage or API
        try {
            const saved = localStorage.getItem('maze_vaults');
            if (saved) {
                this.vaults = new Map(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load vaults:', error);
        }
    }

    updateUserDisplay() {
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay && this.currentUser) {
            usernameDisplay.textContent = this.currentUser.username || 'User';
        }
    }

    updateSecurityMetrics() {
        // Update security metrics on dashboard
        const securityScore = this.calculateOverallSecurityScore();
        const threatLevel = this.aiGuardian.getThreatLevel();
        
        // Update UI elements
        const scoreElement = document.querySelector('.text-blue-400');
        if (scoreElement) {
            scoreElement.textContent = `${securityScore}/100`;
        }
    }

    calculateOverallSecurityScore() {
        if (this.passwords.size === 0) return 100;
        
        let totalScore = 0;
        this.passwords.forEach(password => {
            totalScore += password.securityScore || 0;
        });
        
        return Math.round(totalScore / this.passwords.size);
    }

    updateRecentActivity() {
        // Update recent activity on dashboard
        // This would typically come from a real-time feed
    }
}

// Security System Classes
class ChakravyuhamMazeEngine {
    constructor() {
        this.layers = new Map();
        this.threats = new Set();
        this.isActive = false;
    }

    async init() {
        console.log('🛡️ Initializing Chakravyuham Maze Engine...');
        this.isActive = true;
        this.startContinuousMonitoring();
    }

    startContinuousMonitoring() {
        setInterval(() => {
            this.shiftMazeLayers();
            this.detectThreats();
        }, 1000);
    }

    shiftMazeLayers() {
        // Simulate maze layer shifting
        this.layers.forEach((layer, key) => {
            layer.lastShift = Date.now();
            layer.rotationAngle = (layer.rotationAngle || 0) + Math.random() * 10;
        });
    }

    detectThreats() {
        // Simulate threat detection
        if (Math.random() < 0.01) {
            this.threats.add({
                id: Date.now(),
                type: 'SUSPICIOUS_ACTIVITY',
                severity: 'LOW',
                timestamp: Date.now()
            });
        }
    }
}

class AIGuardian {
    constructor() {
        this.alerts = [];
        this.threatLevel = 'LOW';
        this.isMonitoring = false;
    }

    async init() {
        console.log('🤖 Initializing AI Guardian...');
        this.isMonitoring = false;
    }

    startMonitoring() {
        this.isMonitoring = true;
        this.generateAlerts();
    }

    stopMonitoring() {
        this.isMonitoring = false;
    }

    generateAlerts() {
        if (!this.isMonitoring) return;
        
        // Simulate AI-generated alerts
        setInterval(() => {
            if (Math.random() < 0.1) {
                const alert = {
                    id: Date.now(),
                    title: 'Suspicious Login Attempt',
                    description: 'Unusual login pattern detected from new location',
                    level: 'MEDIUM',
                    timestamp: Date.now()
                };
                this.alerts.push(alert);
            }
        }, 5000);
    }

    getAlerts() {
        return this.alerts.slice(-5); // Return last 5 alerts
    }

    getThreatLevel() {
        return this.threatLevel;
    }
}

class DarkWebMonitor {
    constructor() {
        this.monitoredSites = new Set();
        this.rotationQueue = [];
        this.isMonitoring = false;
    }

    async init() {
        console.log('🌐 Initializing Dark Web Monitor...');
        this.isMonitoring = false;
    }

    startMonitoring() {
        this.isMonitoring = true;
        this.simulateMonitoring();
    }

    stopMonitoring() {
        this.isMonitoring = false;
    }

    simulateMonitoring() {
        if (!this.isMonitoring) return;
        
        // Simulate dark web monitoring
        setInterval(() => {
            if (Math.random() < 0.05) {
                const rotationItem = {
                    id: Date.now(),
                    title: 'Banking Account',
                    reason: 'Potential compromise detected',
                    scheduledFor: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
                };
                this.rotationQueue.push(rotationItem);
            }
        }, 10000);
    }

    getRotationQueue() {
        return this.rotationQueue;
    }
}

class EncryptionEngine {
    constructor() {
        this.algorithm = 'AES-256-GCM';
        this.keyDerivation = 'PBKDF2';
        this.iterations = 100000;
    }

    async init() {
        console.log('🔐 Initializing Encryption Engine...');
    }

    async encryptPassword(passwordData) {
        // Simulate encryption
        return {
            ...passwordData,
            encrypted: true,
            encryptionTimestamp: Date.now()
        };
    }

    async decryptPassword(encryptedData) {
        // Simulate decryption
        return encryptedData;
    }
}

// Global functions for password management
function copyPassword(passwordId) {
    // Implement password copying
    console.log('Copying password:', passwordId);
}

function editPassword(passwordId) {
    // Implement password editing
    console.log('Editing password:', passwordId);
}

function deletePassword(passwordId) {
    // Implement password deletion
    console.log('Deleting password:', passwordId);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mazeApp = new MazePasswordManager();
});
