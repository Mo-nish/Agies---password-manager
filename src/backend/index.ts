import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AgiesChakravyuhamEngine } from '../security/enhanced-chakravyuham-engine';
import { AgiesAIGuardian } from '../ai/enhanced-ai-guardian';
import { SecurityEvent, AttackAttempt, User, VaultEntry } from '../core/types';
import crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize security components
const mazeEngine = new AgiesChakravyuhamEngine();
const aiGuardian = new AgiesAIGuardian();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security event logging
app.use((req, res, next) => {
  const securityEvent: SecurityEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    eventType: 'intrusion',
    severity: 'info',
    description: `API request: ${req.method} ${req.path}`,
    metadata: {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    },
    ipAddress: req.ip || 'unknown'
  };

  mazeEngine.emit('security_event', securityEvent);
  next();
});

// In-memory storage (replace with database in production)
const users = new Map<string, User>();
const vaultEntries = new Map<string, VaultEntry>();
const sessions = new Map<string, string>();

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'padhma-vyuham-secret-key-2024';

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Padhma Vyuham Security Vault',
    timestamp: new Date().toISOString()
  });
});

// Security status
app.get('/security/status', authenticateToken, (req, res) => {
  const mazeConfig = mazeEngine.getCurrentConfiguration();
  const threatIntel = aiGuardian.getThreatIntelligence();
  const securityEvents = mazeEngine.getSecurityEvents();
  const attackHistory = mazeEngine.getAttackHistory();

  res.json({
    mazeConfiguration: mazeConfig,
    threatIntelligence: threatIntel,
    recentSecurityEvents: securityEvents.slice(-10),
    attackHistory: attackHistory.slice(-20),
    systemHealth: 'operational'
  });
});

// User registration
app.post('/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (users.has(email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = {
      id: crypto.randomUUID(),
      email,
      username,
      hashedPassword,
      salt,
      securityLevel: {
        id: 'basic',
        name: 'Basic Security',
        description: 'Standard security level',
        encryptionStrength: 7,
        mazeDepth: 5,
        honeypotCount: 3,
        trapComplexity: 6
      },
      lastLogin: new Date(),
      failedAttempts: 0
    };

    users.set(email, user);

    return res.status(201).json({ 
      message: 'User registered successfully',
      userId: user.id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
      user.failedAttempts++;
      if (user.failedAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset failed attempts on successful login
    user.failedAttempts = 0;
    user.lastLogin = new Date();

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    sessions.set(token, user.id);

    return res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        securityLevel: user.securityLevel
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create vault entry
app.post('/vault/entries', authenticateToken, async (req, res) => {
  try {
    const { title, data, category, tags, priority, autoRotate, darkWebMonitoring } = req.body;
    const userId = (req as any).user.userId;

    if (!title || !data) {
      return res.status(400).json({ error: 'Title and data are required' });
    }

    // Encrypt the data (simplified - use proper encryption in production)
    const encryptedData = Buffer.from(data).toString('base64');

    const vaultEntry: VaultEntry = {
      id: crypto.randomUUID(),
      userId,
      title,
      encryptedData,
      metadata: {
        category: category || 'general',
        tags: tags || [],
        priority: priority || 'medium',
        autoRotate: autoRotate || false,
        darkWebMonitoring: darkWebMonitoring || false
      },
      securityLevel: {
        id: 'standard',
        name: 'Standard Security',
        description: 'Standard encryption and protection',
        encryptionStrength: 8,
        mazeDepth: 6,
        honeypotCount: 4,
        trapComplexity: 7
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 0,
      lastAccessed: new Date()
    };

    vaultEntries.set(vaultEntry.id, vaultEntry);

    return res.status(201).json({ 
      message: 'Vault entry created successfully',
      entryId: vaultEntry.id 
    });
  } catch (error) {
    console.error('Create vault entry error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vault entries
app.get('/vault/entries', authenticateToken, (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const userEntries = Array.from(vaultEntries.values())
      .filter(entry => entry.userId === userId)
      .map(entry => ({
        id: entry.id,
        title: entry.title,
        metadata: entry.metadata,
        securityLevel: entry.securityLevel,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed
      }));

    return res.json({ entries: userEntries });
  } catch (error) {
    console.error('Get vault entries error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Security testing endpoint (for demonstration)
app.post('/security/test', async (req, res) => {
  try {
    const { ipAddress, userAgent, attackType, payload, target } = req.body;

    const attackData = {
      ipAddress: ipAddress || req.ip,
      userAgent: userAgent || req.get('User-Agent') || 'unknown',
      attackType: attackType || 'unknown',
      target: target || 'unknown',
      payload
    };

    // Process through maze engine
    const mazeResult = await mazeEngine.processEntry(attackData);
    
    // Analyze with AI Guardian
    const aiResponse = await aiGuardian.analyzeThreat({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...attackData,
      target: attackData.target || 'unknown',
      blocked: false,
      mazeLayer: 0,
      honeypotTriggered: false,
      aiResponse: { action: 'redirect', confidence: 0.5, reasoning: 'Initial', newMazeConfiguration: undefined }
    });

    return res.json({
      mazeResult,
      aiAnalysis: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Security test error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Dark web monitoring
app.post('/security/darkweb-monitor', authenticateToken, async (req, res) => {
  try {
    const { credentials } = req.body;
    
    if (!Array.isArray(credentials)) {
      return res.status(400).json({ error: 'Credentials array required' });
    }

    const alerts = await aiGuardian.monitorDarkWeb(credentials);
    
    return res.json({ 
      alerts,
      monitoredCredentials: credentials.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dark web monitoring error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🛡️ Padhma Vyuham Security Vault running on port ${PORT}`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🔒 Health: http://localhost:${PORT}/health`);
  console.log(`📊 Security: http://localhost:${PORT}/security/status`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Shutting down gracefully...');
  mazeEngine.destroy();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 Shutting down gracefully...');
  mazeEngine.destroy();
  process.exit(0);
});
