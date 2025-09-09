"use client"; // Required to use hooks like useVoiceUI

import React from 'react';
import Link from 'next/link';
import { UserRole } from '@/types';
import { useVoiceUI } from '@/context/VoiceUIContext';

interface NavigationProps {
  userRole?: UserRole;
}

export const Navigation = ({ userRole }: NavigationProps) => {
  const { setIsVoicePopupOpen } = useVoiceUI();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/poses', label: 'Pose Library' },
    { href: '/flows/create', label: 'Create Flow' },
    { href: '/manual', label: 'Manual' },
    { href: '/journal/new', label: 'New Journal Entry' },
    { href: '/reading/add', label: 'Add Reading' },
  ];

  return (
    <nav className="bg-background shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Yoga Flow
          </Link>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-foreground hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsVoicePopupOpen(true)}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent"
              title="Open Voice Assistant"
            >
              <span className="text-2xl">🤖</span>
            </button>
            <button className="btn btn-primary">Log In</button>
          </div>
          <div className="md:hidden">
            <button className="btn btn-outline">Menu</button>
          </div>
        </div>
      </div>
    </nav>
  );
};
