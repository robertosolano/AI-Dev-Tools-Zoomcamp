# Online Coding Interview Platform

A real-time collaborative coding platform supporting multiple languages (syntax highlighting) and safe in-browser execution (JavaScript & Python).

## Features

### Core
-   **Real-time Collaboration**: Code changes are synced instantly between users in the same room using Socket.IO.
-   **Language Support**: Syntax highlighting for JavaScript, Python, and Java.
-   **Code Execution**:
    -   **JavaScript**: Executed safely in the browser using Web Workers.
    -   **Python**: Executed safely in the browser using Pyodide (WASM).
-   **Dockerized**: Production-ready container serving both frontend and backend.

### UI & UX (New)
-   **Flexible Layout**: Toggle between **Side-by-Side** and **Stacked** (vertical) views for the editor and terminal.
-   **Terminal Styling**: Clean white background with black text for readability.
-   **User Roles**: 
    -   **Evaluator**: Can create new interview sessions.
    -   **Candidate**: Can view active sessions and join them by ID.

### Test Mode
-   **Question Bank**: Integrated library of 10 coding interview questions (Easy to Hard).
-   **Test Panel**: Dedicated sidebar to browse questions and load starter code directly into the editor.

---

## Quick Start (Development)

### Prerequisites
-   Node.js (v18+)
-   npm

### Installation
1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd coding-platform
    ```

2.  **Install Dependencies** (Root, Client, and Server):
    ```bash
    npm install
    cd client && npm install
    cd ../server && npm install
    cd ..
    ```

### Running Locally
You can run both the client and server simultaneously from the root directory:

```bash
npm run dev
```
-   **Client**: http://localhost:5173
-   **Server**: http://localhost:3000

---

## Deployment (Docker)

The project includes a multi-stage `Dockerfile` that builds the React client and serves it via the Node.js backend.

1.  **Build the Image**:
    ```bash
    docker build -t coding-platform .
    ```

2.  **Run the Container**:
    ```bash
    docker run -p 3000:3000 coding-platform
    ```
    -   Access the application at **http://localhost:3000**

---

## Usage Guide

### 1. Starting a Session
-   **Evaluator**:
    1.  Go to the Home page.
    2.  Enter your Name.
    3.  Select Role: **Evaluator**.
    4.  Click **Create Session**. You will be redirected to a unique room.
-   **Candidate**:
    1.  Go to the Home page.
    2.  Enter your Name.
    3.  Select Role: **Candidate**.
    4.  A list of **Active Sessions** will appear on the right. Click one to join, or enter a Room ID manually.

### 2. The Coding Room
-   **Editor**: Write code in the left/top pane. Changes sync live.
-   **Terminal**: Click **Run Code** (Top Right) to execute. Output appears in the right/bottom pane.
-   **Layout**: Click the **Layout** button to switch between Horizontal and Vertical split.

### 3. Test Mode (Interview)
-   Click the **"Enter Test Mode"** button (Green).
-   A sidebar will appear with interview questions.
-   Use **Next/Prev** to browse questions.
-   Click **Load into Editor** to replace the current code with the question's starter template.

---

## Testing

We have an integration test to verify real-time synchronization.

```bash
# Ensure server is running first
npm test
```
