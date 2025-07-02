import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
app.use(express.json());

const server = app.listen(8080, () => {
  console.log('WebSocket server listening on port 8080');
});

const webSocketServer = new WebSocketServer({ server, path: '/ws-cafe' });

webSocketServer.on('connection', async (ws) => {
  const response = await fetch('http://localhost:3030/api/orders');
  ws.send(await response.text());
});

const sendOrders = (data) => {
  webSocketServer.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

app.post('/broadcast', (req, res) => {
  sendOrders(req.body);
  res.json({ success: 'broadcast' });
});