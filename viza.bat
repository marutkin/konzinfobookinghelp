@echo off
IF exist node_modules ( echo Launching... && node --env-file=.env app.js ) ELSE ( echo Installing dependencies... && npm i && node --env-file=.env app.js)
