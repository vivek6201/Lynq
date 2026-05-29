'use client';

import React from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@org/ui/components/ui/button';
import { motion, type Variants } from 'motion/react';
import { Input } from '@org/ui/components/ui/input';

interface EmailInputStepProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  isGoogleFlow: boolean;
  handleEmailSubmit: (e: React.FormEvent) => void;
  handleGoogleClick: () => void;
  onSkip: () => void;
  slideVariants: Variants;
  custom: number;
}

export function EmailInputStep({
  email,
  setEmail,
  isLoading,
  isGoogleFlow,
  handleEmailSubmit,
  handleGoogleClick,
  onSkip,
  slideVariants,
  custom,
}: EmailInputStepProps) {
  return (
    <motion.div
      key="email-input"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      custom={custom}
      className="space-y-6"
    >
      {/* Logo block */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Welcome 👋 Let's Get started!
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light mt-1.5">
          Log in or create your profile handle instantly.
        </p>
      </div>

      {/* Email Input Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="relative group">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 group-focus-within:text-yellow-500 transition-colors" />
          <Input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:border-yellow-400 dark:focus:border-yellow-400 focus-visible:ring-1 focus-visible:ring-yellow-400/20 focus-visible:ring-offset-0 outline-none transition-all h-auto"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-extrabold py-3 h-11 text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          {isLoading && !isGoogleFlow ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-700 text-[10px] uppercase font-bold tracking-widest">
        <div className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-850" />
        <span>or</span>
        <div className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-850" />
      </div>

      {/* Google OAuth Option */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isLoading}
        className="w-full bg-white dark:bg-zinc-900/60 border hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-bold py-3 h-11 text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm dark:shadow-none"
      >
        {isLoading && isGoogleFlow ? (
          <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      {/* Sub-label support */}
      <div className="text-[10px] text-center text-zinc-400 dark:text-zinc-650 font-medium">
        OTP login: 1-Day session &nbsp;|&nbsp; Google login: 30-Day session
      </div>

      {/* Skip Link */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-zinc-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-bold"
        >
          Skip & continue to Home
        </button>
      </div>
    </motion.div>
  );
}
