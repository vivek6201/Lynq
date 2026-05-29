'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@org/ui/components/ui/button';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  const router = useRouter();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  } as const;

  const socialLinks = [
    { 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ), 
      href: 'https://github.com', 
      label: 'GitHub' 
    },
    { 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ), 
      href: 'https://twitter.com', 
      label: 'Twitter' 
    },
    { 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ), 
      href: 'https://instagram.com', 
      label: 'Instagram' 
    },
    { 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
          <path d="m10 15 5-3-5-3z" fill="currentColor" />
        </svg>
      ), 
      href: 'https://youtube.com', 
      label: 'YouTube' 
    },
  ];

  const productLinks = [
    { label: 'Theme Builder', href: '#features' },
    { label: 'Click Analytics', href: '#features' },
    { label: 'Integrations', href: '#features' },
    { label: 'Go Edge Server', href: '#features' },
  ];

  const resourceLinks = [
    { label: 'Developer Docs', href: '#' },
    { label: 'GitHub Repo', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'System Status', href: '#' },
  ];

  const legalLinks = [
    { label: 'Terms of Use', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Settings', href: '#' },
  ];

  return (
    <>
      {/* Bottom CTA */}
      <section className="py-24 border-t border-b border-zinc-200 dark:border-zinc-900 relative overflow-hidden bg-gradient-to-b from-zinc-50/50 via-white to-zinc-50/30 dark:from-zinc-950/40 dark:via-zinc-900/20 dark:to-zinc-950/10 px-6">
        {/* Soft grid background overlay spanning full width */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-50 pointer-events-none" />
        
        {/* Glowing gradient backdrops */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-40 left-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
              Ready to Claim Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400 drop-shadow-[0_2px_10px_rgba(234,179,8,0.2)] dark:from-yellow-400 dark:via-amber-400 dark:to-yellow-300">
                LYNQ Handle?
              </span>
            </h2>
            <p className="text-zinc-650 dark:text-zinc-400 max-w-lg mx-auto font-light text-base leading-relaxed">
              Create customizable landing pages, display feeds, and control your online hub in less than two minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
              <Button
                onClick={() => router.push('/auth')}
                className="w-full sm:w-auto bg-yellow-400 text-black hover:bg-yellow-300 font-extrabold px-6 py-3 h-11 text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.15)] dark:shadow-[0_0_20px_rgba(234,179,8,0.25)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center gap-1.5 group"
              >
                Get Started Free
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
                className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-bold px-6 py-3 h-11 text-xs uppercase tracking-wider rounded-xl"
              >
                View Live Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-black/40 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 pb-12">
          {/* Logo & Description */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-zinc-900 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-extrabold rotate-6">
                L
              </div>
              LYNQ
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light leading-relaxed max-w-xs">
              The modular, block-based link-in-bio builder for creators, developers, and brands. Served fast from the edge.
            </p>
            {/* Social Links */}
            <div className="flex gap-2 pt-2">
              {socialLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-yellow-500 dark:hover:text-yellow-400 hover:border-yellow-400/30 bg-white dark:bg-zinc-950 transition-all hover:scale-105"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Spacer on large screens */}
          <div className="hidden lg:block lg:col-span-2" />

          {/* Links columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:col-span-8 lg:col-span-6">
            {/* Column 2: Product */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Product
              </h4>
              <ul className="space-y-2">
                {productLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Resources
              </h4>
              <ul className="space-y-2">
                {resourceLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legals */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Legal
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} LYNQ. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Built with <span className="text-red-500">❤️</span> for creators using Next.js & Go.
          </div>
        </div>
      </footer>
    </>
  );
}
