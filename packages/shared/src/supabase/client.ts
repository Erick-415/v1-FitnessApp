import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import type { Database } from '../types/database.types';

// SecureStore adapter for Supabase session persistence
const ExpoSecureStoreAdapter = {
  getItem: (key: string): string | null | Promise<string | null> => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): void | Promise<void> => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): void | Promise<void> => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
