"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
        Something went wrong
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        We encountered an error while loading this page.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
