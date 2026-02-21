@echo off
echo ========================================
echo AI Trip Planner - Windows Setup Script
echo ========================================
echo.

cd backend

echo [1/5] Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo Error: Failed to create virtual environment
    echo Make sure Python 3.9+ is installed
    pause
    exit /b 1
)
echo ✓ Virtual environment created
echo.

echo [2/5] Activating virtual environment...
call venv\Scripts\activate
echo ✓ Virtual environment activated
echo.

echo [3/5] Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [4/5] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo ✓ .env file created
    echo.
    echo ⚠️  IMPORTANT: Edit backend\.env and add your GROQ_API_KEY
    echo    Get your FREE API key at: https://console.groq.com
    echo.
) else (
    echo .env file already exists
    echo.
)

echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Edit backend\.env and add your Groq API key
echo    Get FREE key at: https://console.groq.com
echo 2. Run: cd backend
echo 3. Run: venv\Scripts\activate
echo 4. Run: python main.py
echo 5. Open frontend\index.html in your browser
echo ========================================
echo.

pause
