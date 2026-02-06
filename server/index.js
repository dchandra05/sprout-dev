import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

import { attachMarketDataWebSocket } from './alpacaStream.js';
import { attachAlpacaRestRoutes } from './alpacaRest.js';

const app = express();
app.use(cors());
app.use(express.json());

attachAlpacaRestRoutes(app);

const httpServer = createServer(app);
attachMarketDataWebSocket(httpServer);

const port = Number(process.env.PORT || 8787);
httpServer.listen(port, () => {
  console.log(`Alpaca relay listening on http://localhost:${port}`);
});
