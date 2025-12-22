
-- CONTENT TABLE FOR HISTORY AND OTHER TEXTS
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.site_content enable row level security;

-- Policies for content
create policy "Enable read access for all users"
on public.site_content for select
using (true);

create policy "Enable all access for authenticated users"
on public.site_content for all
to authenticated
using (true)
with check (true);
