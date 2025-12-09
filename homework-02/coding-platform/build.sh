#!/bin/bash
set -e

echo "Building homework-02..."

# Navigate to the homework-02 directory
cd homework-02/coding-platform

echo "Installing server dependencies..."
cd server && npm install

echo "Installing client dependencies..."
cd ../client && npm install

echo "Building client..."
cd ../client && npm run build

echo "Copying build to server public directory..."
mkdir -p ../server/public
cp -r dist/* ../server/public/

echo "Build completed successfully!"