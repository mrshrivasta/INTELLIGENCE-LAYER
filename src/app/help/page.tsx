"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import Link from "next/link";

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click the 'Sign Up' button in the top right corner, fill in your details, and verify your email address. You'll then be guided through our onboarding process to set up your learning profile."
        },
        {
          q: "Is the platform free to use?",
          a: "Yes! Our core features are completely free. We offer premium plans with additional features, but you can access assessments, guidance, and learning roadmaps at no cost."
        },
        {
          q: "What education levels are supported?",
          a: "We support students from 10th grade through university level, across all fields of study including Web Development, Data Science, Business, Engineering, and more."
        }
      ]
    },
    {
      category: "Assessments",
      questions: [
        {
          q: "How do adaptive assessments work?",
          a: "Our AI-powered assessments adjust difficulty based on your performance. Each test features unique questions that won't repeat, ensuring fair evaluation every time."
        },
        {
          q: "Can I choose the difficulty level?",
          a: "Yes! Before starting an assessment, you can select from Easy, Medium, or Hard difficulty levels based on your confidence and preparation."
        },
        {
          q: "How are scores calculated?",
          a: "Scores are based on correct answers, time taken, and question difficulty. Detailed analytics show your performance across different topics."
        }
      ]
    },
    {
      category: "Learning Features",
      questions: [
        {
          q: "What is the AI Assistant?",
          a: "Our AI chatbot provides contextual help throughout your learning journey. It can answer questions, explain concepts, and offer guidance. Note: It's hidden during assessments to ensure fair testing."
        },
        {
          q: "How do I change my field of study?",
          a: "Go to Settings and select a new domain from the available options. Your roadmap and guidance will automatically update to match your new field."
        },
        {
          q: "What are the notification features?",
          a: "You'll receive smart notifications every 5 minutes with tips, reminders, and motivational messages to keep you engaged and on track."
        }
      ]
    },
    {
      category: "Progress & Analytics",
      questions: [
        {
          q: "How do I track my progress?",
          a: "Visit the Analytics tab to see detailed charts of your test scores, topic accuracy, and improvement over time. You'll also get AI-powered insights."
        },
        {
          q: "What is the Learning Roadmap?",
          a: "Your personalized roadmap breaks down your learning journey into daily, weekly, and monthly goals with specific topics and milestones."
        },
        {
          q: "Can I see my test history?",
          a: "Yes! All your past assessments, scores, and analytics are saved and accessible from your dashboard at any time."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">AI Intelligence Layer</span>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Help Center
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Find answers to common questions about using our platform
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredFaqs.map((category, catIndex) => (
            <div key={catIndex} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const globalIndex = catIndex * 100 + qIndex;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div key={qIndex} className="border-b border-slate-100 last:border-0">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-violet-600"
                      >
                        <span className="font-medium text-slate-900">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 flex-shrink-0 text-violet-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 flex-shrink-0 text-slate-400" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="pb-4 text-slate-600">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">No results found for "{searchTerm}"</p>
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-center text-white shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">Still have questions?</h2>
          <p className="mb-6 text-violet-100">
            Our team is here to help. Contact us and we'll get back to you soon.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Contact Support
            </Button>
          </Link>
        </div>
      </main>
      <DeveloperWatermark />
    </div>
  );
}
