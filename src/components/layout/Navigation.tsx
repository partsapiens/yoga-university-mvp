"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface NavigationProps {
  userRole?: UserRole;
}

export const Navigation = ({ userRole }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/poses', label: 'Pose Library' },
    { href: '/manual', label: 'Manual' },
  ];

  const secondaryNavItems = [
      { href: '/journal/new', label: 'New Journal Entry' },
      { href: '/reading/add', label: 'Add Reading' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="bg-background shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary">Yoga Flow</Link>
              <div className="flex space-x-4">
                {mainNavItems.map((item) => (<Link key={item.href} href={item.href} className="text-foreground hover:text-primary">{item.label}</Link>))}
                <Link href="/flows/create" className="font-semibold text-primary hover:underline">Create Flow</Link>
              </div>
            </div>

            <div className="flex md:hidden items-center justify-between w-full">
              <button onClick={toggleMobileMenu} className="p-2 -ml-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <Link href="/flows/create" className="font-semibold text-primary">Create Flow</Link>
              {/* Placeholder for a right-side icon if needed in the future */}
              <div className="w-6" />
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button className="btn btn-primary">Log In</button>
            </div>
          </div>
        </div>
      </nav>

      <div className={cn("fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden", isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={toggleMobileMenu} />
      <div className={cn("fixed top-0 left-0 h-full w-64 bg-background shadow-lg transform transition-transform z-40 md:hidden", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-4">
          <Link href="/" className="text-2xl font-bold text-primary mb-4 block" onClick={toggleMobileMenu}>Yoga Flow</Link>
          <div className="flex flex-col space-y-2">
            {mainNavItems.map((item) => (<Link key={item.href} href={item.href} className="text-foreground hover:text-primary p-2 rounded-md" onClick={toggleMobileMenu}>{item.label}</Link>))}
            <div className="border-t my-2" />
            {secondaryNavItems.map((item) => (<Link key={item.href} href={item.href} className="text-foreground hover:text-primary p-2 rounded-md" onClick={toggleMobileMenu}>{item.label}</Link>))}
          </div>
        </div>
      </div>
    </>
  );
};
