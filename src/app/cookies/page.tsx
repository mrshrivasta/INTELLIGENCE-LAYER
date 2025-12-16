import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DeveloperWatermark } from "@/components/DeveloperWatermark";
import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Cookie Policy</h1>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="p-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-900">Cookie Policy</h1>
          <p className="mb-6 text-slate-600">Last updated: December 16, 2025</p>

          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">1. What Are Cookies?</h2>
              <p className="text-slate-600">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                enabling certain features of our platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">2. How We Use Cookies</h2>
              <p className="mb-3 text-slate-600">We use cookies for the following purposes:</p>
              <ul className="list-disc space-y-2 pl-6 text-slate-600">
                <li><strong>Authentication:</strong> To keep you logged in and maintain your session</li>
                <li><strong>Preferences:</strong> To remember your settings and customizations</li>
                <li><strong>Analytics:</strong> To understand how you use our platform and improve it</li>
                <li><strong>Performance:</strong> To ensure the platform loads quickly and functions smoothly</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">3. Types of Cookies We Use</h2>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">Essential Cookies</h3>
                  <p className="text-slate-600">
                    These cookies are necessary for the platform to function properly. They enable core 
                    functionality such as security, authentication, and session management. The platform 
                    cannot function properly without these cookies.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">Functional Cookies</h3>
                  <p className="text-slate-600">
                    These cookies enable enhanced functionality and personalization, such as remembering 
                    your field of interest, preferred difficulty levels, and UI preferences.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">Analytics Cookies</h3>
                  <p className="text-slate-600">
                    These cookies help us understand how visitors interact with our platform by collecting 
                    and reporting information anonymously. This helps us improve the user experience.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">Performance Cookies</h3>
                  <p className="text-slate-600">
                    These cookies help us measure and improve the performance of our platform, such as 
                    page load times and response times.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">4. Third-Party Cookies</h2>
              <p className="text-slate-600">
                We may use third-party services that set cookies on your device. These services include:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
                <li><strong>Supabase:</strong> For authentication and database services</li>
                <li><strong>Analytics providers:</strong> To help us understand platform usage</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">5. Managing Cookies</h2>
              <p className="mb-3 text-slate-600">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-slate-600">
                <li>Most browsers allow you to refuse or accept cookies</li>
                <li>You can delete cookies that have already been set</li>
                <li>You can set your browser to notify you when cookies are being sent</li>
              </ul>
              <p className="mt-3 text-slate-600">
                Please note that disabling certain cookies may affect your experience on our platform and 
                limit some functionality.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">6. Browser Settings</h2>
              <p className="mb-3 text-slate-600">
                Here's how to manage cookies in popular browsers:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-slate-600">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">7. Updates to This Policy</h2>
              <p className="text-slate-600">
                We may update this Cookie Policy from time to time to reflect changes in our practices or 
                for other operational, legal, or regulatory reasons. We encourage you to review this policy 
                periodically.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-slate-900">8. Contact Us</h2>
              <p className="text-slate-600">
                If you have any questions about our use of cookies, please contact us through our contact 
                page or email us directly.
              </p>
            </section>
          </div>
        </Card>
      </main>

      <DeveloperWatermark />
    </div>
  );
}
