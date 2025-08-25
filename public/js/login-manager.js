// 🔐 Login Manager - Maze Password Manager
// Handles authentication flow with animated transitions

class LoginManager {
    constructor() {
        this.currentStep = 'login';
        this.steps = ['login', '2fa', 'success', 'forgot-password', 'signup'];
        this.formData = {};
        this.isAuthenticating = false;
        
        this.init();
    }

    init() {
        console.log('🔐 Initializing Login Manager...');
        
        // Check if user is already authenticated
        if (this.checkAuthStatus()) {
            return; // User will be redirected
        }
        
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupOTPInput();
        this.animateBackground();
        
        console.log('✅ Login Manager initialized successfully');
    }

    setupEventListeners() {
        // Login form submission
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Signup form submission
        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Forgot password form submission
        document.getElementById('forgot-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Navigation buttons
        document.getElementById('show-signup-btn').addEventListener('click', () => {
            this.showStep('signup');
        });

        document.getElementById('show-login-btn').addEventListener('click', () => {
            this.showStep('login');
        });

        document.getElementById('forgot-password-btn').addEventListener('click', () => {
            this.showStep('forgot-password');
        });

        document.getElementById('back-to-login').addEventListener('click', () => {
            this.showStep('login');
        });

        document.getElementById('back-to-login-from-forgot').addEventListener('click', () => {
            this.showStep('login');
        });

        // 2FA verification
        document.getElementById('verify-2fa-btn').addEventListener('click', () => {
            this.handle2FAVerification();
        });

        document.getElementById('resend-code-btn').addEventListener('click', () => {
            this.resend2FACode();
        });

        // Social login buttons
        document.querySelector('.social-btn.google').addEventListener('click', () => {
            this.handleSocialLogin('google');
        });

        document.querySelector('.social-btn.apple').addEventListener('click', () => {
            this.handleSocialLogin('apple');
        });

        // Form input validation
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateInput(e.target);
            });

