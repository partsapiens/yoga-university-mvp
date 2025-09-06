import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yoga University",
  description: "Learn poses, build flows, and journal your practice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-bold">Yoga University</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/poses">Poses</Link>
              <Link href="/flows">Flows</Link>
              <Link href="/journal">Journal</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500">
            © {new Date().getFullYear()} Yoga University
          </div>
        </footer>
      </body>
    </html>
  );
}
