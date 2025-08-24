// 🔍 Agies Smart Form Detection Engine
// Advanced form detection with AI-powered field recognition

class AgiesFormDetector {
    constructor() {
        this.detectedForms = new Map();
        this.formObserver = null;
        this.fieldPatterns = {
            email: [
                'email', 'e-mail', 'mail', 'user', 'username', 'userid', 'user_name', 'user-name',
                'login', 'account', 'signin', 'sign-in', 'log-in'
            ],
            password: [
                'password', 'passwd', 'pass', 'pwd', 'secret', 'pin', 'code',
                'current-password', 'new-password'
            ],
            confirmPassword: [
                'confirm', 'verify', 'repeat', 'again', 'confirm-password', 'verify-password',
                'password-confirm', 'password-verification'
            ]
        };
        this.init();
    }

    init() {
        this.observeFormChanges();
        this.detectExistingForms();
        this.setupFormSubmissionListener();
    }

    // 🔍 Advanced form detection algorithm
    detectExistingForms() {
        const forms = document.querySelectorAll('form, div[role="form"], [data-testid*="form"], [id*="form"], [class*="form"]');
        forms.forEach(form => this.analyzeForm(form));
        
        // Also detect standalone login fields (like Gmail, Facebook)
        this.detectStandaloneFields();
    }

    analyzeForm(formElement) {
        const formData = {
            element: formElement,
            action: formElement.action || window.location.href,
            method: formElement.method || 'POST',
            fields: {
                email: null,
                password: null,
                confirmPassword: null,
                other: []
            },
            type: this.determineFormType(formElement),
            confidence: 0
        };

        // Find input fields
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => this.classifyField(input, formData));

        // Calculate confidence score
        formData.confidence = this.calculateConfidence(formData);

        if (formData.confidence > 0.6) {
            this.detectedForms.set(formElement, formData);
            this.addAgiesOverlay(formElement, formData);
        }

