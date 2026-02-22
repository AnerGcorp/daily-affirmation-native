import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Crown,
  Check,
  Sparkles,
  Star,
  Palette,
  BellRing,
  Shield,
  Zap,
  Infinity,
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { createSubscription } from '../lib/sync';
import type { ColorScheme } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type Plan = 'monthly' | 'yearly';

const FEATURES = [
  {
    icon: Infinity,
    title: 'Unlimited Categories',
    desc: 'Access all affirmation categories',
    free: false,
  },
  {
    icon: Sparkles,
    title: 'Custom Affirmations',
    desc: 'Create your own affirmations',
    free: false,
  },
  {
    icon: Palette,
    title: 'Advanced Themes',
    desc: 'Unlock premium color themes',
    free: false,
  },
  {
    icon: BellRing,
    title: 'Smart Reminders',
    desc: 'AI-powered optimal timing',
    free: false,
  },
  {
    icon: Shield,
    title: 'Ad-Free Experience',
    desc: 'No ads, no distractions',
    free: false,
  },
  {
    icon: Zap,
    title: 'Home Screen Widget',
    desc: 'Daily affirmation on your home screen',
    free: false,
  },
];

function createStyles(c: ColorScheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },

    // ── Header ──
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingBottom: 12,
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

    content: { paddingHorizontal: 20, paddingTop: 8 },

    // ── Crown badge ──
    badgeRow: {
      alignItems: 'center',
      marginBottom: 24,
    },
    crownCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    badgeTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: c.foreground,
      textAlign: 'center',
    },
    badgeSubtitle: {
      fontSize: 15,
      color: c.mutedForeground,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 22,
    },

    // ── Plan cards ──
    planRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    planCard: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 2,
      padding: 16,
      alignItems: 'center',
    },
    planCardInactive: {
      borderColor: c.border,
      backgroundColor: c.card,
    },
    planCardActive: {
      borderColor: c.primary,
      backgroundColor: `${c.primary}08`,
    },
    planSaveBadge: {
      position: 'absolute',
      top: -10,
      right: 12,
      backgroundColor: '#10B981',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    planSaveText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    planLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: c.mutedForeground,
      marginBottom: 8,
    },
    planPrice: {
      fontSize: 28,
      fontWeight: '800',
    },
    planPeriod: {
      fontSize: 13,
      color: c.mutedForeground,
      marginTop: 4,
    },

    // ── Features ──
    featuresTitle: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: c.mutedForeground,
      marginBottom: 16,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginBottom: 16,
    },
    featureIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureContent: { flex: 1 },
    featureTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: c.cardForeground,
    },
    featureDesc: {
      fontSize: 13,
      color: c.mutedForeground,
      marginTop: 1,
    },
    featureCheck: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── CTA ──
    ctaBtn: {
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    ctaBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    restoreBtn: {
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 8,
    },
    restoreText: {
      fontSize: 14,
      color: c.mutedForeground,
    },
    termsNote: {
      fontSize: 12,
      color: c.mutedForeground,
      textAlign: 'center',
      marginTop: 12,
      lineHeight: 18,
    },
  });
}

export default function SubscriptionScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { user, profile, refreshProfile } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<Plan>('yearly');
  const [purchasing, setPurchasing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to subscribe.');
      return;
    }

    // In production, integrate RevenueCat or Stripe here.
    // For now, we mark the user as premium in Supabase.
    Alert.alert(
      'Subscribe',
      `Confirm ${selectedPlan === 'monthly' ? '$4.99/month' : '$29.99/year'} subscription?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: async () => {
            setPurchasing(true);
            const expiresAt = new Date();
            if (selectedPlan === 'monthly') {
              expiresAt.setMonth(expiresAt.getMonth() + 1);
            } else {
              expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            }
            await createSubscription(
              user.id,
              selectedPlan,
              'manual',
              expiresAt.toISOString()
            );
            await refreshProfile();
            setPurchasing(false);
            Alert.alert(
              'Welcome to Premium!',
              'You now have access to all premium features.',
              [{ text: 'Awesome', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  const isPremium = profile?.is_premium ?? false;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Badge */}
          <View style={styles.badgeRow}>
            <LinearGradient
              colors={['#F59E0B', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.crownCircle}
            >
              <Crown size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.badgeTitle}>
              {isPremium ? 'You\'re Premium!' : 'Unlock Premium'}
            </Text>
            <Text style={styles.badgeSubtitle}>
              {isPremium
                ? 'Enjoy all the features of Affirm Premium.'
                : 'Get unlimited access to all affirmation features and tools.'}
            </Text>
          </View>

          {/* Plan selection */}
          {!isPremium && (
            <View style={styles.planRow}>
              {/* Monthly */}
              <TouchableOpacity
                onPress={() => setSelectedPlan('monthly')}
                style={[
                  styles.planCard,
                  selectedPlan === 'monthly'
                    ? styles.planCardActive
                    : styles.planCardInactive,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.planLabel}>Monthly</Text>
                <Text
                  style={[
                    styles.planPrice,
                    {
                      color:
                        selectedPlan === 'monthly'
                          ? colors.primary
                          : colors.foreground,
                    },
                  ]}
                >
                  $4.99
                </Text>
                <Text style={styles.planPeriod}>per month</Text>
              </TouchableOpacity>

              {/* Yearly */}
              <TouchableOpacity
                onPress={() => setSelectedPlan('yearly')}
                style={[
                  styles.planCard,
                  selectedPlan === 'yearly'
                    ? styles.planCardActive
                    : styles.planCardInactive,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.planSaveBadge}>
                  <Text style={styles.planSaveText}>SAVE 50%</Text>
                </View>
                <Text style={styles.planLabel}>Yearly</Text>
                <Text
                  style={[
                    styles.planPrice,
                    {
                      color:
                        selectedPlan === 'yearly'
                          ? colors.primary
                          : colors.foreground,
                    },
                  ]}
                >
                  $29.99
                </Text>
                <Text style={styles.planPeriod}>per year</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Features */}
          <Text style={styles.featuresTitle}>Premium Features</Text>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <View key={i} style={styles.featureItem}>
                <View
                  style={[
                    styles.featureIconCircle,
                    { backgroundColor: `${colors.primary}15` },
                  ]}
                >
                  <Icon size={22} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
                <View
                  style={[
                    styles.featureCheck,
                    {
                      backgroundColor: isPremium
                        ? colors.primary
                        : `${colors.primary}20`,
                    },
                  ]}
                >
                  <Check
                    size={14}
                    color={
                      isPremium ? '#FFFFFF' : colors.primary
                    }
                  />
                </View>
              </View>
            );
          })}

          {/* CTA */}
          {!isPremium && (
            <>
              <LinearGradient
                colors={[colors.primary, '#0EA5E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.ctaBtn, { borderRadius: 16 }]}
              >
                <TouchableOpacity
                  onPress={handleSubscribe}
                  disabled={purchasing}
                  style={[
                    styles.ctaBtn,
                    { width: '100%' },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.ctaBtnText}>
                    {purchasing
                      ? 'Processing...'
                      : `Subscribe ${selectedPlan === 'monthly' ? '$4.99/mo' : '$29.99/yr'}`}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity style={styles.restoreBtn}>
                <Text style={styles.restoreText}>Restore Purchases</Text>
              </TouchableOpacity>

              <Text style={styles.termsNote}>
                Payment will be charged to your account. Subscription
                auto-renews unless cancelled at least 24 hours before the end
                of the current period.
              </Text>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
