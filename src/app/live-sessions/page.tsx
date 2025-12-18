"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video, ChevronLeft, Users, Clock, Calendar, Play, Bell, Star,
  MessageSquare, Heart, Share2, Volume2, VolumeX, Maximize2, Settings,
  Mic, MicOff, Camera, CameraOff, Hand, Send, MoreVertical, Sparkles,
  Award, Zap, CheckCircle, Circle, Timer, ArrowRight, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface LiveSession {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
    title: string;
    rating: number;
    students: number;
  };
  topic: string;
  description: string;
  status: "live" | "upcoming" | "ended";
  startTime: string;
  duration: string;
  viewers: number;
  category: string;
  tags: string[];
  thumbnail: string;
  isReminder?: boolean;
}

const liveSessions: LiveSession[] = [
  {
    id: "1",
    title: "Building Real-time Apps with WebSockets",
    instructor: { name: "Dr. Sarah Chen", avatar: "S", title: "Senior Engineer at Google", rating: 4.9, students: 12500 },
    topic: "WebSockets & Real-time",
    description: "Learn how to build scalable real-time applications using WebSockets, Socket.io, and modern patterns.",
    status: "live",
    startTime: "Now",
    duration: "1h 30m",
    viewers: 342,
    category: "Backend",
    tags: ["websockets", "nodejs", "realtime"],
    thumbnail: "gradient-1"
  },
  {
    id: "2",
    title: "React Performance Optimization Masterclass",
    instructor: { name: "Mike Johnson", avatar: "M", title: "React Core Team", rating: 4.8, students: 8900 },
    topic: "React Performance",
    description: "Deep dive into React's rendering behavior, memoization strategies, and performance profiling.",
    status: "live",
    startTime: "Started 15m ago",
    duration: "2h",
    viewers: 567,
    category: "Frontend",
    tags: ["react", "performance", "optimization"],
    thumbnail: "gradient-2"
  },
  {
    id: "3",
    title: "Introduction to Machine Learning with Python",
    instructor: { name: "Dr. Emily Wang", avatar: "E", title: "AI Researcher at OpenAI", rating: 5.0, students: 15000 },
    topic: "Machine Learning",
    description: "Start your ML journey with hands-on exercises in Python using scikit-learn and TensorFlow.",
    status: "upcoming",
    startTime: "In 2 hours",
    duration: "2h 30m",
    viewers: 0,
    category: "AI/ML",
    tags: ["python", "ml", "tensorflow"],
    thumbnail: "gradient-3",
    isReminder: true
  },
  {
    id: "4",
    title: "System Design: Building Scalable APIs",
    instructor: { name: "James Wilson", avatar: "J", title: "Architect at Amazon", rating: 4.7, students: 10200 },
    topic: "System Design",
    description: "Learn the principles of designing APIs that scale to millions of users.",
    status: "upcoming",
    startTime: "Tomorrow, 3:00 PM",
    duration: "1h 45m",
    viewers: 0,
    category: "Architecture",
    tags: ["api", "scalability", "design"],
    thumbnail: "gradient-4"
  },
  {
    id: "5",
    title: "Advanced TypeScript Patterns",
    instructor: { name: "Anna Martinez", avatar: "A", title: "TypeScript Expert", rating: 4.9, students: 7800 },
    topic: "TypeScript",
    description: "Master advanced TypeScript features including generics, conditional types, and utility types.",
    status: "ended",
    startTime: "Ended 2h ago",
    duration: "1h 30m",
    viewers: 892,
    category: "Languages",
    tags: ["typescript", "generics", "advanced"],
    thumbnail: "gradient-5"
  },
];

const gradients: Record<string, string> = {
  "gradient-1": "from-cyan-500 via-blue-500 to-indigo-500",
  "gradient-2": "from-orange-500 via-red-500 to-pink-500",
  "gradient-3": "from-emerald-500 via-teal-500 to-cyan-500",
  "gradient-4": "from-violet-500 via-purple-500 to-fuchsia-500",
  "gradient-5": "from-amber-500 via-orange-500 to-red-500",
};

const chatMessages = [
  { user: "Alex", message: "This is amazing!", time: "2m ago" },
  { user: "Sarah", message: "Can you explain that again?", time: "1m ago" },
  { user: "Mike", message: "Great explanation 👏", time: "30s ago" },
  { user: "Emma", message: "What about error handling?", time: "Just now" },
];

