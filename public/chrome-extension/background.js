// 🔐 Agies Password Manager - Background Service Worker
// Handles extension lifecycle, context menus, and message routing

console.log('🔐 Agies Background Service Worker Starting...');

// Extension state
let extensionState = {
    isActive: true,
    userLoggedIn: false,
    vaultData: null,
    lastSync: null
};

// Initialize extension
chrome.runtime.onInstalled.addListener((details) => {
    console.log('🔐 Agies Extension Installed:', details.reason);
    
    if (details.reason === 'install') {
        // First time installation
        chrome.tabs.create({
            url: 'https://agies-password-manager.vercel.app/welcome'
        });
        
        // Set default settings
        chrome.storage.local.set({
            'agies_settings': {
                autofillEnabled: true,
                passwordCapture: true,
                keyboardShortcuts: true,
                contextMenu: true,
                notifications: true
            }
        });
    }
    
    // Create context menus
    createContextMenus();
});

// Extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log('🔐 Agies Extension Started');
    loadExtensionState();
});

// Create context menus
function createContextMenus() {
    try {
        // Remove existing menus
        chrome.contextMenus.removeAll(() => {
            // Create main context menu
            chrome.contextMenus.create({
                id: 'agies-main',
                title: '🔐 Agies Password Manager',
                contexts: ['all']
            });
            
            // Create sub-menus
            chrome.contextMenus.create({
                id: 'agies-autofill',
                parentId: 'agies-main',
                title: '🚀 Autofill Login',
                contexts: ['page', 'editable']
            });
            
            chrome.contextMenus.create({
                id: 'agies-capture',
                parentId: 'agies-main',
                title: '📥 Capture Password',
                contexts: ['editable']
            });
            
            chrome.contextMenus.create({
                id: 'agies-generate',
                parentId: 'agies-main',
                title: '✨ Generate Password',
                contexts: ['editable']
            });
            
            chrome.contextMenus.create({
                id: 'agies-vault',
                parentId: 'agies-main',
                title: '🗄️ Open Vault',
                contexts: ['all']
            });
            
            console.log('✅ Context menus created successfully');
        });
    } catch (error) {
        console.error('❌ Failed to create context menus:', error);
    }
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log('🔐 Context menu clicked:', info.menuItemId);
    
    switch (info.menuItemId) {
        case 'agies-autofill':
            handleAutofill(tab);
            break;
        case 'agies-capture':
            handlePasswordCapture(tab);
            break;
        case 'agies-generate':
            handlePasswordGeneration(tab);
            break;
        case 'agies-vault':
            openVault(tab);
            break;
    }
});

// Handle autofill request
async function handleAutofill(tab) {
    try {
        console.log('🚀 Triggering autofill for tab:', tab.id);
        
        // Send message to content script to trigger autofill
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: 'triggerAutofill',
            type: 'contextMenu'
        });
        
        if (response && response.success) {
            console.log('✅ Autofill triggered successfully');
        } else {
            console.warn('⚠️ Autofill response:', response);
        }
    } catch (error) {
        console.error('❌ Failed to trigger autofill:', error);
        
        // Fallback: inject autofill script
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    // Trigger autofill manually
                    if (window.agiesAutofillEngine) {
                        window.agiesAutofillEngine.triggerSmartAutofill();
                    } else {
                        console.log('🔐 Agies autofill engine not found, injecting...');
                        // This would inject the autofill engine
                    }
                }
            });
        } catch (injectionError) {
            console.error('❌ Failed to inject autofill script:', injectionError);
        }
    }
}

// Handle password capture
async function handlePasswordCapture(tab) {
    try {
        console.log('📥 Triggering password capture for tab:', tab.id);
        
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: 'capturePassword',
            type: 'contextMenu'
        });
        
        if (response && response.success) {
            console.log('✅ Password capture triggered successfully');
        }
    } catch (error) {
        console.error('❌ Failed to trigger password capture:', error);
    }
}

