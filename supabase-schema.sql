-- ═══════════════════════════════════════════════════════════════════════════════
-- Daily Affirmation App – COMPLETE Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
--
-- Tables:
--   1. profiles
--   2. user_preferences
--   3. user_favorites
--   4. categories            ← NEW
--   5. affirmations          ← NEW
--   6. custom_affirmations   ← NEW
--   7. subscriptions         ← NEW
--   8. daily_log             ← NEW
--   9. notification_tokens   ← NEW
--  10. Trigger: auto-create profile & prefs on sign-up
--  11. Seed data (categories + affirmations)
-- ═══════════════════════════════════════════════════════════════════════════════


-- ─── 1. Profiles ────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id                 uuid references auth.users on delete cascade primary key,
  display_name       text        default '',
  avatar_url         text        default '',
  is_premium         boolean     default false,
  premium_expires_at timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

alter table public.profiles enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own profile' and tablename = 'profiles') then
    create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own profile' and tablename = 'profiles') then
    create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own profile' and tablename = 'profiles') then
    create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
  end if;
end $$;


-- ─── 2. User Preferences ───────────────────────────────────────────────────

create table if not exists public.user_preferences (
  user_id          uuid references auth.users on delete cascade primary key,
  categories       jsonb       default '[]'::jsonb,
  reminder_enabled boolean     default true,
  reminder_time    text        default '08:00',
  dark_mode        boolean     default false,
  sound_enabled    boolean     default true,
  updated_at       timestamptz default now()
);

alter table public.user_preferences enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own preferences' and tablename = 'user_preferences') then
    create policy "Users can view own preferences" on public.user_preferences for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own preferences' and tablename = 'user_preferences') then
    create policy "Users can insert own preferences" on public.user_preferences for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own preferences' and tablename = 'user_preferences') then
    create policy "Users can update own preferences" on public.user_preferences for update using (auth.uid() = user_id);
  end if;
end $$;


-- ─── 3. User Favorites ─────────────────────────────────────────────────────

create table if not exists public.user_favorites (
  id              bigint generated always as identity primary key,
  user_id         uuid references auth.users on delete cascade not null,
  affirmation_id  text not null,
  created_at      timestamptz default now(),
  unique(user_id, affirmation_id)
);

alter table public.user_favorites enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own favorites' and tablename = 'user_favorites') then
    create policy "Users can view own favorites" on public.user_favorites for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own favorites' and tablename = 'user_favorites') then
    create policy "Users can insert own favorites" on public.user_favorites for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own favorites' and tablename = 'user_favorites') then
    create policy "Users can delete own favorites" on public.user_favorites for delete using (auth.uid() = user_id);
  end if;
end $$;


-- ─── 4. Categories ──────────────────────────────────────────────────────────
-- Managed from Supabase dashboard. Publicly readable so all users can see them.

create table if not exists public.categories (
  name          text primary key,
  icon          text        not null default 'Sparkles',
  description   text        default '',
  image_url     text        default '',
  display_order int         default 0,
  is_premium    boolean     default false,
  created_at    timestamptz default now()
);

alter table public.categories enable row level security;

-- Anyone (even anon) can read categories
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Public read categories' and tablename = 'categories') then
    create policy "Public read categories" on public.categories for select using (true);
  end if;
end $$;


-- ─── 5. Affirmations ───────────────────────────────────────────────────────
-- Core content. Publicly readable.

create table if not exists public.affirmations (
  id          text primary key,
  text        text not null,
  category    text references public.categories(name) on delete cascade not null,
  image_url   text default '',
  is_premium  boolean default false,
  created_at  timestamptz default now()
);

alter table public.affirmations enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Public read affirmations' and tablename = 'affirmations') then
    create policy "Public read affirmations" on public.affirmations for select using (true);
  end if;
end $$;


-- ─── 6. Custom Affirmations (user-created, premium) ────────────────────────

create table if not exists public.custom_affirmations (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users on delete cascade not null,
  text        text not null,
  category    text references public.categories(name) on delete set null,
  created_at  timestamptz default now()
);

alter table public.custom_affirmations enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own custom affirmations' and tablename = 'custom_affirmations') then
    create policy "Users can view own custom affirmations" on public.custom_affirmations for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own custom affirmations' and tablename = 'custom_affirmations') then
    create policy "Users can insert own custom affirmations" on public.custom_affirmations for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own custom affirmations' and tablename = 'custom_affirmations') then
    create policy "Users can update own custom affirmations" on public.custom_affirmations for update using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own custom affirmations' and tablename = 'custom_affirmations') then
    create policy "Users can delete own custom affirmations" on public.custom_affirmations for delete using (auth.uid() = user_id);
  end if;
