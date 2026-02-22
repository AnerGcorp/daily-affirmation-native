/**
 * Helpers to sync local app state ↔ Supabase.
 *
 * Each function is safe to call when offline – errors are silently caught
 * so the app continues to work with local data only.
 */

import { supabase } from './supabase';

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProfileRow {
  id: string;
  display_name: string;
  avatar_url: string;
  is_premium: boolean;
  premium_expires_at: string | null;
  current_streak: number;
  longest_streak: number;
  last_checkin_date: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchProfile(
  userId: string
): Promise<ProfileRow | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function upsertProfile(
  userId: string,
  displayName: string
): Promise<void> {
  try {
    await supabase.from('profiles').upsert({
      id: userId,
      display_name: displayName,
      updated_at: new Date().toISOString(),
    });
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// PREFERENCES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PreferencesRow {
  user_id: string;
  categories: { name: string; enabled: boolean }[];
  reminder_enabled: boolean;
  reminder_time: string;
  dark_mode: boolean;
  sound_enabled: boolean;
  updated_at: string;
}

export async function fetchPreferences(
  userId: string
): Promise<PreferencesRow | null> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function upsertPreferences(
  userId: string,
  prefs: {
    categories?: { name: string; enabled: boolean }[];
    reminder_enabled?: boolean;
    reminder_time?: string;
    dark_mode?: boolean;
    sound_enabled?: boolean;
  }
): Promise<void> {
  try {
    await supabase.from('user_preferences').upsert({
      user_id: userId,
      ...prefs,
      updated_at: new Date().toISOString(),
    });
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAVORITES
// ═══════════════════════════════════════════════════════════════════════════════

export async function fetchFavorites(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('affirmation_id')
      .eq('user_id', userId);
    if (error) throw error;
    return data?.map((r) => r.affirmation_id) ?? [];
  } catch {
    return [];
  }
}

export async function syncFavorites(
  userId: string,
  favoriteIds: string[]
): Promise<void> {
  try {
    // Remove old rows, then insert current set
    await supabase.from('user_favorites').delete().eq('user_id', userId);
    if (favoriteIds.length > 0) {
      await supabase.from('user_favorites').insert(
        favoriteIds.map((id) => ({ user_id: userId, affirmation_id: id }))
      );
    }
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM STATUS
// ═══════════════════════════════════════════════════════════════════════════════

export async function setPremiumStatus(
  userId: string,
  isPremium: boolean,
  expiresAt?: string
): Promise<void> {
  try {
    await supabase
      .from('profiles')
      .update({
        is_premium: isPremium,
        premium_expires_at: expiresAt ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES (read from Supabase – public table)
// ═══════════════════════════════════════════════════════════════════════════════

export interface CategoryRow {
  name: string;
  icon: string;
  description: string;
  image_url: string;
  display_order: number;
  is_premium: boolean;
  created_at: string;
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AFFIRMATIONS (read from Supabase – public table)
// ═══════════════════════════════════════════════════════════════════════════════

export interface AffirmationRow {
  id: string;
  text: string;
  category: string;
  image_url: string;
  is_premium: boolean;
  created_at: string;
}

export async function fetchAffirmations(): Promise<AffirmationRow[]> {
  try {
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

/** Fetch affirmations filtered by one or more categories */
export async function fetchAffirmationsByCategories(
  categoryNames: string[]
): Promise<AffirmationRow[]> {
  try {
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .in('category', categoryNames)
      .order('id', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM AFFIRMATIONS (user-created, premium feature)
// ═══════════════════════════════════════════════════════════════════════════════

export interface CustomAffirmationRow {
  id: number;
  user_id: string;
  text: string;
  category: string | null;
  created_at: string;
}

export async function fetchCustomAffirmations(
  userId: string
): Promise<CustomAffirmationRow[]> {
  try {
    const { data, error } = await supabase
      .from('custom_affirmations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function addCustomAffirmation(
  userId: string,
  text: string,
  category?: string
): Promise<CustomAffirmationRow | null> {
  try {
    const { data, error } = await supabase
      .from('custom_affirmations')
      .insert({ user_id: userId, text, category: category ?? null })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function deleteCustomAffirmation(
  userId: string,
  affirmationId: number
): Promise<void> {
  try {
    await supabase
      .from('custom_affirmations')
      .delete()
      .eq('id', affirmationId)
      .eq('user_id', userId);
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SubscriptionRow {
  id: number;
  user_id: string;
  plan_type: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  provider: 'manual' | 'apple' | 'google' | 'stripe';
  started_at: string;
  expires_at: string | null;
  receipt_data: string | null;
  created_at: string;
}

export async function fetchActiveSubscription(
  userId: string
): Promise<SubscriptionRow | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function createSubscription(
  userId: string,
  planType: 'monthly' | 'yearly',
  provider: 'manual' | 'apple' | 'google' | 'stripe' = 'manual',
  expiresAt?: string
): Promise<SubscriptionRow | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        provider,
        expires_at: expiresAt ?? null,
      })
      .select()
      .single();
    if (error) throw error;

    // Also flip the premium flag on the profile
    await setPremiumStatus(userId, true, expiresAt);

    return data;
  } catch {
    return null;
  }
}

export async function cancelSubscription(
  subscriptionId: number,
  userId: string
): Promise<void> {
  try {
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId)
      .eq('user_id', userId);

    await setPremiumStatus(userId, false);
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY LOG
// ═══════════════════════════════════════════════════════════════════════════════

export async function logDailyAffirmation(
  userId: string,
  affirmationId: string
): Promise<void> {
  try {
    await supabase.from('daily_log').upsert(
      {
        user_id: userId,
        affirmation_id: affirmationId,
        shown_at: new Date().toISOString().split('T')[0],
      },
      { onConflict: 'user_id,affirmation_id,shown_at' }
    );
  } catch {}
}

export async function fetchDailyLogCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('daily_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (error) throw error;
    return count ?? 0;
  } catch {
    return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

export async function upsertNotificationToken(
  userId: string,
  token: string,
  platform: 'ios' | 'android' | 'web'
): Promise<void> {
  try {
    await supabase.from('notification_tokens').upsert(
      {
        user_id: userId,
        token,
        platform,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,token' }
    );
  } catch {}
}

export async function removeNotificationToken(
  userId: string,
  token: string
): Promise<void> {
  try {
    await supabase
      .from('notification_tokens')
      .delete()
      .eq('user_id', userId)
      .eq('token', token);
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY CHECK-INS & STREAKS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CheckInRow {
  id: number;
  user_id: string;
  mood: string;
  note: string;
  checked_in_date: string;
  created_at: string;
}

/** Check if the user already checked in today */
export async function fetchTodayCheckIn(
  userId: string
): Promise<CheckInRow | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('checked_in_date', today)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

/** Create a daily check-in. The DB trigger auto-updates the streak. */
export async function createCheckIn(
  userId: string,
  mood: string,
  note: string = ''
): Promise<CheckInRow | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_checkins')
      .upsert(
        {
          user_id: userId,
          mood,
          note,
          checked_in_date: today,
        },
        { onConflict: 'user_id,checked_in_date' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

/** Fetch streak info from the user's profile */
export async function fetchStreak(
  userId: string
): Promise<{ current: number; longest: number } | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_checkin_date')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return {
      current: data?.current_streak ?? 0,
      longest: data?.longest_streak ?? 0,
    };
  } catch {
    return null;
  }
}

/** Fetch recent check-in history (last N days) */
export async function fetchCheckInHistory(
  userId: string,
  limit: number = 30
): Promise<CheckInRow[]> {
  try {
    const { data, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .order('checked_in_date', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}
