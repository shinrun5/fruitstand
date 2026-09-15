create table if not exists waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  party_size int not null check (party_size > 0),
  phone text not null,
  status text not null default 'waiting' check (status in ('waiting', 'notified', 'seated', 'cancelled')),
  created_at timestamptz not null default now(),
  notified_at timestamptz
);

create index if not exists waitlist_entries_status_created_at_idx
  on waitlist_entries (status, created_at);

alter table waitlist_entries enable row level security;

-- The app talks to Supabase only through the server-side service role key,
-- so no public policies are defined here. If you later want to hit Supabase
-- directly from the browser, add scoped policies for the anon role instead.
