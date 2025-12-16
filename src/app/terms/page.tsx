import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Terms & Conditions</h1>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-900">Terms & Conditions</h1>
          <p className="mb-6 text-slate-600">Last updated: December 16, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
              <p className="text-slate-600">
                By accessing and using the AI Intelligence Layer platform, you accept and agree to be 
                bound by the terms and provisions of this agreement. If you do not agree to these terms, 
                please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">2. Use License</h2>
              <p className="mb-3 text-slate-600">
                We grant you a personal, non-transferable, non-exclusive license to use our platform 
                for educational purposes. This license shall automatically terminate if you violate any 
                of these restrictions.
              </p>
              <p className="text-slate-600">You may not:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
                <li>Share your account credentials with others</li>
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to any part of the platform</li>
                <li>Interfere with or disrupt the platform's functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">3. User Accounts</h2>
              <p className="text-slate-600">
                You are responsible for maintaining the confidentiality of your account credentials and 
                for all activities that occur under your account. You agree to notify us immediately of 
                any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">4. Assessment Integrity</h2>
              <p className="mb-3 text-slate-600">
                When taking assessments on our platform:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-slate-600">
                <li>You must complete assessments independently without external assistance</li>
                <li>Using unauthorized resources or AI tools during assessments is prohibited</li>
                <li>Your assessment results must reflect your own knowledge and abilities</li>
                <li>Violating assessment integrity may result in account suspension</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">5. Intellectual Property</h2>
              <p className="text-slate-600">
                All content on this platform, including but not limited to text, graphics, logos, 
                assessments, and software, is the property of AI Intelligence Layer and protected by 
                intellectual property laws. You may not reproduce, distribute, or create derivative works 
                without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">6. User Content</h2>
              <p className="text-slate-600">
                You retain ownership of any content you submit to the platform. However, by submitting 
                content, you grant us a license to use, display, and analyze that content for the purpose 
                of providing and improving our services.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">7. AI-Generated Recommendations</h2>
              <p className="text-slate-600">
                Our platform provides AI-generated learning recommendations and guidance. While we strive 
                for accuracy, these recommendations are for educational purposes only and should not be 
                considered as professional career advice or guarantees of specific outcomes.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">8. Disclaimer of Warranties</h2>
              <p className="text-slate-600">
                The platform is provided "as is" without warranties of any kind, either express or implied. 
                We do not guarantee that the platform will be error-free, secure, or uninterrupted.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">9. Limitation of Liability</h2>
              <p className="text-slate-600">
                In no event shall AI Intelligence Layer be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising out of your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">10. Termination</h2>
              <p className="text-slate-600">
                We reserve the right to terminate or suspend your account at any time for violations of 
                these terms or for any other reason at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">11. Changes to Terms</h2>
              <p className="text-slate-600">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes. Your continued use of the platform after such modifications constitutes 
                acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">12. Contact Information</h2>
              <p className="text-slate-600">
                If you have any questions about these Terms & Conditions, please contact us through our 
                contact page.
              </p>
            </section>
          </div>
        </Card>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
