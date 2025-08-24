/**
 * Agies Analytics & Conversion Tracking System
 * Comprehensive tracking for user behavior, conversions, and business metrics
 */

class AgiesAnalytics {
    constructor() {
        this.isInitialized = false;
        this.userId = null;
        this.sessionId = null;
        this.events = [];
        this.conversionGoals = new Map();
        this.init();
    }

    async init() {
        try {
            await this.initializeTracking();
            await this.setupConversionGoals();
            await this.loadUserIdentity();
            this.isInitialized = true;
            console.log('✅ Agies Analytics initialized successfully');
        } catch (error) {
            console.error('❌ Analytics initialization failed:', error);
        }
    }

    // Initialize tracking systems
    async initializeTracking() {
        // Google Analytics 4
        this.initGoogleAnalytics();
        
        // Mixpanel for product analytics
        this.initMixpanel();
        
        // Hotjar for user behavior
        this.initHotjar();
        
        // Custom event tracking
        this.setupEventListeners();
        
        // Performance monitoring
        this.setupPerformanceTracking();
    }

    // Google Analytics 4 Setup
    initGoogleAnalytics() {
        // Load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                'custom_parameter_1': 'user_plan',
                'custom_parameter_2': 'user_type',
                'custom_parameter_3': 'feature_usage'
            }
        });

        this.gtag = gtag;
        console.log('✅ Google Analytics 4 initialized');
    }

    // Mixpanel Setup
    initMixpanel() {
        // Load Mixpanel script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2.2.0.min.js';
        document.head.appendChild(script);

        script.onload = () => {
            if (window.mixpanel) {
                window.mixpanel.init('MIXPANEL_TOKEN', {
                    debug: false,
                    track_pageview: true,
                    persistence: 'localStorage'
                });
                console.log('✅ Mixpanel initialized');
            }
        };
    }

    // Initialize Hotjar
    initHotjar() {
        try {
            const hotjarId = window.HOTJAR_ID || '1234567'; // Default demo ID
            if (hotjarId && hotjarId !== '1234567') {
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:hotjarId,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                console.log('✅ Hotjar initialized');
            } else {
                console.log('ℹ️ Hotjar disabled (demo mode)');
            }
        } catch (error) {
            console.log('ℹ️ Hotjar initialization failed:', error);
        }
    }

    // Setup conversion goals
    async setupConversionGoals() {
        this.conversionGoals.set('signup', {
            name: 'User Signup',
            value: 10,
            type: 'conversion'
        });

        this.conversionGoals.set('trial_start', {
            name: 'Free Trial Started',
            value: 25,
            type: 'conversion'
        });

        this.conversionGoals.set('premium_upgrade', {
            name: 'Premium Plan Upgrade',
            value: 100,
            type: 'conversion'
        });

        this.conversionGoals.set('business_upgrade', {
            name: 'Business Plan Upgrade',
            value: 200,
            type: 'conversion'
        });

        this.conversionGoals.set('team_invite', {
            name: 'Team Member Invited',
            value: 50,
            type: 'engagement'
        });

        this.conversionGoals.set('feature_usage', {
            name: 'Feature Usage',
            value: 5,
            type: 'engagement'
        });
    }

    // Load user identity
    async loadUserIdentity() {
        try {
            // Get user ID from localStorage or generate new one
            this.userId = localStorage.getItem('agies_user_id') || this.generateUserId();
            localStorage.setItem('agies_user_id', this.userId);

            // Generate session ID
            this.sessionId = this.generateSessionId();

            // Set user properties
            this.setUserProperties({
                userId: this.userId,
                sessionId: this.sessionId,
                userAgent: navigator.userAgent,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });

            console.log('✅ User identity loaded:', this.userId);
        } catch (error) {
            console.error('❌ Failed to load user identity:', error);
        }
    }

    // Generate unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Generate session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Set user properties
    setUserProperties(properties) {
        if (this.gtag) {
            this.gtag('config', 'GA_MEASUREMENT_ID', {
                custom_map: properties
            });
        }

        if (window.mixpanel) {
            window.mixpanel.identify(this.userId);
            window.mixpanel.people.set(properties);
        }
    }

    // Track page views
    trackPageView(pageName, pageCategory = 'general') {
        const pageData = {
            page_name: pageName,
            page_category: pageCategory,
            page_url: window.location.href,
            page_title: document.title,
            timestamp: new Date().toISOString(),
            userId: this.userId,
            sessionId: this.sessionId
        };

        // Google Analytics
        if (this.gtag) {
            this.gtag('event', 'page_view', pageData);
        }

        // Mixpanel
        if (window.mixpanel) {
            window.mixpanel.track('Page View', pageData);
        }

        // Custom tracking
        this.trackEvent('page_view', pageData);
        
        console.log('📊 Page view tracked:', pageName);
    }

    // Track custom events
    trackEvent(eventName, eventData = {}) {
        const event = {
            event_name: eventName,
            event_data: eventData,
            timestamp: new Date().toISOString(),
            userId: this.userId,
            sessionId: this.sessionId,
            page_url: window.location.href
        };

        // Store event locally
        this.events.push(event);

        // Google Analytics
        if (this.gtag) {
            this.gtag('event', eventName, eventData);
        }

        // Mixpanel
        if (window.mixpanel) {
            window.mixpanel.track(eventName, eventData);
        }

        // Check if this is a conversion goal
        this.checkConversionGoal(eventName, eventData);

        console.log('📊 Event tracked:', eventName, eventData);
    }

    // Check conversion goals
    checkConversionGoal(eventName, eventData) {
        const goal = this.conversionGoals.get(eventName);
        if (goal) {
            this.trackConversion(goal, eventData);
        }
    }

    // Track conversions
    trackConversion(goal, eventData) {
        const conversion = {
            goal_name: goal.name,
            goal_value: goal.value,
            goal_type: goal.type,
            event_data: eventData,
            timestamp: new Date().toISOString(),
            userId: this.userId
        };

        // Google Analytics conversion
        if (this.gtag) {
            this.gtag('event', 'conversion', {
                send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
                value: goal.value,
                currency: 'USD'
            });
        }

        // Store conversion locally
        localStorage.setItem(`conversion_${Date.now()}`, JSON.stringify(conversion));

        console.log('🎯 Conversion tracked:', goal.name, 'Value:', goal.value);
    }

    // Track user engagement
    trackEngagement(action, details = {}) {
        const engagementData = {
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            userId: this.userId,
            sessionId: this.sessionId
        };

        this.trackEvent('user_engagement', engagementData);
    }

    // Track feature usage
    trackFeatureUsage(featureName, usageData = {}) {
        const featureData = {
            feature_name: featureName,
            usage_data: usageData,
            timestamp: new Date().toISOString(),
            userId: this.userId
        };

        this.trackEvent('feature_usage', featureData);
    }

    // Track conversion funnel
    trackFunnelStep(stepName, stepData = {}) {
        const funnelData = {
            step_name: stepName,
            step_data: stepData,
            timestamp: new Date().toISOString(),
            userId: this.userId,
            sessionId: this.sessionId
        };

        this.trackEvent('funnel_step', funnelData);
    }

    // Track A/B test variations
    trackABTest(testName, variation, testData = {}) {
        const abTestData = {
            test_name: testName,
            variation: variation,
            test_data: testData,
            timestamp: new Date().toISOString(),
            userId: this.userId
        };

        this.trackEvent('ab_test', abTestData);
    }

    // Setup event listeners for automatic tracking
    setupEventListeners() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                const buttonText = e.target.textContent.trim();
                const buttonClass = e.target.className;
                const buttonId = e.target.id;
                
                this.trackEvent('button_click', {
                    button_text: buttonText,
                    button_class: buttonClass,
                    button_id: buttonId,
                    page_url: window.location.href
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const formId = e.target.id;
            const formAction = e.target.action;
            
            this.trackEvent('form_submit', {
                form_id: formId,
                form_action: formAction,
                page_url: window.location.href
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track every 25%
                    this.trackEvent('scroll_depth', {
                        scroll_percent: maxScroll,
                        page_url: window.location.href
                    });
                }
            }
        });

        // Track time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            this.trackEvent('time_on_page', {
                time_on_page: timeOnPage,
                page_url: window.location.href
            });
        });
    }

    // Performance tracking
    setupPerformanceTracking() {
        // Track page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.trackEvent('page_performance', {
                        load_time: perfData.loadEventEnd - perfData.loadEventStart,
                        dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        first_paint: performance.getEntriesByName('first-paint')[0]?.startTime,
                        first_contentful_paint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
                    });
                }
            }, 0);
        });
    }

    // Get analytics summary
    getAnalyticsSummary() {
        return {
            totalEvents: this.events.length,
            userId: this.userId,
            sessionId: this.sessionId,
            conversionGoals: Array.from(this.conversionGoals.values()),
            isInitialized: this.isInitialized
        };
    }

    // Export analytics data
    exportAnalyticsData() {
        const data = {
            events: this.events,
            user: {
                userId: this.userId,
                sessionId: this.sessionId
            },
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agies_analytics_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics
const agiesAnalytics = new AgiesAnalytics();

// Export for global use
window.AgiesAnalytics = AgiesAnalytics;
window.agiesAnalytics = agiesAnalytics;

console.log('📊 Agies Analytics System Ready');
console.log('🎯 Conversion tracking enabled');
console.log('📈 Performance monitoring active');
