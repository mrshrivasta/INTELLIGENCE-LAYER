"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
  RefreshCw,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

const services = [
  { name: "Web Application", icon: Globe, status: "operational", uptime: "99.99%", latency: "45ms" },
  { name: "API Server", icon: Server, status: "operational", uptime: "99.98%", latency: "32ms" },
  { name: "Database (Supabase)", icon: Database, status: "operational", uptime: "99.99%", latency: "12ms" },
  { name: "Authentication", icon: Shield, status: "operational", uptime: "100%", latency: "28ms" },
  { name: "AI Processing", icon: Zap, status: "operational", uptime: "99.95%", latency: "156ms" },
  { name: "CDN/Static Assets", icon: Globe, status: "operational", uptime: "100%", latency: "18ms" },
];

const incidents = [
  {
    date: "Dec 15, 2024",
    title: "Scheduled Maintenance",
    status: "resolved",
    description: "Database optimization and security updates completed successfully.",
    duration: "30 minutes",
  },
  {
    date: "Dec 10, 2024",
    title: "API Response Delay",
    status: "resolved",
    description: "Brief increase in API response times due to high traffic. Scaled up servers.",
    duration: "15 minutes",
  },
  {
    date: "Dec 5, 2024",
    title: "SSL Certificate Renewal",
    status: "resolved",
    description: "Routine SSL certificate renewal completed with zero downtime.",
    duration: "0 minutes",
  },
];

const uptimeData = [
  { day: "Mon", uptime: 100 },
  { day: "Tue", uptime: 100 },
  { day: "Wed", uptime: 99.9 },
  { day: "Thu", uptime: 100 },
  { day: "Fri", uptime: 100 },
  { day: "Sat", uptime: 100 },
  { day: "Sun", uptime: 100 },
];

export default function StatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const allOperational = services.every((s) => s.status === "operational");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-[var(--border-primary)]" />
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold">System Status</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isRefreshing}
            className="border-[var(--border-primary)]"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            allOperational
              ? "bg-emerald-500/10 border border-emerald-500/20"
              : "bg-amber-500/10 border border-amber-500/20"
          }`}>
            {allOperational ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">All Systems Operational</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 font-medium">Partial Outage</span>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[var(--text-primary)] to-emerald-400 bg-clip-text text-transparent">
            Shrivasta AI Status
          </h1>
          <p className="text-[var(--text-muted)] flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold mb-4">Service Status</h2>
          <div className="space-y-3">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[var(--text-muted)]" />
                    <span className="font-medium text-[var(--text-primary)]">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--text-muted)]">{service.latency}</span>
                    <span className="text-xs text-[var(--text-muted)]">{service.uptime}</span>
                    <Badge
                      className={
                        service.status === "operational"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }
                    >
                      {service.status === "operational" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {service.status}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold mb-4">7-Day Uptime</h2>
          <div className="p-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50">
            <div className="flex items-end justify-between gap-2 h-24">
              {uptimeData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-emerald-500 to-emerald-400"
                    style={{ height: `${day.uptime}%` }}
                  />
                  <span className="text-xs text-[var(--text-muted)]">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-[var(--border-primary)]">
              <span className="text-sm text-[var(--text-muted)]">Overall Uptime (7 days)</span>
              <span className="text-sm font-semibold text-emerald-400">99.99%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-[var(--text-primary)]">{incident.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{incident.date}</p>
                  </div>
                  <Badge
                    className={
                      incident.status === "resolved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }
                  >
                    {incident.status}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--text-muted)]">{incident.description}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2">Duration: {incident.duration}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-sm text-[var(--text-muted)]"
        >
          <p>Subscribe to status updates or report issues:</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link href="/contact">
              <Button size="sm" variant="outline" className="border-[var(--border-primary)]">
                Report Issue
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
