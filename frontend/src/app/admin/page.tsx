"use client";

import { useState } from 'react';
import { createQuiz } from '@/lib/api';
import type { CreateQuizPayload } from '@/lib/types';
import { QuestionEditor, type EditableQuestion } from '@/components/QuestionEditor';
import { StatusMessage } from '@/components/StatusMessage';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from '@/components/ui/Card';

function buildQuestion(): EditableQuestion {
  return {
    id: crypto.randomUUID(),
    text: '',
    type: 'MCQ',
    options: { choices: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] },
    correct_option: '',
  };
}

export default function AdminPage() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<EditableQuestion[]>([buildQuestion()]);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateQuestion = (updated: EditableQuestion) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, buildQuestion()]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    if (!title.trim()) {
      setStatus({ type: 'error', msg: 'Title is required.' });
      return;
    }
    if (questions.some((q) => !q.text.trim() || !q.correct_option.trim())) {
      setStatus({ type: 'error', msg: 'Each question needs text and a correct option.' });
      return;
    }

    const payload: CreateQuizPayload = {
      title: title.trim(),
      questions: questions.map(({ text, type, options, correct_option }) => ({
        text: text.trim(),
        type,
        options,
        correct_option: correct_option.trim(),
      })),
    };

    try {
      setSubmitting(true);
      await createQuiz(payload);
      setStatus({ type: 'success', msg: 'Quiz created successfully!' });
      setTitle('');
      setQuestions([buildQuestion()]);
    } catch (err) {
      setStatus({ type: 'error', msg: err instanceof Error ? err.message : 'Failed to create quiz' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="app-container py-10 space-y-8">
      <div className="space-y-3">
        <h1 className="heading-lg">Create a New Quiz</h1>
        <p className="text-sm text-muted">Publish quizzes instantly. Provide clear questions and correct answers.</p>
      </div>
      {status && <StatusMessage type={status.type} message={status.msg} onClose={() => setStatus(null)} />}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardBody>
            <label className="block text-sm font-medium text-gray-700">
              Title
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm focus:border-[color:var(--border-strong)]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </label>
            <div className="space-y-5">
              {questions.map((question) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  onChange={updateQuestion}
                  onRemove={removeQuestion}
                />
              ))}
              <Button type="button" variant="secondary" onClick={addQuestion} className="w-full">
                Add Question
              </Button>
            </div>
          </CardBody>
          <CardFooter>
            <Button type="submit" loading={submitting} className="w-full">
              {submitting ? 'Saving…' : 'Publish Quiz'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
