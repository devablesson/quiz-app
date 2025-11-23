"use client";
import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-200/70">
      <div className="mx-auto max-w-5xl px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-800">
          <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">Q</div>
          <span className="tracking-tight">Quiz Manager</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition">Home</Link>
          <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
