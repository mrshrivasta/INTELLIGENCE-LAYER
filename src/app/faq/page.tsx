"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  Mail,
  Zap,
  Shield,
  CreditCard,
  Users,
  BookOpen,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import { Input } from "@/components/ui/input";

const faqCategories = [
  { id: "general", label: "General", icon: HelpCircle },
  { id: "features", label: "Features", icon: Zap },
  { id: "security", label: "Security", icon: Shield },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "account", label: "Account", icon: Users },
];

const faqs = [
  {
    category: "general",
    question: "What is Shrivasta AI?",
    answer: "Shrivasta AI is an intelligent learning platform that uses AI to create personalized learning paths, assessments, and career guidance. It helps students and professionals accelerate their skill development through adaptive learning.",
  },
  {
    category: "general",
    question: "How does the AI personalization work?",
    answer: "Our AI analyzes your current skills, learning patterns, goals, and progress to create a customized learning roadmap. It continuously adapts based on your performance and preferences.",
  },
  {
    category: "general",
    question: "Who can use Shrivasta AI?",
    answer: "Anyone looking to learn new skills or advance their career can use our platform. We cater to students, working professionals, career switchers, and lifelong learners.",
  },
  {
    category: "features",
    question: "What features are included?",
    answer: "Key features include AI-powered assessments, personalized learning roadmaps, voice assistant, real-time analytics, progress tracking, daily guidance, and an AI chatbot for instant help.",
  },
  {
    category: "features",
    question: "Can I track my progress?",
    answer: "Yes! Our analytics dashboard provides detailed insights into your learning progress, skill development, time spent, and areas for improvement.",
  },
  {
    category: "features",
    question: "Is there a mobile app?",
    answer: "Our platform is fully responsive and works great on mobile browsers. A dedicated mobile app is coming soon!",
  },
  {
    category: "security",
    question: "How is my data protected?",
    answer: "We use end-to-end encryption, secure authentication via Supabase, and follow industry best practices. Your data is stored securely and never shared with third parties.",
  },
  {
    category: "security",
    question: "Is the platform GDPR compliant?",
    answer: "Yes, we are fully GDPR compliant. You can request data export or deletion at any time through your account settings.",
  },
  {
    category: "pricing",
    question: "Is Shrivasta AI free to use?",
    answer: "We offer a free tier with essential features. Premium plans with advanced features like unlimited assessments and priority support are also available.",
  },
  {
    category: "pricing",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees.",
  },
  {
    category: "account",
    question: "How do I create an account?",
    answer: "Click 'Sign Up' on the homepage, enter your email and password, verify your email, and you're ready to start learning!",
  },
  {
    category: "account",
    question: "I forgot my password. How do I reset it?",
    answer: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a password reset link.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "all" || faq.category === activeCategory) &&
      (searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />

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
              <HelpCircle className="h-5 w-5 text-cyan-400" />
              <span className="font-semibold">FAQ</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            Help Center
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[var(--text-primary)] to-cyan-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[var(--text-muted)]">
            Find answers to common questions about Shrivasta AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[var(--bg-secondary)] border-[var(--border-primary)]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {faqCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={
                  activeCategory === cat.id
                    ? "bg-cyan-500 text-white"
                    : "border-[var(--border-primary)] text-[var(--text-secondary)]"
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {cat.label}
              </Button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {filteredFaqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 overflow-hidden"
            >
              <button
                onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className="font-medium text-[var(--text-primary)] pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-[var(--text-muted)] transition-transform ${
                    openQuestion === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openQuestion === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-primary)] pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No results found</h3>
              <p className="text-[var(--text-muted)]">Try a different search term or category</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 p-8 text-center"
        >
          <MessageSquare className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Still have questions?</h3>
          <p className="text-[var(--text-muted)] mb-6">
            Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline" className="border-[var(--border-primary)]">
                Help Center
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
