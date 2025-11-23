import Link from 'next/link';
import { QuizSummary } from '@/lib/types';
import { Button } from './ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from './ui/Card';

interface Props { quiz: QuizSummary; }

export function QuizCard({ quiz }: Props) {
  return (
    <Card className="group">
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle>{quiz.title}</CardTitle>
          <p className="mt-1 text-xs tracking-wide text-gray-500">ID: {quiz.id}</p>
        </div>
        <Button as-child variant="primary" className="pressable scale-[.98] group-hover:scale-100">
          <Link href={`/quiz/${quiz.id}`}>Take Quiz</Link>
        </Button>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-600 leading-relaxed">Challenge yourself with this quiz. Click Take Quiz to begin.</p>
      </CardBody>
    </Card>
  );
}
