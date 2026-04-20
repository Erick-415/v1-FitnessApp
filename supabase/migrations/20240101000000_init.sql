-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User role enum
create type public.user_role as enum ('client', 'trainer');

-- Profiles table (extends auth.users)
create table public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  role         public.user_role not null,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Prevent users from changing their own role after creation
create policy "Users cannot change their role"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (role = (select role from public.profiles where id = auth.uid()));

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    (new.raw_user_meta_data->>'role')::public.user_role,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
