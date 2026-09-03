# MenuQ — Restaurante digital premium (proyecto demo)

Sistema completo para un restaurante (demo: "El Buen Sabor") en 3 piezas,
con **experiencia 3D interactiva** (hero 3D + menú 3D rotable con modelos
PBR creados por código, hecho con Three.js / React Three Fiber).
Ver `ROADMAP.md` para el plan completo.

## 🌍 En línea (demo pública)

| App         | URL                                            |
| ----------- | ---------------------------------------------- |
| Landing     | https://menuq-landing.vercel.app               |
| Panel admin | https://menuq-admin.vercel.app (login demo)    |
| App pedidos | https://menuq-app-mobile.vercel.app            |

> Los QR del panel usan `https://menuq-app-mobile.vercel.app/mesa/N`
> (el QR apunta a la app web; en el celular, en la pestaña "Mesas", el QR
> usa el esquema `menuq://` para la app nativa).

| Carpeta     | Qué es                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------ |
| `landing/`  | **Landing del restaurante**: nosotros, menú, galería, reseñas, contacto (Next.js 16 + TS)  |
| `mobile/`   | **App de pedidos por mesa**: QR por mesa → menú → enviar pedido → seguir estado (Expo + TS)|
| `admin/`    | **Panel administrativo**: menú/platos, categorías, mesas + QRs, pedidos/ventas, reseñas     |
| `supabase/` | Base de datos opcional (PostgreSQL) para compartir datos entre apps                         |

## Cómo correr cada pieza

### Landing del restaurante

```bash
cd landing
npm install
npm run dev        # → http://localhost:3000
```

### App de pedidos (celular)

```bash
cd mobile
npm install
npm run web        # demo rápida en navegador → http://localhost:8081
npm start          # o en tu teléfono: escanea el QR con Expo Go
```

Flujo de demo: en la pestaña **Mesas** toca una mesa (simula escanear su QR) →
elige platos → **Enviar pedido** → mira el estado en la pestaña **Pedidos**.

### Panel administrativo

```bash
cd admin
npm install
npm run dev        # → http://localhost:3001
```

Login demo: cualquier correo/contraseña. Ahí puedes:
- Editar platos y categorías (el menú demo cambia en todas las apps)
- Crear mesas y **descargar/copiar su QR** (apunta a `URL/mesa/N`; configura la URL en "Mesas & QR")
- Registrar ventas manuales, avanzar estados de pedidos
- Publicar reseñas

## Conectar datos en real (Supabase, gratis)

1. Crea un proyecto en https://supabase.com
2. Ejecuta `supabase/schema.sql` y después `supabase/seed.sql` en el SQL Editor
3. **Mobile**: copia `mobile/.env.example` → `mobile/.env` y pega URL + anon key
4. Reinicia la app: el menú se lee desde la base en vez de la demo local

## Tecnología

- **TypeScript** en todo el proyecto
- **Next.js 16 + React** (landing y panel admin)
- **Expo (React Native) + expo-router** (app móvil, corre en Android/iOS/Web)
- **Supabase** (PostgreSQL) opcional — gratis para desarrollo y demo

> Auto-deploy conectado: cada \git push\ publica las 3 apps automaticamente.
