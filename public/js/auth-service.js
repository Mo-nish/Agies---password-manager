/**
 * Agies Authentication Service
 * Handles user authentication, registration, and session management
 * Integrated with Chakravyuham security systems
 */

class AgiesAuthService {
  constructor() {
    this.api = null;
    this.user = null;
    this.token = null;
    this.isInitialized = false;
    this.securityEventEmitter = null;

    // Initialize when API is ready
    this.initializeWhenReady();
  }

  async initializeWhenReady() {
    // Wait for Agies API to be available
    const maxAttempts = 20;
    let attempts = 0;

    const checkAPI = () => {
      if (window.agiesAPI) {
        this.api = window.agiesAPI;
        this.initializeAuth();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkAPI, 200);
      } else {
        console.error('❌ Failed to initialize Agies Auth Service - API not available');
      }
    };

    checkAPI();
  }

  async initializeAuth() {
    if (!this.api) return;

    console.log('🔐 Initializing Agies Authentication Service...');

    // Get stored authentication data
    this.token = localStorage.getItem('agies_token');
    const storedUser = localStorage.getItem('agies_user');

    if (this.token && storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        this.api.token = this.token;
        this.api.user = this.user;

        // Validate token with enhanced security check
        const isValid = await this.validateTokenSecurely();
        if (isValid) {
          this.isInitialized = true;
          console.log('✅ Authentication restored successfully');
          this.emitSecurityEvent('auth_restored', { userId: this.user.id });
          return;
        } else {
          console.warn('⚠️ Stored token invalid, clearing session');
          this.clearSession();
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearSession();
      }
    }

    // No valid session found
    this.isInitialized = true;
    console.log('ℹ️ No valid authentication found');
  }

  async validateTokenSecurely() {
    if (!this.api || !this.token) return false;

    try {
      // Enhanced token validation with security checks
      const response = await fetch(`${this.api.baseURL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          clientId: this.generateClientId()
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Additional security checks
        if (data.valid && data.userId === this.user.id) {
          // Check if user data matches
          if (data.userData.email === this.user.email) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  generateClientId() {
    // Generate a unique client identifier for security tracking
    return `agies_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // === REGISTRATION ===

  async register(userData) {
    if (!this.api) {
      throw new Error('Authentication service not initialized');
    }

    const { email, username, password, masterKey } = userData;

    // Validate input
    if (!this.validateRegistrationData(userData)) {
      throw new Error('Invalid registration data');
    }

    // Check password strength
    if (!this.isPasswordStrong(password)) {
      throw new Error('Password does not meet security requirements');
    }

    console.log('📝 Starting secure registration process...');

    try {
      // Emit security event
      this.emitSecurityEvent('registration_start', { email, username });

      // Use Agies API for registration
      const result = await this.api.register(email, username, password, masterKey);

      if (result.success) {
        this.user = result.data.user;
        this.token = result.data.token;

        // Store session data
        this.storeSession();

        // Initialize security systems with user data
        await this.initializeUserSecurity();

        // Emit success event
        this.emitSecurityEvent('registration_success', {
          userId: this.user.id,
          email: this.user.email
        });

        console.log('✅ Registration successful');
        return result;
      } else {
        // Emit failure event
        this.emitSecurityEvent('registration_failed', {
          email,
          reason: result.error
        });
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.emitSecurityEvent('registration_error', {
        email,
        error: error.message
      });
      throw error;
    }
  }

  validateRegistrationData(data) {
    const { email, username, password, masterKey } = data;

    if (!email || !username || !password || !masterKey) {
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Username validation (3-30 characters, alphanumeric + underscore)
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return false;
    }

    // Password minimum length
    if (password.length < 8) {
      return false;
    }

    // Master key minimum length
    if (masterKey.length < 12) {
      return false;
    }

    return true;
  }

  isPasswordStrong(password) {
    // Enhanced password strength requirements
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return password.length >= minLength &&
           hasUpperCase &&
           hasLowerCase &&
           hasNumbers &&
           hasSpecialChar;
  }

  // === LOGIN ===

  async login(credentials) {
    if (!this.api) {
      throw new Error('Authentication service not initialized');
    }

    const { email, password, masterKey } = credentials;

    // Validate input
    if (!email || !password || !masterKey) {
      throw new Error('Email, password, and master key are required');
    }

    console.log('🔓 Starting secure login process...');

    try {
      // Emit security event
      this.emitSecurityEvent('login_attempt', { email });

      // Use Agies API for login
      const result = await this.api.login(email, password, masterKey);

      if (result.success) {
        this.user = result.data.user;
        this.token = result.data.token;

        // Store session data
        this.storeSession();

        // Initialize security systems
        await this.initializeUserSecurity();

        // Emit success event
        this.emitSecurityEvent('login_success', {
          userId: this.user.id,
          email: this.user.email
        });

        console.log('✅ Login successful');
        return result;
      } else {
        // Emit failure event
        this.emitSecurityEvent('login_failed', {
          email,
          reason: result.error
        });
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.emitSecurityEvent('login_error', {
        email,
        error: error.message
      });
      throw error;
    }
  }

  // === LOGOUT ===

  logout() {
    console.log('🚪 Logging out user...');

    // Emit security event
    this.emitSecurityEvent('logout', {
      userId: this.user?.id,
      email: this.user?.email
    });

    // Clear all session data
    this.clearSession();

    // Clear API session
    if (this.api) {
      this.api.logout();
    }

    // Clear security systems
    this.clearUserSecurity();

    console.log('✅ Logout completed');
  }

  // === SESSION MANAGEMENT ===

  storeSession() {
    if (!this.user || !this.token) return;

    try {
      localStorage.setItem('agies_token', this.token);
      localStorage.setItem('agies_user', JSON.stringify(this.user));
      localStorage.setItem('agies_session_created', Date.now().toString());

      console.log('💾 Session data stored securely');
    } catch (error) {
      console.error('Error storing session:', error);
    }
  }

  clearSession() {
    try {
      localStorage.removeItem('agies_token');
      localStorage.removeItem('agies_user');
      localStorage.removeItem('agies_session_created');
      localStorage.removeItem('agies_master_key');

      this.user = null;
      this.token = null;

      console.log('🗑️ Session data cleared');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  // === SECURITY SYSTEMS INTEGRATION ===

  async initializeUserSecurity() {
    if (!this.user || !this.api) return;

    try {
      console.log('🛡️ Initializing user security systems...');

      // Initialize encryption service with user data
      if (this.api.encryptionService) {
        await this.api.encryptionService.initializeForUser(this.user.id);
      }

      // Initialize AI Guardian for user
      if (this.api.aiGuardian) {
        this.api.aiGuardian.setUserContext(this.user.id);
      }

      // Initialize honeytoken system
      if (this.api.honeytokenService) {
        await this.api.honeytokenService.initializeForUser(this.user.id);
      }

      console.log('✅ User security systems initialized');
    } catch (error) {
      console.error('Error initializing user security:', error);
    }
  }

  clearUserSecurity() {
    if (!this.api) return;

    try {
      // Clear encryption service
      if (this.api.encryptionService) {
        this.api.encryptionService.clearUserData();
      }

      // Clear AI Guardian
      if (this.api.aiGuardian) {
        this.api.aiGuardian.clearUserContext();
      }

      // Clear honeytoken system
      if (this.api.honeytokenService) {
        this.api.honeytokenService.clearUserData();
      }

      console.log('🧹 User security systems cleared');
    } catch (error) {
      console.error('Error clearing user security:', error);
    }
  }

  // === PASSWORD RESET ===

  async requestPasswordReset(email) {
    if (!this.api) {
      throw new Error('Authentication service not initialized');
    }

    try {
      const response = await fetch(`${this.api.baseURL}/auth/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        this.emitSecurityEvent('password_reset_requested', { email });
        return { success: true };
      } else {
        throw new Error('Failed to request password reset');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  async resetPassword(resetToken, newPassword) {
    if (!this.api) {
      throw new Error('Authentication service not initialized');
    }

    try {
      const response = await fetch(`${this.api.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resetToken,
          newPassword
        })
      });

      if (response.ok) {
        this.emitSecurityEvent('password_reset_completed', { resetToken: '***' });
        return { success: true };
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // === UTILITY METHODS ===

  isAuthenticated() {
    return !!(this.user && this.token);
  }

  getCurrentUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  // === SECURITY EVENT SYSTEM ===

  setSecurityEventEmitter(emitter) {
    this.securityEventEmitter = emitter;
  }

  emitSecurityEvent(event, data) {
    if (this.securityEventEmitter) {
      this.securityEventEmitter.emit(event, data);
    }

    // Also emit through API if available
    if (this.api && this.api.emit) {
      this.api.emit(event, data);
    }
  }

  // === SESSION TIMEOUT ===

  startSessionTimeout() {
    // Clear any existing timeout
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }

    // Set session timeout (30 minutes of inactivity)
    const timeoutMs = 30 * 60 * 1000;

    this.sessionTimeout = setTimeout(() => {
      console.warn('⚠️ Session timeout - logging out for security');
      this.emitSecurityEvent('session_timeout', { userId: this.user?.id });
      this.logout();
    }, timeoutMs);
  }

  resetSessionTimeout() {
    if (this.isAuthenticated()) {
      this.startSessionTimeout();
    }
  }

  // === BIOMETRIC AUTHENTICATION (Future) ===

  async enableBiometricAuth() {
    if (!window.PublicKeyCredential) {
      throw new Error('Biometric authentication not supported');
    }

    try {
      // This would implement WebAuthn for biometric authentication
      // Placeholder for future implementation
      console.log('🔐 Biometric authentication setup (placeholder)');
      return { success: false, message: 'Not yet implemented' };
    } catch (error) {
      console.error('Biometric auth setup error:', error);
      throw error;
    }
  }

  // === SECURITY MONITORING ===

  async getSecurityStatus() {
    if (!this.api) return null;

    try {
      return await this.api.getSecurityStatus();
    } catch (error) {
      console.error('Error getting security status:', error);
      return null;
    }
  }

  async getLoginHistory() {
    if (!this.isAuthenticated()) return [];

    try {
      const response = await fetch(`${this.api.baseURL}/auth/login-history`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.history || [];
      }

      return [];
    } catch (error) {
      console.error('Error getting login history:', error);
      return [];
    }
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.AgiesAuthService = AgiesAuthService;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
      window.agiesAuth = new AgiesAuthService();
    }
  });
}
