'use client';

import React from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@org/ui/components/ui/button';
import { motion, type Variants } from 'motion/react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@org/ui/components/ui/input-otp';

interface OtpVerifyStepProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  email: string;
  isLoading: boolean;
  resendTimer: number;
  handleOtpSubmit: (e: React.FormEvent) => void;
  handleResendOtp: () => void;
  slideVariants: Variants;
  custom: number;
}

export function OtpVerifyStep({
  otp,
  setOtp,
  email,
  isLoading,
  resendTimer,
  handleOtpSubmit,
  handleResendOtp,
  slideVariants,
  custom,
}: OtpVerifyStepProps) {
  return (
    <motion.div
      key="otp-verify"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      custom={custom}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mx-auto border border-yellow-400/20">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Verify OTP 🔑
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light mt-1.5">
          We've sent a 6-digit verification code to <br />
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{email}</span>
        </p>
      </div>

      {/* 6 Digit Input Boxes via Shadcn InputOTP */}
      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="flex justify-center max-w-sm mx-auto">
          <InputOTP
            maxLength={6}
            value={otp.join('')}
            onChange={(value) => {
              const newOtp = value.split('');
              const paddedOtp = Array.from({ length: 6 }, (_, i) => newOtp[i] || '');
              setOtp(paddedOtp);
            }}
            disabled={isLoading}
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <InputOTPSlot
                  key={idx}
                  index={idx}
                  className="w-11 h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center text-lg font-bold text-zinc-900 dark:text-white focus-visible:border-yellow-400 dark:focus-visible:border-yellow-400 focus-visible:ring-1 focus-visible:ring-yellow-400/20 focus-visible:ring-offset-0 transition-all"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          disabled={isLoading || otp.join('').length < 6}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-extrabold py-3 h-11 text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Verify & Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </form>

      {/* Resend Action */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendTimer > 0}
          className={`text-xs font-bold transition-colors ${
            resendTimer > 0
              ? 'text-zinc-400 dark:text-zinc-655 cursor-not-allowed'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400'
          }`}
        >
          {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
        </button>
      </div>
    </motion.div>
  );
}
