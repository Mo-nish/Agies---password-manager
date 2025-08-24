# 🛡️ Padhma Vyuham Security Vault - Setup Guide

## 🌟 Overview
The Padhma Vyuham Security Vault is a next-generation cybersecurity solution inspired by Mahabharata's Chakravyuham. It features a maze-like security architecture where attackers can enter but cannot escape with data.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Git
- Modern web browser

### 1. Clone and Install
```bash
git clone <repository-url>
cd MayaVault
npm install
```

### 2. Start the Backend
```bash
npm run dev:backend
```
The backend will start on `http://localhost:3001`

### 3. Start the Frontend
```bash
npm run dev:frontend
```
The frontend will start on `http://localhost:3000`

### 4. Test the System
```bash
node demo.js
```

## 🏗️ Architecture

### Core Components
- **Maze Engine**: Multi-layer security with shifting encryption zones
- **AI Guardian**: Real-time threat analysis and adaptive responses
- **Honeypot System**: Fake vaults to trap attackers
- **Trap System**: Various security measures to neutralize threats

### Security Layers
```
Layer 1: Entry Point (Public Interface)
Layer 2-6: Maze Zones (Shifting Encryption + Traps)
Layer 7: Core Vault (Actual Data Storage)
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Security Levels
The system supports multiple security levels:
- **Basic**: 5 layers, 3 honeypots, complexity 6
- **Standard**: 6 layers, 4 honeypots, complexity 7
- **Advanced**: 7 layers, 5 honeypots, complexity 8
- **Enterprise**: 8+ layers, 6+ honeypots, complexity 9+

## 🧪 Testing

### Security Test Scenarios
The demo script tests:
1. **SQL Injection**: Detected and blocked
2. **XSS Attacks**: Redirected to honeypots
3. **Brute Force**: Trapped and monitored
4. **Normal Requests**: Allowed with monitoring

### API Endpoints
- `GET /health` - System health check
- `POST /security/test` - Test security responses
- `GET /security/status` - Security system status
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /vault/entries` - Create vault entries
- `GET /vault/entries` - Retrieve vault entries

## 🎯 Key Features

### 1. Maze Security
- **Dynamic Shifting**: Configuration changes every 30 seconds
- **Honeypot Deployment**: Fake data to waste attacker time
- **Trap Activation**: Various security measures
- **Layer Isolation**: Each layer operates independently

### 2. AI Guardian
- **Pattern Recognition**: Learns from attack attempts
- **Threat Scoring**: Real-time risk assessment
- **Adaptive Responses**: Tailored security actions
- **Dark Web Monitoring**: Credential compromise detection

### 3. Zero Knowledge Architecture
- **End-to-End Encryption**: Data encrypted at rest and in transit
- **No Backdoor Access**: Even developers cannot access vault contents
- **Multi-Factor Authentication**: Multiple verification methods
- **Hardware Key Support**: Physical security tokens

## 🔒 Security Features

### Encryption
- AES-256-GCM for data at rest
- ChaCha20-Poly1305 for transport
- Custom algorithms for maze layers
- Key rotation every 5-11 minutes

### Authentication
- Bcrypt password hashing (12 rounds)
- JWT tokens with 24-hour expiry
- Rate limiting (100 requests/15min)
- Account lockout after 5 failed attempts

### Monitoring
- Real-time attack detection
- IP reputation tracking
- User behavior analysis
- Security event logging

## 🚨 Emergency Procedures

### Lockdown Mode
```bash
# Emergency shutdown
npm run emergency-lockdown

# Or manually
curl -X POST http://localhost:3001/security/lockdown
```

### Incident Response
1. **Detection**: AI Guardian identifies threat
2. **Analysis**: Pattern recognition and scoring
3. **Response**: Appropriate security action
4. **Adaptation**: Maze configuration shifts
5. **Learning**: System improves from incident

## 📊 Monitoring & Analytics

### Security Dashboard
- Real-time attack statistics
- Threat level indicators
- Maze configuration status
- AI Guardian insights

### Logs & Events
- Security event logging
- Attack attempt tracking
- System performance metrics
- User activity monitoring

## 🔧 Development

### Project Structure
```
src/
├── backend/          # Express server
├── frontend/         # React application
├── core/            # Type definitions
├── security/        # Maze engine
└── ai/              # AI Guardian
```

### Adding New Security Features
1. Extend the `SecurityLevel` interface
2. Implement new maze layers
3. Add AI Guardian patterns
4. Update frontend components

### Testing Security
```bash
# Run security tests
npm run test:security

# Test specific scenarios
npm run test:maze
npm run test:ai
```

## 🌐 Deployment

### Production Setup
1. **Environment**: Set `NODE_ENV=production`
2. **Database**: Configure PostgreSQL/Redis
3. **SSL**: Enable HTTPS with valid certificates
4. **Monitoring**: Set up logging and alerting
5. **Backup**: Regular security and data backups

### Docker Deployment
```bash
# Build image
docker build -t padhma-vyuham .

# Run container
docker run -p 3001:3001 padhma-vyuham
```

### Cloud Deployment
- **AWS**: ECS/Fargate with RDS
- **Azure**: App Service with SQL Database
- **GCP**: Cloud Run with Cloud SQL
- **Kubernetes**: Helm charts available

## 🆘 Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in config
2. **Database connection**: Check connection strings
3. **JWT errors**: Verify secret key
4. **CORS issues**: Update frontend URL

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev:backend

# View security events
curl http://localhost:3001/security/status
```

### Performance Tuning
- Adjust maze shift frequency
- Optimize AI Guardian learning rate
- Configure database connection pools
- Enable response caching

## 📚 Additional Resources

### Documentation
- [API Reference](./API.md)
- [Security Architecture](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

### Support
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Security**: security@padhma-vyuham.com
- **Documentation**: docs.padhma-vyuham.com

## 🎉 Getting Started

1. **Explore**: Navigate the security dashboard
2. **Test**: Run the demo script
3. **Customize**: Adjust security levels
4. **Deploy**: Set up production environment
5. **Monitor**: Watch the AI Guardian in action

Welcome to the future of cybersecurity! 🛡️✨
