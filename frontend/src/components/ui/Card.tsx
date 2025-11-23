import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  subtle?: boolean;
}

export function Card({ className, children, subtle = false, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition hover:shadow-md',
        subtle && 'bg-gray-50',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-4 md:px-6 md:py-5 border-b border-gray-100">{children}</div>;
}
export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold tracking-tight text-gray-800">{children}</h2>;
}
export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-4 md:px-6 md:py-5 space-y-4">{children}</div>;
}
export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-100">{children}</div>;
}
