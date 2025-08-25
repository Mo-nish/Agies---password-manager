/**
 * Agies Security Page Controller
 * Handles security dashboard functionality and interactions
 */

class SecurityController {
  constructor() {
    this.isInitialized = false;
    this.securityData = null;
    this.init();
  }

  async init() {
    try {
      console.log('🛡️ Initializing Security Controller...');
      
      // Check authentication
      if (!this.isAuthenticated()) {
        this.redirectToLogin();
        return;
      }

      // Bind events
      this.bindEvents();
      
      // Load security data
      await this.loadSecurityData();
      
      // Update UI
      this.updateSecurityDisplay();
      
      this.isInitialized = true;
      console.log('✅ Security Controller initialized');
      
    } catch (error) {
      console.error('❌ Security Controller initialization failed:', error);
      this.showError('Failed to initialize security dashboard');
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  redirectToLogin() {
    window.location.href = '/login';
  }

  bindEvents() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Security feature buttons
    this.bindSecurityFeatureButtons();
  }

  bindSecurityFeatureButtons() {
    // Configure Maze button
    const configureMazeBtn = document.querySelector('button:contains("Configure Maze")');
    if (configureMazeBtn) {
      configureMazeBtn.addEventListener('click', () => this.configureMaze());
    }

    // View AI Insights button
    const aiInsightsBtn = document.querySelector('button:contains("View AI Insights")');
    if (aiInsightsBtn) {
      aiInsightsBtn.addEventListener('click', () => this.viewAIInsights());
    }

    // View Breach Report button
    const breachReportBtn = document.querySelector('button:contains("View Breach Report")');
    if (breachReportBtn) {
      breachReportBtn.addEventListener('click', () => this.viewBreachReport());
    }

    // Configure Entry button
    const configureEntryBtn = document.querySelector('button:contains("Configure Entry")');
    if (configureEntryBtn) {
      configureEntryBtn.addEventListener('click', () => this.configureEntry());
    }
  }

  async loadSecurityData() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/security/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.securityData = await response.json();
        console.log('✅ Security data loaded:', this.securityData);
      } else {
        console.warn('⚠️ Could not load security data, using defaults');
        this.securityData = this.getDefaultSecurityData();
      }
    } catch (error) {
      console.warn('⚠️ Using default security data due to error:', error);
      this.securityData = this.getDefaultSecurityData();
    }
  }

  getDefaultSecurityData() {
    return {
      securityScore: 95,
      threatLevel: 'low',
      activeSessions: 2,
      lastScan: '2 min ago',
      chakravyuham: {
        status: 'active',
        layers: 4,
        honeypots: 25
      },
      aiGuardian: {
        status: 'active',
        threatsDetected: 0,
        learningMode: 'enabled'
      },
      darkWebMonitoring: {
        status: 'active',
        breachesFound: 0,
        lastCheck: '2 min ago'
      },
      oneWayEntry: {
        status: 'active',
        exitAttempts: 0,
        verificationLevel: 'maximum'
      }
    };
  }

  updateSecurityDisplay() {
    if (!this.securityData) return;

    // Update security score
    this.updateElement('text-3xl font-bold text-white', this.securityData.securityScore + '%');
    
    // Update threat level
    this.updateElement('text-3xl font-bold text-white', this.securityData.threatLevel);
    
    // Update active sessions
    this.updateElement('text-3xl font-bold text-white', this.securityData.activeSessions);
    
    // Update last scan
    this.updateElement('text-lg font-bold text-white', this.securityData.lastScan);
  }

  updateElement(className, value) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
      if (element.textContent.includes('%') || element.textContent.includes('Low') || 
          element.textContent.includes('2') || element.textContent.includes('min ago')) {
        element.textContent = value;
      }
    });
  }

  async handleLogout() {
    try {
      console.log('🚪 Logging out...');
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force redirect anyway
      window.location.href = '/login';
    }
  }

  configureMaze() {
    console.log('🌀 Opening Maze Configuration...');
    this.showMazeConfigurationModal();
  }

  viewAIInsights() {
    console.log('🤖 Opening AI Insights...');
    this.showAIInsightsModal();
  }

  viewBreachReport() {
    console.log('🌐 Opening Breach Report...');
    this.showBreachReportModal();
  }

  configureEntry() {
    console.log('🚪 Opening Entry Configuration...');
    this.showEntryConfigurationModal();
  }

  // Show maze configuration modal
  showMazeConfigurationModal() {
    const modalHTML = `
      <div id="maze-config-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">🔄 Maze Configuration</h3>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          
          <div class="space-y-6">
            <!-- Security Layers Configuration -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">🛡️ Security Layers</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Outer Perimeter</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Middle Defense</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Inner Sanctum</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Core Vault</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Honeypot Configuration -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">🍯 Honeypot Settings</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Honeypot Ratio</label>
                  <input type="range" min="0" max="100" value="30" class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider">
                  <div class="flex justify-between text-xs text-gray-400">
                    <span>0%</span>
                    <span>30%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Dynamic Honeypots</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- AI Guardian Configuration -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">🤖 AI Guardian</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Adaptive Defense</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Threat Learning</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Response Sensitivity</label>
                  <select class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                    <option value="low">Low (Conservative)</option>
                    <option value="medium" selected>Medium (Balanced)</option>
                    <option value="high">High (Aggressive)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 pt-6">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button onclick="saveMazeConfiguration()" class="flex-1 btn-primary px-4 py-2 rounded-lg text-white">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // Show AI insights modal
  showAIInsightsModal() {
    const modalHTML = `
      <div id="ai-insights-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-gray-800 rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">🤖 AI Security Insights</h3>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          
          <div class="space-y-6">
            <!-- Threat Analysis -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">🚨 Threat Analysis</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div class="bg-red-900/30 border border-red-700 rounded-lg p-3">
                  <div class="text-2xl font-bold text-red-400">3</div>
                  <div class="text-sm text-red-300">High Risk</div>
                </div>
                <div class="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                  <div class="text-2xl font-bold text-yellow-400">7</div>
                  <div class="text-sm text-yellow-300">Medium Risk</div>
                </div>
                <div class="bg-green-900/30 border border-green-700 rounded-lg p-3">
                  <div class="text-2xl font-bold text-green-400">24</div>
                  <div class="text-sm text-green-300">Low Risk</div>
                </div>
              </div>
            </div>

            <!-- Behavioral Patterns -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">📊 Behavioral Patterns</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-2 bg-gray-600 rounded">
                  <span class="text-gray-300">Unusual login time detected</span>
                  <span class="text-yellow-400 text-sm">2 hours ago</span>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-600 rounded">
                  <span class="text-gray-300">Multiple failed attempts</span>
                  <span class="text-red-400 text-sm">1 hour ago</span>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-600 rounded">
                  <span class="text-gray-300">New device access</span>
                  <span class="text-blue-400 text-sm">30 min ago</span>
                </div>
              </div>
            </div>

            <!-- Security Recommendations -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">💡 AI Recommendations</h4>
              <div class="space-y-3">
                <div class="flex items-start space-x-3 p-3 bg-blue-900/20 border border-blue-700 rounded">
                  <div class="text-blue-400 text-lg">💡</div>
                  <div>
                    <div class="text-white font-medium">Enable 2FA</div>
                    <div class="text-blue-300 text-sm">AI detected potential security risk. Enable two-factor authentication for enhanced protection.</div>
                  </div>
                </div>
                <div class="flex items-start space-x-3 p-3 bg-yellow-900/20 border border-yellow-700 rounded">
                  <div class="text-yellow-400 text-lg">⚠️</div>
                  <div>
                    <div class="text-white font-medium">Password Rotation</div>
                    <div class="text-yellow-300 text-sm">Consider rotating passwords for accounts accessed from new locations.</div>
                  </div>
                </div>
                <div class="flex items-start space-x-3 p-3 bg-green-900/20 border border-green-700 rounded">
                  <div class="text-green-400 text-lg">✅</div>
                  <div>
                    <div class="text-white font-medium">Security Score</div>
                    <div class="text-green-300 text-sm">Your current security posture is excellent (92/100).</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // Show breach report modal
  showBreachReportModal() {
    const modalHTML = `
      <div id="breach-report-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-gray-800 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">🌐 Breach Report & Monitoring</h3>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          
          <div class="space-y-6">
            <!-- Breach Status -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">🔍 Breach Status</h4>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div class="bg-green-900/30 border border-green-700 rounded-lg p-3">
                  <div class="text-2xl font-bold text-green-400">0</div>
                  <div class="text-sm text-green-300">Active Breaches</div>
                </div>
                <div class="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                  <div class="text-2xl font-bold text-yellow-400">2</div>
                  <div class="text-sm text-yellow-300">At Risk</div>
                </div>
                <div class="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                  <div class="text-2xl font-bold text-blue-400">15</div>
                  <div class="text-sm text-blue-300">Monitored</div>
                </div>
                <div class="bg-purple-900/30 border border-purple-700 rounded-lg p-3">
                  <div class="text-2xl font-bold text-purple-400">8</div>
                  <div class="text-sm text-purple-300">Protected</div>
                </div>
              </div>
            </div>

            <!-- Recent Breach Alerts -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">🚨 Recent Alerts</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-red-900/20 border border-red-700 rounded">
                  <div class="flex items-center space-x-3">
                    <div class="text-red-400 text-xl">🚨</div>
                    <div>
                      <div class="text-white font-medium">LinkedIn Data Breach</div>
                      <div class="text-red-300 text-sm">Your email was found in recent breach. Password change recommended.</div>
                    </div>
                  </div>
                  <span class="text-red-400 text-sm">2 hours ago</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-700 rounded">
                  <div class="flex items-center space-x-3">
                    <div class="text-yellow-400 text-xl">⚠️</div>
                    <div>
                      <div class="text-white font-medium">Facebook Security Alert</div>
                      <div class="text-yellow-300 text-sm">Unusual login activity detected from new location.</div>
                    </div>
                  </div>
                  <span class="text-yellow-400 text-sm">1 day ago</span>
                </div>
              </div>
            </div>

            <!-- Dark Web Monitoring -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">🌑 Dark Web Monitoring</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Email Monitoring</span>
                  <span class="text-green-400">Active</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Password Monitoring</span>
                  <span class="text-green-400">Active</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Credit Card Monitoring</span>
                  <span class="text-green-400">Active</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Last Scan</span>
                  <span class="text-blue-400">5 minutes ago</span>
                </div>
              </div>
            </div>

            <!-- Auto-Rotation Settings -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">🔄 Auto-Rotation Settings</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Auto-rotate compromised passwords</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Notify before rotation</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Rotation Delay</label>
                  <select class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                    <option value="immediate">Immediate</option>
                    <option value="1hour">1 Hour</option>
                    <option value="24hours" selected>24 Hours</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 pt-6">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
              Close
            </button>
            <button onclick="runBreachScan()" class="flex-1 btn-primary px-4 py-2 rounded-lg text-white">
              🔍 Run New Scan
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // Show entry configuration modal
  showEntryConfigurationModal() {
    const modalHTML = `
      <div id="entry-config-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">🚪 Entry Configuration</h3>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          
          <div class="space-y-6">
            <!-- Access Control -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">🔐 Access Control</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Biometric Authentication</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Hardware Key Required</span>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">PIN Code</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Session Management -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">⏰ Session Management</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Auto-logout Time</label>
                  <select class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                    <option value="5min">5 minutes</option>
                    <option value="15min">15 minutes</option>
                    <option value="30min" selected>30 minutes</option>
                    <option value="1hour">1 hour</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Force logout on inactivity</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Security Policies -->
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="text-lg font-semibold text-white mb-4">📋 Security Policies</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Require password change every 90 days</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Block common passwords</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">Prevent password reuse</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 pt-6">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button onclick="saveEntryConfiguration()" class="flex-1 btn-primary px-4 py-2 rounded-lg text-white">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  showInfo(message) {
    // Create a simple info toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  showError(message) {
    // Create a simple error toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  }

  showLoading(show = true) {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.toggle('hidden', !show);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🛡️ Security page loaded, initializing controller...');
  window.securityController = new SecurityController();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityController;
}
