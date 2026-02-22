-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration: Daily Check-ins & Streaks
-- Run AFTER the main supabase-schema.sql
-- ═══════════════════════════════════════════════════════════════════════════════


-- ─── 1. Add streak columns to profiles ──────────────────────────────────────

alter table public.profiles
  add column if not exists current_streak  int default 0,
  add column if not exists longest_streak  int default 0,
  add column if not exists last_checkin_date date;


-- ─── 2. Daily check-ins table ───────────────────────────────────────────────

create table if not exists public.daily_checkins (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users on delete cascade not null,
  mood        text not null,
  note        text default '',
  checked_in_date date default current_date,
  created_at  timestamptz default now(),
  unique(user_id, checked_in_date)
);

alter table public.daily_checkins enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own checkins' and tablename = 'daily_checkins') then
    create policy "Users can view own checkins" on public.daily_checkins for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own checkins' and tablename = 'daily_checkins') then
    create policy "Users can insert own checkins" on public.daily_checkins for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own checkins' and tablename = 'daily_checkins') then
    create policy "Users can update own checkins" on public.daily_checkins for update using (auth.uid() = user_id);
  end if;
end $$;


-- ─── 3. Function to compute & update streak on check-in ────────────────────

create or replace function public.update_streak()
returns trigger as $$
declare
  _last_date date;
  _streak int;
  _longest int;
begin
  -- Get current streak info
  select last_checkin_date, current_streak, longest_streak
    into _last_date, _streak, _longest
    from public.profiles
    where id = new.user_id;

  -- If checked in yesterday → increment streak
  if _last_date = new.checked_in_date - interval '1 day' then
    _streak := _streak + 1;
  -- If checked in today already → no change
  elsif _last_date = new.checked_in_date then
    return new;
  -- Otherwise → reset streak to 1
  else
    _streak := 1;
  end if;

  -- Update longest if needed
  if _streak > _longest then
    _longest := _streak;
  end if;

  -- Save back to profile
  update public.profiles
    set current_streak = _streak,
        longest_streak = _longest,
        last_checkin_date = new.checked_in_date,
        updated_at = now()
    where id = new.user_id;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_daily_checkin on public.daily_checkins;
create trigger on_daily_checkin
  after insert on public.daily_checkins
  for each row execute procedure public.update_streak();
