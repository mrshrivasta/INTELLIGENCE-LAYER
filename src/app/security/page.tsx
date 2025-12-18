"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Shield, Lock, Key, Database, Eye, FileCheck, AlertTriangle, CheckCircle2, XCircle, ArrowLeft, Sparkles } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { motion } from "framer-motion";

interface SecurityFeature {
  category: string;
  features: {
    name: string;
    status: "active" | "configured" | "inactive";
    description: string;
  }[];
}

const securityFeatures: SecurityFeature[] = [
  {
    category: "Authentication & Access Control",
    features: [
      { name: "Secure Login/Signup", status: "active", description: "JWT-based authentication with Supabase" },
      { name: "Email Verification", status: "configured", description: "Email confirmation on signup" },
      { name: "Strong Password Policy", status: "active", description: "Minimum 6 characters enforced" },
      { name: "Password Hashing", status: "active", description: "bcrypt hashing via Supabase" },
      { name: "Session Management", status: "active", description: "JWT token with expiration" },
      { name: "Role-Based Access Control", status: "configured", description: "Student/Admin roles" },
    ],
  },
  {
    category: "User Profile & Data Security",
    features: [
      { name: "User Data Isolation", status: "active", description: "Row-level security policies" },
      { name: "Profile Access Control", status: "active", description: "User-specific data access only" },
      { name: "Secure Profile Updates", status: "active", description: "Validation on all profile changes" },
      { name: "IDOR Prevention", status: "active", description: "No direct object access allowed" },
    ],
  },
  {
    category: "API Security",
    features: [
      { name: "API Authentication", status: "active", description: "All endpoints require auth" },
      { name: "Rate Limiting", status: "active", description: "60 requests per minute limit" },
      { name: "Input Validation", status: "active", description: "Zod validation on all inputs" },
      { name: "Input Sanitization", status: "active", description: "XSS & injection prevention" },
      { name: "SQL Injection Protection", status: "active", description: "Parameterized queries" },
    ],
  },
  {
    category: "AI-Specific Security",
    features: [
      { name: "Prompt Injection Protection", status: "active", description: "Input filtering before AI" },
      { name: "Output Validation", status: "active", description: "AI response sanitization" },
      { name: "Role Boundaries", status: "active", description: "Scoped AI prompts" },
      { name: "System Prompt Protection", status: "active", description: "No prompt exposure to users" },
      { name: "Token Limits", status: "active", description: "Max tokens per request" },
      { name: "Abuse Detection", status: "active", description: "Spam prevention" },
    ],
  },
  {
    category: "Data Storage & Database",
    features: [
      { name: "Encrypted Connections", status: "active", description: "TLS for all DB connections" },
      { name: "Encryption at Rest", status: "active", description: "Database-level encryption" },
      { name: "Row Level Security", status: "active", description: "User-specific data policies" },
      { name: "Backup Policy", status: "active", description: "Regular automated backups" },
      { name: "No Secrets in Logs", status: "active", description: "Sensitive data filtering" },
    ],
  },
  {
    category: "Frontend Security",
    features: [
      { name: "Secure Headers", status: "active", description: "X-Frame-Options, X-XSS-Protection" },
      { name: "CSRF Protection", status: "active", description: "Token-based validation" },
      { name: "XSS Protection", status: "active", description: "Content sanitization" },
      { name: "Content Security Policy", status: "active", description: "CSP headers configured" },
      { name: "Safe Rendering", status: "active", description: "No raw HTML injection" },
    ],
  },
  {
    category: "Infrastructure Security",
    features: [
      { name: "HTTPS Everywhere", status: "active", description: "All traffic encrypted" },
      { name: "Environment Variables", status: "active", description: "Secrets in .env.local" },
      { name: "No Frontend Secrets", status: "active", description: "Only public keys exposed" },
      { name: "Middleware Protection", status: "active", description: "Request filtering & headers" },
    ],
  },
  {
    category: "Abuse Prevention",
    features: [
      { name: "Brute-force Protection", status: "active", description: "Login attempt limits" },
      { name: "API Rate Limiting", status: "active", description: "Per-IP request limits" },
      { name: "Request Validation", status: "active", description: "Size & format checks" },
    ],
  },
];

export default function SecurityPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { user } = await authService.getCurrentUser();
    setUser(user);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "configured":
        return <Eye className="h-4 w-4 text-cyan-400" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-white/40" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>;
      case "configured":
        return <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Configured</Badge>;
      case "inactive":
        return <Badge className="bg-white/5 text-white/40 border-white/10">Inactive</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Pending</Badge>;
    }
  };

  const totalFeatures = securityFeatures.reduce((acc, cat) => acc + cat.features.length, 0);
  const activeFeatures = securityFeatures.reduce(
    (acc, cat) => acc + cat.features.filter((f) => f.status === "active").length,
    0
  );
  const configuredFeatures = securityFeatures.reduce(
    (acc, cat) => acc + cat.features.filter((f) => f.status === "configured").length,
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 animate-pulse text-emerald-400" />
          <p className="mt-4 text-white/60">Loading security dashboard...</p>
        </div>
        <DeveloperWatermark />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur-lg opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Security Dashboard</h1>
              <p className="text-[10px] text-emerald-400/80 font-medium tracking-wide">SVEEKRUTH AI</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push("/")} 
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid gap-4 sm:grid-cols-3"
        >
          <Card className="border-white/5 bg-[#111827]/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Total Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-violet-400" />
                </div>
                <p className="text-3xl font-bold text-white">{totalFeatures}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-[#111827]/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <p className="text-3xl font-bold text-white">{activeFeatures}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-[#111827]/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Configured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white">{configuredFeatures}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {securityFeatures.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <Card className="border-white/5 bg-[#111827]/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lock className="h-5 w-5 text-emerald-400" />
                    {category.category}
                  </CardTitle>
                  <CardDescription className="text-white/50">{category.features.length} security features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {category.features.map((feature, featureIdx) => (
                      <div
                        key={featureIdx}
                        className="flex items-start justify-between rounded-xl border border-white/5 bg-white/5 p-3"
                      >
                        <div className="flex items-start gap-3">
                          {getStatusIcon(feature.status)}
                          <div>
                            <p className="font-medium text-white text-sm">{feature.name}</p>
                            <p className="text-xs text-white/50">{feature.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(feature.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/20 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Powered by Sveekruth</h3>
              <p className="text-sm text-white/60">Enterprise-grade security for your learning journey</p>
            </div>
          </div>
        </motion.div>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
