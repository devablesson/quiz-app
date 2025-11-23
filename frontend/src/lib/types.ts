export type QuestionKind = 'MCQ' | 'TRUE_FALSE' | 'TEXT';

export interface QuizSummary {
  id: number;
  title: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: Record<string, unknown>;
}

export interface QuizDetail extends QuizSummary {
  questions: QuizQuestion[];
}

export interface CreateQuestionPayload {
  text: string;
  options: Record<string, unknown>;
  correct_option: string;
}

export interface CreateQuizPayload {
  title: string;
  questions: CreateQuestionPayload[];
}

export interface SubmitAnswerPayload {
  questionId: number;
  selectedOption: string;
}

export interface SubmitQuizPayload {
  answers: SubmitAnswerPayload[];
}

export interface SubmitQuizResult {
  quizId: number;
  totalQuestions: number;
  correct: number;
  scorePercentage: number;
}
