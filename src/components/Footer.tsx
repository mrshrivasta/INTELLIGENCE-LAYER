"use client";

import Link from "next/link";
import { Brain, Github, Twitter, Linkedin } from "lucide-react";
import { navigationLinks, categories } from "@/lib/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
                Orchids AI
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              Empowering students with AI-driven learning paths, assessments, and personalized guidance for a brighter future.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-violet-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Dynamic Navigation Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
             {categories.map((category) => {
               const links = navigationLinks.filter((link) => link.category === category);
               if (links.length === 0) return null;
               
               return (
                 <div key={category}>
                   <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                     {category}
                   </h3>
                   <ul className="space-y-3">
                     {links.map((link) => (
                       <li key={link.name}>
                         <Link 
                           href={link.href} 
                           className="text-sm text-slate-600 hover:text-violet-600 transition-colors flex items-center gap-2 group"
                         >
                           <span className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-violet-600">›</span>
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

        <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} Orchids AI Intelligence Layer. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-violet-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
