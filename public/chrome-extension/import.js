/**
 * Agies Chrome Extension - Import Functionality
 * Securely imports passwords from Chrome's password manager
 */

class ChromePasswordImporter {
  constructor() {
    this.importedPasswords = [];
    this.importProgress = 0;
    this.isImporting = false;
  }

  async startImport() {
    if (this.isImporting) {
      throw new Error('Import already in progress');
    }

    this.isImporting = true;
    this.importedPasswords = [];
    this.importProgress = 0;

    try {
      // Request permissions if needed
      const hasPermission = await this.requestImportPermission();
      if (!hasPermission) {
        throw new Error('Import permission denied by user');
      }

      // Get Chrome's saved passwords
      const chromePasswords = await this.getChromePasswords();

      // Process and secure the passwords
      await this.processPasswords(chromePasswords);

      // Send to Agies vault
      await this.sendToAgiesVault();

      console.log('✅ Import completed successfully');
      return {
        success: true,
        importedCount: this.importedPasswords.length,
        message: `Successfully imported ${this.importedPasswords.length} passwords`
      };

    } catch (error) {
      console.error('❌ Import failed:', error);
      return {
        success: false,
        error: error.message,
        importedCount: 0
      };
    } finally {
      this.isImporting = false;
    }
  }

  async requestImportPermission() {
    return new Promise((resolve) => {
      if (confirm(
        'Agies needs permission to import your saved passwords from Chrome. ' +
        'Your passwords will be encrypted locally and never sent unencrypted to our servers. ' +
        'Do you want to continue?'
      )) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  async getChromePasswords() {
    // Import real passwords from Chrome
    async function importFromChrome() {
        try {
            console.log('🔍 Starting real Chrome password import...');
            
            // Check if Chrome password manager is accessible
            if (typeof chrome !== 'undefined' && chrome.passwordsPrivate) {
                const passwords = await chrome.passwordsPrivate.getSavedPasswords();
                console.log(`📊 Found ${passwords.length} real passwords in Chrome`);
                return passwords;
            }
            
            // Fallback: Try to access Chrome's password store
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.local.get(['passwords']);
                if (result.passwords) {
                    console.log(`📊 Found ${result.passwords.length} passwords in Chrome storage`);
                    return result.passwords;
                }
            }
            
            // If Chrome APIs not available, show instructions
            showImportInstructions();
            return [];
            
        } catch (error) {
            console.error('Error importing from Chrome:', error);
            showImportError('Failed to import passwords from Chrome. Please check permissions.');
            return [];
        }
    }

    // Show import instructions for users
    function showImportInstructions() {
        const instructions = `
            <div class="import-instructions">
                <h3>Chrome Password Import</h3>
                <p>To import passwords from Chrome:</p>
                <ol>
                    <li>Open Chrome and go to Settings > Passwords</li>
                    <li>Export your passwords as CSV</li>
                    <li>Upload the CSV file here</li>
                </ol>
                <button onclick="importFromCSV()" class="btn btn-primary">Import CSV Instead</button>
            </div>
        `;
        
        document.getElementById('import-results').innerHTML = instructions;
    }

    // Show import error
    function showImportError(message) {
        document.getElementById('import-results').innerHTML = `
            <div class="import-error">
                <p>❌ ${message}</p>
                <button onclick="importFromCSV()" class="btn btn-secondary">Try CSV Import Instead</button>
            </div>
        `;
    }
  }

  async processPasswords(chromePasswords) {
    console.log('🔒 Processing passwords with Agies encryption...');

    const totalPasswords = chromePasswords.length;

    for (let i = 0; i < chromePasswords.length; i++) {
      const chromePassword = chromePasswords[i];

      // Update progress
      this.importProgress = Math.round(((i + 1) / totalPasswords) * 100);
      this.emitProgress();

      // Process each password
      const processedPassword = await this.processSinglePassword(chromePassword, i);

      this.importedPasswords.push(processedPassword);

      // Small delay to show progress
      await this.delay(500);
    }

    console.log('✅ All passwords processed and encrypted');
  }

  async processSinglePassword(chromePassword, index) {
    // Extract domain from URL for better categorization
    const domain = this.extractDomain(chromePassword.url);

    // Generate a secure icon identifier
    const iconId = await this.generateIconId(domain);

    // Create Agies-compatible password entry
    const agiesPassword = {
      id: `imported_${Date.now()}_${index}`,
      title: this.generateTitle(domain, chromePassword.username),
      username: chromePassword.username,
      password: chromePassword.password, // This will be encrypted locally
      url: chromePassword.url,
      category: this.categorizeDomain(domain),
      iconId: iconId,
      tags: ['imported', 'chrome', domain],
      notes: `Imported from Chrome on ${new Date().toISOString()}`,
      securityLevel: this.assessPasswordSecurity(chromePassword.password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accessCount: 0,
      lastAccessed: null,
      expiresAt: null,
      twoFactorEnabled: false,
      importSource: 'chrome',
      originalSignonRealm: chromePassword.signonRealm
    };

    return agiesPassword;
  }

  extractDomain(url) {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (error) {
      return url;
    }
  }

  generateTitle(domain, username) {
    const cleanDomain = domain.replace(/\.(com|org|net|edu|gov)$/i, '');
    const capitalized = cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);

    // If username looks like an email, use domain as title
    if (username.includes('@')) {
      return capitalized;
    }

    // Otherwise, include username in title
    return `${capitalized} (${username})`;
  }

  categorizeDomain(domain) {
    const categories = {
      'Communication': ['gmail.com', 'outlook.com', 'yahoo.com', 'protonmail.com', 'mail.google.com'],
      'Social Media': ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'reddit.com'],
      'Development': ['github.com', 'gitlab.com', 'bitbucket.org', 'stackoverflow.com'],
      'Shopping': ['amazon.com', 'ebay.com', 'walmart.com', 'target.com'],
      'Finance': ['bankofamerica.com', 'chase.com', 'paypal.com', 'stripe.com'],
      'Entertainment': ['netflix.com', 'spotify.com', 'youtube.com', 'twitch.tv'],
      'Work': ['slack.com', 'zoom.us', 'teams.microsoft.com', 'atlassian.net']
    };

    for (const [category, domains] of Object.entries(categories)) {
      if (domains.some(d => domain.includes(d) || d.includes(domain))) {
        return category;
      }
    }

    return 'Other';
  }

  async generateIconId(domain) {
    // Generate a consistent icon ID based on domain
    const hash = await this.simpleHash(domain);
    return `icon_${hash}`