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
    this.showInfo('Maze configuration feature coming soon!');
  }

  viewAIInsights() {
    console.log('🤖 Opening AI Insights...');
    this.showInfo('AI insights feature coming soon!');
  }

  viewBreachReport() {
    console.log('🌐 Opening Breach Report...');
    this.showInfo('Breach report feature coming soon!');
  }

  configureEntry() {
    console.log('🚪 Opening Entry Configuration...');
    this.showInfo('Entry configuration feature coming soon!');
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
