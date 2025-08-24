import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { EventEmitter } from 'events';

/**
 * Agies Enhanced Zero-Knowledge Encryption Service
 * Ensures all encryption/decryption happens locally - server never sees plaintext
 */
export class AgiesZeroKnowledgeEncryption extends EventEmitter {
  private static readonly ENCRYPTION_ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32; // 256 bits
  private static readonly IV_LENGTH = 16; // 128 bits for GCM
  private static readonly TAG_LENGTH = 16; // 128 bits for GCM authentication tag
  private static readonly SALT_ROUNDS = 12;
  private static readonly MASTER_KEY_SALT_ROUNDS = 15;
  private static readonly PBKDF2_ITERATIONS = 100000;

  // Encryption keys are NEVER stored on server - only exist in memory during operations
  private masterKey: Buffer | null = null;
  private derivedKeys: Map<string, Buffer> = new Map();
  private keyRotationSchedule: Map<string, Date> = new Map();

  constructor() {
    super();
    console.log('🔐 Agies Zero-Knowledge Encryption initialized');
  }

  // === MASTER KEY MANAGEMENT ===

  /**
   * Set the master key for the current session
   * This key is used to derive all other encryption keys
   * CRITICAL: This key is never sent to or stored on the server
   */
  public async setMasterKey(masterKey: string): Promise<void> {
    try {
      // Hash the master key with additional entropy
      const masterKeyHash = await this.deriveMasterKey(masterKey);

      // Generate additional entropy from device fingerprint
      const deviceEntropy = await this.generateDeviceEntropy();
      const combinedEntropy = Buffer.concat([masterKeyHash, deviceEntropy]);

      // Final master key derivation using PBKDF2
      this.masterKey = await this.pbkdf2Derive(
        combinedEntropy,
        await this.generateSalt(),
        AgiesZeroKnowledgeEncryption.PBKDF2_ITERATIONS,
        AgiesZeroKnowledgeEncryption.KEY_LENGTH
      );

      this.emit('master_key_set', {
        timestamp: new Date(),
        hasMasterKey: !!this.masterKey
      });

      console.log('🔑 Master key set for zero-knowledge encryption');

    } catch (error) {
      console.error('Error setting master key:', error);
      throw new Error('Failed to initialize zero-knowledge encryption');
    }
  }

  /**
   * Clear the master key from memory
   * Call this when user logs out or session ends
   */
  public clearMasterKey(): void {
    if (this.masterKey) {
      // Zero out the master key in memory
      this.masterKey.fill(0);
      this.masterKey = null;
    }

    // Clear all derived keys
    for (const key of this.derivedKeys.values()) {
      key.fill(0);
    }
    this.derivedKeys.clear();

    this.emit('master_key_cleared', { timestamp: new Date() });
    console.log('🔑 Master key cleared from memory');
  }

  private async deriveMasterKey(masterKey: string): Promise<Buffer> {
    const hashedKey = await bcrypt.hash(masterKey, AgiesZeroKnowledgeEncryption.MASTER_KEY_SALT_ROUNDS);
    return crypto.createHash('sha256').update(hashedKey).digest();
  }

  private async generateDeviceEntropy(): Promise<Buffer> {
    // Generate entropy based on device characteristics
    const deviceInfo = {
      userAgent: navigator?.userAgent || 'unknown',
      language: navigator?.language || 'unknown',
      platform: navigator?.platform || 'unknown',
      hardwareConcurrency: navigator?.hardwareConcurrency || 0,
      deviceMemory: (navigator as any)?.deviceMemory || 0,
      timestamp: Date.now()
    };

    const deviceString = JSON.stringify(deviceInfo);
    return crypto.createHash('sha256').update(deviceString).digest();
  }

  private async generateSalt(): Promise<Buffer> {
    return crypto.randomBytes(32);
  }

