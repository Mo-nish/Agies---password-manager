import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const SALT_ROUNDS = 12;
const MASTER_KEY_SALT_ROUNDS = 15;

export class EncryptionService {
  /**
   * Generate a cryptographically secure random key
   */
  static generateRandomKey(length: number = KEY_LENGTH): Buffer {
    return crypto.randomBytes(length);
  }

  /**
   * Generate a cryptographically secure random IV
   */
  static generateIV(): Buffer {
    return crypto.randomBytes(IV_LENGTH);
  }

  /**
   * Generate a secure random string for one-time codes
   */
  static generateSecureCode(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against its hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Hash a master key with higher security
   */
  static async hashMasterKey(masterKey: string): Promise<string> {
    return await bcrypt.hash(masterKey, MASTER_KEY_SALT_ROUNDS);
  }

  /**
   * Verify a master key against its hash
   */
  static async verifyMasterKey(masterKey: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(masterKey, hash);
  }

  /**
   * Derive encryption key from master password and salt
   */
  static deriveKey(masterPassword: string, salt: Buffer, iterations: number = 100000): Buffer {
    return crypto.pbkdf2Sync(masterPassword, salt, iterations, KEY_LENGTH, 'sha256');
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  static encrypt(data: string, key: Buffer): { encrypted: string; iv: string; authTag: string } {
    const iv = this.generateIV();
    const cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, key);
    cipher.setAAD(Buffer.from('padhma-vyuham', 'utf8')); // Additional authenticated data

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: cipher.getAuthTag().toString('hex')
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  static decrypt(encryptedData: string, key: Buffer, iv: string, authTag: string): string {
    const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, key);
    decipher.setAAD(Buffer.from('padhma-vyuham', 'utf8'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Encrypt password data with additional security
   */
  static encryptPassword(password: string, encryptionKey: Buffer): {
    password_encrypted: string;
    password_iv: string;
    auth_tag: string;
  } {
    const result = this.encrypt(password, encryptionKey);
    return {
      password_encrypted: result.encrypted,
      password_iv: result.iv,
      auth_tag: result.authTag
    };
  }

  /**
   * Decrypt password data
   */
  static decryptPassword(
    encryptedPassword: string,
    encryptionKey: Buffer,
    iv: string,
    authTag: string
  ): string {
    return this.decrypt(encryptedPassword, encryptionKey, iv, authTag);
  }

  /**
   * Encrypt secure note content
   */
  static encryptSecureNote(content: string, encryptionKey: Buffer): {
    content_encrypted: string;
    content_iv: string;
    auth_tag: string;
  } {
    const result = this.encrypt(content, encryptionKey);
    return {
      content_encrypted: result.encrypted,
      content_iv: result.iv,
      auth_tag: result.authTag
    };
  }

  /**
   * Decrypt secure note content
   */
  static decryptSecureNote(
    encryptedContent: string,
    encryptionKey: Buffer,
    iv: string,
    authTag: string
  ): string {
    return this.decrypt(encryptedContent, encryptionKey, iv, authTag);
  }

  /**
   * Generate a secure API key
   */
  static generateAPIKey(): string {
    return `pv_${crypto.randomBytes(32).toString('hex')}`;
  }

  /**
   * Hash an API key for storage
   */
  static hashAPIKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  /**
   * Generate a one-time verification code
   */
  static generateOTPCode(length: number = 6): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits[crypto.randomInt(0, digits.length)];
    }
    return code;
  }

  /**
   * Generate a recovery code
   */
  static generateRecoveryCode(): string {
    return crypto.randomBytes(16).toString('hex').toUpperCase().match(/.{4}/g)?.join('-') || '';
  }

  /**
   * Create a secure hash for data integrity
   */
  static createDataHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verify data integrity using hash
   */
  static verifyDataHash(data: string, expectedHash: string): boolean {
    const actualHash = this.createDataHash(data);
    return crypto.timingSafeEqual(
      Buffer.from(actualHash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  }

  /**
   * Generate a secure device fingerprint
   */
  static generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
    const data = `${userAgent}|${ipAddress}|${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Encrypt sensitive metadata
   */
  static encryptMetadata(metadata: object, key: Buffer): {
    encrypted: string;
    iv: string;
    authTag: string;
  } {
    const jsonString = JSON.stringify(metadata);
    return this.encrypt(jsonString, key);
  }

  /**
   * Decrypt sensitive metadata
   */
  static decryptMetadata(
    encryptedMetadata: string,
    key: Buffer,
    iv: string,
    authTag: string
  ): object {
    const decrypted = this.decrypt(encryptedMetadata, key, iv, authTag);
    return JSON.parse(decrypted);
  }
}

// Export utility functions
export const {
  generateRandomKey,
  generateIV,
  generateSecureCode,
  hashPassword,
  verifyPassword,
  hashMasterKey,
  verifyMasterKey,
  deriveKey,
  encrypt,
  decrypt,
  encryptPassword,
  decryptPassword,
  encryptSecureNote,
  decryptSecureNote,
  generateAPIKey,
  hashAPIKey,
  generateOTPCode,
  generateRecoveryCode,
  createDataHash,
  verifyDataHash,
  generateDeviceFingerprint,
  encryptMetadata,
  decryptMetadata
} = EncryptionService;
