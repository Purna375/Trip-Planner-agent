@echo off
REM Fix Git history by removing secrets

echo Creating backup branch...
git branch backup-before-fix

echo Resetting to clean state...
git reset --soft 7f2a01e~1

echo Creating new initial commit with clean files...
git add .
git commit -m "Initial commit: Trip Planner agent with LangChain and Groq"

echo Force pushing to remote...
git push origin main --force

echo Done! Your secrets have been removed from the commit history.
echo.
echo IMPORTANT: 
echo 1. Your real API keys were exposed in the Git history
echo 2. You should REGENERATE your API keys at:
echo    - Groq: https://console.groq.com
echo    - OpenRouteService: https://openrouteservice.org/
echo 3. Create a backend/.env file with your NEW keys (this file is in .gitignore)
echo.
echo Backup branch 'backup-before-fix' created if you need to reference old commits.
pause
