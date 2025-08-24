#!/bin/bash

echo "🔄 Stopping existing servers..."
pkill -f "dev:backend" || true
pkill -f "dev:frontend" || true
pkill -f "ts-node" || true  
pkill -f "vite" || true

sleep 2

echo "🛡️ Starting backend on port 3001..."
npm run dev:backend &
BACKEND_PID=$!

sleep 5

echo "🌐 Starting frontend on port 3000..."  
npm run dev:frontend &
FRONTEND_PID=$!

echo "✅ Servers started:"
echo "   Backend PID: $BACKEND_PID (port 3001)"
echo "   Frontend PID: $FRONTEND_PID (port 3000)"
echo ""
echo "🔗 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
