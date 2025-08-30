// 🚀 ADVANCED AI-POWERED USER ACTIVITY MONITORING SYSTEM
// Real-time comprehensive tracking of all user activities

class EnterpriseActivityMonitor {
    constructor() {
        this.isMonitoring = false;
        this.monitoringSession = null;
        this.activityBuffer = [];
        this.bufferSize = 50; // Send activities in batches
        this.monitoringInterval = null;
        this.lastActivity = null;
        
        // Monitoring modules
        this.modules = {
            browser: true,
            system: true,
            security: true,
            network: true,
            ai_analysis: true
        };
        
        // Activity tracking
        this.trackedActivities = {
            browser: [],
            system: [],
            security: [],
            network: [],
            general: []
        };
        
        // AI insights cache
        this.aiInsights = {};
        
        this.init();
    }
    
    init() {
        console.log('🚀 Enterprise Activity Monitor initialized');
        this.setupEventListeners();
        this.startActivityTracking();
    }
    
    setupEventListeners() {
        // Browser activity tracking
        this.trackBrowserActivity();
        
        // System activity tracking
        this.trackSystemActivity();
        
        // Security event tracking
        this.trackSecurityEvents();
        
        // Network activity tracking
        this.trackNetworkActivity();
        
        // User interaction tracking
        this.trackUserInteractions();
        
        // File operation tracking
        this.trackFileOperations();
        
        // Application usage tracking
        this.trackApplicationUsage();
    }
    
