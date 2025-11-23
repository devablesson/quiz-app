"use client";
import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-black dark:text-black">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">Q</div>
          <span className="tracking-tight font-bold force-black">Quiz Manager</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-gray-700 hover:text-gray-900 transition">Home</Link>
          <Link href="/admin" className="text-gray-700 hover:text-gray-900 transition">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
