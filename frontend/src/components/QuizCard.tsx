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
          <p className="mt-1 text-xs tracking-wide text-black">ID: {quiz.id}</p>
        </div>
        <Button asChild variant="primary" className="pressable scale-[.98] group-hover:scale-100">
          <Link href={`/quiz/${quiz.id}`}>Take Quiz</Link>
        </Button>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-black leading-relaxed">Challenge yourself with this quiz. Click Take Quiz to begin.</p>
      </CardBody>
    </Card>
  );
}
