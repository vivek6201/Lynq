'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DEMO_THEMES } from './constants';
import { ArrowRight, Globe, Link2, Sparkles, Lock } from 'lucide-react';

export function PreviewSimulator() {
  const [activeTheme, setActiveTheme] = useState<keyof typeof DEMO_THEMES>('yellow-neon');
  const selectedTheme = DEMO_THEMES[activeTheme];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="lg:col-span-5 flex flex-col items-center gap-6"
    >
      {/* Interactive Phone Frame */}
      <div className="perspective-[1000px]">
        <motion.div
          whileHover={{ y: -8, rotateY: -3, rotateX: 3 }}
          className={`w-[290px] h-[550px] border-[6px] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col p-4 select-none transition-all duration-500 ${selectedTheme.phoneBg}`}
        >
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800/40 dark:bg-zinc-800/20 backdrop-blur-sm rounded-full z-20" />

          {/* Profile Header mockup */}
          <div className="flex flex-col items-center pt-8 pb-4 text-center">
            <motion.div
              layoutId="avatar"
              className={`w-16 h-16 rounded-full border-2 mb-3 flex items-center justify-center text-xl font-bold transition-all duration-500 ${selectedTheme.avatarBorder} ${selectedTheme.avatarBg} ${selectedTheme.avatarText}`}
            >
              JD
            </motion.div>
            <h3
              className={`font-bold text-base transition-colors duration-500 ${selectedTheme.handleColor}`}
            >
              John Doe
            </h3>
            <p
              className={`text-xs mt-1 max-w-[200px] transition-colors duration-500 ${selectedTheme.bioColor}`}
            >
              Digital Creator & UI Designer. Connecting worlds.
            </p>
          </div>

          {/* Social Grid block */}
          <div className="flex justify-center gap-3 mb-4">
            {[
              { icon: <Globe className="w-4 h-4" /> },
              { icon: <Link2 className="w-4 h-4" /> },
              { icon: <Sparkles className="w-4 h-4" /> },
              { icon: <Lock className="w-4 h-4" /> },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${selectedTheme.socialIconClass}`}
              >
                {item.icon}
              </button>
            ))}
          </div>

          {/* Simulated Links stack */}
          <div className="flex-1 space-y-3 px-2 overflow-y-hidden">
            {[
              { title: 'My Portfolio', desc: 'Case studies & designs' },
              {
                title: 'Read my Newsletter',
                desc: 'Weekly design insights',
              },
              { title: 'Grab my UI Kit', desc: 'Free Figma presets' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 flex items-center justify-between cursor-pointer transition-all duration-500 ${selectedTheme.buttonClass}`}
              >
                <div className="text-left">
                  <div className="text-xs font-bold">{item.title}</div>
                  <div className="text-[9px] opacity-60 font-light mt-0.5">
                    {item.desc}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-80" />
              </motion.div>
            ))}
          </div>

          {/* Brand Logo Bottom */}
          <div className="text-center py-2 text-[9px] tracking-widest text-zinc-500/60 font-black">
            LYNQ.ME
          </div>
        </motion.div>
      </div>

      {/* Theme Switcher controls */}
      <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-sm">
        {(Object.keys(DEMO_THEMES) as Array<keyof typeof DEMO_THEMES>).map((themeKey) => (
          <button
            key={themeKey}
            onClick={() => setActiveTheme(themeKey)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTheme === themeKey
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {DEMO_THEMES[themeKey].name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
