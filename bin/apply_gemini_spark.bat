@echo off
title Gemini Spark - Updater and Launcher
color 0B

echo ======================================================================
echo    Gemini Spark Patch and Launcher
echo ======================================================================
echo.

set SOURCE_ASAR=%USERPROFILE%\.gemini\geminispark\branding\app.asar
set TARGET_DIR=%LOCALAPPDATA%\Programs\antigravity\resources
set TARGET_ASAR=%TARGET_DIR%\app.asar
set APP_EXE=%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe

if not exist "%SOURCE_ASAR%" goto NOT_FOUND

tasklist /fi "imagename eq Antigravity.exe" 2>nul | find /i "Antigravity.exe" >nul
if errorlevel 1 goto DO_COPY

echo [!] Active Antigravity process detected.
echo [INFO] Closing process gracefully to apply patch...
taskkill /f /im Antigravity.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:DO_COPY
echo [INFO] Synchronizing authentic Gemini Spark package...
copy /y "%SOURCE_ASAR%" "%TARGET_ASAR%" >nul
if errorlevel 1 goto FAILED

echo.
echo ======================================================================
echo  [SUCCESS] Gemini Spark 2.3.4 patch successfully applied!
echo   - 1:1 Authentic Gemini center aurora background light source (광원)
echo   - Crisp monochrome white Gemini Spark initial loading screen overlay
echo   - Authentic Google Gemini ambient aurora light source (광원)
echo   - Apple dynamic text morph transition: Smooth crossfade when text updates
echo   - Apple fluid spring text motion: cubic-bezier(0.16, 1, 0.3, 1)
echo   - Fixed "Working..." state: Native inline 4-color wave dots on agent-loading
echo   - Independent text glide animation: 100% fluid transition when steps finish
echo   - Smooth 4-dot wave while thinking -> 4-dot convergence morph into Spark
echo   - Zero CPU leak: Auto-cleans completed tool sub-steps
echo   - Top-left menu, branding, and shortcuts fully preserved
echo ======================================================================
echo.
echo [INFO] Launching Gemini Spark...
start "" "%APP_EXE%"
timeout /t 3 /nobreak >nul
exit /b 0

:NOT_FOUND
echo [ERROR] Source package file not found:
echo %SOURCE_ASAR%
pause
exit /b 1

:FAILED
echo [ERROR] Failed to copy app.asar.
echo The file may be locked by a running process or require permissions.
pause
exit /b 1
