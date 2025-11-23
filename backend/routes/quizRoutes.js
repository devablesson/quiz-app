import { Router } from 'express';
import { createQuiz, getQuizzes, getQuizById, submitQuiz } from '../controllers/quizController.js';

const router = Router();

router.post('/', createQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);

export default router;
