import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100">
        <Brain className="h-10 w-10 text-purple-600" />
      </div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