            input.addEventListener('blur', (e) => {
                this.validateInput(e.target);
            });
        });
    }

    setupFormValidation() {
        // Real-time validation for signup form
        const signupPassword = document.getElementById('signup-password');
        const signupConfirmPassword = document.getElementById('signup-confirm-password');

        if (signupPassword && signupConfirmPassword) {
            signupConfirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        }
    }

    setupOTPInput() {
        const otpInputs = document.querySelectorAll('.otp-digit');
        
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                
                if (value.length === 1) {
                    // Move to next input
                    if (index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                } else if (value.length === 0) {
                    // Move to previous input on backspace
                    if (index > 0) {
                        otpInputs[index - 1].focus();
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value.length === 0) {
                    if (index > 0) {
                        otpInputs[index - 1].focus();
                    }
                }
            });
        });
    }

    animateBackground() {
        // Animate maze background layers
        gsap.to('.maze-layer', {
            rotation: 360,
            duration: 30,
            ease: 'none',
            repeat: -1,
            stagger: 0.2
        });
    }

    showStep(stepName) {
        if (!this.steps.includes(stepName)) {
            console.error('Invalid step:', stepName);
            return;
        }

        // Hide all steps
        this.steps.forEach(step => {
            const stepElement = document.getElementById(`${step}-step`);
            if (stepElement) {
                stepElement.classList.remove('active');
            }
        });

        // Show target step
        const targetStep = document.getElementById(`${stepName}-step`);
        if (targetStep) {
            targetStep.classList.add('active');
            this.currentStep = stepName;
            
            // Animate step entrance
            gsap.from(targetStep, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power2.out'
            });
        }

        // Update progress bar for 2FA step
        if (stepName === '2fa') {
            this.updateProgressBar(66);
        } else if (stepName === 'success') {
            this.updateProgressBar(100);
        } else {
            this.updateProgressBar(0);
        }
    }

    updateProgressBar(percentage) {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            gsap.to(progressFill, {
                width: `${percentage}%`,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }

    // API methods - REAL API calls to Flask backend
    async loginAPI(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();
            
            // Store user data in localStorage
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_email', email);
            
            return data;
        } catch (error) {
            console.error('Login API error:', error);
            throw error;
        }
    }

    async signupAPI(formData) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: formData.email, 
                    password: formData.password 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Signup failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Signup API error:', error);
            throw error;
        }
    }

    async forgotPasswordAPI(email) {
        try {
            // For now, simulate success (implement real password reset later)
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, message: 'Reset link sent' };
        } catch (error) {
            console.error('Forgot password API error:', error);
            throw error;
        }
    }

    // Check if user is already authenticated
    checkAuthStatus() {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('auth_token');
        
        if (userId && token) {
            // User is authenticated, redirect to dashboard
            window.location.href = '/dashboard';
            return true;
        }
        return false;
    }

    // Logout function
    logout() {
        localStorage.removeItem('user_id');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        window.location.href = '/';
    }

    // Redirect to dashboard after successful login
    redirectToDashboard() {
        window.location.href = '/dashboard';
    }

    // Update the handleLogin method to use real API
    async handleLogin() {
        if (this.isAuthenticating) return;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!this.validateLoginForm(email, password)) {
            return;
        }

        this.isAuthenticating = true;
        this.showLoadingState('login');

        try {
            // Use real API instead of simulation
            const result = await this.loginAPI(email, password);
            
            // Show success message
            this.showSuccess('Login successful! Redirecting to dashboard...');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                this.redirectToDashboard();
            }, 1500);
            
        } catch (error) {
            console.error('Login failed:', error);
            this.showError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            this.hideLoadingState('login');
            this.isAuthenticating = false;
        }
    }

    // Update the handleSignup method to use real API
    async handleSignup() {
        if (this.isAuthenticating) return;

        const formData = this.getSignupFormData();
        
        if (!this.validateSignupForm(formData)) {
            return;
        }

        this.isAuthenticating = true;
        this.showLoadingState('signup');

        try {
            // Use real API instead of simulation
            const result = await this.signupAPI(formData);
            
            // Show success message
            this.showSuccess('Account created successfully! Please log in.');
            
            // Return to login
            setTimeout(() => {
                this.showStep('login');
            }, 2000);
            
        } catch (error) {
            console.error('Signup failed:', error);
            this.showError(error.message || 'Signup failed. Please try again.');
        } finally {
            this.hideLoadingState('signup');
            this.isAuthenticating = false;
        }
    }

    // Update the handleForgotPassword method to use real API
    async handleForgotPassword() {
        if (this.isAuthenticating) return;

        const email = document.getElementById('reset-email').value;
        
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address.');
            return;
        }

        this.isAuthenticating = true;
        this.showLoadingState('forgot-password');

        try {
            // Use real API instead of simulation
            const result = await this.forgotPasswordAPI(email);
            
            // Show success message
            this.showSuccess('Password reset link sent to your email!');
            
            // Return to login
            setTimeout(() => {
                this.showStep('login');
            }, 2000);
            
        } catch (error) {
            console.error('Password reset failed:', error);
            this.showError(error.message || 'Failed to send reset link. Please try again.');
        } finally {
            this.hideLoadingState('forgot-password');
            this.isAuthenticating = false;
        }
    }

    async handle2FAVerification() {
        if (this.isAuthenticating) return;

        const otpCode = this.getOTPCode();
        
        if (!this.validateOTPCode(otpCode)) {
            this.showError('Please enter the 6-digit verification code.');
            return;
        }

        this.isAuthenticating = true;
        this.showLoadingState('2fa');

        try {
            // Simulate API call
            await this.simulate2FAVerificationAPI(otpCode);
            
            // Show success step
            this.showStep('success');
            
            // Simulate redirect to dashboard
            setTimeout(() => {
                this.redirectToDashboard();
            }, 3000);
            
        } catch (error) {
            console.error('2FA verification failed:', error);
            this.showError('Verification failed. Please try again.');
        } finally {
            this.hideLoadingState('2fa');
            this.isAuthenticating = false;
        }
    }

    async handleSocialLogin(provider) {
        if (this.isAuthenticating) return;

        this.isAuthenticating = true;
        this.showLoadingState('social');

        try {
            // Simulate social login
            await this.simulateSocialLoginAPI(provider);
            
            // Show success step
            this.showStep('success');
            
            // Simulate redirect to dashboard
            setTimeout(() => {
                this.redirectToDashboard();
            }, 3000);
            
        } catch (error) {
            console.error('Social login failed:', error);
            this.showError(`${provider} login failed. Please try again.`);
        } finally {
            this.hideLoadingState('social');
            this.isAuthenticating = false;
        }
    }

    resend2FACode() {
        const email = document.getElementById('email').value;
        
        if (!email) {
            this.showError('Please enter your email address first.');
            return;
        }

        this.simulateSend2FACode(email);
        this.showSuccess('Verification code resent!');
    }

    // Form validation methods
    validateLoginForm(email, password) {
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }

        if (!password || password.length < 6) {
            this.showError('Password must be at least 6 characters long.');
            return false;
        }

        return true;
    }

    validateSignupForm(formData) {
        if (!formData.name || formData.name.length < 2) {
            this.showError('Name must be at least 2 characters long.');
            return false;
        }

        if (!this.validateEmail(formData.email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }

        if (!formData.password || formData.password.length < 8) {
            this.showError('Password must be at least 8 characters long.');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            this.showError('Passwords do not match.');
            return false;
        }

        if (!document.getElementById('terms-checkbox').checked) {
            this.showError('Please accept the Terms of Service and Privacy Policy.');
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateOTPCode(code) {
        return code.length === 6 && /^\d{6}$/.test(code);
    }

    validatePasswordMatch() {
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        if (confirmPassword && password !== confirmPassword) {
            document.getElementById('signup-confirm-password').classList.add('error');
            document.getElementById('signup-confirm-password').classList.remove('valid');
        } else if (confirmPassword) {
            document.getElementById('signup-confirm-password').classList.remove('error');
            document.getElementById('signup-confirm-password').classList.add('valid');
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        
        // Remove existing validation classes
        input.classList.remove('valid', 'error');
        
        if (!value) {
            return; // Don't show error for empty fields
        }

        // Validate based on input type
        switch (input.type) {
            case 'email':
                if (this.validateEmail(value)) {
                    input.classList.add('valid');
                } else {
                    input.classList.add('error');
                }
                break;
                
            case 'password':
                if (value.length >= 8) {
                    input.classList.add('valid');
                } else {
                    input.classList.add('error');
                }
                break;
                
            default:
                if (value.length >= 2) {
                    input.classList.add('valid');
                }
                break;
        }
    }

    // Data collection methods
    getSignupFormData() {
        return {
            name: document.getElementById('signup-name').value,
            email: document.getElementById('signup-email').value,
            password: document.getElementById('signup-password').value,
            confirmPassword: document.getElementById('signup-confirm-password').value
        };
    }

    getOTPCode() {
        const otpInputs = document.querySelectorAll('.otp-digit');
        return Array.from(otpInputs).map(input => input.value).join('');
    }

    // API simulation methods
    async simulate2FAVerificationAPI(code) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate validation (accept any 6-digit code for demo)
        if (code.length === 6 && /^\d{6}$/.test(code)) {
            return { success: true, token: 'demo-token' };
        } else {
            throw new Error('Invalid verification code');
        }
    }

    async simulateSocialLoginAPI(provider) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate success
        return { success: true, user: { provider, id: `${provider}-user` } };
    }

    simulateSend2FACode(email) {
        console.log(`2FA code sent to ${email}`);
        // In a real app, this would send an actual code
    }

    // UI state methods
    showLoadingState(step) {
        const button = this.getButtonForStep(step);
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<div class="loading-spinner"></div>Processing...';
            button.disabled = true;
            
            // Store original text for restoration
            button.dataset.originalText = originalText;
        }
    }

    hideLoadingState(step) {
        const button = this.getButtonForStep(step);
        if (button && button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            button.disabled = false;
            delete button.dataset.originalText;
        }
    }

    getButtonForStep(step) {
        switch (step) {
            case 'login':
                return document.querySelector('#login-form button[type="submit"]');
            case 'signup':
                return document.querySelector('#signup-form button[type="submit"]');
            case 'forgot-password':
                return document.querySelector('#forgot-password-form button[type="submit"]');
            case '2fa':
                return document.getElementById('verify-2fa-btn');
            default:
                return null;
        }
    }

    // Notification methods
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 
            'bg-blue-600'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate entrance
        gsap.from(notification, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }
            });
        }, 4000);
    }

    // Utility methods
    generateOTPCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Demo mode setup
    setupDemoMode() {
        // Pre-fill demo credentials
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput && passwordInput) {
            emailInput.value = 'demo@maze.com';
            passwordInput.value = 'password123';
            
            // Trigger validation
            this.validateInput(emailInput);
            this.validateInput(passwordInput);
        }
    }
}

// Initialize the login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loginManager = new LoginManager();
    
    // Setup demo mode for easier testing
    setTimeout(() => {
        window.loginManager.setupDemoMode();
    }, 1000);
});
