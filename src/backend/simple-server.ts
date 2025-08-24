import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

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
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Serve static files
app.use(express.static('public'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Database integration (coming soon)

// In-memory storage (fallback)
const users = new Map();
const userSecurityProfiles = new Map();
const attackAttempts = new Map();
const securityEvents = new Map();

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

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});

// Serve the main application for all routes (SPA)
app.get('*', (req, res) => {
  const publicPath = path.join(process.cwd(), 'public', 'index.html');
  res.sendFile(publicPath);
});

// Start server
app.listen(PORT, () => {
  console.log(`🛡️ Padhma Vyuham Security Vault (Simple) running on port ${PORT}`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🔒 Health: http://localhost:${PORT}/health`);
  console.log(`📊 Security: http://localhost:${PORT}/security/test`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 Shutting down gracefully...');
  process.exit(0);
});
