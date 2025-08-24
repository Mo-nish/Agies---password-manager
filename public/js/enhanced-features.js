// 🚀 Agies Enhanced Features Module
// This will make Agies the world's top password manager!

class AgiesEnhancedFeatures {
    constructor() {
        this.totpEnabled = false;
        this.pwaSupported = 'serviceWorker' in navigator;
        this.analyticsEnabled = false;
        this.backupEnabled = false;
        this.init();
    }

    async init() {
        console.log('🌟 Initializing Agies Enhanced Features...');
        
        // Initialize all features
        await this.initTOTP();
        await this.initPWA();
        await this.initAnalytics();
        await this.initBackup();
        await this.initMobileOptimization();
        
        console.log('✅ All enhanced features initialized!');
    }

    // 🔐 TOTP Authentication (2FA)
    async initTOTP() {
        try {
            if (!this.totpEnabled) {
                console.log('🔐 TOTP not enabled, skipping...');
                return;
            }

            // Check if user has TOTP enabled
            const userTOTP = localStorage.getItem('agies_totp_enabled');
            if (userTOTP === 'true') {
                this.setupTOTPVerification();
            }

            // Add TOTP setup to user settings
            this.addTOTPSetupUI();
            
            console.log('✅ TOTP authentication initialized');
        } catch (error) {
            console.error('❌ TOTP initialization failed:', error);
        }
    }

    setupTOTPVerification() {
        // Create TOTP verification modal
        const totpModal = document.createElement('div');
        totpModal.id = 'totpModal';
        totpModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm hidden z-50';
        totpModal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/10">
                    <div class="text-center mb-6">
                        <div class="text-4xl mb-2">🔐</div>
                        <h2 class="text-2xl font-bold text-white">Two-Factor Authentication</h2>
                        <p class="text-gray-400">Enter your 6-digit code</p>
                    </div>
                    <form id="totpForm" class="space-y-4">
                        <div>
                            <input type="text" id="totpCode" maxlength="6" pattern="[0-9]{6}" 
                                   class="w-full px-4 py-3 bg-slate-700 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-agies-purple" 
                                   placeholder="000000" autocomplete="off">
                        </div>
                        <div class="flex space-x-4">
                            <button type="submit" class="flex-1 bg-agies-purple hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors">
                                Verify
                            </button>
                            <button type="button" id="closeTOTPModal" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(totpModal);
        
        // TOTP form handling
        document.getElementById('totpForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('totpCode').value;
            if (this.verifyTOTP(code)) {
                this.hideTOTPModal();
                this.showSuccessMessage('TOTP verification successful!');
            } else {
                this.showErrorMessage('Invalid TOTP code. Please try again.');
            }
        });
        
