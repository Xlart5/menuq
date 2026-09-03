-- Migración v4: registro y aprobación de personal (meseros).

create table if not exists public.personales (
  id text primary key,
  nombre text not null,
  pin text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado')),
  created_at timestamptz not null default now()
);

alter table public.personales enable row level security;

create policy "lectura personal" on public.personales for select using (true);
create policy "escritura personal" on public.personales for all using (true) with check (true);

-- Cuenta demo ya aprobada (para que el flujo funcione de una):
insert into public.personales (id, nombre, pin, estado, created_at) values
  ('demo-brayan', 'Brayan', '1234', 'aprobado', now())
on conflict (id) do nothing;
