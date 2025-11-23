"use client";
import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed';
const variants: Record<string,string> = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow-md focus:ring-blue-500',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md focus:ring-gray-400',
  danger: 'bg-red-600 hover:bg-red-500 text-white shadow-sm hover:shadow-md focus:ring-red-500'
};

export function Button({ variant = 'primary', loading = false, className, children, ...rest }: ButtonProps) {
  return (
    <button className={clsx(base, variants[variant], className)} {...rest}>
      {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
      {children}
    </button>
  );
}
