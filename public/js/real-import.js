/**
 * Real Password Import System
 * Implements actual Chrome and CSV import functionality as promised
 */

class RealPasswordImport {
    constructor() {
        this.isInitialized = false;
        this.supportedFormats = ['chrome', 'csv', 'json', '1password'];
        this.init();
    }

    async init() {
        try {
            // Check browser capabilities
            this.checkBrowserSupport();
            
            this.isInitialized = true;
            console.log('✅ Real password import system initialized');
        } catch (error) {
            console.error('❌ Failed to initialize import system:', error);
        }
    }

    checkBrowserSupport() {
        // Check for Chrome extension API
        this.chromeExtensionSupported = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
        
        // Check for File API
        this.fileAPISupported = typeof File !== 'undefined' && typeof FileReader !== 'undefined';
        
        // Check for Clipboard API
        this.clipboardSupported = navigator.clipboard && navigator.clipboard.readText;
        
        console.log('🌐 Browser support:', {
            chromeExtension: this.chromeExtensionSupported,
            fileAPI: this.fileAPISupported,
            clipboard: this.clipboardSupported
        });
    }

    // Chrome Password Import
    async importFromChrome() {
        try {
            if (!this.chromeExtensionSupported) {
                throw new Error('Chrome extension not available. Please install the Agies Chrome extension.');
            }

            // Request passwords from Chrome
            const passwords = await this.requestChromePasswords();
            
            if (!passwords || passwords.length === 0) {
                throw new Error('No passwords found in Chrome or access denied');
            }

            // Process and validate passwords
            const processedPasswords = await this.processChromePasswords(passwords);
            
            console.log(`✅ Successfully imported ${processedPasswords.length} passwords from Chrome`);
            return processedPasswords;
        } catch (error) {
            console.error('❌ Chrome import failed:', error);
            throw error;
        }
    }

    async requestChromePasswords() {
        try {
            // Send message to Chrome extension
            const response = await chrome.runtime.sendMessage({
                action: 'getPasswords',
                source: 'chrome'
            });

            if (response.error) {
                throw new Error(response.error);
            }

            return response.passwords || [];
        } catch (error) {
            console.error('❌ Failed to request Chrome passwords:', error);
            throw error;
        }
    }

    async processChromePasswords(chromePasswords) {
        try {
            const processedPasswords = [];
            
            for (const chromePass of chromePasswords) {
                // Validate required fields
                if (!chromePass.origin || !chromePass.username || !chromePass.password) {
                    console.warn('⚠️ Skipping invalid password entry:', chromePass);
                    continue;
                }

                // Process the password entry
                const processedPassword = {
                    id: this.generatePasswordId(),
                    title: this.extractDomainName(chromePass.origin),
                    username: chromePass.username,
                    password: chromePass.password,
                    url: chromePass.origin,
                    notes: chromePass.notes || '',
                    vaultId: 'default', // Default vault
                    importedFrom: 'chrome',
                    importedAt: Date.now(),
                    lastUsed: chromePass.dateLastUsed || Date.now(),
                    strength: this.calculatePasswordStrength(chromePass.password)
                };

                processedPasswords.push(processedPassword);
            }

            return processedPasswords;
        } catch (error) {
            console.error('❌ Failed to process Chrome passwords:', error);
            throw error;
        }
    }

    // CSV Password Import
    async importFromCSV(file) {
        try {
            if (!this.fileAPISupported) {
                throw new Error('File API not supported in this browser');
            }

            if (!file || file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                throw new Error('Please select a valid CSV file');
            }

            const csvContent = await this.readFileAsText(file);
            const passwords = await this.parseCSVPasswords(csvContent);
            
            console.log(`✅ Successfully imported ${passwords.length} passwords from CSV`);
            return passwords;
        } catch (error) {
            console.error('❌ CSV import failed:', error);
            throw error;
        }
    }

    async readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            
            reader.onerror = (error) => {
                reject(new Error('Failed to read file: ' + error.message));
            };
            
