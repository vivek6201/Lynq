'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DEMO_THEMES } from './constants';
import {
  Sparkles,
  Palette,
  Share2,
  Play,
  Music,
  Zap,
  LineChart,
  TrendingUp,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function BentoFeatures() {
  const [bentoTheme, setBentoTheme] = useState<keyof typeof DEMO_THEMES>('yellow-neon');

  return (
    <section className="bg-zinc-50/30 dark:bg-zinc-950/20 border-t border-zinc-200 dark:border-zinc-900 py-24 relative overflow-hidden">
      {/* Soft grid background overlay for tech feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 dark:opacity-60 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 border border-yellow-400/20 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Features
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
            A Builder That Feels Alive
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-light text-base leading-relaxed">
            Ditch the static link directories. Create a dynamic profile with interactive widgets, real-time analytics, and modular custom styling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Block 1: Custom Theme Styler (Spans 2 cols) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="md:col-span-2 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-400/5 dark:bg-yellow-400/2 rounded-full blur-[80px] pointer-events-none group-hover:bg-yellow-400/10 dark:group-hover:bg-yellow-400/5 transition-all duration-500" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center border border-yellow-400/20">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Fluid Theme Customizer
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  Choose from gorgeous designer presets or customize buttons, shadows, and backgrounds to match your brand style.
                </p>
                
                {/* Local mini switcher */}
                <div className="flex gap-2 pt-2">
                  {(Object.keys(DEMO_THEMES) as Array<keyof typeof DEMO_THEMES>).map((tKey) => (
                    <button
                      key={tKey}
                      onClick={() => setBentoTheme(tKey)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        bentoTheme === tKey 
                          ? 'border-yellow-400 scale-110 shadow-md' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: 
                          tKey === 'yellow-neon' ? '#fbbf24' :
                          tKey === 'glass-retro' ? '#6366f1' :
                          tKey === 'dark-minimal' ? '#18181b' : '#34d399'
                      }}
                      title={DEMO_THEMES[tKey].name}
                    />
                  ))}
                </div>
              </div>

              {/* Simulated Customizer Display */}
              <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 relative min-h-[160px] flex flex-col justify-center items-center shadow-inner overflow-hidden">
                <div className="absolute top-2 left-3 flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>

                <div className="w-full max-w-[220px] space-y-3">
                  <div className="flex justify-center gap-2 mb-2">
                    <span className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  </div>
                  {/* Simulated styled button changing in real-time */}
                  <div className={`w-full py-3 px-4 text-center text-xs font-black uppercase tracking-wider transition-all duration-300 ${DEMO_THEMES[bentoTheme].buttonClass}`}>
                    Subscribe Now
                  </div>
                  <div className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 font-mono">
                    Theme: {DEMO_THEMES[bentoTheme].name}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Block 2: Social Embeds (Spans 1 col) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center border border-yellow-400/20">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
                  Social Smart Blocks
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  Embed interactive media feeds—videos, songs, feeds—natively without slowing down load times.
                </p>
              </div>
            </div>

            {/* Feed simulation list */}
            <div className="mt-8 space-y-2.5">
              {/* YouTube Mini Block */}
              <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/65 rounded-xl p-2.5 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-950 transition-colors cursor-pointer group/item">
                <div className="w-10 h-10 rounded-lg bg-red-600/10 text-red-600 dark:text-red-500 flex items-center justify-center border border-red-500/20 relative overflow-hidden">
                  <Play className="w-4 h-4 fill-red-600 dark:fill-red-500 relative z-10" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold truncate text-zinc-800 dark:text-zinc-200 group-hover/item:text-red-500 dark:group-hover/item:text-red-400 transition-colors">Latest Youtube Video</div>
                  <div className="text-[9px] text-zinc-400 dark:text-zinc-500">Play directly on page</div>
                </div>
              </div>

              {/* Spotify Mini Block */}
              <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/65 rounded-xl p-2.5 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-950 transition-colors cursor-pointer group/item">
                <div className="w-10 h-10 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Music className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold truncate text-zinc-800 dark:text-zinc-200 group-hover/item:text-emerald-500 dark:group-hover/item:text-emerald-400 transition-colors">Spotify Integration</div>
                  <div className="text-[9px] text-zinc-400 dark:text-zinc-500">Listen to latest single</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Block 3: Built for Speed (Spans 1 col) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center border border-yellow-400/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
                  Built for Speed
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  Edge cached profiles served under 24ms. Ensure you never lose a viewer due to long page loads.
                </p>
              </div>
            </div>

            {/* Performance chart */}
            <div className="mt-8 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4 space-y-3 font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">LYNQ (Go + Edge)</span>
                  <span className="font-bold text-zinc-900 dark:text-white">24ms</span>
                </div>
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full w-[24%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Linktree (Legacy Node)</span>
                  <span>142ms</span>
                </div>
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-400 dark:bg-zinc-700 rounded-full w-[85%]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Block 4: Real-time Analytics (Spans 2 cols) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="md:col-span-2 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-400/5 dark:bg-yellow-400/2 rounded-full blur-[80px] pointer-events-none group-hover:bg-yellow-400/10 dark:group-hover:bg-yellow-400/5 transition-all duration-500" />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center border border-yellow-400/20">
                  <LineChart className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Real-Time Click Analytics
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  Track traffic waves, unique visitors, individual link clicks, and map your click-through rates (CTR) dynamically.
                </p>

                <div className="flex gap-4 pt-2">
                  <div>
                    <div className="text-lg font-black text-zinc-900 dark:text-white">12,482</div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold">Total Clicks</div>
                  </div>
                  <div className="border-r border-zinc-200 dark:border-zinc-800" />
                  <div>
                    <div className="text-lg font-black text-yellow-600 dark:text-yellow-400">18.4%</div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold">Avg. CTR</div>
                  </div>
                </div>
              </div>

              {/* SVG Graph block */}
              <div className="lg:col-span-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 relative min-h-[180px] flex flex-col justify-end shadow-inner overflow-hidden">
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-300">Weekly Traffic Trend</span>
                </div>
                <div className="absolute top-3 right-4 text-[9px] text-zinc-400 font-mono">Real-time</div>

                {/* SVG Chart */}
                <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eab308" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#eab308" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" className="text-zinc-200 dark:text-zinc-900" strokeDasharray="3,3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" className="text-zinc-200 dark:text-zinc-900" strokeDasharray="3,3" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="currentColor" className="text-zinc-200 dark:text-zinc-900" strokeDasharray="3,3" />

                  {/* Area fill */}
                  <path
                    d="M 0 90 L 0 70 Q 40 40, 80 60 T 160 30 T 240 50 T 300 20 L 300 90 Z"
                    fill="url(#chartGrad)"
                  />
                  {/* Line */}
                  <path
                    d="M 0 70 Q 40 40, 80 60 T 160 30 T 240 50 T 300 20"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Interactive nodes */}
                  <circle cx="80" cy="60" r="4" fill="#fff" stroke="#eab308" strokeWidth="2.5" />
                  <circle cx="160" cy="30" r="4" fill="#fff" stroke="#eab308" strokeWidth="2.5" />
                  <circle cx="300" cy="20" r="4" fill="#fff" stroke="#eab308" strokeWidth="2.5" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
