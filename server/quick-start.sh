#!/bin/bash
# FlicksByNick Email Setup - Quick Start Script
# Run this to get started faster!

echo "╔════════════════════════════════════════════╗"
echo "║  FlicksByNick Email Setup - Quick Start    ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Download from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Navigate to server folder
cd server || exit 1

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 Edit server/.env and add your Gmail credentials:"
    echo "   EMAIL_USER=your-email@gmail.com"
    echo "   EMAIL_PASSWORD=your-app-password"
    echo ""
    echo "🔑 Get your Gmail App Password at:"
    echo "   https://myaccount.google.com/apppasswords"
    echo ""
    read -p "Press Enter once you've updated .env..."
fi

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ Ready to start the server!             ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "Run: npm start"
echo ""
