// 🔐 Agies Password Manager - Content Script
// Handles form detection, autofill, and password capture

class AgiesContentScript {
    constructor() {
        this.forms = [];
        this.currentForm = null;
        this.overlay = null;
        this.init();
    }

    init() {
        console.log('🔐 Agies Content Script Initialized');
        this.detectForms();
        this.setupFormListeners();
        this.setupKeyboardShortcuts();
        this.createAutofillOverlay();
        this.setupMessageListeners();
    }

    // 🔍 Detect Login Forms
    detectForms() {
        const forms = document.querySelectorAll('form');
        this.forms = [];

        forms.forEach((form, index) => {
            const inputs = form.querySelectorAll('input');
            const usernameField = this.findUsernameField(inputs);
            const passwordField = this.findPasswordField(inputs);

            if (usernameField && passwordField) {
                this.forms.push({
                    form: form,
                    usernameField: usernameField,
                    passwordField: passwordField,
                    index: index,
                    detected: true
                });

                // Add visual indicator
                this.addFormIndicator(form, index);
            }
        });

        console.log(`🔍 Detected ${this.forms.length} login forms`);
        return this.forms;
    }

    // 🔍 Find Username Field
    findUsernameField(inputs) {
        for (const input of inputs) {
            const type = input.type.toLowerCase();
            const name = input.name.toLowerCase();
            const id = input.id.toLowerCase();
            const placeholder = input.placeholder.toLowerCase();

            if (type === 'text' || type === 'email') {
                if (name.includes('user') || name.includes('email') || name.includes('login') ||
                    id.includes('user') || id.includes('email') || id.includes('login') ||
                    placeholder.includes('user') || placeholder.includes('email') || placeholder.includes('login')) {
                    return input;
                }
            }
        }

        // Fallback: first text/email input
        for (const input of inputs) {
            if (input.type === 'text' || input.type === 'email') {
                return input;
            }
        }

        return null;
    }

    // 🔍 Find Password Field
    findPasswordField(inputs) {
        for (const input of inputs) {
            if (input.type === 'password') {
                return input;
            }
        }
        return null;
    }

