import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sparkles,
  Flame,
  PenLine,
  ChevronRight,
  Sun,
  Waves,
  HandHeart,
  TrendingUp,
  Wind,
  CloudRain,
  Moon,
  Zap,
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { createCheckIn, fetchStreak } from '../lib/sync';
import type { ColorScheme } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Mood options ───────────────────────────────────────────────────────────

const MOODS = [
  { id: 'happy', icon: Sun, label: 'Happy', color: '#F59E0B' },
  { id: 'calm', icon: Waves, label: 'Calm', color: '#06B6D4' },
  { id: 'grateful', icon: HandHeart, label: 'Grateful', color: '#10B981' },
  { id: 'motivated', icon: TrendingUp, label: 'Motivated', color: '#8B5CF6' },
  { id: 'anxious', icon: Wind, label: 'Anxious', color: '#EF4444' },
  { id: 'sad', icon: CloudRain, label: 'Sad', color: '#6366F1' },
  { id: 'tired', icon: Moon, label: 'Tired', color: '#78716C' },
  { id: 'excited', icon: Zap, label: 'Excited', color: '#EC4899' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateString(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Props ──────────────────────────────────────────────────────────────────

type Props = {
  onComplete: (mood: string, note: string) => void;
};

// ─── Styles ─────────────────────────────────────────────────────────────────

function createStyles(c: ColorScheme) {
  const cardWidth = (SCREEN_WIDTH - 24 * 2 - 12) / 2;

  return StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: c.background },
    scroll: { flexGrow: 1, paddingHorizontal: 24 },

    // ── Greeting ──
    greetingSection: {
      alignItems: 'center',
      marginBottom: 8,
    },
    dateText: {
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.5,
      color: c.mutedForeground,
      textTransform: 'uppercase',
    },
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 8,
    },
    greetingText: {
      fontSize: 26,
      fontWeight: '800',
      color: c.foreground,
    },

    // ── Streak ──
    streakCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginTop: 20,
      marginBottom: 28,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#F59E0B40',
      backgroundColor: '#F59E0B08',
    },
    streakIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F59E0B20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    streakInfo: { flex: 1 },
    streakNumber: {
      fontSize: 20,
      fontWeight: '800',
      color: '#F59E0B',
    },
    streakLabel: {
      fontSize: 12,
      color: c.mutedForeground,
      marginTop: 1,
    },

    // ── Mood section ──
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: c.foreground,
      textAlign: 'center',
    },
    sectionSubtitle: {
      fontSize: 14,
      color: c.mutedForeground,
      textAlign: 'center',
      marginTop: 6,
      marginBottom: 20,
    },

    moodGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'center',
    },
    moodCard: {
      width: cardWidth,
      paddingVertical: 18,
      paddingHorizontal: 12,
      borderRadius: 16,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moodCardDefault: {
      borderColor: c.border,
      backgroundColor: c.card,
    },
    moodIconCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    moodLabel: {
      fontSize: 14,
      fontWeight: '600',
    },

    // ── Note section ──
    noteSection: {
      marginTop: 28,
    },
    noteHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    noteTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: c.foreground,
    },
    noteOptional: {
      fontSize: 12,
      color: c.mutedForeground,
    },
    noteInput: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      padding: 16,
      fontSize: 15,
      color: c.foreground,
      minHeight: 100,
      textAlignVertical: 'top',
    },

    // ── CTA ──
    ctaContainer: {
      marginTop: 28,
      paddingBottom: 12,
    },
    ctaBtn: {
      height: 56,
      borderRadius: 16,
      backgroundColor: c.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    ctaBtnDisabled: {
      opacity: 0.5,
    },
    ctaBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: c.primaryForeground,
    },
    skipBtn: {
      alignItems: 'center',
      marginTop: 14,
    },
    skipText: {
      fontSize: 14,
      color: c.mutedForeground,
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DailyCheckInScreen({ onComplete }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [streak, setStreak] = useState(0);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const moodAnims = useRef(MOODS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger mood cards
    Animated.stagger(
      60,
      moodAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  // Fetch current streak
  useEffect(() => {
    if (user) {
      fetchStreak(user.id).then((s) => {
        if (s) setStreak(s.current);
      });
    }
  }, [user?.id]);

  // Also use profile streak if available
  useEffect(() => {
    if (profile?.current_streak) {
      setStreak(profile.current_streak);
    }
  }, [profile?.current_streak]);

  const displayName = profile?.display_name || user?.user_metadata?.display_name || '';
  const greeting = getGreeting();

  const handleContinue = async () => {
    if (!selectedMood || !user) return;
    setSaving(true);
    await createCheckIn(user.id, selectedMood, note.trim());
    setSaving(false);
    onComplete(selectedMood, note.trim());
  };

  const handleSkip = () => {
    onComplete('', '');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + 20,
              paddingBottom: insets.bottom + 24,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Greeting ── */}
          <Animated.View
            style={[
              styles.greetingSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.dateText}>{getDateString()}</Text>
            <View style={styles.greetingRow}>
              <Sparkles size={24} color={colors.primary} />
              <Text style={styles.greetingText}>
                {greeting}
                {displayName ? `, ${displayName}` : ''}
              </Text>
            </View>
          </Animated.View>

          {/* ── Streak card ── */}
          <Animated.View
            style={[
              styles.streakCard,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.streakIconCircle}>
              <Flame size={22} color="#F59E0B" />
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>
                {streak > 0 ? `${streak} day streak!` : 'Start your streak!'}
              </Text>
              <Text style={styles.streakLabel}>
                {streak > 0
                  ? 'Keep it going — check in today'
                  : 'Check in daily to build your streak'}
              </Text>
            </View>
          </Animated.View>

          {/* ── Mood selection ── */}
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          >
            <Text style={styles.sectionTitle}>
              How are you feeling today?
            </Text>
            <Text style={styles.sectionSubtitle}>
              Select the mood that best describes you right now
            </Text>
          </Animated.View>

          <View style={styles.moodGrid}>
            {MOODS.map((mood, index) => {
              const isSelected = selectedMood === mood.id;
              const scale = moodAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              });

              return (
                <Animated.View
                  key={mood.id}
                  style={{
                    opacity: moodAnims[index],
                    transform: [{ scale }],
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedMood(mood.id)}
                    style={[
                      styles.moodCard,
                      isSelected
                        ? {
                            borderColor: mood.color,
                            backgroundColor: `${mood.color}12`,
                          }
                        : styles.moodCardDefault,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.moodIconCircle,
                        {
                          backgroundColor: isSelected
                            ? `${mood.color}20`
                            : `${colors.muted}`,
                        },
                      ]}
                    >
                      <mood.icon
                        size={26}
                        color={isSelected ? mood.color : colors.mutedForeground}
                      />
                    </View>
                    <Text
                      style={[
                        styles.moodLabel,
                        {
                          color: isSelected
                            ? mood.color
                            : colors.cardForeground,
                        },
                      ]}
                    >
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* ── Note section ── */}
          <View style={styles.noteSection}>
            <View style={styles.noteHeader}>
              <PenLine size={18} color={colors.primary} />
              <Text style={styles.noteTitle}>Add a note</Text>
              <Text style={styles.noteOptional}>(optional)</Text>
            </View>
            <TextInput
              style={[
                styles.noteInput,
                note.length > 0 && { borderColor: colors.primary },
              ]}
              placeholder="What's on your mind today? Write a thought, intention, or reflection..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              maxLength={500}
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* ── CTA ── */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!selectedMood || saving}
              style={[
                styles.ctaBtn,
                (!selectedMood || saving) && styles.ctaBtnDisabled,
              ]}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <>
                  <Text style={styles.ctaBtnText}>
                    Continue to Affirmations
                  </Text>
                  <ChevronRight size={20} color={colors.primaryForeground} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipBtn}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
