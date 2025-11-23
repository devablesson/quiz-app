import { CreateQuizPayload, QuizDetail, QuizSummary, SubmitQuizPayload, SubmitQuizResult } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? '';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchQuizzes(): Promise<QuizSummary[]> {
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL not configured');
  const res = await fetch(`${API_URL}/api/quizzes`, { cache: 'no-store' });
  const data = await handleResponse<{ quizzes: QuizSummary[] }>(res);
  return data.quizzes ?? [];
}

export async function fetchQuiz(id: string): Promise<QuizDetail> {
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL not configured');
  const res = await fetch(`${API_URL}/api/quizzes/${id}`, { cache: 'no-store' });
  const data = await handleResponse<{ quiz: QuizDetail }>(res);
  return data.quiz;
}

export async function createQuiz(payload: CreateQuizPayload): Promise<QuizSummary> {
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL not configured');
  if (!ADMIN_TOKEN) throw new Error('NEXT_PUBLIC_ADMIN_TOKEN not configured');
  const res = await fetch(`${API_URL}/api/quizzes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': ADMIN_TOKEN,
    },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ quiz: QuizSummary }>(res);
  return data.quiz;
}

export async function submitQuiz(id: string, payload: SubmitQuizPayload): Promise<SubmitQuizResult> {
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL not configured');
  const res = await fetch(`${API_URL}/api/quizzes/${id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<SubmitQuizResult>(res);
}
