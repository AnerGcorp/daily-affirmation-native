import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Auth ──
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// ── Main screens ──
import OnboardingScreen from '../screens/OnboardingScreen';
import DailyCheckInScreen from '../screens/DailyCheckInScreen';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import AboutScreen from '../screens/AboutScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import TermsScreen from '../screens/TermsScreen';

// ── Data / Theme ──
import { defaultCategories } from '../data/affirmations';
import { LightColors } from '../theme/colors';
import { ThemeProvider } from '../theme/ThemeContext';
import type { CategoryDef } from '../data/affirmations';

// ── Sync helpers ──
import {
  fetchProfile,
  upsertProfile,
  fetchPreferences,
  upsertPreferences,
  fetchFavorites,
  syncFavorites,
  fetchTodayCheckIn,
  fetchStreak,
} from '../lib/sync';

// ── Notifications ──
import {
  registerPushToken,
  syncReminderSchedule,
} from '../lib/notifications';

// ─── Constants ──────────────────────────────────────────────────────────────

const ONBOARDING_KEY = '@affirm_onboarding_complete';
const STATE_KEY = '@affirm_app_state';

// ─── Param list ─────────────────────────────────────────────────────────────

export type RootStackParamList = {
  // Auth
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  // Onboarding
  Onboarding: undefined;
  // Daily check-in
  DailyCheckIn: undefined;
  // Main
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
  Profile: undefined;
  Subscription: undefined;
  About: undefined;
  Privacy: undefined;
  Terms: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Map onboarding reminder labels → 24h time strings
const reminderTimeMap: Record<string, string> = {
  Morning: '07:00',
  Afternoon: '12:00',
  Evening: '20:00',
};

function todayDateStr() {
  return new Date().toISOString().split('T')[0];
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATOR
// ═══════════════════════════════════════════════════════════════════════════════

export default function AppNavigator() {
  const { session, user, loading: authLoading } = useAuth();

  // ── Loading state ──
  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // ── Daily check-in state ──
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayMood, setTodayMood] = useState('');

  // ── Shared state ──
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<CategoryDef[]>(defaultCategories);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userName, setUserName] = useState('');

  // Track whether we already synced from remote on this session
  const hasSyncedRef = useRef(false);

  // ── Load local state from AsyncStorage ──
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(ONBOARDING_KEY),
      AsyncStorage.getItem(STATE_KEY),
    ])
      .then(([onboarded, stateJson]) => {
        if (onboarded === 'true') setHasOnboarded(true);
        if (stateJson) {
          try {
            const saved = JSON.parse(stateJson);
            if (saved.favorites) setFavorites(new Set(saved.favorites));
            if (saved.categories) {
              setCategories((prev) =>
                prev.map((c) => {
                  const found = saved.categories.find(
                    (sc: any) => sc.name === c.name
                  );
                  return found ? { ...c, enabled: found.enabled } : c;
                })
              );
            }
            if (saved.reminderEnabled !== undefined)
              setReminderEnabled(saved.reminderEnabled);
            if (saved.reminderTime) setReminderTime(saved.reminderTime);
            if (saved.darkMode !== undefined) setDarkMode(saved.darkMode);
            if (saved.soundEnabled !== undefined)
              setSoundEnabled(saved.soundEnabled);
            if (saved.userName) setUserName(saved.userName);

            // Streak & check-in (local cache)
            if (saved.currentStreak !== undefined)
              setCurrentStreak(saved.currentStreak);
            if (saved.lastCheckInDate === todayDateStr()) {
              setHasCheckedInToday(true);
              if (saved.todayMood) setTodayMood(saved.todayMood);
            }
          } catch {}
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  // ── Persist locally on changes ──
  const persistState = useCallback(() => {
    const state = {
      favorites: Array.from(favorites),
      categories: categories.map((c) => ({ name: c.name, enabled: c.enabled })),
      reminderEnabled,
      reminderTime,
      darkMode,
      soundEnabled,
      userName,
      currentStreak,
      lastCheckInDate: hasCheckedInToday ? todayDateStr() : undefined,
      todayMood: todayMood || undefined,
    };
    AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [
    favorites,
    categories,
    reminderEnabled,
    reminderTime,
    darkMode,
    soundEnabled,
    userName,
    currentStreak,
    hasCheckedInToday,
    todayMood,
  ]);

  useEffect(() => {
    if (isReady) persistState();
  }, [isReady, persistState]);

  // ── Fetch remote data on login ──
  useEffect(() => {
    if (user && isReady && !hasSyncedRef.current) {
      hasSyncedRef.current = true;

      // Pull remote preferences
      fetchPreferences(user.id).then((prefs) => {
        if (prefs) {
          if (prefs.dark_mode !== undefined) setDarkMode(prefs.dark_mode);
          if (prefs.sound_enabled !== undefined) setSoundEnabled(prefs.sound_enabled);
          if (prefs.reminder_enabled !== undefined) setReminderEnabled(prefs.reminder_enabled);
          if (prefs.reminder_time) setReminderTime(prefs.reminder_time);
          if (prefs.categories && Array.isArray(prefs.categories) && prefs.categories.length > 0) {
            setCategories((prev) =>
              prev.map((c) => {
                const found = (prefs.categories as any[]).find(
                  (sc) => sc.name === c.name
                );
                return found ? { ...c, enabled: found.enabled } : c;
              })
            );
          }
        }
      });

      // Pull remote favorites
      fetchFavorites(user.id).then((ids) => {
        if (ids.length > 0) setFavorites(new Set(ids));
      });

      // Pull remote profile name + streak
      fetchProfile(user.id).then((p) => {
        if (p?.display_name) setUserName(p.display_name);
        if (p?.current_streak !== undefined) setCurrentStreak(p.current_streak);
      });

      // Check if already checked in today (remote)
      fetchTodayCheckIn(user.id).then((row) => {
        if (row) {
          setHasCheckedInToday(true);
          setTodayMood(row.mood);
        }
      });
    }
    // Reset sync flag on logout
    if (!user) hasSyncedRef.current = false;
  }, [user?.id, isReady]);

  // ── Push local changes to Supabase (debounced) ──
  useEffect(() => {
    if (!user || !isReady) return;
    const timer = setTimeout(() => {
      upsertPreferences(user.id, {
        categories: categories.map((c) => ({ name: c.name, enabled: c.enabled })),
        reminder_enabled: reminderEnabled,
        reminder_time: reminderTime,
        dark_mode: darkMode,
        sound_enabled: soundEnabled,
      });
      syncFavorites(user.id, Array.from(favorites));
      if (userName) upsertProfile(user.id, userName);
    }, 2000);
    return () => clearTimeout(timer);
  }, [
    user?.id,
    isReady,
    favorites,
    categories,
    reminderEnabled,
    reminderTime,
    darkMode,
    soundEnabled,
    userName,
  ]);

  // ── Register push token when user logs in ──
  useEffect(() => {
    if (user) {
      registerPushToken(user.id).catch(() => {});
    }
  }, [user?.id]);

  // ── Sync daily reminder schedule whenever settings change ──
  useEffect(() => {
    if (isReady) {
      syncReminderSchedule(reminderEnabled, reminderTime).catch(() => {});
    }
  }, [isReady, reminderEnabled, reminderTime]);

  // ── Derived values ──
  const enabledCategories = useMemo(
    () => categories.filter((c) => c.enabled).map((c) => c.name),
    [categories]
  );

  // ── Callbacks ──
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleCategory = useCallback((name: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.name === name ? { ...c, enabled: !c.enabled } : c))
    );
  }, []);

  const toggleReminder = useCallback(() => {
    setReminderEnabled((v) => !v);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((v) => !v);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((v) => !v);
  }, []);

  const handleSetUserName = useCallback((name: string) => {
    setUserName(name);
  }, []);

  // Called when user finishes onboarding
  const handleOnboardingComplete = useCallback(
    (result: { selectedCategories: Set<string>; reminderTime: string | null }) => {
      if (result.selectedCategories.size > 0) {
        setCategories((prev) =>
          prev.map((c) => ({
            ...c,
            enabled: result.selectedCategories.has(c.name),
          }))
        );
      }
      if (result.reminderTime && result.reminderTime !== 'none') {
        setReminderEnabled(true);
        const time = reminderTimeMap[result.reminderTime];
        if (time) {
          setReminderTime(time);
          // Schedule reminder immediately
          syncReminderSchedule(true, time).catch(() => {});
        }
      } else {
        setReminderEnabled(false);
        syncReminderSchedule(false, '08:00').catch(() => {});
      }
      AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setHasOnboarded(true);
    },
    []
  );

  // Called when user completes daily check-in
  const handleCheckInComplete = useCallback(
    (mood: string, _note: string) => {
      setHasCheckedInToday(true);
      if (mood) setTodayMood(mood);
      // Refresh streak from server after the DB trigger runs
      if (user) {
        setTimeout(() => {
          fetchStreak(user.id).then((s) => {
            if (s) setCurrentStreak(s.current);
          });
        }, 500);
      }
    },
    [user?.id]
  );

  // ── Loading screen ──
  if (!isReady || authLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: LightColors.background,
        }}
      >
        <ActivityIndicator size="large" color={LightColors.primary} />
      </View>
    );
  }

  // ── Determine which screen group to show ──
  const showOnboarding = !hasOnboarded;
  const showAuth = hasOnboarded && !session;
  const showCheckIn = hasOnboarded && !!session && !hasCheckedInToday;
  const showMain = hasOnboarded && !!session && hasCheckedInToday;

  return (
    <ThemeProvider isDark={darkMode}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {/* ─── Onboarding (first time only) ─── */}
          {showOnboarding && (
            <Stack.Group>
              <Stack.Screen name="Onboarding">
                {(props) => (
                  <OnboardingScreen
                    {...props}
                    onComplete={handleOnboardingComplete}
                  />
                )}
              </Stack.Screen>
            </Stack.Group>
          )}

          {/* ─── Auth screens (no session) ─── */}
          {showAuth && (
            <Stack.Group>
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {(props) => <SignUpScreen {...props} />}
              </Stack.Screen>
              <Stack.Screen name="ForgotPassword">
                {(props) => <ForgotPasswordScreen {...props} />}
              </Stack.Screen>
            </Stack.Group>
          )}

          {/* ─── Daily check-in (once per day) ─── */}
          {showCheckIn && (
            <Stack.Group>
              <Stack.Screen name="DailyCheckIn">
                {() => (
                  <DailyCheckInScreen onComplete={handleCheckInComplete} />
                )}
              </Stack.Screen>
            </Stack.Group>
          )}

          {/* ─── Main app (authenticated + checked in) ─── */}
          {showMain && (
            <Stack.Group>
              <Stack.Screen name="Home">
                {(props) => (
                  <HomeScreen
                    {...props}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    enabledCategories={enabledCategories}
                    currentStreak={currentStreak}
                    todayMood={todayMood}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Favorites">
                {(props) => (
                  <FavoritesScreen
                    {...props}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Settings">
                {(props) => (
                  <SettingsScreen
                    {...props}
                    categories={categories}
                    onToggleCategory={toggleCategory}
                    reminderEnabled={reminderEnabled}
                    onToggleReminder={toggleReminder}
                    reminderTime={reminderTime}
                    onSetReminderTime={setReminderTime}
                    darkMode={darkMode}
                    onToggleDarkMode={toggleDarkMode}
                    soundEnabled={soundEnabled}
                    onToggleSound={toggleSound}
                    userName={userName}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Profile">
                {(props) => (
                  <ProfileScreen
                    {...props}
                    userName={userName}
                    onSetUserName={handleSetUserName}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Subscription">
                {(props) => <SubscriptionScreen {...props} />}
              </Stack.Screen>
              <Stack.Screen name="About">
                {(props) => <AboutScreen {...props} />}
              </Stack.Screen>
              <Stack.Screen name="Privacy">
                {(props) => <PrivacyScreen {...props} />}
              </Stack.Screen>
              <Stack.Screen name="Terms">
                {(props) => <TermsScreen {...props} />}
              </Stack.Screen>
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
