"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award, ChevronLeft, Download, Share2, ExternalLink, CheckCircle,
  Lock, Calendar, Clock, Star, Trophy, Medal, Crown, Sparkles,
  GraduationCap, BookOpen, Target, Zap, Eye, X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Certificate {
  id: string;
  title: string;
  course: string;
  issueDate: string;
  expiryDate?: string;
  grade: string;
  score: number;
  skills: string[];
  credentialId: string;
  status: "completed" | "in_progress" | "locked";
  progress?: number;
  image: string;
  instructor: string;
  duration: string;
  type: "course" | "specialization" | "professional";
}

const certificates: Certificate[] = [
  {
    id: "1",
    title: "Full Stack Web Development",
    course: "Complete Web Developer Bootcamp",
    issueDate: "2024-01-15",
    grade: "A+",
    score: 95,
    skills: ["React", "Node.js", "MongoDB", "Express"],
    credentialId: "CERT-2024-001",
    status: "completed",
    image: "gradient-1",
    instructor: "Dr. Sarah Johnson",
    duration: "40 hours",
    type: "specialization"
  },
  {
    id: "2",
    title: "JavaScript Mastery",
    course: "Advanced JavaScript Concepts",
    issueDate: "2024-02-20",
    grade: "A",
    score: 92,
    skills: ["ES6+", "Async/Await", "Design Patterns", "Testing"],
    credentialId: "CERT-2024-002",
    status: "completed",
    image: "gradient-2",
    instructor: "Prof. Mike Chen",
    duration: "25 hours",
    type: "course"
  },
  {
    id: "3",
    title: "React Professional",
    course: "React & Redux Complete Guide",
    issueDate: "2024-03-10",
    grade: "A+",
    score: 98,
    skills: ["React Hooks", "Redux", "Context API", "Performance"],
    credentialId: "CERT-2024-003",
    status: "completed",
    image: "gradient-3",
    instructor: "Emma Williams",
    duration: "30 hours",
    type: "professional"
  },
  {
    id: "4",
    title: "Data Science Fundamentals",
    course: "Python for Data Science",
    issueDate: "",
    grade: "",
    score: 0,
    skills: ["Python", "Pandas", "NumPy", "Visualization"],
    credentialId: "",
    status: "in_progress",
    progress: 65,
    image: "gradient-4",
    instructor: "Dr. Alex Rivera",
    duration: "35 hours",
    type: "specialization"
  },
  {
    id: "5",
    title: "Cloud Architecture",
    course: "AWS Solutions Architect",
    issueDate: "",
    grade: "",
    score: 0,
    skills: ["AWS", "Cloud Security", "Serverless", "DevOps"],
    credentialId: "",
    status: "locked",
    image: "gradient-5",
    instructor: "James Wilson",
    duration: "45 hours",
    type: "professional"
  },
];

const gradients: Record<string, string> = {
  "gradient-1": "from-emerald-500 via-teal-500 to-cyan-500",
  "gradient-2": "from-amber-500 via-orange-500 to-red-500",
  "gradient-3": "from-violet-500 via-purple-500 to-fuchsia-500",
  "gradient-4": "from-blue-500 via-indigo-500 to-violet-500",
  "gradient-5": "from-rose-500 via-pink-500 to-fuchsia-500",
};

