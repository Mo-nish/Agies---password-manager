import { pgPool } from '../config/database';
import { redisClient } from '../config/database';
import { 
  hashPassword, 
  verifyPassword, 
  hashMasterKey, 
  verifyMasterKey,
  generateAPIKey,
  hashAPIKey,
  generateOTPCode,
  generateRecoveryCode,
  generateDeviceFingerprint
} from './encryption';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface User {
  id: string;
  email: string;
  username: string;
  subscription_tier: 'free' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'cancelled' | 'suspended';
  created_at: Date;
  last_login: Date;
  two_factor_enabled: boolean;
  hardware_key_registered: boolean;
}

export interface UserRegistration {
  email: string;
  username: string;
  password: string;
  masterKey: string;
}

export interface UserLogin {
  email: string;
  password: string;
  masterKey: string;
  deviceInfo?: {
    userAgent: string;
    ipAddress: string;
    deviceId?: string;
  };
}

export interface Vault {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Password {
  id: string;
  vault_id: string;
  website: string;
  website_url?: string;
  username: string;
  title?: string;
  notes?: string;
  tags: string[];
  favorite: boolean;
  last_used?: Date;
  created_at: Date;
  updated_at: Date;
}

export class UserService {
  /**
   * Register a new user with Padhma Vyuham security
   */
  static async registerUser(userData: UserRegistration): Promise<{ user: User; token: string; vault: Vault }> {
    const client = await pgPool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [userData.email, userData.username]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password and master key
      const passwordHash = await hashPassword(userData.password);
      const masterKeyHash = await hashMasterKey(userData.masterKey);

      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, username, password_hash, master_key_hash, subscription_tier)
         VALUES ($1, $2, $3, $4, 'free')
         RETURNING id, email, username, subscription_tier, subscription_status, created_at, last_login, two_factor_enabled, hardware_key_registered`,
        [userData.email, userData.username, passwordHash, masterKeyHash]
      );

      const user = userResult.rows[0];

      // Get the default vault that was created by the trigger
      const vaultResult = await client.query(
        'SELECT * FROM vaults WHERE user_id = $1 AND is_default = true',
        [user.id]
      );

      const vault = vaultResult.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, subscription: user.subscription_tier },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Store session in Redis
      await redisClient.setEx(`session:${token}`, 86400, JSON.stringify({
        userId: user.id,
        email: user.email,
        subscription: user.subscription_tier,
        createdAt: new Date().toISOString()
      }));

      // Log security event
      await client.query(
        `INSERT INTO security_events (user_id, event_type, description, severity, action_taken)
         VALUES ($1, 'user_registration', 'New user registered successfully', 'low', 'account_created')`,
        [user.id]
      );

      await client.query('COMMIT');

      return { user, token, vault };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Authenticate user login
   */
  static async loginUser(loginData: UserLogin): Promise<{ user: User; token: string; vaults: Vault[] }> {
    const client = await pgPool.connect();
    
    try {
      // Verify user credentials
      const userResult = await client.query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true',
        [loginData.email]
      );

      if (userResult.rows.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = userResult.rows[0];

      // Verify password
      const isPasswordValid = await verifyPassword(loginData.password, user.password_hash);
      if (!isPasswordValid) {
        await this.logFailedLogin(client, user.id, loginData.deviceInfo);
        throw new Error('Invalid credentials');
      }

      // Verify master key
      const isMasterKeyValid = await verifyMasterKey(loginData.masterKey, user.master_key_hash);
      if (!isMasterKeyValid) {
        await this.logFailedLogin(client, user.id, loginData.deviceInfo);
        throw new Error('Invalid master key');
      }

      // Generate device fingerprint
      const deviceId = loginData.deviceInfo?.deviceId || 
        generateDeviceFingerprint(loginData.deviceInfo?.userAgent || '', loginData.deviceInfo?.ipAddress || '');

      // Update last login
      await client.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Get user vaults
      const vaultsResult = await client.query(
        'SELECT * FROM vaults WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC',
        [user.id]
      );

      const vaults = vaultsResult.rows;

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          subscription: user.subscription_tier,
          deviceId 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Store session in Redis
      await redisClient.setEx(`session:${token}`, 86400, JSON.stringify({
        userId: user.id,
        email: user.email,
        subscription: user.subscription_tier,
        deviceId,
        createdAt: new Date().toISOString()
      }));

      // Log successful login
      await client.query(
        `INSERT INTO security_events (user_id, event_type, description, severity, action_taken, ip_address, user_agent)
         VALUES ($1, 'login_success', 'User logged in successfully', 'low', 'access_granted', $2, $3)`,
        [user.id, loginData.deviceInfo?.ipAddress, loginData.deviceInfo?.userAgent]
      );

      // Update or create browser session
      await client.query(
        `INSERT INTO browser_sessions (user_id, device_id, extension_version, browser_type, os_info, last_sync)
         VALUES ($1, $2, 'web', 'web', 'web', CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, device_id) 
         DO UPDATE SET last_sync = CURRENT_TIMESTAMP, is_active = true`,
        [user.id, deviceId]
      );

      return { user, token, vaults };
    } finally {
      client.release();
    }
  }

  /**
   * Log failed login attempt
   */
  private static async logFailedLogin(client: any, userId: string, deviceInfo?: any): Promise<void> {
    await client.query(
      `INSERT INTO security_events (user_id, event_type, description, severity, action_taken, ip_address, user_agent)
       VALUES ($1, 'login_failed', 'Failed login attempt', 'medium', 'access_denied', $2, $3)`,
      [userId, deviceInfo?.ipAddress, deviceInfo?.userAgent]
    );
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const result = await pgPool.query(
      'SELECT id, email, username, subscription_tier, subscription_status, created_at, last_login, two_factor_enabled, hardware_key_registered FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );

    return result.rows[0] || null;
  }

  /**
   * Get user vaults
   */
  static async getUserVaults(userId: string): Promise<Vault[]> {
    const result = await pgPool.query(
      'SELECT * FROM vaults WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC',
      [userId]
    );

    return result.rows;
  }

  /**
   * Create new vault
   */
  static async createVault(userId: string, vaultData: Partial<Vault>): Promise<Vault> {
    const result = await pgPool.query(
      `INSERT INTO vaults (user_id, name, description, icon, color)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId,
        vaultData.name,
        vaultData.description,
        vaultData.icon || '🔒',
        vaultData.color || '#6366f1'
      ]
    );

    return result.rows[0];
  }

  /**
   * Get vault passwords
   */
  static async getVaultPasswords(vaultId: string, userId: string): Promise<Password[]> {
    const result = await pgPool.query(
      `SELECT p.* FROM passwords p
       JOIN vaults v ON p.vault_id = v.id
       WHERE v.id = $1 AND v.user_id = $2
       ORDER BY p.favorite DESC, p.last_used DESC NULLS LAST, p.created_at DESC`,
      [vaultId, userId]
    );

    return result.rows;
  }

  /**
   * Add password to vault
   */
  static async addPassword(vaultId: string, userId: string, passwordData: Partial<Password>): Promise<Password> {
    // Verify vault ownership
    const vaultResult = await pgPool.query(
      'SELECT id FROM vaults WHERE id = $1 AND user_id = $2',
      [vaultId, userId]
    );

    if (vaultResult.rows.length === 0) {
      throw new Error('Vault not found or access denied');
    }

    const result = await pgPool.query(
      `INSERT INTO passwords (vault_id, website, website_url, username, title, notes, tags, favorite)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        vaultId,
        passwordData.website,
        passwordData.website_url,
        passwordData.username,
        passwordData.title,
        passwordData.notes,
        passwordData.tags || [],
        passwordData.favorite || false
      ]
    );

    return result.rows[0];
  }

  /**
   * Generate API key for Chrome extension
   */
  static async generateAPIKey(userId: string, keyName: string): Promise<{ apiKey: string; keyHash: string }> {
    const apiKey = generateAPIKey();
    const keyHash = hashAPIKey(apiKey);

    await pgPool.query(
      `INSERT INTO api_keys (user_id, key_name, key_hash, permissions, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        keyName,
        keyHash,
        JSON.stringify(['read_passwords', 'write_passwords', 'sync']),
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      ]
    );

    return { apiKey, keyHash };
  }

  /**
   * Generate one-time verification code
   */
  static async generateOTPCode(userId: string, codeType: string, expiresInMinutes: number = 10): Promise<string> {
    const code = generateOTPCode(6);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await pgPool.query(
      `INSERT INTO one_time_codes (user_id, code_type, code_value, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, codeType, code, expiresAt]
    );

    return code;
  }

  /**
   * Verify one-time code
   */
  static async verifyOTPCode(userId: string, code: string, codeType: string): Promise<boolean> {
    const result = await pgPool.query(
      `UPDATE one_time_codes 
       SET used = true, used_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND code_value = $2 AND code_type = $3 
       AND expires_at > CURRENT_TIMESTAMP AND used = false
       RETURNING id`,
      [userId, code, codeType]
    );

    return result.rows.length > 0;
  }

  /**
   * Get user security profile
   */
  static async getUserSecurityProfile(userId: string): Promise<any> {
    const result = await pgPool.query(
      `SELECT sl.*, 
              COUNT(h.id) as actual_honeypot_count,
              COUNT(se.id) as security_event_count
       FROM security_layers sl
       LEFT JOIN honeypots h ON sl.id = h.layer_id AND h.is_active = true
       LEFT JOIN security_events se ON sl.user_id = se.user_id
       WHERE sl.user_id = $1
       GROUP BY sl.id
       ORDER BY sl.layer_order`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Log security event
   */
  static async logSecurityEvent(userId: string, eventData: any): Promise<void> {
    await pgPool.query(
      `INSERT INTO security_events (user_id, event_type, description, severity, action_taken, ip_address, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        userId,
        eventData.type,
        eventData.description,
        eventData.severity || 'low',
        eventData.action,
        eventData.ipAddress,
        eventData.userAgent,
        JSON.stringify(eventData.metadata || {})
      ]
    );
  }

  /**
   * Validate JWT token
   */
  static async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Check if session exists in Redis
      const session = await redisClient.get(`session:${token}`);
      if (!session) {
        throw new Error('Session expired');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Logout user (invalidate session)
   */
  static async logoutUser(token: string): Promise<void> {
    await redisClient.del(`session:${token}`);
  }
}
