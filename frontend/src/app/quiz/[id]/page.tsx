"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StatusMessage } from '@/components/StatusMessage';
import { QuizRunner } from '@/components/QuizRunner';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import type { QuizDetail } from '@/lib/types';

export default function QuizDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    if (!API) {
      setError('API URL not configured');
      setLoading(false);
      return;
    }

    if (!id) {
      setError('Quiz ID is missing');
      setLoading(false);
      return;
    }

    fetch(`${API}/api/quizzes/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load quiz: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setQuiz(data.quiz || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
        setLoading(false);
      });
  }, [id]);

  return (
    <main className="app-container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="heading-lg text-white">{quiz?.title ?? 'Quiz'}</h1>
        <Button asChild variant="secondary" className="pressable">
          <Link href="/">← Back</Link>
        </Button>
      </div>
      
      {loading && <StatusMessage type="info" message="Loading quiz..." />}
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