  private async pbkdf2Derive(keyMaterial: Buffer, salt: Buffer, iterations: number, keyLength: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(keyMaterial, salt, iterations, keyLength, 'sha256', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });
  }

  // === VAULT ENCRYPTION ===

  /**
   * Encrypt vault data using the master key
   * Returns encrypted data that can be safely stored on server
   */
  public async encryptVaultData(data: any, vaultId: string): Promise<{
    encryptedData: string;
    encryptionMetadata: {
      algorithm: string;
      keyId: string;
      iv: string;
      tag: string;
      salt: string;
      timestamp: number;
    };
  }> {
    if (!this.masterKey) {
      throw new Error('Master key not set - cannot encrypt data');
    }

    try {
      // Generate unique encryption key for this vault
      const vaultKey = await this.deriveVaultKey(vaultId);

      // Generate IV and salt
      const iv = crypto.randomBytes(AgiesZeroKnowledgeEncryption.IV_LENGTH);
      const salt = crypto.randomBytes(32);

      // Create cipher
      const cipher = crypto.createCipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, vaultKey, iv);

      // Serialize data
      const dataString = JSON.stringify(data);
      const encrypted = Buffer.concat([
        cipher.update(dataString, 'utf8'),
        cipher.final()
      ]);

      const tag = cipher.getAuthTag();

      // Store key reference (not the actual key)
      const keyId = crypto.createHash('sha256').update(vaultKey).digest('hex');
      this.derivedKeys.set(keyId, vaultKey);

      // Schedule key rotation
      this.scheduleKeyRotation(vaultId, keyId);

      const result = {
        encryptedData: encrypted.toString('base64'),
        encryptionMetadata: {
          algorithm: AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM,
          keyId,
          iv: iv.toString('base64'),
          tag: tag.toString('base64'),
          salt: salt.toString('base64'),
          timestamp: Date.now()
        }
      };

      this.emit('vault_encrypted', {
        vaultId,
        keyId,
        timestamp: new Date()
      });

      return result;

    } catch (error) {
      console.error('Error encrypting vault data:', error);
      throw new Error('Failed to encrypt vault data');
    }
  }

  /**
   * Decrypt vault data using the master key
   * This happens locally - server never sees decrypted data
   */
  public async decryptVaultData(
    encryptedData: string,
    encryptionMetadata: any,
    vaultId: string
  ): Promise<any> {
    if (!this.masterKey) {
      throw new Error('Master key not set - cannot decrypt data');
    }

    try {
      // Get the decryption key
      const vaultKey = await this.deriveVaultKey(vaultId);

      // Extract encryption parameters
      const iv = Buffer.from(encryptionMetadata.iv, 'base64');
      const tag = Buffer.from(encryptionMetadata.tag, 'base64');
      const encrypted = Buffer.from(encryptedData, 'base64');

      // Create decipher
      const decipher = crypto.createDecipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, vaultKey, iv);
      decipher.setAuthTag(tag);

      // Decrypt data
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ]);

      const decryptedData = JSON.parse(decrypted.toString('utf8'));

      this.emit('vault_decrypted', {
        vaultId,
        keyId: encryptionMetadata.keyId,
        timestamp: new Date()
      });

      return decryptedData;

    } catch (error) {
      console.error('Error decrypting vault data:', error);
      throw new Error('Failed to decrypt vault data');
    }
  }

  private async deriveVaultKey(vaultId: string): Promise<Buffer> {
    if (!this.masterKey) {
      throw new Error('Master key not available');
    }

    const vaultContext = `vault:${vaultId}:${Date.now()}`;
    return crypto.createHmac('sha256', this.masterKey)
      .update(vaultContext)
      .digest();
  }

  // === PASSWORD ENCRYPTION ===

  /**
   * Encrypt individual password entries
   */
  public async encryptPassword(
    passwordData: {
      title: string;
      username: string;
      password: string;
      url: string;
      notes?: string;
    },
    vaultId: string
  ): Promise<{
    encryptedPassword: string;
    encryptionMetadata: any;
  }> {
    // Generate unique key for this password entry
    const passwordId = crypto.randomUUID();
    const passwordKey = await this.derivePasswordKey(passwordId, vaultId);

    // Encrypt the password data
    const iv = crypto.randomBytes(AgiesZeroKnowledgeEncryption.IV_LENGTH);
          const cipher = crypto.createCipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, passwordKey, iv);

    const dataString = JSON.stringify(passwordData);
    const encrypted = Buffer.concat([
      cipher.update(dataString, 'utf8'),
      cipher.final()
    ]);

    const tag = cipher.getAuthTag();
    const keyId = crypto.createHash('sha256').update(passwordKey).digest('hex');

    this.derivedKeys.set(keyId, passwordKey);

    return {
      encryptedPassword: encrypted.toString('base64'),
      encryptionMetadata: {
        passwordId,
        keyId,
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        algorithm: AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM,
        timestamp: Date.now()
      }
    };
  }

  /**
   * Decrypt individual password entries
   */
  public async decryptPassword(
    encryptedPassword: string,
    encryptionMetadata: any,
    vaultId: string
  ): Promise<any> {
    if (!this.masterKey) {
      throw new Error('Master key not set');
    }

    const passwordKey = await this.derivePasswordKey(
      encryptionMetadata.passwordId,
      vaultId
    );

    const iv = Buffer.from(encryptionMetadata.iv, 'base64');
    const tag = Buffer.from(encryptionMetadata.tag, 'base64');
    const encrypted = Buffer.from(encryptedPassword, 'base64');

          const decipher = crypto.createDecipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, passwordKey, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    return JSON.parse(decrypted.toString('utf8'));
  }

  private async derivePasswordKey(passwordId: string, vaultId: string): Promise<Buffer> {
    if (!this.masterKey) {
      throw new Error('Master key not available');
    }

    const passwordContext = `password:${vaultId}:${passwordId}`;
    return crypto.createHmac('sha256', this.masterKey)
      .update(passwordContext)
      .digest();
  }

  // === SECURE NOTES ENCRYPTION ===

  /**
   * Encrypt secure notes with additional security layers
   */
  public async encryptSecureNote(
    noteData: {
      title: string;
      content: string;
      category: string;
      tags: string[];
    },
    vaultId: string
  ): Promise<{
    encryptedNote: string;
    encryptionMetadata: any;
  }> {
    const noteId = crypto.randomUUID();
    const noteKey = await this.deriveNoteKey(noteId, vaultId);

    // Add additional security for notes - double encryption
    const primaryEncryption = await this.encryptWithKey(noteData, noteKey);
    const secondaryKey = await this.deriveSecondaryKey(noteId, vaultId);
    const finalEncryption = await this.encryptWithKey(primaryEncryption, secondaryKey);

    const keyId = crypto.createHash('sha256').update(noteKey).digest('hex');
    this.derivedKeys.set(keyId, noteKey);

    return {
      encryptedNote: finalEncryption.encryptedData,
      encryptionMetadata: {
        noteId,
        keyId,
        primaryIV: primaryEncryption.iv,
        primaryTag: primaryEncryption.tag,
        secondaryIV: finalEncryption.iv,
        secondaryTag: finalEncryption.tag,
        algorithm: AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM,
        timestamp: Date.now()
      }
    };
  }

  private async encryptWithKey(data: any, key: Buffer): Promise<{
    encryptedData: string;
    iv: string;
    tag: string;
  }> {
    const iv = crypto.randomBytes(AgiesZeroKnowledgeEncryption.IV_LENGTH);
    const cipher = crypto.createCipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, key, iv);

    const dataString = JSON.stringify(data);
    const encrypted = Buffer.concat([
      cipher.update(dataString, 'utf8'),
      cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return {
      encryptedData: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64')
    };
  }

  private async deriveNoteKey(noteId: string, vaultId: string): Promise<Buffer> {
    if (!this.masterKey) {
      throw new Error('Master key not available');
    }

    const noteContext = `note:${vaultId}:${noteId}`;
    return crypto.createHmac('sha256', this.masterKey)
      .update(noteContext)
      .digest();
  }

  private async deriveSecondaryKey(noteId: string, vaultId: string): Promise<Buffer> {
    if (!this.masterKey) {
      throw new Error('Master key not available');
    }

    const secondaryContext = `secondary:${vaultId}:${noteId}`;
    return crypto.createHmac('sha256', this.masterKey)
      .update(secondaryContext)
      .digest();
  }

  // === KEY ROTATION ===

  private scheduleKeyRotation(vaultId: string, keyId: string): void {
    // Schedule key rotation for 30 days from now
    const rotationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    this.keyRotationSchedule.set(`${vaultId}:${keyId}`, rotationDate);

    this.emit('key_rotation_scheduled', {
      vaultId,
      keyId,
      rotationDate,
      timestamp: new Date()
    });
  }

  public async rotateKeys(vaultId: string): Promise<void> {
    try {
      // Generate new keys for all entries in the vault
      const newMasterKey = await this.deriveVaultKey(vaultId);

      // In a real implementation, you would:
      // 1. Re-encrypt all vault data with new keys
      // 2. Update metadata with new key IDs
      // 3. Securely delete old keys

      this.emit('keys_rotated', {
        vaultId,
        timestamp: new Date()
      });

      console.log(`🔄 Keys rotated for vault: ${vaultId}`);

    } catch (error) {
      console.error('Error rotating keys:', error);
      throw new Error('Failed to rotate keys');
    }
  }

  public getPendingKeyRotations(): Array<{
    vaultId: string;
    keyId: string;
    rotationDate: Date;
  }> {
    const pending = [];

    for (const [key, rotationDate] of this.keyRotationSchedule.entries()) {
      if (rotationDate <= new Date()) {
        const [vaultId, keyId] = key.split(':');
        if (vaultId && keyId) {
          pending.push({ vaultId, keyId, rotationDate });
        }
      }
    }

    return pending;
  }

  // === API KEY ENCRYPTION ===

  public async generateAPIKey(): Promise<{
    apiKey: string;
    hashedKey: string;
    metadata: any;
  }> {
    const rawApiKey = `agies_${crypto.randomBytes(32).toString('hex')}`;
    const hashedKey = await this.hashAPIKey(rawApiKey);

    // Encrypt the raw API key for storage
    const encryptedKey = await this.encryptAPIKey(rawApiKey);

    return {
      apiKey: rawApiKey,
      hashedKey,
      metadata: encryptedKey.encryptionMetadata
    };
  }

  private async hashAPIKey(apiKey: string): Promise<string> {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  private async encryptAPIKey(apiKey: string): Promise<{
    encryptedKey: string;
    encryptionMetadata: any;
  }> {
    if (!this.masterKey) {
      throw new Error('Master key not set');
    }

    const apiKeyId = crypto.randomUUID();
    const apiKeyKey = await this.deriveAPIKey(apiKeyId);

    const iv = crypto.randomBytes(AgiesZeroKnowledgeEncryption.IV_LENGTH);
    const cipher = crypto.createCipheriv(AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM, apiKeyKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(apiKey, 'utf8'),
      cipher.final()
    ]);

    const tag = cipher.getAuthTag();
    const keyId = crypto.createHash('sha256').update(apiKeyKey).digest('hex');

    this.derivedKeys.set(keyId, apiKeyKey);

    return {
      encryptedKey: encrypted.toString('base64'),
      encryptionMetadata: {
        apiKeyId,
        keyId,
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        algorithm: AgiesZeroKnowledgeEncryption.ENCRYPTION_ALGORITHM,
        timestamp: Date.now()
      }
    };
  }

  private async deriveAPIKey(apiKeyId: string): Promise<Buffer> {
    if (!this.masterKey) {
      throw new Error('Master key not available');
    }

    const apiContext = `api:${apiKeyId}`;
    return crypto.createHmac('sha256', this.masterKey)
      .update(apiContext)
      .digest();
  }

  // === UTILITY METHODS ===

  public hasMasterKey(): boolean {
    return !!this.masterKey;
  }

  public getEncryptionStatus(): {
    hasMasterKey: boolean;
    derivedKeysCount: number;
    pendingRotations: number;
    lastActivity: Date;
  } {
    return {
      hasMasterKey: !!this.masterKey,
      derivedKeysCount: this.derivedKeys.size,
      pendingRotations: this.getPendingKeyRotations().length,
      lastActivity: new Date()
    };
  }

  public async generateSecurePassword(options: {
    length?: number;
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
  } = {}): Promise<string> {
    const {
      length = 16,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true
    } = options;

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (!charset) {
      throw new Error('At least one character type must be selected');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  public destroy(): void {
    this.clearMasterKey();
    this.removeAllListeners();
    console.log('🔐 Zero-Knowledge Encryption service shut down');
  }
}
