import Link from 'next/link';
import { fetchQuiz } from '@/lib/api';
import type { QuizDetail } from '@/lib/types';
import { StatusMessage } from '@/components/StatusMessage';
import { QuizRunner } from '@/components/QuizRunner';
import { Button } from '@/components/ui/Button';

interface Props {
  params: { id: string };
}

export default async function QuizPage({ params }: Props) {
  const { id } = params;
  let quiz: QuizDetail | null = null;
  let error = '';
  try {
    quiz = await fetchQuiz(id);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load quiz';
  }

  return (
    <main className="app-container space-y-8 py-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{quiz?.title ?? 'Quiz'}</h1>
        <Button as-child variant="secondary" className="pressable">
          <Link href="/">← Back to quizzes</Link>
        </Button>
      </div>
      {error && <StatusMessage type="error" message={error} />}
      {quiz && <QuizRunner quiz={quiz} />}
    </main>
  );
}
