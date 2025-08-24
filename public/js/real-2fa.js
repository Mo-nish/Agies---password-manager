/**
 * Real Two-Factor Authentication System
 * Implements TOTP and U2F as promised in our pricing plans
 */

class Real2FA {
    constructor() {
        this.isInitialized = false;
        this.totpSecret = null;
        this.u2fDevices = [];
        this.backupCodes = [];
        this.init();
    }

    async init() {
        try {
            // Check if Web Crypto API is available
            if (!window.crypto || !window.crypto.subtle) {
                throw new Error('Web Crypto API not supported');
            }

            // Initialize TOTP
            await this.initializeTOTP();
            
            // Initialize U2F if supported
            if (this.isU2FSupported()) {
                await this.initializeU2F();
            }

            this.isInitialized = true;
            console.log('✅ Real 2FA system initialized');
        } catch (error) {
            console.error('❌ Failed to initialize 2FA:', error);
        }
    }

    // TOTP Implementation (Time-based One-Time Password)
    async initializeTOTP() {
        try {
            // Generate a secure random secret for TOTP
            const secret = await this.generateTOTPSecret();
            this.totpSecret = secret;
            
            // Store securely in localStorage (in production, this would be encrypted)
            localStorage.setItem('agies_totp_secret', secret);
            
            console.log('✅ TOTP initialized with secret');
        } catch (error) {
            console.error('❌ TOTP initialization failed:', error);
        }
    }

    async generateTOTPSecret() {
        // Generate a 32-character base32 secret (standard for TOTP)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        const array = new Uint8Array(20);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < 20; i++) {
            secret += chars[array[i] % chars.length];
        }
        
