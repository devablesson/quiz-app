import { query, transaction } from '../db.js';

// SQL snippets
const INSERT_QUIZ = 'INSERT INTO quizzes (title) VALUES ($1) RETURNING id, title';
const INSERT_QUESTION = 'INSERT INTO questions (quiz_id, text, options, correct_option) VALUES ($1,$2,$3,$4) RETURNING id';
const SELECT_QUIZZES = 'SELECT id, title FROM quizzes ORDER BY id DESC';
const SELECT_QUIZ_WITH_QS = `SELECT q.id, q.title, json_agg(json_build_object('id', qs.id, 'text', qs.text, 'options', qs.options)) AS questions
FROM quizzes q
JOIN questions qs ON qs.quiz_id = q.id
WHERE q.id = $1
GROUP BY q.id`;
const SELECT_Q_CORRECT = 'SELECT id, correct_option FROM questions WHERE quiz_id = $1 AND id = ANY($2::int[])';

export async function createQuiz(req, res, next) {
  try {
    const { title, questions } = req.body; // questions: [{text, options: {...}, correct_option}]
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'title and questions[] required' });
    }
    const result = await transaction(async (tx) => {
      const quizRows = await tx(INSERT_QUIZ, title);
      const quizId = quizRows[0].id;
      for (const q of questions) {
        if (!q.text || !q.options || !q.correct_option) {
          throw new Error('Each question needs text, options, correct_option');
        }
        await tx(INSERT_QUESTION, quizId, q.text, q.options, q.correct_option);
      }
      return quizId;
    });
    const quiz = await query('SELECT id, title FROM quizzes WHERE id = $1', [result]);
    res.status(201).json({ quiz: quiz[0] });
  } catch (err) {
    next(err);
  }
}

export async function getQuizzes(req, res, next) {
  try {
    const rows = await query(SELECT_QUIZZES, []);
    res.json({ quizzes: rows });
  } catch (err) {
    next(err);
  }
}

export async function getQuizById(req, res, next) {
  try {
    const { id } = req.params;
    const rows = await query(SELECT_QUIZ_WITH_QS, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ quiz: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function submitQuiz(req, res, next) {
  try {
    const { id } = req.params;
    const { answers } = req.body; // answers: [{questionId, selectedOption}]
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers[] required' });
    }
    const questionIds = answers.map(a => a.questionId);
    const rows = await query(SELECT_Q_CORRECT, [id, questionIds]);
    if (rows.length === 0) return res.status(404).json({ error: 'Quiz or questions not found' });
    const correctMap = new Map(rows.map(r => [r.id, r.correct_option]));
    let correctCount = 0;
    for (const ans of answers) {
      if (correctMap.get(ans.questionId) === ans.selectedOption) correctCount++;
    }
    const total = rows.length;
    const scorePct = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    res.json({ quizId: Number(id), totalQuestions: total, correct: correctCount, scorePercentage: scorePct });
  } catch (err) {
    next(err);
  }
}
