-- Migración v3: asignación de mesas al mesero.

create table if not exists public.asignaciones (
  id text primary key,
  mesa int not null,
  mesero text not null default '',
  estado text not null default 'asignada' check (estado in ('asignada','libre')),
  created_at timestamptz not null default now()
);

alter table public.asignaciones enable row level security;

create policy "lectura pública asignaciones" on public.asignaciones for select using (true);
create policy "escritura asignaciones" on public.asignaciones for all using (true) with check (true);
