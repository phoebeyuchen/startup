const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function peerProxy(httpServer) {
  // Create a websocket object
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });

  // Keep track of all the connections so we can forward messages
  let connections = [];

  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), alive: true, ws: ws };
    connections.push(connection);

    // Handle incoming messages
    ws.on('message', function message(data) {
      try {
        // Parse the incoming message
        const msg = JSON.parse(data);
        
        // Broadcast message to all other clients
        connections.forEach((c) => {
          if (c.id !== connection.id) {
            c.ws.send(JSON.stringify({
              type: 'chat',
              id: msg.id,
              userEmail: msg.userEmail,
              text: msg.text,
              timestamp: msg.timestamp
            }));
          }
        });
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    });

    // Handle connection close
    ws.on('close', () => {
      const pos = connections.findIndex((o) => o.id === connection.id);
      if (pos >= 0) {
        connections.splice(pos, 1);
      }
    });

    // Respond to pong messages by marking the connection alive
    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  // Keep active connections alive
  setInterval(() => {
    connections.forEach((c) => {
      // Kill any connection that didn't respond to the ping last time
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 10000);
}

module.exports = { peerProxy };
