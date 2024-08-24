@echo off
IF exist node_modules ( echo Launching... && node --env-file=.env app.js ) ELSE ( echo Installing dependencies... && npm ci && node --env-file=.env app.js)
