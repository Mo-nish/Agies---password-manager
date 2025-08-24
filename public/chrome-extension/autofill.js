// 🤖 Agies Enhanced Autofill Engine
// Smart, context-aware password filling with 1Password-level intelligence

class AgiesAutofillEngine {
    constructor() {
        this.isActive = false;
        this.contextData = null;
        this.fillHistory = new Map();
        this.smartSuggestions = [];
        this.init();
    }

    init() {
        this.setupGlobalKeyboardShortcuts();
        this.setupContextMenuIntegration();
        this.loadUserPreferences();
        this.startContextAnalysis();
    }

    // ⌨️ Global keyboard shortcuts like 1Password
    setupGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + L (1Password-style autofill)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.triggerSmartAutofill();
            }
            
            // Ctrl/Cmd + \ (1Password alternative shortcut)
            if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
                e.preventDefault();
                this.triggerQuickFill();
            }
        });
    }

    // 🎯 Context-aware autofill trigger
    async triggerSmartAutofill() {
        const context = await this.analyzeCurrentContext();
        
        if (context.loginFields.length === 0) {
            this.showNoFieldsNotification();
            return;
        }

        const passwords = await this.getRelevantPasswords(context);
        
        if (passwords.length === 0) {
            this.showNoPasswordsNotification(context);
            return;
        }

        if (passwords.length === 1) {
            // Auto-fill if only one match
            this.performAutofill(passwords[0], context);
        } else {
            // Show smart selection overlay
            this.showSmartSelectionOverlay(passwords, context);
        }
    }

    // ⚡ Quick fill for the most likely password
    async triggerQuickFill() {
        const context = await this.analyzeCurrentContext();
        const bestMatch = await this.findBestPasswordMatch(context);
        
        if (bestMatch) {
            this.performAutofill(bestMatch, context);
        } else {
            this.triggerSmartAutofill(); // Fallback to smart autofill
        }
    }

    // 🧠 Advanced context analysis
    async analyzeCurrentContext() {
        const context = {
            url: window.location.href,
            domain: window.location.hostname,
            title: document.title,
            loginFields: [],
            formType: 'unknown',
            confidence: 0,
            metadata: {}
        };

        // Find all potential login fields
        context.loginFields = this.findAllLoginFields();
        
        // Determine form type and confidence
        context.formType = this.determineFormType();
        context.confidence = this.calculateContextConfidence(context);
        
        // Extract additional metadata
        context.metadata = this.extractPageMetadata();

        return context;
    }

    findAllLoginFields() {
        const fields = [];
        
        // Find email/username fields
        const emailSelectors = [
            'input[type="email"]',
            'input[type="text"][autocomplete*="email"]',
            'input[type="text"][autocomplete="username"]',
            'input[name*="email" i]',
            'input[name*="user" i]',
            'input[id*="email" i]',
            'input[id*="user" i]',
            'input[placeholder*="email" i]',
            'input[placeholder*="user" i]'
        ];

        // Find password fields
        const passwordSelectors = [
            'input[type="password"]',
            'input[autocomplete="current-password"]',
            'input[autocomplete="new-password"]'
        ];

        emailSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (this.isFieldVisible(el)) {
                    fields.push({
                        element: el,
                        type: 'email',
                        confidence: this.calculateFieldConfidence(el, 'email')
                    });
                }
            });
        });

        passwordSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (this.isFieldVisible(el)) {
                    fields.push({
                        element: el,
                        type: 'password',
                        confidence: this.calculateFieldConfidence(el, 'password')
                    });
                }
            });
        });

        return fields.sort((a, b) => b.confidence - a.confidence);
    }

    isFieldVisible(element) {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               rect.width > 0 && 
               rect.height > 0;
    }

    calculateFieldConfidence(element, expectedType) {
        let confidence = 0.5; // Base confidence
        
        const type = element.type?.toLowerCase();
        const name = element.name?.toLowerCase() || '';
        const id = element.id?.toLowerCase() || '';
        const placeholder = element.placeholder?.toLowerCase() || '';
        const autocomplete = element.autocomplete?.toLowerCase() || '';
        
        // Type matching
        if (expectedType === 'email' && (type === 'email' || autocomplete.includes('email'))) {
            confidence += 0.3;
        } else if (expectedType === 'password' && type === 'password') {
            confidence += 0.4;
        }
        
        // Attribute matching
        const allText = `${name} ${id} ${placeholder} ${autocomplete}`.toLowerCase();
        if (expectedType === 'email' && /(email|user|login)/.test(allText)) {
            confidence += 0.2;
        } else if (expectedType === 'password' && /password/.test(allText)) {
            confidence += 0.2;
        }
        
        return Math.min(confidence, 1.0);
    }

    determineFormType() {
        const pageText = document.body.textContent.toLowerCase();
        const url = window.location.href.toLowerCase();
        
        if (/(sign.?up|register|create.?account)/.test(pageText) || /register|signup/.test(url)) {
            return 'register';
        } else if (/(sign.?in|log.?in|login)/.test(pageText) || /login|signin/.test(url)) {
            return 'login';
        } else if (/(forgot|reset|recover)/.test(pageText)) {
            return 'reset';
        }
        
        return 'login'; // Default
    }

    calculateContextConfidence(context) {
        let confidence = 0;
        
        if (context.loginFields.length > 0) confidence += 0.4;
        if (context.loginFields.some(f => f.type === 'email')) confidence += 0.3;
        if (context.loginFields.some(f => f.type === 'password')) confidence += 0.3;
        
        return confidence;
    }

    extractPageMetadata() {
        return {
            hasSignInText: /sign.?in|log.?in/i.test(document.body.textContent),
            hasSignUpText: /sign.?up|register/i.test(document.body.textContent),
            formCount: document.querySelectorAll('form').length,
            isKnownSite: this.isKnownLoginSite()
        };
    }

    isKnownLoginSite() {
        const knownSites = [
            'google.com', 'facebook.com', 'twitter.com', 'linkedin.com', 
            'github.com', 'microsoft.com', 'apple.com', 'amazon.com'
        ];
        return knownSites.some(site => window.location.hostname.includes(site));
    }

    // 🔍 Get relevant passwords based on context
    async getRelevantPasswords(context) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                action: 'getPasswordsForSite',
                domain: context.domain,
                url: context.url,
                context: context
            }, (response) => {
                if (response && response.passwords) {
                    // Sort by relevance
                    const sortedPasswords = this.sortPasswordsByRelevance(response.passwords, context);
                    resolve(sortedPasswords);
                } else {
                    resolve([]);
                }
            });
        });
    }

    sortPasswordsByRelevance(passwords, context) {
        return passwords.map(password => {
            const relevanceScore = this.calculatePasswordRelevance(password, context);
            return { ...password, relevanceScore };
        }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    calculatePasswordRelevance(password, context) {
        let score = 0;
        
        // Exact domain match
        if (password.url && password.url.includes(context.domain)) {
            score += 1.0;
        }
        
        // Subdomain match
        const passwordDomain = this.extractDomain(password.url);
        if (passwordDomain && context.domain.includes(passwordDomain)) {
            score += 0.7;
        }
        
        // Recent usage
        if (password.lastUsed) {
            const daysSinceUsed = (Date.now() - new Date(password.lastUsed)) / (1000 * 60 * 60 * 24);
            score += Math.max(0, 0.3 - (daysSinceUsed * 0.01));
        }
        
        // Title/site name similarity
        const siteName = this.extractSiteName(context.domain);
        if (password.title.toLowerCase().includes(siteName.toLowerCase())) {
            score += 0.2;
        }
        
        return score;
    }

    extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return null;
        }
    }

    extractSiteName(domain) {
        return domain.replace(/^www\./, '').split('.')[0];
    }

    // 🎯 Find the best password match automatically
    async findBestPasswordMatch(context) {
        const passwords = await this.getRelevantPasswords(context);
        return passwords.length > 0 ? passwords[0] : null;
    }

    // 🎨 Show smart selection overlay (1Password-style)
    showSmartSelectionOverlay(passwords, context) {
        // Remove existing overlay
        const existingOverlay = document.querySelector('.agies-smart-overlay');
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement('div');
        overlay.className = 'agies-smart-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 480px;
            width: 90%;
            max-height: 600px;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        let dialogHTML = `
            <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <div style="display: flex; align-items: center; justify-content: between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 24px;">🛡️</div>
                        <div>
                            <div style="font-size: 18px; font-weight: 600;">Choose Account</div>
                            <div style="font-size: 14px; opacity: 0.9;">${context.domain}</div>
                        </div>
                    </div>
                    <button class="agies-close-overlay" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 20px;
                        cursor: pointer;
                        opacity: 0.8;
                        transition: opacity 0.2s;
                    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">×</button>
                </div>
            </div>
        `;

        dialogHTML += '<div style="max-height: 400px; overflow-y: auto;">';

        passwords.slice(0, 10).forEach((password, index) => {
            const isRecommended = index === 0 && password.relevanceScore > 0.8;
            dialogHTML += `
                <div class="agies-password-item" data-index="${index}" style="
                    padding: 16px 20px;
                    border-bottom: 1px solid #f1f5f9;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    ${isRecommended ? 'background: linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%);' : ''}
                " onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='${isRecommended ? 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)' : 'white'}'">
                    ${isRecommended ? '<div style="position: absolute; top: 12px; right: 16px; background: #10b981; color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: 500;">RECOMMENDED</div>' : ''}
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 16px;">
                            ${password.title.charAt(0).toUpperCase()}
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-weight: 500; color: #1e293b; margin-bottom: 2px;">${password.title}</div>
                            <div style="font-size: 14px; color: #64748b; margin-bottom: 2px;">${password.username}</div>
                            <div style="font-size: 12px; color: #94a3b8; truncate;">${password.url || context.domain}</div>
                        </div>
                        <div style="text-align: right; color: #94a3b8; font-size: 12px;">
                            ${password.lastUsed ? this.formatLastUsed(password.lastUsed) : 'Never used'}
                        </div>
                    </div>
                </div>
            `;
        });

        dialogHTML += '</div>';

        // Add footer with shortcuts
        dialogHTML += `
            <div style="padding: 16px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
                <div style="text-align: center; color: #64748b; font-size: 12px;">
                    Press <kbd style="background: white; padding: 2px 6px; border-radius: 3px; border: 1px solid #e2e8f0;">Enter</kbd> to fill • <kbd style="background: white; padding: 2px 6px; border-radius: 3px; border: 1px solid #e2e8f0;">Esc</kbd> to cancel
                </div>
            </div>
        `;

        dialog.innerHTML = dialogHTML;

        // Event listeners
        let selectedIndex = 0;
        const items = dialog.querySelectorAll('.agies-password-item');
        
        // Highlight first item
        if (items[0]) items[0].style.background = '#e0e7ff';

        // Keyboard navigation
        const handleKeyboard = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleKeyboard);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                items[selectedIndex].style.background = passwords[selectedIndex].relevanceScore > 0.8 && selectedIndex === 0 ? 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)' : 'white';
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                items[selectedIndex].style.background = '#e0e7ff';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                items[selectedIndex].style.background = passwords[selectedIndex].relevanceScore > 0.8 && selectedIndex === 0 ? 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)' : 'white';
                selectedIndex = Math.max(selectedIndex - 1, 0);
                items[selectedIndex].style.background = '#e0e7ff';
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.performAutofill(passwords[selectedIndex], context);
                overlay.remove();
                document.removeEventListener('keydown', handleKeyboard);
            }
        };

        document.addEventListener('keydown', handleKeyboard);

        // Click handlers
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.performAutofill(passwords[index], context);
                overlay.remove();
                document.removeEventListener('keydown', handleKeyboard);
            });
        });

        // Close button
        dialog.querySelector('.agies-close-overlay').addEventListener('click', () => {
            overlay.remove();
            document.removeEventListener('keydown', handleKeyboard);
        });

        // Close on outside click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                document.removeEventListener('keydown', handleKeyboard);
            }
        });

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }

    formatLastUsed(lastUsed) {
        const date = new Date(lastUsed);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
        return `${Math.floor(diffInDays / 365)} years ago`;
    }

    // 🔐 Perform the actual autofill
    async performAutofill(password, context) {
        const emailField = context.loginFields.find(f => f.type === 'email');
        const passwordField = context.loginFields.find(f => f.type === 'password');

        if (emailField && password.username) {
            await this.simulateHumanTyping(emailField.element, password.username);
        }

        if (passwordField && password.password) {
            // Small delay between filling email and password (more human-like)
            setTimeout(async () => {
                await this.simulateHumanTyping(passwordField.element, password.password);
                
                // Show success notification
                this.showAutofillSuccess(password);
                
                // Track usage
                this.trackPasswordUsage(password);
            }, 100);
        }
    }

    // ⌨️ Simulate human-like typing
    async simulateHumanTyping(element, text) {
        element.focus();
        element.value = '';

        // Type character by character with human-like delays
        for (let i = 0; i < text.length; i++) {
            element.value += text[i];
            
            // Trigger input events
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('keyup', { bubbles: true }));
            
            // Random delay between 10-30ms
            await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 10));
        }

        // Final events
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    showAutofillSuccess(password) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
            z-index: 1000001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        notification.innerHTML = `
            🛡️ <strong>Filled by Agies</strong> • ${password.title}
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    trackPasswordUsage(password) {
        chrome.runtime.sendMessage({
            action: 'trackPasswordUsage',
            passwordId: password.id,
            domain: window.location.hostname,
            timestamp: Date.now()
        });
    }

    // 📱 Setup context menu integration
    setupContextMenuIntegration() {
        document.addEventListener('contextmenu', (e) => {
            const target = e.target;
            if (target.matches('input[type="email"], input[type="text"], input[type="password"]')) {
                chrome.runtime.sendMessage({
                    action: 'updateContextMenu',
                    fieldType: target.type,
                    domain: window.location.hostname
                });
            }
        });
    }

    // 🔧 Load user preferences
    loadUserPreferences() {
        chrome.storage.sync.get(['autofillPreferences'], (result) => {
            if (result.autofillPreferences) {
                this.preferences = result.autofillPreferences;
            } else {
                this.preferences = {
                    enableKeyboardShortcuts: true,
                    showAutofillButton: true,
                    enableSmartSuggestions: true,
                    typingSpeed: 'normal'
                };
            }
        });
    }

    // 🎯 Start context analysis for proactive suggestions
    startContextAnalysis() {
        // Analyze page context every 2 seconds for new forms
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.analyzeCurrentContext().then(context => {
                    this.contextData = context;
                    this.updateSmartSuggestions(context);
                });
            }
        }, 2000);
    }

    updateSmartSuggestions(context) {
        if (context.confidence > 0.7 && context.loginFields.length > 0) {
            this.getRelevantPasswords(context).then(passwords => {
                if (passwords.length > 0) {
                    this.smartSuggestions = passwords.slice(0, 3);
                }
            });
        }
    }

    // 🚫 Show notifications for various states
    showNoFieldsNotification() {
        this.showNotification('🔍 No login fields found on this page', 'info');
    }

    showNoPasswordsNotification(context) {
        this.showNotification(`🔐 No passwords saved for ${context.domain}`, 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            info: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// CSS Animations
const autofillStyle = document.createElement('style');
autofillStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(autofillStyle);

// Initialize the autofill engine
const agiesAutofill = new AgiesAutofillEngine();

// Export for use by other scripts
window.agiesAutofill = agiesAutofill;
