// ═══════════════════════════════════════════════════════════════════════════════
// DATA & TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type Screen = 'home' | 'favorites' | 'settings';

export interface Affirmation {
  id: string;
  text: string;
  category: string;
  image: string;
}

// Beautiful stock photos mapped to each category
export const categoryImages: Record<string, string> = {
  'Self-Love':
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80',
  'Gratitude':
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80',
  'Confidence':
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
  'Calm':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
  'Motivation':
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80',
  'Positivity':
    'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80',
};

export interface CategoryDef {
  name: string;
  icon: string; // Lucide icon name
  enabled: boolean;
}

// Onboarding category option with description
export interface CategoryOption {
  name: string;
  icon: string;
  description: string;
  image: string;
}

export const onboardingCategories: CategoryOption[] = [
  { name: 'Self-Love', icon: 'Heart', description: 'Embrace who you are', image: categoryImages['Self-Love'] },
  { name: 'Gratitude', icon: 'Compass', description: "Appreciate life's gifts", image: categoryImages['Gratitude'] },
  { name: 'Confidence', icon: 'ShieldCheck', description: 'Believe in yourself', image: categoryImages['Confidence'] },
  { name: 'Calm', icon: 'Waves', description: 'Find inner peace', image: categoryImages['Calm'] },
  { name: 'Motivation', icon: 'TrendingUp', description: 'Fuel your drive', image: categoryImages['Motivation'] },
  { name: 'Positivity', icon: 'Sparkles', description: 'Radiate good energy', image: categoryImages['Positivity'] },
];

// Hero image for onboarding welcome & ready screens
export const onboardingHeroImage =
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80';

// ═══════════════════════════════════════════════════════════════════════════════
// FULL AFFIRMATION POOL (60 — used as offline fallback)
// ═══════════════════════════════════════════════════════════════════════════════

