-- Hosted overlay storage: /o/{id} renders overlays.json with overlays.theme
create table if not exists public.overlays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  json jsonb not null,
  theme text not null default 'neon',
  created_at timestamptz not null default now()
);

alter table public.overlays enable row level security;

-- Anyone can read an overlay (public browser-source URLs)
create policy "public read" on public.overlays
  for select using (true);

-- Anyone can create an overlay (no-auth export flow for the makeathon)
create policy "public insert" on public.overlays
  for insert with check (true);
