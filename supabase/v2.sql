-- Migración v2: alérgenos, agotados, inventario, recetas, gastos, llamadas, pagos y perfiles de rol.

alter table public.dishes add column if not exists allergens text not null default '';
alter table public.dishes add column if not exists available boolean not null default true;

-- Inventario: insumos
create table if not exists public.items (
  id text primary key,
  name text not null,
  unit text not null default 'unidad',
  stock numeric(12,3) not null default 0,
  min_stock numeric(12,3) not null default 0,
  cost numeric(10,2) not null default 0,
  category text not null default 'Insumos'
);

-- Movimientos de inventario (entrada, salida, merma)
create table if not exists public.movimientos (
  id text primary key,
  item_id text not null references public.items(id) on delete cascade,
  tipo text not null check (tipo in ('entrada','salida','merma')),
  qty numeric(12,3) not null,
  motivo text not null default '',
  created_at timestamptz not null default now()
);

-- Recetas: cuánto insumo lleva cada plato
create table if not exists public.recipes (
  id text primary key,
  dish_id text not null references public.dishes(id) on delete cascade,
  item_id text not null references public.items(id) on delete cascade,
  qty numeric(12,3) not null default 1
);

-- Gastos operativos
create table if not exists public.gastos (
  id text primary key,
  concepto text not null,
  monto numeric(10,2) not null,
  categoria text not null default 'Operación',
  created_at timestamptz not null default now()
);

-- Llamadas de mesa (mesero / cuenta)
create table if not exists public.llamadas (
  id text primary key,
  mesa int not null,
  tipo text not null check (tipo in ('mesero','cuenta')),
  estado text not null default 'nuevo',
  created_at timestamptz not null default now()
);

-- Pagos (efectivo, tarjeta, transferencia, QR Simple)
create table if not exists public.pagos (
  id text primary key,
  pedido_id text,
  mesa int not null,
  metodo text not null check (metodo in ('efectivo','tarjeta','transferencia','qr')),
  monto numeric(10,2) not null,
  propina numeric(10,2) not null default 0,
  cajero text not null default '',
  created_at timestamptz not null default now()
);

-- Perfiles de rol (auth real)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  rol text not null default 'staff' check (rol in ('admin','staff')),
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;
alter table public.movimientos enable row level security;
alter table public.recipes enable row level security;
alter table public.gastos enable row level security;
alter table public.llamadas enable row level security;
alter table public.pagos enable row level security;
alter table public.profiles enable row level security;

-- Lectura pública del menú (clientes) y escritura demo del personal
create policy "lectura pública items" on public.items for select using (true);
create policy "escritura items" on public.items for all using (true) with check (true);
create policy "lectura pública movimientos" on public.movimientos for select using (true);
create policy "escritura movimientos" on public.movimientos for all using (true) with check (true);
create policy "lectura pública recipes" on public.recipes for select using (true);
create policy "escritura recipes" on public.recipes for all using (true) with check (true);
create policy "lectura pública gastos" on public.gastos for select using (true);
create policy "escritura gastos" on public.gastos for all using (true) with check (true);
create policy "lectura pública llamadas" on public.llamadas for select using (true);
create policy "escritura llamadas" on public.llamadas for all using (true) with check (true);
create policy "lectura pública pagos" on public.pagos for select using (true);
create policy "escritura pagos" on public.pagos for all using (true) with check (true);
create policy "lectura perfiles" on public.profiles for select using (true);
create policy "escritura perfiles" on public.profiles for insert with check (true);
