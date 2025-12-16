"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, Lock, Key, Database, Eye, FileCheck, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

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
      { name: "API Authentication", status: "configured", description: "All endpoints require auth" },
      { name: "Rate Limiting", status: "configured", description: "Per-user request limits" },
      { name: "Input Validation", status: "active", description: "Sanitization on all inputs" },
      { name: "CORS Policy", status: "configured", description: "Proper origin restrictions" },
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
      { name: "Token Limits", status: "configured", description: "Max tokens per request" },
      { name: "Abuse Detection", status: "configured", description: "Spam prevention" },
    ],
  },
  {
    category: "Data Storage & Database",
    features: [
      { name: "Encrypted Connections", status: "active", description: "TLS for all DB connections" },
      { name: "Encryption at Rest", status: "active", description: "Database-level encryption" },
      { name: "Least-Privilege Access", status: "active", description: "Minimal DB permissions" },
      { name: "Backup Policy", status: "configured", description: "Regular automated backups" },
      { name: "No Secrets in Logs", status: "active", description: "Sensitive data filtering" },
    ],
  },
  {
    category: "Privacy & Compliance",
    features: [
      { name: "Minimal Data Collection", status: "active", description: "Only required fields" },
      { name: "User Consent", status: "configured", description: "Clear data usage policy" },
      { name: "Account Deletion", status: "configured", description: "Full data removal" },
      { name: "Data Retention Policy", status: "configured", description: "Defined storage periods" },
      { name: "Analytics Anonymization", status: "active", description: "PII separation" },
    ],
  },
  {
    category: "Frontend Security",
    features: [
      { name: "Secure Cookies", status: "active", description: "HttpOnly, Secure, SameSite" },
      { name: "CSRF Protection", status: "configured", description: "Token-based validation" },
      { name: "XSS Protection", status: "active", description: "Content sanitization" },
      { name: "Content Security Policy", status: "configured", description: "CSP headers configured" },
      { name: "Safe Rendering", status: "active", description: "No raw HTML injection" },
    ],
  },
  {
    category: "Logging & Monitoring",
    features: [
      { name: "Centralized Logging", status: "configured", description: "All events logged" },
      { name: "Error Logging", status: "active", description: "No sensitive data in logs" },
      { name: "Auth Failure Alerts", status: "configured", description: "Login attempt monitoring" },
      { name: "Anomaly Detection", status: "configured", description: "Unusual activity alerts" },
      { name: "Admin Audit Logs", status: "configured", description: "Admin action tracking" },
    ],
  },
  {
    category: "Infrastructure Security",
    features: [
      { name: "HTTPS Everywhere", status: "active", description: "All traffic encrypted" },
      { name: "Environment Variables", status: "active", description: "Secrets in .env.local" },
      { name: "No Frontend Secrets", status: "active", description: "Only public keys exposed" },
      { name: "Secret Rotation", status: "configured", description: "Regular key updates" },
      { name: "Firewall Rules", status: "configured", description: "Network access control" },
    ],
  },
  {
    category: "Business Logic Security",
    features: [
      { name: "Score Tampering Prevention", status: "active", description: "Server-side calculation" },
      { name: "Roadmap Protection", status: "active", description: "No client-side manipulation" },
      { name: "Time-based Validation", status: "active", description: "Test submission checks" },
      { name: "Replay Attack Prevention", status: "configured", description: "Nonce-based requests" },
      { name: "Data Consistency Checks", status: "active", description: "Historical data validation" },
    ],
  },
  {
    category: "Abuse & Misuse Prevention",
    features: [
      { name: "Brute-force Protection", status: "configured", description: "Login attempt limits" },
      { name: "Bot Detection", status: "configured", description: "Automated request filtering" },
      { name: "Account Lockout", status: "configured", description: "After failed attempts" },
      { name: "Fair-use Limits", status: "configured", description: "Resource usage caps" },
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
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "configured":
        return <Eye className="h-4 w-4 text-blue-600" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-slate-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "configured":
        return <Badge className="bg-blue-100 text-blue-700">Configured</Badge>;
      case "inactive":
        return <Badge className="bg-slate-100 text-slate-700">Inactive</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 animate-pulse text-violet-600" />
          <p className="mt-4 text-slate-600">Loading security dashboard...</p>
        </div>
        <DeveloperWatermark />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Security Dashboard</h1>
              <p className="text-xs text-slate-500">Comprehensive security features</p>
            </div>
          </div>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileCheck className="h-8 w-8 text-violet-600" />
                <p className="text-3xl font-bold text-slate-900">{totalFeatures}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <p className="text-3xl font-bold text-slate-900">{activeFeatures}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Configured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="h-8 w-8 text-blue-600" />
                <p className="text-3xl font-bold text-slate-900">{configuredFeatures}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {securityFeatures.map((category, idx) => (
            <Card key={idx} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-violet-600" />
                  {category.category}
                </CardTitle>
                <CardDescription>{category.features.length} security features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.features.map((feature, featureIdx) => (
                    <div
                      key={featureIdx}
                      className="flex items-start justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3"
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(feature.status)}
                        <div>
                          <p className="font-medium text-slate-900">{feature.name}</p>
                          <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(feature.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
