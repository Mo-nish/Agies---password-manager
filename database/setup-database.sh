#!/bin/bash

# Agies Database Setup Script
# Sets up PostgreSQL database for Agies - The Maze Vault Password Manager

set -e

# Configuration
DB_NAME="agies_maze_vault"
DB_USER="agies_user"
DB_PASSWORD="agies_secure_2024!"
SCHEMA_FILE="schema.sql"

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

# Check if PostgreSQL is running
print_status "Checking PostgreSQL status..."
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    print_error "PostgreSQL is not running or not accessible"
    print_status "Please start PostgreSQL service:"
    echo "  macOS: brew services start postgresql"
    echo "  Linux: sudo systemctl start postgresql"
    echo "  Or check your PostgreSQL installation"
    exit 1
fi
print_success "PostgreSQL is running"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    print_error "psql command not found"
    print_status "Please install PostgreSQL client tools"
    exit 1
fi

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    print_error "Schema file '$SCHEMA_FILE' not found in current directory"
    print_status "Looking for schema file in database directory..."
    SCHEMA_FILE="database/schema.sql"
    if [ ! -f "$SCHEMA_FILE" ]; then
        print_error "Schema file not found in database/ directory either"
        exit 1
    fi
fi

print_status "Setting up Agies database..."

# Create database user (optional, will fail if user exists)
print_status "Creating database user..."
psql -h localhost -p 5432 -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || print_warning "User $DB_USER may already exist"

# Grant permissions
print_status "Setting up user permissions..."
psql -h localhost -p 5432 -c "ALTER USER $DB_USER CREATEDB;" 2>/dev/null || print_warning "Could not alter user permissions"

# Drop database if it exists
print_status "Dropping existing database (if any)..."
psql -h localhost -p 5432 -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || print_warning "Could not drop database (may not exist)"

# Create database
print_status "Creating database: $DB_NAME"
psql -h localhost -p 5432 -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Set up schema
print_status "Setting up database schema..."
psql -h localhost -p 5432 -d $DB_NAME -f $SCHEMA_FILE

# Grant additional permissions
print_status "Setting up database permissions..."
psql -h localhost -p 5432 -d $DB_NAME << EOF
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $DB_USER;
EOF

# Test connection
print_status "Testing database connection..."
psql -h localhost -p 5432 -U $DB_USER -d $DB_NAME -c "SELECT version();" >/dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Verify tables were created
print_status "Verifying database setup..."
TABLE_COUNT=$(psql -h localhost -p 5432 -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null)

if [ "$TABLE_COUNT" -gt 15 ]; then
    print_success "Database schema created successfully"
    print_status "Tables created: $TABLE_COUNT"
else
    print_warning "Expected more tables to be created. Current count: $TABLE_COUNT"
fi

# Show database info
print_status "Database Information:"
psql -h localhost -p 5432 -U $DB_USER -d $DB_NAME << EOF
\dt
EOF

print_success "Agies database setup completed!"
print_status ""
print_status "Database Details:"
echo "  Database Name: $DB_NAME"
echo "  Database User: $DB_USER"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""
print_status "Connection String:"
echo "  postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
print_status "Next Steps:"
echo "  1. Update your application configuration with the database connection details"
echo "  2. Run database migrations if needed"
echo "  3. Start your Agies application"
echo ""
print_warning "Security Note:"
echo "  - Change the default database password in production"
echo "  - Configure SSL/TLS for database connections"
echo "  - Use connection pooling for better performance"
echo "  - Regularly backup your database"
