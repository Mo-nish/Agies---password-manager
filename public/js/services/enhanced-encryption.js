/**
 * Browser-compatible Enhanced Encryption Service
 * Simplified version for frontend use
 */

class AgiesZeroKnowledgeEncryption {
  constructor() {
    this.derivedKeys = new Map();
    this.keyRotationSchedule = new Map();
    this.encryptionAlgorithm = 'AES-256-GCM';
    this.keyIterations = 100000;
  }

  async deriveMasterKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: this.keyIterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return key;
  }

  async encryptPassword(password, masterKey) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      masterKey,
      encoder.encode(password)
    );

    return {
      encrypted: this.arrayBufferToBase64(encrypted),
      iv: this.arrayBufferToBase64(iv),
      algorithm: this.encryptionAlgorithm
    };
  }

  async decryptPassword(encryptedData, masterKey) {
    const decoder = new TextDecoder();

    try {
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: this.base64ToArrayBuffer(encryptedData.iv) },
        masterKey,
        this.base64ToArrayBuffer(encryptedData.encrypted)
      );

      return decoder.decode(decrypted);
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  }

  async encryptVault(vaultData, masterKey) {
    const jsonData = JSON.stringify(vaultData);
    return this.encryptPassword(jsonData, masterKey);
  }

  async decryptVault(encryptedVault, masterKey) {
    const decryptedJson = await this.decryptPassword(encryptedVault, masterKey);
    return JSON.parse(decryptedJson);
  }

  generateSalt() {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return this.arrayBufferToBase64(salt);
  }

  rotateKey(oldKeyId) {
    console.log('🔄 Rotating encryption key:', oldKeyId);
    // In a real implementation, this would re-encrypt all data with a new key
    return 'new_key_' + Math.random().toString(36).substr(2, 9);
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  getEncryptionStatus() {
    return {
      algorithm: this.encryptionAlgorithm,
      keyIterations: this.keyIterations,
      keysActive: this.derivedKeys.size,
      pendingRotations: this.keyRotationSchedule.size
    };
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.AgiesZeroKnowledgeEncryption = AgiesZeroKnowledgeEncryption;
}
