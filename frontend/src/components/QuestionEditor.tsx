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
    <div className="rounded-2xl ring-1 ring-[color:var(--border)] bg-white shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-black tracking-tight">Question</h3>
        <button
          type="button"
          onClick={() => onRemove(question.id)}
          className="inline-flex items-center rounded-xl border border-gray-400 px-3 py-1 text-xs font-medium text-black hover:bg-gray-100 transition"
        >
          Remove
        </button>
      </div>
      <label className="block text-sm font-medium text-black">
        Prompt
        <textarea
          className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-700 focus:border-[color:var(--border-strong)]"
          value={question.text}
          onChange={(e) => update({ text: e.target.value })}
          placeholder="Enter question prompt"
          required
        />
      </label>
      <label className="block text-sm font-medium text-black">
        Type
        <select
          className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm text-black focus:border-[color:var(--border-strong)]"
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
            <option key={opt.value} value={opt.value} className="text-black bg-white">
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {(question.type === 'MCQ' || question.type === 'TRUE_FALSE') && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-black">Choices</p>
          {mcqChoices.map((choice, idx) => (
            <input
              key={idx}
              type="text"
              className="w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm text-black placeholder:text-gray-700 focus:border-[color:var(--border-strong)]"
              value={choice}
              onChange={(e) => updateMcqChoice(e.target.value, idx)}
            />
          ))}
        </div>
      )}

      {question.type === 'TEXT' && (
        <label className="block text-sm font-medium text-black">
          Reference Answer (optional)
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm text-black placeholder:text-gray-700 focus:border-[color:var(--border-strong)]"
            value={(question.options.reference as string) ?? ''}
            onChange={(e) => update({ options: { ...question.options, reference: e.target.value } })}
            placeholder="Used for evaluation"
          />
        </label>
      )}

      <label className="block text-sm font-medium text-black">
        Correct Option
        {(question.type === 'MCQ' || question.type === 'TRUE_FALSE') ? (
          <select
            className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm text-black focus:border-[color:var(--border-strong)]"
            value={question.correct_option}
            onChange={(e) => update({ correct_option: e.target.value })}
            required
          >
            <option value="" className="text-black bg-white">Select the correct answer</option>
            {mcqChoices.map((choice, idx) => {
              const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
              const key = keys[idx];
              return (
                <option key={key} value={key} className="text-black bg-white">
                  {key.toUpperCase()}: {choice}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-2 text-sm text-black placeholder:text-gray-700 focus:border-[color:var(--border-strong)]"
            value={question.correct_option}
            onChange={(e) => update({ correct_option: e.target.value })}
            placeholder="Enter the reference answer"
            required
          />
        )}
      </label>
    </div>
  );
}
