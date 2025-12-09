# Online Coding Interview Platform - Master Documentation

This repository contains a full-stack real-time coding interview platform.

## Features
- **Real-time Collaboration**: Live code editing with multiple users.
- **Language Support**: JavaScript (Node.js/Browser), Python (via Pyodide WASM), Java (Syntax only for now).
- **Safe Execution**:
    - JavaScript: Uses Web Workers in browser.
    - Python: Uses Pyodide (WASM) in browser.
- **Dockerized**: specific `Dockerfile` for easy deployment.

## Project Structure
- `client/`: React + Vite frontend application.
- `server/`: Express + Socket.io backend server.
- `integration-test.js`: Script for testing client-server synchronization.

## Quick Start (Development)

1. **Install Dependencies**:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Run Locally (Concurrent)**:
   From the root directory:
   ```bash
   npm run dev
   ```
   - Client: http://localhost:5173
   - Server: http://localhost:3000

## Deploy with Docker

1. **Build the Image**:
   ```bash
   docker build -t coding-platform .
   ```

2. **Run the Container**:
   ```bash
   docker run -p 3000:3000 coding-platform
   ```
   - Access the app at http://localhost:3000
   
   *Note: In Docker production mode, the Express server serves the React frontend static files.*

## Testing

Run the integration test to verify real-time sync:
```bash
# Ensure server is running first (npm run dev)
npm test
```
