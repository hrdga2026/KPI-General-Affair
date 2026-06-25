create table if not exists public.kpi_app_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.kpi_app_state enable row level security;

create policy "Public KPI read"
on public.kpi_app_state for select
to anon
using (true);

create policy "Public KPI insert"
on public.kpi_app_state for insert
to anon
with check (true);

create policy "Public KPI update"
on public.kpi_app_state for update
to anon
using (true)
with check (true);
