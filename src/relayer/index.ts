import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

const pendingTransfers = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected to relayer');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function broadcast(data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

app.post('/api/submit-proof', async (_req, res) => {
  try {
    const { proof, type } = _req.body;
    
    const transferId = generateTransferId();
    pendingTransfers.set(transferId, {
      proof,
      type,
      status: 'pending',
      timestamp: Date.now()
    });

    broadcast({
      event: 'proof-submitted',
      transferId,
      type
    });

    res.json({
      success: true,
      transferId,
      message: 'Proof submitted to relayer network'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/transfer/:id', (req, res) => {
  const transfer = pendingTransfers.get(req.params.id);
  
  if (!transfer) {
    return res.status(404).json({
      success: false,
      error: 'Transfer not found'
    });
  }

  res.json({
    success: true,
    transfer
  });
});

app.get('/api/status', (_req, res) => {
  res.json({
    success: true,
    status: {
      active: true,
      pendingTransfers: pendingTransfers.size,
      uptime: process.uptime(),
      timestamp: Date.now()
    }
  });
});

app.post('/api/verify-proof', async (_req, res) => {
  try {
    await delay(1000);
    
    const isValid = true;

    res.json({
      success: true,
      valid: isValid,
      timestamp: Date.now()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

function generateTransferId(): string {
  return 'transfer-' + Date.now() + '-' + Math.random().toString(36).substring(7);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const PORT = process.env.VITE_RELAYER_PORT || 8080;

server.listen(PORT, () => {
  console.log(`🔗 Relayer service running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
});
