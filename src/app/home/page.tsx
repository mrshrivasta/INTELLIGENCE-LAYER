"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Rocket, Target, TrendingUp, Shield, Users } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-400" />
              <span className="text-white font-bold text-xl">AI Intelligence Layer</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/about"><Button variant="ghost" className="text-white">About</Button></Link>
              <Link href="/features"><Button variant="ghost" className="text-white">Features</Button></Link>
              <Link href="/contact"><Button variant="ghost" className="text-white">Contact</Button></Link>
              <Link href="/login"><Button variant="outline" className="text-white border-white">Login</Button></Link>
              <Link href="/signup"><Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Your AI-Powered<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Learning Companion
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Personalized guidance, adaptive assessments, and AI-driven roadmaps for students from 10th grade to professionals.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg">
                  Start Learning Free <Rocket className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="text-white border-white">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-white/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <Target className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Personalized Learning</h3>
                <p className="text-gray-300">AI analyzes your goals and creates custom learning paths tailored to your needs.</p>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Adaptive Assessments</h3>
                <p className="text-gray-300">Smart tests that adapt to your skill level with unique questions every time.</p>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <Shield className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
                <p className="text-gray-300">Bank-grade security with 60+ security features protecting your data.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Users className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Join Thousands of Learners</h2>
            <p className="text-xl text-gray-300 mb-8">
              From 10th grade students to working professionals, our platform adapts to your learning journey.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Start Your Journey Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 AI Intelligence Layer. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </footer>
      <DeveloperWatermark />
    </div>
  );
}
