'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const registered = searchParams.get('registered');
    const token = searchParams.get('session_token');
    if (registered === 'true') {
      router.replace(`/auth?step=redirect-countdown${token ? `&session_token=${encodeURIComponent(token)}` : ''}`);
    } else {
      router.replace('/auth');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
        <p className="text-xs text-zinc-400 font-light select-none">Authenticating session...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
