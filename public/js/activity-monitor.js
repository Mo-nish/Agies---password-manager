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
        
        // Page timing
        this.pageStartTime = Date.now();
        
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
    
    // 📤 SEND ACTIVITY BUFFER
    async sendActivityBuffer() {
        if (this.activityBuffer.length === 0) {
            return;
        }

        try {
            const activitiesToSend = [...this.activityBuffer];
            this.activityBuffer = []; // Clear buffer

            const response = await fetch('/api/enterprise/monitoring/record-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': 'demo-user'
                },
                body: JSON.stringify({
                    user_id: 'demo-user',
                    session_id: this.monitoringSession?.session_id,
                    activities: activitiesToSend,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                console.log('📤 Activity buffer sent successfully');
            } else {
                console.log('⚠️ Failed to send activity buffer:', response.status);
            }
        } catch (error) {
            console.error('❌ Failed to send activities:', error);
            // Put activities back in buffer for retry
            this.activityBuffer.unshift(...activitiesToSend);
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
        
        // Track ALL open tabs and windows
        this.monitorAllOpenTabs();
        
        // Track system-wide application usage
        this.monitorSystemApplications();
        
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
            openTabs: [],
            systemApps: [],
            detailedActivities: [],
            startTime: Date.now()
        };
        
        // Start comprehensive data collection
        this.startComprehensiveDataCollection();
        
        // Start real-time system monitoring
        this.startRealTimeSystemMonitoring();
    }
    
    // 📊 COMPREHENSIVE DATA COLLECTION
    startComprehensiveDataCollection() {
        // Collect data every 5 seconds for better real-time updates
        setInterval(() => {
            this.collectComprehensiveData();
        }, 5000);
        
        // Store data every 30 seconds
        setInterval(() => {
            this.storeComprehensiveData();
        }, 30000);
        
        // Update UI every 3 seconds
        setInterval(() => {
            this.updateMonitoringUI();
        }, 3000);
        
        // Clean up old data every 3 minutes
        setInterval(() => {
            this.cleanupOldData();
        }, 180000);
        
        // Enhanced application detection every 10 seconds
        setInterval(() => {
            this.detectCurrentApplication();
        }, 10000);
    }
    
    // 🔍 DETECT CURRENT APPLICATION
    detectCurrentApplication() {
        const currentUrl = window.location.href;
        const currentDomain = window.location.hostname;
        const currentTitle = document.title;
        
        // Enhanced application detection
        const appData = {
            type: 'application_detection',
            action: 'current_app_identified',
            url: currentUrl,
            title: currentTitle,
            domain: currentDomain,
            timestamp: new Date().toISOString(),
            category: this.categorizeApplication(currentDomain),
            priority: 'medium',
            details: {
                app_type: this.getApplicationType(currentDomain),
                page_type: this.getPageType(currentUrl),
                is_work_related: this.isWorkRelated(currentDomain),
                time_spent: Date.now() - this.pageStartTime
            }
        };
        
        this.recordGeneralActivity(appData);
        this.addToComprehensiveData('applications', appData);
        
        // Also add to URLs for better tracking
        const urlData = {
            type: 'url_tracking',
            action: 'current_url_tracked',
            url: currentUrl,
            title: currentTitle,
            domain: currentDomain,
            timestamp: new Date().toISOString(),
            category: 'browsing',
            priority: 'medium',
            details: {
                app_category: this.categorizeApplication(currentDomain),
                page_type: this.getPageType(currentUrl),
                is_external: currentDomain !== 'maze-password-manager.onrender.com'
            }
        };
        
        this.addToComprehensiveData('urls', urlData);
    }
    
    // 🏷️ CATEGORIZE APPLICATION
    categorizeApplication(domain) {
        if (domain.includes('gmail.com') || domain.includes('mail.google.com')) return 'email';
        if (domain.includes('youtube.com')) return 'entertainment';
        if (domain.includes('chatgpt.com')) return 'ai_services';
        if (domain.includes('github.com')) return 'development';
        if (domain.includes('stackoverflow.com')) return 'development';
        if (domain.includes('facebook.com')) return 'social_media';
        if (domain.includes('twitter.com') || domain.includes('x.com')) return 'social_media';
        if (domain.includes('linkedin.com')) return 'social_media';
        if (domain.includes('amazon.com')) return 'shopping';
        if (domain.includes('maps.google.com')) return 'services';
        if (domain.includes('docs.google.com')) return 'productivity';
        if (domain.includes('sheets.google.com')) return 'productivity';
        if (domain.includes('slides.google.com')) return 'productivity';
        if (domain.includes('trello.com')) return 'productivity';
        if (domain.includes('asana.com')) return 'productivity';
        if (domain.includes('atlassian.net')) return 'productivity';
        if (domain.includes('zoom.us')) return 'communication';
        if (domain.includes('meet.google.com')) return 'communication';
        if (domain.includes('teams.microsoft.com')) return 'communication';
        if (domain.includes('web.whatsapp.com')) return 'communication';
        if (domain.includes('web.telegram.org')) return 'communication';
        if (domain.includes('discord.com')) return 'communication';
        if (domain.includes('netflix.com')) return 'entertainment';
        if (domain.includes('open.spotify.com')) return 'entertainment';
        if (domain.includes('maze-password-manager.onrender.com')) return 'work_tools';
        if (domain.includes('invensis.net')) return 'work_tools';
        if (domain.includes('hrms')) return 'work_tools';
        if (domain.includes('employee')) return 'work_tools';
        if (domain.includes('attendance')) return 'work_tools';
        
        return 'other';
    }
    
    // 🆔 GET APPLICATION TYPE
    getApplicationType(domain) {
        if (domain.includes('gmail.com') || domain.includes('mail.google.com')) return 'Gmail';
        if (domain.includes('youtube.com')) return 'YouTube';
        if (domain.includes('chatgpt.com')) return 'ChatGPT';
        if (domain.includes('github.com')) return 'GitHub';
        if (domain.includes('stackoverflow.com')) return 'Stack Overflow';
        if (domain.includes('facebook.com')) return 'Facebook';
        if (domain.includes('twitter.com') || domain.includes('x.com')) return 'Twitter/X';
        if (domain.includes('linkedin.com')) return 'LinkedIn';
        if (domain.includes('amazon.com')) return 'Amazon';
        if (domain.includes('maps.google.com')) return 'Google Maps';
        if (domain.includes('docs.google.com')) return 'Google Docs';
        if (domain.includes('sheets.google.com')) return 'Google Sheets';
        if (domain.includes('slides.google.com')) return 'Google Slides';
        if (domain.includes('trello.com')) return 'Trello';
        if (domain.includes('asana.com')) return 'Asana';
        if (domain.includes('atlassian.net')) return 'Jira/Atlassian';
        if (domain.includes('zoom.us')) return 'Zoom';
        if (domain.includes('meet.google.com')) return 'Google Meet';
        if (domain.includes('teams.microsoft.com')) return 'Microsoft Teams';
        if (domain.includes('web.whatsapp.com')) return 'WhatsApp Web';
        if (domain.includes('web.telegram.org')) return 'Telegram Web';
        if (domain.includes('discord.com')) return 'Discord';
        if (domain.includes('netflix.com')) return 'Netflix';
        if (domain.includes('open.spotify.com')) return 'Spotify';
        if (domain.includes('maze-password-manager.onrender.com')) return 'Maya Vault';
        if (domain.includes('invensis.net')) return 'Invensis HRMS';
        if (domain.includes('hrms')) return 'HR Management System';
        if (domain.includes('employee')) return 'Employee Portal';
        if (domain.includes('attendance')) return 'Attendance System';
        
        return 'Unknown Application';
    }
    
    // 📄 GET PAGE TYPE
    getPageType(url) {
        if (url.includes('inbox') || url.includes('mail')) return 'email_inbox';
        if (url.includes('compose') || url.includes('write')) return 'email_compose';
        if (url.includes('watch')) return 'video_watching';
        if (url.includes('search')) return 'search_page';
        if (url.includes('dashboard')) return 'dashboard';
        if (url.includes('profile')) return 'profile';
        if (url.includes('settings')) return 'settings';
        if (url.includes('login') || url.includes('signin')) return 'authentication';
        if (url.includes('register') || url.includes('signup')) return 'registration';
        if (url.includes('attendance')) return 'attendance';
        if (url.includes('employee')) return 'employee_management';
        if (url.includes('hrms')) return 'hr_management';
        
        return 'general_page';
    }
    
    // 💼 IS WORK RELATED
    isWorkRelated(domain) {
        const workDomains = [
            'gmail.com', 'mail.google.com', 'outlook.com', 'office.com',
            'github.com', 'stackoverflow.com', 'docs.google.com',
            'sheets.google.com', 'slides.google.com', 'trello.com',
            'asana.com', 'atlassian.net', 'zoom.us', 'meet.google.com',
            'teams.microsoft.com', 'invensis.net', 'hrms', 'employee',
            'attendance', 'maze-password-manager.onrender.com'
        ];
        
        return workDomains.some(workDomain => domain.includes(workDomain));
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
            hash: window.location.hash,
            tabId: this.generateTabId(),
            isActive: !document.hidden,
            timeSpent: Date.now() - this.pageStartTime
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
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            memoryUsage: performance?.memory?.usedJSHeapSize || 0,
            memoryLimit: performance?.memory?.jsHeapSizeLimit || 0
        };
        
        this.addToComprehensiveData('systemInfo', systemInfo);
        
        // Collect performance data
        if (performance && performance.memory) {
            const performanceData = {
                timestamp: currentTime,
                memoryUsage: performance.memory.usedJSHeapSize,
                memoryLimit: performance.memory.jsHeapSizeLimit,
                memoryTotal: performance.memory.totalJSHeapSize,
                navigationType: performance.navigation.type,
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
            };
            
            this.addToComprehensiveData('performance', performanceData);
        }
        
        // Collect detailed activity data
        this.collectDetailedActivityData();
    }
    
    // 📝 COLLECT DETAILED ACTIVITY DATA
    collectDetailedActivityData() {
        const currentTime = new Date().toISOString();
        
        // Collect detailed browser activity
        const browserActivity = {
            timestamp: currentTime,
            currentUrl: window.location.href,
            currentTitle: document.title,
            referrer: document.referrer,
            tabCount: this.getTabCount(),
            windowCount: this.getWindowCount(),
            activeTab: !document.hidden,
            pageLoadTime: Date.now() - this.pageStartTime,
            scrollPosition: {
                x: window.pageXOffset,
                y: window.pageYOffset
            },
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        this.addToComprehensiveData('detailedActivities', browserActivity);
        
        // Collect detailed system activity
        const systemActivity = {
            timestamp: currentTime,
            keyboardActivity: this.getKeyboardActivity(),
            mouseActivity: this.getMouseActivity(),
            windowFocus: document.hasFocus(),
            documentReady: document.readyState,
            connectionType: navigator.connection?.effectiveType || 'unknown',
            batteryLevel: this.getBatteryLevel(),
            deviceMemory: navigator.deviceMemory || 'unknown'
        };
        
        this.addToComprehensiveData('detailedActivities', systemActivity);
    }
    
    // 🌐 MONITOR ALL OPEN TABS
    monitorAllOpenTabs() {
        // Track tab creation and destruction
        this.trackTabLifecycle();
        
        // Track tab switching
        this.trackTabSwitching();
        
        // Track tab content changes
        this.trackTabContentChanges();
        
        // Track cross-tab communication
        this.trackCrossTabCommunication();
    }
    
    // 📱 TRACK TAB LIFECYCLE
    trackTabLifecycle() {
        // Track when new tabs are created
        window.addEventListener('beforeunload', () => {
            const tabData = {
                type: 'tab_lifecycle',
                action: 'tab_closing',
                url: window.location.href,
                title: document.title,
                timestamp: new Date().toISOString(),
                timeSpent: Date.now() - this.pageStartTime,
                category: 'browsing',
                priority: 'medium',
                details: {
                    referrer: document.referrer,
                    scrollPosition: {
                        x: window.pageXOffset,
                        y: window.pageYOffset
                    },
                    formData: this.getFormData(),
                    localStorage: this.getLocalStorageData(),
                    sessionStorage: this.getSessionStorageData()
                }
            };
            
            this.recordGeneralActivity(tabData);
            this.addToComprehensiveData('openTabs', tabData);
        });
        
        // Track when tab becomes active
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                const tabData = {
                    type: 'tab_lifecycle',
                    action: 'tab_activated',
                    url: window.location.href,
                    title: document.title,
                    timestamp: new Date().toISOString(),
                    category: 'browsing',
                    priority: 'medium',
                    details: {
                        timeInactive: this.getTimeInactive(),
                        previousUrl: this.lastActiveUrl || 'unknown',
                        previousTitle: this.lastActiveTitle || 'unknown'
                    }
                };
                
                this.recordGeneralActivity(tabData);
                this.addToComprehensiveData('openTabs', tabData);
                
                this.lastActiveUrl = window.location.href;
                this.lastActiveTitle = document.title;
                this.pageStartTime = Date.now();
            }
        });
    }
    
    // 🔄 TRACK TAB SWITCHING
    trackTabSwitching() {
        let lastFocusTime = Date.now();
        
        window.addEventListener('focus', () => {
            const now = Date.now();
            const timeAway = now - lastFocusTime;
            
            const switchData = {
                type: 'tab_switching',
                action: 'tab_focused',
                url: window.location.href,
                title: document.title,
                timestamp: new Date().toISOString(),
                timeAway: timeAway,
                category: 'browsing',
                priority: 'medium',
                details: {
                    focusSource: 'window_focus',
                    previousFocusTime: lastFocusTime,
                    totalTimeAway: timeAway
                }
            };
            
            this.recordGeneralActivity(switchData);
            this.addToComprehensiveData('openTabs', switchData);
            
            lastFocusTime = now;
        });
        
        window.addEventListener('blur', () => {
            const now = Date.now();
            const timeFocused = now - lastFocusTime;
            
            const blurData = {
                type: 'tab_switching',
                action: 'tab_blurred',
                url: window.location.href,
                title: document.title,
                timestamp: new Date().toISOString(),
                timeFocused: timeFocused,
                category: 'browsing',
                priority: 'medium',
                details: {
                    blurReason: 'window_blur',
                    focusDuration: timeFocused
                }
            };
            
            this.recordGeneralActivity(blurData);
            this.addToComprehensiveData('openTabs', blurData);
        });
    }
    
    // 📄 TRACK TAB CONTENT CHANGES
    trackTabContentChanges() {
        // Track URL changes
        let currentUrl = window.location.href;
        const urlObserver = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                const urlChangeData = {
                    type: 'tab_content_change',
                    action: 'url_changed',
                    fromUrl: currentUrl,
                    toUrl: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'browsing',
                    priority: 'medium',
                    details: {
                        changeType: 'navigation',
                        previousDomain: new URL(currentUrl).hostname,
                        newDomain: window.location.hostname,
                        pathChange: window.location.pathname !== new URL(currentUrl).pathname
                    }
                };
                
                this.recordGeneralActivity(urlChangeData);
                this.addToComprehensiveData('openTabs', urlChangeData);
                
                currentUrl = window.location.href;
            }
        });
        
        urlObserver.observe(document.body, { childList: true, subtree: true });
        
        // Track title changes
        let currentTitle = document.title;
        const titleObserver = new MutationObserver(() => {
            if (document.title !== currentTitle) {
                const titleChangeData = {
                    type: 'tab_content_change',
                    action: 'title_changed',
                    fromTitle: currentTitle,
                    toTitle: document.title,
                    timestamp: new Date().toISOString(),
                    category: 'browsing',
                    priority: 'low',
                    details: {
                        changeType: 'title_update',
                        titleLength: document.title.length
                    }
                };
                
                this.recordGeneralActivity(titleChangeData);
                this.addToComprehensiveData('openTabs', titleChangeData);
                
                currentTitle = document.title;
            }
        });
        
        titleObserver.observe(document.head, { childList: true, subtree: true });
    }
    
    // 🌐 TRACK CROSS-TAB COMMUNICATION
    trackCrossTabCommunication() {
        // Track localStorage changes (cross-tab communication)
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
            const crossTabData = {
                type: 'cross_tab_communication',
                action: 'localStorage_set',
                key: key,
                value: value,
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'medium',
                details: {
                    storage_type: 'localStorage',
                    key_length: key.length,
                    value_length: value.length,
                    url: window.location.href,
                    domain: window.location.hostname
                }
            };
            
            if (window.enterpriseActivityMonitor) {
                window.enterpriseActivityMonitor.recordGeneralActivity(crossTabData);
                window.enterpriseActivityMonitor.addToComprehensiveData('crossBrowserActivity', crossTabData);
            }
            
            return originalSetItem.call(this, key, value);
        };
        
        // Track sessionStorage changes
        const originalSessionSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
            const sessionData = {
                type: 'cross_tab_communication',
                action: 'sessionStorage_set',
                key: key,
                value: value,
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'medium',
                details: {
                    storage_type: 'sessionStorage',
                    key_length: key.length,
                    value_length: value.length,
                    url: window.location.href,
                    domain: window.location.hostname
                }
            };
            
            if (window.enterpriseActivityMonitor) {
                window.enterpriseActivityMonitor.recordGeneralActivity(sessionData);
                window.enterpriseActivityMonitor.addToComprehensiveData('crossBrowserActivity', sessionData);
            }
            
            return originalSessionSetItem.call(this, key, value);
        };
        
        // Track postMessage communication
        const originalPostMessage = window.postMessage;
        window.postMessage = function(message, targetOrigin, transfer) {
            const postMessageData = {
                type: 'cross_tab_communication',
                action: 'postMessage_sent',
                message: typeof message === 'string' ? message : JSON.stringify(message),
                target_origin: targetOrigin,
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'medium',
                details: {
                    communication_method: 'postMessage',
                    message_type: typeof message,
                    target_origin: targetOrigin,
                    url: window.location.href,
                    domain: window.location.hostname
                }
            };
            
            if (window.enterpriseActivityMonitor) {
                window.enterpriseActivityMonitor.recordGeneralActivity(postMessageData);
                window.enterpriseActivityMonitor.addToComprehensiveData('crossBrowserActivity', postMessageData);
            }
            
            return originalPostMessage.call(this, message, targetOrigin, transfer);
        };
        
        // Track message reception
        window.addEventListener('message', (event) => {
            const messageData = {
                type: 'cross_tab_communication',
                action: 'postMessage_received',
                message: typeof event.data === 'string' ? event.data : JSON.stringify(event.data),
                source_origin: event.origin,
                source_url: event.source?.location?.href || 'unknown',
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'medium',
                details: {
                    communication_method: 'postMessage',
                    message_type: typeof event.data,
                    source_origin: event.origin,
                    current_url: window.location.href,
                    current_domain: window.location.hostname
                }
            };
            
            this.recordGeneralActivity(messageData);
            this.addToComprehensiveData('crossBrowserActivity', messageData);
        });
    }
    
    // 💻 MONITOR SYSTEM APPLICATIONS
    monitorSystemApplications() {
        // Track application launches
        this.trackApplicationLaunches();
        
        // Track application usage patterns
        this.trackApplicationUsagePatterns();
        
        // Track system resource usage
        this.trackSystemResources();
    }
    
    // 🚀 TRACK APPLICATION LAUNCHES
    trackApplicationLaunches() {
        // Track when applications become active
        window.addEventListener('focus', () => {
            const appData = {
                type: 'application_launch',
                action: 'app_activated',
                appName: 'browser',
                appType: 'web_browser',
                timestamp: new Date().toISOString(),
                category: 'applications',
                priority: 'medium',
                details: {
                    url: window.location.href,
                    title: document.title,
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language
                }
            };
            
            this.recordGeneralActivity(appData);
            this.addToComprehensiveData('systemApps', appData);
        });
        
        // Track when applications become inactive
        window.addEventListener('blur', () => {
            const appData = {
                type: 'application_launch',
                action: 'app_deactivated',
                appName: 'browser',
                appType: 'web_browser',
                timestamp: new Date().toISOString(),
                category: 'applications',
                priority: 'medium',
                details: {
                    url: window.location.href,
                    title: document.title,
                    timeActive: Date.now() - this.pageStartTime
                }
            };
            
            this.recordGeneralActivity(appData);
            this.addToComprehensiveData('systemApps', appData);
        });
    }
    
    // 📊 TRACK APPLICATION USAGE PATTERNS
    trackApplicationUsagePatterns() {
        // Track time spent on different applications
        setInterval(() => {
            const usageData = {
                type: 'application_usage_pattern',
                action: 'usage_update',
                appName: 'browser',
                timestamp: new Date().toISOString(),
                category: 'applications',
                priority: 'low',
                details: {
                    url: window.location.href,
                    title: document.title,
                    timeSpent: Date.now() - this.pageStartTime,
                    isActive: !document.hidden,
                    hasFocus: document.hasFocus()
                }
            };
            
            this.recordGeneralActivity(usageData);
            this.addToComprehensiveData('systemApps', usageData);
        }, 30000); // Every 30 seconds
    }
    
    // 💾 TRACK SYSTEM RESOURCES
    trackSystemResources() {
        // Track memory usage
        setInterval(() => {
            if (performance && performance.memory) {
                const resourceData = {
                    type: 'system_resources',
                    action: 'memory_update',
                    timestamp: new Date().toISOString(),
                    category: 'system',
                    priority: 'low',
                    details: {
                        usedMemory: performance.memory.usedJSHeapSize,
                        totalMemory: performance.memory.totalJSHeapSize,
                        memoryLimit: performance.memory.jsHeapSizeLimit,
                        memoryUsage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit * 100).toFixed(2) + '%'
                    }
                };
                
                this.recordGeneralActivity(resourceData);
                this.addToComprehensiveData('systemApps', resourceData);
            }
        }, 60000); // Every minute
    }
    
    // 🆔 GENERATE TAB ID
    generateTabId() {
        return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // 📊 GET TAB COUNT
    getTabCount() {
        // This is a simplified approach - in reality, you'd need more sophisticated methods
        return 1; // For now, we can only track the current tab
    }
    
    // 🪟 GET WINDOW COUNT
    getWindowCount() {
        // This is a simplified approach - in reality, you'd need more sophisticated methods
        return 1; // For now, we can only track the current window
    }
    
    // ⌨️ GET KEYBOARD ACTIVITY
    getKeyboardActivity() {
        return {
            totalKeys: this.keyCount || 0,
            specialKeys: this.specialKeyCount || 0,
            shortcuts: this.shortcutCount || 0,
            typingSpeed: this.typingSpeed || 0
        };
    }
    
    // 🖱️ GET MOUSE ACTIVITY
    getMouseActivity() {
        return {
            totalClicks: this.clickCount || 0,
            mouseArea: this.mouseArea || 0,
            scrollDistance: this.scrollDistance || 0,
            mousePattern: this.mousePattern || []
        };
    }
    
    // 🔋 GET BATTERY LEVEL
    async getBatteryLevel() {
        if (navigator.getBattery) {
            try {
                const battery = await navigator.getBattery();
                return {
                    level: battery.level,
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            } catch (error) {
                return 'unknown';
            }
        }
        return 'unknown';
    }
    
    // 📝 GET FORM DATA
    getFormData() {
        const forms = document.querySelectorAll('form');
        return Array.from(forms).map(form => ({
            id: form.id || 'no_id',
            action: form.action || 'no_action',
            method: form.method || 'get',
            fieldCount: form.elements.length
        }));
    }
    
    // 💾 GET LOCAL STORAGE DATA
    getLocalStorageData() {
        try {
            const keys = Object.keys(localStorage);
            return {
                keyCount: keys.length,
                keys: keys.slice(0, 10), // First 10 keys
                totalSize: JSON.stringify(localStorage).length
            };
        } catch (error) {
            return { keyCount: 0, keys: [], totalSize: 0 };
        }
    }
    
    // 📋 GET SESSION STORAGE DATA
    getSessionStorageData() {
        try {
            const keys = Object.keys(sessionStorage);
            return {
                keyCount: keys.length,
                keys: keys.slice(0, 10), // First 10 keys
                totalSize: JSON.stringify(sessionStorage).length
            };
        } catch (error) {
            return { keyCount: 0, keys: [], totalSize: 0 };
        }
    }
    
    // ⏰ GET TIME INACTIVE
    getTimeInactive() {
        return this.lastInactiveTime ? Date.now() - this.lastInactiveTime : 0;
    }
    
    // 🖥️ UPDATE MONITORING UI
    updateMonitoringUI() {
        // Update activity counts
        this.updateActivityCounts();
        
        // Update detailed information
        this.updateDetailedInfo();
        
        // Update URL history
        this.updateURLHistory();
        
        // Update real-time data
        this.updateRealTimeData();
    }
    
    // 📊 UPDATE ACTIVITY COUNTS
    updateActivityCounts() {
        // Update browser activity count
        const browserCount = document.getElementById('browser-count');
        if (browserCount) {
            browserCount.textContent = this.comprehensiveData.urls.length;
        }
        
        // Update system activity count
        const systemCount = document.getElementById('system-count');
        if (systemCount) {
            systemCount.textContent = this.comprehensiveData.systemTools.length;
        }
        
        // Update security events count
        const securityCount = document.getElementById('security-count');
        if (securityCount) {
            securityCount.textContent = this.comprehensiveData.downloads.length;
        }
        
        // Update network activity count
        const networkCount = document.getElementById('network-count');
        if (networkCount) {
            networkCount.textContent = this.comprehensiveData.crossBrowserActivity.length;
        }
    }
    
    // 📝 UPDATE DETAILED INFO
    updateDetailedInfo() {
        // Update current URL
        const currentUrl = document.getElementById('current-url');
        if (currentUrl) {
            currentUrl.textContent = window.location.href;
        }
        
        // Update time on page
        const pageTime = document.getElementById('page-time');
        if (pageTime) {
            const timeSpent = Math.floor((Date.now() - this.pageStartTime) / 1000);
            pageTime.textContent = `${timeSpent}s`;
        }
        
        // Update click count
        const clickCount = document.getElementById('click-count');
        if (clickCount) {
            clickCount.textContent = this.clickCount || 0;
        }
        
        // Update total URLs
        const totalUrls = document.getElementById('total-urls');
        if (totalUrls) {
            totalUrls.textContent = this.comprehensiveData.urls.length;
        }
        
        // Update active tabs
        const activeTabs = document.getElementById('active-tabs');
        if (activeTabs) {
            activeTabs.textContent = this.getTabCount();
        }
    }
    
    // 🌐 UPDATE URL HISTORY
    updateURLHistory() {
        const urlHistory = document.getElementById('url-history');
        if (!urlHistory) return;
        
        // Get recent URLs (last 15) with better filtering
        const recentUrls = this.getDiverseURLHistory();
        
        if (recentUrls.length === 0) {
            urlHistory.innerHTML = `
                <div class="url-item">
                    <span class="url-text">No URLs visited yet</span>
                    <span class="url-time">-</span>
                </div>
            `;
            return;
        }
        
        let urlHTML = '';
        recentUrls.forEach(url => {
            const domain = url.domain || 'Unknown';
            const time = new Date(url.timestamp).toLocaleTimeString();
            const isCurrent = url.url === window.location.href;
            const appType = this.getApplicationType(domain);
            const category = this.categorizeApplication(domain);
            
            // Add category icon and color coding
            const categoryIcon = this.getCategoryIcon(category);
            const categoryColor = this.getCategoryColor(category);
            
            urlHTML += `
                <div class="url-item ${isCurrent ? 'current' : ''}" style="border-left: 3px solid ${categoryColor}">
                    <div class="url-header">
                        <span class="category-icon">${categoryIcon}</span>
                        <span class="url-text">${appType}</span>
                        <span class="url-time">${time}</span>
                    </div>
                    <div class="url-details">
                        <span class="url-domain">${domain}</span>
                        <span class="url-category">${category.replace('_', ' ')}</span>
                    </div>
                </div>
            `;
        });
        
        // Add "View More" button if there are more URLs
        if (this.comprehensiveData.urls.length > 15) {
            urlHTML += `
                <div class="url-item view-more">
                    <button class="btn-view-more" onclick="showAllURLs()">
                        View ${this.comprehensiveData.urls.length - 15} More URLs
                    </button>
                </div>
            `;
        }
        
        urlHistory.innerHTML = urlHTML;
    }
    
    // 🌈 GET DIVERSE URL HISTORY
    getDiverseURLHistory() {
        const allUrls = this.comprehensiveData.urls || [];
        const uniqueDomains = new Set();
        const diverseUrls = [];
        
        console.log('🔍 Getting diverse URL history from', allUrls.length, 'total URLs');
        
        // First, prioritize external applications (not maze-password-manager)
        const externalUrls = allUrls.filter(url => {
            const domain = url.domain || url.url?.split('/')[2] || 'unknown';
            return domain !== 'maze-password-manager.onrender.com';
        });
        
        console.log('🌐 Found', externalUrls.length, 'external URLs');
        
        // Add unique external domains first
        for (let i = externalUrls.length - 1; i >= 0; i--) {
            const url = externalUrls[i];
            const domain = url.domain || url.url?.split('/')[2] || 'unknown';
            
            if (!uniqueDomains.has(domain)) {
                uniqueDomains.add(domain);
                diverseUrls.push(url);
                console.log('✅ Added external domain:', domain);
                
                if (diverseUrls.length >= 8) break; // Reserve space for current app
            }
        }
        
        // Then add current application URLs (but limit them)
        const currentAppUrls = allUrls.filter(url => {
            const domain = url.domain || url.url?.split('/')[2] || 'unknown';
            return domain === 'maze-password-manager.onrender.com';
        });
        
        console.log('🏠 Found', currentAppUrls.length, 'current app URLs');
        
        // Add only 2-3 current app URLs to show variety
        const currentAppToShow = currentAppUrls.slice(-3);
        diverseUrls.push(...currentAppToShow);
        
        // Fill remaining slots with more diverse URLs
        for (let i = allUrls.length - 1; i >= 0; i--) {
            const url = allUrls[i];
            if (!diverseUrls.some(existing => existing.url === url.url)) {
                diverseUrls.push(url);
                if (diverseUrls.length >= 15) break;
            }
        }
        
        console.log('🎯 Final diverse URLs count:', diverseUrls.length);
        console.log('🌐 Unique domains in display:', [...new Set(diverseUrls.map(url => url.domain))]);
        
        return diverseUrls.slice(0, 15);
    }
    
    // 🎨 GET CATEGORY ICON
    getCategoryIcon(category) {
        const icons = {
            'email': '📧',
            'entertainment': '🎬',
            'ai_services': '🤖',
            'development': '💻',
            'social_media': '📱',
            'shopping': '🛒',
            'services': '🔧',
            'productivity': '📊',
            'communication': '💬',
            'work_tools': '🛠️',
            'other': '🌐'
        };
        
        return icons[category] || '🌐';
    }
    
    // 🎨 GET CATEGORY COLOR
    getCategoryColor(category) {
        const colors = {
            'email': '#4285f4',
            'entertainment': '#ff0000',
            'ai_services': '#00bcd4',
            'development': '#673ab7',
            'social_media': '#1877f2',
            'shopping': '#ff9800',
            'services': '#4caf50',
            'productivity': '#2196f3',
            'communication': '#9c27b0',
            'work_tools': '#607d8b',
            'other': '#757575'
        };
        
        return colors[category] || '#757575';
    }
    
    // ⚡ UPDATE REAL-TIME DATA
    updateRealTimeData() {
        // Update keystrokes
        const keyCount = document.getElementById('key-count');
        if (keyCount) {
            keyCount.textContent = this.keyCount || 0;
        }
        
        // Update mouse area
        const mouseArea = document.getElementById('mouse-area');
        if (mouseArea) {
            mouseArea.textContent = `${this.mouseArea || 0}px²`;
        }
        
        // Update window focus
        const windowFocus = document.getElementById('window-focus');
        if (windowFocus) {
            windowFocus.textContent = document.hasFocus() ? 'Active' : 'Inactive';
        }
        
        // Update auth attempts
        const authAttempts = document.getElementById('auth-attempts');
        if (authAttempts) {
            authAttempts.textContent = this.authAttempts || 0;
        }
        
        // Update file downloads
        const fileDownloads = document.getElementById('file-downloads');
        if (fileDownloads) {
            fileDownloads.textContent = this.comprehensiveData.downloads.length;
        }
        
        // Update external links
        const externalLinks = document.getElementById('external-links');
        if (externalLinks) {
            externalLinks.textContent = this.externalLinks || 0;
        }
        
        // Update API calls
        const apiCalls = document.getElementById('api-calls');
        if (apiCalls) {
            apiCalls.textContent = this.apiCalls || 0;
        }
        
        // Update WebSocket connections
        const websocketConn = document.getElementById('websocket-conn');
        if (websocketConn) {
            websocketConn.textContent = this.websocketConn || 0;
        }
        
        // Update data transfer
        const dataTransfer = document.getElementById('data-transfer');
        if (dataTransfer) {
            dataTransfer.textContent = `${this.dataTransfer || 0}KB`;
        }
    }
    
    // 💾 STORE COMPREHENSIVE DATA
    storeComprehensiveData() {
        try {
            // Limit data size to prevent overflow
            const limitedData = this.limitDataSize(this.comprehensiveData);
            
            // Validate data before storing
            if (!this.validateData(limitedData)) {
                console.warn('⚠️ Data validation failed, skipping storage');
                return;
            }
            
            // Store data in localStorage for persistence
            localStorage.setItem('enterpriseMonitoringData', JSON.stringify(limitedData));
            console.log('💾 Comprehensive data stored successfully');
            
            // Send data to backend if available
            this.sendComprehensiveDataToBackend(limitedData);
            
        } catch (error) {
            console.error('❌ Failed to store comprehensive data:', error);
            
            // Try to store minimal data if full storage fails
            this.storeMinimalData();
        }
    }
    
    // 📏 LIMIT DATA SIZE
    limitDataSize(data) {
        const limitedData = {};
        
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                // Limit arrays to last 100 items
                limitedData[key] = data[key].slice(-100);
            } else if (typeof data[key] === 'object' && data[key] !== null) {
                // Limit object properties
                limitedData[key] = this.limitObjectSize(data[key]);
            } else {
                limitedData[key] = data[key];
            }
        });
        
        return limitedData;
    }
    
    // 🔒 LIMIT OBJECT SIZE
    limitObjectSize(obj) {
        const limited = {};
        const keys = Object.keys(obj);
        
        // Only keep first 50 properties to prevent overflow
        keys.slice(0, 50).forEach(key => {
            if (typeof obj[key] === 'string' && obj[key].length > 1000) {
                // Truncate long strings
                limited[key] = obj[key].substring(0, 1000) + '...';
            } else if (Array.isArray(obj[key]) && obj[key].length > 50) {
                // Limit array size
                limited[key] = obj[key].slice(-50);
            } else {
                limited[key] = obj[key];
            }
        });
        
        return limited;
    }
    
    // 🧹 CLEAN CIRCULAR REFERENCES
    cleanCircularReferences(data, maxDepth = 3, currentDepth = 0) {
        if (currentDepth >= maxDepth) {
            return '[Max Depth Reached]';
        }
        
        if (data === null || typeof data !== 'object') {
            return data;
        }
        
        // Handle arrays
        if (Array.isArray(data)) {
            return data.map((item, index) => {
                try {
                    return this.cleanCircularReferences(item, maxDepth, currentDepth + 1);
                } catch (error) {
                    return `[Array Item ${index} Error]`;
                }
            });
        }
        
        // Handle objects
        const cleaned = {};
        const seen = new WeakSet();
        
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                try {
                    // Skip problematic keys that might cause circular references
                    if (key === 'parent' || key === 'owner' || key === 'window' || key === 'document') {
                        cleaned[key] = '[Circular Reference]';
                        continue;
                    }
                    
                    const value = data[key];
                    
                    // Check if this value has been seen before
                    if (value && typeof value === 'object' && seen.has(value)) {
                        cleaned[key] = '[Circular Reference]';
                        continue;
                    }
                    
                    // Mark this value as seen
                    if (value && typeof value === 'object') {
                        seen.add(value);
                    }
                    
                    cleaned[key] = this.cleanCircularReferences(value, maxDepth, currentDepth + 1);
                } catch (error) {
                    cleaned[key] = `[Property ${key} Error]`;
                }
            }
        }
        
        return cleaned;
    }
    
    // ✅ VALIDATE DATA
    validateData(data) {
        try {
            // Check if data is too large
            const dataSize = JSON.stringify(data).length;
            if (dataSize > 1000000) { // 1MB limit
                console.warn(`⚠️ Data too large (${dataSize} bytes), truncating...`);
                return false;
            }
            
            // Check for circular references with better handling
            const seen = new WeakSet();
            const hasCircular = (obj, path = '') => {
                if (obj !== null && typeof obj === 'object') {
                    if (seen.has(obj)) {
                        console.warn(`⚠️ Circular reference detected at path: ${path}`);
                        return true;
                    }
                    seen.add(obj);
                    
                    for (let key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            // Skip problematic keys
                            if (key === 'parent' || key === 'owner' || key === 'window' || key === 'document') {
                                continue;
                            }
                            
                            const newPath = path ? `${path}.${key}` : key;
                            if (hasCircular(obj[key], newPath)) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            };
            
            if (hasCircular(data)) {
                console.warn('⚠️ Circular reference detected in data, cleaning...');
                // Try to clean the data instead of rejecting it
                const cleanedData = this.cleanCircularReferences(data);
                if (cleanedData) {
                    // Replace the original data with cleaned version
                    Object.assign(data, cleanedData);
                    return true;
                }
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('❌ Data validation error:', error);
            return false;
        }
    }
    
    // 💾 STORE MINIMAL DATA
    storeMinimalData() {
        try {
            const minimalData = {
                startTime: this.comprehensiveData.startTime,
                totalActivities: this.comprehensiveData.realTimeActivities?.length || 0,
                lastUpdate: new Date().toISOString()
            };
            
            localStorage.setItem('enterpriseMonitoringDataMinimal', JSON.stringify(minimalData));
            console.log('💾 Minimal data stored successfully');
        } catch (error) {
            console.error('❌ Failed to store minimal data:', error);
        }
    }
    
    // 📤 SEND DATA TO BACKEND
    async sendComprehensiveDataToBackend(data) {
        try {
            // Limit data size for backend
            const backendData = {
                user_id: 'demo-user',
                session_id: this.monitoringSession?.session_id,
                comprehensive_data: this.limitDataSize(data),
                timestamp: new Date().toISOString(),
                data_size: JSON.stringify(data).length
            };
            
            const response = await fetch('/api/enterprise/monitoring/record-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': 'demo-user'
                },
                body: JSON.stringify(backendData)
            });
            
            if (response.ok) {
                console.log('📤 Comprehensive data sent to backend');
            } else {
                console.log('⚠️ Failed to send data to backend:', response.status);
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
        
        // Limit data size before adding
        const limitedData = this.limitSingleDataItem(data);
        
        this.comprehensiveData[category].push(limitedData);
        
        // Keep only last 100 items per category to prevent overflow
        if (this.comprehensiveData[category].length > 100) {
            this.comprehensiveData[category] = this.comprehensiveData[category].slice(-100);
        }
        
        // Update real-time activities
        this.addToRealTimeActivities(limitedData);
        
        // Clean up old data periodically
        this.cleanupOldData();
    }
    
    // 🧹 LIMIT SINGLE DATA ITEM
    limitSingleDataItem(data) {
        const limited = {};
        
        Object.keys(data).forEach(key => {
            const value = data[key];
            
            if (typeof value === 'string') {
                // Limit string length to 500 characters
                limited[key] = value.length > 500 ? value.substring(0, 500) + '...' : value;
            } else if (Array.isArray(value)) {
                // Limit array to first 20 items
                limited[key] = value.slice(0, 20);
            } else if (typeof value === 'object' && value !== null) {
                // Limit object properties
                const objKeys = Object.keys(value);
                limited[key] = {};
                objKeys.slice(0, 20).forEach(objKey => {
                    if (typeof value[objKey] === 'string' && value[objKey].length > 200) {
                        limited[key][objKey] = value[objKey].substring(0, 200) + '...';
                    } else {
                        limited[key][objKey] = value[objKey];
                    }
                });
            } else {
                limited[key] = value;
            }
        });
        
        return limited;
    }
    
    // 🧹 CLEANUP OLD DATA
    cleanupOldData() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        Object.keys(this.comprehensiveData).forEach(category => {
            if (Array.isArray(this.comprehensiveData[category])) {
                this.comprehensiveData[category] = this.comprehensiveData[category].filter(item => {
                    if (item.timestamp) {
                        const itemTime = new Date(item.timestamp).getTime();
                        return (now - itemTime) < maxAge;
                    }
                    return true;
                });
            }
        });
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
        
        // Keep only last 100 real-time activities to prevent overflow
        if (this.comprehensiveData.realTimeActivities.length > 100) {
            this.comprehensiveData.realTimeActivities = this.comprehensiveData.realTimeActivities.slice(0, 100);
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
            try {
                const domain = new URL(data.url).hostname;
                return `Visited ${domain}`;
            } catch (error) {
                // Handle invalid URLs safely
                return `Activity with URL: ${data.url.substring(0, 50)}...`;
            }
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
    
    // 🚀 START REAL-TIME SYSTEM MONITORING
    startRealTimeSystemMonitoring() {
        // Initialize activity counters
        this.clickCount = 0;
        this.keyCount = 0;
        this.mouseArea = 0;
        this.authAttempts = 0;
        this.externalLinks = 0;
        this.apiCalls = 0;
        this.websocketConn = 0;
        this.dataTransfer = 0;
        this.scrollDistance = 0;
        this.specialKeyCount = 0;
        this.shortcutCount = 0;
        this.typingSpeed = 0;
        this.mousePattern = [];
        
        // Start tracking user interactions
        this.startInteractionTracking();
        
        // Start tracking system events
        this.startSystemEventTracking();
    }
    
    // 🖱️ START INTERACTION TRACKING
    startInteractionTracking() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.clickCount++;
            this.mouseArea = Math.max(this.mouseArea, e.clientX * e.clientY);
            
            const clickData = {
                type: 'user_interaction',
                action: 'click',
                element: e.target.tagName,
                elementText: e.target.textContent?.substring(0, 50),
                coordinates: { x: e.clientX, y: e.clientY },
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'low'
            };
            
            this.recordGeneralActivity(clickData);
            this.addToComprehensiveData('systemTools', clickData);
        });
        
        // Track keystrokes
        document.addEventListener('keydown', (e) => {
            this.keyCount++;
            
            if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
                this.specialKeyCount++;
            }
            
            if (e.ctrlKey || e.metaKey) {
                this.shortcutCount++;
            }
            
            const keyData = {
                type: 'user_interaction',
                action: 'keydown',
                key: e.key,
                code: e.code,
                modifiers: {
                    ctrl: e.ctrlKey,
                    shift: e.shiftKey,
                    alt: e.altKey,
                    meta: e.metaKey
                },
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'low'
            };
            
            this.recordGeneralActivity(keyData);
            this.addToComprehensiveData('systemTools', keyData);
        });
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mousePattern.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            
            // Keep only last 100 mouse positions
            if (this.mousePattern.length > 100) {
                this.mousePattern = this.mousePattern.slice(-100);
            }
        });
        
        // Track scrolling
        document.addEventListener('scroll', (e) => {
            this.scrollDistance += Math.abs(window.pageYOffset - (this.lastScrollY || 0));
            this.lastScrollY = window.pageYOffset;
        });
    }
    
    // 🛡️ START SYSTEM EVENT TRACKING
    startSystemEventTracking() {
        // Track authentication attempts
        document.addEventListener('submit', (e) => {
            if (e.target.action && e.target.action.includes('login')) {
                this.authAttempts++;
            }
        });
        
        // Track external links
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href !== window.location.href) {
                this.externalLinks++;
            }
        });
        
        // Track API calls
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            this.apiCalls++;
            return originalFetch(...args);
        };
        
        // Track WebSocket connections
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(...args) {
            this.websocketConn++;
            return new originalWebSocket(...args);
        };
    }
    
    // �� DETECT OTHER BROWSERS
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
    
    // 🌐 MONITOR ALL BROWSERS AND TABS
    monitorAllBrowsers() {
        // Track when user switches between different websites/apps
        let lastActiveTab = document.title;
        let lastActiveUrl = window.location.href;
        let lastActiveTitle = document.title;
        
        // Initialize page start time if not already set
        if (!this.pageStartTime) {
            this.pageStartTime = Date.now();
        }
        
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
                    priority: 'medium',
                    details: {
                        app_type: this.getApplicationType(lastActiveUrl.split('/')[2] || 'unknown'),
                        page_type: this.getPageType(lastActiveUrl),
                        is_external: !lastActiveUrl.includes('maze-password-manager.onrender.com')
                    }
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
                    priority: 'medium',
                    details: {
                        app_type: this.getApplicationType(window.location.hostname),
                        page_type: this.getPageType(window.location.href),
                        is_external: !window.location.href.includes('maze-password-manager.onrender.com')
                    }
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
                priority: 'medium',
                details: {
                    app_type: this.getApplicationType(window.location.hostname),
                    page_type: this.getPageType(window.location.href),
                    is_external: !window.location.href.includes('maze-password-manager.onrender.com')
                }
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
                priority: 'medium',
                details: {
                    app_type: this.getApplicationType(window.location.hostname),
                    page_type: this.getPageType(window.location.href),
                    is_external: !window.location.href.includes('maze-password-manager.onrender.com')
                }
            };
            
            this.recordGeneralActivity(loadData);
            this.addToComprehensiveData('urls', loadData);
        });
        
        // Track URL changes (for single-page applications)
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                const urlChangeData = {
                    type: 'url_change',
                    action: 'url_updated',
                    from_url: currentUrl,
                    to_url: window.location.href,
                    from_title: document.title,
                    to_title: document.title,
                    timestamp: new Date().toISOString(),
                    category: 'browsing',
                    priority: 'medium',
                    details: {
                        from_app: this.getApplicationType(currentUrl.split('/')[2] || 'unknown'),
                        to_app: this.getApplicationType(window.location.hostname),
                        from_page: this.getPageType(currentUrl),
                        to_page: this.getPageType(window.location.href),
                        is_external: !window.location.href.includes('maze-password-manager.onrender.com')
                    }
                };
                
                this.recordGeneralActivity(urlChangeData);
                this.addToComprehensiveData('urls', urlChangeData);
                
                currentUrl = window.location.href;
                console.log('🔄 URL changed to:', window.location.hostname);
            }
        }, 2000); // Check every 2 seconds
        
        // Track external link clicks
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link && link.href) {
                try {
                    const linkUrl = new URL(link.href);
                    const currentDomain = window.location.hostname;
                    
                    // Track external link clicks
                    if (linkUrl.hostname !== currentDomain) {
                        const externalData = {
                            type: 'external_link',
                            action: 'link_clicked',
                            url: link.href,
                            title: link.textContent || link.title || 'External Link',
                            domain: linkUrl.hostname,
                            timestamp: new Date().toISOString(),
                            category: 'navigation',
                            priority: 'medium',
                            details: {
                                app_type: this.getApplicationType(linkUrl.hostname),
                                page_type: this.getPageType(linkUrl.href),
                                is_external: true,
                                link_text: link.textContent?.substring(0, 50) || 'Unknown',
                                target: link.target || '_self'
                            }
                        };
                        
                        this.recordGeneralActivity(externalData);
                        this.addToComprehensiveData('external_links', externalData);
                        
                        console.log(`🔗 External link clicked: ${linkUrl.hostname}`);
                    }
                } catch (error) {
                    // Invalid URL, ignore
                }
            }
        });
        
        // Track form submissions (might indicate navigation to other sites)
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.action) {
                try {
                    const formUrl = new URL(form.action);
                    const currentDomain = window.location.hostname;
                    
                    if (formUrl.hostname !== currentDomain) {
                        const formData = {
                            type: 'form_submission',
                            action: 'form_submitted',
                            url: form.action,
                            domain: formUrl.hostname,
                            timestamp: new Date().toISOString(),
                            category: 'navigation',
                            priority: 'medium',
                            details: {
                                app_type: this.getApplicationType(formUrl.hostname),
                                page_type: this.getPageType(formUrl.href),
                                is_external: true,
                                form_method: form.method || 'GET'
                            }
                        };
                        
                        this.recordGeneralActivity(formData);
                        this.addToComprehensiveData('form_submissions', formData);
                        
                        console.log(`📝 Form submitted to: ${formUrl.hostname}`);
                    }
                } catch (error) {
                    // Invalid URL, ignore
                }
            }
        });
    }
    
    // 💻 MONITOR APPLICATION FOCUS
    monitorApplicationFocus() {
        // Track when user switches between different applications
        let lastFocusTime = Date.now();
        let currentApp = 'browser';
        
        // Monitor window focus changes
        window.addEventListener('focus', () => {
            const now = Date.now();
            const timeAway = now - lastFocusTime;
            
            const focusData = {
                type: 'application_focus',
                action: 'gained_focus',
                application: currentApp,
                time_away: timeAway,
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'medium'
            };
            
            this.recordGeneralActivity(focusData);
            this.addToComprehensiveData('applications', focusData);
            
            lastFocusTime = now;
        });
        
        window.addEventListener('blur', () => {
            const now = Date.now();
            const timeFocused = now - lastFocusTime;
            
            const blurData = {
                type: 'application_focus',
                action: 'lost_focus',
                application: currentApp,
                time_focused: timeFocused,
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'medium'
            };
            
            this.recordGeneralActivity(blurData);
            this.addToComprehensiveData('applications', blurData);
            
            lastFocusTime = now;
        });
        
        // Track if user is using multiple monitors
        if (window.screen && window.screen.width > 1920) {
            const multiMonitorData = {
                type: 'system_info',
                action: 'multi_monitor_detected',
                screen_width: window.screen.width,
                screen_height: window.screen.height,
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'low'
            };
            
            this.recordGeneralActivity(multiMonitorData);
            this.addToComprehensiveData('systemInfo', multiMonitorData);
        }
    }
    
    // ⌨️ MONITOR SYSTEM-WIDE INPUT
    monitorSystemInput() {
        // Enhanced keyboard monitoring
        let keyBuffer = [];
        let keyTimeout;
        
        document.addEventListener('keydown', (e) => {
            // Track special keys and shortcuts
            const specialKeys = [];
            if (e.ctrlKey) specialKeys.push('Ctrl');
            if (e.shiftKey) specialKeys.push('Shift');
            if (e.altKey) specialKeys.push('Alt');
            if (e.metaKey) specialKeys.push('Meta');
            
            keyBuffer.push({
                key: e.key,
                code: e.code,
                specialKeys: specialKeys,
                timestamp: Date.now()
            });
            
            // Analyze typing patterns
            clearTimeout(keyTimeout);
            keyTimeout = setTimeout(() => {
                if (keyBuffer.length > 5) {
                    this.analyzeTypingPattern(keyBuffer);
                    keyBuffer = [];
                }
            }, 3000);
            
            // Track common shortcuts
            if (e.ctrlKey || e.metaKey) {
                const shortcutData = {
                    type: 'keyboard_shortcut',
                    action: 'shortcut_used',
                    keys: specialKeys.join('+') + '+' + e.key,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'system',
                    priority: 'medium'
                };
                
                this.recordGeneralActivity(shortcutData);
                this.addToComprehensiveData('systemTools', shortcutData);
            }
        });
        
        // Enhanced mouse monitoring
        let mousePattern = [];
        let mouseTimeout;
        
        document.addEventListener('mousemove', (e) => {
            mousePattern.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                if (mousePattern.length > 20) {
                    this.analyzeMousePattern(mousePattern);
                    mousePattern = [];
                }
            }, 2000);
        });
        
        // Track right-click context menus
        document.addEventListener('contextmenu', (e) => {
            const contextMenuData = {
                type: 'mouse_action',
                action: 'context_menu',
                element: e.target.tagName,
                element_text: e.target.textContent?.substring(0, 50),
                url: window.location.href,
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'low'
            };
            
            this.recordGeneralActivity(contextMenuData);
            this.addToComprehensiveData('systemTools', contextMenuData);
        });
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
    
    // 📁 MONITOR FILE OPERATIONS
    monitorFileOperations() {
        // Track file drag and drop
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            
            files.forEach(file => {
                const dropData = {
                    type: 'file_operation',
                    action: 'files_dropped',
                    file_count: files.length,
                    file_name: file.name,
                    file_type: file.type,
                    file_size: file.size,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'files',
                    priority: 'medium'
                };
                
                this.recordGeneralActivity(dropData);
                this.addToComprehensiveData('files', dropData);
            });
        });
        
        // Track file input changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file') {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    const fileData = {
                        type: 'file_operation',
                        action: 'files_selected',
                        file_name: file.name,
                        file_type: file.type,
                        file_size: file.size,
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                        category: 'files',
                        priority: 'medium'
                    };
                    
                    this.recordGeneralActivity(fileData);
                    this.addToComprehensiveData('files', fileData);
                });
            }
        });
        
        // Track copy/paste operations
        document.addEventListener('copy', (e) => {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                const copyData = {
                    type: 'clipboard_operation',
                    action: 'text_copied',
                    text_length: selection.toString().length,
                    text_preview: selection.toString().substring(0, 100),
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'system',
                    priority: 'low'
                };
                
                this.recordGeneralActivity(copyData);
                this.addToComprehensiveData('systemTools', copyData);
            }
        });
        
        document.addEventListener('paste', (e) => {
            const pastedText = e.clipboardData?.getData('text');
            if (pastedText) {
                const pasteData = {
                    type: 'clipboard_operation',
                    action: 'text_pasted',
                    text_length: pastedText.length,
                    text_preview: pastedText.substring(0, 100),
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'system',
                    priority: 'low'
                };
                
                this.recordGeneralActivity(pasteData);
                this.addToComprehensiveData('systemTools', pasteData);
            }
        });
    }
    
    // 🌐 MONITOR SYSTEM NETWORK
    monitorSystemNetwork() {
        // Track all network requests
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const [url, options] = args;
            const startTime = Date.now();
            
            const fetchData = {
                type: 'fetch_request',
                action: 'api_call',
                url: url,
                method: options?.method || 'GET',
                timestamp: new Date().toISOString(),
                category: 'network',
                priority: 'medium'
            };
            
            this.recordNetworkActivity(fetchData);
            this.addToComprehensiveData('crossBrowserActivity', fetchData);
            
            return originalFetch(...args).then(response => {
                const duration = Date.now() - startTime;
                const responseData = {
                    type: 'fetch_response',
                    action: 'api_response',
                    url: url,
                    status: response.status,
                    duration: duration,
                    timestamp: new Date().toISOString(),
                    category: 'network',
                    priority: 'medium'
                };
                
                this.recordNetworkActivity(responseData);
                this.addToComprehensiveData('crossBrowserActivity', responseData);
                return response;
            });
        };
        
        // Track image loads
        document.addEventListener('load', (e) => {
            if (e.target.tagName === 'IMG') {
                const imageData = {
                    type: 'resource_load',
                    action: 'image_loaded',
                    url: e.target.src,
                    alt_text: e.target.alt || 'No alt text',
                    timestamp: new Date().toISOString(),
                    category: 'network',
                    priority: 'low'
                };
                
                this.recordNetworkActivity(imageData);
                this.addToComprehensiveData('crossBrowserActivity', imageData);
            }
        }, true);
        
        // Track video loads
        document.addEventListener('load', (e) => {
            if (e.target.tagName === 'VIDEO') {
                const videoData = {
                    type: 'resource_load',
                    action: 'video_loaded',
                    url: e.target.src,
                    duration: e.target.duration || 'Unknown',
                    timestamp: new Date().toISOString(),
                    category: 'network',
                    priority: 'low'
                };
                
                this.recordNetworkActivity(videoData);
                this.addToComprehensiveData('crossBrowserActivity', videoData);
            }
        }, true);
    }
    
    // 📋 MONITOR CLIPBOARD
    monitorClipboard() {
        // Track clipboard access attempts
        document.addEventListener('focus', (e) => {
            if (e.target.contentEditable === 'true' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                const clipboardData = {
                    type: 'clipboard_access',
                    action: 'input_focused',
                    element_type: e.target.tagName,
                    element_id: e.target.id || 'unknown',
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'system',
                    priority: 'low'
                };
                
                this.recordGeneralActivity(clipboardData);
                this.addToComprehensiveData('systemTools', clipboardData);
            }
        });
    }
    
    // 🖥️ MONITOR SCREEN ACTIVITY
    monitorScreenActivity() {
        // Track screen sharing attempts
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            // Monitor if user tries to share screen
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            navigator.mediaDevices.getDisplayMedia = function(constraints) {
                const screenData = {
                    type: 'screen_activity',
                    action: 'screen_share_requested',
                    constraints: constraints,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'system',
                    priority: 'high'
                };
                
                this.recordGeneralActivity(screenData);
                this.addToComprehensiveData('systemTools', screenData);
                
                return originalGetDisplayMedia.call(this, constraints);
            };
        }
        
        // Track fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            const fullscreenData = {
                type: 'screen_activity',
                action: document.fullscreenElement ? 'entered_fullscreen' : 'exited_fullscreen',
                element: document.fullscreenElement?.tagName || 'none',
                url: window.location.href,
                timestamp: new Date().toISOString(),
                category: 'system',
                priority: 'low'
            };
            
            this.recordGeneralActivity(fullscreenData);
            this.addToComprehensiveData('systemTools', fullscreenData);
        });
    }
    
    // ⏰ MONITOR APPLICATION TIME
    monitorApplicationTime() {
        let appStartTime = Date.now();
        let isAppActive = true;
        
        // Track application active time
        setInterval(() => {
            if (isAppActive) {
                const activeTime = Date.now() - appStartTime;
                
                // Record every 30 seconds of active time
                if (activeTime % 30000 < 1000) {
                    const timeData = {
                        type: 'application_time',
                        action: 'active_time_update',
                        active_time: activeTime,
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                        category: 'system',
                        priority: 'low'
                    };
                    
                    this.recordGeneralActivity(timeData);
                    this.addToComprehensiveData('applications', timeData);
                }
            }
        }, 1000);
        
        // Track when app becomes inactive
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isAppActive = false;
                const totalActiveTime = Date.now() - appStartTime;
                
                const inactiveData = {
                    type: 'application_time',
                    action: 'app_inactive',
                    total_active_time: totalActiveTime,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'system',
                    priority: 'low'
                };
                
                this.recordGeneralActivity(inactiveData);
                this.addToComprehensiveData('applications', inactiveData);
            } else {
                isAppActive = true;
                appStartTime = Date.now();
                
                const activeData = {
                    type: 'application_time',
                    action: 'app_active',
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    category: 'system',
                    priority: 'low'
                };
                
                this.recordGeneralActivity(activeData);
                this.addToComprehensiveData('applications', activeData);
            }
        });
    }
    
    // 🧠 ANALYZE TYPING PATTERNS
    analyzeTypingPattern(keyBuffer) {
        if (keyBuffer.length < 5) return;
        
        const typingSpeed = keyBuffer.length / 3; // keys per second
        const specialKeyUsage = keyBuffer.filter(k => k.specialKeys.length > 0).length;
        
        const patternData = {
            type: 'typing_analysis',
            action: 'pattern_analyzed',
            typing_speed: typingSpeed.toFixed(2),
            special_key_usage: specialKeyUsage,
            total_keys: keyBuffer.length,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            category: 'system',
            priority: 'low'
        };
        
        this.recordGeneralActivity(patternData);
        this.addToComprehensiveData('systemTools', patternData);
    }
    
    // 🖱️ ANALYZE MOUSE PATTERNS
    analyzeMousePattern(mousePattern) {
        if (mousePattern.length < 20) return;
        
        const totalDistance = this.calculateMouseDistance(mousePattern);
        const averageSpeed = totalDistance / (mousePattern.length / 2); // pixels per sample
        
        const mouseData = {
            type: 'mouse_analysis',
            action: 'pattern_analyzed',
            total_distance: totalDistance.toFixed(2),
            average_speed: averageSpeed.toFixed(2),
            sample_count: mousePattern.length,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            category: 'system',
            priority: 'low'
        };
        
        this.recordGeneralActivity(mouseData);
        this.addToComprehensiveData('systemTools', mouseData);
    }
    
    // 🧮 CALCULATE MOUSE DISTANCE
    calculateMouseDistance(pattern) {
        let totalDistance = 0;
        for (let i = 1; i < pattern.length; i++) {
            const dx = pattern[i].x - pattern[i-1].x;
            const dy = pattern[i].y - pattern[i-1].y;
            totalDistance += Math.sqrt(dx*dx + dy*dy);
        }
        return totalDistance;
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
    
    // 🧮 CALCULATE MOUSE DISTANCE
    calculateMouseDistance(pattern) {
        let totalDistance = 0;
        for (let i = 1; i < pattern.length; i++) {
            const dx = pattern[i].x - pattern[i-1].x;
            const dy = pattern[i].y - pattern[i-1].y;
            totalDistance += Math.sqrt(dx*dx + dy*dy);
        }
        return totalDistance;
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
    
    // 🌐 TRACK EXTERNAL WEBSITES
    trackExternalWebsites() {
        // Track when user visits external websites
        let currentUrl = window.location.href;
        let currentDomain = window.location.hostname;
        
        // Monitor URL changes
        const urlObserver = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                const newUrl = window.location.href;
                const newDomain = window.location.hostname;
                
                // Check if it's a different domain
                if (newDomain !== currentDomain) {
                    const externalSiteData = {
                        type: 'external_website_visit',
                        action: 'domain_changed',
                        from_url: currentUrl,
                        to_url: newUrl,
                        from_domain: currentDomain,
                        to_domain: newDomain,
                        timestamp: new Date().toISOString(),
                        category: 'browsing',
                        priority: 'high',
                        details: {
                            navigation_type: 'domain_change',
                            previous_domain: currentDomain,
                            new_domain: newDomain,
                            is_external: newDomain !== currentDomain
                        }
                    };
                    
                    this.recordGeneralActivity(externalSiteData);
                    this.addToComprehensiveData('urls', externalSiteData);
                    
                    // Update current state
                    currentUrl = newUrl;
                    currentDomain = newDomain;
                }
            }
        });
        
        urlObserver.observe(document.body, { childList: true, subtree: true });
        
        // Track external link clicks
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href !== window.location.href) {
                try {
                    const targetUrl = new URL(e.target.href);
                    const currentDomain = window.location.hostname;
                    
                    if (targetUrl.hostname !== currentDomain) {
                        const externalLinkData = {
                            type: 'external_link_click',
                            action: 'external_link_clicked',
                            from_url: window.location.href,
                            to_url: e.target.href,
                            from_domain: currentDomain,
                            to_domain: targetUrl.hostname,
                            link_text: e.target.textContent?.substring(0, 100),
                            timestamp: new Date().toISOString(),
                            category: 'browsing',
                            priority: 'medium',
                            details: {
                                link_type: 'external',
                                target_domain: targetUrl.hostname,
                                link_element: e.target.tagName
                            }
                        };
                        
                        this.recordGeneralActivity(externalLinkData);
                        this.addToComprehensiveData('crossBrowserActivity', externalLinkData);
                    }
                } catch (error) {
                    // Invalid URL, skip
                }
            }
        });
    }
    
    // 🧪 SIMULATE CROSS-APPLICATION VISITS (FOR TESTING)
    simulateCrossApplicationVisits() {
        console.log('🧪 Starting cross-application simulation...');
        
        const testApplications = [
            {
                url: 'https://gmail.com',
                title: 'Gmail - Inbox',
                domain: 'gmail.com',
                category: 'email',
                app_type: 'Gmail'
            },
            {
                url: 'https://youtube.com',
                title: 'YouTube - Home',
                domain: 'youtube.com',
                category: 'entertainment',
                app_type: 'YouTube'
            },
            {
                url: 'https://chatgpt.com',
                title: 'ChatGPT - AI Assistant',
                domain: 'chatgpt.com',
                category: 'ai_services',
                app_type: 'ChatGPT'
            },
            {
                url: 'https://github.com',
                title: 'GitHub - Code Repository',
                domain: 'github.com',
                category: 'development',
                app_type: 'GitHub'
            },
            {
                url: 'https://facebook.com',
                title: 'Facebook - Social Network',
                domain: 'facebook.com',
                category: 'social_media',
                app_type: 'Facebook'
            },
            {
                url: 'https://amazon.com',
                title: 'Amazon - Online Shopping',
                domain: 'amazon.com',
                category: 'shopping',
                app_type: 'Amazon'
            },
            {
                url: 'https://docs.google.com',
                title: 'Google Docs - Document Editor',
                domain: 'docs.google.com',
                category: 'productivity',
                app_type: 'Google Docs'
            },
            {
                url: 'https://trello.com',
                title: 'Trello - Project Management',
                domain: 'trello.com',
                category: 'productivity',
                app_type: 'Trello'
            },
            {
                url: 'https://zoom.us',
                title: 'Zoom - Video Conferencing',
                domain: 'zoom.us',
                category: 'communication',
                app_type: 'Zoom'
            },
            {
                url: 'https://netflix.com',
                title: 'Netflix - Streaming Service',
                domain: 'netflix.com',
                category: 'entertainment',
                app_type: 'Netflix'
            }
        ];
        
        // Clear existing test data first
        if (this.comprehensiveData.urls) {
            this.comprehensiveData.urls = this.comprehensiveData.urls.filter(url => 
                !url.details?.is_simulated
            );
        }
        
        // Add test applications to comprehensive data
        testApplications.forEach((app, index) => {
            const testData = {
                type: 'test_application',
                action: 'simulated_visit',
                url: app.url,
                title: app.title,
                domain: app.domain,
                timestamp: new Date(Date.now() - (index * 60000)).toISOString(), // Spread out over time
                category: 'browsing',
                priority: 'medium',
                details: {
                    app_type: app.app_type,
                    page_type: this.getPageType(app.url),
                    is_external: true,
                    is_simulated: true,
                    category: app.category
                }
            };
            
            // Add to URLs array directly
            if (!this.comprehensiveData.urls) {
                this.comprehensiveData.urls = [];
            }
            this.comprehensiveData.urls.push(testData);
            
            // Also add to applications array
            if (!this.comprehensiveData.applications) {
                this.comprehensiveData.applications = [];
            }
            this.comprehensiveData.applications.push(testData);
            
            console.log(`🧪 Added test app: ${app.app_type} (${app.domain})`);
        });
        
        // Force update the display
        this.updateURLHistory();
        
        console.log(`🧪 Successfully added ${testApplications.length} test applications`);
        console.log(`🧪 Total URLs now: ${this.comprehensiveData.urls.length}`);
        
        // Show the data in console for debugging
        const uniqueDomains = [...new Set(this.comprehensiveData.urls.map(url => url.domain))];
        console.log('🧪 Unique domains:', uniqueDomains);
    }
    
    // 🚀 SIMULATE REAL-TIME CROSS-APPLICATION VISITS
    simulateRealTimeVisits() {
        console.log('🚀 Starting real-time cross-application simulation...');
        
        const realTimeApps = [
            { domain: 'gmail.com', app: 'Gmail', category: 'email' },
            { domain: 'youtube.com', app: 'YouTube', category: 'entertainment' },
            { domain: 'chatgpt.com', app: 'ChatGPT', category: 'ai_services' },
            { domain: 'github.com', app: 'GitHub', category: 'development' },
            { domain: 'facebook.com', app: 'Facebook', category: 'social_media' },
            { domain: 'amazon.com', app: 'Amazon', category: 'shopping' },
            { domain: 'docs.google.com', app: 'Google Docs', category: 'productivity' },
            { domain: 'trello.com', app: 'Trello', category: 'productivity' },
            { domain: 'zoom.us', app: 'Zoom', category: 'communication' },
            { domain: 'netflix.com', app: 'Netflix', category: 'entertainment' }
        ];
        
        // Simulate visits every 10 seconds
        let appIndex = 0;
        const interval = setInterval(() => {
            const app = realTimeApps[appIndex % realTimeApps.length];
            
            const visitData = {
                type: 'real_time_visit',
                action: 'simulated_navigation',
                url: `https://${app.domain}`,
                title: `${app.app} - ${app.category}`,
                domain: app.domain,
                timestamp: new Date().toISOString(),
                category: 'browsing',
                priority: 'medium',
                details: {
                    app_type: app.app,
                    page_type: this.getPageType(`https://${app.domain}`),
                    is_external: true,
                    is_real_time_simulated: true,
                    category: app.category
                }
            };
            
            // Add to URLs array
            if (!this.comprehensiveData.urls) {
                this.comprehensiveData.urls = [];
            }
            this.comprehensiveData.urls.push(visitData);
            
            // Update display
            this.updateURLHistory();
            
            console.log(`🚀 Simulated visit to: ${app.app} (${app.domain})`);
            
            appIndex++;
            
            // Stop after 20 visits (2 minutes)
            if (appIndex >= 20) {
                clearInterval(interval);
                console.log('🚀 Real-time simulation completed');
            }
        }, 10000); // Every 10 seconds
        
        console.log('🚀 Real-time simulation started - will add visits every 10 seconds');
    }
}

// Initialize the activity monitor
const enterpriseActivityMonitor = new EnterpriseActivityMonitor();

// Export for global access
window.enterpriseActivityMonitor = enterpriseActivityMonitor;
