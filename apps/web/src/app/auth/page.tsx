import AuthForm from "@/components/auth/auth-form";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