    // 🎨 Add Form Indicator
    addFormIndicator(form, index) {
        const indicator = document.createElement('div');
        indicator.className = 'agies-form-indicator';
        indicator.innerHTML = `
            <div class="agies-indicator-content">
                <span class="agies-indicator-icon">🔐</span>
                <span class="agies-indicator-text">Agies Detected</span>
                <button class="agies-autofill-btn" data-form-index="${index}">Autofill</button>
            </div>
        `;

        indicator.style.cssText = `
            position: absolute;
            top: -30px;
            right: 0;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Style the autofill button
        const autofillBtn = indicator.querySelector('.agies-autofill-btn');
        autofillBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 8px;
            font-size: 11px;
            transition: background 0.2s ease;
        `;

        autofillBtn.addEventListener('mouseenter', () => {
            autofillBtn.style.background = 'rgba(255,255,255,0.3)';
        });

        autofillBtn.addEventListener('mouseleave', () => {
            autofillBtn.style.background = 'rgba(255,255,255,0.2)';
        });

        autofillBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.autofillForm(index);
        });

        // Position the indicator
        form.style.position = 'relative';
        form.appendChild(indicator);

        // Show indicator on hover
        form.addEventListener('mouseenter', () => {
            indicator.style.opacity = '1';
        });

        form.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0';
        });
    }

    // 🔑 Autofill Form
    async autofillForm(formIndex) {
        const formData = this.forms[formIndex];
        if (!formData) return;

        try {
            // Request passwords from background script
            const response = await chrome.runtime.sendMessage({
                type: 'AUTOFILL_REQUEST'
            });

            if (response.success && response.passwords.length > 0) {
                const password = response.passwords[0];
                
                // Fill username
                if (formData.usernameField) {
                    formData.usernameField.value = password.username;
                    formData.usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                    formData.usernameField.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Fill password
                if (formData.passwordField) {
                    formData.passwordField.value = password.password;
                    formData.passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                    formData.passwordField.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Show success message
                this.showAutofillSuccess();
                
                // Track usage
                chrome.runtime.sendMessage({
                    type: 'PASSWORD_USED',
                    data: { passwordId: password.id, domain: window.location.hostname }
                });

            } else {
                this.showNoPasswordsMessage();
            }
        } catch (error) {
            console.error('Autofill failed:', error);
            this.showAutofillError();
        }
    }

    // 🎯 Setup Form Listeners
    setupFormListeners() {
        this.forms.forEach((formData, index) => {
            const form = formData.form;
            
            // Listen for form submission
            form.addEventListener('submit', (e) => {
                this.handleFormSubmission(e, formData);
            });

            // Listen for password field focus
            if (formData.passwordField) {
                formData.passwordField.addEventListener('focus', () => {
                    this.currentForm = formData;
                    this.showPasswordSuggestions(formData);
                });
            }

            // Listen for username field focus
            if (formData.usernameField) {
                formData.usernameField.addEventListener('focus', () => {
                    this.currentForm = formData;
                });
            }
        });
    }

    // 📝 Handle Form Submission
    async handleFormSubmission(event, formData) {
        const username = formData.usernameField ? formData.usernameField.value : '';
        const password = formData.passwordField ? formData.passwordField.value : '';

        if (username && password) {
            // Offer to save password
            this.offerPasswordSave({
                title: document.title,
                username: username,
                password: password,
                url: window.location.href
            });
        }
    }

    // 💾 Offer Password Save
    offerPasswordSave(passwordData) {
        const saveDialog = document.createElement('div');
        saveDialog.className = 'agies-save-dialog';
        saveDialog.innerHTML = `
            <div class="agies-save-content">
                <div class="agies-save-header">
                    <span class="agies-save-icon">🔐</span>
                    <span class="agies-save-title">Save Password?</span>
                </div>
                <div class="agies-save-details">
                    <div class="agies-save-site">${new URL(passwordData.url).hostname}</div>
                    <div class="agies-save-username">Username: ${passwordData.username}</div>
                </div>
                <div class="agies-save-actions">
                    <button class="agies-save-yes">Save</button>
                    <button class="agies-save-no">Never</button>
                    <button class="agies-save-cancel">Cancel</button>
                </div>
            </div>
        `;

        saveDialog.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 10001;
            font-family: Arial, sans-serif;
            min-width: 300px;
            border: 1px solid #e5e7eb;
        `;

        // Style the dialog
        const content = saveDialog.querySelector('.agies-save-content');
        content.style.cssText = `
            padding: 20px;
        `;

        const header = saveDialog.querySelector('.agies-save-header');
        header.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            gap: 8px;
        `;

        const icon = saveDialog.querySelector('.agies-save-icon');
        icon.style.cssText = `
            font-size: 20px;
        `;

        const title = saveDialog.querySelector('.agies-save-title');
        title.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            color: #1f2937;
        `;

        const details = saveDialog.querySelector('.agies-save-details');
        details.style.cssText = `
            margin-bottom: 20px;
        `;

        const site = saveDialog.querySelector('.agies-save-site');
        site.style.cssText = `
            font-weight: bold;
            color: #374151;
            margin-bottom: 4px;
        `;

        const username = saveDialog.querySelector('.agies-save-username');
        username.style.cssText = `
            color: #6b7280;
            font-size: 14px;
        `;

        const actions = saveDialog.querySelector('.agies-save-actions');
        actions.style.cssText = `
            display: flex;
            gap: 8px;
        `;

        // Style buttons
        const buttons = actions.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.style.cssText = `
                padding: 8px 16px;
                border-radius: 6px;
                border: none;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
        });

        const saveBtn = saveDialog.querySelector('.agies-save-yes');
        saveBtn.style.cssText += `
            background: #10b981;
            color: white;
        `;
        saveBtn.addEventListener('mouseenter', () => {
            saveBtn.style.background = '#059669';
        });
        saveBtn.addEventListener('mouseleave', () => {
            saveBtn.style.background = '#10b981';
        });

        const neverBtn = saveDialog.querySelector('.agies-save-no');
        neverBtn.style.cssText += `
            background: #f59e0b;
            color: white;
        `;
        neverBtn.addEventListener('mouseenter', () => {
            neverBtn.style.background = '#d97706';
        });
        neverBtn.addEventListener('mouseleave', () => {
            neverBtn.style.background = '#f59e0b';
        });

        const cancelBtn = saveDialog.querySelector('.agies-save-cancel');
        cancelBtn.style.cssText += `
            background: #6b7280;
            color: white;
        `;
        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.background = '#4b5563';
        });
        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.background = '#6b7280';
        });

        // Add event listeners
        saveBtn.addEventListener('click', () => {
            this.savePassword(passwordData);
            document.body.removeChild(saveDialog);
        });

        neverBtn.addEventListener('click', () => {
            this.addToNeverSaveList(passwordData.url);
            document.body.removeChild(saveDialog);
        });

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(saveDialog);
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(saveDialog)) {
                document.body.removeChild(saveDialog);
            }
        }, 10000);

        document.body.appendChild(saveDialog);
    }

    // 💾 Save Password
    async savePassword(passwordData) {
        try {
            await chrome.runtime.sendMessage({
                type: 'SAVE_PASSWORD',
                data: passwordData
            });

            this.showNotification('Password saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save password:', error);
            this.showNotification('Failed to save password', 'error');
        }
    }

    // 🚫 Add to Never Save List
    async addToNeverSaveList(url) {
        try {
            await chrome.runtime.sendMessage({
                type: 'ADD_TO_NEVER_SAVE',
                data: { url: url }
            });

            this.showNotification('Site added to never save list', 'info');
        } catch (error) {
            console.error('Failed to add to never save list:', error);
        }
    }

    // 🎯 Setup Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+A for autofill
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                if (this.currentForm) {
                    const index = this.forms.findIndex(f => f === this.currentForm);
                    if (index !== -1) {
                        this.autofillForm(index);
                    }
                }
            }

            // Ctrl+Shift+G for password generation
            if (e.ctrlKey && e.shiftKey && e.key === 'G') {
                e.preventDefault();
                this.generatePassword();
            }
        });
    }

    // 🎲 Generate Password
    async generatePassword() {
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'GENERATE_PASSWORD'
            });

            if (response.success) {
                // The password will be shown by the background script
                this.showNotification('Password generated and copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Failed to generate password:', error);
            this.showNotification('Failed to generate password', 'error');
        }
    }

    // 🎨 Create Autofill Overlay
    createAutofillOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'agies-autofill-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
        `;

        this.overlay.innerHTML = `
            <div class="agies-overlay-content">
                <div class="agies-overlay-header">
                    <span class="agies-overlay-icon">🔐</span>
                    <span class="agies-overlay-title">Agies Password Manager</span>
                </div>
                <div class="agies-overlay-body">
                    <p>Click outside to close</p>
                </div>
            </div>
        `;

        // Style overlay content
        const content = this.overlay.querySelector('.agies-overlay-content');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        `;

        const header = this.overlay.querySelector('.agies-overlay-header');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 16px;
        `;

        const icon = this.overlay.querySelector('.agies-overlay-icon');
        icon.style.cssText = `
            font-size: 24px;
        `;

        const title = this.overlay.querySelector('.agies-overlay-title');
        title.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
        `;

        const body = this.overlay.querySelector('.agies-overlay-body');
        body.style.cssText = `
            color: #6b7280;
        `;

        // Close overlay when clicking outside
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hideOverlay();
            }
        });

        document.body.appendChild(this.overlay);
    }

    // 🎯 Show Password Suggestions
    showPasswordSuggestions(formData) {
        // This would show a dropdown with password suggestions
        // For now, we'll just show the overlay
        this.showOverlay();
    }

    // 🎯 Show Overlay
    showOverlay() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
        }
    }

    // 🎯 Hide Overlay
    hideOverlay() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }

    // 📱 Setup Message Listeners
    setupMessageListeners() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('🔐 Content script message received:', message);
            this.handleMessage(message, sender, sendResponse);
        });
    }

    // 📨 Handle Messages
    handleMessage(message, sender, sendResponse) {
        try {
            switch (message.action) {
                case 'triggerAutofill':
                    this.handleAutofillRequest(message, sendResponse);
                    break;
                    
                case 'capturePassword':
                    this.handlePasswordCapture(message, sendResponse);
                    break;
                    
                case 'generatePassword':
                    this.handlePasswordGeneration(message, sendResponse);
                    break;
                    
                case 'prepareAutofill':
                    this.prepareAutofill(message, sendResponse);
                    break;
                    
                default:
                    console.log('Unknown message action:', message.action);
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('❌ Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    // 🚀 Handle Autofill Request
    async handleAutofillRequest(message, sendResponse) {
        try {
            console.log('🚀 Handling autofill request...');
            
            // Get passwords from background script
            const response = await chrome.runtime.sendMessage({ action: 'getPasswords' });
            
            if (response && response.success && response.passwords.length > 0) {
                // Find best match for current domain
                const currentDomain = window.location.hostname;
                const bestMatch = response.passwords.find(p => p.domain === currentDomain) || response.passwords[0];
                
                // Perform autofill
                this.performAutofill(bestMatch);
                sendResponse({ success: true, message: 'Autofill completed' });
            } else {
                this.showNoPasswordsMessage();
                sendResponse({ success: false, message: 'No passwords found' });
            }
        } catch (error) {
            console.error('❌ Autofill request failed:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    // 📥 Handle Password Capture
    async handlePasswordCapture(message, sendResponse) {
        try {
            console.log('📥 Handling password capture...');
            
            const formData = this.captureCurrentForm();
            if (formData) {
                await chrome.runtime.sendMessage({
                    action: 'savePassword',
                    data: formData
                });
                
                this.showNotification('✅ Password captured and saved!', 'success');
                sendResponse({ success: true, message: 'Password captured' });
            } else {
                sendResponse({ success: false, message: 'No form data found' });
            }
        } catch (error) {
            console.error('❌ Password capture failed:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    // ✨ Handle Password Generation
    async handlePasswordGeneration(message, sendResponse) {
        try {
            console.log('✨ Handling password generation...');
            
            const password = this.generateSecurePassword();
            
            // Copy to clipboard
            await navigator.clipboard.writeText(password);
            
            this.showNotification('🔐 Password generated and copied to clipboard!', 'success');
            sendResponse({ success: true, password: password });
        } catch (error) {
            console.error('❌ Password generation failed:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    // 🎯 Prepare Autofill
    async prepareAutofill(message, sendResponse) {
        try {
            console.log('🎯 Preparing autofill for:', message.url);
            
            // Detect forms and prepare autofill
            this.detectForms();
            this.setupFormListeners();
            
            sendResponse({ success: true, message: 'Autofill prepared' });
        } catch (error) {
            console.error('❌ Autofill preparation failed:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    // 🔐 Perform Actual Autofill
    performAutofill(passwordData) {
        try {
            // Find username and password fields
            const usernameField = document.querySelector('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]');
            const passwordField = document.querySelector('input[type="password"]');
            
            if (usernameField && passwordField) {
                // Fill username
                usernameField.value = passwordData.username;
                usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Fill password
                passwordField.value = passwordData.password;
                passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                
                this.showAutofillSuccess();
                console.log('✅ Autofill completed successfully');
            } else {
                this.showAutofillError();
            }
        } catch (error) {
            console.error('❌ Autofill failed:', error);
            this.showAutofillError();
        }
    }

    // 📝 Capture Current Form Data
    captureCurrentForm() {
        try {
            const usernameField = document.querySelector('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]');
            const passwordField = document.querySelector('input[type="password"]');
            
            if (usernameField && passwordField) {
                return {
                    title: document.title,
                    username: usernameField.value,
                    password: passwordField.value,
                    url: window.location.href,
                    domain: window.location.hostname,
                    timestamp: Date.now()
                };
            }
            return null;
        } catch (error) {
            console.error('❌ Form capture failed:', error);
            return null;
        }
    }

    // 🔐 Generate Secure Password
    generateSecurePassword(length = 16) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let password = '';
        
        // Ensure at least one character from each category
        password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
        password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
        password += '0123456789'[Math.floor(Math.random() * 10)];
        password += '!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 32)];
        
        // Fill the rest randomly
        for (let i = 4; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        
        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    // 🔔 Show Notification
    showNotification(message, type = 'info') {
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

    // ✅ Show Autofill Success
    showAutofillSuccess() {
        this.showNotification('✅ Forms autofilled successfully!', 'success');
    }

    // ❌ Show No Passwords Message
    showNoPasswordsMessage() {
        this.showNotification('No saved passwords found for this site', 'info');
    }

    // ❌ Show Autofill Error
    showAutofillError() {
        this.showNotification('Failed to autofill forms', 'error');
    }
}

// Initialize content script
const agiesContent = new AgiesContentScript();

console.log('🔐 Agies Content Script Ready');
