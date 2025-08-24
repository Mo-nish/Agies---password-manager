#!/bin/bash

# Agies Password Manager - Production Deployment Script
set -e

echo "🚀 Starting Agies Password Manager Deployment..."

# Configuration
DOMAIN=${DOMAIN:-"agies.com"}
EMAIL=${EMAIL:-"admin@agies.com"}
APP_NAME="agies-password-manager"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    command -v docker >/dev/null 2>&1 || error "Docker is not installed"
    command -v docker-compose >/dev/null 2>&1 || error "Docker Compose is not installed"
    command -v openssl >/dev/null 2>&1 || error "OpenSSL is not installed"
    
    success "Prerequisites check passed"
}

# Generate SSL certificates
generate_ssl() {
    log "Generating SSL certificates..."
    
    mkdir -p ssl
    
    if [ ! -f "ssl/${DOMAIN}.crt" ]; then
        openssl req -x509 -newkey rsa:4096 -keyout "ssl/${DOMAIN}.key" \
                    -out "ssl/${DOMAIN}.crt" -days 365 -nodes \
                    -subj "/C=US/ST=State/L=City/O=Agies/CN=${DOMAIN}"
        
        success "SSL certificates generated"
    else
        success "SSL certificates already exist"
    fi
}

# Generate environment variables
generate_env() {
    log "Generating environment variables..."
    
    if [ ! -f ".env.prod" ]; then
        cat > .env.prod << EOF
# Production Environment Variables
DOMAIN=${DOMAIN}
DB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -base64 32)
NODE_ENV=production

# SSL Configuration
SSL_CERT_PATH=/etc/ssl/certs/${DOMAIN}.crt
SSL_KEY_PATH=/etc/ssl/certs/${DOMAIN}.key

# Security Settings
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
SESSION_TIMEOUT=3600000

# Backup Configuration
BACKUP_RETENTION_DAYS=30
BACKUP_S3_BUCKET=${APP_NAME}-backups
EOF
        success "Environment variables generated"
    else
        success "Environment file already exists"
    fi
}

# Build application
build_app() {
    log "Building application..."
    
    cd ..
    
    # Install dependencies
    npm ci --production
    
    # Build frontend
    npm run build:js
    
    # Build backend
    npm run build:backend
    
    success "Application built successfully"
    cd deploy
}

# Deploy with Docker
deploy_docker() {
    log "Deploying with Docker..."
    
    # Load environment variables
    export $(grep -v '^#' .env.prod | xargs)
    
    # Stop existing containers
    docker-compose -f docker-compose.prod.yml down || true
    
    # Build and start new containers
    docker-compose -f docker-compose.prod.yml up --build -d
    
    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 30
    
    # Health check
    if curl -f "https://${DOMAIN}/health" >/dev/null 2>&1; then
        success "Deployment successful! App is running at https://${DOMAIN}"
    else
        error "Deployment failed - health check failed"
    fi
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create monitoring directory
    mkdir -p monitoring
    
    # Create Prometheus configuration
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'agies-app'
    static_configs:
      - targets: ['agies-app:3002']
    scrape_interval: 5s
    metrics_path: '/metrics'
EOF

    # Create Grafana dashboard
    cat > monitoring/dashboard.json << EOF
{
  "dashboard": {
    "title": "Agies Password Manager",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph", 
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      }
    ]
  }
}
EOF

    success "Monitoring configured"
}

# Setup backup
setup_backup() {
    log "Setting up automated backups..."
    
    mkdir -p backups
    
    # Create backup script
    cat > backups/backup.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
docker exec \$(docker ps -qf "name=postgres") pg_dump -U agies agies_maze_vault > backups/backup_\${DATE}.sql
gzip backups/backup_\${DATE}.sql

# Upload to S3 (if configured)
if [ ! -z "\${AWS_ACCESS_KEY_ID}" ]; then
    aws s3 cp backups/backup_\${DATE}.sql.gz s3://\${BACKUP_S3_BUCKET}/
fi

# Clean old backups
find backups -name "backup_*.sql.gz" -mtime +\${BACKUP_RETENTION_DAYS:-30} -delete
EOF

    chmod +x backups/backup.sh
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/backups/backup.sh") | crontab -
    
    success "Backup configured"
}

# Main deployment process
main() {
    log "🛡️  Agies Password Manager Production Deployment"
    log "Domain: ${DOMAIN}"
    log "Email: ${EMAIL}"
    
    check_prerequisites
    generate_ssl
    generate_env
    build_app
    deploy_docker
    setup_monitoring
    setup_backup
    
    success "🎉 Deployment completed successfully!"
    log "Your Agies Password Manager is now running at:"
    log "🌐 Web App: https://${DOMAIN}"
    log "📊 Health: https://${DOMAIN}/health"
    log "🔒 Security: https://${DOMAIN}/security"
    
    warning "Next steps:"
    echo "1. Configure DNS to point ${DOMAIN} to this server"
    echo "2. Set up proper SSL certificates (Let's Encrypt recommended)"
    echo "3. Configure firewall rules"
    echo "4. Set up monitoring alerts"
    echo "5. Test all functionality"
}

# Run deployment
main "$@"
