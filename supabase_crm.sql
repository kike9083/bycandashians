
-- LEADS TABLE FOR CRM
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text,
  phone text,
  service text,
  event_date date,
  message text,
  status text default 'New' check (status in ('New', 'Contacted', 'Booked', 'Lost'))
);

-- Enable RLS
alter table public.leads enable row level security;

-- Policies for leads
-- Allow anyone (public form) to insert
create policy "Enable insert for all users"
on public.leads for insert
with check (true);

-- Allow admins (authenticated) to do everything
create policy "Enable all access for authenticated users"
on public.leads for all
to authenticated
using (true)
with check (true);
