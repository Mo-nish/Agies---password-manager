import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { pgPool, redisClient, testConnections, closeConnections } from '../config/database.js';

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// Use process.cwd() instead of __dirname for simplicity
const PROJECT_ROOT = process.cwd();

const app = express();
const PORT = process.env.PORT || 3002;

// Database connection status
let dbConnected = false;

// Security middleware with adjusted CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  }
}));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3002',
    'chrome-extension://*',
    'moz-extension://*',
    'null' // For file:// protocol (Chrome extension testing)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Root route - redirect to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login page route
app.get('/login', (req, res) => {
  res.sendFile('/Users/monishreddy/Documents/MayaVault/public/login.html');
});

// Dashboard page route
app.get('/dashboard', (req, res) => {
  res.sendFile('/Users/monishreddy/Documents/MayaVault/public/dashboard.html');
});

// Vault management page route
app.get('/vaults', (req, res) => {
  res.sendFile('/Users/monishreddy/Documents/MayaVault/public/vaults.html');
});

// Security page route
app.get('/security', (req, res) => {
  res.sendFile('/Users/monishreddy/Documents/MayaVault/public/security.html');
});

// Serve static files (AFTER specific routes, BEFORE catch-all)
app.use(express.static('public'));
app.use('/dist', express.static('dist'));

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Find user by token (simplified - in real app, validate JWT properly)
    let userId = null;
    for (const [id, tokens] of userTokens.entries()) {
      if (tokens.includes(token)) {
        userId = id;
        break;
      }
    }

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add user info to request
    req.user = { id: userId };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Handle preflight requests
app.options('*', cors());

// 🛡️ PADHMA VYUHAM SECURITY SYSTEM 🛡️

// Security Layer Configuration
interface SecurityLayer {
  id: string;
  name: string;
  encryptionLevel: 'basic' | 'advanced' | 'military' | 'quantum';
  honeypotCount: number;
  decoyDataCount: number;
  isActive: boolean;
  lastRotation: Date;
  rotationInterval: number; // minutes
}

