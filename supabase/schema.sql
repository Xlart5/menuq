-- Schema de MenuQ: menú digital con pedidos por mesa
-- Ejecuta este archivo en Supabase -> SQL Editor (o en tu CLI Supabase).

create table if not exists public.categories (
  id text primary key,
  name text not null,
  emoji text not null default '🍽️',
  sort_order int not null default 0
);

create table if not exists public.dishes (
  id text primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  emoji text not null default '🍽️',
  category_id text not null references public.categories(id) on delete cascade,
  popular boolean not null default false
);

create table if not exists public.mesas (
  numero int primary key
);

create table if not exists public.orders (
  id text primary key,
  mesa int not null,
  items jsonb not null default '[]'::jsonb,
  total numeric(10, 2) not null default 0,
  estado text not null default 'enviado', -- enviado | en_preparacion | entregado
  created_at timestamptz not null default now()
);

create table if not exists public.resenas (
  id text primary key,
  autor text not null,
  rating int not null check (rating between 1 and 5),
  texto text not null,
  created_at timestamptz not null default now()
);

-- Acceso de demostración: lectura pública para clientes; escritura abierta
-- para el panel (en producción se reemplaza por autenticación del restaurante).
alter table public.categories enable row level security;
alter table public.dishes enable row level security;
alter table public.mesas enable row level security;
alter table public.orders enable row level security;
alter table public.resenas enable row level security;

create policy "lectura pública categorías" on public.categories for select using (true);
create policy "lectura pública platos" on public.dishes for select using (true);
create policy "lectura pública mesas" on public.mesas for select using (true);
create policy "lectura pública pedidos" on public.orders for select using (true);
create policy "escritura demo pedidos" on public.orders for all using (true) with check (true);
create policy "lectura pública reseñas" on public.resenas for select using (true);
create policy "escritura demo reseñas" on public.resenas for all using (true) with check (true);
