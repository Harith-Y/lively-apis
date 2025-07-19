import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cookies } from 'next/headers';
import { ToastProvider } from '@/components/ui/toast-provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LivelyAPI - Transform APIs into AI Agents",
  description: "Revolutionary no-code AI agent builder. Transform any API into conversational AI agents with natural language workflows.",
  keywords: "AI agents, API automation, no-code, conversational AI, enterprise automation",
};

// NOTE: Hydration warning for <html> is expected due to SSR and client theme switching.
// See: https://github.com/vercel/next.js/discussions/35773
// The page is hidden until the theme is set, so users never see a mismatch.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read the theme from the cookie (default to 'light')
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';
  return (
    <html lang="en" className={theme} data-scroll-behavior="smooth">
      <head />
      <body className={inter.className} suppressHydrationWarning={true}>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}