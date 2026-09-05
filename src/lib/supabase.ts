import { createClient } from '@supabase/supabase-js';

// Project Supabase Credentials
const PROJECT_SUPABASE_URL = 'https://ttjcfgsxwyadwoqkypbr.supabase.co';
const PROJECT_SUPABASE_KEY = 'sb_publishable_rq7W8oY21-4pJkqnqTLkZQ_tP3LQX9T';

// Resolve configuration from environment with live project fallbacks
const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL || 
  PROJECT_SUPABASE_URL
).trim().replace(/\/+$/, '');

const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  PROJECT_SUPABASE_KEY
).trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

// Initialize Supabase Client
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'neural_brief_sb_auth',
    },
  }
);
