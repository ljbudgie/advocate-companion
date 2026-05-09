create table public.email_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message_id text not null unique,
  sender_address text not null,
  original_subject text not null default '',
  original_body text not null default '',
  generated_response text not null default '',
  status text not null default 'pending' check (status in ('pending', 'sent', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.email_drafts enable row level security;
