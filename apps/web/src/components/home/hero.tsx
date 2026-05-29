'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Button } from '@org/ui/components/ui/button';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function Hero() {
  const router = useRouter();
  const [handle, setHandle] = useState('');

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');
    if (cleanHandle) {
      router.push(`/auth?claim=${cleanHandle}`);
    } else {
      router.push('/auth');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="lg:col-span-7 space-y-8 text-left"
    >
      {/* Tagline Badge */}
      <motion.div
        variants={fadeInUp}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5 text-yellow-600 dark:text-yellow-400 text-xs font-semibold"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Made for Creators & Businesses</span>
      </motion.div>

      <motion.h1
        variants={fadeInUp}
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.05]"
      >
        One Link to <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400 drop-shadow-[0_2px_10px_rgba(234,179,8,0.2)] dark:from-yellow-400 dark:via-amber-400 dark:to-yellow-300">
          Lynq Everything.
        </span>
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        className="text-lg md:text-xl text-zinc-650 dark:text-zinc-400 max-w-lg font-light leading-relaxed"
      >
        Create customizable landing pages, display links beautifully, and configure neon-accented, glassmorphic, or minimal templates instantly.
      </motion.p>

      {/* Handle Claim Form */}
      <motion.form
        variants={fadeInUp}
        onSubmit={handleClaim}
        className="flex flex-col sm:flex-row gap-3 max-w-md"
      >
        <div className="relative flex-1 group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-650 font-medium group-focus-within:text-yellow-500/50 transition-colors">
            lynq.me/
          </span>
          <input
            type="text"
            placeholder="username"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full pl-[76px] pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-medium focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
            required
          />
        </div>
        <Button
          type="submit"
          className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold px-6 py-3.5 h-auto rounded-xl flex items-center justify-center gap-2 group transition-all"
        >
          Claim My Link
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.form>

      {/* Core highlights */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-xs font-medium text-zinc-500"
      >
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
          Custom Themes
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
          Clean Block Layouts
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
          Dynamic Previews
        </div>
      </motion.div>
    </motion.div>
  );
}
