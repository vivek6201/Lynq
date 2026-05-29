'use client';

import React from 'react';
import { motion, type Variants } from 'motion/react';

interface RedirectCountdownStepProps {
  countdown: number;
  slideVariants: Variants;
  custom: number;
}

export function RedirectCountdownStep({ countdown, slideVariants, custom }: RedirectCountdownStepProps) {
  return (
    <motion.div
      key="redirect-countdown"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      custom={custom}
      className="space-y-8 text-center py-4"
    >
      {/* Circular SVG Timer */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="48"
            stroke="currentColor"
            className="text-zinc-100 dark:text-zinc-900"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="56"
            cy="56"
            r="48"
            stroke="#facc15"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 48}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: (2 * Math.PI * 48) * (1 - countdown / 3) }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
        <div className="absolute text-3xl font-black text-zinc-900 dark:text-white font-mono">
          {countdown}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Welcome to LYNQ! 🎉
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light leading-relaxed max-w-xs mx-auto">
          Creating secure session credentials. Redirecting you to your profile dashboard...
        </p>
      </div>
    </motion.div>
  );
}
