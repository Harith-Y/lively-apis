import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { initializeThemeScript } from "@/lib/theme-initializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LivelyAPI - Transform APIs into AI Agents",
  description: "Revolutionary no-code AI agent builder. Transform any API into conversational AI agents with natural language workflows.",
  keywords: "AI agents, API automation, no-code, conversational AI, enterprise automation",
};

// NOTE: Hydration warning for <html> is expected due to SSR and client theme switching.
// See: https://github.com/vercel/next.js/discussions/35773
// The page is hidden until the theme is set, so users never see a mismatch.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: initializeThemeScript(),
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}