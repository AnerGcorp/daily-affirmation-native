/**
 * Push / Local Notification Helpers
 *
 * Uses expo-notifications for:
 *  1) Local daily reminders at the user's chosen time
 *  2) Push token registration (stored in Supabase for future server-side push)
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { upsertNotificationToken, removeNotificationToken } from './sync';
import { getRandomNotificationMessage } from './dailyPick';

const PUSH_TOKEN_KEY = '@affirm_push_token';
const REMINDER_IDENTIFIER = 'daily-affirmation-reminder';

// ─── Configure notification handler (show even when app is foregrounded) ────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Request permissions ────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission not granted');
    return false;
  }

  // Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-affirmation', {
      name: 'Daily Affirmation',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7C3AED',
      sound: 'default',
    });
  }

  return true;
}

// ─── Register for push token (store locally + in Supabase) ──────────────────

export async function registerPushToken(userId: string): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  try {
    // Resolve projectId from Expo constants (works in Expo Go + EAS builds)
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.warn(
        'No EAS projectId found — push tokens require an EAS-configured project. ' +
        'Run "npx eas init" or "npx eas build:configure" to set one up. ' +
        'Skipping push token registration.'
      );
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenData.data;

    // Store locally
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    // Store in Supabase
    await upsertNotificationToken(userId, token, Platform.OS);

    return token;
  } catch (error) {
    console.error('Failed to get push token:', error);
    return null;
  }
}

// ─── Unregister push token ──────────────────────────────────────────────────

export async function unregisterPushToken(userId: string): Promise<void> {
  try {
    const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    if (token) {
      await removeNotificationToken(userId, token);
      await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Failed to remove push token:', error);
  }
}

// ─── Schedule daily local reminder ──────────────────────────────────────────

/**
 * Schedules a repeating daily notification at the given time.
 *
 * @param hour   0-23
 * @param minute 0-59
 */
export async function scheduleDailyReminder(
  hour: number,
  minute: number
): Promise<void> {
  // Cancel existing reminder first
  await cancelDailyReminder();

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  const message = getRandomNotificationMessage();

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDENTIFIER,
    content: {
      title: 'Daily Affirmation ✨',
      body: message,
      sound: 'default',
      data: { screen: 'Home' },
      ...(Platform.OS === 'android' && {
        channelId: 'daily-affirmation',
      }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  console.log(`Daily reminder scheduled for ${hour}:${String(minute).padStart(2, '0')}`);
}

// ─── Cancel daily reminder ──────────────────────────────────────────────────

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(REMINDER_IDENTIFIER);
}

// ─── Parse "HH:MM" or "H:MM AM/PM" into { hour, minute } ──────────────────

export function parseReminderTime(timeStr: string): { hour: number; minute: number } {
  // Handle "8:00 AM", "2:30 PM" format
  const amPmMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (amPmMatch) {
    let hour = parseInt(amPmMatch[1], 10);
    const minute = parseInt(amPmMatch[2], 10);
    const isPM = amPmMatch[3].toUpperCase() === 'PM';
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return { hour, minute };
  }

  // Handle "08:00", "14:30" format
  const match24 = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    return {
      hour: parseInt(match24[1], 10),
      minute: parseInt(match24[2], 10),
    };
  }

  // Default: 8:00 AM
  return { hour: 8, minute: 0 };
}

// ─── Convenience: schedule from a time string + toggle ──────────────────────

export async function syncReminderSchedule(
  enabled: boolean,
  timeStr: string
): Promise<void> {
  if (!enabled) {
    await cancelDailyReminder();
    return;
  }

  const { hour, minute } = parseReminderTime(timeStr);
  await scheduleDailyReminder(hour, minute);
}
