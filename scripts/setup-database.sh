#!/bin/bash

# 🛡️ Padhma Vyuham Vault Database Setup Script 🛡️
# This script sets up PostgreSQL database for the most secure password manager

set -e

echo "🛡️ Setting up Padhma Vyuham Vault Database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="padhma_vyuham_vault"
DB_USER="monishreddy"
DB_PASSWORD="password"
DB_HOST="localhost"
DB_PORT="5432"

# Check if PostgreSQL is running
echo -e "${BLUE}🔍 Checking PostgreSQL status...${NC}"
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
    echo -e "${RED}❌ PostgreSQL is not running or not accessible${NC}"
    echo -e "${YELLOW}💡 Please start PostgreSQL service first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Create database if it doesn't exist
echo -e "${BLUE}🗄️ Creating database '$DB_NAME'...${NC}"
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo -e "${YELLOW}⚠️ Database '$DB_NAME' already exists${NC}"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🗑️ Dropping existing database...${NC}"
        dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
        echo -e "${GREEN}✅ Database dropped${NC}"
    else
        echo -e "${YELLOW}⚠️ Skipping database creation${NC}"
        exit 0
    fi
fi

createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
echo -e "${GREEN}✅ Database '$DB_NAME' created successfully${NC}"

# Apply schema
echo -e "${BLUE}📋 Applying database schema...${NC}"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/schema.sql
echo -e "${GREEN}✅ Database schema applied successfully${NC}"

# Create test user for development
echo -e "${BLUE}👤 Creating test user...${NC}"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
INSERT INTO users (email, username, password_hash, master_key_hash, subscription_tier)
VALUES (
    'admin@padhmavyuham.com',
    'admin',
    '\$2a\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqKqKq',
    '\$2a\$15\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqKqKq',
    'premium'
) ON CONFLICT (email) DO NOTHING;
EOF

echo -e "${GREEN}✅ Test user created${NC}"

# Verify setup
echo -e "${BLUE}🔍 Verifying database setup...${NC}"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 
    'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 
    'Vaults' as table_name, COUNT(*) as count FROM vaults
UNION ALL
SELECT 
    'Security Layers' as table_name, COUNT(*) as count FROM security_layers
UNION ALL
SELECT 
    'Honeypots' as table_name, COUNT(*) as count FROM honeypots;
"

echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
echo -e "${BLUE}📊 Database: $DB_NAME${NC}"
echo -e "${BLUE}🔗 Host: $DB_HOST:$DB_PORT${NC}"
echo -e "${BLUE}👤 User: $DB_USER${NC}"

# Create .env file template
echo -e "${BLUE}📝 Creating .env template...${NC}"
cat > .env.template << EOF
# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Stripe Configuration (for billing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security Configuration
ENCRYPTION_KEY=your-32-character-encryption-key
MASTER_KEY_SALT=your-master-key-salt

# Server Configuration
PORT=3002
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF

echo -e "${GREEN}✅ .env.template created${NC}"
echo -e "${YELLOW}💡 Copy .env.template to .env and update the values${NC}"

echo -e "${GREEN}🚀 Ready to build the most secure password manager!${NC}"
