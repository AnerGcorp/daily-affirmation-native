/**
 * Color palettes for light and dark themes.
 * Derived from the v0.dev CSS variables (HSL → hex).
 */

export type ColorScheme = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;

  // Overlay colors (glass-morphism)
  overlay: {
    white5: string;
    white10: string;
    white12: string;
    white15: string;
    white20: string;
    white25: string;
    white50: string;
    white70: string;
    white80: string;
    white90: string;
    white100: string;
  };

  // Gradients
  gradientTop: string;
  gradientMid: string;
  gradientBottom: string;
  cardGradientTop: string;
  cardGradientMid: string;
  cardGradientBottom: string;

  // Liked / heart
  likedBg: string;
  likedText: string;
  likedShadow: string;

  // Category backgrounds
  categoryBg: Record<string, readonly [string, string, string]>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHT THEME
// ═══════════════════════════════════════════════════════════════════════════════

export const LightColors: ColorScheme = {
  background: '#F2F5F9',
  foreground: '#19233A',
  card: '#F5F8FB',
  cardForeground: '#19233A',
  primary: '#3478F6',
  primaryForeground: '#FFFFFF',
  secondary: '#E3E8F0',
  secondaryForeground: '#2A3550',
  muted: '#E6EAEF',
  mutedForeground: '#6D7586',
  accent: '#0EA5E9',
  accentForeground: '#FFFFFF',
  destructive: '#EF4444',
  destructiveForeground: '#FAFAFA',
  border: '#D5DCE5',
  input: '#D5DCE5',
  ring: '#3478F6',

  overlay: {
    white5: 'rgba(255,255,255,0.05)',
    white10: 'rgba(255,255,255,0.10)',
    white12: 'rgba(255,255,255,0.12)',
    white15: 'rgba(255,255,255,0.15)',
    white20: 'rgba(255,255,255,0.20)',
    white25: 'rgba(255,255,255,0.25)',
    white50: 'rgba(255,255,255,0.50)',
    white70: 'rgba(255,255,255,0.70)',
    white80: 'rgba(255,255,255,0.80)',
    white90: 'rgba(255,255,255,0.90)',
    white100: 'rgba(255,255,255,1)',
  },

  gradientTop: 'rgba(10,30,60,0.55)',
  gradientMid: 'rgba(15,40,80,0.45)',
  gradientBottom: 'rgba(10,25,55,0.85)',
  cardGradientTop: 'rgba(55,100,170,0.15)',
  cardGradientMid: 'rgba(15,40,80,0.50)',
  cardGradientBottom: 'rgba(10,25,55,0.90)',

  likedBg: 'rgba(230,80,80,0.30)',
  likedText: 'rgba(255,120,120,1)',
  likedShadow: 'rgba(230,80,80,0.20)',

  categoryBg: {
    'Self-Love': ['#E8367C', '#BE185D', '#9D174D'],
    'Gratitude': ['#F59E0B', '#D97706', '#B45309'],
    'Confidence': ['#3B82F6', '#2563EB', '#1D4ED8'],
    'Calm': ['#06B6D4', '#0891B2', '#0E7490'],
    'Motivation': ['#8B5CF6', '#7C3AED', '#6D28D9'],
    'Positivity': ['#10B981', '#059669', '#047857'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DARK THEME (from CSS .dark variables)
// ═══════════════════════════════════════════════════════════════════════════════

export const DarkColors: ColorScheme = {
  background: '#0D1320',
  foreground: '#E3E9F0',
  card: '#151D2B',
  cardForeground: '#E3E9F0',
  primary: '#4B8DF8',
  primaryForeground: '#FFFFFF',
  secondary: '#212A38',
  secondaryForeground: '#C2CDD9',
  muted: '#1E2530',
  mutedForeground: '#7B8594',
  accent: '#14B8E8',
  accentForeground: '#FFFFFF',
  destructive: '#DC2626',
  destructiveForeground: '#FAFAFA',
  border: '#28303D',
  input: '#28303D',
  ring: '#4B8DF8',

  overlay: {
    white5: 'rgba(255,255,255,0.05)',
    white10: 'rgba(255,255,255,0.10)',
    white12: 'rgba(255,255,255,0.12)',
    white15: 'rgba(255,255,255,0.15)',
    white20: 'rgba(255,255,255,0.20)',
    white25: 'rgba(255,255,255,0.25)',
    white50: 'rgba(255,255,255,0.50)',
    white70: 'rgba(255,255,255,0.70)',
    white80: 'rgba(255,255,255,0.80)',
    white90: 'rgba(255,255,255,0.90)',
    white100: 'rgba(255,255,255,1)',
  },

  gradientTop: 'rgba(10,30,60,0.55)',
  gradientMid: 'rgba(15,40,80,0.45)',
  gradientBottom: 'rgba(10,25,55,0.85)',
  cardGradientTop: 'rgba(55,100,170,0.15)',
  cardGradientMid: 'rgba(15,40,80,0.50)',
  cardGradientBottom: 'rgba(10,25,55,0.90)',

  likedBg: 'rgba(230,80,80,0.30)',
  likedText: 'rgba(255,120,120,1)',
  likedShadow: 'rgba(230,80,80,0.20)',

  categoryBg: {
    'Self-Love': ['#E8367C', '#BE185D', '#9D174D'],
    'Gratitude': ['#F59E0B', '#D97706', '#B45309'],
    'Confidence': ['#3B82F6', '#2563EB', '#1D4ED8'],
    'Calm': ['#06B6D4', '#0891B2', '#0E7490'],
    'Motivation': ['#8B5CF6', '#7C3AED', '#6D28D9'],
    'Positivity': ['#10B981', '#059669', '#047857'],
  },
};

/** Legacy export for non-themed contexts (onboarding) */
export const Colors = LightColors;

export const Fonts = {
  sans: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  serif: {
    regular: 'PlayfairDisplay_400Regular',
    medium: 'PlayfairDisplay_500Medium',
    semibold: 'PlayfairDisplay_600SemiBold',
    bold: 'PlayfairDisplay_700Bold',
  },
};
