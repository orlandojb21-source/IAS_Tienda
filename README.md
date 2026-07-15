# IAS Tienda — App genérica de ventas

Producto de licencia anual de **Innova App Solutions**: una app de punto de
venta / inventario / clientes lista para usar, pensada para negocios que
venden cualquier tipo de artículo y no tienen presupuesto para una app
personalizada. Es la primera de 3 apps genéricas (tienda, citas, restaurantes).

## Stack

- **Frontend**: Next.js (App Router, TypeScript, Tailwind CSS), desplegado en
  Vercel.
- **Base de datos**: Supabase (Postgres) — pendiente de configurar. Reemplaza
  el patrón de Google Sheets usado en los proyectos personalizados anteriores,
  porque esta app debe soportar **muchos negocios distintos usando la misma
  app a la vez**, cada uno viendo solo su propia información.
- **Auth**: por definir (probablemente login con Google, igual que en
  proyectos anteriores).

## Primeros pasos

```bash
npm install
npm run dev
```

## Estructura

```
assets/logo/      Logo original en alta resolución (Innova App Solutions)
public/           Archivos estáticos servidos por la web, incluye logo.png
src/app/          Rutas (App Router)
```
