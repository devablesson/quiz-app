import express from 'express';
import dotenv from 'dotenv';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Mount quiz routes
app.use('/api/quizzes', quizRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));