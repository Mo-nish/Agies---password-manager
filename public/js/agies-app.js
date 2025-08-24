/**
 * Agies Main Application
 * Integrates all security systems and provides the main user interface
 */

class AgiesApp {
  constructor() {
    this.api = null;
    this.currentView = 'dashboard';
    this.currentVault = null;
    this.user = null;
    this.vaults = [];
    this.icons = [];

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  async init() {
    console.log('🌀 Initializing Agies Application...');

    // Initialize API service
    await this.initializeAPI();

    // Load icons
    await this.loadIcons();

    // Setup event listeners
    this.setupEventListeners();

    console.log('✅ Agies Application initialized successfully');
  }

  async initializeAPI() {
    // Wait for API service to be available
    const maxAttempts = 10;
    let attempts = 0;

    const checkAPI = () => {
      if (window.agiesAPI) {
        this.api = window.agiesAPI;
        console.log('🔗 Connected to Agies API service');
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkAPI, 200);
      } else {
        console.error('❌ Failed to initialize API service');
      }
    };

    checkAPI();
  }

  async loadIcons() {
    try {
      // Try to load from API first
      if (this.api) {
        const iconResult = await this.api.getAvailableIcons();
        if (iconResult.success) {
          this.icons = iconResult.icons || [];
          return;
        }
      }

      // Fallback to icon service
      if (window.iconService) {
        this.icons = window.iconService.getAllIcons();
        console.log('📚 Loaded icons from icon service:', this.icons.length);
      }
    } catch (error) {
      console.error('Error loading icons:', error);
      // Final fallback - load basic icons
      this.loadFallbackIcons();
    }
  }

  loadFallbackIcons() {
    // Basic emoji icons as fallback
    this.icons = [
      { id: 'personal', emoji: '👤', category: 'personal', name: 'Personal' },
      { id: 'work', emoji: '💼', category: 'work', name: 'Work' },
      { id: 'family', emoji: '👨‍👩‍👧‍👦', category: 'family', name: 'Family' },
      { id: 'shared', emoji: '🤝', category: 'shared', name: 'Shared' },
      { id: 'business', emoji: '🏢', category: 'business', name: 'Business' },
      { id: 'security', emoji: '🛡️', category: 'security', name: 'Security' },
      { id: 'finance', emoji: '💰', category: 'finance', name: 'Finance' },
      { id: 'social', emoji: '📱', category: 'social', name: 'Social' },
      { id: 'entertainment', emoji: '🎮', category: 'entertainment', name: 'Entertainment' },
      { id: 'travel', emoji: '✈️', category: 'travel', name: 'Travel' }
    ];
  }

  setupEventListeners() {
    // Navigation
    this.setupNavigation();

    // Vault management
    this.setupVaultManagement();

    // Security monitoring
    this.initializeSecurityMonitoring();
  }

