# Online Coding Interview Platform

A real-time collaborative coding platform supporting multiple languages (syntax highlighting) and safe in-browser execution (for JavaScript).

## Features
- **Real-time Collaboration**: Code changes are synced instantly between users in the same room.
- **Language Support**: Syntax highlighting for JavaScript, Python, and Java.
- **Code Execution**: Execute JavaScript code safely in the browser using Web Workers.
- **Unique Sessions**: Create unique interview rooms via shareable URLs.

## Prerequisites
- Node.js (v14+)
- npm

## Installation

1.  **Clone/Naviagte**:
    ```bash
    cd coding-platform
    ```

2.  **Install Server Dependencies**:
    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies**:
    ```bash
    cd ../client
    npm install
    ```

## Running the Application

1.  **Start the Backend Server**:
    ```bash
    cd server
    npm run dev
    # Server runs on http://localhost:3000
    ```

2.  **Start the Frontend Client**:
    ```bash
    cd client
    npm run dev
    # Client runs on http://localhost:5173
    ```

3.  **Open in Browser**:
    Go to `http://localhost:5173`. Click "Create New Interview Session" to start. Open the generated URL in another tab/window to verify real-time sync.

## Testing

### Integration Test
We have a script to verify real-time synchronization between clients.
Ensure the server is running (`cd server && npm run dev`) before running the test.

```bash
cd coding-platform
node integration-test.js
```

Expected output:
```
Starting integration test...
Client 1 connected
Client 2 connected
Both clients connected. Testing sync...
Client 1 emitting code-change...
Client 2 received code update: console.log('Hello World');
Integration Test Passed!
```
