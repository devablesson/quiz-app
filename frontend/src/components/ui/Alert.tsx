"use client";
import React from 'react';
import clsx from 'clsx';

interface AlertProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

const styles: Record<string,string> = {
  success: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  error: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
};

export function Alert({ type = 'info', message, onClose }: AlertProps) {
  return (
    <div className={clsx('rounded-xl px-4 py-3 text-sm font-medium flex items-start gap-3 shadow-sm', styles[type])}>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-xs opacity-70 hover:opacity-100 transition" aria-label="Close">
          ✕
        </button>
      )}
    </div>
  );
}
