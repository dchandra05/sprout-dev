function alpacaHeaders() {
  return {
    'APCA-API-KEY-ID': process.env.ALPACA_KEY,
    'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET
  };
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: alpacaHeaders() });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export function attachAlpacaRestRoutes(app) {
  const DATA = process.env.ALPACA_DATA_BASE || 'https://data.alpaca.markets';
  const PAPER = process.env.ALPACA_PAPER_BASE || 'https://paper-api.alpaca.markets';

  // 1) Historical bars for charting
  // Alpaca provides stock bars endpoints under data.alpaca.markets (see Alpaca API collections/docs). :contentReference[oaicite:4]{index=4}
  app.get('/api/market/bars', async (req, res) => {
    try {
      const symbol = String(req.query.symbol || 'AAPL').toUpperCase();
      const timeframe = String(req.query.timeframe || '1Min'); // 1Min, 5Min, 15Min, 1Hour, 1Day
      const start = req.query.start ? String(req.query.start) : null;
      const end = req.query.end ? String(req.query.end) : null;
      const limit = Number(req.query.limit || 500);
      const feed = String(req.query.feed || 'delayed_sip'); // match your plan/feed

      const qs = new URLSearchParams({
        timeframe,
        limit: String(limit),
        feed
      });
      if (start) qs.set('start', start);
      if (end) qs.set('end', end);

      const url = `${DATA}/v2/stocks/${encodeURIComponent(symbol)}/bars?${qs.toString()}`;
      const data = await fetchJson(url);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // 2) Quick “snapshot” (handy for last price / daily change without waiting for stream)
  app.get('/api/market/snapshot', async (req, res) => {
    try {
      const symbol = String(req.query.symbol || 'AAPL').toUpperCase();
      const feed = String(req.query.feed || 'delayed_sip');
      const url = `${DATA}/v2/stocks/${encodeURIComponent(symbol)}/snapshot?feed=${encodeURIComponent(feed)}`;
      const data = await fetchJson(url);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // 3) Paper trading account
  app.get('/api/paper/account', async (req, res) => {
    try {
      const url = `${PAPER}/v2/account`;
      const data = await fetchJson(url);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // 4) Paper positions
  app.get('/api/paper/positions', async (req, res) => {
    try {
      const url = `${PAPER}/v2/positions`;
      const data = await fetchJson(url);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // 5) Place paper order (market order by default)
  app.post('/api/paper/order', async (req, res) => {
    try {
      const body = req.body || {};
      const payload = {
        symbol: String(body.symbol).toUpperCase(),
        qty: String(body.qty || '1'),
        side: body.side === 'sell' ? 'sell' : 'buy',
        type: body.type || 'market',
        time_in_force: body.time_in_force || 'day'
      };

      const orderRes = await fetch(`${PAPER}/v2/orders`, {
        method: 'POST',
        headers: { ...alpacaHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!orderRes.ok) {
        const text = await orderRes.text().catch(() => '');
        throw new Error(`${orderRes.status} ${orderRes.statusText} ${text}`);
      }

      res.json(await orderRes.json());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