// Handle password generation
async function handlePasswordGeneration(tab) {
    try {
        console.log('✨ Triggering password generation for tab:', tab.id);
        
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: 'generatePassword',
            type: 'contextMenu'
        });
        
        if (response && response.success) {
            console.log('✅ Password generation triggered successfully');
        }
    } catch (error) {
        console.error('❌ Failed to trigger password generation:', error);
    }
}

// Open vault
function openVault(tab) {
    console.log('🗄️ Opening vault...');
    chrome.tabs.create({
        url: 'https://agies-password-manager.vercel.app/dashboard'
    });
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('🔐 Message received from content script:', message);
    
    try {
        switch (message.action) {
            case 'getExtensionState':
                sendResponse({
                    success: true,
                    state: extensionState
                });
                break;
                
            case 'updateExtensionState':
                extensionState = { ...extensionState, ...message.data };
                sendResponse({ success: true });
                break;
                
            case 'getPasswords':
                // This would fetch passwords from storage/backend
                sendResponse({
                    success: true,
                    passwords: getRealPasswords()
                });
                break;
                
            case 'savePassword':
                // This would save password to storage/backend
                console.log('💾 Saving password:', message.data);
                sendResponse({ success: true });
                break;
                
            case 'autofillComplete':
                console.log('✅ Autofill completed:', message.data);
                sendResponse({ success: true });
                break;
                
            case 'error':
                console.error('❌ Content script error:', message.error);
                sendResponse({ success: false, error: message.error });
                break;
                
            default:
                console.warn('⚠️ Unknown message action:', message.action);
                sendResponse({ success: false, error: 'Unknown action' });
        }
    } catch (error) {
        console.error('❌ Error handling message:', error);
        sendResponse({ success: false, error: error.message });
    }
    
    // Return true to indicate async response
    return true;
});

    // Get real passwords from the password manager
    function getRealPasswords() {
        try {
            // Get passwords from the main application's storage
            if (window.authService && window.authService.getPasswords) {
                return window.authService.getPasswords();
            }
            
            // Fallback to local storage
            const storedPasswords = localStorage.getItem('agies_passwords');
            if (storedPasswords) {
                return JSON.parse(storedPasswords);
            }
            
            // Return empty array if no passwords found
            return [];
            
        } catch (error) {
            console.error('Error retrieving passwords:', error);
            return [];
        }
    }

// Load extension state from storage
async function loadExtensionState() {
    try {
        const result = await chrome.storage.local.get(['agies_extension_state']);
        if (result.agies_extension_state) {
            extensionState = { ...extensionState, ...result.agies_extension_state };
            console.log('✅ Extension state loaded:', extensionState);
        }
    } catch (error) {
        console.error('❌ Failed to load extension state:', error);
    }
}

// Save extension state to storage
async function saveExtensionState() {
    try {
        await chrome.storage.local.set({
            'agies_extension_state': extensionState
        });
        console.log('✅ Extension state saved');
    } catch (error) {
        console.error('❌ Failed to save extension state:', error);
    }
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log('🔐 Tab updated:', tab.url);
        
        // Check if this is a login page
        if (isLoginPage(tab.url)) {
            console.log('🔐 Login page detected, preparing autofill...');
            
            // Send message to content script to prepare autofill
            chrome.tabs.sendMessage(tabId, {
                action: 'prepareAutofill',
                url: tab.url
            }).catch(error => {
                // Content script might not be ready yet
                console.log('📱 Content script not ready yet for tab:', tabId);
            });
        }
    }
});

// Check if URL is a login page
function isLoginPage(url) {
    const loginKeywords = [
        'login', 'signin', 'sign-in', 'logon', 'signon',
        'auth', 'authentication', 'account', 'user'
    ];
    
    const urlLower = url.toLowerCase();
    return loginKeywords.some(keyword => urlLower.includes(keyword));
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    console.log('🔐 Extension icon clicked for tab:', tab.id);
    
    // Open the popup or vault
    chrome.tabs.create({
        url: 'https://agies-password-manager.vercel.app/dashboard'
    });
});

// Periodic state save
setInterval(() => {
    saveExtensionState();
}, 30000); // Save every 30 seconds

console.log('✅ Agies Background Service Worker Initialized Successfully!');
