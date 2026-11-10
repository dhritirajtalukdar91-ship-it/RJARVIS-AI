@echo off
title RJARVIS AI Local Launcher
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 goto use_py

where python >nul 2>nul
if %errorlevel%==0 goto use_python

echo Python 3 was not found.
echo Install Python 3, then run this launcher again.
pause
exit /b 1

:use_py
start "RJARVIS Local Server" /D "%~dp0" cmd /k "py -m http.server 8000 --bind 127.0.0.1"
goto open_app

:use_python
start "RJARVIS Local Server" /D "%~dp0" cmd /k "python -m http.server 8000 --bind 127.0.0.1"

:open_app
timeout /t 2 /nobreak >nul
start "" http://localhost:8000
echo RJARVIS is opening at http://localhost:8000
echo Keep the server window open while using Local AI.
pause
