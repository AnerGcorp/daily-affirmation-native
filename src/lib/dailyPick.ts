/**
 * Daily Affirmation Pick Engine
 *
 * Selects a fresh set of affirmations each day using a deterministic
 * hash so the same user sees the same picks throughout a given day,
 * but gets a completely new set the next day.
 *
 * Priority: Supabase → AsyncStorage cache → hardcoded fallback.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAffirmations, type AffirmationRow } from './sync';
import { allAffirmations, categoryImages } from '../data/affirmations';
import type { Affirmation } from '../data/affirmations';

// ─── Constants ──────────────────────────────────────────────────────────────

const CACHE_KEY = '@affirm_affirmations_cache';
const DAILY_PICKS_KEY = '@affirm_daily_picks';
const DAILY_PICKS_PER_DAY = 5;

// ─── Hash helper (deterministic seed from string) ───────────────────────────

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Convert Supabase row → app Affirmation ────────────────────────────────

function rowToAffirmation(row: AffirmationRow): Affirmation {
  return {
    id: row.id,
    text: row.text,
    category: row.category,
    image: row.image_url || categoryImages[row.category] || '',
  };
}

// ─── Load the full affirmation pool ─────────────────────────────────────────

export async function loadAffirmationPool(): Promise<Affirmation[]> {
  // 1) Try Supabase
  const remoteRows = await fetchAffirmations();
  if (remoteRows.length > 0) {
    const pool = remoteRows.map(rowToAffirmation);
    // Cache for offline use
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(pool));
    } catch { }
    return pool;
  }

  // 2) Try AsyncStorage cache
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const pool = JSON.parse(cached) as Affirmation[];
      if (pool.length > 0) return pool;
    }
  } catch { }

  // 3) Hardcoded fallback
  return allAffirmations;
}

// ─── Pick today's affirmations ──────────────────────────────────────────────

export function pickDailyAffirmations(
  pool: Affirmation[],
  enabledCategories: string[],
  userId: string,
  count: number = DAILY_PICKS_PER_DAY
): Affirmation[] {
  const today = todayStr();

  // Filter by enabled categories
  const eligible = pool.filter((a) =>
    enabledCategories.includes(a.category)
  );

  if (eligible.length === 0) return [];
  if (eligible.length <= count) return eligible;

  // Deterministic shuffle based on userId + date
  // This ensures:
  //   - Same user sees the same set all day
  //   - Different set each day
  //   - Different users see different sets on the same day
  const scored = eligible.map((a) => ({
    affirmation: a,
    score: hashCode(`${userId}:${today}:${a.id}`),
  }));

  scored.sort((a, b) => a.score - b.score);

  return scored.slice(0, count).map((s) => s.affirmation);
}

// ─── High-level: get today's picks (cached for the day) ────────────────────

interface DailyPicksCache {
  date: string;
  userId: string;
  picks: Affirmation[];
}

export async function getDailyPicks(
  enabledCategories: string[],
  userId: string
): Promise<Affirmation[]> {
  const today = todayStr();

  // Check if we already computed today's picks
  try {
    const raw = await AsyncStorage.getItem(DAILY_PICKS_KEY);
    if (raw) {
      const cached: DailyPicksCache = JSON.parse(raw);
      if (cached.date === today && cached.userId === userId && cached.picks.length > 0) {
        // Re-filter in case categories changed mid-day
        const filtered = cached.picks.filter((a) =>
          enabledCategories.includes(a.category)
        );
        if (filtered.length > 0) return filtered;
      }
    }
  } catch { }

  // Load pool and compute picks
  const pool = await loadAffirmationPool();
  const picks = pickDailyAffirmations(pool, enabledCategories, userId);

  // Cache for the rest of the day
  try {
    const cache: DailyPicksCache = { date: today, userId, picks };
    await AsyncStorage.setItem(DAILY_PICKS_KEY, JSON.stringify(cache));
  } catch { }

  return picks;
}

// ─── Notification message pool ──────────────────────────────────────────────

const NOTIFICATION_MESSAGES = [
  'Your daily affirmation is waiting for you',
  'Start your day with a powerful thought',
  'A moment of positivity awaits you',
  'Take a deep breath — your affirmation is ready',
  'Time for your daily dose of inspiration',
  'Your mind deserves this moment of peace',
  'Ready for today\'s affirmation? Open up! ',
  'A little reminder: you are amazing. See today\'s affirmation',
];

export function getRandomNotificationMessage(): string {
  const dayIndex = new Date().getDate();
  return NOTIFICATION_MESSAGES[dayIndex % NOTIFICATION_MESSAGES.length];
}