const typeIcons: Record<string, React.ElementType> = {
  course: BookOpen,
  specialization: Target,
  professional: Crown,
};

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "in_progress">("all");
  const [showPreview, setShowPreview] = useState(false);

  const filteredCertificates = certificates.filter(cert => {
    if (filter === "all") return true;
    return cert.status === filter;
  });

  const completedCount = certificates.filter(c => c.status === "completed").length;
  const inProgressCount = certificates.filter(c => c.status === "in_progress").length;
  const totalHours = certificates
    .filter(c => c.status === "completed")
    .reduce((acc, c) => acc + parseInt(c.duration), 0);

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
            <Award className="h-5 w-5 text-primary" />
            My Certificates
          </h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Certificates", value: completedCount, icon: Award, color: "text-primary", bg: "from-primary/10 to-cyan-500/10" },
            { label: "In Progress", value: inProgressCount, icon: Target, color: "text-amber-400", bg: "from-amber-500/10 to-orange-500/10" },
            { label: "Learning Hours", value: `${totalHours}h`, icon: Clock, color: "text-violet-400", bg: "from-violet-500/10 to-purple-500/10" },
            { label: "Avg Score", value: "95%", icon: Star, color: "text-emerald-400", bg: "from-emerald-500/10 to-teal-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl border border-border bg-gradient-to-br ${stat.bg}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex items-center gap-2 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "completed", label: "Completed" },
            { key: "in_progress", label: "In Progress" },
          ].map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key as typeof filter)}
              className={filter === f.key ? "bg-primary text-white" : ""}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert, i) => {
            const TypeIcon = typeIcons[cert.type];
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => cert.status !== "locked" && setSelectedCertificate(cert)}
                className={`relative group rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden cursor-pointer transition-all ${
                  cert.status === "locked" ? "opacity-60 cursor-not-allowed" : "hover:border-primary/30"
                }`}
              >
                {cert.status === "locked" && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="text-center">
                      <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Complete prerequisites</p>
                    </div>
                  </div>
                )}

                <div className={`h-40 bg-gradient-to-br ${gradients[cert.image]} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    >
                      {cert.status === "completed" ? (
                        <Award className="h-20 w-20 text-white/80" />
                      ) : (
                        <GraduationCap className="h-20 w-20 text-white/80" />
                      )}
                    </motion.div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {cert.type}
                    </Badge>
                  </div>
                  {cert.status === "completed" && (
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-foreground mb-1">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{cert.course}</p>

                  {cert.status === "completed" ? (
                    <>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </span>
                        <span className="font-bold text-primary">Grade: {cert.grade}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills.slice(0, 3).map((skill, j) => (
                          <Badge key={j} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {cert.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{cert.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </>
                  ) : cert.status === "in_progress" ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary font-medium">{cert.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cert.progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full"
                        />
                      </div>
                      <Button size="sm" className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500">
                        Continue Learning
                      </Button>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl border border-border bg-gradient-to-br from-amber-500/5 to-orange-500/5"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Achievement Badges</h3>
              <p className="text-muted-foreground">Showcase your accomplishments</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: Star, label: "Top Performer", color: "amber", unlocked: true },
              { icon: Zap, label: "Fast Learner", color: "cyan", unlocked: true },
              { icon: Medal, label: "First Certificate", color: "emerald", unlocked: true },
              { icon: Crown, label: "Master Level", color: "violet", unlocked: true },
              { icon: Target, label: "Perfectionist", color: "pink", unlocked: false },
              { icon: Sparkles, label: "Rising Star", color: "blue", unlocked: false },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl border border-border text-center ${
                  badge.unlocked ? "bg-card" : "bg-muted/50 opacity-50"
                }`}
              >
                <div className={`mx-auto mb-2 p-3 rounded-full w-fit ${
                  badge.unlocked
                    ? `bg-${badge.color}-500/10`
                    : "bg-muted"
                }`}>
                  <badge.icon className={`h-6 w-6 ${
                    badge.unlocked ? `text-${badge.color}-500` : "text-muted-foreground"
                  }`} />
                </div>
                <p className="text-sm font-medium text-foreground">{badge.label}</p>
                {!badge.unlocked && (
                  <Lock className="h-3 w-3 mx-auto mt-1 text-muted-foreground" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl border border-border bg-card overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className={`h-48 bg-gradient-to-br ${gradients[selectedCertificate.image]} relative`}>
                <div className="absolute inset-0 bg-black/30" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                  onClick={() => setSelectedCertificate(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Award className="h-24 w-24 text-white" />
                  </motion.div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedCertificate.title}</h2>
                  <p className="text-white/80">{selectedCertificate.course}</p>
                </div>
              </div>

              <div className="p-6">
                {selectedCertificate.status === "completed" ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-foreground">{selectedCertificate.grade}</p>
                        <p className="text-xs text-muted-foreground">Grade</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-foreground">{selectedCertificate.score}%</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-foreground">{selectedCertificate.duration}</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-lg font-bold text-foreground truncate">{selectedCertificate.instructor}</p>
                        <p className="text-xs text-muted-foreground">Instructor</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-foreground mb-2">Skills Earned</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCertificate.skills.map((skill, i) => (
                          <Badge key={i} className="bg-primary/10 text-primary border-primary/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Credential ID</p>
                          <p className="text-sm font-mono font-medium text-foreground">{selectedCertificate.credentialId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">Issued</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(selectedCertificate.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary font-medium">{selectedCertificate.progress}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedCertificate.progress}%` }}
                          className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full"
                        />
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Complete the remaining {100 - (selectedCertificate.progress || 0)}% to earn this certificate
                    </p>
                    <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                      Continue Learning
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
