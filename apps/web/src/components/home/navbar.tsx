'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@org/ui/components/ui/button';
import { ThemeToggle } from '../theme-toggle';

export function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 bg-white/40 dark:bg-black/40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-zinc-900 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-extrabold rotate-6">
            L
          </div>
          LYNQ
        </div>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            onClick={() => router.push('/auth')}
            className="bg-yellow-400 text-black hover:bg-yellow-300 font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Claim My Lynq
          </Button>
        </nav>
      </div>
    </header>
  );
}
