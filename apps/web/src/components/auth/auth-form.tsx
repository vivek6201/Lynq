'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'motion/react';
import { toast } from '@org/ui';

import {
  sendOtp,
  triggerGoogleLogin,
  verifyOtp,
  completeRegister,
} from '@/utils/routes/auth';
import { AuthStep, StepperHeader } from './stepper-header';
import { CircuitBackground } from './circuit-background';
import { EmailInputStep } from './email-input-step';
import { OtpVerifyStep } from './otp-verify-step';
import { UsernameSelectStep } from './username-select-step';
import { RedirectCountdownStep } from './redirect-countdown-step';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [step, setStep] = useState<AuthStep>('email-input');
  const [prevStep, setPrevStep] = useState<AuthStep>('email-input');
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [username, setUsername] = useState('');
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [countdown, setCountdown] = useState(3);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const getStepIndex = (s: AuthStep) => {
    if (s === 'email-input') return 0;
    if (s === 'otp-verify') return 1;
    if (s === 'username-select') return 2;
    return 3;
  };

  // Update animation direction dynamically
  useEffect(() => {
    if (step !== prevStep) {
      const prevIdx = getStepIndex(prevStep);
      const currIdx = getStepIndex(step);
      setDirection(currIdx > prevIdx ? 1 : -1);
      setPrevStep(step);
    }
  }, [step, prevStep]);

  // Extract initial query parameters from URL
  useEffect(() => {
    const tempId = searchParams.get('temp_user_id');
    const isReg = searchParams.get('registered');
    const urlStep = searchParams.get('step');
    const urlToken = searchParams.get('session_token');

    if (tempId) {
      setTempUserId(tempId);
    }
    if (urlToken) {
      setSessionToken(urlToken);
    }

    if (urlStep === 'redirect-countdown' || isReg === 'true') {
      setStep('redirect-countdown');
    } else if (urlStep === 'username-select' || isReg === 'false') {
      setStep('username-select');
      setIsGoogleFlow(true);
    }
  }, [searchParams]);

  // Resend OTP Countdown timer
  useEffect(() => {
    if (step !== 'otp-verify' || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 4 countdown redirect & NextAuth sign-in integration
  useEffect(() => {
    if (step !== 'redirect-countdown') return;

    const triggerNextAuthSignIn = async () => {
      try {
        if (sessionToken) {
          const { signIn } = await import('next-auth/react');
          await signIn('credentials', {
            sessionToken,
            redirect: false,
          });
        } else {
          toast.error('Failed to resolve login session. Please start over.');
          setStep('email-input');
        }
      } catch (err) {
        console.error('Error in NextAuth credentials signIn:', err);
        toast.error('An error occurred during sign-in.');
        setStep('email-input');
      }
    };

    triggerNextAuthSignIn();

    if (countdown <= 0) {
      router.push('/dashboard/profile');
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [step, countdown, router]);

  // Form Handlers
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);
    try {
      const response = await sendOtp(email);
      if (!response.success) {
        toast.error(response.message || 'Failed to send verification code');
      } else {
        toast.success(
          response.message || 'Verification code sent to your email!',
        );
        setStep('otp-verify');
        setResendTimer(30);
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setIsLoading(true);
    setIsGoogleFlow(true);

    triggerGoogleLogin();
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;

    setIsLoading(true);
    try {
      const response = await verifyOtp(email, otp.join(''));
      if (!response.success) {
        toast.error(
          response.error?.details.trim().charAt(0).toUpperCase() +
            response.error?.details.slice(1) +
            '!!' || 'Failed to verify OTP',
        );
      } else {
        toast.success('OTP verified successfully!');
        if (response.data?.registered) {
          if (response.data?.session_token) {
            setSessionToken(response.data.session_token);
          }
          setStep('redirect-countdown');
        } else {
          if (response.data?.temp_user_id) {
            setTempUserId(response.data.temp_user_id);
          }
          setStep('username-select');
        }
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername || cleanUsername.length < 3) {
      setIsUsernameValid(false);
      return;
    }

    if (!tempUserId) {
      toast.error('Session expired or invalid. Please start over.');
      setStep('email-input');
      return;
    }

    setIsLoading(true);
    try {
      const response = await completeRegister(tempUserId, cleanUsername);
      if (!response.success) {
        toast.error(response.message || 'Failed to complete registration');
      } else {
        toast.success('Registration complete! Welcome to Lynq.');
        if (response.data?.session_token) {
          setSessionToken(response.data.session_token);
        }
        setStep('redirect-countdown');
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    try {
      const response = await sendOtp(email);
      if (!response.success) {
        toast.error(response.message || 'Failed to resend code');
      } else {
        toast.success('Verification code resent successfully!');
        setResendTimer(30);
        setOtp(Array(6).fill(''));
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Framer Motion Slider Variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeIn' as const },
    }),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans flex flex-col justify-center items-center px-6 relative overflow-hidden selection:bg-yellow-400 selection:text-black transition-colors duration-300">
      <CircuitBackground />

      {/* Card Wrapper */}
      <div className="w-full max-w-md bg-zinc-50/50 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-[24px] p-8 md:p-10 shadow-2xl relative z-10 overflow-hidden transition-colors duration-300">
        <StepperHeader
          step={step}
          setStep={setStep}
          isGoogleFlow={isGoogleFlow}
          getStepIndex={getStepIndex}
        />

        {/* Inner Content Animator */}
        <AnimatePresence mode="wait" initial={false}>
          {step === 'email-input' && (
            <EmailInputStep
              key="email-input"
              custom={direction}
              email={email}
              setEmail={setEmail}
              isLoading={isLoading}
              isGoogleFlow={isGoogleFlow}
              handleEmailSubmit={handleEmailSubmit}
              handleGoogleClick={handleGoogleClick}
              onSkip={() => router.push('/')}
              slideVariants={slideVariants}
            />
          )}

          {step === 'otp-verify' && (
            <OtpVerifyStep
              key="otp-verify"
              custom={direction}
              otp={otp}
              setOtp={setOtp}
              email={email}
              isLoading={isLoading}
              resendTimer={resendTimer}
              handleOtpSubmit={handleOtpSubmit}
              handleResendOtp={handleResendOtp}
              slideVariants={slideVariants}
            />
          )}

          {step === 'username-select' && (
            <UsernameSelectStep
              key="username-select"
              custom={direction}
              username={username}
              setUsername={setUsername}
              isLoading={isLoading}
              isUsernameValid={isUsernameValid}
              setIsUsernameValid={setIsUsernameValid}
              handleUsernameSubmit={handleUsernameSubmit}
              slideVariants={slideVariants}
            />
          )}

          {step === 'redirect-countdown' && (
            <RedirectCountdownStep
              key="redirect-countdown"
              custom={direction}
              countdown={countdown}
              slideVariants={slideVariants}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AuthForm;
