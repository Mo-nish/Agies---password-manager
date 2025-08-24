// Components Module - Contains all HTML templates
const Components = {
    
    // Login Form
    getLoginForm() {
        return `
            <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
                <div class="max-w-md w-full space-y-8">
                    <div class="text-center">
                        <div class="mx-auto h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p class="text-purple-300">Sign in to your Padhma Vyuham vault</p>
                    </div>
                    
                    <form class="mt-8 space-y-6" id="login-form">
                        <div class="space-y-4">
                            <div>
                                <label for="login-email" class="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                                <input id="login-email" name="email" type="email" required 
                                    class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                    placeholder="Enter your email">
                            </div>
                            <div>
                                <label for="login-password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input id="login-password" name="password" type="password" required 
                                    class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                    placeholder="Enter your password">
                            </div>
                            <div>
                                <label for="login-master-key" class="block text-sm font-medium text-gray-300 mb-2">Master Key</label>
                                <input id="login-master-key" name="masterKey" type="password" required 
                                    class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                    placeholder="Enter your master key">
                                <p class="text-xs text-gray-500 mt-1">This is your vault's master encryption key</p>
                            </div>
                        </div>

                        <div>
                            <button type="submit" 
                                class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                                Sign In to Vault
                            </button>
                        </div>

                        <div class="text-center">
                            <a href="#" id="switch-to-register" class="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Don't have an account? Create one
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    // Register Form
    getRegisterForm() {
        return `
            <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
                <div class="max-w-md w-full space-y-8">
                    <div class="text-center">
                        <div class="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold text-white mb-2">Create Your Vault</h2>
                        <p class="text-purple-300">Join the most secure password manager</p>
                    </div>
                    
                    <form class="mt-8 space-y-6" id="register-form">
                        <div class="space-y-4">
                            <div>
                                <label for="register-email" class="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                                <input id="register-email" name="email" type="email" required 
                                    class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                    placeholder="Enter your email">
                            </div>
                            <div>
                                <label for="register-username" class="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                <input id="register-username" name="username" type="text" required 
                                    class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                    placeholder="Choose a username">
                            </div>
                            <div>
                                <label for="register-password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input id="register-password" name="password" type="password" required 
                                    class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                    placeholder="Create a strong password">
                                <p class="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                            </div>
                            <div>
                                <label for="register-master-key" class="block text-sm font-medium text-gray-300 mb-2">Master Key</label>
                                <input id="register-master-key" name="masterKey" type="password" required 
                                    class="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                    placeholder="Create your master encryption key">
                                <p class="text-xs text-gray-500 mt-1">Minimum 12 characters - this encrypts your entire vault</p>
                            </div>
                        </div>

                        <div>
                            <button type="submit" 
                                class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                                Create Secure Vault
                            </button>
                        </div>

                        <div class="text-center">
                            <a href="#" id="switch-to-login" class="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Already have an account? Sign in
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    // Professional Dashboard
    getDashboard() {
        return `
            <div class="min-h-screen bg-gray-900">
                <!-- Header -->
                <header class="bg-gray-800 border-b border-gray-700">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center justify-between h-16">
                            <div class="flex items-center space-x-4">
                                <div class="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <h1 class="text-xl font-bold text-white">Padhma Vyuham Vault</h1>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <button id="generate-api-key-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    🔑 Generate API Key
                                </button>
                                <button id="add-password-btn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    + Add Password
                                </button>
                                <button id="logout-btn" class="text-gray-300 hover:text-white transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Welcome Section -->
                    <div class="bg-gradient-to-r from-purple-900 to-purple-800 rounded-xl p-6 mb-8">
                        <h2 class="text-2xl font-bold text-white mb-2">Welcome back, <span id="user-name">User</span>! 👋</h2>
                        <p class="text-purple-200">Your vault is protected by the most advanced security system ever created.</p>
                    </div>

                    <!-- Quick Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="bg-gray-800 rounded-lg p-6">
                            <div class="flex items-center">
                                <div class="p-2 bg-blue-600 rounded-lg">
                                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-400">Total Passwords</p>
                                    <p class="text-2xl font-bold text-white" id="total-passwords">0</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-800 rounded-lg p-6">
                            <div class="flex items-center">
                                <div class="p-2 bg-green-600 rounded-lg">
                                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-400">Security Level</p>
                                    <p class="text-2xl font-bold text-white">Maximum</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-800 rounded-lg p-6">
                            <div class="flex items-center">
                                <div class="p-2 bg-purple-600 rounded-lg">
                                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                    </svg>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-400">Vaults</p>
                                    <p class="text-2xl font-bold text-white" id="total-vaults">1</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-800 rounded-lg p-6">
                            <div class="flex items-center">
                                <div class="p-2 bg-red-600 rounded-lg">
                                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                    </svg>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-400">Threats Blocked</p>
                                    <p class="text-2xl font-bold text-white" id="threats-blocked">0</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Passwords -->
                    <div class="bg-gray-800 rounded-lg p-6 mb-8">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-semibold text-white">Recent Passwords</h3>
                            <button id="view-all-passwords" class="text-purple-400 hover:text-purple-300 transition-colors">
                                View All
                            </button>
                        </div>
                        <div id="recent-passwords-list" class="space-y-3">
                            <div class="text-center py-8">
                                <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                <p class="text-gray-500 mt-2">No passwords yet</p>
                                <p class="text-gray-600 text-sm">Add your first password to get started</p>
                            </div>
                        </div>
                    </div>

                    <!-- Security Status -->
                    <div class="bg-gray-800 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-6">Security Status</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span class="text-gray-300">Outer Perimeter - Active</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span class="text-gray-300">Middle Defense - Active</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span class="text-gray-300">Inner Sanctum - Active</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span class="text-gray-300">Core Vault - Active</span>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span class="text-gray-300">AI Guardian - Online</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span class="text-gray-300">Honeypots - Deployed</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span class="text-gray-300">Encryption - AES-256</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span class="text-gray-300">Backup - Enabled</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    // Add Password Modal
    getAddPasswordModal() {
        return `
            <div id="add-password-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                <div class="bg-gray-800 rounded-xl p-8 w-full max-w-md mx-4">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-white">Add New Password</h3>
                        <button id="close-add-modal" class="text-gray-400 hover:text-white transition-colors">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <form id="add-password-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Website/Service</label>
                            <input type="text" id="password-website" required
                                   class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="e.g., google.com, github.com">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Username/Email</label>
                            <input type="text" id="password-username" required
                                   class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="Enter username or email">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div class="relative">
                                <input type="password" id="password-value" required
                                       class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                                       placeholder="Enter password">
                                <button type="button" id="generate-password-btn" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
                            <textarea id="password-notes" rows="3"
                                      class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                      placeholder="Add any additional notes..."></textarea>
                        </div>
                        
                        <div class="flex space-x-3 pt-4">
                            <button type="submit" 
                                    class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                                Save Password
                            </button>
                            <button type="button" id="cancel-add-password"
                                    class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    // Security Dashboard
    getSecurity() {
        return `
            <div class="min-h-screen bg-gray-900">
                <!-- Header -->
                <header class="bg-gray-800 border-b border-gray-700">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center justify-between h-16">
                            <div class="flex items-center space-x-4">
                                <div class="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h1 class="text-xl font-bold text-white">Security Dashboard</h1>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <button id="back-to-dashboard" class="text-purple-400 hover:text-purple-300 transition-colors">
                                    ← Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Security Overview -->
                    <div class="bg-gradient-to-r from-purple-900 to-purple-800 rounded-xl p-8 mb-8">
                        <h2 class="text-3xl font-bold text-white mb-4">🛡️ Padhma Vyuham Security System</h2>
                        <p class="text-purple-200 text-lg">Your vault is protected by the most advanced multi-layer maze security ever created.</p>
                    </div>

                    <!-- Security Layers -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div class="bg-gray-800 rounded-xl p-6">
                            <h3 class="text-xl font-semibold text-white mb-6">Security Layers</h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-gray-300">Outer Perimeter</span>
                                    </div>
                                    <span class="text-green-400 text-sm font-medium">Active</span>
                                </div>
                                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-gray-300">Middle Defense</span>
                                    </div>
                                    <span class="text-green-400 text-sm font-medium">Active</span>
                                </div>
                                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-gray-300">Inner Sanctum</span>
                                    </div>
                                    <span class="text-green-400 text-sm font-medium">Active</span>
                                </div>
                                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <div class="flex items-center space-x-3">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-gray-300">Core Vault</span>
                                    </div>
                                    <span class="text-green-400 text-sm font-medium">Active</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-800 rounded-xl p-6">
                            <h3 class="text-xl font-semibold text-white mb-6">AI Guardian Status</h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <span class="text-gray-300">Threat Detection</span>
                                    <span class="text-green-400 text-sm font-medium">Online</span>
                                </div>
                                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <span class="text-gray-300">Pattern Analysis</span>
                                    <span class="text-green-400 text-sm font-medium">Active</span>
                                </div>
                                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <span class="text-gray-300">Response System</span>
                                    <span class="text-green-400 text-sm font-medium">Ready</span>
                                </div>
                                <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <span class="text-gray-300">Learning Mode</span>
                                    <span class="text-blue-400 text-sm font-medium">Adapting</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Security Test -->
                    <div class="bg-gray-800 rounded-xl p-6 mb-8">
                        <h3 class="text-xl font-semibold text-white mb-6">Test Your Security System</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <button class="security-test-btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors" data-test="sql_injection">
                                Test SQL Injection
                            </button>
                            <button class="security-test-btn bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors" data-test="xss">
                                Test XSS Attack
                            </button>
                            <button class="security-test-btn bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors" data-test="brute_force">
                                Test Brute Force
                            </button>
                        </div>
                        <div id="security-test-result" class="hidden">
                            <!-- Results will be displayed here -->
                        </div>
                    </div>

                    <!-- Security Events -->
                    <div class="bg-gray-800 rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-white mb-6">Recent Security Events</h3>
                        <div id="security-events-list" class="space-y-3">
                            <div class="text-center py-8">
                                <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p class="text-gray-500 mt-2">No security events</p>
                                <p class="text-gray-600 text-sm">Your vault is secure and quiet</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    // Vault Creation Modal
    getVaultCreationModal() {
        return `
            <div id="vault-creation-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-white">🌀 Create New Vault</h3>
                        <button id="close-vault-modal" class="text-gray-400 hover:text-white">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <form id="vault-creation-form" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Vault Name</label>
                            <input type="text" id="vault-name" required
                                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Work Vault, Personal">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                            <textarea id="vault-description" rows="3"
                                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Describe the purpose of this vault..."></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select id="vault-category" required
                                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="personal">🧑 Personal</option>
                                <option value="work">💼 Work</option>
                                <option value="family">👨‍👩‍👧‍👦 Family</option>
                                <option value="shared">🤝 Shared</option>
                                <option value="business">🏢 Business</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Choose Icon</label>

                            <!-- Selected Icon Preview -->
                            <div id="selected-icon-preview" class="selected-icon-preview mb-4 p-3 bg-gray-700 rounded-lg hidden">
                                <!-- Preview will be populated when icon is selected -->
                            </div>

                            <!-- Icon Selection Grid -->
                            <div id="icon-selector" class="grid grid-cols-5 gap-3 mb-4 max-h-48 overflow-y-auto">
                                <!-- Icons will be populated dynamically -->
                                <div class="text-center py-4 text-gray-500">
                                    <div class="animate-pulse">Loading icons...</div>
                                </div>
                            </div>
                            <input type="hidden" id="selected-icon-id">

                            <!-- Icon Actions -->
                            <div class="flex justify-between items-center">
                                <button type="button" id="upload-custom-icon"
                                    class="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                                    📷 Upload Custom Icon
                                </button>
                                <button type="button" id="clear-icon-selection"
                                    class="text-gray-400 hover:text-gray-300 text-sm transition-colors hidden">
                                    Clear Selection
                                </button>
                            </div>
                            <input type="file" id="icon-file-input" accept="image/*" class="hidden">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Security Level</label>
                            <select id="vault-security" required
                                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="basic">🛡️ Basic - Standard encryption</option>
                                <option value="advanced">🔒 Advanced - Enhanced security</option>
                                <option value="maximum">🛑 Maximum - Military-grade protection</option>
                            </select>
                        </div>

                        <div class="bg-gray-700 rounded-lg p-4">
                            <h4 class="text-white font-medium mb-2">🔐 Security Features</h4>
                            <div class="space-y-2 text-sm text-gray-300">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    <span>7-Layer Chakravyuham Protection</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    <span>AI Guardian Monitoring</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    <span>Honeytoken Trap System</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    <span>Zero-Knowledge Encryption</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex space-x-4">
                            <button type="button" id="cancel-vault-creation"
                                class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-3 rounded-lg transition-colors transform hover:scale-105">
                                🌀 Create Secure Vault
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    // Current Share Card Component
    getCurrentShareCard(share) {
        const permissions = share.permissions || [];
        const permissionIcons = {
            'read': '👁️',
            'write': '✏️',
            'delete': '🗑️',
            'share': '🤝',
            'admin': '👑'
        };

        const permissionLabels = {
            'read': 'Read',
            'write': 'Write',
            'delete': 'Delete',
            'share': 'Share',
            'admin': 'Admin'
        };

        const permissionBadges = permissions.map(perm =>
            `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-blue-100 mr-1 mb-1">
                ${permissionIcons[perm] || '🔑'} ${permissionLabels[perm] || perm}
            </span>`
        ).join('');

        return `
            <div class="bg-gray-700 rounded-lg p-4" data-share-id="${share.id}">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                            <span class="text-sm font-medium text-white">
                                ${(share.sharedWithEmail || share.sharedWithUser?.email || 'U').charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h4 class="text-white font-medium">${share.sharedWithEmail || share.sharedWithUser?.email}</h4>
                            <p class="text-gray-400 text-sm">${share.sharedWithUser?.username || 'Pending acceptance'}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            share.isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                        }">
                            ${share.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div class="dropdown relative">
                            <button class="text-gray-400 hover:text-white p-1" data-action="toggle-dropdown">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"></path>
                                </svg>
                            </button>
                            <div class="dropdown-menu absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10 hidden">
                                <div class="py-1">
                                    <button class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600" data-action="edit-permissions">
                                        Edit Permissions
                                    </button>
                                    <button class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600" data-action="view-activity">
                                        View Activity
                                    </button>
                                    <button class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600" data-action="revoke-access">
                                        Revoke Access
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <div class="flex flex-wrap">
                        ${permissionBadges}
                    </div>
                </div>

                <div class="flex items-center justify-between text-sm text-gray-400">
                    <span>
                        ${share.expiresAt ? `Expires: ${new Date(share.expiresAt).toLocaleDateString()}` : 'Never expires'}
                    </span>
                    <span>
                        Shared ${new Date(share.createdAt).toLocaleDateString()}
                    </span>
                </div>

                ${share.invitationMessage ?
                    `<div class="mt-3 p-3 bg-gray-600 rounded-lg">
                        <p class="text-sm text-gray-300">Message: "${share.invitationMessage}"</p>
                    </div>`
                : ''}
            </div>
        `;
    },

    // Pending Invitation Card Component
    getPendingInvitationCard(invitation) {
        return `
            <div class="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4" data-invitation-id="${invitation.id}">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 rounded-full bg-yellow-600 flex items-center justify-center">
                            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-medium">${invitation.sharedWithEmail}</h4>
                            <p class="text-yellow-400 text-sm">Pending acceptance</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-600 text-yellow-100">
                            Pending
                        </span>
                        <button class="text-gray-400 hover:text-white p-1" data-action="cancel-invitation">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="text-sm text-gray-400">
                    <p>Invited on ${new Date(invitation.createdAt).toLocaleDateString()}</p>
                    ${invitation.expiresAt ? `<p>Expires on ${new Date(invitation.expiresAt).toLocaleDateString()}</p>` : ''}
                </div>

                ${invitation.invitationMessage ?
                    `<div class="mt-3 p-3 bg-gray-600 rounded-lg">
                        <p class="text-sm text-gray-300">Message: "${invitation.invitationMessage}"</p>
                    </div>`
                : ''}
            </div>
        `;
    },

    // Icon Selection Component
    getIconSelectionGrid(icons, selectedIconId = '') {
        if (!icons || icons.length === 0) {
            return `
                <div class="grid grid-cols-5 gap-3">
                    <div class="col-span-5 text-center py-8 text-gray-500">
                        <div class="animate-pulse">Loading icons...</div>
                    </div>
                </div>
            `;
        }

        let html = `<div class="grid grid-cols-5 gap-3">`;

        icons.forEach(icon => {
            const selected = icon.id === selectedIconId;
            const selectedClasses = selected ?
                'border-purple-500 bg-purple-600 text-white' :
                'border-gray-600 bg-gray-700 text-gray-300 hover:border-purple-400 hover:bg-gray-600';

            html += `
                <div class="h-10 w-10 rounded-lg border-2 ${selectedClasses} flex items-center justify-center cursor-pointer transition-all duration-200 icon-option"
                     data-icon-id="${icon.id}"
                     title="${icon.name}">
                    <span class="text-xl">${icon.emoji}</span>
                </div>
            `;
        });

        html += `</div>`;

        return html;
    },

    // Vault Card Component
    getVaultCard(vault) {
        const icon = vault.iconData || this.getDefaultVaultIcon();
        const color = vault.color || '#3B82F6';

        return `
            <div class="vault-card bg-gray-700 rounded-lg p-6" data-vault-id="${vault.id}">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-4">
                        <div class="h-12 w-12 rounded-lg flex items-center justify-center" style="background-color: ${color}">
                            ${icon}
                        </div>
                        <div class="flex-1">
                            <h4 class="text-lg font-semibold text-white">${vault.name}</h4>
                            <p class="text-gray-400 text-sm">${vault.description || 'No description'}</p>
                            <div class="flex items-center space-x-4 mt-1">
                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
                                    ${vault.category}
                                </span>
                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-blue-100">
                                    ${vault.securityLevel}
                                </span>
                            </div>
                        </div>
                    </div>
                                            <div class="text-right">
                            <div class="flex items-center space-x-2 mb-2">
                                <button class="vault-action-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-colors transform hover:scale-105"
                                        data-action="share"
                                        data-vault-id="${vault.id}">
                                    <svg class="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                                    </svg>
                                    Share
                                </button>
                            </div>
                            <p class="text-2xl font-bold text-white">${vault.totalItems || 0}</p>
                            <p class="text-gray-400 text-sm">items</p>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4">
                    <div class="text-center">
                        <p class="text-lg font-semibold text-white">${vault.passwordCount || 0}</p>
                        <p class="text-gray-400 text-xs">passwords</p>
                    </div>
                    <div class="text-center">
                        <p class="text-lg font-semibold text-white">${vault.noteCount || 0}</p>
                        <p class="text-gray-400 text-xs">notes</p>
                    </div>
                    <div class="text-center">
                        <p class="text-lg font-semibold text-white">${vault.creditCardCount || 0}</p>
                        <p class="text-gray-400 text-xs">cards</p>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <span class="text-xs text-gray-500">Last accessed: ${this.formatDate(vault.lastAccessed)}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${vault.isShared ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-green-100">Shared</span>' : ''}
                        <div class="flex space-x-1">
                            <button class="vault-action-btn p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                                data-action="view" data-vault-id="${vault.id}">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </button>
                            <button class="vault-action-btn p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                                data-action="share" data-vault-id="${vault.id}">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                                </svg>
                            </button>
                            <button class="vault-action-btn p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                                data-action="edit" data-vault-id="${vault.id}">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button class="vault-action-btn p-2 text-red-400 hover:text-red-300 hover:bg-red-600 rounded transition-colors"
                                data-action="delete" data-vault-id="${vault.id}">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Default vault icon
    getDefaultVaultIcon() {
        return `<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>`;
    },

    // Format date helper
    formatDate(dateString) {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

        return date.toLocaleDateString();
    },

    // Vault Management
    getVault() {
        return `
            <div class="min-h-screen bg-gray-900">
                <!-- Header -->
                <header class="bg-gray-800 border-b border-gray-700">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center justify-between h-16">
                            <div class="flex items-center space-x-4">
                                <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                    </svg>
                                </div>
                                <h1 class="text-xl font-bold text-white">Vault Management</h1>
                            </div>
                            
                            <div class="flex items-center space-x-4">
                                <button id="back-to-dashboard" class="text-purple-400 hover:text-purple-300 transition-colors">
                                    ← Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Vault Overview -->
                    <div class="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 mb-8">
                        <h2 class="text-3xl font-bold text-white mb-4">🗄️ Your Secure Vaults</h2>
                        <p class="text-blue-200 text-lg">Organize and manage your passwords with military-grade security.</p>
                    </div>

                    <!-- Vaults List -->
                    <div class="bg-gray-800 rounded-xl p-6 mb-8">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-semibold text-white">Your Vaults</h3>
                            <button id="create-vault-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                + Create New Vault
                            </button>
                        </div>
                        <div id="vaults-list" class="space-y-4">
                            <!-- Vaults will be populated dynamically -->
                        </div>

                        <!-- Empty state -->
                        <div id="empty-vaults-state" class="text-center py-12">
                            <div class="h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-medium text-white mb-2">No vaults yet</h3>
                            <p class="text-gray-400 mb-4">Create your first secure vault to get started</p>
                            <button id="create-first-vault" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                                Create Your First Vault
                            </button>
                        </div>
                    </div>

                    <!-- Passwords in Current Vault -->
                    <div class="bg-gray-800 rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-white mb-6">Passwords in Personal Vault</h3>
                        <div id="passwords-list" class="space-y-3">
                            <div class="text-center py-8">
                                <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                <p class="text-gray-500 mt-2">No passwords yet</p>
                                <p class="text-gray-600 text-sm">Add your first password to get started</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    }
};
