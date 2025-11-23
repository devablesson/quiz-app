"use client";

import { useState, useMemo } from 'react';
import type { QuizDetail, SubmitQuizResult } from '@/lib/types';
import { submitQuiz } from '@/lib/api';
import { StatusMessage } from './StatusMessage';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Progress } from './ui/Progress';

interface Props {
  quiz: QuizDetail;
}

export function QuizRunner({ quiz }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitQuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (quiz.questions.some((q) => !answers[q.id])) {
      setError('Please answer every question before submitting.');
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        answers: quiz.questions.map((q) => ({
          questionId: q.id,
          selectedOption: answers[q.id],
        })),
      };
      const submission = await submitQuiz(String(quiz.id), payload);
      setResult(submission);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const renderChoices = (questionId: number, questionIdx: number) => {
    const opts = (quiz.questions[questionIdx].options?.choices as string[]) ?? [];
    return (
      <div className="grid gap-2">
        {opts.map((choice) => (
          <label
            key={choice}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <input
              type="radio"
              className="accent-blue-600"
              name={`question-${questionId}`}
              value={choice}
              checked={answers[questionId] === choice}
              onChange={() => handleSelect(questionId, choice)}
            />
            <span>{choice}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderInput = (questionId: number) => (
    <input
      type="text"
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={answers[questionId] ?? ''}
      onChange={(e) => handleSelect(questionId, e.target.value)}
      placeholder="Type your answer"
    />
  );

  const answeredCount = useMemo(() => Object.keys(answers).filter(id => !!answers[Number(id)]).length, [answers]);
  const progressValue = (answeredCount / quiz.questions.length) * 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-600">Progress</p>
          <span className="text-xs font-semibold text-gray-500">
            {answeredCount}/{quiz.questions.length} answered
          </span>
        </div>
        <Progress value={progressValue} />
      </Card>

      {quiz.questions.map((question, idx) => (
        <Card key={question.id} className="p-6 space-y-5">
          <p className="text-xs font-semibold tracking-wide text-[color:var(--accent)] uppercase">Question {idx + 1}</p>
          <h3 className="text-base font-medium text-gray-900 leading-relaxed">{question.text}</h3>
          {Array.isArray(question.options?.choices) ? renderChoices(question.id, idx) : renderInput(question.id)}
        </Card>
      ))}

      {error && <StatusMessage type="error" message={error} />}
      {result && (
        <StatusMessage
          type="success"
          message={`Score: ${result.correct}/${result.totalQuestions} (${result.scorePercentage}%)`}
        />
      )}

      <Button
        type="submit"
        loading={submitting}
        className="w-full pressable"
      >
        {submitting ? 'Submitting…' : 'Submit Answers'}
      </Button>
    </form>
  );
}
