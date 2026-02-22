import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Compass,
  ShieldCheck,
  Waves,
  TrendingUp,
  Sparkles,
  Check,
  Bell,
  BellOff,
  Clock,
  User,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Info,
  Bookmark,
  FileText,
  Crown,
  LogOut,
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import type { ColorScheme } from '../theme/colors';
import type { CategoryDef } from '../data/affirmations';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Icon map for dynamic rendering
const iconMap: Record<string, any> = {
  Heart,
  Compass,
  ShieldCheck,
  Waves,
  TrendingUp,
  Sparkles,
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  categories: CategoryDef[];
  onToggleCategory: (name: string) => void;
  reminderEnabled: boolean;
  onToggleReminder: () => void;
  reminderTime: string;
  onSetReminderTime: (t: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  userName: string;
};

function createStyles(c: ColorScheme) {
  return StyleSheet.create({
    container: { flex: 1 },

    // ── Header ──
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingBottom: 12,
      zIndex: 40,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: c.foreground,
    },

    // ── Content ──
    content: { paddingHorizontal: 20, paddingTop: 16 },

    // ── Profile ──
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    profileIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: `${c.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileInfo: { flex: 1 },
    profileName: {
      fontSize: 18,
      fontWeight: '600',
      color: c.cardForeground,
    },
    profileEmail: {
      fontSize: 13,
      color: c.mutedForeground,
      marginTop: 2,
    },
    profileHint: {
      fontSize: 14,
      color: c.mutedForeground,
      marginTop: 2,
    },

    // ── Section ──
    section: { marginTop: 24 },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: c.mutedForeground,
    },
    sectionSubtitle: {
      fontSize: 12,
      color: c.mutedForeground,
      marginTop: 4,
    },

    // ── Categories ──
    categoryList: { marginTop: 16, gap: 8 },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
    },
    categoryItemEnabled: {
      borderColor: `${c.primary}40`,
      backgroundColor: `${c.primary}08`,
    },
    categoryItemDisabled: {
      borderColor: c.border,
      backgroundColor: c.card,
    },
    categoryIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
    checkCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkCircleEnabled: { backgroundColor: c.primary },
    checkCircleDisabled: { borderWidth: 2, borderColor: c.border },

    // ── Reminder ──
    reminderCard: {
      marginTop: 24,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
    },
    reminderIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reminderInfo: { flex: 1, marginLeft: 12 },
    reminderLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: c.cardForeground,
    },
    reminderStatus: {
      fontSize: 12,
      color: c.mutedForeground,
      marginTop: 1,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 16,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: `${c.muted}90`,
    },
    timeLabel: { flex: 1, fontSize: 14, color: c.cardForeground },
    timeBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    timeValue: {
      fontSize: 14,
      fontWeight: '500',
      color: c.cardForeground,
    },
    pickerContainer: { marginTop: 12, alignItems: 'center' },
    pickerDone: {
      marginTop: 8,
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: c.primary,
    },
    pickerDoneText: {
      fontSize: 14,
      fontWeight: '600',
      color: c.primaryForeground,
    },

    // ── List items ──
    listCard: {
      marginTop: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      overflow: 'hidden',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 16,
    },
    listItemBorder: { borderTopWidth: 1, borderTopColor: c.border },
    listItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listItemContent: { flex: 1 },
    listItemLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: c.cardForeground,
    },
    listItemSubtitle: {
      fontSize: 12,
      color: c.mutedForeground,
      marginTop: 1,
    },

    // ── Subscription card ──
    premiumCard: {
      marginTop: 24,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#F59E0B',
      backgroundColor: '#F59E0B10',
      overflow: 'hidden',
    },
    premiumInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 16,
    },
    premiumIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F59E0B20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    premiumContent: { flex: 1 },
    premiumTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#F59E0B',
    },
    premiumSubtitle: {
      fontSize: 12,
      color: c.mutedForeground,
      marginTop: 2,
    },

    // ── Logout ──
    logoutBtn: {
      marginTop: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: 52,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: `${c.destructive}40`,
      backgroundColor: `${c.destructive}08`,
    },
    logoutText: {
      fontSize: 15,
      fontWeight: '600',
      color: c.destructive,
    },
  });
}

export default function SettingsScreen({
  navigation,
  categories,
  onToggleCategory,
  reminderEnabled,
  onToggleReminder,
  reminderTime,
  onSetReminderTime,
  darkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
  userName,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { user, profile, signOut } = useAuth();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const isPremium = profile?.is_premium ?? false;

  // Parse time string "HH:MM" to Date
  const timeDate = (() => {
    const [h, m] = reminderTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  })();

  const handleTimeChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      const hh = String(selectedDate.getHours()).padStart(2, '0');
      const mm = String(selectedDate.getMinutes()).padStart(2, '0');
      onSetReminderTime(`${hh}:${mm}`);
    }
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.background,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile section ── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.profileCard}
          activeOpacity={0.7}
        >
          <View style={styles.profileIcon}>
            <User size={28} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {userName || 'Guest User'}
            </Text>
            {user?.email ? (
              <Text style={styles.profileEmail}>{user.email}</Text>
            ) : null}
            <Text style={styles.profileHint}>
              {userName ? 'Tap to edit profile' : 'Tap to set your name'}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.mutedForeground} />
        </TouchableOpacity>

        {/* ── Premium / Subscription ── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Subscription')}
          style={styles.premiumCard}
          activeOpacity={0.7}
        >
          <View style={styles.premiumInner}>
            <View style={styles.premiumIconCircle}>
              <Crown size={22} color="#F59E0B" />
            </View>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumTitle}>
                {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
              </Text>
              <Text style={styles.premiumSubtitle}>
                {isPremium
                  ? 'Manage your subscription'
                  : 'Unlock all features & remove ads'}
              </Text>
            </View>
            <ChevronRight size={20} color="#F59E0B" />
          </View>
        </TouchableOpacity>

        {/* ── Categories section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Affirmation Categories</Text>
          <Text style={styles.sectionSubtitle}>
            Choose which categories appear in your daily affirmations
          </Text>
          <View style={styles.categoryList}>
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Heart;
              return (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => onToggleCategory(cat.name)}
                  style={[
                    styles.categoryItem,
                    cat.enabled
                      ? styles.categoryItemEnabled
                      : styles.categoryItemDisabled,
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      {
                        backgroundColor: cat.enabled
                          ? `${colors.primary}20`
                          : colors.muted,
                      },
                    ]}
                  >
                    <IconComponent
                      size={20}
                      color={
                        cat.enabled ? colors.primary : colors.mutedForeground
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      {
                        color: cat.enabled
                          ? colors.primary
                          : colors.cardForeground,
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                  <View
                    style={[
                      styles.checkCircle,
                      cat.enabled
                        ? styles.checkCircleEnabled
                        : styles.checkCircleDisabled,
                    ]}
                  >
                    {cat.enabled && (
                      <Check size={14} color={colors.primaryForeground} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Reminder section ── */}
        <View style={styles.reminderCard}>
          <Text style={styles.sectionTitle}>Daily Reminder</Text>
          <View style={styles.reminderRow}>
            <View
              style={[
                styles.reminderIcon,
                {
                  backgroundColor: reminderEnabled
                    ? `${colors.primary}15`
                    : colors.muted,
                },
              ]}
            >
              {reminderEnabled ? (
                <Bell size={20} color={colors.primary} />
              ) : (
                <BellOff size={20} color={colors.mutedForeground} />
              )}
            </View>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderLabel}>Push Notifications</Text>
              <Text style={styles.reminderStatus}>
                {reminderEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={onToggleReminder}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={colors.muted}
            />
          </View>

          {reminderEnabled && (
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.timeRow}
              activeOpacity={0.7}
            >
              <Clock size={16} color={colors.primary} />
              <Text style={styles.timeLabel}>Remind me at</Text>
              <View style={styles.timeBadge}>
                <Text style={styles.timeValue}>
                  {formatTime(reminderTime)}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {showTimePicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={timeDate}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                themeVariant="light"
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  style={styles.pickerDone}
                >
                  <Text style={styles.pickerDoneText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* ── Preferences section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.listCard}>
            {/* Dark Mode */}
            <View style={styles.listItem}>
              <View
                style={[
                  styles.listItemIcon,
                  {
                    backgroundColor: darkMode
                      ? `${colors.primary}15`
                      : colors.muted,
                  },
                ]}
              >
                {darkMode ? (
                  <Moon size={20} color={colors.primary} />
                ) : (
                  <Sun size={20} color={colors.mutedForeground} />
                )}
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemLabel}>Dark Mode</Text>
                <Text style={styles.listItemSubtitle}>
                  {darkMode ? 'On' : 'Off'}
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={onToggleDarkMode}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.muted}
              />
            </View>

            {/* Sound Effects */}
            <View style={[styles.listItem, styles.listItemBorder]}>
              <View
                style={[
                  styles.listItemIcon,
                  {
                    backgroundColor: soundEnabled
                      ? `${colors.primary}15`
                      : colors.muted,
                  },
                ]}
              >
                {soundEnabled ? (
                  <Volume2 size={20} color={colors.primary} />
                ) : (
                  <VolumeX size={20} color={colors.mutedForeground} />
                )}
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemLabel}>Sound Effects</Text>
                <Text style={styles.listItemSubtitle}>
                  {soundEnabled ? 'On' : 'Off'}
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={onToggleSound}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.muted}
              />
            </View>
          </View>
        </View>

        {/* ── About & Legal section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.listCard}>
            {/* About */}
            <TouchableOpacity
              onPress={() => navigation.navigate('About')}
              style={styles.listItem}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Info size={20} color={colors.mutedForeground} />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemLabel}>About Affirm</Text>
                <Text style={styles.listItemSubtitle}>Version 1.0.0</Text>
              </View>
              <ChevronRight size={20} color={colors.mutedForeground} />
            </TouchableOpacity>

            {/* Privacy */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Privacy')}
              style={[styles.listItem, styles.listItemBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <Bookmark size={20} color={colors.mutedForeground} />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemLabel}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color={colors.mutedForeground} />
            </TouchableOpacity>

            {/* Terms */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Terms')}
              style={[styles.listItem, styles.listItemBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.listItemIcon}>
                <FileText size={20} color={colors.mutedForeground} />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemLabel}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutBtn}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={colors.destructive} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
