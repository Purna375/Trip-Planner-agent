#!/bin/bash

echo "========================================"
echo "AI Trip Planner - Setup Script"
echo "========================================"
echo ""

cd backend

echo "[1/5] Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "Error: Failed to create virtual environment"
    echo "Make sure Python 3.9+ is installed"
    exit 1
fi
echo "✓ Virtual environment created"
echo ""

echo "[2/5] Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

echo "[3/5] Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

echo "[4/5] Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and add your GROQ_API_KEY"
    echo "   Get your FREE API key at: https://console.groq.com"
    echo ""
else
    echo ".env file already exists"
    echo ""
fi

echo "[5/5] Setup complete!"
echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"
echo "1. Edit backend/.env and add your Groq API key"
echo "   Get FREE key at: https://console.groq.com"
echo "2. Run: cd backend"
echo "3. Run: source venv/bin/activate"
echo "4. Run: python main.py"
echo "5. Open frontend/index.html in your browser"
echo "========================================"
echo ""
