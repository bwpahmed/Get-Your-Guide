create table if not exists public.site_documents (
  key text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_documents enable row level security;

create policy "Public can read site data"
on public.site_documents for select
using (key = 'site');

create policy "Authenticated admins can insert site data"
on public.site_documents for insert
to authenticated
with check (key = 'site');

create policy "Authenticated admins can update site data"
on public.site_documents for update
to authenticated
using (key = 'site')
with check (key = 'site');
