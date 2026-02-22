import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Heart,
  Compass,
  ShieldCheck,
  Waves,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Bell,
  Sun,
  Moon,
  Sunrise,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import {
  onboardingCategories,
  onboardingHeroImage,
  categoryImages,
} from '../data/affirmations';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TOTAL_STEPS = 4;

// Icon map for dynamic rendering
const iconMap: Record<string, any> = {
  Heart, Compass, ShieldCheck, Waves, TrendingUp, Sparkles,
};

type OnboardingResult = {
  selectedCategories: Set<string>;
  reminderTime: string | null;
};

type Props = {
  navigation: NativeStackNavigationProp<any>;
  onComplete: (result: OnboardingResult) => void;
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={stepStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            stepStyles.dot,
            i === current
              ? stepStyles.dotActive
              : i < current
                ? stepStyles.dotCompleted
                : stepStyles.dotPending,
          ]}
        />
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 32, backgroundColor: Colors.primary },
  dotCompleted: { width: 16, backgroundColor: `${Colors.primary}80` },
  dotPending: { width: 16, backgroundColor: Colors.border },
});

// ═══════════════════════════════════════════════════════════════════════════════
// FADE-IN WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

function FadeIn({
  delay = 0,
  children,
  style,
}: {
  delay?: number;
  children: React.ReactNode;
  style?: any;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay, anim, translateY]);

  return (
    <Animated.View
      style={[style, { opacity: anim, transform: [{ translateY }] }]}
    >
      {children}
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 0 — WELCOME
// ═══════════════════════════════════════════════════════════════════════════════

function WelcomeStep({ onNext, insets }: { onNext: () => void; insets: any }) {
  return (
    <View style={s.flex1}>
      {/* Hero image */}
      <View style={s.heroContainer}>
        <Image
          source={{ uri: onboardingHeroImage }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[
            'rgba(30,58,95,0.20)',
            'rgba(30,58,95,0.70)',
            Colors.background,
          ]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* Content */}
      <View style={s.welcomeContent}>
        <FadeIn>
          <Text style={s.welcomeTitle}>Affirm</Text>
          <Text style={s.welcomeSubtitle}>
            Begin each day with words that shape your world.
          </Text>
        </FadeIn>

        <FadeIn delay={200}>
          <Text style={s.welcomeDescription}>
            Curated affirmations to help you build confidence, practice
            gratitude, and cultivate inner peace.
          </Text>
        </FadeIn>

        <View style={[s.welcomeFooter, { paddingBottom: insets.bottom + 24 }]}>
          <TouchableOpacity
            onPress={onNext}
            style={s.primaryBtn}
            activeOpacity={0.85}
          >
            <Text style={s.primaryBtnText}>Get Started</Text>
            <ChevronRight size={20} color={Colors.primaryForeground} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — SELECT CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

function CategoriesStep({
  selected,
  onToggle,
  onNext,
  onBack,
  insets,
}: {
  selected: Set<string>;
  onToggle: (name: string) => void;
  onNext: () => void;
  onBack: () => void;
  insets: any;
}) {
  const cardWidth = (SCREEN_WIDTH - 48 - 12) / 2; // padding 24 each side + 12 gap

  return (
    <View style={[s.flex1, { backgroundColor: Colors.background }]}>
      {/* Header */}
      <View style={[s.stepHeader, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={onBack} style={s.navBtn} activeOpacity={0.7}>
          <ChevronLeft size={20} color={Colors.mutedForeground} />
        </TouchableOpacity>
        <StepIndicator current={1} total={TOTAL_STEPS} />
        <TouchableOpacity onPress={onNext} activeOpacity={0.7}>
          <Text style={s.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[s.stepContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <FadeIn>
          <Text style={s.stepTitle}>What matters to you?</Text>
          <Text style={s.stepSubtitle}>
            Choose the categories that resonate with you. You can always change
            these later.
          </Text>
        </FadeIn>

        {/* Category grid */}
        <View style={s.categoryGrid}>
          {onboardingCategories.map((cat, i) => {
            const IconComp = iconMap[cat.icon] || Heart;
            const isSelected = selected.has(cat.name);
            return (
              <FadeIn key={cat.name} delay={i * 80}>
                <TouchableOpacity
                  onPress={() => onToggle(cat.name)}
                  style={[
                    s.categoryCard,
                    { width: cardWidth },
                    isSelected ? s.categoryCardSelected : s.categoryCardDefault,
                  ]}
                  activeOpacity={0.8}
                >
                  {/* Image */}
                  <View style={s.categoryImageWrap}>
                    <Image
                      source={{ uri: cat.image }}
                      style={StyleSheet.absoluteFillObject}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['rgba(30,58,95,0.10)', 'rgba(30,58,95,0.60)']}
                      style={StyleSheet.absoluteFillObject}
                    />
                    {/* Checkmark */}
                    <View
                      style={[
                        s.categoryCheck,
                        isSelected ? s.categoryCheckVisible : s.categoryCheckHidden,
                      ]}
                    >
                      {isSelected && (
                        <Check size={14} color={Colors.primaryForeground} />
                      )}
                    </View>
                  </View>

                  {/* Text */}
                  <View style={s.categoryTextWrap}>
                    <View style={s.categoryNameRow}>
                      <IconComp
                        size={16}
                        color={isSelected ? Colors.primary : Colors.mutedForeground}
                      />
                      <Text
                        style={[
                          s.categoryName,
                          { color: isSelected ? Colors.primary : Colors.foreground },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </View>
                    <Text style={s.categoryDesc}>{cat.description}</Text>
                  </View>
                </TouchableOpacity>
              </FadeIn>
            );
          })}
        </View>

        {/* Footer */}
        <View style={s.stepFooter}>
          <Text style={s.footerHint}>
            {selected.size === 0
              ? 'Select at least one category'
              : `${selected.size} ${selected.size === 1 ? 'category' : 'categories'} selected`}
          </Text>
          <TouchableOpacity
            onPress={onNext}
            disabled={selected.size === 0}
            style={[
              s.continueBtn,
              selected.size > 0 ? s.continueBtnActive : s.continueBtnDisabled,
            ]}
            activeOpacity={0.85}
          >
            <Text
              style={[
                s.continueBtnText,
                { color: selected.size > 0 ? Colors.primaryForeground : Colors.mutedForeground },
              ]}
            >
              Continue
            </Text>
            <ChevronRight
              size={20}
              color={selected.size > 0 ? Colors.primaryForeground : Colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — REMINDER TIME
// ═══════════════════════════════════════════════════════════════════════════════

interface TimeOption {
  label: string;
  time: string;
  icon: any;
  description: string;
}

const timeOptions: TimeOption[] = [
  { label: 'Morning', time: '7:00 AM', icon: Sunrise, description: 'Start your day with intention' },
  { label: 'Afternoon', time: '12:00 PM', icon: Sun, description: 'A midday mindful pause' },
  { label: 'Evening', time: '8:00 PM', icon: Moon, description: 'Reflect before rest' },
];

function ReminderStep({
  selectedTime,
  onSelectTime,
  onNext,
  onBack,
  insets,
}: {
  selectedTime: string | null;
  onSelectTime: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
  insets: any;
}) {
  return (
    <View style={[s.flex1, { backgroundColor: Colors.background }]}>
      {/* Header */}
      <View style={[s.stepHeader, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={onBack} style={s.navBtn} activeOpacity={0.7}>
          <ChevronLeft size={20} color={Colors.mutedForeground} />
        </TouchableOpacity>
        <StepIndicator current={2} total={TOTAL_STEPS} />
        <TouchableOpacity onPress={onNext} activeOpacity={0.7}>
          <Text style={s.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[s.stepContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <FadeIn>
          <Text style={s.stepTitle}>When do you want to reflect?</Text>
          <Text style={s.stepSubtitle}>
            We'll send a gentle reminder at your preferred time. You can change
            this anytime in settings.
          </Text>
        </FadeIn>

        {/* Time options */}
        <View style={s.timeList}>
          {timeOptions.map((opt, i) => {
            const IconComp = opt.icon;
            const isActive = selectedTime === opt.label;
            return (
              <FadeIn key={opt.label} delay={i * 100}>
                <TouchableOpacity
                  onPress={() => onSelectTime(opt.label)}
                  style={[
                    s.timeCard,
                    isActive ? s.timeCardActive : s.timeCardDefault,
                  ]}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      s.timeIcon,
                      {
                        backgroundColor: isActive ? Colors.primary : Colors.muted,
                      },
                    ]}
                  >
                    <IconComp
                      size={24}
                      color={isActive ? Colors.primaryForeground : Colors.mutedForeground}
                    />
                  </View>
                  <View style={s.timeInfo}>
                    <Text
                      style={[
                        s.timeLabel,
                        { color: isActive ? Colors.primary : Colors.foreground },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text style={s.timeDesc}>{opt.description}</Text>
                  </View>
                  <View style={s.timeRight}>
                    <Text
                      style={[
                        s.timeValue,
                        { color: isActive ? Colors.primary : Colors.foreground },
                      ]}
                    >
                      {opt.time}
                    </Text>
                    <View
                      style={[
                        s.timeCheck,
                        isActive ? s.timeCheckActive : s.timeCheckDefault,
                      ]}
                    >
                      {isActive && (
                        <Check size={12} color={Colors.primaryForeground} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </FadeIn>
            );
          })}
        </View>

        {/* No reminders */}
        <FadeIn delay={300}>
          <TouchableOpacity
            onPress={() => onSelectTime('none')}
            style={[
              s.noReminderBtn,
              selectedTime === 'none'
                ? s.noReminderBtnActive
                : s.noReminderBtnDefault,
            ]}
            activeOpacity={0.8}
          >
            <Bell
              size={16}
              color={
                selectedTime === 'none' ? Colors.primary : Colors.mutedForeground
              }
            />
            <Text
              style={[
                s.noReminderText,
                {
                  color:
                    selectedTime === 'none'
                      ? Colors.primary
                      : Colors.mutedForeground,
                },
              ]}
            >
              I'll set reminders later
            </Text>
          </TouchableOpacity>
        </FadeIn>

        {/* Footer */}
        <View style={s.stepFooter}>
          <TouchableOpacity
            onPress={onNext}
            disabled={!selectedTime}
            style={[
              s.continueBtn,
              selectedTime ? s.continueBtnActive : s.continueBtnDisabled,
            ]}
            activeOpacity={0.85}
          >
            <Text
              style={[
                s.continueBtnText,
                { color: selectedTime ? Colors.primaryForeground : Colors.mutedForeground },
              ]}
            >
              Continue
            </Text>
            <ChevronRight
              size={20}
              color={selectedTime ? Colors.primaryForeground : Colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — READY / FIRST AFFIRMATION PREVIEW
// ═══════════════════════════════════════════════════════════════════════════════

function ReadyStep({
  selectedCategories,
  onBack,
  onFinish,
  insets,
}: {
  selectedCategories: Set<string>;
  onBack: () => void;
  onFinish: () => void;
  insets: any;
}) {
  const previewAffirmation =
    'You are capable of achieving extraordinary things. Every step you take brings you closer to the person you are becoming.';

  return (
    <View style={s.flex1}>
      {/* Background */}
      <Image
        source={{ uri: onboardingHeroImage }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          'rgba(30,58,95,0.40)',
          'rgba(30,58,95,0.75)',
          'rgba(30,58,95,0.90)',
        ]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={[s.readyHeader, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={onBack}
          style={s.readyBackBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="rgba(255,255,255,0.90)" />
        </TouchableOpacity>
        <StepIndicator current={3} total={TOTAL_STEPS} />
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={s.readyCenter}>
        <FadeIn>
          <View style={s.readyCheckCircle}>
            <Check size={32} color="rgba(255,255,255,0.90)" />
          </View>
        </FadeIn>

        <FadeIn delay={200}>
          <Text style={s.readyLabel}>YOU'RE ALL SET</Text>
          <Text style={s.readyTitle}>Your daily affirmation awaits</Text>
        </FadeIn>

        <FadeIn delay={400} style={s.readyCardWrap}>
          <View style={s.readyCard}>
            <Text style={s.readyQuote}>"{previewAffirmation}"</Text>
          </View>
        </FadeIn>

        {/* Selected categories */}
        <FadeIn delay={600}>
          <View style={s.readyTags}>
            {Array.from(selectedCategories).map((cat) => (
              <View key={cat} style={s.readyTag}>
                <Text style={s.readyTagText}>{cat}</Text>
              </View>
            ))}
          </View>
        </FadeIn>
      </View>

      {/* Bottom CTA */}
      <FadeIn delay={700}>
        <View style={[s.readyFooter, { paddingBottom: insets.bottom + 24 }]}>
          <TouchableOpacity
            onPress={onFinish}
            style={s.readyBtn}
            activeOpacity={0.85}
          >
            <Text style={s.readyBtnText}>Begin My Journey</Text>
          </TouchableOpacity>
        </View>
      </FadeIn>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ONBOARDING SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

export default function OnboardingScreen({ navigation, onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const toggleCategory = useCallback((name: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const goNext = useCallback(
    () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)),
    []
  );
  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const finish = useCallback(() => {
    onComplete({
      selectedCategories,
      reminderTime: selectedTime,
    });
  }, [onComplete, selectedCategories, selectedTime]);

  return (
    <View style={s.flex1}>
      {step === 0 && <WelcomeStep onNext={goNext} insets={insets} />}
      {step === 1 && (
        <CategoriesStep
          selected={selectedCategories}
          onToggle={toggleCategory}
          onNext={goNext}
          onBack={goBack}
          insets={insets}
        />
      )}
      {step === 2 && (
        <ReminderStep
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          onNext={goNext}
          onBack={goBack}
          insets={insets}
        />
      )}
      {step === 3 && (
        <ReadyStep
          selectedCategories={selectedCategories}
          onBack={goBack}
          onFinish={finish}
          insets={insets}
        />
      )}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const s = StyleSheet.create({
  flex1: { flex: 1 },

  // ── Welcome ──
  heroContainer: {
    height: SCREEN_HEIGHT * 0.55,
    width: '100%',
    overflow: 'hidden',
  },
  welcomeContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -80,
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.foreground,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  welcomeSubtitle: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    color: Colors.mutedForeground,
  },
  welcomeDescription: {
    marginTop: 24,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: Colors.mutedForeground,
    maxWidth: 280,
  },
  welcomeFooter: {
    marginTop: 'auto',
    paddingTop: 32,
    alignItems: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    width: 260,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryForeground,
  },

  // ── Step header ──
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.mutedForeground,
  },

  // ── Step content ──
  stepContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.foreground,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  stepSubtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.mutedForeground,
  },

  // ── Categories grid ──
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 28,
  },
  categoryCard: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  categoryCardDefault: {
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  categoryImageWrap: {
    height: 96,
    width: '100%',
    overflow: 'hidden',
  },
  categoryCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCheckVisible: {
    backgroundColor: Colors.primary,
  },
  categoryCheckHidden: {
    backgroundColor: 'transparent',
  },
  categoryTextWrap: {
    padding: 12,
    gap: 4,
  },
  categoryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryDesc: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.mutedForeground,
  },

  // ── Footer / continue ──
  stepFooter: {
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
    paddingBottom: 8,
  },
  footerHint: {
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    width: '100%',
    maxWidth: 320,
    borderRadius: 28,
  },
  continueBtnActive: {
    backgroundColor: Colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  continueBtnDisabled: {
    backgroundColor: Colors.muted,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // ── Time options ──
  timeList: {
    marginTop: 32,
    gap: 16,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  timeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  timeCardDefault: {
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  timeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInfo: {
    flex: 1,
    gap: 2,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeDesc: {
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  timeRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  timeCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeCheckActive: {
    backgroundColor: Colors.primary,
  },
  timeCheckDefault: {
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  noReminderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  noReminderBtnActive: {
    borderColor: `${Colors.primary}60`,
    backgroundColor: `${Colors.primary}08`,
  },
  noReminderBtnDefault: {
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  noReminderText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Ready step ──
  readyHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  readyBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  readyCheckCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  readyLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.60)',
  },
  readyTitle: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.95)',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  readyCardWrap: {
    width: '100%',
    marginTop: 32,
  },
  readyCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  readyQuote: {
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 26,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.90)',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  readyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  readyTag: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  readyTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.80)',
  },
  readyFooter: {
    paddingHorizontal: 32,
  },
  readyBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
  },
  readyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgb(30,58,95)',
  },
});
