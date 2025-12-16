import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Privacy Policy</h1>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="mb-6 text-slate-600">Last updated: December 16, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">1. Information We Collect</h2>
              <p className="mb-3 text-slate-600">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-slate-600">
                <li>Account information (name, email, password)</li>
                <li>Educational background and preferences</li>
                <li>Assessment results and learning progress</li>
                <li>Usage data and interaction patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">2. How We Use Your Information</h2>
              <p className="mb-3 text-slate-600">
                We use the information we collect to:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-slate-600">
                <li>Provide personalized learning recommendations</li>
                <li>Track your progress and performance</li>
                <li>Improve our AI algorithms and platform features</li>
                <li>Send notifications and updates about your learning journey</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">3. Data Security</h2>
              <p className="text-slate-600">
                We implement industry-standard security measures to protect your personal information. 
                Your data is encrypted in transit and at rest. We use Supabase for secure data storage 
                and authentication.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">4. Data Sharing</h2>
              <p className="text-slate-600">
                We do not sell your personal information. We may share data with service providers who 
                assist in operating our platform, but only to the extent necessary and under strict 
                confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">5. Your Rights</h2>
              <p className="mb-3 text-slate-600">You have the right to:</p>
              <ul className="list-disc space-y-2 pl-6 text-slate-600">
                <li>Access your personal data</li>
                <li>Request corrections to your data</li>
                <li>Delete your account and associated data</li>
                <li>Export your learning data</li>
                <li>Opt-out of certain data collection practices</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">6. Cookies</h2>
              <p className="text-slate-600">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and maintain your session. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">7. Children's Privacy</h2>
              <p className="text-slate-600">
                Our platform is designed for students of all ages. For users under 18, we recommend 
                parental guidance and consent before creating an account.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">8. Changes to This Policy</h2>
              <p className="text-slate-600">
                We may update this privacy policy from time to time. We will notify you of any significant 
                changes via email or through the platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">9. Contact Us</h2>
              <p className="text-slate-600">
                If you have questions about this privacy policy or your data, please contact us through 
                our contact page or email us directly.
              </p>
            </section>
          </div>
        </Card>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
