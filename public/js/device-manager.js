/**
 * Device Management System
 * Implements device sync limitations based on subscription plans
 */

class DeviceManager {
    constructor() {
        this.deviceId = this.generateDeviceId();
        this.registeredDevices = new Map();
        this.currentPlan = 'PERSONAL'; // PERSONAL, PREMIUM, BUSINESS
        this.init();
    }

    async init() {
        try {
            await this.loadRegisteredDevices();
            await this.registerCurrentDevice();
            console.log('✅ Device Manager initialized');
        } catch (error) {
            console.error('❌ Device Manager initialization failed:', error);
        }
    }

    // Generate unique device ID based on browser/device characteristics
    generateDeviceId() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            !!window.sessionStorage,
            !!window.localStorage,
            canvas.toDataURL()
        ].join('|');
        
        return this.simpleHash(fingerprint);
    }

    // Simple hash function for device ID
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    // Load registered devices from storage
    async loadRegisteredDevices() {
        try {
            const stored = localStorage.getItem('agies_registered_devices');
            if (stored) {
                const devices = JSON.parse(stored);
                this.registeredDevices = new Map(Object.entries(devices));
            }
            
            // Also load current plan
            const plan = localStorage.getItem('agies_subscription_plan');
            if (plan) {
                this.currentPlan = plan;
            }
        } catch (error) {
            console.error('Failed to load registered devices:', error);
        }
    }

    // Save registered devices to storage
    async saveRegisteredDevices() {
        try {
            const devices = Object.fromEntries(this.registeredDevices);
            localStorage.setItem('agies_registered_devices', JSON.stringify(devices));
        } catch (error) {
            console.error('Failed to save registered devices:', error);
        }
    }

    // Register current device
    async registerCurrentDevice() {
        const existingDevice = this.registeredDevices.get(this.deviceId);
        
        if (!existingDevice) {
            // Check device limits based on plan
            if (!this.canRegisterNewDevice()) {
                throw new Error('Device limit reached for your current plan');
            }
            
            // Register new device
            const device = {
                id: this.deviceId,
                name: this.getDeviceName(),
                userAgent: navigator.userAgent,
                registeredAt: Date.now(),
                lastSeen: Date.now(),
                isActive: true
            };
            
            this.registeredDevices.set(this.deviceId, device);
            await this.saveRegisteredDevices();
            
            console.log('📱 New device registered:', device.name);
        } else {
            // Update last seen
            existingDevice.lastSeen = Date.now();
            existingDevice.isActive = true;
            await this.saveRegisteredDevices();
        }
    }

    // Check if new device can be registered based on plan limits
    canRegisterNewDevice() {
        const limits = {
            'PERSONAL': 1,
            'PREMIUM': Infinity,
            'BUSINESS': Infinity
        };
        
        const currentLimit = limits[this.currentPlan] || 1;
        const activeDevices = Array.from(this.registeredDevices.values())
            .filter(device => device.isActive).length;
            
        return activeDevices < currentLimit;
    }

    // Get device limits for current plan
    getDeviceLimits() {
        const limits = {
            'PERSONAL': { max: 1, description: 'Personal plan allows 1 device' },
            'PREMIUM': { max: Infinity, description: 'Premium plan allows unlimited devices' },
            'BUSINESS': { max: Infinity, description: 'Business plan allows unlimited devices' }
        };
        
        return limits[this.currentPlan] || limits['PERSONAL'];
    }

    // Get friendly device name
    getDeviceName() {
        const ua = navigator.userAgent;
        let deviceName = 'Unknown Device';
        
        if (ua.includes('Windows')) deviceName = 'Windows PC';
        else if (ua.includes('Mac')) deviceName = 'Mac';
        else if (ua.includes('Linux')) deviceName = 'Linux PC';
        else if (ua.includes('iPhone')) deviceName = 'iPhone';
        else if (ua.includes('iPad')) deviceName = 'iPad';
        else if (ua.includes('Android')) deviceName = 'Android Device';
        
        // Add browser info
        if (ua.includes('Chrome')) deviceName += ' (Chrome)';
        else if (ua.includes('Firefox')) deviceName += ' (Firefox)';
        else if (ua.includes('Safari')) deviceName += ' (Safari)';
        else if (ua.includes('Edge')) deviceName += ' (Edge)';
        
        return deviceName;
    }

    // Get all registered devices
    getRegisteredDevices() {
        return Array.from(this.registeredDevices.values())
            .sort((a, b) => b.lastSeen - a.lastSeen);
    }

    // Remove a device
    async removeDevice(deviceId) {
        if (deviceId === this.deviceId) {
            throw new Error('Cannot remove current device');
        }
        
        this.registeredDevices.delete(deviceId);
        await this.saveRegisteredDevices();
        
        console.log('📱 Device removed:', deviceId);
    }

    // Set subscription plan
    async setSubscriptionPlan(plan) {
        const validPlans = ['PERSONAL', 'PREMIUM', 'BUSINESS'];
        if (!validPlans.includes(plan)) {
            throw new Error('Invalid subscription plan');
        }
        
        this.currentPlan = plan;
        localStorage.setItem('agies_subscription_plan', plan);
        
        // Check if current devices exceed new plan limits
        if (!this.canRegisterNewDevice()) {
            console.warn('⚠️ Current devices exceed new plan limits');
            // In a real app, you might want to deactivate excess devices
        }
        
        console.log('📋 Subscription plan updated:', plan);
    }

    // Get current plan info
    getCurrentPlan() {
        return {
            plan: this.currentPlan,
            limits: this.getDeviceLimits(),
            activeDevices: Array.from(this.registeredDevices.values())
                .filter(device => device.isActive).length
        };
    }

    // Sync data between devices (if allowed)
    async syncData(data) {
        // In a real implementation, this would sync with a backend service
        // For now, we'll simulate sync restrictions
        
        if (this.currentPlan === 'PERSONAL') {
            const activeDevices = Array.from(this.registeredDevices.values())
                .filter(device => device.isActive);
                
            if (activeDevices.length > 1) {
                throw new Error('Multiple devices detected. Upgrade to Premium for unlimited device sync.');
            }
        }
        
        // Simulate sync
        console.log('🔄 Data synced across devices');
        return { success: true, syncedAt: Date.now() };
    }

    // Check sync eligibility
    canSync() {
        if (this.currentPlan === 'PERSONAL') {
            const activeDevices = Array.from(this.registeredDevices.values())
                .filter(device => device.isActive);
            return activeDevices.length <= 1;
        }
        return true;
    }

    // Get sync status
    getSyncStatus() {
        return {
            canSync: this.canSync(),
            deviceCount: Array.from(this.registeredDevices.values())
                .filter(device => device.isActive).length,
            plan: this.currentPlan,
            message: this.canSync() 
                ? 'Sync enabled' 
                : 'Upgrade to Premium for multi-device sync'
        };
    }
}

// Export for use in other modules
window.DeviceManager = DeviceManager;
