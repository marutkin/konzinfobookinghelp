@echo off
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install it and try again.
    exit /b 1
)

IF exist node_modules (
    echo Launching...
    node --env-file=.env index.js
) ELSE (
    echo Installing dependencies...
    npm ci
    node --env-file=.env index.js
)
