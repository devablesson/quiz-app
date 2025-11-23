import Link from 'next/link';
import { fetchQuizzes } from '@/lib/api';
import { QuizCard } from '@/components/QuizCard';
import { StatusMessage } from '@/components/StatusMessage';
import type { QuizSummary } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export default async function HomePage() {
  let quizzes: QuizSummary[] = [];
  let error = '';
  try {
    quizzes = await fetchQuizzes();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load quizzes';
  }

  return (
    <main className="app-container flex flex-col gap-8 py-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Explore Quizzes</h1>
        <p className="text-sm text-gray-600">Pick a quiz and start learning. Create more from the admin dashboard.</p>
        <Button asChild variant="secondary" className="pressable">
          <Link href="/admin">Go to Admin</Link>
        </Button>
      </div>

      {error && <StatusMessage type="error" message={error} />}
      {!error && quizzes.length === 0 && (
        <StatusMessage type="info" message="No quizzes yet. Create one from the admin page." />
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </main>
  );
}