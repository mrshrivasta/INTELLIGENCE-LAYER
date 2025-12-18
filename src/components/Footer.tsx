"use client";

import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin, Shield, Lock, Sparkles } from "lucide-react";
import { navigationLinks, categories } from "@/lib/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur-lg opacity-40" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Shrivasta AI
              </span>
            </Link>
            <p className="text-sm text-white/50 max-w-xs">
              Empowering students with AI-driven learning paths, assessments, and personalized guidance for a brighter future.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-white/40 hover:text-emerald-400 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/40 hover:text-emerald-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/40 hover:text-emerald-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Shield className="h-3.5 w-3.5 text-emerald-500/60" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Lock className="h-3.5 w-3.5 text-emerald-500/60" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
             {categories.map((category) => {
               const links = navigationLinks.filter((link) => link.category === category);
               if (links.length === 0) return null;
               
               return (
                 <div key={category}>
                   <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                     {category}
                   </h3>
                   <ul className="space-y-3">
                     {links.map((link) => (
                       <li key={link.name}>
                         <Link 
                           href={link.href} 
                           className="text-sm text-white/50 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                         >
                           <span className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-emerald-400">›</span>
                           {link.name}
                         </Link>
                       </li>
                     ))}
                   </ul>
                 </div>
               );
             })}
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <p className="text-sm text-white/50">
              © {currentYear} Shrivasta AI Intelligence Layer. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
