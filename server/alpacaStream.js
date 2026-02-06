import WebSocket from 'ws';

/**
 * Browser clients connect to: ws://localhost:8787/ws/market
 * They send:
 *  { "type":"subscribe", "trades":["AAPL"], "quotes":["AAPL"], "bars":["AAPL"] }
 *
 * Server relays to Alpaca Market Data Stream:
 *  wss://stream.data.alpaca.markets/{version}/{feed}
 */
export function attachMarketDataWebSocket(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer, path: '/ws/market' });

  wss.on('connection', (client) => {
    let alpaca = null;

    const openAlpaca = () => {
      const feed = process.env.ALPACA_STREAM_FEED || 'v2/iex';
      const url = `wss://stream.data.alpaca.markets/${feed}`;

      alpaca = new WebSocket(url);

      alpaca.on('open', () => {
        // Auth format documented by Alpaca (action: "auth" with key/secret) :contentReference[oaicite:2]{index=2}
        alpaca.send(JSON.stringify({
          action: 'auth',
          key: process.env.ALPACA_KEY,
          secret: process.env.ALPACA_SECRET
        }));
      });

      alpaca.on('message', (raw) => {
        // Forward everything Alpaca sends to the browser
        try { client.send(raw.toString()); } catch {}
      });

      alpaca.on('close', () => {
        alpaca = null;
      });

      alpaca.on('error', () => {
        // Let the browser keep going; they can reconnect
        alpaca = null;
      });
    };

    openAlpaca();

    client.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw.toString()); } catch { return; }

      // Browser -> Server subscription
      if (msg?.type === 'subscribe') {
        if (!alpaca || alpaca.readyState !== WebSocket.OPEN) {
          // Re-open if needed
          openAlpaca();
          return;
        }

        // Alpaca expects {"action":"subscribe", ...channels...} :contentReference[oaicite:3]{index=3}
        const payload = {
          action: 'subscribe',
          trades: msg.trades || [],
          quotes: msg.quotes || [],
          bars: msg.bars || [],
          updatedBars: msg.updatedBars || [],
          dailyBars: msg.dailyBars || []
        };

        alpaca.send(JSON.stringify(payload));
      }
    });

    client.on('close', () => {
      try { alpaca?.close(); } catch {}
      alpaca = null;
    });
  });
}
