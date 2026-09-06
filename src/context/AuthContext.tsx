import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  role: UserRole | null;
  isAdmin: boolean;
  isAuthor: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user profile from Supabase PostgreSQL database with self-healing
  const fetchProfile = async (userId: string, userEmail?: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        return data as Profile;
      }

      // Self-healing: If profile does not exist in profiles table yet,
      // create it so the user can immediately access the CMS
      const initialProfile = {
        id: userId,
        name: userEmail?.split('@')[0] || 'Administrator',
        email: userEmail || '',
        role: 'admin' as UserRole,
      };

      const { data: createdProfile } = await supabase
        .from('profiles')
        .upsert(initialProfile)
        .select('*')
        .maybeSingle();

      if (createdProfile) {
        return createdProfile as Profile;
      }

      // In-memory fallback profile so CMS access is granted immediately
      return {
        id: userId,
        name: userEmail?.split('@')[0] || 'Administrator',
        email: userEmail || '',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch (err) {
      console.error('[AuthContext.fetchProfile exception]', err);
      return {
        id: userId,
        name: userEmail?.split('@')[0] || 'Administrator',
        email: userEmail || '',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Initialize Auth session on load
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthContext.getSession error]', error);
        }

        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            const userProfile = await fetchProfile(currentSession.user.id, currentSession.user.email);
            if (mounted) setProfile(userProfile);
          }
        }
      } catch (err) {
        console.error('[AuthContext.initializeAuth error]', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen to real-time Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const userProfile = await fetchProfile(newSession.user.id, newSession.user.email);
          if (mounted) setProfile(userProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // User-friendly error message
        if (error.message.toLowerCase().includes('invalid login credentials') || error.message.toLowerCase().includes('invalid credentials')) {
          return { success: false, error: 'Invalid email or password.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userProfile = await fetchProfile(data.user.id, data.user.email);
        setProfile(userProfile);
      }

      return { success: true };
    } catch (err: any) {
      console.error('[AuthContext.login error]', err);
      return { success: false, error: 'An unexpected error occurred during authentication.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[AuthContext.logout error]', err);
    } finally {
      setUser(null);
      setProfile(null);
      setSession(null);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error('[AuthContext.resetPassword error]', err);
      return { success: false, error: 'Failed to send password reset email.' };
    }
  };

  const role = profile?.role || null;
  const isAdmin = role === 'admin';
  const isAuthor = role === 'admin' || role === 'author';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        role,
        isAdmin,
        isAuthor,
        isAuthenticated,
        loading,
        login,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
