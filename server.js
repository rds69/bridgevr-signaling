const WebSocket = require('ws');
const http = require('http');

// Use the port provided by the cloud platform (Render/Heroku)
const port = process.env.PORT || 3000;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("BridgeVR Signaling Server is Live and Running!");
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

console.log(`BridgeVR Server starting on port ${port}`);

wss.on('connection', (ws) => {
    console.log("A new BridgeVR device has connected.");

    ws.on('message', (data) => {
        // Convert buffer to string if necessary
        const message = data.toString();
        
        // Broadcast the signaling message to all OTHER connected devices
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log("A device disconnected from the Bridge.");
    });

    ws.on('error', (error) => {
        console.error("WebSocket Error:", error);
    });
});

// Start listening
server.listen(port, () => {
    console.log(`Listening for BridgeVR signals on port ${port}`);
});
