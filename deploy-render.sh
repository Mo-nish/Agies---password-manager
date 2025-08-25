#!/bin/bash

echo "🚀 Deploying Maze Password Manager to Render..."

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "📦 Installing Render CLI..."
    curl -sL https://render.com/download.sh | sh
fi

# Deploy to Render
echo "🌐 Deploying to Render..."
render deploy

echo "✅ Deployment complete!"
echo "🔗 Your app will be available at: https://maze-password-manager.onrender.com"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Connect your GitHub repository"
echo "3. Select 'maze-password-manager' service"
echo "4. Deploy!"
