# SocketMsg | WebSocket

## Overview
SocketMsg is a single-page application (SPA) for real-time communication, built using WebSocket technology.

### Features
1. **User Authentication:**
   - Secure login with validation for both username and password.
   - Error messages for failed authentication.
   - Automatic redirection based on authentication status.

2. **Chat Page:**
   - Displays a list of online users (excluding the current user).
   - Real-time message exchange.
   - Chronological message history.
   - Separation between read and unread messages.

3. **Additional Features:**
   - Responsive design for screens ranging from 1440px to 380px.
   - Real-time status updates for connected users.
   - Graceful handling of server disconnections with auto-reconnect.

### Deployment
The application is deployed and accessible online. To fully use the chat features, the server must be set up and running locally.

[**Deploy**](https://barvinko.github.io/SocketMsg/)

## Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run start
   ```
4. Download and set up the WebSocket server from the link below. Follow the server's README for instructions.

[**Server Repository**](https://github.com/rolling-scopes-school/fun-chat-server/tree/main)

## Notes
- The application requires the WebSocket server to be running locally for full functionality.
- Download and start the server before interacting with the deployed application.