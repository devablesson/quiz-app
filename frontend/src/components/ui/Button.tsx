"use client";
import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  asChild?: boolean; // if true, do not render a native button, but enhance the single child element
}

const base = 'inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed pressable';
const variants: Record<string,string> = {
  primary: 'bg-[color:var(--accent)] hover:bg-[color:var(--accent-hover)] text-white shadow-sm hover:shadow-md',
  secondary: 'bg-[color:var(--card)] text-[color:var(--foreground)] border border-[color:var(--border)] hover:border-[color:var(--border-strong)] shadow-sm hover:shadow-md',
  danger: 'bg-red-600 hover:bg-red-500 text-white shadow-sm hover:shadow-md'
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', loading = false, className, children, asChild = false, ...rest } = props;

  const mergedClass = clsx(base, variants[variant], className);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
    const originalChildren = child.props.children;
    return React.cloneElement(
      child,
      {
        className: clsx(mergedClass, child.props.className),
        ...rest
      },
      loading
        ? [
            <span key="_spinner" className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />,
            originalChildren
          ]
        : originalChildren
    );
  }

  return (
    <button className={mergedClass} {...rest}>
      {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
      {children}
    </button>
  );
}
