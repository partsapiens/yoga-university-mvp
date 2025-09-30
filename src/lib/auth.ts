import { supabase } from '@/utils/supabaseClient';
import type { AuthError, User, Subscription } from '@supabase/supabase-js';

// Define a type for our authentication response to keep it consistent
type AuthResponse = {
  user: User | null;
  error: AuthError | null;
};

/**
 * Signs up a new user with email and password.
 * @param email The user's email address.
 * @param password The user's chosen password.
 * @param metadata Additional user data to store.
 * @returns An object containing the new user or an error.
 */
export const signUp = async (
  email: string,
  password: string,
  metadata: { name: string; role: string }
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { user: data.user, error };
};

/**
 * Signs in an existing user with email and password.
 * @param email The user's email address.
 * @param password The user's password.
 * @returns An object containing the user or an error.
 */
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data.user, error };
};

/**
 * Signs out the currently authenticated user.
 * @returns An object containing an error if the sign-out fails.
 */
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Retrieves the currently authenticated user from the session.
 * @returns An object containing the current user or an error.
 */
export const getUser = async (): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

/**
 * Sets up a real-time listener for authentication state changes.
 * @param callback A function that handles the user object on auth state change.
 * @returns The subscription object, which can be used to unsubscribe.
 */
export const onAuthStateChange = (callback: (user: User | null) => void): Subscription => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user ?? null);
    });
    return subscription;
};