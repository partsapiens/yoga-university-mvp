"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { getUser, onAuthStateChange } from '@/lib/auth';
import { FullPageLoader } from '@/components/ui/Loader'; // A simple loading spinner component

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for an active session when the provider mounts
    const fetchUser = async () => {
      try {
        const { user: currentUser } = await getUser();
        setUser(currentUser);
      } catch (e) {
        console.error("Failed to fetch initial user", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up the real-time auth state change listener
    const { unsubscribe } = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      // If loading was still true, set it to false after the first auth event
      if (isLoading) {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const value = {
    user,
    isLoading,
  };

  // Display a full-page loader while checking for the user's session
  if (isLoading) {
    return <FullPageLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy access to the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};