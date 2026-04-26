create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tournament_id text not null,
  tournament_name text not null,
  category_id text not null,
  category_name text not null,
  player_name text not null,
  email text not null,
  phone text not null,
  partner_name text,
  team_name text,
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  amount_total integer,
  currency text,
  payment_status text not null,
  raw_event jsonb
);

create index if not exists registrations_tournament_category_idx
  on public.registrations (tournament_id, category_id);

create index if not exists registrations_email_idx
  on public.registrations (email);

alter table public.registrations enable row level security;

-- The app writes from the server using the Supabase service role key.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY in browser code.
