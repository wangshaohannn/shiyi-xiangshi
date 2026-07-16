-- Supabase initialization for the Shiyi Xiangshi site.
-- Run this once in Supabase SQL Editor before deploying with SUPABASE_SERVICE_ROLE_KEY.

create table if not exists public.site_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_state_updated_at_idx
  on public.site_state (updated_at desc);

create or replace function public.set_site_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_state_updated_at on public.site_state;

create trigger set_site_state_updated_at
before update on public.site_state
for each row
execute function public.set_site_state_updated_at();

alter table public.site_state enable row level security;

drop policy if exists "site_state_service_role_all" on public.site_state;

create policy "site_state_service_role_all"
on public.site_state
for all
to service_role
using (true)
with check (true);
