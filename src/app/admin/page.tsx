"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, Users, Activity, Database, TrendingUp, Shield, BarChart3, AlertTriangle,
  FileText, Clock, Terminal, Filter, RefreshCw, Download, Search, ChevronDown,
  GraduationCap, Moon, Sun
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { motion } from "framer-motion";
import Link from "next/link";

interface LogEntry {
  id: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: string;
  source: string;
  details?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "logs" | "users" | "system">("overview");
  const [logFilter, setLogFilter] = useState<"all" | "info" | "warning" | "error" | "success">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    loadUser();
    const stored = localStorage.getItem("theme") as "dark" | "light";
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

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
    { label: "Total Users", value: "1,234", icon: Users, change: "+12%", color: "emerald" },
    { label: "Active Sessions", value: "456", icon: Activity, change: "+8%", color: "cyan" },
    { label: "Database Size", value: "2.4 GB", icon: Database, change: "+15%", color: "violet" },
    { label: "API Requests", value: "45.2k", icon: TrendingUp, change: "+22%", color: "pink" },
  ];

  const logs: LogEntry[] = [
    { id: "1", type: "success", message: "User authentication successful", timestamp: "2024-12-18 10:23:45", source: "Auth Service", details: "user@example.com logged in" },
    { id: "2", type: "info", message: "Database backup completed", timestamp: "2024-12-18 10:20:00", source: "Database", details: "Backup size: 2.4GB" },
    { id: "3", type: "warning", message: "High memory usage detected", timestamp: "2024-12-18 10:15:32", source: "System Monitor", details: "Memory usage at 85%" },
    { id: "4", type: "error", message: "Failed login attempt", timestamp: "2024-12-18 10:12:18", source: "Auth Service", details: "IP: 192.168.1.45 - Multiple failed attempts" },
    { id: "5", type: "info", message: "New user registration", timestamp: "2024-12-18 10:10:05", source: "Auth Service", details: "student@example.com" },
    { id: "6", type: "success", message: "Assessment completed", timestamp: "2024-12-18 10:08:22", source: "Assessment Service", details: "User scored 87%" },
    { id: "7", type: "warning", message: "API rate limit approaching", timestamp: "2024-12-18 10:05:11", source: "API Gateway", details: "80% of daily limit reached" },
    { id: "8", type: "info", message: "Cache cleared successfully", timestamp: "2024-12-18 10:00:00", source: "Cache Service", details: "All caches invalidated" },
    { id: "9", type: "error", message: "External API timeout", timestamp: "2024-12-18 09:55:33", source: "AI Service", details: "OpenAI API response timeout after 30s" },
    { id: "10", type: "success", message: "Scheduled task completed", timestamp: "2024-12-18 09:50:00", source: "Task Scheduler", details: "Daily analytics report generated" },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesFilter = logFilter === "all" || log.type === logFilter;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const systemHealth = [
    { name: "Authentication Service", status: "operational", uptime: "99.99%" },
    { name: "Database", status: "operational", uptime: "99.98%" },
    { name: "AI Service", status: "operational", uptime: "99.95%" },
    { name: "API Gateway", status: "operational", uptime: "99.97%" },
  ];

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success": return <Activity className="h-4 w-4 text-emerald-400" />;
      case "info": return <FileText className="h-4 w-4 text-cyan-400" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getLogBadge = (type: LogEntry["type"]) => {
    const styles = {
      success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      error: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return styles[type];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 animate-pulse text-emerald-400" />
          <p className="mt-4 text-white/60">Loading admin dashboard...</p>
        </div>
        <DeveloperWatermark />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />
      
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur-lg opacity-50" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
              </div>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
              <p className="text-[10px] text-emerald-400/80 font-medium tracking-wide">SHRIVASTA AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/5"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={() => router.push("/")} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
          {["overview", "logs", "users", "system"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              size="sm"
              className={activeTab === tab 
                ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                : "text-white/60 hover:text-white hover:bg-white/5"}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <Card key={idx} className="bg-[#111827]/50 border-white/5 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm font-medium text-white/60">
                      {stat.label}
                      <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-emerald-400">{stat.change} from last month</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-[#111827]/50 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activities</CardTitle>
                  <CardDescription className="text-white/50">Latest user actions and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3">
                        <div className="flex items-center gap-3">
                          {getLogIcon(log.type)}
                          <div>
                            <p className="text-sm font-medium text-white">{log.message}</p>
                            <p className="text-xs text-white/50">{log.source}</p>
                          </div>
                        </div>
                        <span className="text-xs text-white/40">{log.timestamp.split(" ")[1]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111827]/50 border-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                  <CardDescription className="text-white/50">Service status and uptime</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemHealth.map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3">
                        <div className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-emerald-400" />
                          <div>
                            <p className="text-sm font-medium text-white">{service.name}</p>
                            <p className="text-xs text-white/50">Uptime: {service.uptime}</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          Operational
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === "logs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-[#111827]/50 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-emerald-400" />
                      System Logs
                    </CardTitle>
                    <CardDescription className="text-white/50">Real-time monitoring and event logs</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["all", "success", "info", "warning", "error"].map((filter) => (
                      <Button
                        key={filter}
                        variant={logFilter === filter ? "default" : "ghost"}
                        size="sm"
                        className={logFilter === filter 
                          ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                          : "text-white/60 hover:text-white hover:bg-white/5"}
                        onClick={() => setLogFilter(filter as any)}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4 p-4 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="mt-0.5">{getLogIcon(log.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`text-xs ${getLogBadge(log.type)}`}>
                            {log.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-white/40">{log.source}</span>
                        </div>
                        <p className="text-sm font-medium text-white">{log.message}</p>
                        {log.details && (
                          <p className="text-xs text-white/50 mt-1">{log.details}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <p className="text-sm text-white/40">Showing {filteredLogs.length} of {logs.length} logs</p>
                  <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-white/5">
                    Load More
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-[#111827]/50 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-white/50">Manage platform users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/60">User management features coming soon...</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "system" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-[#111827]/50 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
                <CardDescription className="text-white/50">Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Users className="h-6 w-6" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Database className="h-6 w-6" />
                    Database Backup
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Shield className="h-6 w-6" />
                    Security Settings
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <BarChart3 className="h-6 w-6" />
                    Analytics Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <DeveloperWatermark />
    </div>
  );
}
