alter table waitlist_entries
  add column confirmed_at timestamptz,
  add column last_reply text;
