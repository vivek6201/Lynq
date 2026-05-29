'use client';

import React from 'react';
import { User, Check, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@org/ui/components/ui/button';
import { motion, type Variants } from 'motion/react';
import { Input } from '@org/ui/components/ui/input';

interface UsernameSelectStepProps {
  username: string;
  setUsername: (username: string) => void;
  isLoading: boolean;
  isUsernameValid: boolean;
  setIsUsernameValid: (val: boolean) => void;
  handleUsernameSubmit: (e: React.FormEvent) => void | Promise<void>;
  slideVariants: Variants;
  custom: number;
}

export function UsernameSelectStep({
  username,
  setUsername,
  isLoading,
  isUsernameValid,
  setIsUsernameValid,
  handleUsernameSubmit,
  slideVariants,
  custom,
}: UsernameSelectStepProps) {
  return (
    <motion.div
      key="username-select"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      custom={custom}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mx-auto border border-yellow-400/20">
          <User className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Choose Your Handle ✨
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light mt-1.5">
          Set your custom LYNQ handle. You can change this later.
        </p>
      </div>

      {/* Username Claim Form */}
      <form onSubmit={handleUsernameSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="relative group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-sm font-semibold select-none">
              lynq.me/
            </span>
            <Input
              type="text"
              placeholder="handle"
              value={username}
              onChange={(e) => {
                const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                setUsername(clean);
                setIsUsernameValid(clean.length >= 3);
              }}
              required
              disabled={isLoading}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-[72px] pr-10 py-3 text-sm text-zinc-900 dark:text-white focus:border-yellow-400 dark:focus:border-yellow-400 focus-visible:ring-1 focus-visible:ring-yellow-400/20 focus-visible:ring-offset-0 outline-none transition-all font-semibold h-auto"
            />
            {username.length >= 3 && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-650 dark:text-emerald-500" />
            )}
          </div>
          {!isUsernameValid && username.length > 0 && (
            <p className="text-[10px] text-red-500 font-light pl-1">
              Handle must be at least 3 characters.
            </p>
          )}
          {username.length >= 3 && (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-light pl-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Handle available!
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !isUsernameValid || username.length < 3}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-extrabold py-3 h-11 text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Complete Setup
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
