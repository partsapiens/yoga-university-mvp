"use client";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Yoga Flow University
          <span className="ml-2 text-xs text-white bg-gradient-to-r from-rose-500 to-amber-300 px-2 py-0.5 rounded">
            AI Powered
          </span>
        </div>
        <ul className="hidden md:flex gap-6 text-gray-600">
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/poses">Poses</Link></li>
          <li><Link href="/themes">Themes</Link></li>
          <li><Link href="/chakras">Chakras</Link></li>
          <li><Link href="/quiz/c1">Jeopardy</Link></li>
        </ul>
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
          <Bell className="w-4 h-4 text-indigo-500" />
          Sarah
        </button>
      </nav>
    </header>
  );
}
