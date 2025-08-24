# 🚀 Agies Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying Agies - The Maze Vault Password Manager to production with all security features enabled.

## 🛡️ Security Features in Production

### Core Security Systems
- **Chakravyuham Maze Engine**: 7-layer security system inspired by ancient wisdom
- **Adaptive AI Guardian**: Machine learning-based threat detection and response
- **Dark Web Monitoring**: Real-time credential breach detection
- **Zero-Knowledge Encryption**: Client-side encryption with server never seeing plaintext
- **One-Way Entry Principle**: Data can enter but cannot leave without strict verification

### Production Security Checklist
- [ ] SSL/TLS certificates configured
- [ ] Database encrypted at rest
- [ ] API rate limiting enabled
- [ ] Security headers configured
- [ ] Regular security updates scheduled
- [ ] Backup encryption enabled
- [ ] Audit logging configured

## 📋 Prerequisites

### System Requirements
- **Operating System**: Ubuntu 20.04 LTS or later (recommended)
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 20GB available space
- **Network**: Static IP address recommended

### Software Requirements
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+
- Redis 7+
- Nginx (for reverse proxy)
- SSL certificates (Let's Encrypt recommended)

## 🚀 Quick Deployment

### Option 1: Docker Compose (Recommended)

1. **Clone and setup**:
```bash
git clone <your-repo-url>
cd agies
cp .env.example .env.production
```

2. **Configure environment variables**:
```bash
nano .env.production
# Set your production values:
# DATABASE_URL=postgresql://...
# JWT_SECRET=...
# ENCRYPTION_KEY=...
# API keys for dark web monitoring
```

3. **Deploy with Docker Compose**:
```bash
# Deploy all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f agies
```

### Option 2: Manual Deployment

1. **Setup PostgreSQL**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb agies
sudo -u postgres psql -c "CREATE USER agies WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE agies TO agies;"
```

2. **Setup Redis**:
```bash
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

3. **Deploy Agies**:
```bash
# Install dependencies
npm ci --production

# Build application
npm run build

# Start production server
NODE_ENV=production PORT=3002 npm start
```

## 🔧 Configuration

### Environment Variables

```bash
# Core Application
NODE_ENV=production
PORT=3002
API_BASE=https://api.agies.com

# Database
DATABASE_URL=postgresql://agies:secure_password@localhost:5432/agies

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-256-bit-jwt-secret
ENCRYPTION_KEY=your-256-bit-encryption-key

# Dark Web Monitoring
HIBP_API_KEY=your_haveibeenpwned_api_key
LEAKCHECK_API_KEY=your_leakcheck_api_key
DEHASHED_API_KEY=your_dehashed_api_key

# Security Features
CHAKRAVYUHAM_ENABLED=true
AI_GUARDIAN_ENABLED=true
DARK_WEB_MONITORING=true
ZERO_KNOWLEDGE=true
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # CSP for Agies
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self' https: wss:; frame-ancestors 'none';" always;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }

    # API rate limiting zone
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
}
```

## 🗄️ Database Setup

### PostgreSQL Configuration

1. **Create database and user**:
```sql
CREATE DATABASE agies;
CREATE USER agies WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE agies TO agies;
```

2. **Initialize schema**:
```bash
psql -U agies -d agies -f database/schema.sql
```

3. **Enable encryption**:
```sql
-- Enable pgcrypto for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Redis Configuration

```bash
# Enable persistence
sudo nano /etc/redis/redis.conf
# Set: appendonly yes

# Restart Redis
sudo systemctl restart redis-server
```

## 🔐 SSL/TLS Setup

### Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Manual SSL Setup

```bash
# Create SSL directory
sudo mkdir -p /etc/nginx/ssl

# Place your certificates
# /etc/nginx/ssl/cert.pem
# /etc/nginx/ssl/key.pem
```

## 📊 Monitoring Setup

### Prometheus Configuration

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'agies'
    static_configs:
      - targets: ['localhost:3002']
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:6379']
```

### Grafana Dashboard

1. Access Grafana at `http://localhost:3000`
2. Default credentials: admin/admin
3. Import the provided dashboard JSON
4. Configure data sources for Prometheus

## 🚨 Security Monitoring

### Log Analysis

```bash
# Monitor security events
tail -f /app/logs/security.log

# Monitor AI Guardian activity
tail -f /app/logs/ai_guardian.log

# Monitor dark web alerts
tail -f /app/logs/dark_web.log
```

### Alert Setup

1. **Email Alerts**:
```bash
# Configure SMTP settings in environment
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ALERT_EMAIL=admin@your-domain.com
```

2. **SMS Alerts** (Optional):
```bash
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
ALERT_PHONE_NUMBER=your_phone_number
```

## 🔄 Backup Strategy

### Automated Backups

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U agies agies > /app/backups/agies_$DATE.sql
gzip /app/backups/agies_$DATE.sql

# Keep only last 7 days
find /app/backups -name "*.gz" -mtime +7 -delete
```

### Encrypted Backups

```bash
# Encrypt backup with GPG
gpg --encrypt --recipient backup@your-domain.com backup.sql

# Decrypt when needed
gpg --decrypt backup.sql.gpg > backup.sql
```

## 🧪 Testing Production Deployment

### Health Checks

```bash
# Application health
curl https://your-domain.com/health

# Database connectivity
curl https://your-domain.com/api/health/database

# Security systems
curl https://your-domain.com/security/status
```

### Security Testing

```bash
# Run security tests
npm run test:security

# Test AI Guardian
curl -X POST https://your-domain.com/security/test/ai

# Test maze engine
curl -X POST https://your-domain.com/security/test/maze
```

### Load Testing

```bash
# Install k6 for load testing
sudo apt install k6

# Run load test
k6 run load_test.js
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U agies -d agies -h localhost
```

2. **Redis Connection Failed**:
```bash
# Check Redis status
sudo systemctl status redis-server

# Test connection
redis-cli ping
```

3. **Application Won't Start**:
```bash
# Check logs
tail -f /app/logs/application.log

# Check environment variables
cat /app/.env

# Check permissions
ls -la /app
```

4. **High Memory Usage**:
```bash
# Monitor memory usage
htop

# Check Node.js memory limit
node --max-old-space-size=4096 dist/index.js
```

### Emergency Procedures

1. **Security Breach Response**:
   - Isolate affected systems
   - Rotate all encryption keys
   - Notify affected users
   - Conduct forensic analysis

2. **Data Recovery**:
   - Restore from encrypted backups
   - Verify backup integrity
   - Test restored data

## 📈 Performance Optimization

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_vaults_user_id ON vaults(user_id);
CREATE INDEX idx_passwords_vault_id ON passwords(vault_id);
CREATE INDEX idx_security_events_timestamp ON security_events(timestamp);
```

### Caching Strategy

```bash
# Redis caching for:
# - User sessions
# - Security configurations
# - AI Guardian patterns
# - Dark web monitoring results
```

### CDN Integration

```bash
# Use CDN for static assets
# Configure Cloudflare or similar
```

## 📞 Support and Maintenance

### Regular Maintenance Tasks

1. **Daily**:
   - Monitor security logs
   - Check system resources
   - Review AI Guardian alerts

2. **Weekly**:
   - Update dependencies
   - Review security patches
   - Test backup restoration

3. **Monthly**:
   - Rotate encryption keys
   - Review access logs
   - Update SSL certificates

4. **Quarterly**:
   - Full security audit
   - Performance review
   - Compliance check

### Getting Help

- **Documentation**: Check this guide and inline code comments
- **Logs**: Review `/app/logs/` for detailed error information
- **Security**: Check `/app/logs/security.log` for security events
- **Monitoring**: Use Grafana dashboard for system metrics

## 🎯 Success Metrics

### Key Performance Indicators

- **Uptime**: 99.9% target
- **Response Time**: < 200ms average
- **Security Events**: < 10 per day (normal operations)
- **User Satisfaction**: > 95%
- **Data Breach Prevention**: 100% (zero tolerance)

### Monitoring Dashboards

1. **Application Health**:
   - Response times
   - Error rates
   - Active users

2. **Security Metrics**:
   - AI Guardian detections
   - Maze engine activations
   - Dark web alerts

3. **System Resources**:
   - CPU usage
   - Memory usage
   - Database connections

---

## 🚀 Launch Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database initialized and optimized
- [ ] Redis configured and tested
- [ ] Nginx configured with security headers
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented
- [ ] Security tests passing
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on security procedures

**Congratulations! Your Agies deployment is ready to revolutionize password management with the power of the Chakravyuham security system! 🌀**

---

*Last updated: January 2024*
*Agies Security Team*
