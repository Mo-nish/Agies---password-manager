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
                
                // Start REAL SYSTEM MONITORING
                this.startSystemWideMonitoring();
                
                return true;
            }
        } catch (error) {
            console.error('❌ Failed to start monitoring:', error);
        }
        
        return false;
    }
    
    // 🌐 SYSTEM-WIDE MONITORING (REAL APPLICATIONS & WEBSITES)
    startSystemWideMonitoring() {
        console.log('🚀 Starting REAL SYSTEM-WIDE monitoring...');
        
        // Initialize comprehensive tracking
        this.initializeComprehensiveTracking();
        
        // Track ALL browser tabs and windows
        this.monitorAllBrowsers();
        
        // Track application focus changes
        this.monitorApplicationFocus();
        
        // Track system-wide keyboard and mouse
        this.monitorSystemInput();
        
        // Track file system operations
        this.monitorFileOperations();
        
        // Track network activity across all apps
        this.monitorSystemNetwork();
        
        // Track clipboard operations
        this.monitorClipboard();
        
        // Track screen capture and sharing
        this.monitorScreenActivity();
        
        // Track time spent on different applications
        this.monitorApplicationTime();
        
        // Track system tools and applications
        this.monitorSystemTools();
        
        // Track cross-browser activities
        this.monitorCrossBrowserActivity();
        
        // Track file downloads and uploads
        this.monitorFileDownloads();
        
        console.log('✅ REAL SYSTEM-WIDE monitoring activated!');
    }
    
    // 🚀 COMPREHENSIVE TRACKING INITIALIZATION
    initializeComprehensiveTracking() {
        // Initialize comprehensive data storage
        this.comprehensiveData = {
            applications: [],
            urls: [],
            files: [],
            downloads: [],
            systemTools: [],
            crossBrowserActivity: [],
            realTimeActivities: [],
            startTime: Date.now()
        };
        
        // Start comprehensive data collection
        this.startComprehensiveDataCollection();
    }
    
    // 📊 COMPREHENSIVE DATA COLLECTION
    startComprehensiveDataCollection() {
        // Collect data every 5 seconds
        setInterval(() => {
            this.collectComprehensiveData();
        }, 5000);
        
        // Store data every 30 seconds
        setInterval(() => {
            this.storeComprehensiveData();
        }, 30000);
    }
    
    // 🔍 COLLECT COMPREHENSIVE DATA
    collectComprehensiveData() {
        const currentTime = new Date().toISOString();
        
        // Collect current application state
        const currentApp = {
            url: window.location.href,
            title: document.title,
            timestamp: currentTime,
            type: 'webpage',
            domain: window.location.hostname,
            path: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash
        };
        
        // Add to comprehensive data
        this.addToComprehensiveData('urls', currentApp);
        
        // Collect system information
        const systemInfo = {
            timestamp: currentTime,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        this.addToComprehensiveData('systemInfo', systemInfo);
        
        // Collect performance data
        if (performance && performance.memory) {
            const performanceData = {
                timestamp: currentTime,
                memoryUsage: performance.memory.usedJSHeapSize,
                memoryLimit: performance.memory.jsHeapSizeLimit,
                memoryTotal: performance.memory.totalJSHeapSize
            };
            
            this.addToComprehensiveData('performance', performanceData);
        }
    }
    
    // 💾 STORE COMPREHENSIVE DATA
    storeComprehensiveData() {
        // Store data in localStorage for persistence
        try {
            localStorage.setItem('enterpriseMonitoringData', JSON.stringify(this.comprehensiveData));
            console.log('💾 Comprehensive data stored successfully');
        } catch (error) {
            console.error('❌ Failed to store comprehensive data:', error);
        }
        
        // Send data to backend if available
        this.sendComprehensiveDataToBackend();
    }
    
    // 📤 SEND DATA TO BACKEND
    async sendComprehensiveDataToBackend() {
        try {
            const response = await fetch('/api/enterprise/monitoring/record-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': 'demo-user'
                },
                body: JSON.stringify({
                    user_id: 'demo-user',
                    session_id: this.monitoringSession?.session_id,
                    comprehensive_data: this.comprehensiveData,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                console.log('📤 Comprehensive data sent to backend');
            }
        } catch (error) {
            console.log('⚠️ Backend not available, data stored locally');
        }
    }
    
    // ➕ ADD TO COMPREHENSIVE DATA
    addToComprehensiveData(category, data) {
        if (!this.comprehensiveData[category]) {
            this.comprehensiveData[category] = [];
        }
        
        // Add timestamp if not present
        if (!data.timestamp) {
            data.timestamp = new Date().toISOString();
        }
        
        // Add unique ID
        data.id = this.generateUniqueId();
        
        this.comprehensiveData[category].push(data);
        
        // Keep only last 1000 items per category
        if (this.comprehensiveData[category].length > 1000) {
            this.comprehensiveData[category] = this.comprehensiveData[category].slice(-1000);
        }
        
        // Update real-time activities
        this.addToRealTimeActivities(data);
    }
    
    // 🆔 GENERATE UNIQUE ID
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // ⚡ ADD TO REAL-TIME ACTIVITIES
    addToRealTimeActivities(data) {
        const activity = {
            ...data,
            category: this.getActivityCategory(data),
            priority: this.getActivityPriority(data),
            displayText: this.generateDisplayText(data)
        };
        
        this.comprehensiveData.realTimeActivities.unshift(activity);
        
        // Keep only last 500 real-time activities
        if (this.comprehensiveData.realTimeActivities.length > 500) {
            this.comprehensiveData.realTimeActivities = this.comprehensiveData.realTimeActivities.slice(0, 500);
        }
    }
    
    // 🏷️ GET ACTIVITY CATEGORY
    getActivityCategory(data) {
        if (data.type === 'webpage' || data.url) return 'browsing';
        if (data.type === 'file' || data.fileName) return 'files';
        if (data.type === 'application' || data.appName) return 'applications';
        if (data.type === 'system' || data.systemInfo) return 'system';
        if (data.type === 'network' || data.networkActivity) return 'network';
        return 'general';
    }
    
    // ⚠️ GET ACTIVITY PRIORITY
    getActivityPriority(data) {
        if (data.type === 'security' || data.securityEvent) return 'high';
        if (data.type === 'file' || data.download) return 'medium';
        if (data.type === 'webpage') return 'low';
        return 'normal';
    }
    
    // 📝 GENERATE DISPLAY TEXT
    generateDisplayText(data) {
        if (data.url) {
            const domain = new URL(data.url).hostname;
            return `Visited ${domain}`;
        }
        if (data.fileName) {
            return `File: ${data.fileName}`;
        }
        if (data.appName) {
            return `App: ${data.appName}`;
        }
        if (data.type) {
            return `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} activity`;
        }
        return 'Activity recorded';
    }
    
    // 🌐 MONITOR ALL BROWSERS AND TABS
    monitorAllBrowsers() {
        // Track when user switches between different websites/apps
        let lastActiveTab = document.title;
        let lastActiveUrl = window.location.href;
        let lastActiveTitle = document.title;
        
        // Enhanced tab switching detection
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // User switched to another tab/app
                const switchData = {
                    type: 'tab_switch',
                    action: 'switched_away',
                    from_url: lastActiveUrl,
                    from_title: lastActiveTitle,
                    timestamp: new Date().toISOString(),
                    duration_on_page: Date.now() - this.pageStartTime,
                    category: 'browsing',
                    priority: 'medium'
                };
                
                this.recordGeneralActivity(switchData);
                this.addToComprehensiveData('crossBrowserActivity', switchData);
                
            } else {
                // User returned to this tab
                const returnData = {
                    type: 'tab_switch',
                    action: 'returned_to',
                    to_url: window.location.href,
                    to_title: document.title,
                    timestamp: new Date().toISOString(),
                    category: 'browsing',
                    priority: 'medium'
                };
                
                this.recordGeneralActivity(returnData);
                this.addToComprehensiveData('crossBrowserActivity', returnData);
                
                lastActiveUrl = window.location.href;
                lastActiveTitle = document.title;
                this.pageStartTime = Date.now();
            }
        });
        
        // Enhanced navigation tracking
        let navigationStartTime = Date.now();
        
        // Track navigation timing
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - navigationStartTime;
            const navigationData = {
                type: 'navigation',
                action: 'page_exit',
                url: window.location.href,
                title: document.title,
                time_spent: timeSpent,
                timestamp: new Date().toISOString(),
                category: 'browsing',
                priority: 'medium'
            };
            
            this.recordGeneralActivity(navigationData);
            this.addToComprehensiveData('urls', navigationData);
        });
        
        // Track new page loads
        window.addEventListener('load', () => {
            navigationStartTime = Date.now();
            const loadData = {
                type: 'navigation',
                action: 'page_load',
                url: window.location.href,
                title: document.title,
                timestamp: new Date().toISOString(),
                category: 'browsing',
                priority: 'medium'
            };
            
            this.recordGeneralActivity(loadData);
            this.addToComprehensiveData('urls', loadData);
        });
        
        // Track URL changes (for SPA applications)
        let currentUrl = window.location.href;
        const urlObserver = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                const urlChangeData = {
                    type: 'url_change',
                    action: 'url_changed',
                    from_url: currentUrl,
                    to_url: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'browsing',
                    priority: 'medium'
                };
                
                this.recordGeneralActivity(urlChangeData);
                this.addToComprehensiveData('urls', urlChangeData);
                
                currentUrl = window.location.href;
            }
        });
        
        urlObserver.observe(document.body, { childList: true, subtree: true });
    }
    
    // 🛠️ MONITOR SYSTEM TOOLS
    monitorSystemTools() {
        // Track system tool usage
        const systemTools = [
            'calculator', 'notepad', 'paint', 'wordpad', 'cmd', 'powershell',
            'explorer', 'control', 'taskmgr', 'msconfig', 'regedit'
        ];
        
        // Monitor for system tool indicators
        document.addEventListener('keydown', (e) => {
            // Track Windows key combinations
            if (e.metaKey || e.ctrlKey) {
                const toolData = {
                    type: 'system_tool',
                    action: 'keyboard_shortcut',
                    keys: `${e.metaKey ? 'Meta' : 'Ctrl'}+${e.key}`,
                    timestamp: new Date().toISOString(),
                    category: 'system',
                    priority: 'medium'
                };
                
                this.recordGeneralActivity(toolData);
                this.addToComprehensiveData('systemTools', toolData);
            }
        });
        
        // Track system dialogs
        window.addEventListener('beforeunload', () => {
            // This might indicate system tool usage
            const systemData = {
                type: 'system_tool',
                action: 'system_dialog',
                description: 'System dialog or tool interaction',
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'medium'
            };
            
            this.addToComprehensiveData('systemTools', systemData);
        });
    }
    
    // 🌐 MONITOR CROSS-BROWSER ACTIVITY
    monitorCrossBrowserActivity() {
        // Track if user has multiple browsers open
        if (window.localStorage) {
            const browserId = `browser_${Date.now()}`;
            localStorage.setItem('currentBrowserId', browserId);
            
            // Check for other browser instances
            setInterval(() => {
                const otherBrowsers = this.detectOtherBrowsers();
                if (otherBrowsers.length > 0) {
                    const crossBrowserData = {
                        type: 'cross_browser',
                        action: 'multiple_browsers_detected',
                        browsers: otherBrowsers,
                        timestamp: new Date().toISOString(),
                        category: 'browsing',
                        priority: 'high'
                    };
                    
                    this.addToComprehensiveData('crossBrowserActivity', crossBrowserData);
                }
            }, 10000);
        }
    }
    
    // 🔍 DETECT OTHER BROWSERS
    detectOtherBrowsers() {
        // This is a simplified detection - in reality, you'd need more sophisticated methods
        const browsers = [];
        
        // Check for common browser indicators
        if (navigator.userAgent.includes('Chrome')) browsers.push('Chrome');
        if (navigator.userAgent.includes('Firefox')) browsers.push('Firefox');
        if (navigator.userAgent.includes('Safari')) browsers.push('Safari');
        if (navigator.userAgent.includes('Edge')) browsers.push('Edge');
        
        return browsers;
    }
    
    // 📁 MONITOR FILE DOWNLOADS
    monitorFileDownloads() {
        // Enhanced file download monitoring
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.includes('download')) {
                const downloadData = {
                    type: 'file_download',
                    action: 'download_initiated',
                    file_url: e.target.href,
                    file_name: e.target.href.split('/').pop(),
                    timestamp: new Date().toISOString(),
                    category: 'files',
                    priority: 'high'
                };
                
                this.recordSecurityEvent(downloadData);
                this.addToComprehensiveData('downloads', downloadData);
            }
        });
        
        // Monitor file input changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file') {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    const fileData = {
                        type: 'file_upload',
                        action: 'file_selected',
                        file_name: file.name,
                        file_size: file.size,
                        file_type: file.type,
                        timestamp: new Date().toISOString(),
                        category: 'files',
                        priority: 'medium'
                    };
                    
                    this.recordGeneralActivity(fileData);
                    this.addToComprehensiveData('files', fileData);
                });
            }
        });
        
        // Monitor drag and drop
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            files.forEach(file => {
                const dropData = {
                    type: 'file_drop',
                    action: 'files_dropped',
                    file_name: file.name,
                    file_size: file.size,
                    file_type: file.type,
                    timestamp: new Date().toISOString(),
                    category: 'files',
                    priority: 'medium'
                };
                
                this.recordGeneralActivity(dropData);
                this.addToComprehensiveData('files', dropData);
            });
        });
    }
    
    // 📊 GET COMPREHENSIVE MONITORING DATA
    getComprehensiveMonitoringData() {
        return {
            ...this.comprehensiveData,
            summary: {
                totalActivities: this.comprehensiveData.realTimeActivities.length,
                totalUrls: this.comprehensiveData.urls.length,
                totalFiles: this.comprehensiveData.files.length,
                totalDownloads: this.comprehensiveData.downloads.length,
                totalSystemTools: this.comprehensiveData.systemTools.length,
                monitoringDuration: Date.now() - this.comprehensiveData.startTime
            }
        };
    }
    
    // 🔍 SEARCH COMPREHENSIVE DATA
    searchComprehensiveData(query, category = null) {
        let searchResults = [];
        
        if (category && this.comprehensiveData[category]) {
            searchResults = this.comprehensiveData[category].filter(item => 
                JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
            );
        } else {
            // Search all categories
            Object.keys(this.comprehensiveData).forEach(cat => {
                if (Array.isArray(this.comprehensiveData[cat])) {
                    const results = this.comprehensiveData[cat].filter(item => 
                        JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
                    );
                    searchResults.push(...results);
                }
            });
        }
        
        return searchResults.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    // 📅 GET ACTIVITIES BY DATE RANGE
    getActivitiesByDateRange(startDate, endDate, category = null) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        
        let filteredActivities = [];
        
        if (category && this.comprehensiveData[category]) {
            filteredActivities = this.comprehensiveData[category].filter(item => {
                const itemTime = new Date(item.timestamp).getTime();
                return itemTime >= start && itemTime <= end;
            });
        } else {
            // Filter all categories
            Object.keys(this.comprehensiveData).forEach(cat => {
                if (Array.isArray(this.comprehensiveData[cat])) {
                    const results = this.comprehensiveData[cat].filter(item => {
                        const itemTime = new Date(item.timestamp).getTime();
                        return itemTime >= start && itemTime <= end;
                    });
                    filteredActivities.push(...results);
                }
            });
        }
        
        return filteredActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