export default function LiveSessionsPage() {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [viewerCount, setViewerCount] = useState(342);

  useEffect(() => {
    if (selectedSession?.status === "live") {
      const interval = setInterval(() => {
        setViewerCount(v => v + Math.floor(Math.random() * 5) - 2);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedSession]);

  const filteredSessions = liveSessions.filter(s => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const liveCount = liveSessions.filter(s => s.status === "live").length;
  const upcomingCount = liveSessions.filter(s => s.status === "upcoming").length;

  if (selectedSession) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 items-center justify-between px-4 max-w-7xl">
            <Button variant="ghost" size="sm" onClick={() => setSelectedSession(null)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Sessions
            </Button>
            <div className="flex items-center gap-2">
              {selectedSession.status === "live" && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Circle className="h-2 w-2 mr-1 fill-current" /> LIVE
                </Badge>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" /> {viewerCount} watching
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-3.5rem)]">
          <div className={`flex-1 flex flex-col ${showChat ? "" : "w-full"}`}>
            <div className={`relative flex-1 bg-gradient-to-br ${gradients[selectedSession.thumbnail]}`}>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-4"
                  >
                    <Video className="h-24 w-24 text-white mx-auto" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedSession.title}</h2>
                  <p className="text-white/80">with {selectedSession.instructor.name}</p>
                </motion.div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20 text-white"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Play className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <div className="flex-1 h-1 bg-white/30 rounded-full w-64 mx-4">
                    <div className="h-full bg-white rounded-full w-1/3" />
                  </div>
                  <span className="text-white text-sm">32:15 / {selectedSession.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isHandRaised ? "default" : "ghost"}
                    size="sm"
                    className={isHandRaised ? "bg-amber-500 hover:bg-amber-600" : "bg-white/10 hover:bg-white/20 text-white"}
                    onClick={() => setIsHandRaised(!isHandRaised)}
                  >
                    <Hand className="h-4 w-4 mr-1" />
                    {isHandRaised ? "Hand Raised" : "Raise Hand"}
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                    <Heart className="h-4 w-4 mr-1" /> Like
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-bold">
                  {selectedSession.instructor.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{selectedSession.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{selectedSession.instructor.name}</span>
                    <span>•</span>
                    <span>{selectedSession.instructor.title}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      {selectedSession.instructor.rating}
                    </span>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                  <Bell className="mr-2 h-4 w-4" /> Follow
                </Button>
              </div>
            </div>
          </div>

          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              className="border-l border-border bg-card flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h4 className="font-bold text-foreground">Live Chat</h4>
                <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {[...chatMessages, ...chatMessages, ...chatMessages].map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {msg.user[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Send a message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary outline-none text-sm"
                  />
                  <Button size="icon" className="bg-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {!showChat && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-20"
              onClick={() => setShowChat(true)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 items-center justify-between px-6 max-w-7xl">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ChevronLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Live Sessions
            {liveCount > 0 && (
              <Badge className="bg-red-500 text-white animate-pulse">
                {liveCount} Live
              </Badge>
            )}
          </h1>
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
            <Calendar className="mr-2 h-4 w-4" /> Schedule
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Live Now", value: liveCount, icon: Circle, color: "text-red-500", sublabel: "Active sessions", animate: true },
            { label: "Upcoming", value: upcomingCount, icon: Clock, color: "text-amber-400", sublabel: "Scheduled today" },
            { label: "Total Views", value: "12.5K", icon: Users, color: "text-cyan-400", sublabel: "This week" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <stat.icon className={`h-8 w-8 ${stat.color} ${stat.animate ? "animate-pulse" : ""}`} />
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex items-center gap-2 mb-6">
          {[
            { key: "all", label: "All Sessions" },
            { key: "live", label: "Live Now", badge: liveCount },
            { key: "upcoming", label: "Upcoming", badge: upcomingCount },
          ].map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key as typeof filter)}
              className={filter === f.key ? "bg-primary text-white" : ""}
            >
              {f.label}
              {f.badge !== undefined && f.badge > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {f.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => session.status !== "ended" && setSelectedSession(session)}
              className={`relative group rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden cursor-pointer transition-all ${
                session.status === "ended" ? "opacity-60" : "hover:border-primary/30"
              }`}
            >
              <div className={`h-40 bg-gradient-to-br ${gradients[session.thumbnail]} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/30" />
                
                {session.status === "live" && (
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <Circle className="h-2 w-2 mr-1 fill-current" /> LIVE
                    </Badge>
                    <Badge className="bg-black/50 text-white backdrop-blur-sm">
                      <Users className="h-3 w-3 mr-1" /> {session.viewers}
                    </Badge>
                  </div>
                )}

                {session.status === "upcoming" && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-amber-500 text-white">
                      <Clock className="h-3 w-3 mr-1" /> {session.startTime}
                    </Badge>
                  </div>
                )}

                {session.status === "ended" && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-muted text-muted-foreground">
                      Ended
                    </Badge>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-4 rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    <Play className="h-8 w-8 text-white" />
                  </motion.div>
                </div>

                <div className="absolute bottom-3 right-3">
                  <Badge className="bg-black/50 text-white backdrop-blur-sm">
                    <Timer className="h-3 w-3 mr-1" /> {session.duration}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                    {session.instructor.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground line-clamp-2">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">{session.instructor.name}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{session.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {session.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span>{session.instructor.rating}</span>
                    <span>•</span>
                    <span>{session.instructor.students.toLocaleString()} students</span>
                  </div>
                  {session.status === "upcoming" && (
                    <Button
                      variant={session.isReminder ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className={session.isReminder ? "bg-primary" : ""}
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      {session.isReminder ? "Reminded" : "Remind"}
                    </Button>
                  )}
                  {session.status === "live" && (
                    <Button size="sm" className="bg-red-500 hover:bg-red-600">
                      Join Now <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl border border-border bg-gradient-to-br from-violet-500/5 to-purple-500/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Host Your Own Session</h3>
                <p className="text-muted-foreground">Share your knowledge with thousands of learners</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-500">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
