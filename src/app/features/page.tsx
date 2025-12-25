"use client";

import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Target, TrendingUp, BookOpen, Users, MessageSquare, Shield, BarChart3, Zap } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Guidance",
      description: "Get personalized learning recommendations tailored to your goals and current skill level.",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Adaptive Assessments",
      description: "Take tests that adapt to your performance with unique questions every time.",
      color: "from-fuchsia-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your progress with detailed insights and visualizations of your learning journey.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: BookOpen,
      title: "Custom Learning Roadmaps",
      description: "Follow structured pathways designed for your chosen field and career goals.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Get instant help from our intelligent chatbot that understands your learning context.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Users,
      title: "Multi-Level Support",
      description: "Suitable for all students from 10th grade to university level across all fields.",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Smart Notifications",
      description: "Receive timely reminders and motivational messages to keep you on track.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your data is protected with industry-leading security measures and encryption.",
      color: "from-slate-500 to-gray-600"
    },
    {
      icon: BarChart3,
      title: "Detailed Insights",
      description: "Understand your strengths and areas for improvement with comprehensive analytics.",
      color: "from-teal-500 to-cyan-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Shrivasta AI</span>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-900">Platform Features</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Everything You Need to Excel
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Our AI-powered platform provides comprehensive tools and features to support your educational journey from start to finish.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-center text-white shadow-xl">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="mb-6 text-lg text-violet-100">
            Join thousands of students already using our platform to achieve their goals.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full border-white bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <DeveloperWatermark />
    </div>
  );
}
