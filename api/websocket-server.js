const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');

function createWebSocketServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/notifications' });
  const clients = new Map();

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    let userId = null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      clients.set(ws, userId);
    } catch {
      ws.close(1008, 'Invalid token');
      return;
    }

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data);
        // Broadcast to user's other connections
        clients.forEach((uid, client) => {
          if (uid === userId && client !== ws && client.readyState === 1) {
            client.send(JSON.stringify(msg));
          }
        });
      } catch {}
    });

    ws.on('close', () => clients.delete(ws));

    // Send welcome
    ws.send(JSON.stringify({
      title: 'Connected',
      message: 'Real-time notifications active.',
      type: 'success'
    }));
  });

  function broadcast(userId, message) {
    clients.forEach((uid, client) => {
      if (uid === userId && client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    });
  }

  function broadcastAll(message) {
    clients.forEach((uid, client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    });
  }

  return { wss, broadcast, broadcastAll };
}

module.exports = { createWebSocketServer };
