import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Import services
import { UserService } from '../services/userService';
import { testConnections, healthCheck, closeConnections } from '../config/database';
import { generateSecureCode } from '../services/encryption';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
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
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static('public'));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await healthCheck();
    res.json({
      status: 'healthy',
      service: 'Padhma Vyuham Vault',
      timestamp: new Date().toISOString(),
      database: dbHealth
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      service: 'Padhma Vyuham Vault',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes
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

    const result = await UserService.registerUser({
      email,
      username,
      password,
      masterKey
    });

    return res.status(201).json({
      message: 'User created successfully with Padhma Vyuham Security',
      user: result.user,
      vault: result.vault,
      token: result.token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, masterKey } = req.body;

    // Validate input
    if (!email || !password || !masterKey) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const deviceInfo = {
      userAgent: req.get('User-Agent') || 'unknown',
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown'
    };

    const result = await UserService.loginUser({
      email,
      password,
      masterKey,
      deviceInfo
    });

    return res.json({
      message: 'Login successful',
      user: result.user,
      vaults: result.vaults,
      token: result.token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    await UserService.logoutUser(token);

    return res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Vault management
app.get('/api/vaults', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = await UserService.validateToken(token);
    const vaults = await UserService.getUserVaults(decoded.userId);

    return res.json({ vaults });
  } catch (error) {
    console.error('Get vaults error:', error);
    return res.status(401).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/vaults', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = await UserService.validateToken(token);
    const { name, description, icon, color } = req.body;

    const vault = await UserService.createVault(decoded.userId, {
      name,
      description,
      icon,
      color
    });

    return res.status(201).json({ vault });
  } catch (error) {
    console.error('Create vault error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Password management
app.get('/api/vaults/:vaultId/passwords', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = await UserService.validateToken(token);
    const { vaultId } = req.params;

    const passwords = await UserService.getVaultPasswords(vaultId, decoded.userId);

    return res.json({ passwords });
  } catch (error) {
    console.error('Get passwords error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/vaults/:vaultId/passwords', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = await UserService.validateToken(token);
    const { vaultId } = req.params;
    const passwordData = req.body;

    const password = await UserService.addPassword(vaultId, decoded.userId, passwordData);

    return res.status(201).json({ password });
  } catch (error) {
    console.error('Add password error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Security profile
app.get('/api/security/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = await UserService.validateToken(token);

    const profile = await UserService.getUserSecurityProfile(decoded.userId);

    return res.json({ profile });
  } catch (error) {
    console.error('Get security profile error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// API key generation for Chrome extension
app.post('/api/security/api-key', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = await UserService.validateToken(token);
    const { keyName } = req.body;

    const { apiKey, keyHash } = await UserService.generateAPIKey(decoded.userId, keyName);

    return res.json({ 
      message: 'API key generated successfully',
      apiKey,
      keyName,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    console.error('Generate API key error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// One-time code generation
app.post('/api/security/otp', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = await UserService.validateToken(token);
    const { codeType, expiresInMinutes } = req.body;

    const code = await UserService.generateOTPCode(decoded.userId, codeType, expiresInMinutes);

    return res.json({ 
      message: 'One-time code generated',
      codeType,
      expiresIn: expiresInMinutes || 10
    });
  } catch (error) {
    console.error('Generate OTP error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Chrome extension sync endpoint
app.post('/api/extension/sync', async (req, res) => {
  try {
    const { apiKey, deviceId, data } = req.body;

    // Validate API key
    const keyHash = require('crypto').createHash('sha256').update(apiKey).digest('hex');
    
    // TODO: Implement API key validation and sync logic
    
    return res.json({ 
      message: 'Sync successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Extension sync error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Serve the main application for all routes (SPA)
app.get('*', (req, res) => {
  const publicPath = path.join(process.cwd(), 'public', 'index.html');
  res.sendFile(publicPath);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🛡️ Padhma Vyuham Vault Production Server running on port ${PORT}`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🔒 Health: http://localhost:${PORT}/health`);
  
  // Test database connections
  try {
    await testConnections();
    console.log('✅ Database connections successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Shutting down gracefully...');
  await closeConnections();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Shutting down gracefully...');
  await closeConnections();
  process.exit(0);
});
