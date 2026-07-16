-- IAS Tienda — esquema inicial
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar > Run

-- 1. Negocios (cada cliente con licencia es un negocio)
create table negocios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  direccion text,
  logo_url text,
  creado_en timestamptz not null default now()
);

-- 2. Perfiles (une cada usuario que inicia sesion con su negocio y su rol)
create table perfiles (
  id uuid primary key references auth.users (id),
  negocio_id uuid not null references negocios (id),
  nombre text not null,
  rol text not null default 'vendedor' check (rol in ('admin', 'vendedor')),
  creado_en timestamptz not null default now()
);

-- 3. Productos
create table productos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios (id),
  nombre text not null,
  precio numeric(12, 2) not null default 0,
  costo numeric(12, 2) not null default 0,
  stock integer not null default 0,
  stock_minimo integer not null default 0,
  unidad_medida text not null default 'unidad',
  categoria text,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

-- 4. Clientes de la tienda
create table clientes (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios (id),
  nombre text not null,
  telefono text,
  creado_en timestamptz not null default now()
);

-- 5. Ventas (encabezado)
create table ventas (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios (id),
  cliente_id uuid references clientes (id),
  vendedor_id uuid references perfiles (id),
  total numeric(12, 2) not null default 0,
  descuento numeric(12, 2) not null default 0,
  monto_pagado numeric(12, 2) not null default 0,
  metodo_pago text,
  creado_en timestamptz not null default now()
);
-- La deuda de un cliente (fiado) no se guarda como numero aparte: se
-- calcula sumando (total - descuento - monto_pagado) de sus ventas.

-- 6. Detalle de cada venta (que productos y cuantos)
create table venta_items (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios (id),
  venta_id uuid not null references ventas (id),
  producto_id uuid not null references productos (id),
  cantidad integer not null,
  precio_unitario numeric(12, 2) not null
);

-- 7. Gastos
create table gastos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios (id),
  descripcion text not null,
  monto numeric(12, 2) not null,
  categoria text,
  creado_en timestamptz not null default now()
);

-- Funcion de apoyo: a que negocio pertenece el usuario que inicio sesion
create function auth_negocio_id()
returns uuid
language sql
security definer
stable
as $$
  select negocio_id from public.perfiles where id = auth.uid();
$$;

-- Funcion de apoyo: el usuario que inicio sesion es admin de su negocio?
create function auth_es_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.perfiles where id = auth.uid() and rol = 'admin'
  );
$$;

-- Activar seguridad por fila (cada negocio solo ve lo suyo)
alter table negocios enable row level security;
alter table perfiles enable row level security;
alter table productos enable row level security;
alter table clientes enable row level security;
alter table ventas enable row level security;
alter table venta_items enable row level security;
alter table gastos enable row level security;

-- Permisos base: un usuario que inicio sesion puede intentar leer/escribir
-- (las politicas de abajo son las que realmente filtran fila por fila)
grant usage on schema public to authenticated;
grant select, update on negocios to authenticated;
grant select on perfiles to authenticated;
grant select, insert, update, delete on productos, clientes, ventas, venta_items, gastos to authenticated;

-- Politicas: cada usuario solo ve su propio negocio y su propio perfil
create policy "ver mi negocio" on negocios
  for select using (id = auth_negocio_id());

create policy "actualizar mi negocio (solo admin)" on negocios
  for update using (id = auth_negocio_id() and auth_es_admin())
  with check (id = auth_negocio_id() and auth_es_admin());

create policy "ver mi perfil" on perfiles
  for select using (id = auth.uid());

-- Politicas: cada negocio solo ve y modifica sus propios datos
create policy "productos del propio negocio" on productos
  for all using (negocio_id = auth_negocio_id()) with check (negocio_id = auth_negocio_id());

create policy "clientes del propio negocio" on clientes
  for all using (negocio_id = auth_negocio_id()) with check (negocio_id = auth_negocio_id());

create policy "ventas del propio negocio" on ventas
  for all using (negocio_id = auth_negocio_id()) with check (negocio_id = auth_negocio_id());

create policy "venta_items del propio negocio" on venta_items
  for all using (negocio_id = auth_negocio_id()) with check (negocio_id = auth_negocio_id());

create policy "gastos del propio negocio" on gastos
  for all using (negocio_id = auth_negocio_id()) with check (negocio_id = auth_negocio_id());

-- Almacenamiento del logo de cada tienda (bucket publico de solo lectura;
-- cada negocio solo puede subir/editar dentro de su propia carpeta, que
-- se llama igual que su negocio_id)
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "logos del propio negocio" on storage.objects
  for all to authenticated
  using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth_negocio_id()::text)
  with check (bucket_id = 'logos' and (storage.foldername(name))[1] = auth_negocio_id()::text);
