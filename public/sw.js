/**
 * Service Worker for Agies Password Manager
 * Advanced caching, offline support, and performance optimization
 */

const CACHE_NAME = 'agies-v1.0.0';
const STATIC_CACHE = 'agies-static-v1';
const DYNAMIC_CACHE = 'agies-dynamic-v1';
const API_CACHE = 'agies-api-v1';

// Files to cache immediately
const STATIC_ASSETS = [
    '/',
    '/dashboard-working.html',
    '/security-dashboard.html',
    '/index.html',
    '/css/main.css',
    '/js/auth.js',
    '/js/vault-system.js',
    '/js/agies-app.js',
    '/js/real-security-data.js',
    '/js/2fa-manager.js',
    '/js/advanced-security.js',
    '/js/password-health-analyzer.js',
    '/js/performance-optimizer.js',
    '/manifest.json',
    '/offline.html'
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/security/status',
    '/api/user/profile',
    '/api/vaults',
    '/api/passwords'
];

// Cache strategies
const CACHE_STRATEGIES = {
    static: 'cache-first',
    api: 'network-first',
    dynamic: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            }),
            caches.open(API_CACHE).then(cache => {
                console.log('📡 Preparing API cache...');
                return Promise.resolve();
            })
        ]).then(() => {
            console.log('✅ Service Worker installed successfully');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName !== API_CACHE) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests and chrome-extension URLs
    if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return;
    }
    
    // Determine cache strategy based on request
    if (isStaticAsset(request.url)) {
        event.respondWith(cacheFirstStrategy(request));
    } else if (isAPIRequest(request.url)) {
        event.respondWith(networkFirstStrategy(request));
    } else {
        event.respondWith(staleWhileRevalidateStrategy(request));
    }
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Cache hit (static):', request.url);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('💾 Cached static asset:', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('❌ Cache-first failed:', request.url, error);
        
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            return caches.match('/offline.html');
        }
        
        throw error;
    }
}

// Network-first strategy for API requests
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(API_CACHE);
            // Cache API responses with timestamp
            const responseToCache = networkResponse.clone();
            
            // Add cache metadata
            const cacheEntry = {
                response: responseToCache,
                timestamp: Date.now(),
                url: request.url
            };
            
            cache.put(request, responseToCache);
            console.log('📡 Cached API response:', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🌐 Network failed, trying cache:', request.url);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Cache hit (API):', request.url);
            // Add stale indicator header
            const headers = new Headers(cachedResponse.headers);
            headers.set('X-Served-From', 'cache');
            headers.set('X-Cache-Date', new Date().toISOString());
            
            return new Response(cachedResponse.body, {
                status: cachedResponse.status,
                statusText: cachedResponse.statusText,
                headers: headers
            });
        }
        
        throw error;
    }
}

// Stale-while-revalidate strategy for dynamic content
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Always try to fetch fresh content in background
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
            console.log('🔄 Background update:', request.url);
        }
        return networkResponse;
    }).catch(error => {
        console.log('🌐 Background fetch failed:', request.url, error);
        return null;
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        console.log('📦 Serving stale content:', request.url);
        return cachedResponse;
    }
    
    // Wait for network if no cache available
    try {
        return await fetchPromise;
    } catch (error) {
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            return caches.match('/offline.html');
        }
        throw error;
    }
}

// Check if request is for static asset
function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.endsWith(asset)) ||
           url.includes('/css/') ||
           url.includes('/js/') ||
           url.includes('/fonts/') ||
           url.includes('/images/') ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.svg') ||
           url.includes('.ico');
}

// Check if request is for API
function isAPIRequest(url) {
    return url.includes('/api/') ||
           API_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'password-sync') {
        event.waitUntil(syncPasswords());
    } else if (event.tag === 'security-sync') {
        event.waitUntil(syncSecurityData());
    }
});

