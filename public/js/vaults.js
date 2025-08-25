class VaultManager {
    constructor() {
        this.API_BASE = 'http://localhost:3002/api';
        this.currentVault = null;
        this.vaults = [];
        this.init();
    }

    async init() {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            // Load vaults
            await this.loadVaults();
            
            // Bind events
            this.bindEvents();
            
            // Auto-open default vault if exists
            if (this.vaults.length > 0) {
                const defaultVault = this.vaults.find(v => v.is_default) || this.vaults[0];
                if (defaultVault) {
                    this.openVault(defaultVault.id);
                }
            }

            // Initialize autofill functionality
            this.initializeAutofill();
            
        } catch (error) {
            console.error('Failed to initialize vault manager:', error);
            this.showError('Failed to initialize vault manager');
        }
    }

    bindEvents() {
        // Create vault button
        const createVaultBtn = document.getElementById('create-vault-btn');
        if (createVaultBtn) {
            createVaultBtn.addEventListener('click', () => {
                this.showCreateVaultModal();
            });
        }

        // Create vault form
        const createVaultForm = document.getElementById('create-vault-form');
        if (createVaultForm) {
            createVaultForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createVault();
            });
        }

        // Close modal buttons
        const closeModalBtn = document.getElementById('close-create-modal');
        const cancelCreateBtn = document.getElementById('cancel-create-vault');
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.hideCreateVaultModal();
            });
        }
        
        if (cancelCreateBtn) {
            cancelCreateBtn.addEventListener('click', () => {
                this.hideCreateVaultModal();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Password management buttons
        const addPasswordBtn = document.getElementById('add-password-btn');
        if (addPasswordBtn) {
            addPasswordBtn.addEventListener('click', () => {
                this.showAddPasswordModal();
            });
        }

        const importPasswordsBtn = document.getElementById('import-passwords-btn');
        if (importPasswordsBtn) {
            importPasswordsBtn.addEventListener('click', () => {
                this.showImportModal();
            });
        }

        // Add password modal events
        const closePasswordModal = document.getElementById('close-password-modal');
        if (closePasswordModal) {
            closePasswordModal.addEventListener('click', () => {
                this.hideAddPasswordModal();
            });
        }

        const cancelAddPassword = document.getElementById('cancel-add-password');
        if (cancelAddPassword) {
            cancelAddPassword.addEventListener('click', () => {
                this.hideAddPasswordModal();
            });
        }

        const addPasswordForm = document.getElementById('add-password-form');
        if (addPasswordForm) {
            addPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addPassword();
            });
        }

        // Import modal events
        const closeImportModal = document.getElementById('close-import-modal');
        if (closeImportModal) {
            closeImportModal.addEventListener('click', () => {
                this.hideImportModal();
            });
        }

        const importChromeBtn = document.getElementById('import-chrome-btn');
        if (importChromeBtn) {
            importChromeBtn.addEventListener('click', () => {
                this.importFromChrome();
            });
        }

        const importCsvBtn = document.getElementById('import-csv-btn');
        if (importCsvBtn) {
            importCsvBtn.addEventListener('click', () => {
                this.importFromCsv();
            });
        }

        const manualImportBtn = document.getElementById('manual-import-btn');
        if (manualImportBtn) {
            manualImportBtn.addEventListener('click', () => {
                this.hideImportModal();
                this.showAddPasswordModal();
            });
        }

        const cancelImportBtn = document.getElementById('cancel-import');
        if (cancelImportBtn) {
            cancelImportBtn.addEventListener('click', () => {
                this.hideImportModal();
            });
        }

        // Password toggle visibility
        const togglePassword = document.getElementById('toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }
    }

    async loadVaults() {
        try {
            this.showLoading(true);
            
            const token = localStorage.getItem('token');
            
            // Check if user is authenticated
            if (!token) {
                console.log('🔐 No authentication token found, redirecting to login...');
                window.location.href = '/login';
                return;
            }
            
            const response = await fetch(`${this.API_BASE}/vaults`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.vaults = data.vaults;
                this.renderVaults(data.vaults);
            } else if (response.status === 401) {
                console.log('🔐 Authentication failed, redirecting to login...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else {
                throw new Error('Failed to load vaults');
            }
        } catch (error) {
            console.error('Failed to load vaults:', error);
            this.showError('Failed to load vaults');
        } finally {
            this.showLoading(false);
        }
    }

    renderVaults(vaults) {
        const container = document.getElementById('vaults-container');
        if (!container) return;

        if (vaults.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">🔐</span>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">No Vaults Yet</h3>
                    <p class="text-gray-400 mb-6">Create your first vault to start organizing your passwords.</p>
                    <button id="create-first-vault" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Create Your First Vault
                    </button>
                </div>
            `;
            
            // Bind event for create first vault button
            const createFirstVaultBtn = document.getElementById('create-first-vault');
            if (createFirstVaultBtn) {
                createFirstVaultBtn.addEventListener('click', () => {
                    this.showCreateVaultModal();
                });
            }
            return;
        }

        container.innerHTML = vaults.map(vault => `
            <div class="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors cursor-pointer vault-card" 
                 data-vault-id="${vault.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span class="text-xl">👤</span>
                    </div>
                    <div class="text-right">
                        <span class="text-sm text-gray-400">${vault.password_count || 0} passwords</span>
                    </div>
                </div>
                <div>
                    <h4 class="font-semibold text-lg mb-2">${vault.name}</h4>
                    <p class="text-gray-400 text-sm">${vault.description || 'No description'}</p>
                </div>
            </div>
        `).join('');

        // Add event listeners to vault cards
        const vaultCards = container.querySelectorAll('.vault-card');
        vaultCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const vaultId = e.currentTarget.dataset.vaultId;
                this.openVault(vaultId);
            });
        });
    }

    async openVault(vaultId) {
        try {
            this.currentVault = vaultId;
            await this.loadPasswords(vaultId);
            this.showPasswordsSection();
            
            // Update current vault name display
            const vaultNameElement = document.getElementById('current-vault-name');
            if (vaultNameElement) {
                const vault = this.vaults?.find(v => v.id === vaultId);
                if (vault) {
                    vaultNameElement.textContent = vault.name;
                }
            }
        } catch (error) {
            console.error('Failed to open vault:', error);
            this.showError('Failed to open vault');
        }
    }

    async loadPasswords(vaultId) {
        try {
            this.showLoading(true);
            
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/vaults/${vaultId}/passwords`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderPasswords(data.passwords);
            } else {
                throw new Error('Failed to load passwords');
            }
        } catch (error) {
            console.error('Failed to load passwords:', error);
            this.showError('Failed to load passwords');
        } finally {
            this.showLoading(false);
        }
    }

    renderPasswords(passwords) {
        const container = document.getElementById('passwords-container');
        if (!container) return;

        if (passwords.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">🔑</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-300 mb-2">No Passwords Yet</h3>
                    <p class="text-gray-400">This vault is empty. Add your first password to get started.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = passwords.map(password => `
            <div class="bg-gray-800 rounded-lg p-4 password-entry" data-password-id="${password.id}" data-password-title="${password.title}" data-password-username="${password.username}" data-password-url="${password.url || ''}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span class="text-sm">🌐</span>
                        </div>
                        <div>
                            <h4 class="font-medium">${password.title}</h4>
                            <p class="text-sm text-gray-400">${password.username}</p>
                            ${password.url ? `<p class="text-xs text-gray-500">${password.url}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="copy-password-btn text-blue-400 hover:text-blue-300 text-sm" data-password-id="${password.id}">
                            Copy
                        </button>
                        <button class="edit-password-btn text-green-400 hover:text-green-300 text-sm" data-password-id="${password.id}">
                            Edit
                        </button>
                        <button class="autofill-btn text-yellow-400 hover:text-yellow-300 text-sm" data-password-id="${password.id}">
                            🔑 Autofill
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to password action buttons
        const copyButtons = container.querySelectorAll('.copy-password-btn');
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const passwordId = e.currentTarget.dataset.passwordId;
                this.copyPassword(passwordId);
            });
        });

        const editButtons = container.querySelectorAll('.edit-password-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const passwordId = e.currentTarget.dataset.passwordId;
                this.editPassword(passwordId);
            });
        });

        const autofillButtons = container.querySelectorAll('.autofill-btn');
        autofillButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const passwordId = e.currentTarget.dataset.passwordId;
                this.showAutofillInstructions(button);
            });
        });
    }

    showPasswordsSection() {
        const passwordsSection = document.getElementById('passwords-section');
        if (passwordsSection) {
            passwordsSection.classList.remove('hidden');
        }
    }

    hidePasswordsSection() {
        const passwordsSection = document.getElementById('passwords-section');
        if (passwordsSection) {
            passwordsSection.classList.add('hidden');
        }
    }

    showCreateVaultModal() {
        const modal = document.getElementById('create-vault-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideCreateVaultModal() {
        const modal = document.getElementById('create-vault-modal');
        if (modal) {
            modal.classList.add('hidden');
            
            // Clear form
            const form = document.getElementById('create-vault-form');
            if (form) {
                form.reset();
            }
        }
    }

    async createVault() {
        try {
            const nameInput = document.getElementById('vault-name');
            const descriptionInput = document.getElementById('vault-description');
            
            if (!nameInput || !descriptionInput) {
                this.showError('Form inputs not found');
                return;
            }

            const name = nameInput.value.trim();
            const description = descriptionInput.value.trim();

            if (!name) {
                this.showError('Vault name is required');
                return;
            }

            this.showLoading(true);
            
            // Create vault via API
            const token = localStorage.getItem('token');
            
            // Check if user is authenticated
            if (!token) {
                console.log('🔐 No authentication token found, redirecting to login...');
                window.location.href = '/login';
                return;
            }
            
            const response = await fetch(`${this.API_BASE}/vaults`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    is_default: false
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.showSuccess('Vault created successfully');
                this.hideCreateVaultModal();
                
                // Reload vaults to show the new one
                await this.loadVaults();
            } else if (response.status === 401) {
                console.log('🔐 Authentication failed, redirecting to login...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else {
                throw new Error('Failed to create vault');
            }
            
        } catch (error) {
            console.error('Failed to create vault:', error);
            this.showError('Failed to create vault');
        } finally {
            this.showLoading(false);
        }
    }

    copyPassword(passwordId) {
        try {
            // Find the password in the current vault
            if (!this.currentVault) {
                this.showError('No vault selected');
                return;
            }

            // Get passwords from the current vault
            const passwordsContainer = document.getElementById('passwords-container');
            if (!passwordsContainer) {
                this.showError('Passwords container not found');
                return;
            }

            // Find the password element by ID
            const passwordElement = passwordsContainer.querySelector(`[data-password-id="${passwordId}"]`);
            if (!passwordElement) {
                this.showError('Password not found');
                return;
            }

            // Extract password from the element (we need to store the actual password data)
            // For now, show a message that this feature needs the password data
            this.showInfo('Password copying will work once password data is properly stored. For now, please view the password details.');
            
            // TODO: Store password data in the DOM or retrieve from server for copying
            // navigator.clipboard.writeText(actualPassword).then(() => {
            //     this.showSuccess('Password copied to clipboard');
            // }).catch(() => {
            //     this.showError('Failed to copy password');
            // });
        } catch (error) {
            console.error('Copy password error:', error);
            this.showError('Failed to copy password');
        }
    }

    editPassword(passwordId) {
        // Load password data and show edit modal
        this.loadPasswordForEditing(passwordId);
    }

    // Load password data for editing
    async loadPasswordForEditing(passwordId) {
        try {
            this.showLoading(true);
            
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/passwords/${passwordId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const password = await response.json();
                this.showEditPasswordModal(password);
            } else {
                throw new Error('Failed to load password details');
            }
        } catch (error) {
            console.error('Error loading password for editing:', error);
            this.showError('Failed to load password details. Using local data.');
            
            // Fallback to local password data
            const localPasswords = JSON.parse(localStorage.getItem('agies_passwords') || '[]');
            const password = localPasswords.find(p => p.id === passwordId);
            if (password) {
                this.showEditPasswordModal(password);
            } else {
                this.showError('Password not found');
            }
        } finally {
            this.showLoading(false);
        }
    }

    // Show edit password modal
    showEditPasswordModal(password) {
        const modalHTML = `
            <div id="edit-password-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-white">Edit Password</h3>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <form id="edit-password-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Title</label>
                            <input type="text" id="edit-password-title" value="${password.title || ''}" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Username/Email</label>
                            <input type="text" id="edit-password-username" value="${password.username || ''}" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none" required>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div class="relative">
                                <input type="password" id="edit-password-value" value="${password.password || ''}" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none pr-12" required>
                                <button type="button" onclick="togglePasswordVisibility('edit-password-value')" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                                    👁️
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">URL (optional)</label>
                            <input type="url" id="edit-password-url" value="${password.url || ''}" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
                            <textarea id="edit-password-notes" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none" rows="3">${password.notes || ''}</textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select id="edit-password-category" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                                <option value="general" ${password.category === 'general' ? 'selected' : ''}>General</option>
                                <option value="finance" ${password.category === 'finance' ? 'selected' : ''}>Finance</option>
                                <option value="social" ${password.category === 'social' ? 'selected' : ''}>Social Media</option>
                                <option value="work" ${password.category === 'work' ? 'selected' : ''}>Work</option>
                                <option value="personal" ${password.category === 'personal' ? 'selected' : ''}>Personal</option>
                                <option value="shopping" ${password.category === 'shopping' ? 'selected' : ''}>Shopping</option>
                                <option value="gaming" ${password.category === 'gaming' ? 'selected' : ''}>Gaming</option>
                                <option value="development" ${password.category === 'development' ? 'selected' : ''}>Development</option>
                            </select>
                        </div>
                        
                        <div class="flex space-x-3 pt-4">
                            <button type="submit" class="flex-1 btn-primary px-4 py-2 rounded-lg text-white">
                                Update Password
                            </button>
                            <button type="button" onclick="this.parentElement.parentElement.parentElement.remove()" class="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Handle form submission
        document.getElementById('edit-password-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updatePassword(password.id);
        });
    }

    // Update password
    async updatePassword(passwordId) {
        try {
            const title = document.getElementById('edit-password-title').value.trim();
            const username = document.getElementById('edit-password-username').value.trim();
            const password = document.getElementById('edit-password-value').value;
            const url = document.getElementById('edit-password-url').value.trim();
            const notes = document.getElementById('edit-password-notes').value.trim();
            const category = document.getElementById('edit-password-category').value;

            if (!title || !username || !password) {
                this.showError('Title, username, and password are required');
                return;
            }

            this.showLoading(true);

            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/passwords/${passwordId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    username,
                    password,
                    url: url || null,
                    notes: notes || null,
                    category
                })
            });

            if (response.ok) {
                this.showSuccess('Password updated successfully!');
                this.closeEditPasswordModal();
                
                // Refresh passwords display
                if (this.currentVault) {
                    await this.loadPasswords(this.currentVault);
                }
            } else {
                throw new Error('Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            this.showError('Failed to update password. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    // Close edit password modal
    closeEditPasswordModal() {
        const modal = document.getElementById('edit-password-modal');
        if (modal) {
            modal.remove();
        }
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

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.toggle('hidden', !show);
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-3 rounded-lg shadow-lg z-50 text-sm ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Password Management Methods
    showAddPasswordModal() {
        const modal = document.getElementById('add-password-modal');
        if (modal) {
            modal.classList.remove('hidden');
            // Reset form
            const form = document.getElementById('add-password-form');
            if (form) form.reset();
        }
    }

    hideAddPasswordModal() {
        const modal = document.getElementById('add-password-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async addPassword() {
        try {
            const title = document.getElementById('password-title')?.value?.trim();
            const username = document.getElementById('password-username')?.value?.trim();
            const password = document.getElementById('password-value')?.value;
            const url = document.getElementById('password-url')?.value?.trim();
            const notes = document.getElementById('password-notes')?.value?.trim();

            if (!title || !username || !password) {
                this.showError('Title, username, and password are required');
                return;
            }

            if (!this.currentVault) {
                this.showError('No vault selected');
                return;
            }

            console.log('🔐 Adding password to vault:', this.currentVault);
            console.log('🔐 Vault type:', typeof this.currentVault);

            this.showLoading(true);

            const token = localStorage.getItem('token');
            const response = await fetch(`${this.API_BASE}/vaults/${this.currentVault}/passwords`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    username,
                    password,
                    url: url || null,
                    notes: notes || null
                })
            });

            if (response.ok) {
                this.showSuccess('Password added successfully');
                this.hideAddPasswordModal();
                // Reload passwords in current vault
                await this.loadPasswords(this.currentVault);
                // Also reload vaults to update password count
                await this.loadVaults();
            } else if (response.status === 401) {
                console.log('🔐 Authentication failed, redirecting to login...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else {
                throw new Error('Failed to add password');
            }
        } catch (error) {
            console.error('Failed to add password:', error);
            this.showError('Failed to add password');
        } finally {
            this.showLoading(false);
        }
    }

    // Import Methods
    showImportModal() {
        const modal = document.getElementById('import-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideImportModal() {
        const modal = document.getElementById('import-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async importFromChrome() {
        try {
            this.showLoading(true);
            
            // Check if Chrome extension is available
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                // Chrome extension is available
                const result = await chrome.storage.local.get(['passwords']);
                if (result.passwords) {
                    await this.processImportedPasswords(result.passwords);
                    this.showSuccess(`Imported ${result.passwords.length} passwords from Chrome`);
                } else {
                    this.showError('No passwords found in Chrome storage');
                }
            } else {
                // Fallback: Show better import options
                this.showInfo('Chrome extension not detected. Here are your import options:');
                
                // Create import options modal
                this.showImportOptionsModal();
            }
        } catch (error) {
            console.error('Chrome import failed:', error);
            this.showError('Failed to import from Chrome');
        } finally {
            this.showLoading(false);
        }
    }

    showImportOptionsModal() {
        // Create a modal with import options
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-8 w-full max-w-md mx-4">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-semibold text-white">Import Passwords</h3>
                    <button class="close-import-options text-gray-400 hover:text-white transition-colors">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <h4 class="text-lg font-medium text-white mb-3">Choose Import Method</h4>
                        <div class="space-y-3">
                            <button class="import-csv-btn w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                                <span class="text-lg mr-3">📄</span>
                                Import from CSV/JSON File
                            </button>
                            <button class="install-extension-btn w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                                <span class="text-lg mr-3">🌐</span>
                                Install Chrome Extension
                            </button>
                            <button class="manual-add-btn w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors text-left">
                                <span class="text-lg mr-3">✏️</span>
                                Add Passwords Manually
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to buttons
        const closeBtn = modal.querySelector('.close-import-options');
        const csvBtn = modal.querySelector('.import-csv-btn');
        const extensionBtn = modal.querySelector('.install-extension-btn');
        const manualBtn = modal.querySelector('.manual-add-btn');
        
        closeBtn.addEventListener('click', () => modal.remove());
        csvBtn.addEventListener('click', () => {
            modal.remove();
            document.getElementById('csv-file-input').click();
        });
        extensionBtn.addEventListener('click', () => {
            modal.remove();
            window.open('https://chrome.google.com/webstore/detail/agies-password-manager/...', '_blank');
        });
        manualBtn.addEventListener('click', () => {
            modal.remove();
            const addPasswordBtn = document.querySelector('#add-password-btn');
            if (addPasswordBtn) addPasswordBtn.click();
        });
        
        document.body.appendChild(modal);
    }

    async importFromCsv() {
        try {
            const fileInput = document.getElementById('csv-file-input');
            if (fileInput) {
                fileInput.click();
                
                fileInput.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        this.processFileImport(file);
                    }
                };
            }
        } catch (error) {
            console.error('CSV import failed:', error);
            this.showError('Failed to import CSV file');
        }
    }

    async processFileImport(file) {
        try {
            this.showLoading(true);
            
            const text = await file.text();
            let passwords = [];
            
            if (file.name.endsWith('.csv')) {
                passwords = this.parseCsvPasswords(text);
            } else if (file.name.endsWith('.json')) {
                passwords = JSON.parse(text);
            } else {
                throw new Error('Unsupported file format');
            }
            
            if (passwords.length > 0) {
                await this.processImportedPasswords(passwords);
                this.showSuccess(`Imported ${passwords.length} passwords from ${file.name}`);
            } else {
                this.showError('No valid passwords found in file');
            }
        } catch (error) {
            console.error('File import failed:', error);
            this.showError('Failed to process import file');
        } finally {
            this.showLoading(false);
        }
    }

    parseCsvPasswords(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const passwords = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim());
                const password = {};
                
                headers.forEach((header, index) => {
                    if (values[index]) {
                        password[header.toLowerCase()] = values[index];
                    }
                });
                
                if (password.title || password.name || password.website) {
                    passwords.push(password);
                }
            }
        }
        
        return passwords;
    }

    async processImportedPasswords(passwords) {
        if (!this.currentVault) {
            this.showError('Please select a vault first');
            return;
        }

        const token = localStorage.getItem('token');
        let successCount = 0;
        let errorCount = 0;

        for (const password of passwords) {
            try {
                const response = await fetch(`${this.API_BASE}/vaults/${this.currentVault}/passwords`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: password.title || password.name || password.website || 'Imported Password',
                        username: password.username || password.email || password.login || '',
                        password: password.password || password.pass || '',
                        url: password.url || password.website || null,
                        notes: password.notes || password.description || null
                    })
                });

                if (response.ok) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                errorCount++;
            }
        }

        // Reload passwords to show imported ones
        await this.loadPasswords(this.currentVault);
        
        if (errorCount > 0) {
            this.showInfo(`Import completed: ${successCount} successful, ${errorCount} failed`);
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password-value');
        const toggleBtn = document.getElementById('toggle-password');
        
        if (passwordInput && toggleBtn) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    // Autofill functionality
    initializeAutofill() {
        // Add autofill button to password entries
        this.addAutofillButtons();
        
        // Listen for form focus events to show autofill suggestions
        this.setupFormDetection();
    }

    addAutofillButtons() {
        const passwordsContainer = document.getElementById('passwords-container');
        if (!passwordsContainer) return;

        // Add autofill buttons to existing password entries
        const passwordEntries = passwordsContainer.querySelectorAll('.password-entry');
        passwordEntries.forEach(entry => {
            if (!entry.querySelector('.autofill-btn')) {
                const autofillBtn = document.createElement('button');
                autofillBtn.className = 'autofill-btn text-yellow-400 hover:text-yellow-300 text-sm ml-2';
                autofillBtn.textContent = '🔑 Autofill';
                autofillBtn.onclick = () => this.showAutofillInstructions(entry);
                entry.appendChild(autofillBtn);
            }
        });
    }

    setupFormDetection() {
        // Listen for focus events on input fields
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' && (e.target.type === 'email' || e.target.type === 'password')) {
                this.showAutofillSuggestion(e.target);
            }
        });
    }

    showAutofillSuggestion(inputField) {
        // Create autofill suggestion popup
        const popup = document.createElement('div');
        popup.className = 'fixed bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg z-50 text-white text-sm';
        popup.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>🔑</span>
                <span>Click to autofill with saved password</span>
                <button class="close-autofill-popup text-blue-400 hover:text-blue-300 ml-2">✕</button>
            </div>
        `;
        
        // Add event listener for close button
        const closeBtn = popup.querySelector('.close-autofill-popup');
        closeBtn.addEventListener('click', () => popup.remove());
        
        // Position popup near the input field
        const rect = inputField.getBoundingClientRect();
        popup.style.left = rect.left + 'px';
        popup.style.top = (rect.bottom + 5) + 'px';
        
        document.body.appendChild(popup);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 5000);
    }

    showAutofillInstructions(passwordEntry) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-xl p-8 w-full max-w-md mx-4">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-semibold text-white">Autofill Instructions</h3>
                    <button class="close-autofill-instructions text-gray-400 hover:text-white transition-colors">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="space-y-4 text-gray-300">
                    <p>To use autofill like 1Password:</p>
                    <ol class="list-decimal list-inside space-y-2">
                        <li>Install the Agies Chrome Extension</li>
                        <li>Navigate to any login form</li>
                        <li>Click the Agies icon in your browser</li>
                        <li>Select the saved password</li>
                        <li>Click "Autofill" to fill the form</li>
                    </ol>
                    <div class="pt-4">
                        <button class="install-chrome-extension-btn w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            Install Chrome Extension
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const closeBtn = modal.querySelector('.close-autofill-instructions');
        const installBtn = modal.querySelector('.install-chrome-extension-btn');
        
        closeBtn.addEventListener('click', () => modal.remove());
        installBtn.addEventListener('click', () => {
            window.open('https://chrome.google.com/webstore/detail/agies-password-manager/...', '_blank');
        });
        
        document.body.appendChild(modal);
    }
}

// Initialize vault manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.vaultManager = new VaultManager();
});
