import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','x-admin-token'],
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