"use client";

import { useMemo } from 'react';
import { QuestionKind } from '@/lib/types';

export interface EditableQuestion {
  id: string;
  text: string;
  type: QuestionKind;
  options: Record<string, unknown>;
  correct_option: string;
}

interface Props {
  question: EditableQuestion;
  onChange: (question: EditableQuestion) => void;
  onRemove: (id: string) => void;
}

const typeOptions: { label: string; value: QuestionKind }[] = [
  { label: 'Multiple Choice', value: 'MCQ' },
  { label: 'True / False', value: 'TRUE_FALSE' },
  { label: 'Short Text', value: 'TEXT' },
];

export function QuestionEditor({ question, onChange, onRemove }: Props) {
  const mcqChoices = useMemo(() => {
    const stored = question.options.choices as string[] | undefined;
    if (stored && Array.isArray(stored)) return stored;
    return ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  }, [question.options]);

  const update = (patch: Partial<EditableQuestion>) => {
    onChange({ ...question, ...patch });
  };

  const updateMcqChoice = (value: string, idx: number) => {
    const updated = [...mcqChoices];
    updated[idx] = value;
    update({ options: { ...question.options, choices: updated } });
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Question</h3>
        <button
          type="button"
          onClick={() => onRemove(question.id)}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Remove
        </button>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        Prompt
        <textarea
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={question.text}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Enter question prompt"
          required
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Type
        <select
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={question.type}
          onChange={(e) => {
            const nextType = e.target.value as QuestionKind;
            const defaults: Record<QuestionKind, Record<string, unknown>> = {
              MCQ: { choices: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] },
              TRUE_FALSE: { choices: ['True', 'False'] },
              TEXT: { placeholder: 'Type your answer' },
            };
            update({ type: nextType, options: defaults[nextType], correct_option: '' });
          }}
        >
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {question.type === 'MCQ' && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Choices</p>
          {mcqChoices.map((choice, idx) => (
            <input
              key={idx}
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={choice}
              onChange={(e) => updateMcqChoice(e.target.value, idx)}
            />
          ))}
        </div>
      )}

      {question.type === 'TEXT' && (
        <label className="block text-sm font-medium text-slate-700">
          Reference Answer (optional)
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={(question.options.reference as string) ?? ''}
            onChange={(e) => update({ options: { ...question.options, reference: e.target.value } })}
            placeholder="Used for evaluation"
          />
        </label>
      )}

      <label className="block text-sm font-medium text-slate-700">
        Correct Option
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={question.correct_option}
          onChange={(e) => update({ correct_option: e.target.value })}
          placeholder="Match exactly one of the options"
          required
        />
      </label>
    </div>
  );
}
