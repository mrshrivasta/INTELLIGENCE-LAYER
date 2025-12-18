"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowLeft,
  BookOpen,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Map,
  BarChart3,
  Brain,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

const searchableItems = [
  { title: "Dashboard", description: "View your learning dashboard and progress", href: "/dashboard", icon: BarChart3, category: "Navigation" },
  { title: "AI Assessment", description: "Take AI-powered skill assessments", href: "/assessment", icon: Brain, category: "Features" },
  { title: "Learning Roadmap", description: "View your personalized learning path", href: "/roadmap", icon: Map, category: "Features" },
  { title: "Analytics", description: "Detailed analytics and insights", href: "/analytics", icon: TrendingUp, category: "Features" },
  { title: "Documentation", description: "API docs and user guides", href: "/docs", icon: BookOpen, category: "Resources" },
  { title: "Help Center", description: "Get help and support", href: "/help", icon: HelpCircle, category: "Resources" },
  { title: "Settings", description: "Manage your account settings", href: "/settings", icon: Settings, category: "Account" },
  { title: "Profile", description: "View and edit your profile", href: "/profile", icon: Users, category: "Account" },
  { title: "Security", description: "Security settings and features", href: "/security", icon: Shield, category: "Account" },
  { title: "Terms of Service", description: "Read our terms and conditions", href: "/terms", icon: FileText, category: "Legal" },
  { title: "Privacy Policy", description: "Learn about data handling", href: "/privacy", icon: FileText, category: "Legal" },
  { title: "About Us", description: "Learn about Shrivasta AI", href: "/about", icon: Users, category: "Company" },
  { title: "Features", description: "Explore all platform features", href: "/features", icon: Brain, category: "Navigation" },
  { title: "Reviews", description: "See what users say about us", href: "/reviews", icon: Users, category: "Company" },
];

const recentSearches = ["Dashboard", "Assessment", "Roadmap", "Analytics"];
const popularSearches = ["AI Features", "Learning Path", "Settings", "Help"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(searchableItems);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setResults(searchableItems);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const categories = [...new Set(results.map((r) => r.category))];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <Input
              type="text"
              placeholder="Search pages, features, settings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-emerald-500/20 focus:border-emerald-500/50"
              autoFocus
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {query === "" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-6"
          >
            <div>
              <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <Badge
                    key={term}
                    className="cursor-pointer bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <Badge
                    key={term}
                    className="cursor-pointer bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {query !== "" && (
              <p className="text-sm text-[var(--text-muted)]">
                Found {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
              </p>
            )}

            {categories.map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {results
                    .filter((r) => r.category === category)
                    .map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <Link key={i} href={item.href}>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] hover:border-emerald-500/30 transition-all cursor-pointer"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 group-hover:from-emerald-500/30 group-hover:to-cyan-500/30 transition-colors">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-sm text-[var(--text-muted)]">
                                {item.description}
                              </p>
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}
                </div>
              </motion.div>
            ))}

            {results.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Search className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No results found</h3>
                <p className="text-[var(--text-muted)]">Try searching for something else</p>
              </motion.div>
            )}
          </div>
        )}
      </main>

      <DeveloperWatermark />
    </div>
  );
}