            reader.readAsText(file);
        });
    }

    async parseCSVPasswords(csvContent) {
        try {
            const lines = csvContent.split('\n');
            const headers = this.parseCSVHeaders(lines[0]);
            const passwords = [];
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = this.parseCSVLine(line);
                if (values.length < headers.length) continue;
                
                const passwordEntry = {};
                headers.forEach((header, index) => {
                    passwordEntry[header] = values[index] || '';
                });
                
                // Validate required fields
                if (passwordEntry.url || passwordEntry.website || passwordEntry.domain) {
                    const processedPassword = this.processCSVPassword(passwordEntry);
                    if (processedPassword) {
                        passwords.push(processedPassword);
                    }
                }
            }
            
            return passwords;
        } catch (error) {
            console.error('❌ Failed to parse CSV:', error);
            throw error;
        }
    }

    parseCSVHeaders(headerLine) {
        return headerLine.split(',').map(header => 
            header.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
        );
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }

    processCSVPassword(csvEntry) {
        try {
            // Map common CSV fields to our password structure
            const url = csvEntry.url || csvEntry.website || csvEntry.domain || '';
            const username = csvEntry.username || csvEntry.user || csvEntry.email || '';
            const password = csvEntry.password || csvEntry.pass || '';
            const title = csvEntry.title || csvEntry.name || this.extractDomainName(url);
            const notes = csvEntry.notes || csvEntry.comment || '';
            
            if (!url || !username || !password) {
                console.warn('⚠️ Skipping CSV entry with missing required fields:', csvEntry);
                return null;
            }

            return {
                id: this.generatePasswordId(),
                title: title,
                username: username,
                password: password,
                url: url,
                notes: notes,
                vaultId: 'default',
                importedFrom: 'csv',
                importedAt: Date.now(),
                strength: this.calculatePasswordStrength(password)
            };
        } catch (error) {
            console.error('❌ Failed to process CSV password:', error);
            return null;
        }
    }

    // JSON Password Import
    async importFromJSON(file) {
        try {
            if (!this.fileAPISupported) {
                throw new Error('File API not supported in this browser');
            }

            if (!file || file.type !== 'application/json' && !file.name.endsWith('.json')) {
                throw new Error('Please select a valid JSON file');
            }

            const jsonContent = await this.readFileAsText(file);
            const passwords = await this.parseJSONPasswords(jsonContent);
            
            console.log(`✅ Successfully imported ${passwords.length} passwords from JSON`);
            return passwords;
        } catch (error) {
            console.error('❌ JSON import failed:', error);
            throw error;
        }
    }

    async parseJSONPasswords(jsonContent) {
        try {
            const data = JSON.parse(jsonContent);
            const passwords = [];
            
            // Handle different JSON formats
            if (Array.isArray(data)) {
                // Direct array of passwords
                for (const entry of data) {
                    const processed = this.processJSONPassword(entry);
                    if (processed) passwords.push(processed);
                }
            } else if (data.passwords && Array.isArray(data.passwords)) {
                // Nested passwords array
                for (const entry of data.passwords) {
                    const processed = this.processJSONPassword(entry);
                    if (processed) passwords.push(processed);
                }
            } else if (data.logins && Array.isArray(data.logins)) {
                // Firefox format
                for (const entry of data.logins) {
                    const processed = this.processJSONPassword(entry);
                    if (processed) passwords.push(processed);
                }
            } else {
                throw new Error('Unsupported JSON format');
            }
            
            return passwords;
        } catch (error) {
            console.error('❌ Failed to parse JSON:', error);
            throw error;
        }
    }

    processJSONPassword(jsonEntry) {
        try {
            // Map common JSON fields
            const url = jsonEntry.url || jsonEntry.origin || jsonEntry.hostname || '';
            const username = jsonEntry.username || jsonEntry.user || jsonEntry.email || '';
            const password = jsonEntry.password || jsonEntry.pass || '';
            const title = jsonEntry.title || jsonEntry.name || this.extractDomainName(url);
            const notes = jsonEntry.notes || jsonEntry.comment || '';
            
            if (!url || !username || !password) {
                console.warn('⚠️ Skipping JSON entry with missing required fields:', jsonEntry);
                return null;
            }

            return {
                id: this.generatePasswordId(),
                title: title,
                username: username,
                password: password,
                url: url,
                notes: notes,
                vaultId: 'default',
                importedFrom: 'json',
                importedAt: Date.now(),
                strength: this.calculatePasswordStrength(password)
            };
        } catch (error) {
            console.error('❌ Failed to process JSON password:', error);
            return null;
        }
    }

    // 1Password Import
    async importFrom1Password(file) {
        try {
            if (!this.fileAPISupported) {
                throw new Error('File API not supported in this browser');
            }

            const content = await this.readFileAsText(file);
            const passwords = await this.parse1PasswordExport(content);
            
            console.log(`✅ Successfully imported ${passwords.length} passwords from 1Password`);
            return passwords;
        } catch (error) {
            console.error('❌ 1Password import failed:', error);
            throw error;
        }
    }

    async parse1PasswordExport(content) {
        try {
            // 1Password exports are typically CSV with specific headers
            const lines = content.split('\n');
            const headers = this.parseCSVHeaders(lines[0]);
            const passwords = [];
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = this.parseCSVLine(line);
                if (values.length < headers.length) continue;
                
                const entry = {};
                headers.forEach((header, index) => {
                    entry[header] = values[index] || '';
                });
                
                const processed = this.process1PasswordEntry(entry);
                if (processed) {
                    passwords.push(processed);
                }
            }
            
            return passwords;
        } catch (error) {
            console.error('❌ Failed to parse 1Password export:', error);
            throw error;
        }
    }

    process1PasswordEntry(entry) {
        try {
            // 1Password specific field mapping
            const url = entry.url || entry.website || '';
            const username = entry.username || entry.user || entry.email || '';
            const password = entry.password || entry.pass || '';
            const title = entry.title || entry.name || this.extractDomainName(url);
            const notes = entry.notes || entry.comment || '';
            
            if (!url || !username || !password) {
                return null;
            }

            return {
                id: this.generatePasswordId(),
                title: title,
                username: username,
                password: password,
                url: url,
                notes: notes,
                vaultId: 'default',
                importedFrom: '1password',
                importedAt: Date.now(),
                strength: this.calculatePasswordStrength(password)
            };
        } catch (error) {
            console.error('❌ Failed to process 1Password entry:', error);
            return null;
        }
    }

    // Utility Functions
    generatePasswordId() {
        const array = crypto.getRandomValues(new Uint8Array(16));
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    extractDomainName(url) {
        try {
            if (!url) return 'Unknown';
            
            // Handle various URL formats
            let domain = url;
            if (url.startsWith('http://') || url.startsWith('https://')) {
                domain = new URL(url).hostname;
            } else if (url.includes('.')) {
                domain = url.split('.')[0];
            }
            
            // Capitalize first letter
            return domain.charAt(0).toUpperCase() + domain.slice(1);
        } catch (error) {
            return 'Unknown';
        }
    }

    calculatePasswordStrength(password) {
        if (!password) return 0;
        
        let score = 0;
        
        // Length
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        
        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        // Complexity
        if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            score += 2;
        }
        
        return Math.min(score, 10); // Max score of 10
    }

    // Get import status
    getImportStatus() {
        return {
            isInitialized: this.isInitialized,
            chromeExtension: this.chromeExtensionSupported,
            fileAPI: this.fileAPISupported,
            clipboard: this.clipboardSupported,
            supportedFormats: this.supportedFormats
        };
    }

    // Validate import data
    validateImportData(passwords) {
        const validPasswords = [];
        const invalidPasswords = [];
        
        for (const password of passwords) {
            if (this.isValidPassword(password)) {
                validPasswords.push(password);
            } else {
                invalidPasswords.push(password);
            }
        }
        
        return {
            valid: validPasswords,
            invalid: invalidPasswords,
            total: passwords.length,
            validCount: validPasswords.length,
            invalidCount: invalidPasswords.length
        };
    }

    isValidPassword(password) {
        return password && 
               password.title && 
               password.username && 
               password.password && 
               password.title.trim() !== '' && 
               password.username.trim() !== '' && 
               password.password.trim() !== '';
    }

    // Get import statistics
    getImportStatistics(passwords) {
        const stats = {
            total: passwords.length,
            bySource: {},
            byStrength: { weak: 0, medium: 0, strong: 0 },
            duplicates: 0,
            uniqueDomains: new Set()
        };
        
        for (const password of passwords) {
            // Count by source
            const source = password.importedFrom || 'unknown';
            stats.bySource[source] = (stats.bySource[source] || 0) + 1;
            
            // Count by strength
            if (password.strength <= 3) stats.byStrength.weak++;
            else if (password.strength <= 7) stats.byStrength.medium++;
            else stats.byStrength.strong++;
            
            // Count unique domains
            if (password.url) {
                stats.uniqueDomains.add(this.extractDomainName(password.url));
            }
        }
        
        stats.uniqueDomains = stats.uniqueDomains.size;
        
        return stats;
    }
}

// Export for use in other modules
window.RealPasswordImport = RealPasswordImport;
