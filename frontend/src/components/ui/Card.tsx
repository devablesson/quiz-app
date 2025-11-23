import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  subtle?: boolean;
}

export function Card({ className, children, subtle = false, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl bg-white shadow-sm ring-1 ring-[color:var(--border)] transition hover:shadow-md',
        subtle && 'bg-[color:var(--card-muted)]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> { children: React.ReactNode }

export function CardHeader({ children, className, ...rest }: SectionProps) {
  return <div className={clsx("px-4 py-4 md:px-6 md:py-5 border-b border-gray-100", className)} {...rest}>{children}</div>;
}
export function CardTitle({ children, className, ...rest }: SectionProps) {
  return <h2 className={clsx("text-lg font-semibold tracking-tight text-gray-800", className)} {...rest}>{children}</h2>;
}
export function CardBody({ children, className, ...rest }: SectionProps) {
  return <div className={clsx("px-4 py-4 md:px-6 md:py-5 space-y-4", className)} {...rest}>{children}</div>;
}
export function CardFooter({ children, className, ...rest }: SectionProps) {
  return <div className={clsx("px-4 py-3 md:px-6 md:py-4 border-t border-gray-100", className)} {...rest}>{children}</div>;
}
