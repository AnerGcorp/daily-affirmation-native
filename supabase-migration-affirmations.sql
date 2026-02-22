-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration: Expand affirmation pool to 60 (10 per category)
-- Run AFTER supabase-schema.sql (which creates the categories + affirmations tables)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Clear existing seed data so we can re-insert cleanly
delete from public.affirmations;

insert into public.affirmations (id, text, category, image_url) values

-- ─── Self-Love (10) ─────────────────────────────────────────────────────────
('sl-01', 'I am worthy of love, success, and all the beautiful things life has to offer.',                     'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
('sl-02', 'I am enough, just as I am. I do not need to prove my worth to anyone.',                            'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
('sl-03', 'I honor my body, my mind, and my spirit with love and kindness.',                                  'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
('sl-04', 'I deserve all the good things that are coming my way.',                                            'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
('sl-05', 'I love and accept myself unconditionally, flaws and all.',                                         'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
('sl-06', 'My self-worth is not determined by others'' opinions of me.',                                      'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
('sl-07', 'I am beautiful inside and out, and I celebrate my uniqueness.',                                    'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
('sl-08', 'I choose to speak to myself with compassion and understanding.',                                   'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
('sl-09', 'I am proud of how far I''ve come and excited about where I''m going.',                             'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
('sl-10', 'I forgive myself for past mistakes and embrace my growth with open arms.',                         'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),

-- ─── Gratitude (10) ─────────────────────────────────────────────────────────
('gr-01', 'Today I choose joy, gratitude, and inner peace. I release all that no longer serves me.',          'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
('gr-02', 'I am grateful for the abundance that flows into my life every single day.',                        'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
('gr-03', 'I appreciate the small moments that make life truly beautiful.',                                   'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
('gr-04', 'My heart overflows with thankfulness for every blessing in my life.',                              'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
('gr-05', 'I am thankful for the lessons that challenges have taught me.',                                    'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
('gr-06', 'Gratitude transforms my perspective and opens doors to new possibilities.',                        'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
('gr-07', 'I notice and celebrate the beauty in everyday moments.',                                           'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
('gr-08', 'I am grateful for the people who love and support me unconditionally.',                            'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
('gr-09', 'Each breath I take is a gift, and I receive it with deep gratitude.',                              'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
('gr-10', 'I choose to focus on what I have rather than what I lack.',                                        'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),

-- ─── Confidence (10) ────────────────────────────────────────────────────────
('co-01', 'My potential is limitless. I trust the journey and embrace every step forward.',                   'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
('co-02', 'I have the power to create change and make a difference in the world.',                            'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
('co-03', 'I believe in my abilities and trust every decision I make.',                                       'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
('co-04', 'I am bold, courageous, and capable of achieving anything I set my mind to.',                       'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
('co-05', 'My voice matters, and I speak my truth with confidence and grace.',                                'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
('co-06', 'I step outside my comfort zone because that is where growth happens.',                             'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
('co-07', 'I am a leader in my own life, making choices that align with my values.',                          'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
('co-08', 'I trust myself to handle whatever life brings my way.',                                            'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
('co-09', 'I radiate confidence, and others are inspired by my authenticity.',                                'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
('co-10', 'Every day I become more confident in who I am and what I offer the world.',                        'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),

-- ─── Calm (10) ──────────────────────────────────────────────────────────────
('ca-01', 'I choose peace over worry. My mind is calm, and my heart is at ease.',                             'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
('ca-02', 'I release tension from my body and invite stillness into my being.',                               'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
('ca-03', 'I am at peace with what I cannot control and empowered by what I can.',                            'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
('ca-04', 'My breath anchors me to the present moment, where all is well.',                                   'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
('ca-05', 'I give myself permission to slow down and simply be.',                                             'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
('ca-06', 'Tranquility flows through me like a gentle stream.',                                               'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
('ca-07', 'I let go of anxiety and welcome serenity into every moment.',                                      'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
('ca-08', 'My mind is a sanctuary of peace and positive thoughts.',                                           'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
('ca-09', 'I am safe, I am grounded, and I am at peace with this moment.',                                    'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
('ca-10', 'I choose calm over chaos and stillness over stress.',                                              'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),

-- ─── Motivation (10) ────────────────────────────────────────────────────────
('mo-01', 'I am becoming the best version of myself, one day at a time.',                                     'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
('mo-02', 'Every challenge is an opportunity to grow stronger and wiser.',                                    'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
('mo-03', 'I have the discipline and determination to achieve my goals.',                                     'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
('mo-04', 'Today I take one step closer to the life I dream of.',                                             'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
('mo-05', 'I am unstoppable when I believe in my purpose.',                                                   'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
('mo-06', 'My setbacks are setups for even greater comebacks.',                                               'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
('mo-07', 'I wake up each day with drive, passion, and purpose.',                                             'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
('mo-08', 'I am committed to my growth and celebrate every small victory.',                                   'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
('mo-09', 'The only limit to my success is the one I set for myself.',                                        'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
('mo-10', 'I transform obstacles into stepping stones on the path to greatness.',                             'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),

-- ─── Positivity (10) ────────────────────────────────────────────────────────
('po-01', 'I radiate positivity and attract wonderful things into my life.',                                  'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
('po-02', 'I choose to see the good in every situation and every person I meet.',                             'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
('po-03', 'My positive energy creates a ripple effect that touches everyone around me.',                      'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
('po-04', 'I am a magnet for miracles, abundance, and good fortune.',                                        'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
('po-05', 'Today is full of possibilities, and I embrace each one with an open heart.',                       'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
('po-06', 'I fill my mind with positive thoughts and my life with positive people.',                          'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
('po-07', 'Joy is my birthright, and I claim it fully today.',                                                'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
('po-08', 'I see beauty and possibility where others see obstacles.',                                         'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
('po-09', 'My smile lights up the world and makes every day a little brighter.',                              'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
('po-10', 'I choose happiness, and I create it in every single moment.',                                      'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80');
