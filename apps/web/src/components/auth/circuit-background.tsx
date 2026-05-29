'use client';

import React from 'react';

export function CircuitBackground() {
  return (
    <>
      {/* Visual Tech Circuit Line Overlay */}
      <svg className="absolute inset-0 w-full h-full text-zinc-200 dark:text-zinc-900/40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M -100,100 L 200,100 L 250,150 L 500,150 L 550,200 L 900,200" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M 100,600 L 300,600 L 350,550 L 600,550 L 650,600 L 1100,600" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M 800,-50 L 800,200 L 850,250 L 850,500 L 900,550 L 900,1100" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="250" cy="150" r="4" fill="currentColor" />
        <circle cx="550" cy="200" r="4" fill="currentColor" />
        <circle cx="350" cy="550" r="4" fill="currentColor" />
        <circle cx="650" cy="600" r="4" fill="currentColor" />
        <circle cx="850" cy="250" r="4" fill="currentColor" />
        <circle cx="900" cy="550" r="4" fill="currentColor" />
      </svg>

      {/* Decorative ambient glowing orbs */}
      <div className="absolute -top-40 left-1/4 w-[400px] h-[400px] bg-yellow-400/5 dark:bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
    </>
  );
}
