"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Target, Users, Zap } from "lucide-react";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/home" className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <span className="font-bold text-xl">AI Intelligence Layer</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/home"><Button variant="ghost">Home</Button></Link>
              <Link href="/features"><Button variant="ghost">Features</Button></Link>
              <Link href="/contact"><Button variant="ghost">Contact</Button></Link>
              <Link href="/login"><Button>Login</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering students and professionals with AI-driven personalized education
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe every student deserves personalized guidance that adapts to their unique learning style, goals, and pace. Our AI Intelligence Layer transforms education by providing tailored roadmaps, adaptive assessments, and real-time guidance for learners from 10th grade to working professionals.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To create a world where quality education is accessible to everyone, powered by AI that understands individual needs and provides guidance that evolves with each learner's progress.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <Target className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Personalized</h3>
            <p className="text-gray-600">AI-driven learning paths tailored to your goals and background</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <Zap className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Adaptive</h3>
            <p className="text-gray-600">Assessments that adjust to your skill level in real-time</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <Users className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">For Everyone</h3>
            <p className="text-gray-600">Supporting learners from 10th grade to working professionals</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-lg mb-6">Join thousands of students already using AI to achieve their goals</p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </main>
      <DeveloperWatermark />
    </div>
  );
}
