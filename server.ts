import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import createCashfreeOrderHandler from './api/create-cashfree-order.ts';
import verifyCashfreeOrderHandler from './api/verify-cashfree-order.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const distPath = path.resolve(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production';
// Cloud Run in production uses process.env.PORT (typically 8080).
// In development, AI Studio dev server runs on port 3000.
const port = Number(process.env.PORT) || (isProduction ? 8080 : 3000);

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Container health check endpoints for Cloud Run liveness/readiness probes
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'NestFinder', env: process.env.NODE_ENV || 'production', timestamp: new Date().toISOString() });
});
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'NestFinder', env: process.env.NODE_ENV || 'production', timestamp: new Date().toISOString() });
});

// API Routes
app.all('/api/create-cashfree-order', async (req, res) => {
  try {
    await createCashfreeOrderHandler(req, res);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

app.all('/api/verify-cashfree-order', async (req, res) => {
  try {
    await verifyCashfreeOrderHandler(req, res);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// Serve frontend in production or development
if (isProduction && fs.existsSync(distPath)) {
  // Serve static assets from built Vite directory
  app.use(express.static(distPath));
  // Single-Page Application client routing fallback
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // In development, dynamically load and mount Vite middleware
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`NestFinder server listening on http://0.0.0.0:${port} [mode: ${isProduction ? 'production' : 'development'}]`);
});
