#!/bin/bash

# 🚀 Agies Password Manager - Production Deployment Script
# This will deploy the world's next top password manager!

set -e

echo "🌟 Starting Agies Production Deployment..."

# Configuration
APP_NAME="agies-password-manager"
DOMAIN="agies.com"  # Change this to your domain
REGION="nyc1"  # DigitalOcean region
DROPLET_SIZE="s-2vcpu-4gb"  # 2GB RAM, 2 vCPUs
DB_SIZE="db-s-1vcpu-1gb"  # 1GB RAM database

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if doctl is installed
check_doctl() {
    if ! command -v doctl &> /dev/null; then
        print_error "DigitalOcean CLI (doctl) not found. Installing..."
        brew install doctl
        print_success "doctl installed successfully"
    else
        print_success "doctl found"
    fi
}

# Authenticate with DigitalOcean
authenticate_do() {
    print_status "Authenticating with DigitalOcean..."
    if ! doctl account get &> /dev/null; then
        print_warning "Please authenticate with DigitalOcean:"
        doctl auth init
    fi
    print_success "DigitalOcean authentication successful"
}

# Create production server
create_droplet() {
    print_status "Creating production droplet..."
    
    # Create droplet with Docker pre-installed
    DROPLET_ID=$(doctl compute droplet create $APP_NAME \
        --size $DROPLET_SIZE \
        --region $REGION \
        --image docker-20-04 \
        --ssh-keys $(doctl compute ssh-key list --format ID --no-header) \
        --format ID --no-header)
    
    print_status "Waiting for droplet to be ready..."
    sleep 30
    
    # Get droplet IP
    DROPLET_IP=$(doctl compute droplet get $DROPLET_ID --format PublicIPv4 --no-header)
    print_success "Droplet created with IP: $DROPLET_IP"
    
    # Wait for SSH to be available
    print_status "Waiting for SSH to be available..."
    while ! nc -z $DROPLET_IP 22; do
        sleep 5
    done
    
    echo $DROPLET_IP > .droplet_ip
}

# Create managed database
create_database() {
    print_status "Creating managed PostgreSQL database..."
    
    DB_ID=$(doctl databases create $APP_NAME-db \
        --engine pg \
        --version "13" \
        --size $DB_SIZE \
        --region $REGION \
        --format ID --no-header)
    
    print_status "Waiting for database to be ready..."
    sleep 60
    
    # Get database connection details
    DB_HOST=$(doctl databases get $DB_ID --format Host --no-header)
    DB_PORT=$(doctl databases get $DB_ID --format Port --no-header)
    DB_NAME=$(doctl databases get $DB_ID --format Database --no-header)
    DB_USER=$(doctl databases get $DB_ID --format User --no-header)
    
    # Generate secure password
    DB_PASSWORD=$(openssl rand -base64 32)
    
    # Store database credentials
    cat > .db_credentials << EOF
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
EOF
    
    print_success "Database created successfully"
}

# Create Redis database
create_redis() {
    print_status "Creating managed Redis database..."
    
    REDIS_ID=$(doctl databases create $APP_NAME-redis \
        --engine redis \
        --version "6" \
        --size $DB_SIZE \
        --region $REGION \
        --format ID --no-header)
    
    print_status "Waiting for Redis to be ready..."
    sleep 60
    
    # Get Redis connection details
    REDIS_HOST=$(doctl databases get $REDIS_ID --format Host --no-header)
    REDIS_PORT=$(doctl databases get $REDIS_ID --format Port --no-header)
    REDIS_PASSWORD=$(openssl rand -base64 32)
    
    # Store Redis credentials
    cat >> .db_credentials << EOF
REDIS_HOST=$REDIS_HOST
REDIS_PORT=$REDIS_PORT
REDIS_PASSWORD=$REDIS_PASSWORD
EOF
    
    print_success "Redis database created successfully"
}

# Setup production environment
setup_production_env() {
    print_status "Setting up production environment..."
    
    # Create production environment file
    cat > .env.production << EOF
# Production Environment Variables
NODE_ENV=production
PORT=3000

# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# Redis Configuration
REDIS_HOST=$REDIS_HOST
REDIS_PORT=$REDIS_PORT
REDIS_PASSWORD=$REDIS_PASSWORD

# Security
JWT_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -base64 32)
TOTP_SECRET=$(openssl rand -base64 32)

# Analytics
ANALYTICS_ENABLED=true
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# PWA Configuration
PWA_ENABLED=true
PWA_NAME=Agies Password Manager
PWA_SHORT_NAME=Agies
PWA_DESCRIPTION=World's Most Secure Password Manager

# Cloud Backup
BACKUP_ENABLED=true
BACKUP_PROVIDER=aws
AWS_ACCESS_KEY_ID=YOUR_AWS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET
AWS_REGION=us-east-1
BACKUP_BUCKET=agies-backups

# Domain
DOMAIN=$DOMAIN
SSL_ENABLED=true

# Performance
CDN_ENABLED=true
CACHE_ENABLED=true
COMPRESSION_ENABLED=true
EOF
    
    print_success "Production environment configured"
}

