// PURE Node.js - NO EXTERNAL DEPENDENCIES!
const http = require('http');
const url = require('url');

const clients = [];
let offer = null;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('🟢 VR Signaling Server ALIVE!\nIP Test OK');
});

server.listen(3000, '0.0.0.0', () => {
    console.log('🚀 VR Server LIVE: http://0.0.0.0:3000');
    console.log('📱 Test: http://YOUR-IP:3000');
});

// WebSocket-like polling (simplified)
setInterval(() => {
    console.log(`👥 Connected phones: ${clients.length}`);
}, 5000);

http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;
    
    if (query.offer) {
        offer = query.offer;
        console.log('📨 Offer received:', offer.substring(0, 50) + '...');
        res.end('Offer saved');
    } else if (query.answer) {
        console.log('📨 Answer received');
        // Broadcast answer
        res.end('Answer saved');
    } else {
        res.end(JSON.stringify({ offer: offer || null }));
    }
}).listen(3001, '0.0.0.0');

console.log('✅ Server ready! No npm needed!');
const WebSocket = require('ws');
const http = require('http');

// Cloud providers like Render or Heroku provide a PORT via process.env
const port = process.env.PORT || 3000;

// Create a dummy HTTP server for the WebSocket to attach to
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("BridgeVR Signaling Server is Live!");
});

const wss = new WebSocket.Server({ server });

console.log(`BridgeVR Server running on port ${port}`);

wss.on('connection', (ws) => {
    console.log("New Phone Connected to Bridge");
    
    ws.on('message', (message) => {
        // Broadcast signaling data (SDP/ICE) to the other phone
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => console.log("Phone Disconnected"));
});

server.listen(port);