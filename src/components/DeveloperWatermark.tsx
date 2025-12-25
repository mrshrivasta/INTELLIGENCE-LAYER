"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function DeveloperWatermark() {
  return (
    <Link href="/developer">
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/25 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-emerald-500/40 cursor-pointer">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>AI Intelligence Layer</span>
      </div>
    </Link>
  );
}