# Create production Docker Compose
create_docker_compose() {
    print_status "Creating production Docker Compose configuration..."
    
    cat > docker-compose.production.yml << 'EOF'
version: '3.8'

services:
  # Main Application
  agies-app:
    build:
      context: .
      dockerfile: Dockerfile.production
    container_name: agies-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    networks:
      - agies-network

  # PostgreSQL Database
  postgres:
    image: postgres:13-alpine
    container_name: agies-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - agies-network

  # Redis Cache
  redis:
    image: redis:6-alpine
    container_name: agies-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - agies-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: agies-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - agies-app
    networks:
      - agies-network

  # Certbot for SSL
  certbot:
    image: certbot/certbot
    container_name: agies-certbot
    volumes:
      - ./nginx/ssl:/etc/letsencrypt
      - ./nginx/www:/var/www/html
    command: certonly --webroot -w /var/www/html -d ${DOMAIN} --email admin@${DOMAIN} --agree-tos --no-eff-email

volumes:
  postgres_data:
  redis_data:

networks:
  agies-network:
    driver: bridge
EOF
    
    print_success "Docker Compose configuration created"
}

# Create production Dockerfile
create_production_dockerfile() {
    print_status "Creating production Dockerfile..."
    
    cat > Dockerfile.production << 'EOF'
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build:backend

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S agies -u 1001

# Change ownership
RUN chown -R agies:nodejs /app
USER agies

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/backend/simple-server.js --health-check

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/backend/simple-server.js"]
EOF
    
    print_success "Production Dockerfile created"
}

# Create Nginx configuration
create_nginx_config() {
    print_status "Creating Nginx configuration..."
    
    mkdir -p nginx
    
    cat > nginx/nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream
    upstream agies_app {
        server agies-app:3000;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name ${DOMAIN} www.${DOMAIN};
        return 301 https://\$server_name\$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name ${DOMAIN} www.${DOMAIN};

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/live/${DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/live/${DOMAIN}/privkey.pem;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_session_tickets off;

        # Modern SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header Strict-Transport-Security "max-age=63072000" always;
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-src 'self';" always;

        # Root directory
        root /var/www/html;
        index index.html;

        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://agies_app;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Login rate limiting
        location /auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://agies_app;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Static files
        location / {
            try_files \$uri \$uri/ /index.html;
            
            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF
    
    print_success "Nginx configuration created"
}

# Deploy to server
deploy_to_server() {
    print_status "Deploying to production server..."
    
    DROPLET_IP=$(cat .droplet_ip)
    
    # Copy files to server
    print_status "Copying application files to server..."
    scp -o StrictHostKeyChecking=no \
        docker-compose.production.yml \
        Dockerfile.production \
        .env.production \
        root@$DROPLET_IP:/root/
    
    # Copy nginx configuration
    scp -r -o StrictHostKeyChecking=no nginx root@$DROPLET_IP:/root/
    
    # Copy application files
    scp -r -o StrictHostKeyChecking=no \
        public \
        dist \
        package*.json \
        root@$DROPLET_IP:/root/
    
    # Execute deployment commands
    ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'EOF'
        # Update system
        apt update && apt upgrade -y
        
        # Install Docker and Docker Compose if not present
        if ! command -v docker &> /dev/null; then
            curl -fsSL https://get.docker.com -o get-docker.sh
            sh get-docker.sh
        fi
        
        if ! command -v docker-compose &> /dev/null; then
            curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            chmod +x /usr/local/bin/docker-compose
        fi
        
        # Create application directory
        mkdir -p /opt/agies
        cd /opt/agies
        
        # Copy files
        cp /root/docker-compose.production.yml .
        cp /root/Dockerfile.production .
        cp /root/.env.production .
        cp -r /root/nginx .
        cp -r /root/public .
        cp -r /root/dist .
        cp /root/package*.json .
        
        # Build and start services
        docker-compose -f docker-compose.production.yml up -d --build
        
        # Wait for services to be ready
        sleep 30
        
        # Check service status
        docker-compose -f docker-compose.production.yml ps
EOF
    
    print_success "Deployment completed successfully!"
    print_status "Your Agies Password Manager is now running at: https://$DOMAIN"
}

# Setup domain and SSL
setup_domain_ssl() {
    print_status "Setting up domain and SSL..."
    
    DROPLET_IP=$(cat .droplet_ip)
    
    # Create DNS records
    print_status "Creating DNS records..."
    doctl compute domain create $DOMAIN --ip-address $DROPLET_IP
    doctl compute domain create www.$DOMAIN --ip-address $DROPLET_IP
    
    print_status "DNS records created. Please wait for propagation (5-10 minutes)..."
    
    # Setup SSL certificate
    print_status "Setting up SSL certificate..."
    ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'EOF'
        cd /opt/agies
        
        # Create webroot directory
        mkdir -p nginx/www
        
        # Get SSL certificate
        docker-compose -f docker-compose.production.yml run --rm certbot
        
        # Setup SSL renewal cron job
        echo "0 12 * * * docker-compose -f /opt/agies/docker-compose.production.yml run --rm certbot renew --quiet && docker-compose -f /opt/agies/docker-compose.production.yml restart nginx" | crontab -
EOF
    
    print_success "Domain and SSL setup completed!"
}

# Main deployment function
main() {
    print_status "Starting Agies Password Manager Production Deployment..."
    
    # Check prerequisites
    check_doctl
    authenticate_do
    
    # Create infrastructure
    create_droplet
    create_database
    create_redis
    
    # Setup configuration
    setup_production_env
    create_docker_compose
    create_production_dockerfile
    create_nginx_config
    
    # Deploy application
    deploy_to_server
    
    # Setup domain and SSL
    setup_domain_ssl
    
    print_success "🎉 Agies Password Manager is now deployed and ready for the world!"
    print_status "🌐 Access your app at: https://$DOMAIN"
    print_status "📊 Monitor your deployment with: doctl compute droplet list"
    print_status "🔧 SSH into your server: ssh root@$(cat .droplet_ip)"
    
    # Cleanup
    rm -f .droplet_ip .db_credentials
}

# Run main function
main "$@"
