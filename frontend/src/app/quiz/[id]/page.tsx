import Link from 'next/link';
import { fetchQuiz } from '@/lib/api';
import type { QuizDetail } from '@/lib/types';
import { StatusMessage } from '@/components/StatusMessage';
import { QuizRunner } from '@/components/QuizRunner';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: Props) {
  const { id } = await params;
  let quiz: QuizDetail | null = null;
  let error = '';
  try {
    quiz = await fetchQuiz(id);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load quiz';
  }

  return (
    <main className="app-container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="heading-lg text-white">{quiz?.title ?? 'Quiz'}</h1>
        <Button asChild variant="secondary" className="pressable">
          <Link href="/">← Back</Link>
        </Button>
      </div>
      {error && <StatusMessage type="error" message={error} />}
      {quiz && (
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardBody>
            <QuizRunner quiz={quiz} />
          </CardBody>
        </Card>
      )}
    </main>
  );
}
