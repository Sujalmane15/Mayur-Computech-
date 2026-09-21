import { createClient, type Session, type User } from '@supabase/supabase-js';

export type SupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

declare global {
  interface Window {
    MAYUR_GALLERY_CONFIG?: {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
    };
  }
}

export function getSupabaseConfig(): SupabaseConfig {
  const galleryConfig = typeof window !== 'undefined' ? window.MAYUR_GALLERY_CONFIG ?? {} : {};
  const envUrl = typeof import.meta.env.VITE_SUPABASE_URL === 'string' ? import.meta.env.VITE_SUPABASE_URL : '';
  const envKey = typeof import.meta.env.VITE_SUPABASE_ANON_KEY === 'string' ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';

  return {
    supabaseUrl: galleryConfig.supabaseUrl || envUrl,
    supabaseAnonKey: galleryConfig.supabaseAnonKey || envKey,
  };
}

export function createSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export function getCurrentSession(client: ReturnType<typeof createSupabaseClient>) {
  return client?.auth.getSession();
}

export function listenForAuthChanges(
  client: ReturnType<typeof createSupabaseClient>,
  callback: (event: string, session: Session | null) => void,
) {
  if (!client) {
    return { data: { subscription: { unsubscribe: () => undefined } } };
  }

  return client.auth.onAuthStateChange(callback);
}

export async function signInWithPassword(
  client: ReturnType<typeof createSupabaseClient>,
  email: string,
  password: string,
) {
  if (!client) {
    throw new Error('Supabase configuration is missing. Set the project URL and anon key in the browser config.');
  }

  return client.auth.signInWithPassword({ email, password });
}

export async function signOutUser(client: ReturnType<typeof createSupabaseClient>) {
  if (!client) {
    return;
  }

  await client.auth.signOut();
}

export async function getCurrentUser(client: ReturnType<typeof createSupabaseClient>) {
  if (!client) {
    return null;
  }

  const { data } = await client.auth.getUser();
  return data.user as User | null;
}
