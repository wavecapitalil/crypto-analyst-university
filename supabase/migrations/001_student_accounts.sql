-- Wave Capital Crypto Analyst University
-- Student identity + progress schema
-- Apply through Supabase migrations. Never expose service_role credentials to the browser.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  role text not null default 'student' check (role in ('student','instructor','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.student_progress enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id and role = (select p.role from public.profiles p where p.user_id = auth.uid()));

drop policy if exists "progress_select_own" on public.student_progress;
create policy "progress_select_own"
on public.student_progress for select
using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.student_progress;
create policy "progress_insert_own"
on public.student_progress for insert
with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.student_progress;
create policy "progress_update_own"
on public.student_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists progress_touch_updated_at on public.student_progress;
create trigger progress_touch_updated_at
before update on public.student_progress
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_student()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(user_id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    'student'
  )
  on conflict (user_id) do nothing;

  insert into public.student_progress(user_id, progress)
  values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_wave_student on auth.users;
create trigger on_auth_user_created_wave_student
after insert on auth.users
for each row execute function public.handle_new_student();

revoke all on public.profiles from anon;
revoke all on public.student_progress from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.student_progress to authenticated;
