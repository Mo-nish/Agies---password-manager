/**
 * Browser-compatible Honeytoken Service
 * Simplified version for frontend use
 */

class HoneytokenService {
  constructor() {
    this.honeytokens = new Map();
    this.decoyVaults = new Map();
    this.triggeredTokens = new Set();
  }

  generateHoneytoken(target, type = 'credential') {
    const tokenId = 'honey_' + Math.random().toString(36).substr(2, 9);
    const honeytoken = {
      id: tokenId,
      type: type,
      target: target,
      value: this.generateFakeTokenValue(type),
      createdAt: new Date(),
      triggered: false,
      triggerCount: 0,
      lastTriggered: null,
      isActive: true
    };

    this.honeytokens.set(tokenId, honeytoken);
    console.log('🍯 Honeytoken generated:', type, 'for', target);
    return honeytoken;
  }

  generateFakeTokenValue(type) {
    switch (type) {
      case 'credential':
        return 'fake_user:fake_password_' + Math.random().toString(36).substr(2, 8);
      case 'api_key':
        return 'fake_api_key_' + Math.random().toString(36).substr(2, 16);
      case 'session':
        return 'fake_session_' + Math.random().toString(36).substr(2, 32);
      default:
        return 'fake_token_' + Math.random().toString(36).substr(2, 16);
    }
  }

  createDecoyVault(vaultId, config = {}) {
    const decoyId = 'decoy_' + Math.random().toString(36).substr(2, 9);
    const decoyVault = {
      id: decoyId,
      vaultId: vaultId,
      decoyData: {
        passwords: this.generateFakePasswords(),
        notes: this.generateFakeNotes(),
        creditCards: this.generateFakeCreditCards()
      },
      triggerMechanism: config.trigger || 'time_based',
      activationThreshold: config.threshold || 3,
      lastTriggered: null,
      isActive: true
    };

    this.decoyVaults.set(decoyId, decoyVault);
    console.log('🎭 Decoy vault created for:', vaultId);
    return decoyId;
  }

  generateFakePasswords() {
    return [
      { title: 'Bank Login', username: 'user@bank.com', password: 'bankpass123', url: 'bank.com' },
      { title: 'Email Account', username: 'user@email.com', password: 'emailpass456', url: 'email.com' },
      { title: 'Social Media', username: 'user@social.com', password: 'socialpass789', url: 'social.com' }
    ];
  }

  generateFakeNotes() {
    return [
      { title: 'Financial Records', content: 'Fake financial information to mislead attackers.' },
      { title: 'Personal Information', content: 'Fake personal details for decoy purposes.' },
      { title: 'Project Documents', content: 'Fake project documentation.' }
    ];
  }

  generateFakeCreditCards() {
    return [
      { name: 'John Doe', number: '4111-1111-1111-1111', expiry: '12/25', cvv: '123' },
      { name: 'Jane Smith', number: '5555-5555-5555-4444', expiry: '08/26', cvv: '456' }
    ];
  }

  triggerHoneytoken(tokenId) {
    const token = this.honeytokens.get(tokenId);
    if (!token) return false;

    token.triggered = true;
    token.triggerCount++;
    token.lastTriggered = new Date();
    this.triggeredTokens.add(tokenId);

    console.log('🚨 Honeytoken triggered:', token.type, token.target);
    return true;
  }

  triggerDecoyVault(decoyId) {
    const decoy = this.decoyVaults.get(decoyId);
    if (!decoy) return false;

    decoy.lastTriggered = new Date();
    console.log('🎭 Decoy vault triggered:', decoyId);
    return true;
  }

  getTriggeredTokens() {
    return Array.from(this.triggeredTokens).map(id => this.honeytokens.get(id)).filter(Boolean);
  }

  getActiveDecoyVaults() {
    return Array.from(this.decoyVaults.values()).filter(decoy => decoy.isActive);
  }

  deactivateHoneytoken(tokenId) {
    const token = this.honeytokens.get(tokenId);
    if (token) {
      token.isActive = false;
      console.log('🚫 Honeytoken deactivated:', tokenId);
      return true;
    }
    return false;
  }

  getHoneytokenStats() {
    const active = Array.from(this.honeytokens.values()).filter(h => h.isActive).length;
    const triggered = Array.from(this.honeytokens.values()).filter(h => h.triggered).length;
    const decoyVaults = this.decoyVaults.size;

    return {
      totalHoneytokens: this.honeytokens.size,
      activeHoneytokens: active,
      triggeredHoneytokens: triggered,
      decoyVaults: decoyVaults
    };
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.HoneytokenService = HoneytokenService;
}
