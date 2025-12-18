"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, 
  Code, 
  Brain, 
  Network, 
  Globe, 
  Terminal,
  Lock,
  Server,
  Cpu,
  ArrowLeft,
  Github,
  Linkedin,
  Mail,
  Award,
  Sparkles,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

export default function DeveloperPage() {
  const skills = [
    { name: "Ethical Hacking", icon: Shield, color: "from-red-500 to-orange-500", desc: "Penetration Testing & Vulnerability Assessment" },
    { name: "Cyber Security", icon: Lock, color: "from-emerald-500 to-teal-500", desc: "Security Architecture & Threat Analysis" },
    { name: "Artificial Intelligence", icon: Brain, color: "from-violet-500 to-purple-500", desc: "Machine Learning & Neural Networks" },
    { name: "Networking", icon: Network, color: "from-blue-500 to-cyan-500", desc: "Network Infrastructure & Protocols" },
    { name: "Full Stack Development", icon: Code, color: "from-pink-500 to-rose-500", desc: "Frontend, Backend & Database Systems" },
  ];

  const expertise = [
    { icon: Terminal, label: "Security Audits" },
    { icon: Server, label: "Cloud Security" },
    { icon: Cpu, label: "System Architecture" },
    { icon: Globe, label: "Web Applications" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] dark:bg-[#0a0a0f] light:bg-gray-50 text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{backgroundImage: "radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)", backgroundSize: "40px 40px"}} />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 blur-lg opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Shrivasta AI
              </h1>
              <p className="text-[10px] text-emerald-400/80 font-medium tracking-wide">INTELLIGENCE LAYER</p>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 p-1 mx-auto">
              <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center">
                <span className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  KS
                </span>
              </div>
            </div>
          </div>

          <Badge className="mb-4 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 inline" />
            Lead Developer
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Karanam Shrivasta
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Security Expert & Full Stack Developer specializing in AI-driven solutions and cyber defense systems.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 font-semibold shadow-lg shadow-emerald-500/25">
              <Mail className="mr-2 h-4 w-4" />
              Contact Me
            </Button>
            <a href="https://github.com/karanam-shrivasta" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/karanam-shrivasta/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-emerald-400" />
              Skills & Expertise
            </h2>
            <p className="text-white/50">Core competencies and technical proficiencies</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#111827]/50 backdrop-blur-sm p-6 hover:border-white/10 hover:bg-[#111827]/80 transition-all"
                >
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${skill.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-white/50">{skill.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#111827]/80 to-[#0f1419]/80 backdrop-blur-sm p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-2">Additional Expertise</h2>
            <p className="text-white/50">Specialized areas of knowledge</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {expertise.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Icon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-white/80">{item.label}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Creator of <span className="text-emerald-400 font-semibold">Shrivasta AI</span> - Empowering students with intelligent learning solutions
            </p>
          </div>
        </motion.div>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
