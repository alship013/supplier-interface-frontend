#!/bin/bash
# Build script that bypasses TypeScript checking
set -e

# Install dependencies
npm install --prefer-offline --no-audit --silent

# Build with Vite directly, skipping TypeScript
npx vite build

echo "Build completed successfully!"