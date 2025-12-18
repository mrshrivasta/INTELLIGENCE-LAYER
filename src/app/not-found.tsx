"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] dark:bg-[#0a0a0f] text-white flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{backgroundImage: "radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)", backgroundSize: "40px 40px"}} />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-3xl opacity-30" />
            <h1 className="relative text-[150px] sm:text-[200px] font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent leading-none">
              404
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Page Not Found</h2>
          </div>
          <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved to another location.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 font-semibold shadow-lg shadow-emerald-500/25 border-0 w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm"
        >
          <h3 className="text-sm font-semibold text-white/80 mb-3">Looking for something?</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-emerald-400 hover:bg-white/5">
                Dashboard
              </Button>
            </Link>
            <Link href="/overview">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-emerald-400 hover:bg-white/5">
                Overview
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-emerald-400 hover:bg-white/5">
                Features
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-emerald-400 hover:bg-white/5">
                Help Center
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-emerald-400 hover:bg-white/5">
                Contact
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <DeveloperWatermark />
    </div>
  );
}
