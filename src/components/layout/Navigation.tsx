"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  useEffect(() => {
    // Close the mobile menu when navigating to a new route
    setMobileOpen(false);
  }, [pathname]);

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
              type="button"
              className="p-2 rounded-md text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div id="mobile-nav" className="md:hidden pb-4 space-y-2">
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
            <button
              className="btn btn-primary w-full"
              onClick={() => setMobileOpen(false)}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
