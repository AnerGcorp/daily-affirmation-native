/**
 * Supabase client for React Native.
 *
 * SETUP:
 * 1. Create a project at https://supabase.com
 * 2. Copy your project URL and anon key from Settings → API
 * 3. Create a `.env` file in the project root with:
 *      EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
 *      EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
 * 4. Restart Metro (`npx expo start --clear`)
 */

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
