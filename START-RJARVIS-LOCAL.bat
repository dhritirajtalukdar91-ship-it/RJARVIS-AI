@echo off
title RJARVIS AI - Local Launcher
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
    start "RJARVIS Local Server" cmd /k "cd /d ""%~dp0"" && py -m http.server 8000 --bind 127.0.0.1"
    timeout /t 2 /nobreak >nul
    start "" http://localhost:8000
    echo RJARVIS is opening at http://localhost:8000
    echo Keep the server window open while using Local AI.
    pause
    exit /b
)

where python >nul 2>nul
if %errorlevel%==0 (
    start "RJARVIS Local Server" cmd /k "cd /d ""%~dp0"" && python -m http.server 8000 --bind 127.0.0.1"
    timeout /t 2 /nobreak >nul
    start "" http://localhost:8000
    echo RJARVIS is opening at http://localhost:8000
    echo Keep the server window open while using Local AI.
    pause
    exit /b
)

echo Python was not found. Install Python 3, then double-click this file again.
pause
