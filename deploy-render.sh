#!/bin/bash

# 🚀 Deploy Agies Backend to Render (FREE!)

echo "🌟 Deploying Agies Backend to Render..."

# Create a temporary directory for deployment
TEMP_DIR=$(mktemp -d)
echo "📁 Created temp directory: $TEMP_DIR"

# Copy backend files
cp -r backend/* $TEMP_DIR/
cd $TEMP_DIR

# Create a simple Procfile for Render
echo "web: gunicorn app:app" > Procfile

# Create a simple runtime.txt
echo "python-3.9.16" > runtime.txt

# Initialize git and push to a new repository
git init
git add .
git commit -m "Initial deployment to Render"

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Go to https://render.com"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your GitHub repository or use this directory: $TEMP_DIR"
echo "5. Set build command: pip install -r requirements.txt"
echo "6. Set start command: gunicorn app:app"
echo "7. Choose FREE plan"
echo "8. Deploy!"
echo ""
echo "🌐 Your frontend is already live at:"
echo "   https://agies-password-manager-41gtowhsh-monish-reddys-projects.vercel.app"
echo ""
echo "🔧 Backend files are ready in: $TEMP_DIR"
echo "   You can upload these directly to Render"
echo ""
echo "🚀 Ready to deploy the world's next top password manager!"
