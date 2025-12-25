"use client";

import { Button } from "@/components/ui/button";
import { Brain, UserPlus, Target, BookOpen, BarChart3, Trophy, ArrowRight } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Account",
      description: "Sign up and tell us about your educational background, interests, and goals.",
      step: "01"
    },
    {
      icon: Target,
      title: "Set Your Goals",
      description: "Choose your field of study and target role. Our AI will create a personalized learning path.",
      step: "02"
    },
    {
      icon: BookOpen,
      title: "Follow Your Roadmap",
      description: "Work through curated lessons and materials tailored to your learning style and pace.",
      step: "03"
    },
    {
      icon: BarChart3,
      title: "Take Assessments",
      description: "Test your knowledge with adaptive assessments that adjust to your skill level.",
      step: "04"
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics and receive AI-powered recommendations.",
      step: "05"
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
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            How It Works
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Get started in minutes and begin your personalized learning journey with AI-powered guidance.
          </p>
        </div>

        <div className="relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={index} className="relative mb-12 grid gap-8 lg:grid-cols-2 lg:items-center">
                {!isLast && (
                  <div className="absolute left-8 top-24 h-full w-0.5 bg-gradient-to-b from-violet-300 to-fuchsia-300 lg:hidden" />
                )}
                
                <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-violet-600 shadow">
                        {step.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-slate-900">{step.title}</h3>
                      <p className="text-lg text-slate-600">{step.description}</p>
                    </div>
                  </div>
                </div>

                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex h-64 items-center justify-center bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl">
                      <Icon className="h-32 w-32 text-violet-600 opacity-20" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">Ready to Begin?</h2>
          <p className="mb-6 text-lg text-slate-600">
            Start your personalized learning journey today and achieve your educational goals.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
      <DeveloperWatermark />
    </div>
  );
}
