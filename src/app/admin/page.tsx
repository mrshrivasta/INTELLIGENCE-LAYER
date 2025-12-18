"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Brain, Users, Activity, Database, TrendingUp, Shield, BarChart3, AlertTriangle,
  FileText, Clock, Terminal, RefreshCw, Download, Search, ChevronDown,
  GraduationCap, Moon, Sun, Lock, Eye, EyeOff, FileJson, FileSpreadsheet, FileDown,
  LogOut, Settings, X
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import Link from "next/link";

const ADMIN_EMAIL = "admin@shrivasta.ai";
const ADMIN_PASSWORD = "ShrivastaAdmin@2024";

interface LogEntry {
  id: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: string;
  source: string;
  details?: string;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  education_level: string;
  field_of_interest: string;
  target_role: string;
  created_at: string;
  onboarding_completed: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "logs" | "users" | "system" | "export">("overview");
  const [logFilter, setLogFilter] = useState<"all" | "info" | "warning" | "error" | "success">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<"users" | "analytics" | "all">("all");

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === "users") {
      loadUsers();
    }
  }, [isAuthenticated, activeTab]);

  const handleAdminLogin = () => {
    setLoginLoading(true);
    setLoginError("");
    
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("adminAuthenticated", "true");
        setIsAuthenticated(true);
      } else {
        setLoginError("Invalid admin credentials");
      }
      setLoginLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setUsers(data);
    }
    setUsersLoading(false);
  };

  const exportData = (format: "json" | "csv" | "xlsx", dataType: string) => {
    let dataToExport: any[] = [];
    let filename = "";

    if (dataType === "users" || dataType === "all") {
      dataToExport = users;
      filename = `users_export_${new Date().toISOString().split('T')[0]}`;
    }

    if (format === "json") {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
      downloadBlob(blob, `${filename}.json`);
    } else if (format === "csv") {
      const csv = convertToCSV(dataToExport);
      const blob = new Blob([csv], { type: "text/csv" });
      downloadBlob(blob, `${filename}.csv`);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => {
      let val = obj[header];
      if (typeof val === "object") val = JSON.stringify(val);
      return `"${String(val || "").replace(/"/g, '""')}"`;
    }).join(","));
    return [headers.join(","), ...rows].join("\n");
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: "Total Users", value: users.length.toString(), icon: Users, change: "+12%", color: "text-emerald-400" },
    { label: "Active Sessions", value: "456", icon: Activity, change: "+8%", color: "text-cyan-400" },
    { label: "Database Size", value: "2.4 GB", icon: Database, change: "+15%", color: "text-violet-400" },
    { label: "API Requests", value: "45.2k", icon: TrendingUp, change: "+22%", color: "text-pink-400" },
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
        <DeveloperWatermark />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="p-8 shadow-2xl bg-card border-border">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access</h1>
              <p className="text-muted-foreground text-sm">Enter your admin credentials to continue</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@shrivasta.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                    className="bg-background border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-red-500 text-sm text-center">{loginError}</p>
              )}

              <Button 
                onClick={handleAdminLogin} 
                disabled={loginLoading || !email || !password}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              >
                {loginLoading ? "Authenticating..." : "Sign In as Admin"}
              </Button>

              <Link href="/">
                <Button variant="ghost" className="w-full mt-2 text-muted-foreground">
                  Back to Home
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
        <DeveloperWatermark />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent pointer-events-none" />
      
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
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
              <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-[10px] text-primary font-medium tracking-wide">SHRIVASTA AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm"
              className="border-border bg-muted/50 text-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="flex gap-2 mb-6 border-b border-border pb-4 overflow-x-auto">
          {["overview", "logs", "users", "system", "export"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              size="sm"
              className={activeTab === tab 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"}
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
                <Card key={idx} className="bg-card/50 border-border backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                      {stat.label}
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-primary">{stat.change} from last month</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Activities</CardTitle>
                  <CardDescription className="text-muted-foreground">Latest user actions and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center gap-3">
                          {getLogIcon(log.type)}
                          <div>
                            <p className="text-sm font-medium text-foreground">{log.message}</p>
                            <p className="text-xs text-muted-foreground">{log.source}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.timestamp.split(" ")[1]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">System Health</CardTitle>
                  <CardDescription className="text-muted-foreground">Service status and uptime</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemHealth.map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{service.name}</p>
                            <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
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
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      System Logs
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Real-time monitoring and event logs</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-border bg-muted/50 text-foreground hover:bg-muted">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportData("json", "logs")} className="border-border bg-muted/50 text-foreground hover:bg-muted">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["all", "success", "info", "warning", "error"].map((filter) => (
                      <Button
                        key={filter}
                        variant={logFilter === filter ? "default" : "ghost"}
                        size="sm"
                        className={logFilter === filter 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"}
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
                      className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-0.5">{getLogIcon(log.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`text-xs ${getLogBadge(log.type)}`}>
                            {log.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{log.source}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{log.message}</p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      User Management
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">View and manage all users ({users.length} total)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadUsers} className="border-border bg-muted/50 text-foreground hover:bg-muted">
                      <RefreshCw className={`h-4 w-4 mr-2 ${usersLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportData("csv", "users")} className="border-border bg-muted/50 text-foreground hover:bg-muted">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <Brain className="h-8 w-8 animate-pulse text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Education</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Interest</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/30">
                            <td className="py-3 px-4 text-sm text-foreground">{user.full_name || "N/A"}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{user.education_level || "N/A"}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{user.field_of_interest || "N/A"}</td>
                            <td className="py-3 px-4">
                              <Badge className={user.onboarding_completed ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}>
                                {user.onboarding_completed ? "Active" : "Pending"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "system" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">System Settings</CardTitle>
                <CardDescription className="text-muted-foreground">Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-border bg-muted/30 text-foreground hover:bg-muted">
                    <Users className="h-6 w-6" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-border bg-muted/30 text-foreground hover:bg-muted">
                    <Database className="h-6 w-6" />
                    Database Backup
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-border bg-muted/30 text-foreground hover:bg-muted">
                    <Shield className="h-6 w-6" />
                    Security Settings
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 border-border bg-muted/30 text-foreground hover:bg-muted">
                    <BarChart3 className="h-6 w-6" />
                    Analytics Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "export" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Export Data
                </CardTitle>
                <CardDescription className="text-muted-foreground">Download database and analytics data in multiple formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-muted/30 border-border">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        <Users className="h-5 w-5 text-cyan-400" />
                        Users Data
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">Export all user profiles and data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start border-border" onClick={() => exportData("json", "users")}>
                        <FileJson className="h-4 w-4 mr-2 text-amber-400" />
                        Export as JSON
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-border" onClick={() => exportData("csv", "users")}>
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-400" />
                        Export as CSV
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30 border-border">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-violet-400" />
                        Analytics Data
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">Export platform analytics and metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start border-border" onClick={() => exportData("json", "analytics")}>
                        <FileJson className="h-4 w-4 mr-2 text-amber-400" />
                        Export as JSON
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-border" onClick={() => exportData("csv", "analytics")}>
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-400" />
                        Export as CSV
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30 border-border">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        <Database className="h-5 w-5 text-pink-400" />
                        Full Database
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">Export complete database backup</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start border-border" onClick={() => exportData("json", "all")}>
                        <FileDown className="h-4 w-4 mr-2 text-amber-400" />
                        Full Backup (JSON)
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-border" onClick={() => exportData("csv", "all")}>
                        <FileDown className="h-4 w-4 mr-2 text-emerald-400" />
                        Full Backup (CSV)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Quick Export</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowExportModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => { exportData("json", "all"); setShowExportModal(false); }}>
                <FileJson className="h-4 w-4 mr-2" />
                Export All Data (JSON)
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => { exportData("csv", "users"); setShowExportModal(false); }}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Users (CSV)
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <DeveloperWatermark />
    </div>
  );
}
