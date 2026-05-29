'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';

export type AuthStep = 'email-input' | 'otp-verify' | 'username-select' | 'redirect-countdown';

interface StepperHeaderProps {
  step: AuthStep;
  setStep: (step: AuthStep) => void;
  isGoogleFlow: boolean;
  getStepIndex: (s: AuthStep) => number;
}

export function StepperHeader({ step, setStep, isGoogleFlow, getStepIndex }: StepperHeaderProps) {
  return (
    <div className="relative flex items-center justify-center mb-8 min-h-[32px] z-20">
      {/* Back Button (Absolute Left) */}
      {step !== 'email-input' && step !== 'redirect-countdown' && (
        <button
          type="button"
          onClick={() => {
            if (step === 'otp-verify') setStep('email-input');
            if (step === 'username-select') setStep(isGoogleFlow ? 'email-input' : 'otp-verify');
          }}
          className="absolute left-0 inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>
      )}

      {/* Centered Numbered Stepper or App Logo */}
      {step === 'email-input' ? (
        <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-black text-lg rotate-6 shadow-[0_0_12px_rgba(250,204,21,0.25)] select-none">
          L
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {[1, 2, 3, 4].map((i) => {
            const activeIndex = getStepIndex(step) + 1;
            const isCurrent = i === activeIndex;
            const isCompleted = i < activeIndex;
            return (
              <React.Fragment key={i}>
                <div className="flex items-center justify-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                      isCurrent
                        ? 'bg-yellow-400 text-black ring-4 ring-yellow-400/20 scale-110 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                        : isCompleted
                        ? 'bg-yellow-400/10 text-yellow-500 border border-yellow-400/30'
                        : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {i}
                  </div>
                </div>
                {i < 4 && (
                  <div
                    className={`h-[1px] w-6 transition-colors duration-300 ${
                      isCompleted
                        ? 'bg-yellow-450/40'
                        : 'bg-zinc-200 dark:bg-zinc-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
