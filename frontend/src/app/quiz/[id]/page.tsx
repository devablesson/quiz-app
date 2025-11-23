"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { QuizCard } from '@/components/QuizCard';
import { StatusMessage } from '@/components/StatusMessage';
import { Button } from '@/components/ui/Button';
import type { QuizSummary } from '@/lib/types';

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    if (!API) {
      setError('API URL not configured');
      setLoading(false);
      return;
    }

    fetch(`${API}/api/quizzes`)
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load quizzes');
        setLoading(false);
      });
  }, []);

  return (
    <main className="app-container flex flex-col gap-8 py-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Explore Quizzes</h1>
        <p className="text-sm text-white">Pick a quiz and start learning. Create more from the admin dashboard.</p>
        <Button asChild variant="secondary" className="pressable">
          <Link href="/admin">Go to Admin</Link>
        </Button>
      </div>

      {loading && <StatusMessage type="info" message="Loading quizzes..." />}
      {error && <StatusMessage type="error" message={error} />}
      {!loading && !error && quizzes.length === 0 && (
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
