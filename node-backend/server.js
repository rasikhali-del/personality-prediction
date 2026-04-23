import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import resultsRoutes from './routes/results.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/admin', adminRoutes);

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'personality-node-backend',
    version: '1.0.0',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log(`║  🚀  Node.js Backend on port ${PORT}      ║`);
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  POST  /api/auth/register                ║');
  console.log('║  POST  /api/auth/login                   ║');
  console.log('║  GET   /api/auth/me                      ║');
  console.log('║  POST  /api/results/save                 ║');
  console.log('║  GET   /api/results                      ║');
  console.log('║  GET   /api/admin/stats                  ║');
  console.log('║  GET   /api/admin/users                  ║');
  console.log('║  GET   /api/admin/users/:id              ║');
  console.log('║  GET   /api/admin/results                ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});
