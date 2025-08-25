#!/bin/bash

# 🚀 Maze Password Manager Deployment Script
# Deploy to various platforms with ease

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="maze-password-manager"
BUILD_DIR="public"
DEPLOY_DIR="deploy"

echo -e "${BLUE}🚀 Maze Password Manager Deployment${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check if public directory exists
    if [ ! -d "$BUILD_DIR" ]; then
        print_error "Build directory '$BUILD_DIR' not found!"
        exit 1
    fi
    
    # Check if main files exist
    if [ ! -f "$BUILD_DIR/maze-password-manager.html" ]; then
        print_error "Main application file not found!"
        exit 1
    fi
    
    if [ ! -f "$BUILD_DIR/login.html" ]; then
        print_error "Login page not found!"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Create deployment directory
setup_deploy() {
    print_info "Setting up deployment directory..."
    
    if [ -d "$DEPLOY_DIR" ]; then
        rm -rf "$DEPLOY_DIR"
    fi
    
    mkdir -p "$DEPLOY_DIR"
    cp -r "$BUILD_DIR"/* "$DEPLOY_DIR/"
    
    print_status "Deployment directory created"
}

# Deploy to local server
deploy_local() {
    print_info "Starting local development server..."
    
    cd "$DEPLOY_DIR"
    
    # Check if Python 3 is available
    if command -v python3 &> /dev/null; then
        print_status "Starting Python 3 server on http://localhost:8000"
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        print_status "Starting Python server on http://localhost:8000"
        python -m http.server 8000
    else
        print_error "Python not found. Please install Python to run local server."
        exit 1
    fi
}

# Deploy to Netlify
deploy_netlify() {
    print_info "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    cd "$DEPLOY_DIR"
    
    # Initialize Netlify if not already done
    if [ ! -f "netlify.toml" ]; then
        netlify init --manual
    fi
    
    # Deploy
    netlify deploy --prod --dir=.
    
    print_status "Deployed to Netlify successfully"
}

# Deploy to Vercel
deploy_vercel() {
    print_info "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    cd "$DEPLOY_DIR"
    
    # Deploy
    vercel --prod
    
    print_status "Deployed to Vercel successfully"
}

# Deploy to GitHub Pages
deploy_github_pages() {
    print_info "Deploying to GitHub Pages..."
    
    if [ ! -d ".git" ]; then
        print_error "Not a git repository. Please initialize git first."
        exit 1
    fi
    
    # Create gh-pages branch
    git checkout -b gh-pages
    
    # Add all files
    git add .
    git commit -m "Deploy to GitHub Pages"
    
    # Push to gh-pages branch
    git push origin gh-pages
    
    # Return to main branch
    git checkout main
    
    print_status "Deployed to GitHub Pages successfully"
    print_info "Enable GitHub Pages in your repository settings"
}

# Deploy to AWS S3
deploy_aws_s3() {
    print_info "Deploying to AWS S3..."
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI not found. Please install AWS CLI first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    read -p "Enter S3 bucket name: " S3_BUCKET
    
    # Sync files to S3
    aws s3 sync . s3://$S3_BUCKET --delete
    
    # Make files public
    aws s3 website s3://$S3_BUCKET --index-document maze-password-manager.html
    
    print_status "Deployed to AWS S3 successfully"
    print_info "Website URL: http://$S3_BUCKET.s3-website-$(aws configure get region).amazonaws.com"
}

# Create Docker image
create_docker() {
    print_info "Creating Docker image..."
    
    # Create Dockerfile
    cat > Dockerfile << EOF
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF
    
    # Create nginx configuration
    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index maze-password-manager.html;
        
        location / {
            try_files \$uri \$uri/ /maze-password-manager.html;
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
EOF
    
    # Build Docker image
    docker build -t $APP_NAME .
    
    print_status "Docker image created successfully"
    print_info "Run with: docker run -p 80:80 $APP_NAME"
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  local           Start local development server"
    echo "  netlify         Deploy to Netlify"
    echo "  vercel          Deploy to Vercel"
    echo "  github-pages    Deploy to GitHub Pages"
    echo "  aws-s3          Deploy to AWS S3"
    echo "  docker          Create Docker image"
    echo "  all             Deploy to all platforms"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 local        # Start local server"
    echo "  $0 netlify      # Deploy to Netlify"
    echo "  $0 all          # Deploy to all platforms"
}

# Main deployment function
deploy_all() {
    print_info "Deploying to all platforms..."
    
    deploy_netlify
    deploy_vercel
    deploy_github_pages
    deploy_aws_s3
    create_docker
    
    print_status "Deployment to all platforms completed!"
}

# Main script
main() {
    case "${1:-help}" in
        "local")
            check_prerequisites
            setup_deploy
            deploy_local
            ;;
        "netlify")
            check_prerequisites
            setup_deploy
            deploy_netlify
            ;;
        "vercel")
            check_prerequisites
            setup_deploy
            deploy_vercel
            ;;
        "github-pages")
            check_prerequisites
            setup_deploy
            deploy_github_pages
            ;;
        "aws-s3")
            check_prerequisites
            setup_deploy
            deploy_aws_s3
            ;;
        "docker")
            check_prerequisites
            setup_deploy
            create_docker
            ;;
        "all")
            check_prerequisites
            setup_deploy
            deploy_all
            ;;
        "help"|*)
            show_usage
            exit 0
            ;;
    esac
}

# Run main function with all arguments
main "$@"