end $$;


-- ─── 7. Subscriptions / Payment History ─────────────────────────────────────

create table if not exists public.subscriptions (
  id            bigint generated always as identity primary key,
  user_id       uuid references auth.users on delete cascade not null,
  plan_type     text not null check (plan_type in ('monthly', 'yearly')),
  status        text not null default 'active' check (status in ('active', 'cancelled', 'expired', 'trial')),
  provider      text default 'manual' check (provider in ('manual', 'apple', 'google', 'stripe')),
  started_at    timestamptz default now(),
  expires_at    timestamptz,
  receipt_data  text,
  created_at    timestamptz default now()
);

alter table public.subscriptions enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own subscriptions' and tablename = 'subscriptions') then
    create policy "Users can view own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own subscriptions' and tablename = 'subscriptions') then
    create policy "Users can insert own subscriptions" on public.subscriptions for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own subscriptions' and tablename = 'subscriptions') then
    create policy "Users can update own subscriptions" on public.subscriptions for update using (auth.uid() = user_id);
  end if;
end $$;


-- ─── 8. Daily Log (track which affirmation was shown) ───────────────────────

create table if not exists public.daily_log (
  id              bigint generated always as identity primary key,
  user_id         uuid references auth.users on delete cascade not null,
  affirmation_id  text not null,
  shown_at        date default current_date,
  unique(user_id, affirmation_id, shown_at)
);

alter table public.daily_log enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own daily log' and tablename = 'daily_log') then
    create policy "Users can view own daily log" on public.daily_log for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own daily log' and tablename = 'daily_log') then
    create policy "Users can insert own daily log" on public.daily_log for insert with check (auth.uid() = user_id);
  end if;
end $$;


-- ─── 9. Push Notification Tokens ────────────────────────────────────────────

create table if not exists public.notification_tokens (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users on delete cascade not null,
  token       text not null,
  platform    text not null check (platform in ('ios', 'android', 'web')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(user_id, token)
);

alter table public.notification_tokens enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own tokens' and tablename = 'notification_tokens') then
    create policy "Users can view own tokens" on public.notification_tokens for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own tokens' and tablename = 'notification_tokens') then
    create policy "Users can insert own tokens" on public.notification_tokens for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own tokens' and tablename = 'notification_tokens') then
    create policy "Users can update own tokens" on public.notification_tokens for update using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own tokens' and tablename = 'notification_tokens') then
    create policy "Users can delete own tokens" on public.notification_tokens for delete using (auth.uid() = user_id);
  end if;
end $$;


-- ─── 10. Auto-create profile & preferences on sign-up ──────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''));

  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ═══════════════════════════════════════════════════════════════════════════════
-- 11. SEED DATA – Categories & Affirmations
-- ═══════════════════════════════════════════════════════════════════════════════

-- Categories
insert into public.categories (name, icon, description, image_url, display_order) values
  ('Self-Love',   'Heart',       'Embrace who you are',        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80', 1),
  ('Gratitude',   'Compass',     'Appreciate life''s gifts',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80', 2),
  ('Confidence',  'ShieldCheck', 'Believe in yourself',        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', 3),
  ('Calm',        'Waves',       'Find inner peace',           'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', 4),
  ('Motivation',  'TrendingUp',  'Fuel your drive',            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80', 5),
  ('Positivity',  'Sparkles',    'Radiate good energy',        'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80', 6)
on conflict (name) do nothing;

-- Affirmations
insert into public.affirmations (id, text, category, image_url) values
  ('1',  'I am worthy of love, success, and all the beautiful things life has to offer.',                   'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
  ('2',  'Today I choose joy, gratitude, and inner peace. I release all that no longer serves me.',         'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
  ('3',  'I am becoming the best version of myself, one day at a time.',                                    'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
  ('4',  'My potential is limitless. I trust the journey and embrace every step forward.',                   'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80'),
  ('5',  'I choose peace over worry. My mind is calm, and my heart is at ease.',                            'Calm',        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80'),
  ('6',  'I am enough, just as I am. I do not need to prove my worth to anyone.',                           'Self-Love',   'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=80'),
  ('7',  'I am grateful for the abundance that flows into my life every single day.',                       'Gratitude',   'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80'),
  ('8',  'Every challenge is an opportunity to grow stronger and wiser.',                                   'Motivation',  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80'),
  ('9',  'I radiate positivity and attract wonderful things into my life.',                                 'Positivity',  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=900&q=80'),
  ('10', 'I have the power to create change and make a difference in the world.',                           'Confidence',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80')
on conflict (id) do nothing;