export const allAffirmations: Affirmation[] = [
  // ── Self-Love ──
  { id: 'sl-01', text: 'I am worthy of love, success, and all the beautiful things life has to offer.', category: 'Self-Love', image: categoryImages['Self-Love'] },
  { id: 'sl-02', text: 'I am enough, just as I am. I do not need to prove my worth to anyone.', category: 'Self-Love', image: categoryImages['Self-Love'] },
  { id: 'sl-03', text: 'I honor my body, my mind, and my spirit with love and kindness.', category: 'Self-Love', image: categoryImages['Self-Love'] },
  { id: 'sl-04', text: 'I deserve all the good things that are coming my way.', category: 'Self-Love', image: categoryImages['Self-Love'] },
  { id: 'sl-05', text: 'I love and accept myself unconditionally, flaws and all.', category: 'Self-Love', image: categoryImages['Self-Love'] },
  { id: 'sl-06', text: "My self-worth is not determined by others' opinions of me.", category: 'Self-Love', image: categoryImages['Self-Love'] },
  { id: 'sl-07', text: 'I am beautiful inside and out, and I celebrate my uniqueness.', category: 'Self-Love', image: categoryImages['Self-Love'] },
  { id: 'sl-08', text: 'I choose to speak to myself with compassion and understanding.', category: 'Self-Love', image: categoryImages['Self-Love'] },
  { id: 'sl-09', text: "I am proud of how far I've come and excited about where I'm going.", category: 'Self-Love', image: categoryImages['Self-Love'] },
  { id: 'sl-10', text: 'I forgive myself for past mistakes and embrace my growth with open arms.', category: 'Self-Love', image: categoryImages['Self-Love'] },

  // ── Gratitude ──
  { id: 'gr-01', text: 'Today I choose joy, gratitude, and inner peace. I release all that no longer serves me.', category: 'Gratitude', image: categoryImages['Gratitude'] },
  { id: 'gr-02', text: 'I am grateful for the abundance that flows into my life every single day.', category: 'Gratitude', image: categoryImages['Gratitude'] },
  { id: 'gr-03', text: 'I appreciate the small moments that make life truly beautiful.', category: 'Gratitude', image: categoryImages['Gratitude'] },
  { id: 'gr-04', text: 'My heart overflows with thankfulness for every blessing in my life.', category: 'Gratitude', image: categoryImages['Gratitude'] },
  { id: 'gr-05', text: 'I am thankful for the lessons that challenges have taught me.', category: 'Gratitude', image: categoryImages['Gratitude'] },
  { id: 'gr-06', text: 'Gratitude transforms my perspective and opens doors to new possibilities.', category: 'Gratitude', image: categoryImages['Gratitude'] },
  { id: 'gr-07', text: 'I notice and celebrate the beauty in everyday moments.', category: 'Gratitude', image: categoryImages['Gratitude'] },
  { id: 'gr-08', text: 'I am grateful for the people who love and support me unconditionally.', category: 'Gratitude', image: categoryImages['Gratitude'] },
  { id: 'gr-09', text: 'Each breath I take is a gift, and I receive it with deep gratitude.', category: 'Gratitude', image: categoryImages['Gratitude'] },
  { id: 'gr-10', text: 'I choose to focus on what I have rather than what I lack.', category: 'Gratitude', image: categoryImages['Gratitude'] },

  // ── Confidence ──
  { id: 'co-01', text: 'My potential is limitless. I trust the journey and embrace every step forward.', category: 'Confidence', image: categoryImages['Confidence'] },
  { id: 'co-02', text: 'I have the power to create change and make a difference in the world.', category: 'Confidence', image: categoryImages['Confidence'] },
  { id: 'co-03', text: 'I believe in my abilities and trust every decision I make.', category: 'Confidence', image: categoryImages['Confidence'] },
  { id: 'co-04', text: 'I am bold, courageous, and capable of achieving anything I set my mind to.', category: 'Confidence', image: categoryImages['Confidence'] },
  { id: 'co-05', text: 'My voice matters, and I speak my truth with confidence and grace.', category: 'Confidence', image: categoryImages['Confidence'] },
  { id: 'co-06', text: 'I step outside my comfort zone because that is where growth happens.', category: 'Confidence', image: categoryImages['Confidence'] },
  { id: 'co-07', text: 'I am a leader in my own life, making choices that align with my values.', category: 'Confidence', image: categoryImages['Confidence'] },
  { id: 'co-08', text: 'I trust myself to handle whatever life brings my way.', category: 'Confidence', image: categoryImages['Confidence'] },
  { id: 'co-09', text: 'I radiate confidence, and others are inspired by my authenticity.', category: 'Confidence', image: categoryImages['Confidence'] },
  { id: 'co-10', text: 'Every day I become more confident in who I am and what I offer the world.', category: 'Confidence', image: categoryImages['Confidence'] },

  // ── Calm ──
  { id: 'ca-01', text: 'I choose peace over worry. My mind is calm, and my heart is at ease.', category: 'Calm', image: categoryImages['Calm'] },
  { id: 'ca-02', text: 'I release tension from my body and invite stillness into my being.', category: 'Calm', image: categoryImages['Calm'] },
  { id: 'ca-03', text: 'I am at peace with what I cannot control and empowered by what I can.', category: 'Calm', image: categoryImages['Calm'] },
  { id: 'ca-04', text: 'My breath anchors me to the present moment, where all is well.', category: 'Calm', image: categoryImages['Calm'] },
  { id: 'ca-05', text: 'I give myself permission to slow down and simply be.', category: 'Calm', image: categoryImages['Calm'] },
  { id: 'ca-06', text: 'Tranquility flows through me like a gentle stream.', category: 'Calm', image: categoryImages['Calm'] },
  { id: 'ca-07', text: 'I let go of anxiety and welcome serenity into every moment.', category: 'Calm', image: categoryImages['Calm'] },
  { id: 'ca-08', text: 'My mind is a sanctuary of peace and positive thoughts.', category: 'Calm', image: categoryImages['Calm'] },
  { id: 'ca-09', text: 'I am safe, I am grounded, and I am at peace with this moment.', category: 'Calm', image: categoryImages['Calm'] },
  { id: 'ca-10', text: 'I choose calm over chaos and stillness over stress.', category: 'Calm', image: categoryImages['Calm'] },

  // ── Motivation ──
  { id: 'mo-01', text: 'I am becoming the best version of myself, one day at a time.', category: 'Motivation', image: categoryImages['Motivation'] },
  { id: 'mo-02', text: 'Every challenge is an opportunity to grow stronger and wiser.', category: 'Motivation', image: categoryImages['Motivation'] },
  { id: 'mo-03', text: 'I have the discipline and determination to achieve my goals.', category: 'Motivation', image: categoryImages['Motivation'] },
  { id: 'mo-04', text: 'Today I take one step closer to the life I dream of.', category: 'Motivation', image: categoryImages['Motivation'] },
  { id: 'mo-05', text: 'I am unstoppable when I believe in my purpose.', category: 'Motivation', image: categoryImages['Motivation'] },
  { id: 'mo-06', text: 'My setbacks are setups for even greater comebacks.', category: 'Motivation', image: categoryImages['Motivation'] },
  { id: 'mo-07', text: 'I wake up each day with drive, passion, and purpose.', category: 'Motivation', image: categoryImages['Motivation'] },
  { id: 'mo-08', text: 'I am committed to my growth and celebrate every small victory.', category: 'Motivation', image: categoryImages['Motivation'] },
  { id: 'mo-09', text: 'The only limit to my success is the one I set for myself.', category: 'Motivation', image: categoryImages['Motivation'] },
  { id: 'mo-10', text: 'I transform obstacles into stepping stones on the path to greatness.', category: 'Motivation', image: categoryImages['Motivation'] },

  // ── Positivity ──
  { id: 'po-01', text: 'I radiate positivity and attract wonderful things into my life.', category: 'Positivity', image: categoryImages['Positivity'] },
  { id: 'po-02', text: 'I choose to see the good in every situation and every person I meet.', category: 'Positivity', image: categoryImages['Positivity'] },
  { id: 'po-03', text: 'My positive energy creates a ripple effect that touches everyone around me.', category: 'Positivity', image: categoryImages['Positivity'] },
  { id: 'po-04', text: 'I am a magnet for miracles, abundance, and good fortune.', category: 'Positivity', image: categoryImages['Positivity'] },
  { id: 'po-05', text: 'Today is full of possibilities, and I embrace each one with an open heart.', category: 'Positivity', image: categoryImages['Positivity'] },
  { id: 'po-06', text: 'I fill my mind with positive thoughts and my life with positive people.', category: 'Positivity', image: categoryImages['Positivity'] },
  { id: 'po-07', text: 'Joy is my birthright, and I claim it fully today.', category: 'Positivity', image: categoryImages['Positivity'] },
  { id: 'po-08', text: 'I see beauty and possibility where others see obstacles.', category: 'Positivity', image: categoryImages['Positivity'] },
  { id: 'po-09', text: 'My smile lights up the world and makes every day a little brighter.', category: 'Positivity', image: categoryImages['Positivity'] },
  { id: 'po-10', text: 'I choose happiness, and I create it in every single moment.', category: 'Positivity', image: categoryImages['Positivity'] },
];

export const defaultCategories: CategoryDef[] = [
  { name: 'Self-Love', icon: 'Heart', enabled: true },
  { name: 'Gratitude', icon: 'Compass', enabled: true },
  { name: 'Confidence', icon: 'ShieldCheck', enabled: true },
  { name: 'Calm', icon: 'Waves', enabled: true },
  { name: 'Motivation', icon: 'TrendingUp', enabled: true },
  { name: 'Positivity', icon: 'Sparkles', enabled: true },
];