        return formData;
    }

    classifyField(input, formData) {
        const fieldInfo = this.analyzeFieldAttributes(input);
        
        if (fieldInfo.type === 'email') {
            formData.fields.email = input;
        } else if (fieldInfo.type === 'password') {
            if (!formData.fields.password) {
                formData.fields.password = input;
            } else if (fieldInfo.isConfirm) {
                formData.fields.confirmPassword = input;
            }
        } else {
            formData.fields.other.push({
                element: input,
                type: fieldInfo.type,
                confidence: fieldInfo.confidence
            });
        }
    }

    analyzeFieldAttributes(input) {
        const type = input.type?.toLowerCase() || '';
        const name = input.name?.toLowerCase() || '';
        const id = input.id?.toLowerCase() || '';
        const placeholder = input.placeholder?.toLowerCase() || '';
        const autocomplete = input.autocomplete?.toLowerCase() || '';
        const className = input.className?.toLowerCase() || '';
        
        const allText = `${type} ${name} ${id} ${placeholder} ${autocomplete} ${className}`;

        // Password field detection
        if (type === 'password' || autocomplete === 'current-password' || autocomplete === 'new-password') {
            return {
                type: 'password',
                confidence: 1.0,
                isConfirm: this.isConfirmPassword(allText)
            };
        }

        // Email field detection
        if (type === 'email' || autocomplete === 'email' || autocomplete === 'username') {
            return { type: 'email', confidence: 1.0 };
        }

        // Pattern matching for email
        const emailScore = this.calculatePatternScore(allText, this.fieldPatterns.email);
        const passwordScore = this.calculatePatternScore(allText, this.fieldPatterns.password);

        if (emailScore > 0.7) {
            return { type: 'email', confidence: emailScore };
        } else if (passwordScore > 0.7) {
            return { 
                type: 'password', 
                confidence: passwordScore,
                isConfirm: this.isConfirmPassword(allText)
            };
        }

        return { type: 'other', confidence: 0 };
    }

    calculatePatternScore(text, patterns) {
        let score = 0;
        let matches = 0;
        
        patterns.forEach(pattern => {
            if (text.includes(pattern)) {
                score += 1;
                matches++;
            }
        });

        return matches > 0 ? Math.min(score / patterns.length * 2, 1.0) : 0;
    }

    isConfirmPassword(text) {
        return this.fieldPatterns.confirmPassword.some(pattern => text.includes(pattern));
    }

    determineFormType(form) {
        const formText = form.textContent?.toLowerCase() || '';
        const action = form.action?.toLowerCase() || '';
        
        if (formText.includes('sign up') || formText.includes('register') || formText.includes('create account') ||
            action.includes('register') || action.includes('signup')) {
            return 'register';
        } else if (formText.includes('sign in') || formText.includes('log in') || formText.includes('login') ||
                   action.includes('login') || action.includes('signin')) {
            return 'login';
        } else if (formText.includes('forgot') || formText.includes('reset') || formText.includes('recover')) {
            return 'recovery';
        }
        
        return 'login'; // Default assumption
    }

    calculateConfidence(formData) {
        let confidence = 0;
        
        if (formData.fields.email) confidence += 0.4;
        if (formData.fields.password) confidence += 0.5;
        if (formData.type === 'login' || formData.type === 'register') confidence += 0.2;
        
        return Math.min(confidence, 1.0);
    }

    // 🔍 Detect standalone login fields (like on Gmail, Facebook)
    detectStandaloneFields() {
        const emailInputs = document.querySelectorAll('input[type="email"], input[type="text"][autocomplete*="email"], input[autocomplete="username"]');
        const passwordInputs = document.querySelectorAll('input[type="password"]');

        emailInputs.forEach(input => {
            if (!this.isInputInDetectedForm(input)) {
                this.createStandaloneFormGroup(input, 'email');
            }
        });

        passwordInputs.forEach(input => {
            if (!this.isInputInDetectedForm(input)) {
                this.createStandaloneFormGroup(input, 'password');
            }
        });
    }

    isInputInDetectedForm(input) {
        for (const [form] of this.detectedForms) {
            if (form.contains(input)) return true;
        }
        return false;
    }

    createStandaloneFormGroup(input, type) {
        const virtualForm = input.closest('form') || input.parentElement;
        const formData = {
            element: virtualForm,
            action: window.location.href,
            method: 'POST',
            fields: {
                email: type === 'email' ? input : null,
                password: type === 'password' ? input : null,
                confirmPassword: null,
                other: []
            },
            type: 'login',
            confidence: 0.8,
            isStandalone: true
        };

        this.detectedForms.set(virtualForm, formData);
        this.addAgiesOverlay(input, formData);
    }

    // 🎨 Add Agies overlay to detected forms
    addAgiesOverlay(element, formData) {
        const targetField = formData.fields.email || formData.fields.password;
        if (!targetField) return;

        // Remove existing overlay
        const existingOverlay = targetField.parentElement.querySelector('.agies-autofill-btn');
        if (existingOverlay) existingOverlay.remove();

        // Create Agies autofill button
        const overlay = document.createElement('div');
        overlay.className = 'agies-autofill-btn';
        overlay.innerHTML = `
            <button type="button" class="agies-fill-btn" title="Fill with Agies">
                🛡️
            </button>
        `;

        // Position the button
        const rect = targetField.getBoundingClientRect();
        overlay.style.cssText = `
            position: absolute;
            top: ${rect.top + window.scrollY + 2}px;
            right: ${window.innerWidth - rect.right + 2}px;
            z-index: 999999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // Add click handler
        overlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showAutofillDropdown(targetField, formData);
        });

        document.body.appendChild(overlay);

        // Update position on scroll/resize
        const updatePosition = () => {
            const newRect = targetField.getBoundingClientRect();
            overlay.style.top = `${newRect.top + window.scrollY + 2}px`;
            overlay.style.right = `${window.innerWidth - newRect.right + 2}px`;
        };

        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);
    }

    // 📋 Show autofill dropdown
    showAutofillDropdown(field, formData) {
        // Send message to background script to get passwords
        chrome.runtime.sendMessage({
            action: 'getPasswordsForSite',
            domain: window.location.hostname,
            url: window.location.href
        }, (response) => {
            if (response && response.passwords) {
                this.displayPasswordOptions(field, response.passwords, formData);
            }
        });
    }

    displayPasswordOptions(field, passwords, formData) {
        // Remove existing dropdown
        const existingDropdown = document.querySelector('.agies-password-dropdown');
        if (existingDropdown) existingDropdown.remove();

        const dropdown = document.createElement('div');
        dropdown.className = 'agies-password-dropdown';
        
        const rect = field.getBoundingClientRect();
        dropdown.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 5}px;
            left: ${rect.left}px;
            min-width: ${rect.width}px;
            max-width: 400px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 1000000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
        `;

        let dropdownHTML = `
            <div style="padding: 12px; border-bottom: 1px solid #e2e8f0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px 8px 0 0;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    🛡️ <strong>Agies Password Manager</strong>
                </div>
            </div>
        `;

        if (passwords.length > 0) {
            dropdownHTML += '<div style="max-height: 200px; overflow-y: auto;">';
            passwords.forEach((password, index) => {
                dropdownHTML += `
                    <div class="agies-password-option" data-index="${index}" style="
                        padding: 12px;
                        border-bottom: 1px solid #f1f5f9;
                        cursor: pointer;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                        <div style="font-weight: 500; color: #1e293b;">${password.title}</div>
                        <div style="font-size: 12px; color: #64748b;">${password.username}</div>
                        <div style="font-size: 11px; color: #94a3b8;">${password.url || window.location.hostname}</div>
                    </div>
                `;
            });
            dropdownHTML += '</div>';
        } else {
            dropdownHTML += `
                <div style="padding: 16px; text-align: center; color: #64748b;">
                    No passwords found for this site<br>
                    <button class="agies-add-password" style="
                        margin-top: 8px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">Add New Password</button>
                </div>
            `;
        }

        dropdown.innerHTML = dropdownHTML;

        // Add event listeners
        dropdown.querySelectorAll('.agies-password-option').forEach((option, index) => {
            option.addEventListener('click', () => {
                this.autofillPassword(passwords[index], formData);
                dropdown.remove();
            });
        });

        const addBtn = dropdown.querySelector('.agies-add-password');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.openAddPasswordDialog();
                dropdown.remove();
            });
        }

        // Close on outside click
        const closeDropdown = (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        };
        setTimeout(() => document.addEventListener('click', closeDropdown), 100);

        document.body.appendChild(dropdown);
    }

    // 🔐 Auto-fill password into form
    autofillPassword(passwordData, formData) {
        if (formData.fields.email && passwordData.username) {
            this.fillField(formData.fields.email, passwordData.username);
        }
        
        if (formData.fields.password && passwordData.password) {
            this.fillField(formData.fields.password, passwordData.password);
        }

        // Show success notification
        this.showNotification('🛡️ Password filled by Agies', 'success');
        
        // Track usage
        chrome.runtime.sendMessage({
            action: 'trackPasswordUsage',
            passwordId: passwordData.id
        });
    }

    fillField(field, value) {
        // Trigger focus
        field.focus();
        
        // Clear existing value
        field.value = '';
        
        // Set value
        field.value = value;
        
        // Trigger events that frameworks expect
        const events = ['input', 'change', 'keyup', 'blur'];
        events.forEach(eventType => {
            field.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    openAddPasswordDialog() {
        chrome.runtime.sendMessage({
            action: 'openPasswordManager',
            url: window.location.href,
            domain: window.location.hostname
        });
    }

    // 👀 Observe form changes
    observeFormChanges() {
        this.formObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('form, input, div[role="form"]')) {
                            setTimeout(() => this.detectExistingForms(), 100);
                        }
                    }
                });
            });
        });

        this.formObserver.observe(document, {
            childList: true,
            subtree: true
        });
    }

    // 📝 Listen for form submissions to capture new passwords
    setupFormSubmissionListener() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = this.detectedForms.get(form);
            
            if (formData && formData.fields.email && formData.fields.password) {
                const passwordData = {
                    title: this.generatePasswordTitle(),
                    username: formData.fields.email.value,
                    password: formData.fields.password.value,
                    url: window.location.href,
                    domain: window.location.hostname
                };

                // Ask user if they want to save this password
                this.showSavePasswordPrompt(passwordData);
            }
        }, true);
    }

    generatePasswordTitle() {
        const hostname = window.location.hostname;
        const siteName = hostname.replace(/^www\./, '').split('.')[0];
        return siteName.charAt(0).toUpperCase() + siteName.slice(1) + ' Account';
    }

    showSavePasswordPrompt(passwordData) {
        // Check if password already exists
        chrome.runtime.sendMessage({
            action: 'checkExistingPassword',
            username: passwordData.username,
            domain: passwordData.domain
        }, (response) => {
            if (!response.exists) {
                this.displaySavePrompt(passwordData);
            }
        });
    }

    displaySavePrompt(passwordData) {
        const prompt = document.createElement('div');
        prompt.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 1000002;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            width: 320px;
            animation: slideIn 0.3s ease;
        `;

        prompt.innerHTML = `
            <div style="padding: 16px; border-bottom: 1px solid #e2e8f0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    🛡️ <strong>Save to Agies?</strong>
                </div>
            </div>
            <div style="padding: 16px;">
                <div style="margin-bottom: 12px;">
                    <div style="font-weight: 500; color: #1e293b; margin-bottom: 4px;">${passwordData.title}</div>
                    <div style="font-size: 14px; color: #64748b;">${passwordData.username}</div>
                    <div style="font-size: 12px; color: #94a3b8;">${passwordData.domain}</div>
                </div>
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button class="agies-save-never" style="
                        background: #f1f5f9;
                        color: #64748b;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                    ">Never</button>
                    <button class="agies-save-not-now" style="
                        background: #e2e8f0;
                        color: #475569;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                    ">Not Now</button>
                    <button class="agies-save-yes" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 500;
                    ">Save</button>
                </div>
            </div>
        `;

        // Event listeners
        prompt.querySelector('.agies-save-yes').addEventListener('click', () => {
            this.savePassword(passwordData);
            prompt.remove();
        });

        prompt.querySelector('.agies-save-not-now').addEventListener('click', () => {
            prompt.remove();
        });

        prompt.querySelector('.agies-save-never').addEventListener('click', () => {
            chrome.runtime.sendMessage({
                action: 'addToNeverSaveList',
                domain: passwordData.domain
            });
            prompt.remove();
        });

        document.body.appendChild(prompt);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (prompt.parentNode) prompt.remove();
        }, 10000);
    }

    savePassword(passwordData) {
        chrome.runtime.sendMessage({
            action: 'savePassword',
            passwordData: passwordData
        }, (response) => {
            if (response.success) {
                this.showNotification('🛡️ Password saved to Agies', 'success');
            } else {
                this.showNotification('❌ Failed to save password', 'error');
            }
        });
    }
}

// Initialize the form detector
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AgiesFormDetector();
    });
} else {
    new AgiesFormDetector();
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
