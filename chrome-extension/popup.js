// 🔐 Agies Password Manager - Popup Controller
// Handles popup interactions and communicates with background script

class AgiesPopupController {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔐 Agies Popup Controller Initialized');
        this.setupEventListeners();
        this.loadExtensionStatus();
        this.loadStatistics();
    }

    // 🎯 Setup Event Listeners
    setupEventListeners() {
        // Quick Actions
        document.getElementById('autofill-btn').addEventListener('click', () => {
            this.autofillCurrentPage();
        });

        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generatePassword();
        });

        // Security
        document.getElementById('security-check-btn').addEventListener('click', () => {
            this.performSecurityCheck();
        });

        document.getElementById('vpn-check-btn').addEventListener('click', () => {
            this.checkVPNStatus();
        });

        // Settings
        document.getElementById('open-dashboard-btn').addEventListener('click', () => {
            this.openDashboard();
        });
    }

    // 🔑 Autofill Current Page
    async autofillCurrentPage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab) {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: this.triggerAutofill
                });

                this.showNotification('Autofill triggered!', 'success');
            }
        } catch (error) {
            console.error('Failed to trigger autofill:', error);
            this.showNotification('Failed to trigger autofill', 'error');
        }
    }

    // 🎲 Generate Password
    async generatePassword() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab) {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: this.triggerPasswordGeneration
                });

                this.showNotification('Password generation triggered!', 'success');
            }
        } catch (error) {
            console.error('Failed to generate password:', error);
            this.showNotification('Failed to generate password', 'error');
        }
    }

    // 🛡️ Perform Security Check
    async performSecurityCheck() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab) {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: this.triggerSecurityCheck
                });

                this.showNotification('Security check started!', 'info');
            }
        } catch (error) {
            console.error('Failed to perform security check:', error);
            this.showNotification('Failed to perform security check', 'error');
        }
    }

    // 🌐 Check VPN Status
    async checkVPNStatus() {
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'CHECK_VPN_STATUS'
            });

            if (response.success) {
                const status = response.vpnStatus ? 'Connected' : 'Not Connected';
                const icon = response.vpnStatus ? '✅' : '❌';
                this.showNotification(`${icon} VPN Status: ${status}`, 'info');
            } else {
                this.showNotification('Failed to check VPN status', 'error');
            }
        } catch (error) {
            console.error('Failed to check VPN status:', error);
            this.showNotification('Failed to check VPN status', 'error');
        }
    }

    // 🏠 Open Dashboard
    openDashboard() {
        chrome.tabs.create({
            url: 'https://agies-password-manager.vercel.app/dashboard'
        });
    }

    // 👥 Open Vault Sharing
    openVaultSharing() {
        chrome.tabs.create({
            url: 'https://agies-password-manager.vercel.app/dashboard'
        });
    }

    // 📊 Load Extension Status
    async loadExtensionStatus() {
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'GET_EXTENSION_STATUS'
            });

            if (response.success) {
                console.log('Extension status:', response);
                // Update status display if needed
            }
        } catch (error) {
            console.error('Failed to load extension status:', error);
        }
    }

    // 📈 Load Statistics
    async loadStatistics() {
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'GET_STATISTICS'
            });

            if (response.success) {
                this.updateStatistics(response.statistics);
            }
        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
    }

    // 📊 Update Statistics Display
    updateStatistics(stats) {
        if (stats) {
            document.getElementById('passwords-count').textContent = stats.totalPasswords || 0;
            document.getElementById('sites-count').textContent = stats.totalSites || 0;
        }
    }

    // 🔔 Show Notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `agies-notification agies-notification-${type}`;
        notification.textContent = message;

        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'info': '#3b82f6',
            'warning': '#f59e0b'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10002;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    // 🎯 Injected Functions (these will be executed in the page context)
    triggerAutofill() {
        // This function runs in the page context
        chrome.runtime.sendMessage({
            type: 'AUTOFILL_REQUEST'
        });
    }

    triggerPasswordGeneration() {
        // This function runs in the page context
        chrome.runtime.sendMessage({
            type: 'GENERATE_PASSWORD'
        });
    }

    triggerSecurityCheck() {
        // This function runs in the page context
        chrome.runtime.sendMessage({
            type: 'SECURITY_CHECK_REQUEST'
        });
    }
}

// Initialize popup controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const popupController = new AgiesPopupController();
});

console.log('🔐 Agies Popup Controller Ready');