interface UserSecurityProfile {
  userId: string;
  layers: SecurityLayer[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAttack: Date | null;
  attackCount: number;
  aiGuardianActive: boolean;
  mazeConfiguration: {
    layerCount: number;
    rotationSpeed: number;
    honeypotRatio: number;
  };
}

// Database integration (coming soon - using in-memory for now)

// Utility function for generating secure codes
function generateSecureCode(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

// In-memory storage (fallback)
const users = new Map();
const userSecurityProfiles = new Map();
const attackAttempts = new Map();
const securityEvents = new Map();

// In-memory storage for vaults and passwords
const userVaults = new Map();
const userPasswords = new Map();

// In-memory storage for user tokens
const userTokens = new Map();

// Initialize default vaults for new user
function initializeUserVaults(userId: string): void {
  const defaultVaults = [
    {
      id: crypto.randomUUID(),
      name: 'Personal Vault',
      description: 'Your personal passwords and secure notes',
      is_default: true,
      password_count: 0,
      created_at: new Date().toISOString()
    }
  ];
  
  userVaults.set(userId, defaultVaults);
  userPasswords.set(userId, new Map());
}

// Initialize security profile for new user
function initializeUserSecurityProfile(userId: string): UserSecurityProfile {
  const baseLayers: SecurityLayer[] = [
    {
      id: crypto.randomUUID(),
      name: 'Outer Perimeter',
      encryptionLevel: 'basic',
      honeypotCount: 3,
      decoyDataCount: 5,
      isActive: true,
      lastRotation: new Date(),
      rotationInterval: 30
    },
    {
      id: crypto.randomUUID(),
      name: 'Middle Defense',
      encryptionLevel: 'advanced',
      honeypotCount: 5,
      decoyDataCount: 8,
      isActive: true,
      lastRotation: new Date(),
      rotationInterval: 20
    },
    {
      id: crypto.randomUUID(),
      name: 'Inner Sanctum',
      encryptionLevel: 'military',
      honeypotCount: 7,
      decoyDataCount: 12,
      isActive: true,
      lastRotation: new Date(),
      rotationInterval: 15
    },
    {
      id: crypto.randomUUID(),
      name: 'Core Vault',
      encryptionLevel: 'quantum',
      honeypotCount: 10,
      decoyDataCount: 20,
      isActive: true,
      lastRotation: new Date(),
      rotationInterval: 10
    }
  ];

  return {
    userId,
    layers: baseLayers,
    threatLevel: 'low',
    lastAttack: null,
    attackCount: 0,
    aiGuardianActive: true,
    mazeConfiguration: {
      layerCount: 4,
      rotationSpeed: 1,
      honeypotRatio: 0.3
    }
  };
}

// AI Guardian - Adaptive Security Response
function aiGuardianResponse(userId: string, attackType: string): void {
  const profile = userSecurityProfiles.get(userId);
  if (!profile) return;

  // Increase threat level
  if (profile.threatLevel === 'low') profile.threatLevel = 'medium';
  else if (profile.threatLevel === 'medium') profile.threatLevel = 'high';
  else if (profile.threatLevel === 'high') profile.threatLevel = 'critical';

  // Adaptive response based on attack type
  switch (attackType) {
    case 'brute_force':
      // Increase rotation speed
      profile.mazeConfiguration.rotationSpeed = Math.min(profile.mazeConfiguration.rotationSpeed * 1.5, 5);
      break;
    case 'sql_injection':
      // Add more honeypots
      profile.mazeConfiguration.honeypotRatio = Math.min(profile.mazeConfiguration.honeypotRatio * 1.3, 0.8);
      break;
    case 'xss':
      // Activate additional layers
      if (profile.layers.length < 6) {
        profile.layers.push({
          id: crypto.randomUUID(),
          name: `Emergency Layer ${profile.layers.length + 1}`,
          encryptionLevel: 'quantum',
          honeypotCount: 15,
          decoyDataCount: 25,
          isActive: true,
          lastRotation: new Date(),
          rotationInterval: 5
        });
      }
      break;
  }

  // Log security event
  const eventId = crypto.randomUUID();
  securityEvents.set(eventId, {
    id: eventId,
    userId,
    type: 'ai_response',
    description: `AI Guardian activated: ${attackType} detected`,
    timestamp: new Date(),
    severity: profile.threatLevel,
    action: 'adaptive_defense_activated'
  });
}

// Authentication endpoints
app.post('/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create user
    const user = {
      id: crypto.randomUUID(),
      email,
      username,
      createdAt: new Date().toISOString()
    };
    
    users.set(email, user);
    
    // 🛡️ Initialize Padhma Vyuham Security Profile
    const securityProfile = initializeUserSecurityProfile(user.id);
    userSecurityProfiles.set(user.id, securityProfile);
    
    console.log(`🛡️ Security Profile initialized for user: ${username}`);
    console.log(`🔒 Layers: ${securityProfile.layers.length}, Honeypots: ${securityProfile.layers.reduce((sum, layer) => sum + layer.honeypotCount, 0)}`);
    
    return res.status(201).json({ 
      message: 'User created successfully with Padhma Vyuham Security',
      user: { id: user.id, email: user.email, username: user.username },
      security: {
        layers: securityProfile.layers.length,
        threatLevel: securityProfile.threatLevel,
        aiGuardian: securityProfile.aiGuardianActive
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!users.has(email)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users.get(email);
    const securityProfile = userSecurityProfiles.get(user.id);
    
    // Simple token generation (in production, use JWT)
    const token = crypto.randomBytes(32).toString('hex');
    
    // 🛡️ Log successful login
    const eventId = crypto.randomUUID();
    securityEvents.set(eventId, {
      id: eventId,
      userId: user.id,
      type: 'login_success',
      description: `Successful login from ${req.ip || 'unknown'}`,
      timestamp: new Date(),
      severity: 'low',
      action: 'access_granted'
    });
    
    return res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
      security: {
        layers: securityProfile?.layers.length || 0,
        threatLevel: securityProfile?.threatLevel || 'low',
        aiGuardian: securityProfile?.aiGuardianActive || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 🛡️ Security Status Endpoint
app.get('/security/status', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    // In production, validate JWT token here
    
    // For now, return basic security status
    return res.json({
      status: 'authenticated',
      security: {
        message: '🛡️ Padhma Vyuham Security Active',
        layers: 4,
        threatLevel: 'low',
        aiGuardian: true
      }
    });
  } catch (error) {
    console.error('Security status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 🛡️ User Security Profile Endpoint
app.get('/security/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const profile = userSecurityProfiles.get(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Security profile not found' });
    }
    
    return res.json({
      userId,
      layers: profile.layers.map((layer: SecurityLayer) => ({
        id: layer.id,
        name: layer.name,
        encryptionLevel: layer.encryptionLevel,
        honeypotCount: layer.honeypotCount,
        decoyDataCount: layer.decoyDataCount,
        isActive: layer.isActive,
        lastRotation: layer.lastRotation
      })),
      threatLevel: profile.threatLevel,
      attackCount: profile.attackCount,
      aiGuardian: profile.aiGuardianActive,
      mazeConfiguration: profile.mazeConfiguration
    });
  } catch (error) {
    console.error('Security profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 🛡️ Security Events Endpoint
app.get('/security/events/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const events = Array.from(securityEvents.values())
      .filter(event => event.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50); // Last 50 events
    
    return res.json({
      userId,
      events,
      totalEvents: events.length
    });
  } catch (error) {
    console.error('Security events error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Padhma Vyuham Security Vault (Simple)',
    timestamp: new Date().toISOString(),
    users: users.size,
    securityProfiles: userSecurityProfiles.size,
    database: { status: 'in-memory mode' }
  });
});

// Production API Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, masterKey } = req.body;

    // Validate input
    if (!email || !username || !password || !masterKey) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    if (masterKey.length < 12) {
      return res.status(400).json({ error: 'Master key must be at least 12 characters long' });
    }

    // For now, use in-memory storage (will be replaced with database)
    const userId = generateSecureCode(16);
    const user = {
      id: userId,
      email,
      username,
      password: await bcrypt.hash(password, 12),
      masterKey: await bcrypt.hash(masterKey, 12),
      createdAt: new Date().toISOString()
    };

    users.set(userId, user);
    initializeUserSecurityProfile(userId);
    initializeUserVaults(userId);

    return res.status(201).json({
      message: 'User created successfully with Padhma Vyuham Security',
      user: { id: user.id, email: user.email, username: user.username },
      token: generateSecureCode(32)
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, masterKey } = req.body;

    // Validate input
    if (!email || !password || !masterKey) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find user by email
    let foundUser = null;
    for (const [userId, user] of users) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password and master key
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    const isValidMasterKey = await bcrypt.compare(masterKey, foundUser.masterKey);

    if (!isValidPassword || !isValidMasterKey) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and store token
    const token = generateSecureCode(32);
    userTokens.set(foundUser.id, token);

    return res.json({
      message: 'Login successful',
      user: { id: foundUser.id, email: foundUser.email, username: foundUser.username },
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ error: 'Login failed' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Security test endpoint
app.post('/security/test', async (req, res) => {
  try {
    const { ipAddress, userAgent, attackType, payload } = req.body;

    const attackData = {
      ipAddress: ipAddress || req.ip || 'unknown',
      userAgent: userAgent || req.get('User-Agent') || 'unknown',
      attackType: attackType || 'unknown',
      payload
    };

    // Simple threat analysis
    let threatLevel = 'low';
    let action = 'allow';
    let confidence = 0.5;
    let reasoning = 'Normal request';

    if (attackType === 'sql_injection') {
      threatLevel = 'high';
      action = 'block';
      confidence = 0.9;
      reasoning = 'SQL injection detected';
    } else if (attackType === 'xss') {
      threatLevel = 'high';
      action = 'honeypot';
      confidence = 0.8;
      reasoning = 'XSS attack detected';
    } else if (attackType === 'brute_force') {
      threatLevel = 'medium';
      action = 'trap';
      confidence = 0.7;
      reasoning = 'Brute force attempt detected';
    }

    const mazeResult = {
      allowed: action !== 'block',
      mazeLayer: 0,
      honeypotTriggered: action === 'honeypot',
      trapActivated: action === 'trap',
      response: { 
        action, 
        threatLevel, 
        message: `Request ${action === 'block' ? 'blocked' : 'processed'}`
      }
    };

    const aiAnalysis = {
      action,
      confidence,
      reasoning,
      newMazeConfiguration: undefined
    };

    res.json({
      mazeResult,
      aiAnalysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Security test error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Security profile endpoint for Chrome extension
app.get('/api/security/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    // For now, return a mock security profile (will integrate with real auth later)
    return res.json({
      profile: {
        userId: 'demo-user',
        securityLevel: 'maximum',
        layers: [
          { name: 'Outer Perimeter', status: 'active' },
          { name: 'Middle Defense', status: 'active' },
          { name: 'Inner Sanctum', status: 'active' },
          { name: 'Core Vault', status: 'active' }
        ],
        threatLevel: 'low',
        aiGuardian: true,
        honeypots: 25
      }
    });
  } catch (error) {
    console.error('Get security profile error:', error);
    return res.status(500).json({ error: 'Failed to get security profile' });
  }
});

// Generate API key for Chrome extension
app.post('/api/security/api-key', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    // Generate a secure API key
    const apiKey = generateSecureCode(32);
    const keyName = req.body.keyName || 'Chrome Extension';
    
    return res.json({
      message: 'API key generated successfully',
      apiKey: apiKey,
      keyName: keyName,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error('Generate API key error:', error);
    return res.status(500).json({ error: 'Failed to generate API key' });
  }
});

// Vault endpoints for Chrome extension
app.get('/api/vaults', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const userVaultsList = userVaults.get(userId) || [];
    
    return res.json({
      vaults: userVaultsList
    });
  } catch (error) {
    console.error('Get vaults error:', error);
    return res.status(500).json({ error: 'Failed to get vaults' });
  }
});

app.post('/api/vaults', authenticateToken, async (req, res) => {
    try {
    const userId = req.user?.id;
    const { name, description, is_default } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Vault name is required' });
    }

    // Create new vault
    const newVault = {
      id: generateSecureCode(16),
      name,
      description: description || '',
      is_default: is_default || false,
      password_count: 0,
      created_at: new Date().toISOString()
    };

    // Add vault to user's vaults
    const userVaultsList = userVaults.get(userId) || [];
    userVaultsList.push(newVault);
    userVaults.set(userId, userVaultsList);

    return res.status(201).json({
      message: 'Vault created successfully',
      vault: newVault
    });
  } catch (error) {
    console.error('Create vault error:', error);
    return res.status(500).json({ error: 'Failed to create vault' });
  }
});

app.post('/api/vaults/:vaultId/passwords', async (req, res) => {
  try {
    console.log('🔐 Password creation request received');
    console.log('🔐 Vault ID:', req.params.vaultId);
    console.log('🔐 Request body:', req.body);
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const { vaultId } = req.params;
    const { title, username, password, url, notes } = req.body;

    if (!title || !username || !password) {
      return res.status(400).json({ error: 'Title, username, and password are required' });
    }

    // Find user by token (simplified - in real app, validate token properly)
    let userId = null;
    for (const [uid, user] of users) {
      // Check if this user has this token
      const userToken = userTokens.get(uid);
      if (userToken === token) {
        userId = uid;
        break;
      }
    }
    
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Create new password
    const newPassword = {
      id: generateSecureCode(16),
      title,
      username,
      password,
      url: url || null,
      notes: notes || null,
      created_at: new Date().toISOString()
    };

    // Store password for user
    const userPasswordsMap = userPasswords.get(userId) || new Map();
    userPasswordsMap.set(newPassword.id, newPassword);
    userPasswords.set(userId, userPasswordsMap);

    // Update vault password count
    const userVaultsList = userVaults.get(userId) || [];
    const vaultIndex = userVaultsList.findIndex((v: any) => v.id === vaultId);
    if (vaultIndex !== -1) {
      userVaultsList[vaultIndex].password_count = (userVaultsList[vaultIndex].password_count || 0) + 1;
      userVaults.set(userId, userVaultsList);
    }

    return res.status(201).json({
      message: 'Password added successfully',
      password: newPassword
    });
  } catch (error) {
    console.error('Add password error:', error);
    return res.status(500).json({ error: 'Failed to add password' });
  }
});

// Get passwords for a specific vault
app.get('/api/vaults/:vaultId/passwords', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const { vaultId } = req.params;

    // Find user by token (simplified - in real app, validate token properly)
    let userId = null;
    for (const [uid, user] of users) {
      // Check if this user has this token
      const userToken = userTokens.get(uid);
      if (userToken === token) {
        userId = uid;
        break;
      }
    }
    
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's passwords
    const userPasswordsMap = userPasswords.get(userId) || new Map();
    const passwords = Array.from(userPasswordsMap.values());

    return res.json({
      passwords: passwords
    });
  } catch (error) {
    console.error('Get passwords error:', error);
    return res.status(500).json({ error: 'Failed to get passwords' });
  }
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});

// Serve the main application for all routes (SPA)
app.get('*', (req, res) => {
  const publicPath = path.join(process.cwd(), 'public', 'index.html');
  res.sendFile(publicPath);
});

// Start server with database initialization
async function startServer() {
  try {
    // Test database connections
    console.log('🔌 Testing database connections...');
    dbConnected = await testConnections();
    
    if (dbConnected) {
      console.log('✅ Database connections successful');
    } else {
      console.log('⚠️ Database connections failed, using in-memory fallback');
    }
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🛡️ Agies Security Vault running on port ${PORT}`);
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`🔒 Health: http://localhost:${PORT}/health`);
      console.log(`📊 Security: http://localhost:${PORT}/security/test`);
      console.log(`🗄️ Database: ${dbConnected ? 'Connected' : 'In-Memory Fallback'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
async function gracefulShutdown() {
  console.log('🔄 Shutting down gracefully...');
  
  if (dbConnected) {
    await closeConnections();
  }
  
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
