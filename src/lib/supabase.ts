import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabasePublishableKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabasePublishableKey.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase Notice] VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not configured in this environment. Please configure them in your hosting provider dashboard.'
  );
}

// Initialize Supabase client safely with fallback strings if not yet set in production dashboard
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'neural_brief_sb_auth',
    },
  }
);