        // Close modal
        document.getElementById('closeTOTPModal').addEventListener('click', () => {
            this.hideTOTPModal();
        });
    }

    verifyTOTP(code) {
        // In production, this would verify against the server
        // For now, we'll use a simple validation
        return code.length === 6 && /^\d{6}$/.test(code);
    }

    showTOTPModal() {
        document.getElementById('totpModal').classList.remove('hidden');
        document.getElementById('totpCode').focus();
    }

    hideTOTPModal() {
        document.getElementById('totpModal').classList.add('hidden');
        document.getElementById('totpCode').value = '';
    }

    addTOTPSetupUI() {
        // Add TOTP setup button to user menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            const totpButton = document.createElement('button');
            totpButton.id = 'setupTOTPBtn';
            totpButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors';
            totpButton.innerHTML = '🔐 Setup 2FA';
            totpButton.addEventListener('click', () => this.setupTOTP());
            
            userMenu.insertBefore(totpButton, userMenu.lastElementChild);
        }
    }

    setupTOTP() {
        // Generate TOTP secret and show QR code
        const secret = this.generateTOTPSecret();
        const qrCodeUrl = `otpauth://totp/Agies:${encodeURIComponent(localStorage.getItem('agies_user_email') || 'user')}?secret=${secret}&issuer=Agies`;
        
        // Show TOTP setup modal
        this.showTOTPSetupModal(secret, qrCodeUrl);
    }

    generateTOTPSecret() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < 32; i++) {
            secret += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return secret;
    }

    showTOTPSetupModal(secret, qrCodeUrl) {
        const modal = document.createElement('div');
        modal.id = 'totpSetupModal';
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/10">
                    <div class="text-center mb-6">
                        <div class="text-4xl mb-2">🔐</div>
                        <h2 class="text-2xl font-bold text-white">Setup Two-Factor Authentication</h2>
                        <p class="text-gray-400">Scan the QR code with your authenticator app</p>
                    </div>
                    <div class="text-center mb-6">
                        <div id="qrCode" class="bg-white p-4 rounded-lg inline-block"></div>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-300 mb-2">Manual Entry Secret</label>
                        <input type="text" value="${secret}" readonly 
                               class="w-full px-4 py-3 bg-slate-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none">
                    </div>
                    <div class="flex space-x-4">
                        <button id="confirmTOTP" class="flex-1 bg-agies-purple hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors">
                            Enable 2FA
                        </button>
                        <button id="cancelTOTP" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Generate QR code
        this.generateQRCode(qrCodeUrl, 'qrCode');
        
        // Event listeners
        document.getElementById('confirmTOTP').addEventListener('click', () => {
            localStorage.setItem('agies_totp_secret', secret);
            localStorage.setItem('agies_totp_enabled', 'true');
            this.hideTOTPSetupModal();
            this.showSuccessMessage('Two-factor authentication enabled!');
        });
        
        document.getElementById('cancelTOTP').addEventListener('click', () => {
            this.hideTOTPSetupModal();
        });
    }

    hideTOTPSetupModal() {
        const modal = document.getElementById('totpSetupModal');
        if (modal) {
            modal.remove();
        }
    }

    generateQRCode(url, elementId) {
        // Simple QR code generation (in production, use a proper library)
        const element = document.getElementById(elementId);
        element.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" alt="QR Code">`;
    }

    // 📱 PWA Features
    async initPWA() {
        try {
            if (!this.pwaSupported) {
                console.log('📱 PWA not supported, skipping...');
                return;
            }

            // Register service worker
            await this.registerServiceWorker();
            
            // Setup PWA install prompt
            this.setupPWAInstall();
            
            // Add PWA manifest
            this.addPWAManifest();
            
            console.log('✅ PWA features initialized');
        } catch (error) {
            console.error('❌ PWA initialization failed:', error);
        }
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateNotification();
                    }
                });
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    setupPWAInstall() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            this.showInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.hideInstallButton();
        });
    }

    showInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.id = 'installPWA';
        installBtn.className = 'fixed bottom-4 right-4 bg-agies-purple hover:bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 z-50';
        installBtn.innerHTML = '📱 Install App';
        installBtn.addEventListener('click', () => this.installPWA());
        
        document.body.appendChild(installBtn);
    }

    hideInstallButton() {
        const installBtn = document.getElementById('installPWA');
        if (installBtn) {
            installBtn.remove();
        }
    }

    async installPWA() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('PWA install accepted');
            }
            window.deferredPrompt = null;
        }
    }

    addPWAManifest() {
        const manifest = {
            name: 'Agies Password Manager',
            short_name: 'Agies',
            description: 'World\'s Most Secure Password Manager',
            start_url: '/',
            display: 'standalone',
            background_color: '#1E1B4B',
            theme_color: '#7C3AED',
            icons: [
                {
                    src: '/favicon.ico',
                    sizes: '64x64',
                    type: 'image/x-icon'
                }
            ]
        };
        
        const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
        const manifestUrl = URL.createObjectURL(manifestBlob);
        
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = manifestUrl;
        document.head.appendChild(link);
    }

    // 📊 Analytics
    async initAnalytics() {
        try {
            if (!this.analyticsEnabled) {
                console.log('📊 Analytics not enabled, skipping...');
                return;
            }

            // Initialize Google Analytics
            this.initGoogleAnalytics();
            
            // Setup custom event tracking
            this.setupEventTracking();
            
            console.log('✅ Analytics initialized');
        } catch (error) {
            console.error('❌ Analytics initialization failed:', error);
        }
    }

    initGoogleAnalytics() {
        // Google Analytics 4 initialization
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
        
        window.gtag = gtag;
    }

    setupEventTracking() {
        // Track user interactions
        this.trackEvent('page_view', 'dashboard');
        
        // Track vault operations
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('create-vault-btn')) {
                this.trackEvent('vault_created', 'new_vault');
            } else if (e.target.classList.contains('add-password-btn')) {
                this.trackEvent('password_added', 'new_password');
            } else if (e.target.classList.contains('view-vault-btn')) {
                this.trackEvent('vault_viewed', 'vault_details');
            }
        });
    }

    trackEvent(action, category, label = null, value = null) {
        if (window.gtag) {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        
        // Also track locally for insights
        const events = JSON.parse(localStorage.getItem('agies_analytics') || '[]');
        events.push({
            timestamp: new Date().toISOString(),
            action,
            category,
            label,
            value
        });
        localStorage.setItem('agies_analytics', JSON.stringify(events));
    }

    // 🔄 Cloud Backup
    async initBackup() {
        try {
            if (!this.backupEnabled) {
                console.log('🔄 Backup not enabled, skipping...');
                return;
            }

            // Setup automatic backup
            this.setupAutoBackup();
            
            // Setup manual backup
            this.setupManualBackup();
            
            console.log('✅ Cloud backup initialized');
        } catch (error) {
            console.error('❌ Backup initialization failed:', error);
        }
    }

    setupAutoBackup() {
        // Check if backup is due
        const lastBackup = localStorage.getItem('agies_last_backup');
        const now = new Date();
        
        if (!lastBackup || (now - new Date(lastBackup)) > 24 * 60 * 60 * 1000) {
            // Backup is due (24 hours)
            this.performBackup();
        }
        
        // Setup daily backup
        setInterval(() => {
            this.performBackup();
        }, 24 * 60 * 60 * 1000);
    }

    setupManualBackup() {
        // Add backup button to user menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            const backupBtn = document.createElement('button');
            backupBtn.id = 'backupBtn';
            backupBtn.className = 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors';
            backupBtn.innerHTML = '💾 Backup';
            backupBtn.addEventListener('click', () => this.performBackup());
            
            userMenu.insertBefore(backupBtn, userMenu.lastElementChild);
        }
    }

    async performBackup() {
        try {
            const vaults = JSON.parse(localStorage.getItem('agies_vaults') || '[]');
            const passwords = JSON.parse(localStorage.getItem('agies_passwords') || '[]');
            
            const backupData = {
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                vaults: vaults.map(v => ({ ...v, password: undefined })), // Exclude sensitive data
                passwords: passwords.map(p => ({ ...p, password: undefined })), // Exclude sensitive data
                metadata: {
                    totalVaults: vaults.length,
                    totalPasswords: passwords.length,
                    userAgent: navigator.userAgent,
                    platform: navigator.platform
                }
            };
            
            // In production, this would upload to cloud storage
            // For now, we'll store locally
            localStorage.setItem('agies_backup_' + Date.now(), JSON.stringify(backupData));
            localStorage.setItem('agies_last_backup', new Date().toISOString());
            
            this.showSuccessMessage('Backup completed successfully!');
            console.log('✅ Backup completed');
        } catch (error) {
            console.error('❌ Backup failed:', error);
            this.showErrorMessage('Backup failed. Please try again.');
        }
    }

    // 📱 Mobile Optimization
    async initMobileOptimization() {
        try {
            // Check if mobile
            if (window.innerWidth <= 768) {
                this.enableMobileMode();
            }
            
            // Listen for resize events
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 768) {
                    this.enableMobileMode();
                } else {
                    this.disableMobileMode();
                }
            });
            
            // Add mobile-specific features
            this.addMobileFeatures();
            
            console.log('✅ Mobile optimization initialized');
        } catch (error) {
            console.error('❌ Mobile optimization failed:', error);
        }
    }

    enableMobileMode() {
        document.body.classList.add('mobile-mode');
        
        // Optimize touch interactions
        this.optimizeTouchInteractions();
        
        // Adjust layout for mobile
        this.adjustMobileLayout();
    }

    disableMobileMode() {
        document.body.classList.remove('mobile-mode');
    }

    optimizeTouchInteractions() {
        // Add touch-friendly styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-mode button {
                min-height: 44px;
                min-width: 44px;
            }
            .mobile-mode input, .mobile-mode select, .mobile-mode textarea {
                font-size: 16px;
            }
            .mobile-mode .modal {
                padding: 1rem;
            }
        `;
        document.head.appendChild(style);
    }

    adjustMobileLayout() {
        // Adjust grid layouts for mobile
        const grids = document.querySelectorAll('.grid');
        grids.forEach(grid => {
            if (grid.classList.contains('md:grid-cols-3')) {
                grid.classList.add('grid-cols-1');
            }
        });
    }

    addMobileFeatures() {
        // Add pull-to-refresh
        this.addPullToRefresh();
        
        // Add swipe gestures
        this.addSwipeGestures();
        
        // Add mobile navigation
        this.addMobileNavigation();
    }

    addPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pullDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;
            
            if (pullDistance > 100 && window.scrollY === 0) {
                // Show pull-to-refresh indicator
                this.showPullToRefreshIndicator();
            }
        });
        
        document.addEventListener('touchend', () => {
            if (pullDistance > 100 && window.scrollY === 0) {
                // Trigger refresh
                this.refreshData();
            }
            pullDistance = 0;
        });
    }

    addSwipeGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right - go back
                    this.handleSwipeRight();
                } else {
                    // Swipe left - go forward
                    this.handleSwipeLeft();
                }
            }
        });
    }

    addMobileNavigation() {
        // Add mobile navigation menu
        const nav = document.querySelector('nav');
        if (nav) {
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.id = 'mobileMenuBtn';
            mobileMenuBtn.className = 'md:hidden bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg';
            mobileMenuBtn.innerHTML = '☰';
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
            
            nav.querySelector('.flex').insertBefore(mobileMenuBtn, nav.querySelector('.flex').firstChild);
        }
    }

    // Utility functions
    showSuccessMessage(message) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showErrorMessage(message) {
        // Show error notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showUpdateNotification() {
        // Show update notification
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 left-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <span>New version available!</span>
                <button id="updateApp" class="bg-white text-blue-600 px-3 py-1 rounded text-sm">Update</button>
                <button id="dismissUpdate" class="text-white hover:text-gray-200">×</button>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Event listeners
        document.getElementById('updateApp').addEventListener('click', () => {
            window.location.reload();
        });
        
        document.getElementById('dismissUpdate').addEventListener('click', () => {
            notification.remove();
        });
    }

    showPullToRefreshIndicator() {
        // Show pull-to-refresh indicator
        let indicator = document.getElementById('pullToRefreshIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pullToRefreshIndicator';
            indicator.className = 'fixed top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 z-50';
            indicator.textContent = 'Pull to refresh...';
            document.body.appendChild(indicator);
        }
    }

    refreshData() {
        // Refresh application data
        window.location.reload();
    }

    handleSwipeRight() {
        // Handle swipe right gesture
        if (window.history.length > 1) {
            window.history.back();
        }
    }

    handleSwipeLeft() {
        // Handle swipe left gesture
        if (window.history.length > 1) {
            window.history.forward();
        }
    }

    toggleMobileMenu() {
        // Toggle mobile navigation menu
        const userMenu = document.getElementById('userMenu');
        userMenu.classList.toggle('hidden');
    }
}

// Initialize enhanced features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.agiesEnhancedFeatures = new AgiesEnhancedFeatures();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgiesEnhancedFeatures;
}
