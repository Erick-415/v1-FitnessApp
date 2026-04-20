import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../supabase/client';
import type { Tables } from '../types/database.types';

type Profile = Tables<'profiles'>;

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    role: 'client' | 'trainer',
    fullName: string,
  ) => Promise<{ error: string | null }>;
  signInWithApple: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  /**
   * Expected role for this app — users with a different role will be shown an access denied state.
   * Pass undefined to allow any role (e.g., a universal sign-in screen).
   */
  expectedRole?: 'client' | 'trainer';
  onRoleConflict?: (actualRole: 'client' | 'trainer') => void;
}

export function AuthProvider({ children, expectedRole, onRoleConflict }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch profile:', error.message);
      return null;
    }
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    setProfile(p);
  }, [user, fetchProfile]);

  useEffect(() => {
    // Restore session on mount
    void supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);

        if (expectedRole && p && p.role !== expectedRole) {
          onRoleConflict?.(p.role);
        }
      }

      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);

        if (expectedRole && p && p.role !== expectedRole) {
          onRoleConflict?.(p.role);
        }
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [expectedRole, fetchProfile, onRoleConflict]);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [],
  );

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      role: 'client' | 'trainer',
      fullName: string,
    ): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, full_name: fullName },
        },
      });
      return { error: error?.message ?? null };
    },
    [],
  );

  const signInWithApple = useCallback(async (): Promise<{ error: string | null }> => {
    try {
      // Lazy import — only available on iOS
      const { signInAsync, AppleAuthenticationScope } = await import('expo-apple-authentication');

      const credential = await signInAsync({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL,
        ],
      });

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken ?? '',
      });

      return { error: error?.message ?? null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Apple sign-in failed';
      return { error: message };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value: AuthContextValue = {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!session,
    signInWithEmail,
    signUpWithEmail,
    signInWithApple,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
