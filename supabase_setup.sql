-- POLICY SETUP FOR SERVICES TABLE
-- Run this in the Supabase SQL Editor to ensure permissions are correct

-- 1. Create table if it doesn't exist
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  icon_name text,
  cta text,
  image text,
  image_fit text default 'cover',
  image_position text default 'center',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.services enable row level security;

-- 3. Policies
-- Allow everyone to read
create policy "Enable read access for all users"
on public.services for select
using (true);

-- Allow authenticated (logged in) users to insert
create policy "Enable insert for authenticated users"
on public.services for insert
to authenticated
with check (true);

-- Allow authenticated users to update
create policy "Enable update for authenticated users"
on public.services for update
to authenticated
using (true)
with check (true);

-- Allow authenticated users to delete
create policy "Enable delete for authenticated users"
on public.services for delete
to authenticated
using (true);
