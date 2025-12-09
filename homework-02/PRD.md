# Product Requirement Document: Online Coding Interview Platform

## 1. Introduction
This document outlines the requirements for a real-time online coding interview platform. The platform will allow interviewers to create coding sessions, share them with candidates, and collaborate on code in real-time with safe execution capabilities.

## 2. Goals
- **Simplicity**: Easy to start a session and invite users.
- **Collaboration**: Low-latency real-time editing for multiple users.
- **Reliability**: Consistent state across all connected clients.
- **Safety**: Secure code execution environment within the browser or sandboxed backend.

## 3. User Stories
- **As an Interviwer**, I want to generate a unique link for a coding session so I can share it with a candidate.
- **As a User (Interviewer/Candidate)**, I want to type code in an editor and see others' changes immediately.
- **As a User**, I want to select different programming languages for syntax highlighting.
- **As a User**, I want to run the code and see the output in a console panel.
- **As a System**, I need to execute untrusted code safely without compromising the host.

## 4. Functional Requirements

### 4.1 Session Management
- **Create Session**: Generating a unique ID (UUID) for a new room.
- **Join Session**: Accessing the room via URL (e.g., `app.com/room/:roomId`).
- **User Presence**: Show who is currently online in the room (optional but good for UX).

### 4.2 Collaborative Code Editor
- **Real-time Synchronization**: Use WebSockets (via Socket.io) to broadcast changes.
- **Conflict Resolution**: (Optional for MVP) Simple last-write-wins or Operational Transformation (OT) / CRDTs (e.g., Yjs) for better concurrency.
- **Syntax Highlighting**: Support common interview languages: JavaScript, Python, Java, C++, etc.
- **Line Numbers & Indentation**: Standard IDE features.

### 4.3 Code Execution
- **Trigger**: "Run" button to execute the current code.
- **Environment**:
    -   *Option A (Pure Browser)*: Use Web Workers or WASM (e.g., Pyodide) for safe client-side execution.
    -   *Option B (Backend Sandbox)*: Send code to a secure backend service (e.g., Piston API) and return stdout/stderr.
    -   *Constraint Compliance*: The requirement "Execute code safely in the browser" suggests exploring client-side options like WebContainers (for Node.js) or constrained `eval` / `Function` constructors (for JS) if security permits, or a mocked environment. Ideally, use an isolated sandboxing API.
- **Output**: Display standard output and error messages in a dedicated terminal pane.

## 5. Non-Functional Requirements
- **Latency**: Text updates should appear < 100ms.
- **Scalability**: Support multiple concurrent interview sessions.
- **Security**: Prevent XSS in the editor and malicious code execution (infinite loops, accessing local storage, etc.).

## 6. Technical Stack Recommendation

### Frontend
- **Framework**: React + Vite (Fast, modern)
- **Language**: JavaScript (as recommended)
- **State Management**: React Context or Zustand
- **Editor Component**: `monaco-editor` (VS Code core) or `react-codemirror`
- **Real-time Client**: `socket.io-client`

### Backend
- **Server**: Node.js with Express
- **Real-time Server**: `socket.io`
- **Execution Engine**:
    -   For JS: `vm` module in Node (with timeouts) or a dedicated Runner Service.
    -   For others: Integration with a compilation API (e.g., Piston) or Dockerized runners is robust. *Note: If strict browser-only execution is required, look into `WebContainers`.*

## 7. UI/UX Draft
- **Header**: Logo, Session URL, "Run" Button, Language Selector.
- **Main Layout**: Split screen.
    -   **Left**: Code Editor (full height).
    -   **Right**: Output Console / Terminal.
- **Theme**: Dark mode by default for developer comfort.

## 8. Development Roadmap
1.  **Setup**: Initialize React + Vite project and Express server.
2.  **Editor**: Integrate Monaco Editor.
3.  **Backend**: Set up primitive WebSocket server for echoing text.
4.  **Sync**: Implement logic to broadcast editor state to all clients.
5.  **Execution**: Implement the "Run" endpoint/handler and display results.
6.  **Refinement**: add Language selector and basic styling.
