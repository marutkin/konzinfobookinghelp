#!/bin/zsh

if ! command -v node &> /dev/null; then
  echo "Node.js is not installed. Please install it and try again."
  exit 1
fi

if [ -d "node_modules" ]; then
  echo "Launching..."
  node --env-file=.env index.js
else
  echo "Installing dependencies..."
  npm ci
  node --env-file=.env index.js
fi
