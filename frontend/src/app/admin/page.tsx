"use client";

import { useState } from 'react';
import { createQuiz } from '@/lib/api';
import type { CreateQuizPayload } from '@/lib/types';
import { QuestionEditor, type EditableQuestion } from '@/components/QuestionEditor';
import { StatusMessage } from '@/components/StatusMessage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
    <main className="app-container space-y-8 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Create a New Quiz</h1>
        <p className="text-sm text-gray-600">Publish quizzes instantly. Provide clear questions and correct answers.</p>
      </div>

      {status && <StatusMessage type={status.type} message={status.msg} onClose={() => setStatus(null)} />}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
            />
          </label>
        </Card>
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionEditor
              key={question.id}
              question={question}
              onChange={updateQuestion}
              onRemove={removeQuestion}
            />
          ))}
          <Button type="button" onClick={addQuestion} variant="secondary" className="pressable">
            Add Question
          </Button>
        </div>
        <Button type="submit" loading={submitting} className="w-full pressable">
          {submitting ? 'Saving…' : 'Publish Quiz'}
        </Button>
      </form>
    </main>
  );
}
