import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnvMessage =
  'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env (local) or hosting environment settings.';

const createMissingConfigClient = (): SupabaseClient =>
  new Proxy({} as SupabaseClient, {
    get() {
      throw new Error(missingEnvMessage);
    },
  });

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(missingEnvMessage);
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMissingConfigClient();