// Sync passwords when back online
async function syncPasswords() {
    try {
        console.log('🔄 Syncing passwords...');
        
        // Get offline changes from IndexedDB
        const offlineChanges = await getOfflineChanges('passwords');
        
        for (const change of offlineChanges) {
            try {
                await fetch('/api/passwords', {
                    method: change.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(change.data)
                });
                
                console.log('✅ Synced password change:', change.id);
                await removeOfflineChange('passwords', change.id);
            } catch (error) {
                console.log('❌ Failed to sync password:', change.id, error);
            }
        }
        
        console.log('🔄 Password sync completed');
    } catch (error) {
        console.log('❌ Password sync failed:', error);
    }
}

// Sync security data when back online
async function syncSecurityData() {
    try {
        console.log('🔄 Syncing security data...');
        
        // Refresh security status
        const response = await fetch('/api/security/status');
        if (response.ok) {
            const cache = await caches.open(API_CACHE);
            cache.put('/api/security/status', response.clone());
        }
        
        console.log('✅ Security data synced');
    } catch (error) {
        console.log('❌ Security sync failed:', error);
    }
}

// Push notification handler
self.addEventListener('push', (event) => {
    console.log('📢 Push notification received');
    
    const options = {
        body: 'Security alert from Agies Password Manager',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {
                action: 'view',
                title: 'View Details',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    if (event.data) {
        const data = event.data.json();
        options.body = data.body || options.body;
        options.title = data.title || 'Agies Security Alert';
    }
    
    event.waitUntil(
        self.registration.showNotification('Agies Password Manager', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/security-dashboard.html')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open dashboard
        event.waitUntil(
            clients.openWindow('/dashboard-working.html')
        );
    }
});

// Handle cache quota exceeded
self.addEventListener('quotaexceeded', (event) => {
    console.log('💾 Cache quota exceeded');
    
    event.waitUntil(
        cleanupOldCaches()
    );
});

// Cleanup old cache entries
async function cleanupOldCaches() {
    try {
        console.log('🧹 Cleaning up old caches...');
        
        const cacheNames = await caches.keys();
        const apiCache = await caches.open(API_CACHE);
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        
        // Clean API cache entries older than 1 hour
        const apiKeys = await apiCache.keys();
        for (const request of apiKeys) {
            const response = await apiCache.match(request);
            const cacheDate = response.headers.get('date');
            if (cacheDate && Date.now() - new Date(cacheDate).getTime() > 3600000) {
                await apiCache.delete(request);
            }
        }
        
        // Clean dynamic cache entries (keep only 50 most recent)
        const dynamicKeys = await dynamicCache.keys();
        if (dynamicKeys.length > 50) {
            const keysToDelete = dynamicKeys.slice(50);
            for (const request of keysToDelete) {
                await dynamicCache.delete(request);
            }
        }
        
        console.log('✅ Cache cleanup completed');
    } catch (error) {
        console.log('❌ Cache cleanup failed:', error);
    }
}

// Utility functions for offline data management
async function getOfflineChanges(type) {
    // In a real implementation, this would use IndexedDB
    return JSON.parse(localStorage.getItem(`offline_${type}`) || '[]');
}

async function removeOfflineChange(type, id) {
    // In a real implementation, this would use IndexedDB
    const changes = await getOfflineChanges(type);
    const filtered = changes.filter(change => change.id !== id);
    localStorage.setItem(`offline_${type}`, JSON.stringify(filtered));
}

// Performance monitoring
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
        console.log('📊 Performance metrics received:', event.data.metrics);
        
        // Store performance data for analysis
        const metrics = event.data.metrics;
        storePerformanceMetrics(metrics);
    }
});

async function storePerformanceMetrics(metrics) {
    try {
        const cache = await caches.open('performance-cache');
        const metricsData = {
            timestamp: Date.now(),
            metrics: metrics
        };
        
        const response = new Response(JSON.stringify(metricsData));
        await cache.put('/performance/latest', response);
    } catch (error) {
        console.log('❌ Failed to store performance metrics:', error);
    }
}

console.log('🔧 Service Worker loaded and ready');
console.log('📦 Cache strategies:', CACHE_STRATEGIES);
console.log('🚀 Offline support enabled');
