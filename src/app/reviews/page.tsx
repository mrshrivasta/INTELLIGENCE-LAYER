"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Quote,
  Users,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Award,
  Verified,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Software Engineer",
    company: "Tech Startup",
    avatar: "PS",
    rating: 5,
    review: "Shrivasta AI transformed my learning journey. The personalized roadmaps and AI assessments helped me land my dream job in just 3 months!",
    date: "2 days ago",
    verified: true,
    helpful: 124,
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Data Scientist",
    company: "Fortune 500",
    avatar: "RV",
    rating: 5,
    review: "The AI-powered analytics gave me insights I never had before. My skill progression has been incredible since using this platform.",
    date: "1 week ago",
    verified: true,
    helpful: 89,
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Full Stack Developer",
    company: "Freelancer",
    avatar: "AP",
    rating: 5,
    review: "Best investment in my career! The daily guidance and adaptive tests keep me on track. Highly recommend for anyone serious about growth.",
    date: "2 weeks ago",
    verified: true,
    helpful: 156,
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "ML Engineer",
    company: "AI Research Lab",
    avatar: "VS",
    rating: 4,
    review: "Great platform with comprehensive features. The security measures are top-notch. Would love to see more advanced ML courses.",
    date: "3 weeks ago",
    verified: true,
    helpful: 67,
  },
  {
    id: 5,
    name: "Sneha Reddy",
    role: "Product Manager",
    company: "SaaS Company",
    avatar: "SR",
    rating: 5,
    review: "Even as a non-technical PM, I found the platform incredibly intuitive. The AI chatbot answers all my questions instantly!",
    date: "1 month ago",
    verified: true,
    helpful: 203,
  },
  {
    id: 6,
    name: "Arjun Nair",
    role: "Student",
    company: "IIT Delhi",
    avatar: "AN",
    rating: 5,
    review: "As a student, this platform gave me an edge. The assessments helped me identify gaps in my knowledge. Now I'm top of my class!",
    date: "1 month ago",
    verified: true,
    helpful: 178,
  },
];

const stats = [
  { label: "Happy Users", value: "10,000+", icon: Users },
  { label: "Average Rating", value: "4.9/5", icon: Star },
  { label: "Success Stories", value: "2,500+", icon: Award },
  { label: "Career Switches", value: "1,200+", icon: TrendingUp },
];

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-[var(--border-primary)]" />
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="font-semibold">Reviews</span>
            </div>
          </div>
          <Link href="/signup">
            <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              Get Started Free
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
            Trusted by thousands
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--text-primary)] via-amber-400 to-[var(--text-primary)] bg-clip-text text-transparent">
            What Our Users Say
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Real stories from real learners who transformed their careers with Shrivasta AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 text-center"
              >
                <Icon className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="absolute -top-4 -left-4 text-8xl text-emerald-500/10 font-serif">
            <Quote />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {currentReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="group p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-[var(--text-primary)]">{review.name}</h4>
                      {review.verified && <Verified className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{review.role}</p>
                    <p className="text-xs text-[var(--text-muted)]">{review.company}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < review.rating ? "text-amber-400 fill-amber-400" : "text-[var(--text-muted)]"}`}
                    />
                  ))}
                </div>

                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  &quot;{review.review}&quot;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-primary)]">
                  <span className="text-xs text-[var(--text-muted)]">{review.date}</span>
                  <button className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-emerald-400 transition-colors">
                    <ThumbsUp className="h-3 w-3" />
                    {review.helpful} found helpful
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="border-[var(--border-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-[var(--text-muted)]">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="border-[var(--border-primary)]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8 text-center"
        >
          <MessageSquare className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Share Your Experience</h3>
          <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
            Join thousands of learners who are transforming their careers with Shrivasta AI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-[var(--border-primary)]">
                Leave a Review
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
