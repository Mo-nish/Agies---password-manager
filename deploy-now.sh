#!/bin/bash

# 🚀 Deploy Agies to Render NOW!

echo "🌟 Agies Password Manager - Ready for Deployment!"
echo ""
echo "📁 Your deployment files are ready in: render-deployment/"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Go to: https://render.com"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Choose 'Deploy from existing code'"
echo "5. Upload the 'render-deployment' folder"
echo "6. Set build command: pip install -r requirements.txt"
echo "7. Set start command: gunicorn app:app"
echo "8. Choose FREE plan"
echo "9. Deploy!"
echo ""
echo "⏱️  Deployment time: ~5 minutes"
echo "💰 Cost: $0/month"
echo ""
echo "🚀 Ready to launch the world's next top password manager?"

# Open Render in browser
echo "🌐 Opening Render in your browser..."
open https://render.com

echo ""
echo "📋 Files included:"
ls -la render-deployment/

echo ""
echo "🎉 After deployment, you'll get a URL like:"
echo "   https://agies-password-manager-xxxxx.onrender.com"
echo ""
echo "🔗 Your frontend is already live at:"
echo "   https://agies-password-manager-41gtowhsh-monish-reddys-projects.vercel.app"