  setupNavigation() {
    // Dashboard navigation
    const dashboardLinks = document.querySelectorAll('[data-nav="dashboard"]');
    dashboardLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showDashboard();
      });
    });

    // Vault navigation
    const vaultLinks = document.querySelectorAll('[data-nav="vaults"]');
    vaultLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showVaults();
      });
    });

    // Security navigation
    const securityLinks = document.querySelectorAll('[data-nav="security"]');
    securityLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showSecurity();
      });
    });
  }

  setupVaultManagement() {
    // Create vault button
    const createVaultBtn = document.getElementById('create-vault-btn');
    if (createVaultBtn) {
      createVaultBtn.addEventListener('click', () => this.showVaultCreationModal());
    }

    // Create first vault button
    const createFirstVaultBtn = document.getElementById('create-first-vault');
    if (createFirstVaultBtn) {
      createFirstVaultBtn.addEventListener('click', () => this.showVaultCreationModal());
    }

    // Vault creation form
    const vaultCreationForm = document.getElementById('vault-creation-form');
    if (vaultCreationForm) {
      vaultCreationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleVaultCreation();
      });
    }

    // Custom icon upload
    this.setupCustomIconUpload();
  }

  initializeSecurityMonitoring() {
    // Update security status every 30 seconds
    setInterval(() => {
      this.updateSecurityStatus();
    }, 30000);

    // Monitor for security events
    if (this.api) {
      this.api.on('security_event', (event) => {
        this.handleSecurityEvent(event);
      });
    }
  }

  // === VAULT SHARING FUNCTIONALITY ===

  setupVaultSharing() {
    // Vault sharing is already integrated into the main event listeners
    // This method can be used for additional initialization if needed
    console.log('🤝 Vault sharing functionality initialized');
  }

  // Vault sharing modal functionality removed - now integrated into main dashboard

  // setupVaultSharingModalEvents removed - functionality integrated into main dashboard

  // switchVaultSharingTab removed - functionality integrated into main dashboard

  // showSharingForm removed - functionality integrated into main dashboard

  // All vault-sharing modal functions removed - functionality integrated into main dashboard

  // === ICON MANAGEMENT ===

  showIconSelection() {
    const iconSelector = document.getElementById('icon-selector');
    if (!iconSelector) return;

    // Show loading state if icons aren't loaded yet
    if (this.icons.length === 0) {
      iconSelector.innerHTML = `
        <div class="col-span-5 text-center py-8 text-gray-500">
          <div class="animate-pulse">Loading icons...</div>
        </div>
      `;

      // Load icons and then show selection
      this.loadIcons().then(() => {
        this.renderIconSelection();
      });
      return;
    }

    this.renderIconSelection();
  }

  renderIconSelection() {
    const iconSelector = document.getElementById('icon-selector');
    if (!iconSelector || this.icons.length === 0) return;

    // Group icons by category
    const iconsByCategory = this.groupIconsByCategory();

    // Create category filter
    const categoryFilter = this.createCategoryFilter(iconsByCategory);

    // Create icon grid
    const iconGrid = this.createIconGrid(iconsByCategory.all);

    iconSelector.innerHTML = categoryFilter + iconGrid;

    // Add event listeners
    this.setupIconSelectionEvents();
  }

  groupIconsByCategory() {
    const grouped = { all: this.icons };
    const categories = [...new Set(this.icons.map(icon => icon.category))];

    categories.forEach(category => {
      grouped[category] = this.icons.filter(icon => icon.category === category);
    });

    return grouped;
  }

  createCategoryFilter(iconsByCategory) {
    const categories = Object.keys(iconsByCategory).filter(cat => cat !== 'all');

    let html = `
      <div class="mb-4 border-b border-gray-600 pb-3">
        <label class="block text-sm font-medium text-gray-300 mb-2">Filter by Category:</label>
        <div class="flex flex-wrap gap-2">
    `;

    // All category button
    html += `
      <button class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm category-filter active"
              data-category="all">All</button>
    `;

    // Category buttons
    categories.forEach(category => {
      const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      html += `
        <button class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm category-filter hover:bg-gray-600"
                data-category="${category}">${capitalizedCategory}</button>
      `;
    });

    html += `</div></div>`;
    return html;
  }

  createIconGrid(icons, selectedIconId = '') {
    if (icons.length === 0) {
      return `
        <div class="col-span-5 text-center py-8 text-gray-500">
          <div>No icons found in this category</div>
        </div>
      `;
    }

    let html = `<div class="grid grid-cols-5 gap-3 icon-grid">`;

    icons.forEach(icon => {
      const selected = icon.id === selectedIconId;
      const selectedClasses = selected ?
        'border-purple-500 bg-purple-600 text-white ring-2 ring-purple-300' :
        'border-gray-600 bg-gray-700 text-gray-300 hover:border-purple-400 hover:bg-gray-600';

      html += `
        <div class="h-12 w-12 rounded-lg border-2 ${selectedClasses} flex items-center justify-center cursor-pointer transition-all duration-200 icon-option group"
             data-icon-id="${icon.id}"
             data-category="${icon.category}"
             title="${icon.name}">
          <span class="text-xl group-hover:scale-110 transition-transform">${icon.emoji}</span>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  setupIconSelectionEvents() {
    // Icon click handlers
    const iconOptions = document.querySelectorAll('.icon-option');
    iconOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const iconId = e.currentTarget.dataset.iconId;
        this.selectIcon(iconId);
      });
    });

    // Category filter handlers
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.filterIconsByCategory(category);
      });
    });
  }

  filterIconsByCategory(category) {
    // Update active filter button
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
      if (filter.dataset.category === category) {
        filter.classList.add('active', 'bg-purple-600', 'text-white');
        filter.classList.remove('bg-gray-700', 'text-gray-300');
      } else {
        filter.classList.remove('active', 'bg-purple-600', 'text-white');
        filter.classList.add('bg-gray-700', 'text-gray-300');
      }
    });

    // Update icon grid
    const iconGrid = document.querySelector('.icon-grid');
    if (!iconGrid) return;

    const iconsByCategory = this.groupIconsByCategory();
    const icons = iconsByCategory[category] || [];

    const selectedIconId = document.getElementById('selected-icon-id').value;
    const newIconGrid = this.createIconGrid(icons, selectedIconId);

    iconGrid.outerHTML = newIconGrid;

    // Re-bind icon click handlers
    const newIconOptions = document.querySelectorAll('.icon-option');
    newIconOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const iconId = e.currentTarget.dataset.iconId;
        this.selectIcon(iconId);
      });
    });
  }

  selectIcon(iconId) {
    // Update hidden input
    const selectedIconInput = document.getElementById('selected-icon-id');
    if (selectedIconInput) {
      selectedIconInput.value = iconId;
    }

    // Update visual selection
    const iconOptions = document.querySelectorAll('.icon-option');
    iconOptions.forEach(option => {
      if (option.dataset.iconId === iconId) {
        option.classList.add('border-purple-500', 'bg-purple-600', 'text-white', 'ring-2', 'ring-purple-300');
        option.classList.remove('border-gray-600', 'bg-gray-700', 'text-gray-300');
      } else {
        option.classList.remove('border-purple-500', 'bg-purple-600', 'text-white', 'ring-2', 'ring-purple-300');
        option.classList.add('border-gray-600', 'bg-gray-700', 'text-gray-300');
      }
    });

    // Show selected icon preview
    this.showSelectedIconPreview(iconId);

    console.log('🎨 Selected icon:', iconId);
  }

  showSelectedIconPreview(iconId) {
    const selectedIcon = this.icons.find(icon => icon.id === iconId);
    if (!selectedIcon) return;

    // Update any preview elements
    const iconPreviews = document.querySelectorAll('.selected-icon-preview');
    iconPreviews.forEach(preview => {
      preview.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <span class="text-lg">${selectedIcon.emoji}</span>
          </div>
          <span class="text-white text-sm">${selectedIcon.name}</span>
        </div>
      `;
      preview.classList.remove('hidden');
    });
  }

  setupCustomIconUpload() {
    const uploadButton = document.getElementById('upload-custom-icon');
    const fileInput = document.getElementById('icon-file-input');

    if (!uploadButton || !fileInput) return;

    uploadButton.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showError('Please select an image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.showError('Image file size must be less than 2MB');
        return;
      }

      this.showLoading('Uploading custom icon...');

      try {
        const result = await this.uploadCustomIcon(file);
        if (result.success) {
          this.showSuccess('Custom icon uploaded successfully!');
          // Refresh icon selection
          await this.loadIcons();
          this.showIconSelection();
        } else {
          this.showError(result.error || 'Failed to upload icon');
        }
      } catch (error) {
        console.error('Custom icon upload error:', error);
        this.showError('Failed to upload custom icon');
      }

      this.hideLoading();
    });
  }

  async uploadCustomIcon(file) {
    if (!this.api) {
      throw new Error('API service not available');
    }

    try {
      const formData = new FormData();
      formData.append('icon', file);
      formData.append('userId', this.user?.id || '');

      const response = await fetch('/api/icons/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Icon upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, iconId: result.iconId };
    } catch (error) {
      console.error('Icon upload error:', error);
      throw error;
    }
  }

  getToken() {
    if (this.api && this.api.token) {
      return this.api.token;
    }
    return localStorage.getItem('agies_token');
  }

  // === UI MANAGEMENT ===

  showLogin() {
    this.currentView = 'login';
    this.renderView(Components.getLoginForm());
  }

  showRegister() {
    this.currentView = 'register';
    this.renderView(Components.getRegisterForm());
  }

  showDashboard() {
    this.currentView = 'dashboard';
    this.renderView(Components.getDashboard());
    this.updateDashboardStats();
  }

  showVaults() {
    this.currentView = 'vaults';
    this.renderView(Components.getVault());
    this.updateVaultList();
  }

  showSecurity() {
    this.currentView = 'security';
    this.renderView(Components.getSecurity());
    this.updateSecurityStatus();
  }

  showVaultCreationModal() {
    const modal = document.getElementById('vault-creation-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.showIconSelection();
    } else {
      // Create and show modal
      const modalHTML = Components.getVaultCreationModal();
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      // Re-bind event listeners
      this.setupVaultManagement();

      // Show modal and populate icons
      const newModal = document.getElementById('vault-creation-modal');
      if (newModal) {
        newModal.classList.remove('hidden');
        setTimeout(() => this.showIconSelection(), 100);
      }
    }
  }

  async handleVaultCreation() {
    const name = document.getElementById('vault-name').value;
    const description = document.getElementById('vault-description').value;
    const category = document.getElementById('vault-category').value;
    const iconId = document.getElementById('selected-icon-id').value;
    const securityLevel = document.getElementById('vault-security').value;

    if (!name || !category) {
      this.showError('Please fill in all required fields');
      return;
    }

    this.showLoading('Creating secure vault...');

    try {
      const vaultData = {
        name,
        description,
        category,
        iconId,
        securityLevel
      };

      const result = await this.api.createVault(vaultData);

      if (result.success) {
        await this.loadUserData();
        this.hideAllModals();
        this.showSuccess(`Vault "${name}" created successfully!`);
        this.updateVaultList();
      } else {
        this.showError(result.error || 'Failed to create vault');
      }
    } catch (error) {
      console.error('Vault creation error:', error);
      this.showError('Failed to create vault');
    }

    this.hideLoading();
  }

  async loadUserData() {
    if (!this.api) return;

    try {
      // Load user vaults
      const vaultResult = await this.api.getUserVaults();
      if (vaultResult.success) {
        this.vaults = vaultResult.vaults || [];
        this.updateVaultList();
      }

      // Load security status
      const securityResult = await this.api.getSecurityStatus();
      if (securityResult.success) {
        this.updateSecurityStatus(securityResult.status);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      this.showError('Failed to load user data');
    }
  }

  updateVaultList() {
    const vaultList = document.getElementById('vaults-list');
    const emptyState = document.getElementById('empty-vaults-state');

    if (!vaultList) return;

    if (this.vaults.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      vaultList.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    vaultList.innerHTML = this.vaults.map(vault => Components.getVaultCard(vault)).join('');

    // Add event listeners to vault action buttons
    this.setupVaultActionButtons();
  }

  setupVaultActionButtons() {
    const actionButtons = document.querySelectorAll('.vault-action-btn');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        const vaultId = e.currentTarget.dataset.vaultId;

        const vault = this.vaults.find(v => v.id === vaultId);
        if (!vault) return;

        switch (action) {
          case 'view':
            this.viewVault(vault);
            break;
          case 'share':
            console.log('Vault sharing now integrated into main dashboard');
            break;
          case 'edit':
            this.editVault(vault);
            break;
          case 'delete':
            this.deleteVault(vault);
            break;
        }
      });
    });
  }

  viewVault(vault) {
    this.currentVault = vault;
    
    // Create and show vault detail modal
    const modal = document.createElement('div');
    modal.id = 'vaultDetailModal';
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">🗄️ Vault Details</h2>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-800 mb-3">Vault Information</h3>
                    <div class="space-y-2 text-sm">
                        <div><strong>Name:</strong> ${vault.name || 'Unnamed Vault'}</div>
                        <div><strong>Type:</strong> ${vault.type || 'Personal'}</div>
                        <div><strong>Created:</strong> ${new Date(vault.createdAt || Date.now()).toLocaleDateString()}</div>
                        <div><strong>Description:</strong> ${vault.description || 'No description'}</div>
                    </div>
                </div>
                
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-blue-800 mb-3">Statistics</h3>
                    <div class="space-y-2 text-sm">
                        <div><strong>Total Passwords:</strong> ${vault.passwords ? vault.passwords.length : 0}</div>
                        <div><strong>Last Modified:</strong> ${new Date(vault.updatedAt || vault.createdAt || Date.now()).toLocaleDateString()}</div>
                        <div><strong>Status:</strong> <span class="text-green-600 font-medium">Active</span></div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-gray-800 mb-3">Passwords in this Vault</h3>
                <div id="vault-passwords-list" class="space-y-3">
                    ${this.renderVaultPasswords(vault)}
                </div>
            </div>
            
            <div class="flex space-x-3">
                <button onclick="agiesApp.editVault(${JSON.stringify(vault).replace(/"/g, '&quot;')})" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                    ✏️ Edit Vault
                </button>
                <button onclick="agiesApp.shareVault(${JSON.stringify(vault).replace(/"/g, '&quot;')})" 
                        class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                    🔗 Share Vault
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
  }

  editVault(vault) {
    this.currentVault = vault;
    
    // Create and show vault edit modal
    const modal = document.createElement('div');
    modal.id = 'vaultEditModal';
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-md w-full">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">✏️ Edit Vault</h2>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <form id="edit-vault-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Vault Name</label>
                    <input type="text" id="edit-vault-name" value="${vault.name || ''}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea id="edit-vault-description" rows="3" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">${vault.description || ''}</textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Vault Type</label>
                    <select id="edit-vault-type" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="PERSONAL" ${vault.type === 'PERSONAL' ? 'selected' : ''}>Personal</option>
                        <option value="FAMILY" ${vault.type === 'FAMILY' ? 'selected' : ''}>Family</option>
                        <option value="TEAM" ${vault.type === 'TEAM' ? 'selected' : ''}>Team</option>
                        <option value="WORK" ${vault.type === 'WORK' ? 'selected' : ''}>Work</option>
                    </select>
                </div>
            </form>
            
            <div class="flex space-x-3 mt-6">
                <button onclick="agiesApp.saveVaultChanges()" 
                        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                    💾 Save Changes
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
  }

  // Save vault changes
  saveVaultChanges() {
    if (!this.currentVault) return;
    
    const newName = document.getElementById('edit-vault-name').value;
    const newDescription = document.getElementById('edit-vault-description').value;
    const newType = document.getElementById('edit-vault-type').value;
    
    if (!newName.trim()) {
        this.showError('Vault name is required');
        return;
    }
    
    // Update vault
    this.currentVault.name = newName.trim();
    this.currentVault.description = newDescription.trim();
    this.currentVault.type = newType;
    this.currentVault.updatedAt = Date.now();
    
    // Save to storage
    this.saveVaults();
    
    // Close modal
    const modal = document.getElementById('vaultEditModal');
    if (modal) {
        modal.remove();
    }
    
    // Refresh display
    this.loadVaults();
    
    // Show success message
    this.showSuccess('Vault updated successfully!');
  }

  // Display passwords in vault
  displayVaultPasswords(vault) {
    const container = document.getElementById('vault-passwords-list');
    if (!container) return;
    
    if (!vault.passwords || vault.passwords.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">No passwords in this vault</p>';
      return;
    }
    
    let html = '';
    vault.passwords.forEach(password => {
      html += `
        <div class="password-item bg-white rounded-lg p-4 mb-3 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-semibold text-gray-800">${password.title}</h4>
              <p class="text-sm text-gray-600">${password.username}</p>
              <p class="text-xs text-gray-500">${password.url || 'No URL'}</p>
            </div>
            <div class="flex space-x-2">
              <button onclick="agiesApp.copyPassword('${password.id}')" class="text-blue-600 hover:text-blue-800 text-sm">
                Copy
              </button>
              <button onclick="agiesApp.editPassword('${password.id}')" class="text-green-600 hover:text-green-800 text-sm">
                Edit
              </button>
            </div>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  }

  async deleteVault(vault) {
    const confirmed = confirm(`Are you sure you want to delete "${vault.name}"? This action cannot be undone.`);

    if (!confirmed) return;

    this.showLoading('Deleting vault...');

    try {
      const result = await this.api.deleteVault(vault.id);

      if (result.success) {
        await this.loadUserData();
        this.showSuccess(`Vault "${vault.name}" deleted successfully`);
      } else {
        this.showError(result.error || 'Failed to delete vault');
      }
    } catch (error) {
      console.error('Delete vault error:', error);
      this.showError('Failed to delete vault');
    }

    this.hideLoading();
  }

  updateDashboardStats() {
    const totalVaults = document.getElementById('total-vaults');
    const totalPasswords = document.getElementById('total-passwords');
    const securityStatus = document.getElementById('security-status');

    if (totalVaults) totalVaults.textContent = this.vaults.length;
    if (totalPasswords) totalPasswords.textContent = this.vaults.reduce((sum, vault) => sum + (vault.totalItems || 0), 0);
    if (securityStatus) securityStatus.textContent = 'Active & Secure';
  }

  async updateSecurityStatus(status = null) {
    if (!status && this.api) {
      const result = await this.api.getSecurityStatus();
      if (result.success) {
        status = result.status;
      }
    }

    if (status) {
      // Update security status indicators
      this.updateSecurityIndicators(status);
    }
  }

  updateSecurityIndicators(status) {
    // Update various security status elements in the UI
    const statusElements = document.querySelectorAll('[data-security-status]');
    statusElements.forEach(element => {
      const metric = element.dataset.securityStatus;
      if (status[metric]) {
        element.textContent = status[metric];
      }
    });
  }

  handleSecurityEvent(event) {
    // Handle real-time security events
    console.log('🛡️ Security Event:', event);

    // Show notification for critical events
    if (event.severity === 'critical') {
      this.showSecurityNotification(event.description, 'error');
    } else if (event.severity === 'warning') {
      this.showSecurityNotification(event.description, 'warning');
    }
  }

  // === UTILITY METHODS ===

  showLoading(message = 'Loading...') {
    let loading = document.getElementById('loading-overlay');
    if (!loading) {
      loading = document.createElement('div');
      loading.id = 'loading-overlay';
      loading.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
      loading.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 flex items-center space-x-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span class="text-white" id="loading-message">${message}</span>
        </div>
      `;
      document.body.appendChild(loading);
    } else {
      document.getElementById('loading-message').textContent = message;
      loading.style.display = 'flex';
    }
  }

  hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
      loading.style.display = 'none';
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform`;
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <span>${message}</span>
        <button class="close-notification text-white hover:text-gray-200">×</button>
      </div>
    `;
    
    // Add event listener for close button
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => notification.remove());

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX-full';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  showSecurityNotification(message, type = 'info') {
    // Special notification for security events
    const notification = document.createElement('div');
    notification.className = `fixed top-4 left-4 bg-purple-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm`;
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">Security Alert</p>
          <p class="text-sm opacity-90">${message}</p>
        </div>
        <button class="close-security-notification text-white hover:text-gray-200">×</button>
      </div>
    `;

    // Add event listener for close button
    const closeSecurityBtn = notification.querySelector('.close-security-notification');
    closeSecurityBtn.addEventListener('click', () => notification.remove());
    
    document.body.appendChild(notification);

    // Auto remove after 10 seconds for security notifications
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  hideAllModals() {
    const modals = ['vault-creation-modal'];
    modals.forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  }

  renderView(html) {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;

      // Add modals if not present
      if (!document.getElementById('vault-creation-modal')) {
        const creationModal = Components.getVaultCreationModal();
        app.insertAdjacentHTML('beforeend', creationModal);
      }

      // Re-bind all event listeners
      this.setupEventListeners();
    }
  }

  // Render vault passwords
  renderVaultPasswords(vault) {
      if (!vault.passwords || vault.passwords.length === 0) {
          return `
              <div class="text-center py-8 text-gray-500">
                  <div class="text-4xl mb-2">🔐</div>
                  <p>No passwords in this vault yet</p>
                  <button onclick="agiesApp.showAddPasswordModal('${vault.id}')" 
                          class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      + Add First Password
                  </button>
              </div>
          `;
      }
      
      return vault.passwords.map(password => `
          <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start">
                  <div class="flex-1">
                      <h4 class="font-semibold text-gray-800">${password.title || 'Untitled'}</h4>
                      <p class="text-sm text-gray-600">${password.username || 'No username'}</p>
                      <p class="text-xs text-gray-500">${password.url || 'No URL'}</p>
                      <p class="text-xs text-gray-400">Added: ${new Date(password.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div class="flex space-x-2 ml-4">
                      <button onclick="agiesApp.copyPassword('${password.id}')" 
                              class="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50">
                          Copy
                      </button>
                      <button onclick="agiesApp.editPassword('${password.id}')" 
                              class="text-green-600 hover:text-green-800 text-sm px-2 py-1 rounded hover:bg-green-50">
                          Edit
                      </button>
                      <button onclick="agiesApp.deletePassword('${password.id}')" 
                              class="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50">
                          Delete
                      </button>
                  </div>
              </div>
          </div>
      `).join('');
  }

  // Show add password modal
  showAddPasswordModal(vaultId) {
      const modal = document.createElement('div');
      modal.id = 'addPasswordModal';
      modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
      
      modal.innerHTML = `
          <div class="bg-white rounded-2xl p-6 max-w-md w-full">
              <div class="flex justify-between items-center mb-6">
                  <h2 class="text-2xl font-bold text-gray-800">🔐 Add New Password</h2>
                  <button onclick="this.parentElement.parentElement.remove()" 
                          class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              
              <form id="add-password-form" class="space-y-4">
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input type="text" id="password-title" 
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                             placeholder="e.g., Gmail, Facebook" required>
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Username/Email</label>
                      <input type="text" id="password-username" 
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                             placeholder="your@email.com" required>
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div class="relative">
                          <input type="password" id="password-value" 
                                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 placeholder="Enter password" required>
                          <button type="button" onclick="agiesApp.togglePasswordVisibility('password-value')" 
                                  class="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                              👁️
                          </button>
                      </div>
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                      <input type="url" id="password-url" 
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                             placeholder="https://example.com">
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Vault</label>
                      <select id="password-vault" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          ${this.renderVaultOptions(vaultId)}
                      </select>
                  </div>
              </form>
              
              <div class="flex space-x-3 mt-6">
                  <button onclick="agiesApp.savePassword()" 
                          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                      💾 Save Password
                  </button>
                  <button onclick="this.parentElement.parentElement.remove()" 
                          class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                      Cancel
                  </button>
              </div>
          </div>
      `;
      
      document.body.appendChild(modal);
  }

  // Render vault options for password form
  renderVaultOptions(selectedVaultId) {
      const vaults = this.vaults; // Assuming this.vaults is accessible
      return vaults.map(vault => 
          `<option value="${vault.id}" ${vault.id === selectedVaultId ? 'selected' : ''}>
              ${vault.name || 'Unnamed Vault'}
          </option>`
      ).join('');
  }

  // Save password
  savePassword() {
      const title = document.getElementById('password-title').value.trim();
      const username = document.getElementById('password-username').value.trim();
      const password = document.getElementById('password-value').value;
      const url = document.getElementById('password-url').value.trim();
      const vaultId = document.getElementById('password-vault').value;
      
      if (!title || !username || !password) {
          this.showError('Title, username, and password are required');
          return;
      }
      
      const newPassword = {
          id: 'pwd_' + Date.now(),
          title: title,
          username: username,
          password: password,
          url: url,
          vaultId: vaultId,
          createdAt: Date.now(),
          updatedAt: Date.now()
      };
      
      // Add to passwords array
      this.passwords.push(newPassword);
      this.savePasswords();
      
      // Close modal
      const modal = document.getElementById('addPasswordModal');
      if (modal) {
          modal.remove();
      }
      
      // Refresh display
      this.loadPasswords();
      this.loadVaults();
      
      // Show success message
      this.showSuccess('Password saved successfully!');
  }

  // Toggle password visibility
  togglePasswordVisibility(inputId) {
      const input = document.getElementById(inputId);
      if (input.type === 'password') {
          input.type = 'text';
      } else {
          input.type = 'password';
      }
  }

  // Copy password
  copyPassword(passwordId) {
      const password = this.passwords.find(p => p.id === passwordId);
      if (password) {
          navigator.clipboard.writeText(password.password).then(() => {
              this.showSuccess('Password copied to clipboard!');
          }).catch(() => {
              this.showError('Failed to copy password');
          });
      }
  }

  // Edit password
  editPassword(passwordId) {
      const password = this.passwords.find(p => p.id === passwordId);
      if (!password) return;
      
      // Show edit password modal
      this.showEditPasswordModal(password);
  }

  // Show edit password modal
  showEditPasswordModal(password) {
      const modal = document.createElement('div');
      modal.id = 'editPasswordModal';
      modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
      
      modal.innerHTML = `
          <div class="bg-white rounded-2xl p-6 max-w-md w-full">
              <div class="flex justify-between items-center mb-6">
                  <h2 class="text-2xl font-bold text-gray-800">✏️ Edit Password</h2>
                  <button onclick="this.parentElement.parentElement.remove()" 
                          class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              
              <form id="edit-password-form" class="space-y-4">
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input type="text" id="edit-password-title" value="${password.title || ''}" 
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                             required>
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Username/Email</label>
                      <input type="text" id="edit-password-username" value="${password.username || ''}" 
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                             required>
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div class="relative">
                          <input type="password" id="edit-password-value" value="${password.password || ''}" 
                                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                 required>
                          <button type="button" onclick="agiesApp.togglePasswordVisibility('edit-password-value')" 
                                  class="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                              👁️
                          </button>
                      </div>
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                      <input type="url" id="edit-password-url" value="${password.url || ''}" 
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Vault</label>
                      <select id="edit-password-vault" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          ${this.renderVaultOptions(password.vaultId)}
                      </select>
                  </div>
              </form>
              
              <div class="flex space-x-3 mt-6">
                  <button onclick="agiesApp.updatePassword('${password.id}')" 
                          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                      💾 Update Password
                  </button>
                  <button onclick="this.parentElement.parentElement.remove()" 
                          class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                      Cancel
                  </button>
              </div>
          </div>
      `;
      
      document.body.appendChild(modal);
  }

  // Update password
  updatePassword(passwordId) {
      const password = this.passwords.find(p => p.id === passwordId);
      if (!password) return;
      
      const title = document.getElementById('edit-password-title').value.trim();
      const username = document.getElementById('edit-password-username').value.trim();
      const passwordValue = document.getElementById('edit-password-value').value;
      const url = document.getElementById('edit-password-url').value.trim();
      const vaultId = document.getElementById('edit-password-vault').value;
      
      if (!title || !username || !passwordValue) {
          this.showError('Title, username, and password are required');
          return;
      }
      
      // Update password
      password.title = title;
      password.username = username;
      password.password = passwordValue;
      password.url = url;
      password.vaultId = vaultId;
      password.updatedAt = Date.now();
      
      // Save to storage
      this.savePasswords();
      
      // Close modal
      const modal = document.getElementById('editPasswordModal');
      if (modal) {
          modal.remove();
      }
      
      // Refresh display
      this.loadPasswords();
      this.loadVaults();
      
      // Show success message
      this.showSuccess('Password updated successfully!');
  }

  // Delete password
  deletePassword(passwordId) {
      if (confirm('Are you sure you want to delete this password? This action cannot be undone.')) {
          this.passwords = this.passwords.filter(p => p.id !== passwordId);
          this.savePasswords();
          this.loadPasswords();
          this.loadVaults();
          this.showSuccess('Password deleted successfully!');
      }
  }

  // Share vault
  shareVault(vault) {
      const modal = document.createElement('div');
      modal.id = 'shareVaultModal';
      modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
      
      modal.innerHTML = `
          <div class="bg-white rounded-2xl p-6 max-w-md w-full">
              <div class="flex justify-between items-center mb-6">
                  <h2 class="text-2xl font-bold text-gray-800">🔗 Share Vault</h2>
                  <button onclick="this.parentElement.parentElement.remove()" 
                          class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              
              <div class="space-y-4">
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Vault Name</label>
                      <input type="text" value="${vault.name || 'Unnamed Vault'}" 
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" readonly>
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Team Members (emails)</label>
                      <textarea id="share-emails" rows="3" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter one email per line"></textarea>
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                      <select id="share-access-level" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="read">Read Only</option>
                          <option value="read_write">Read & Write</option>
                          <option value="admin">Admin</option>
                      </select>
                  </div>
                  
                  <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Expires In</label>
                      <select id="share-expires" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="24h">24 hours</option>
                          <option value="1w">1 week</option>
                          <option value="1m">1 month</option>
                          <option value="never">Never</option>
                      </select>
                  </div>
              </div>
              
              <div class="mt-6 flex space-x-3">
                  <button onclick="agiesApp.processVaultShare('${vault.id}')" 
                          class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                      🔗 Share Vault
                  </button>
                  <button onclick="this.parentElement.parentElement.remove()" 
                          class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                      Cancel
                  </button>
              </div>
          </div>
      `;
      
      document.body.appendChild(modal);
  }

  // Process vault sharing
  processVaultShare(vaultId) {
      const emails = document.getElementById('share-emails').value.trim();
      const accessLevel = document.getElementById('share-access-level').value;
      const expires = document.getElementById('share-expires').value;
      
      if (!emails) {
          this.showError('Please enter at least one email address');
          return;
      }
      
      const emailList = emails.split('\n').map(email => email.trim()).filter(email => email);
      
      // Process sharing (in a real app, this would call an API)
      console.log('Sharing vault:', { vaultId, emailList, accessLevel, expires });
      
      // Close modal
      const modal = document.getElementById('shareVaultModal');
      if (modal) {
          modal.remove();
      }
      
      // Show success message
      this.showSuccess(`Vault shared with ${emailList.length} team member(s)!`);
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.AgiesApp = AgiesApp;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
      window.agiesApp = new AgiesApp();
    }
  });
}