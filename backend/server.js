import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS to allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://quiz-fdej4ecxa-devaas-projects-2d471862.vercel.app',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace('*', '')))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now, restrict later
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','x-admin-token'],
  credentials: true
}));// Mount quiz routes
app.use('/api/quizzes', quizRoutes);
// Health check
app.get('/api/health', async (req, res) => {
    try {
        res.json({ status: 'ok' });
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
    }
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const basePort = Number(process.env.PORT) || 4000;

function start(port) {
    const server = app.listen(port, () => console.log(`Server running on ${port}`));
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            const next = port + 1;
            console.warn(`Port ${port} in use. Retrying on ${next}...`);
            start(next);
        } else {
            console.error('Server failed to start:', err);
        }
    });
}

start(basePort);