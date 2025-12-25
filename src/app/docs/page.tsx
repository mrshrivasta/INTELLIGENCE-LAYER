"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Code,
  Database,
  Key,
  Server,
  Shield,
  Zap,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Search,
  FileText,
  Terminal,
  Layers,
  Lock,
  Globe,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

const docSections = [
  {
    title: "Getting Started",
    icon: Zap,
    color: "from-emerald-500 to-cyan-500",
    items: [
      { title: "Introduction", slug: "introduction" },
      { title: "Quick Start Guide", slug: "quickstart" },
      { title: "Authentication", slug: "authentication" },
      { title: "First API Call", slug: "first-api-call" },
    ],
  },
  {
    title: "API Reference",
    icon: Code,
    color: "from-violet-500 to-purple-500",
    items: [
      { title: "REST API Overview", slug: "rest-api" },
      { title: "Endpoints", slug: "endpoints" },
      { title: "Request/Response Format", slug: "request-response" },
      { title: "Error Handling", slug: "errors" },
    ],
  },
  {
    title: "Database",
    icon: Database,
    color: "from-pink-500 to-rose-500",
    items: [
      { title: "Schema Overview", slug: "schema" },
      { title: "Tables & Relations", slug: "tables" },
      { title: "Queries", slug: "queries" },
      { title: "Migrations", slug: "migrations" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    color: "from-amber-500 to-orange-500",
    items: [
      { title: "Authentication Flow", slug: "auth-flow" },
      { title: "API Keys", slug: "api-keys" },
      { title: "Rate Limiting", slug: "rate-limiting" },
      { title: "Best Practices", slug: "security-best-practices" },
    ],
  },
];

const codeExamples = {
  authentication: `// Initialize Supabase Client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Sign up new user
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
})`,
  apiCall: `// Fetch user profile
const response = await fetch('/api/user', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  }
})

const userData = await response.json()`,
  database: `// Query assessments
const { data, error } = await supabase
  .from('assessments')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })`,
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-[var(--border-primary)]" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold">Documentation</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="sm" className="text-[var(--text-secondary)]">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">v1.0.0</Badge>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl flex">
        <aside className="hidden lg:block w-64 border-r border-[var(--border-primary)] p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-6">
            {docSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-md bg-gradient-to-br ${section.color}`}>
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{section.title}</span>
                  </div>
                  <ul className="space-y-1 ml-7">
                    {section.items.map((item) => (
                      <li key={item.slug}>
                        <button
                          onClick={() => setActiveSection(item.slug)}
                          className={`text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                            activeSection === item.slug
                              ? "text-emerald-400 bg-emerald-500/10"
                              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div>
              <Badge className="mb-4 bg-violet-500/10 text-violet-400 border-violet-500/20">
                Documentation
              </Badge>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                Shrivasta AI Documentation
              </h1>
              <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                Complete guide to integrating and using the Shrivasta AI platform.
                Learn about our APIs, authentication, database schema, and best practices.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Terminal, title: "Quick Start", desc: "Get up and running in 5 minutes", color: "emerald" },
                { icon: Key, title: "API Keys", desc: "Generate and manage API keys", color: "violet" },
                { icon: Layers, title: "Architecture", desc: "Learn about our system design", color: "pink" },
                { icon: Globe, title: "Deployment", desc: "Deploy to production", color: "amber" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] hover:border-emerald-500/30 transition-all cursor-pointer"
                  >
                    <Icon className={`h-8 w-8 mb-3 text-${item.color}-400`} />
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                      {item.title}
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Code className="h-6 w-6 text-emerald-400" />
                Code Examples
              </h2>

              {Object.entries(codeExamples).map(([key, code]) => (
                <div key={key} className="rounded-xl border border-[var(--border-primary)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
                    <span className="text-sm font-medium text-[var(--text-secondary)] capitalize">{key.replace("-", " ")}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode(code, key)}
                      className="h-7 text-xs"
                    >
                      {copiedCode === key ? (
                        <>
                          <Check className="h-3 w-3 mr-1 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-4 bg-[#0d1117] overflow-x-auto">
                    <code className="text-sm text-[#e6edf3] font-mono">{code}</code>
                  </pre>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Server className="h-6 w-6 text-violet-400" />
                API Endpoints
              </h2>

              <div className="space-y-3">
                {[
                  { method: "GET", path: "/api/user", desc: "Get current user profile" },
                  { method: "POST", path: "/api/chat", desc: "Send message to AI chatbot" },
                  { method: "GET", path: "/api/assessments", desc: "List all assessments" },
                  { method: "POST", path: "/api/assessments", desc: "Create new assessment" },
                  { method: "GET", path: "/api/roadmap", desc: "Get learning roadmap" },
                  { method: "PUT", path: "/api/user/settings", desc: "Update user settings" },
                ].map((endpoint, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50"
                  >
                    <Badge
                      className={`font-mono ${
                        endpoint.method === "GET"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : endpoint.method === "POST"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono text-[var(--text-primary)]">{endpoint.path}</code>
                    <span className="text-sm text-[var(--text-muted)] ml-auto">{endpoint.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Lock className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">Need Help?</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">
                    If you have questions or need assistance, check out our help center or contact the developer.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/help">
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        Help Center
                      </Button>
                    </Link>
                    <Link href="/developer">
                      <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                        Contact Developer
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <DeveloperWatermark />
    </div>
  );
}
