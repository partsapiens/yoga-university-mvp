"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/types';

interface NavigationProps {
  userRole?: UserRole;
}

export const Navigation = ({ userRole }: NavigationProps) => {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/poses', label: 'Pose Library' },
    { href: '/flows/create', label: 'Create Flow' },
    { href: '/manual', label: 'Manual' },
    { href: '/journal/new', label: 'New Journal Entry' },
    { href: '/reading/add', label: 'Add Reading' },
  ];

  // TODO: Implement role-based navigation items
  // TODO: Implement user dropdown with profile management
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-background shadow-sm">
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
          {/* Placeholder for user dropdown/auth buttons */}
          <div className="hidden md:block">
            <button className="btn btn-primary">Log In</button>
          </div>
          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              className="btn btn-outline"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              Menu
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-foreground hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>
              Log In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
