import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Share,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Share2,
  LayoutGrid,
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
import { logDailyAffirmation } from '../lib/sync';
import { getDailyPicks } from '../lib/dailyPick';
import type { ColorScheme } from '../theme/colors';
import { allAffirmations } from '../data/affirmations';
import type { Affirmation } from '../data/affirmations';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mood icon map for display
const MOOD_ICONS: Record<string, any> = {
  happy: Sun,
  calm: Waves,
  grateful: HandHeart,
  motivated: TrendingUp,
  anxious: Wind,
  sad: CloudRain,
  tired: Moon,
  excited: Zap,
};

// Mood labels for display
const MOOD_LABELS: Record<string, string> = {
  happy: 'Happy',
  calm: 'Calm',
  grateful: 'Grateful',
  motivated: 'Motivated',
  anxious: 'Anxious',
  sad: 'Sad',
  tired: 'Tired',
  excited: 'Excited',
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  enabledCategories: string[];
  currentStreak?: number;
  todayMood?: string;
};

function createStyles(c: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    // ── Header ──
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 8,
      zIndex: 10,
    },
    headerBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.12)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerBtnActive: {
      backgroundColor: 'rgba(255,255,255,0.20)',
    },
    headerBtnLight: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: c.primaryForeground,
    },
    headerCenter: {
      alignItems: 'center',
    },
    headerLabel: {
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 2,
      color: 'rgba(255,255,255,0.50)',
    },
    headerCounter: {
      fontSize: 12,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.70)',
      marginTop: 2,
    },

    // ── Streak & mood bar ──
    streakBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingBottom: 4,
    },
    streakPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(245,158,11,0.25)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    streakText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FCD34D',
    },
    moodPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: 'rgba(255,255,255,0.12)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
    },
    moodText: {
      fontSize: 12,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.80)',
    },

    // ── Card ──
    cardContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    cardContent: {
      maxWidth: 500,
      alignItems: 'center',
    },
    categoryBadge: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
    },
    categoryText: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.80)',
    },
    affirmationText: {
      marginTop: 32,
      fontSize: 28,
      fontWeight: '500',
      lineHeight: 40,
      textAlign: 'center',
      color: 'rgba(255,255,255,1)',
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },

    // ── Footer ──
    footer: {
      paddingHorizontal: 20,
      zIndex: 10,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    actionBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.12)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    favoriteBtn: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    favoriteBtnActive: {
      backgroundColor: 'rgba(230,80,80,0.30)',
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(230,80,80,0.40)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },

    // ── Dots ──
    dotsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      gap: 6,
    },
    dot: {
      height: 6,
      borderRadius: 3,
    },
    dotActive: {
      width: 32,
      backgroundColor: 'rgba(255,255,255,0.90)',
    },
    dotInactive: {
      width: 6,
      backgroundColor: 'rgba(255,255,255,0.30)',
    },

    // ── Empty state ──
    emptyContainer: {
      flex: 1,
    },
    emptyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    emptyBody: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: c.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      marginTop: 24,
      fontSize: 20,
      fontWeight: '600',
      color: c.foreground,
    },
    emptySubtitle: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'center',
      color: c.mutedForeground,
    },
    emptyButton: {
      marginTop: 32,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: c.primary,
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: 24,
      ...Platform.select({
        ios: {
          shadowColor: c.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    emptyButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: c.primaryForeground,
    },
  });
}

