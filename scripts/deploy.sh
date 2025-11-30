#!/bin/bash

echo "🚀 Deploying Zcash-Miden Private Bridge..."

echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

echo "🛑 Stopping existing processes..."
pm2 stop bridge-relayer 2>/dev/null || true

echo "🔄 Starting relayer service..."
pm2 start npm --name "bridge-relayer" -- run relayer

pm2 save

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Relayer status:"
pm2 status
echo ""
echo "View logs: pm2 logs bridge-relayer"
echo "Monitor: pm2 monit"
echo ""
