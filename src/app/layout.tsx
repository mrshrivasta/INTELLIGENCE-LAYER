import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shrivasta AI - Intelligence Layer for Education",
  description: "AI-powered learning guidance, assessments, and personalized roadmaps for education and career development. Created by Karanam Shrivasta.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#0a0a0f] dark:bg-[#0a0a0f] light:bg-gray-50 transition-colors duration-300`}
      >
        <ThemeProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
