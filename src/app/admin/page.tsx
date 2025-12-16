"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Activity, Database, TrendingUp, Shield, BarChart3, AlertTriangle } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { user } = await authService.getCurrentUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const stats = [
    { label: "Total Users", value: "1,234", icon: Users, change: "+12%", color: "violet" },
    { label: "Active Sessions", value: "456", icon: Activity, change: "+8%", color: "green" },
    { label: "Database Size", value: "2.4 GB", icon: Database, change: "+15%", color: "blue" },
    { label: "API Requests", value: "45.2k", icon: TrendingUp, change: "+22%", color: "fuchsia" },
  ];

  const recentActivities = [
    { type: "signup", user: "user@example.com", timestamp: "2 minutes ago", status: "success" },
    { type: "login", user: "admin@example.com", timestamp: "5 minutes ago", status: "success" },
    { type: "assessment", user: "student@example.com", timestamp: "12 minutes ago", status: "success" },
    { type: "failed_login", user: "unknown@example.com", timestamp: "15 minutes ago", status: "warning" },
    { type: "profile_update", user: "learner@example.com", timestamp: "23 minutes ago", status: "success" },
  ];

  const systemHealth = [
    { name: "Authentication Service", status: "operational", uptime: "99.99%" },
    { name: "Database", status: "operational", uptime: "99.98%" },
    { name: "AI Service", status: "operational", uptime: "99.95%" },
    { name: "API Gateway", status: "operational", uptime: "99.97%" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 animate-pulse text-violet-600" />
          <p className="mt-4 text-slate-600">Loading admin dashboard...</p>
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
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
              <p className="text-xs text-slate-500">Platform management & analytics</p>
            </div>
          </div>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                  {stat.label}
                  <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest user actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      {activity.status === "success" ? (
                        <Activity className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {activity.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-slate-600">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Service status and uptime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemHealth.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{service.name}</p>
                        <p className="text-xs text-slate-600">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <Users className="h-6 w-6" />
                Manage Users
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <Database className="h-6 w-6" />
                Database Backup
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <Shield className="h-6 w-6" />
                Security Logs
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                <BarChart3 className="h-6 w-6" />
                Analytics Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
