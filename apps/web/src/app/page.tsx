import React from 'react';
import { Navbar } from '../components/home/navbar';
import { Hero } from '../components/home/hero';
import { PreviewSimulator } from '../components/home/preview-simulator';
import { BentoFeatures } from '../components/home/bento-features';
import { Footer } from '../components/home/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans overflow-x-hidden selection:bg-yellow-400 selection:text-black transition-colors duration-300 animate-fade-in">
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-10 dark:opacity-30">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-[140px]" />
        <div className="absolute -top-20 right-1/4 w-[400px] h-[400px] bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Floating Navbar */}
      <Navbar />

      {/* Hero & Simulator Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <Hero />
        <PreviewSimulator />
      </section>

      {/* Bento Grid Features Section */}
      <BentoFeatures />

      {/* Footer & CTA Section */}
      <Footer />
    </div>
  );
}
