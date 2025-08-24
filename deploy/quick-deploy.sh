#!/bin/bash

# 🚀 Agies Quick Deployment Script
# Deploy to production in 5 minutes!

set -e

echo "🌟 Agies Quick Deployment - Let's Launch the World's Next Top Password Manager!"

# Configuration
read -p "Enter your domain (e.g., agies.com): " DOMAIN
read -p "Enter your email: " EMAIL
read -p "Enter DigitalOcean region (nyc1, sfo3, lon1): " REGION

# Validate inputs
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ] || [ -z "$REGION" ]; then
    echo "❌ All fields are required!"
    exit 1
fi

echo "🚀 Starting deployment with:"
echo "   Domain: $DOMAIN"
echo "   Email: $EMAIL"
echo "   Region: $REGION"
echo ""

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "📥 Installing DigitalOcean CLI..."
    brew install doctl
fi

# Authenticate with DigitalOcean
echo "🔐 Authenticating with DigitalOcean..."
if ! doctl account get &> /dev/null; then
    echo "Please authenticate with DigitalOcean:"
    doctl auth init
fi

echo "✅ Authentication successful!"

# Create production server
echo "🖥️ Creating production server..."
DROPLET_ID=$(doctl compute droplet create agies-production \
    --size s-2vcpu-4gb \
    --region $REGION \
    --image docker-20-04 \
    --ssh-keys $(doctl compute ssh-key list --format ID --no-header) \
    --format ID --no-header)

echo "⏳ Waiting for server to be ready..."
sleep 30

# Get server IP
DROPLET_IP=$(doctl compute droplet get $DROPLET_ID --format PublicIPv4 --no-header)
echo "✅ Server created with IP: $DROPLET_IP"

# Wait for SSH
echo "⏳ Waiting for SSH access..."
while ! nc -z $DROPLET_IP 22; do
    sleep 5
done

# Create production environment
echo "🔧 Setting up production environment..."
cat > .env.production << EOF
NODE_ENV=production
PORT=3000
DOMAIN=$DOMAIN
EMAIL=$EMAIL
SSL_ENABLED=true
EOF

# Deploy application
echo "🚀 Deploying Agies application..."
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'EOF'
    # Update system
    apt update && apt upgrade -y
    
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Create app directory
    mkdir -p /opt/agies
    cd /opt/agies
EOF

# Copy application files
echo "📁 Copying application files..."
scp -o StrictHostKeyChecking=no \
    docker-compose.production.yml \
    Dockerfile.production \
    .env.production \
    root@$DROPLET_IP:/opt/agies/

scp -r -o StrictHostKeyChecking=no \
    public \
    dist \
    package*.json \
    root@$DROPLET_IP:/opt/agies/

# Start application
echo "🚀 Starting Agies application..."
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'EOF'
    cd /opt/agies
    
    # Start services
    docker-compose -f docker-compose.production.yml up -d --build
    
    # Wait for services
    sleep 30
    
    # Check status
    docker-compose -f docker-compose.production.yml ps
EOF

# Setup domain and SSL
echo "🌐 Setting up domain and SSL..."
doctl compute domain create $DOMAIN --ip-address $DROPLET_IP
doctl compute domain create www.$DOMAIN --ip-address $DROPLET_IP

echo "⏳ DNS records created. Waiting for propagation (5-10 minutes)..."

# Setup SSL certificate
echo "🔒 Setting up SSL certificate..."
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'EOF'
    cd /opt/agies
    
    # Create webroot directory
    mkdir -p nginx/www
    
    # Get SSL certificate
    docker-compose -f docker-compose.production.yml run --rm certbot
    
    # Setup auto-renewal
    echo "0 12 * * * docker-compose -f /opt/agies/docker-compose.production.yml run --rm certbot renew --quiet && docker-compose -f /opt/agies/docker-compose.production.yml restart nginx" | crontab -
EOF

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo ""
echo "🌐 Your Agies Password Manager is now live at:"
echo "   https://$DOMAIN"
echo ""
echo "📱 PWA Features:"
echo "   - Installable web app"
echo "   - Offline support"
echo "   - Mobile optimized"
echo ""
echo "🔐 Security Features:"
echo "   - HTTPS with SSL"
echo "   - Rate limiting"
echo "   - Security headers"
echo ""
echo "📊 Next Steps:"
echo "   1. Test your application at https://$DOMAIN"
echo "   2. Invite beta users"
echo "   3. Monitor performance"
echo "   4. Start marketing!"
echo ""
echo "🚀 Ready to conquer the password manager market!"
echo ""
echo "💡 Need help? Check DEPLOYMENT_GUIDE.md"
echo "🔧 Server SSH: ssh root@$DROPLET_IP"
echo "📊 Monitor: doctl compute droplet list"