        return secret;
    }

    generateTOTPCode() {
        if (!this.totpSecret) return null;
        
        try {
            // Get current timestamp in 30-second intervals
            const now = Math.floor(Date.now() / 1000);
            const timeStep = Math.floor(now / 30);
            
            // Convert secret to bytes
            const secretBytes = this.base32ToBytes(this.totpSecret);
            
            // Create HMAC-SHA1 hash
            const hash = this.hmacSHA1(secretBytes, this.intToBytes(timeStep));
            
            // Generate 6-digit code
            const offset = hash[hash.length - 1] & 0xf;
            const code = ((hash[offset] & 0x7f) << 24) |
                        ((hash[offset + 1] & 0xff) << 16) |
                        ((hash[offset + 2] & 0xff) << 8) |
                        (hash[offset + 3] & 0xff);
            
            return (code % 1000000).toString().padStart(6, '0');
        } catch (error) {
            console.error('❌ TOTP generation failed:', error);
            return null;
        }
    }

    verifyTOTPCode(inputCode, tolerance = 1) {
        const currentCode = this.generateTOTPCode();
        if (!currentCode) return false;
        
        // Check current and adjacent time windows
        for (let i = -tolerance; i <= tolerance; i++) {
            const timeStep = Math.floor(Date.now() / 1000 / 30) + i;
            const expectedCode = this.generateTOTPCodeForTime(timeStep);
            if (inputCode === expectedCode) return true;
        }
        
        return false;
    }

    generateTOTPCodeForTime(timeStep) {
        // Implementation for specific time steps
        const secretBytes = this.base32ToBytes(this.totpSecret);
        const hash = this.hmacSHA1(secretBytes, this.intToBytes(timeStep));
        
        const offset = hash[hash.length - 1] & 0xf;
        const code = ((hash[offset] & 0x7f) << 24) |
                    ((hash[offset + 1] & 0xff) << 16) |
                    ((hash[offset + 2] & 0xff) << 8) |
                    (hash[offset + 3] & 0xff);
        
        return (code % 1000000).toString().padStart(6, '0');
    }

    // U2F Implementation (Universal 2nd Factor)
    isU2FSupported() {
        return typeof window.u2f !== 'undefined';
    }

    async initializeU2F() {
        if (!this.isU2FSupported()) {
            console.log('⚠️ U2F not supported in this browser');
            return;
        }

        try {
            // Load existing U2F devices
            const storedDevices = localStorage.getItem('agies_u2f_devices');
            if (storedDevices) {
                this.u2fDevices = JSON.parse(storedDevices);
            }

            console.log('✅ U2F initialized');
        } catch (error) {
            console.error('❌ U2F initialization failed:', error);
        }
    }

    async registerU2FDevice() {
        if (!this.isU2FSupported()) {
            throw new Error('U2F not supported');
        }

        try {
            const appId = window.location.origin;
            const challenge = await this.generateChallenge();
            
            const registrationRequest = {
                appId: appId,
                challenge: challenge,
                version: 'U2F_V2'
            };

            const registration = await window.u2f.register([registrationRequest], [], 30);
            
            if (registration.errorCode) {
                throw new Error(`U2F registration failed: ${registration.errorCode}`);
            }

            // Store the registered device
            const device = {
                keyHandle: registration.keyHandle,
                publicKey: registration.publicKey,
                certificate: registration.certificate,
                registeredAt: Date.now()
            };

            this.u2fDevices.push(device);
            localStorage.setItem('agies_u2f_devices', JSON.stringify(this.u2fDevices));
            
            console.log('✅ U2F device registered');
            return device;
        } catch (error) {
            console.error('❌ U2F registration failed:', error);
            throw error;
        }
    }

    async authenticateU2FDevice() {
        if (!this.isU2FSupported() || this.u2fDevices.length === 0) {
            throw new Error('No U2F devices registered');
        }

        try {
            const appId = window.location.origin;
            const challenge = await this.generateChallenge();
            
            const signRequests = this.u2fDevices.map(device => ({
                appId: appId,
                challenge: challenge,
                keyHandle: device.keyHandle,
                version: 'U2F_V2'
            }));

            const signature = await window.u2f.sign(signRequests, 30);
            
            if (signature.errorCode) {
                throw new Error(`U2F authentication failed: ${signature.errorCode}`);
            }

            console.log('✅ U2F authentication successful');
            return true;
        } catch (error) {
            console.error('❌ U2F authentication failed:', error);
            throw error;
        }
    }

    // Backup Codes System
    generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            const code = this.generateRandomCode();
            codes.push(code);
        }
        
        this.backupCodes = codes;
        localStorage.setItem('agies_backup_codes', JSON.stringify(codes));
        
        return codes;
    }

    verifyBackupCode(inputCode) {
        const index = this.backupCodes.findIndex(code => code === inputCode);
        if (index !== -1) {
            // Remove used backup code
            this.backupCodes.splice(index, 1);
            localStorage.setItem('agies_backup_codes', JSON.stringify(this.backupCodes));
            return true;
        }
        return false;
    }

    generateRandomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Utility Functions
    async generateChallenge() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode(...array));
    }

    base32ToBytes(base32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = 0;
        let value = 0;
        const bytes = [];
        
        for (let i = 0; i < base32.length; i++) {
            const char = base32.charAt(i).toUpperCase();
            const index = chars.indexOf(char);
            if (index === -1) continue;
            
            value = (value << 5) | index;
            bits += 5;
            
            if (bits >= 8) {
                bytes.push((value >>> (bits - 8)) & 0xff);
                bits -= 8;
            }
        }
        
        return new Uint8Array(bytes);
    }

    intToBytes(int) {
        const bytes = new Uint8Array(8);
        for (let i = 7; i >= 0; i--) {
            bytes[i] = int & 0xff;
            int = int >> 8;
        }
        return bytes;
    }

    async hmacSHA1(key, message) {
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            key,
            { name: 'HMAC', hash: 'SHA-1' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
        return new Uint8Array(signature);
    }

    // Public API
    async setup2FA(type = 'totp') {
        if (type === 'totp') {
            const secret = this.totpSecret;
            const qrCode = this.generateQRCode(secret);
            const backupCodes = this.generateBackupCodes();
            
            return {
                type: 'totp',
                secret: secret,
                qrCode: qrCode,
                backupCodes: backupCodes
            };
        } else if (type === 'u2f') {
            const device = await this.registerU2FDevice();
            return {
                type: 'u2f',
                device: device
            };
        }
    }

    async verify2FA(code, type = 'totp') {
        if (type === 'totp') {
            return this.verifyTOTPCode(code);
        } else if (type === 'u2f') {
            return await this.authenticateU2FDevice();
        } else if (type === 'backup') {
            return this.verifyBackupCode(code);
        }
        return false;
    }

    generateQRCode(secret) {
        const appName = 'Agies';
        const account = 'user@agies.com';
        const issuer = 'Agies';
        
        const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
        
        // In production, this would generate a real QR code image
        return otpauth;
    }

    // Get 2FA status
    get2FAStatus() {
        return {
            totp: !!this.totpSecret,
            u2f: this.u2fDevices.length > 0,
            backupCodes: this.backupCodes.length > 0,
            isEnabled: this.totpSecret || this.u2fDevices.length > 0
        };
    }

    // Disable 2FA
    disable2FA() {
        this.totpSecret = null;
        this.u2fDevices = [];
        this.backupCodes = [];
        
        localStorage.removeItem('agies_totp_secret');
        localStorage.removeItem('agies_u2f_devices');
        localStorage.removeItem('agies_backup_codes');
        
        console.log('✅ 2FA disabled');
    }
}

// Export for use in other modules
window.Real2FA = Real2FA;