    // 🌐 BROWSER ACTIVITY MONITORING
    trackBrowserActivity() {
        // Track URL changes
        let currentUrl = window.location.href;
        let currentDomain = window.location.hostname;
        
        // Monitor URL changes
        const urlObserver = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                this.recordBrowserActivity({
                    type: 'url_change',
                    url: window.location.href,
                    domain: window.location.hostname,
                    previous_url: currentUrl,
                    previous_domain: currentDomain,
                    timestamp: new Date().toISOString()
                });
                
                currentUrl = window.location.href;
                currentDomain = window.location.hostname;
            }
        });
        
        urlObserver.observe(document.body, { childList: true, subtree: true });
        
        // Track page interactions
        document.addEventListener('click', (e) => {
            this.recordBrowserActivity({
                type: 'page_interaction',
                action: 'click',
                element: e.target.tagName,
                text: e.target.textContent?.substring(0, 100),
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.recordBrowserActivity({
                type: 'form_submission',
                action: 'submit',
                form_id: e.target.id || 'unknown',
                form_action: e.target.action,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
        
        // Track search queries
        document.addEventListener('input', (e) => {
            if (e.target.type === 'search' || e.target.placeholder?.toLowerCase().includes('search')) {
                this.recordBrowserActivity({
                    type: 'search_query',
                    action: 'input',
                    search_term: e.target.value,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Track tab visibility changes
        document.addEventListener('visibilitychange', () => {
            this.recordBrowserActivity({
                type: 'tab_visibility',
                action: document.hidden ? 'hidden' : 'visible',
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
        
        // Track scroll behavior
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.recordBrowserActivity({
                    type: 'scroll_behavior',
                    action: 'scroll',
                    scroll_position: window.scrollY,
                    page_height: document.body.scrollHeight,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }, 1000);
        });
    }
    
    // 💻 SYSTEM ACTIVITY MONITORING
    trackSystemActivity() {
        // Track keyboard activity
        let keyCount = 0;
        let keyTimeout;
        
        document.addEventListener('keydown', (e) => {
            keyCount++;
            
            clearTimeout(keyTimeout);
            keyTimeout = setTimeout(() => {
                this.recordSystemActivity({
                    type: 'keyboard_activity',
                    action: 'typing_session',
                    key_count: keyCount,
                    duration: 5000, // 5 seconds
                    timestamp: new Date().toISOString()
                });
                keyCount = 0;
            }, 5000);
        });
        
        // Track mouse movements
        let mouseMovements = [];
        let mouseTimeout;
        
        document.addEventListener('mousemove', (e) => {
            mouseMovements.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                if (mouseMovements.length > 10) {
                    this.recordSystemActivity({
                        type: 'mouse_activity',
                        action: 'movement_pattern',
                        movement_count: mouseMovements.length,
                        area_covered: this.calculateMouseArea(mouseMovements),
                        timestamp: new Date().toISOString()
                    });
                    mouseMovements = [];
                }
            }, 3000);
        });
        
        // Track window focus
        window.addEventListener('focus', () => {
            this.recordSystemActivity({
                type: 'window_focus',
                action: 'gained_focus',
                timestamp: new Date().toISOString()
            });
        });
        
        window.addEventListener('blur', () => {
            this.recordSystemActivity({
                type: 'window_focus',
                action: 'lost_focus',
                timestamp: new Date().toISOString()
            });
        });
        
        // Track screen resolution changes
        window.addEventListener('resize', () => {
            this.recordSystemActivity({
                type: 'screen_resolution',
                action: 'resize',
                width: window.innerWidth,
                height: window.innerHeight,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    // 🛡️ SECURITY EVENT MONITORING
    trackSecurityEvents() {
        // Track authentication attempts
        document.addEventListener('submit', (e) => {
            if (e.target.querySelector('input[type="password"]')) {
                this.recordSecurityEvent({
                    type: 'authentication_attempt',
                    action: 'login_form_submit',
                    form_id: e.target.id || 'unknown',
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Track password field interactions
        document.addEventListener('focus', (e) => {
            if (e.target.type === 'password') {
                this.recordSecurityEvent({
                    type: 'password_field_access',
                    action: 'focused',
                    field_id: e.target.id || 'unknown',
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Track file downloads
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.includes('download')) {
                this.recordSecurityEvent({
                    type: 'file_download',
                    action: 'download_initiated',
                    file_url: e.target.href,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Track external links
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.startsWith('http') && 
                !e.target.href.includes(window.location.hostname)) {
                this.recordSecurityEvent({
                    type: 'external_link',
                    action: 'clicked',
                    external_url: e.target.href,
                    current_url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
    
    // 🌐 NETWORK ACTIVITY MONITORING
    trackNetworkActivity() {
        // Track fetch requests
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const [url, options] = args;
            
            this.recordNetworkActivity({
                type: 'fetch_request',
                action: 'api_call',
                url: url,
                method: options?.method || 'GET',
                timestamp: new Date().toISOString()
            });
            
            return originalFetch(...args);
        };
        
        // Track XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this.recordNetworkActivity({
                type: 'xhr_request',
                action: 'api_call',
                url: url,
                method: method,
                timestamp: new Date().toISOString()
            });
            
            return originalXHROpen.call(this, method, url, ...args);
        };
        
        // Track WebSocket connections
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
            this.recordNetworkActivity({
                type: 'websocket_connection',
                action: 'connection_attempt',
                url: url,
                protocols: protocols,
                timestamp: new Date().toISOString()
            });
            
            return new originalWebSocket(url, protocols);
        };
    }
    
    // 👤 USER INTERACTION MONITORING
    trackUserInteractions() {
        // Track copy/paste operations
        document.addEventListener('copy', (e) => {
            this.recordGeneralActivity({
                type: 'user_interaction',
                action: 'copy_text',
                text_length: window.getSelection().toString().length,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
        
        document.addEventListener('paste', (e) => {
            this.recordGeneralActivity({
                type: 'user_interaction',
                action: 'paste_text',
                text_length: e.clipboardData?.getData('text').length || 0,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
        
        // Track right-click context menus
        document.addEventListener('contextmenu', (e) => {
            this.recordGeneralActivity({
                type: 'user_interaction',
                action: 'context_menu',
                element: e.target.tagName,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
        
        // Track drag and drop
        document.addEventListener('dragstart', (e) => {
            this.recordGeneralActivity({
                type: 'user_interaction',
                action: 'drag_start',
                element: e.target.tagName,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
        
        document.addEventListener('drop', (e) => {
            this.recordGeneralActivity({
                type: 'user_interaction',
                action: 'drop',
                element: e.target.tagName,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    // 📁 FILE OPERATION MONITORING
    trackFileOperations() {
        // Track file input changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file') {
                const files = Array.from(e.target.files);
                this.recordGeneralActivity({
                    type: 'file_operation',
                    action: 'file_selected',
                    file_count: files.length,
                    file_names: files.map(f => f.name),
                    file_sizes: files.map(f => f.size),
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Track file uploads
        document.addEventListener('submit', (e) => {
            const fileInputs = e.target.querySelectorAll('input[type="file"]');
            if (fileInputs.length > 0) {
                this.recordGeneralActivity({
                    type: 'file_operation',
                    action: 'file_upload',
                    form_id: e.target.id || 'unknown',
                    file_input_count: fileInputs.length,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
    
    // 🖥️ APPLICATION USAGE MONITORING
    trackApplicationUsage() {
        // Track time spent on page
        let pageStartTime = Date.now();
        let pageActiveTime = 0;
        let isPageActive = true;
        
        // Update active time every second
        setInterval(() => {
            if (isPageActive) {
                pageActiveTime += 1000;
            }
        }, 1000);
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isPageActive = false;
                this.recordGeneralActivity({
                    type: 'application_usage',
                    action: 'page_hidden',
                    time_spent: pageActiveTime,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            } else {
                isPageActive = true;
                this.recordGeneralActivity({
                    type: 'application_usage',
                    action: 'page_visible',
                    time_spent: pageActiveTime,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Track before unload
        window.addEventListener('beforeunload', () => {
            this.recordGeneralActivity({
                type: 'application_usage',
                action: 'page_unload',
                total_time_spent: pageActiveTime,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    // 📊 ACTIVITY RECORDING FUNCTIONS
    recordBrowserActivity(data) {
        this.trackedActivities.browser.push(data);
        this.addToBuffer('browser_activity', data);
    }
    
    recordSystemActivity(data) {
        this.trackedActivities.system.push(data);
        this.addToBuffer('system_activity', data);
    }
    
    recordSecurityEvent(data) {
        this.trackedActivities.security.push(data);
        this.addToBuffer('security_event', data);
    }
    
    recordNetworkActivity(data) {
        this.trackedActivities.network.push(data);
        this.addToBuffer('network_activity', data);
    }
    
    recordGeneralActivity(data) {
        this.trackedActivities.general.push(data);
        this.addToBuffer('general_activity', data);
    }
    
    // 🔄 BUFFER MANAGEMENT
    addToBuffer(activityType, data) {
        this.activityBuffer.push({
            type: activityType,
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Send buffer when it reaches threshold
        if (this.activityBuffer.length >= this.bufferSize) {
            this.sendActivityBuffer();
        }
    }
    
    async sendActivityBuffer() {
        if (this.activityBuffer.length === 0) return;
        
        try {
            const activities = [...this.activityBuffer];
            this.activityBuffer = [];
            
            // Send to backend
            const response = await fetch('/api/enterprise/monitoring/record-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': 'demo-user'
                },
                body: JSON.stringify({
                    user_id: 'demo-user',
                    session_id: this.monitoringSession?.session_id,
                    activities: activities
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('📊 Activities sent successfully:', result);
                
                // Update AI insights
                if (result.ai_insights) {
                    this.aiInsights = { ...this.aiInsights, ...result.ai_insights };
                }
            }
        } catch (error) {
            console.error('❌ Failed to send activities:', error);
            // Re-add activities to buffer for retry
            this.activityBuffer.unshift(...activities);
        }
    }
    
    // 🚀 MONITORING CONTROL
    async startMonitoring(level = 'comprehensive') {
        try {
            const response = await fetch('/api/enterprise/monitoring/start-tracking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: 'demo-user',
                    level: level
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.monitoringSession = result;
                this.isMonitoring = true;
                
                console.log('🚀 Activity monitoring started:', result);
                
                // Start periodic buffer sending
                this.monitoringInterval = setInterval(() => {
                    this.sendActivityBuffer();
                }, 10000); // Send every 10 seconds
                
                return true;
            }
        } catch (error) {
            console.error('❌ Failed to start monitoring:', error);
        }
        
        return false;
    }
    
    stopMonitoring() {
        this.isMonitoring = false;
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        // Send remaining buffer
        this.sendActivityBuffer();
        
        console.log('🛑 Activity monitoring stopped');
    }
    
    // 📈 ACTIVITY SUMMARY
    async getActivitySummary(timeRange = '24h') {
        try {
            const response = await fetch(`/api/enterprise/monitoring/activity-summary?user_id=demo-user&range=${timeRange}`);
            
            if (response.ok) {
                const result = await response.json();
                return result.summary;
            }
        } catch (error) {
            console.error('❌ Failed to get activity summary:', error);
        }
        
        return null;
    }
    
    // 🚨 SECURITY ALERTS
    async getSecurityAlerts() {
        try {
            const response = await fetch(`/api/enterprise/monitoring/security-alerts?user_id=demo-user`);
            
            if (response.ok) {
                const result = await response.json();
                return result.alerts;
            }
        } catch (error) {
            console.error('❌ Failed to get security alerts:', error);
        }
        
        return [];
    }
    
    // 🧮 UTILITY FUNCTIONS
    calculateMouseArea(movements) {
        if (movements.length < 2) return 0;
        
        let minX = Math.min(...movements.map(m => m.x));
        let maxX = Math.max(...movements.map(m => m.x));
        let minY = Math.min(...movements.map(m => m.y));
        let maxY = Math.max(...movements.map(m => m.y));
        
        return (maxX - minX) * (maxY - minY);
    }
    
    startActivityTracking() {
        // Start monitoring automatically
        this.startMonitoring('comprehensive');
        
        // Send buffer periodically
        setInterval(() => {
            this.sendActivityBuffer();
        }, 15000); // Every 15 seconds
    }
    
    // 📊 GET MONITORING STATS
    getMonitoringStats() {
        return {
            isMonitoring: this.isMonitoring,
            sessionId: this.monitoringSession?.session_id,
            bufferSize: this.activityBuffer.length,
            totalActivities: {
                browser: this.trackedActivities.browser.length,
                system: this.trackedActivities.system.length,
                security: this.trackedActivities.security.length,
                network: this.trackedActivities.network.length,
                general: this.trackedActivities.general.length
            },
            aiInsights: this.aiInsights
        };
    }
}

// Initialize the activity monitor
const enterpriseActivityMonitor = new EnterpriseActivityMonitor();

// Export for global access
window.enterpriseActivityMonitor = enterpriseActivityMonitor;
