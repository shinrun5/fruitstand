alter table waitlist_entries drop constraint if exists waitlist_entries_status_check;

alter table waitlist_entries
  add constraint waitlist_entries_status_check
  check (status in ('waiting', 'notified', 'seated', 'cancelled', 'no_show'));