export default function HomeScreen({
  navigation,
  favorites,
  onToggleFavorite,
  enabledCategories,
  currentStreak = 0,
  todayMood = '',
}: Props) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // ── Daily picks (fetched from Supabase, cached, deterministic per day) ──
  const [dailyPicks, setDailyPicks] = useState<Affirmation[]>([]);
  const [loadingPicks, setLoadingPicks] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const userId = user?.id ?? 'anon';
    setLoadingPicks(true);
    getDailyPicks(enabledCategories, userId).then((picks) => {
      if (!cancelled) {
        setDailyPicks(picks.length > 0 ? picks : allAffirmations.filter((a) => enabledCategories.includes(a.category)));
        setLoadingPicks(false);
      }
    });
    return () => { cancelled = true; };
  }, [user?.id, enabledCategories]);

  const pool = dailyPicks;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation values
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const current = pool.length > 0 ? pool[currentIndex % pool.length] : null;
  const isLiked = current ? favorites.has(current.id) : false;

  // Log daily affirmation to Supabase
  useEffect(() => {
    if (user && current) {
      logDailyAffirmation(user.id, current.id);
    }
  }, [user?.id, current?.id]);

  const animateTransition = useCallback(
    (dir: 'prev' | 'next') => {
      if (isAnimating || pool.length === 0) return;
      setIsAnimating(true);

      const toValue = dir === 'next' ? -40 : 40;

      Animated.parallel([
        Animated.timing(translateX, {
          toValue,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update index
        if (dir === 'next') {
          setCurrentIndex((i) => (i + 1) % pool.length);
        } else {
          setCurrentIndex((i) => (i - 1 + pool.length) % pool.length);
        }

        // Reset position to opposite side
        translateX.setValue(dir === 'next' ? 40 : -40);

        // Animate in
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsAnimating(false);
        });
      });
    },
    [isAnimating, pool.length, translateX, opacity]
  );

  // Auto-advance every 10 seconds
  useEffect(() => {
    if (pool.length === 0) return;
    const interval = setInterval(() => {
      animateTransition('next');
    }, 10000);
    return () => clearInterval(interval);
  }, [pool.length, animateTransition]);

  const handleShare = async () => {
    if (!current) return;
    try {
      await Share.share({
        message: `"${current.text}" — ${current.category} | Affirm App`,
      });
    } catch (_) { }
  };

  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (isAnimating || targetIndex === currentIndex) return;
      const dir = targetIndex > currentIndex ? 'next' : 'prev';
      setIsAnimating(true);
      const toValue = dir === 'next' ? -40 : 40;

      Animated.parallel([
        Animated.timing(translateX, {
          toValue,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(targetIndex);
        translateX.setValue(dir === 'next' ? 40 : -40);
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setIsAnimating(false));
      });
    },
    [isAnimating, currentIndex, translateX, opacity]
  );

  // ── Loading state ──
  if (loadingPicks) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.emptySubtitle, { marginTop: 16 }]}>
          Preparing today's affirmations...
        </Text>
      </View>
    );
  }

  // ── Empty state ──
  if (pool.length === 0 || !current) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.emptyHeader,
            { paddingTop: insets.top + 8, paddingBottom: 8 },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Favorites')}
            style={styles.headerBtnLight}
          >
            <Heart size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.headerBtnLight}
          >
            <Settings size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyBody}>
          <View style={styles.emptyIcon}>
            <LayoutGrid size={36} color={colors.mutedForeground} />
          </View>
          <Text style={styles.emptyTitle}>No categories selected</Text>
          <Text style={styles.emptySubtitle}>
            Enable at least one category in Settings to receive your daily
            affirmations.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.emptyButton}
          >
            <Settings size={16} color={colors.primaryForeground} />
            <Text style={styles.emptyButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main home screen ──
  return (
    <View style={styles.container}>
      {/* Background image */}
      <Image
        source={{ uri: current.image }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      {/* Dark gradient overlay for text readability */}
      <LinearGradient
        colors={[colors.gradientTop, colors.gradientMid, colors.gradientBottom]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Favorites')}
          style={[
            styles.headerBtn,
            favorites.size > 0 && styles.headerBtnActive,
          ]}
          activeOpacity={0.7}
        >
          <Heart
            size={20}
            color={
              favorites.size > 0
                ? colors.overlay.white100
                : colors.overlay.white70
            }
            fill={favorites.size > 0 ? colors.overlay.white100 : 'transparent'}
          />
          {favorites.size > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{favorites.size}</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>DAILY AFFIRMATION</Text>
          <Text style={styles.headerCounter}>
            {currentIndex + 1} / {pool.length}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.headerBtn}
          activeOpacity={0.7}
        >
          <Settings size={20} color={colors.overlay.white70} />
        </TouchableOpacity>
      </View>

      {/* Streak & mood bar */}
      {(currentStreak > 0 || todayMood) && (
        <View style={styles.streakBar}>
          {currentStreak > 0 && (
            <View style={styles.streakPill}>
              <Text style={{ fontSize: 14 }}>🔥</Text>
              <Text style={styles.streakText}>{currentStreak} day streak</Text>
            </View>
          )}
          {todayMood && MOOD_ICONS[todayMood] && (() => {
            const MoodIcon = MOOD_ICONS[todayMood];
            return (
              <View style={styles.moodPill}>
                <MoodIcon size={14} color="rgba(255,255,255,0.80)" />
                <Text style={styles.moodText}>
                  {MOOD_LABELS[todayMood] ?? todayMood}
                </Text>
              </View>
            );
          })()}
        </View>
      )}

      {/* Affirmation card center */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.cardContent,
            {
              transform: [{ translateX }],
              opacity,
            },
          ]}
        >
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{current.category}</Text>
          </View>
          <Text style={styles.affirmationText}>"{current.text}"</Text>
        </Animated.View>
      </View>

      {/* Bottom controls */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => animateTransition('prev')}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={colors.overlay.white80} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onToggleFavorite(current.id)}
            style={[styles.favoriteBtn, isLiked && styles.favoriteBtnActive]}
            activeOpacity={0.7}
          >
            <Heart
              size={28}
              color={isLiked ? colors.likedText : colors.overlay.white80}
              fill={isLiked ? colors.likedText : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Share2 size={20} color={colors.overlay.white80} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => animateTransition('next')}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <ChevronRight size={24} color={colors.overlay.white80} />
          </TouchableOpacity>
        </View>

        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {pool.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => goToIndex(i)}
              style={[
                styles.dot,
                i === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
              activeOpacity={0.7}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
