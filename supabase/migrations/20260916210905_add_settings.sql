create table if not exists settings (
  key text primary key,
  value text not null
);

alter table settings enable row level security;

insert into settings (key, value)
values (
  'notify_message_template',
  'Hi {name}, your table for {party_size} is ready! Reply to let us know you''re on your way, and head to the host stand.'
)
on conflict (key) do nothing;
