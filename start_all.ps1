# PowerShell Script to Start AI Personality Prediction System
# Run with: powershell -ExecutionPolicy Bypass -File start_all.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🚀 AI Personality Prediction System" -ForegroundColor Green
Write-Host "Starting Backend & Frontend Servers" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$BackendPath = "e:\Fyp project\personality-prediction\backend"
$FrontendPath = "e:\Fyp project\personality-prediction\frontend"

# Start Backend Server
Write-Host "📦 Starting Django Backend Server..." -ForegroundColor Yellow
Write-Host "   Location: $BackendPath" -ForegroundColor Gray
Write-Host "   Command: python manage.py runserver" -ForegroundColor Gray
Write-Host ""

Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$BackendPath`" && python manage.py runserver" -NoNewWindow

# Wait 2 seconds for backend to start
Write-Host "⏳ Waiting for backend to start (2 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "⚛️  Starting React Frontend Server..." -ForegroundColor Yellow
Write-Host "   Location: $FrontendPath" -ForegroundColor Gray
Write-Host "   Command: npm run dev" -ForegroundColor Gray
Write-Host ""

Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$FrontendPath`" && npm run dev" -NoNewWindow

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Servers Started Successfully!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend API:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "🌐 Frontend:     http://localhost:5173" -ForegroundColor Cyan
Write-Host "👨‍💼 Admin Panel:  http://localhost:8000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Default Credentials:" -ForegroundColor Yellow
Write-Host "   Username: admin" -ForegroundColor Gray
Write-Host "   Password: AdminSecurePassword@123" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tip: Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Ready to test! Open browser and go to http://localhost:5173" -ForegroundColor Cyan
