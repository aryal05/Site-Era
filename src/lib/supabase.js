import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const getEnvVars = () => {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
};

// Helper function to create a Supabase client (for server-side API routes)
export function createClient() {
  const { url, serviceKey } = getEnvVars();

  if (!url || !serviceKey) {
    console.error('Supabase environment variables missing:', {
      url: !!url,
      serviceKey: !!serviceKey
    });
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Create admin client
let adminClient = null;

export const getSupabaseAdmin = () => {
  if (adminClient) return adminClient;
  
  const { url, serviceKey } = getEnvVars();

  if (!url || !serviceKey) {
    console.error('Supabase admin environment variables missing:', {
      url: !!url,
      serviceKey: !!serviceKey
    });
    return null;
  }

  adminClient = createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return adminClient;
};

// For backwards compatibility
export const supabaseAdmin = getSupabaseAdmin();

// Supabase client for client-side (browser)
export const supabase = typeof window !== 'undefined' ? (() => {
  const { url, anonKey } = getEnvVars();

  if (!url || !anonKey) {
    console.error('Missing Supabase environment variables for client');
    return null;
  }

  return createSupabaseClient(url, anonKey);
})() : null;

export default supabase;
