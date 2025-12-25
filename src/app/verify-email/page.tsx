"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, XCircle, Loader2, Brain } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    setTimeout(() => {
      setStatus("success");
    }, 2000);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Shrivasta AI</span>
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg text-center">
            {status === "verifying" && (
              <>
                <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-violet-600" />
                <h2 className="mb-2 text-2xl font-bold text-slate-900">Verifying Email</h2>
                <p className="text-slate-600">Please wait while we verify your email address...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h2 className="mb-2 text-2xl font-bold text-slate-900">Email Verified!</h2>
                <p className="mb-6 text-slate-600">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
                <Link href="/login">
                  <Button className="w-full">Continue to Login</Button>
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                <h2 className="mb-2 text-2xl font-bold text-slate-900">Verification Failed</h2>
                <p className="mb-6 text-slate-600">
                  We couldn't verify your email. The link may be invalid or expired.
                </p>
                <div className="space-y-2">
                  <Link href="/signup">
                    <Button className="w-full">Sign Up Again</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">Back to Login</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <DeveloperWatermark />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
