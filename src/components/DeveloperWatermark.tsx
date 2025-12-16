"use client";

import { Code2 } from "lucide-react";

export function DeveloperWatermark() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-opacity hover:opacity-90">
      <Code2 className="h-4 w-4" />
      <span>Developed by Karanam Shrivasta</span>
    </div>
  );
}
