# Roadmap — MenuQ (restaurante de lujo, 3D interactivo)

Plan de ingeniería para convertir la demo en un producto instalable comparable a soluciones premium.
Ordenado por fases con entregables y criterios de "listo".

## ✅ Fase 1 — Demo funcional (hecha)

- Landing del restaurante (nosotros, menú, galería, reseñas, contacto)
- App móvil de pedidos por mesa (QR → menú → pedido → estado)
- Panel admin (platos, categorías, mesas/QR, pedidos, reseñas)
- Verificado: builds estáticos, typecheck y lint en las 3 apps

## 🔨 Fase 2 — Capa 3D interactiva (en curso)

Objetivo: experiencia de lujo que el cliente diga "esto lo quiero".

- [x] Hero 3D interactivo (Three.js + React Three Fiber + drei): plato en pedestal
      dorado, rotación automática, órbita con arrastre, partículas doradas.
- [x] Sección "Menú 3D interactivo": selectores de plato con vista 3D rotable.
- [x] Modelos 3D procedurales (PBR) para los 12 platos: burgers con sésamo,
      pizza con pepperoni/basílico, costillas en plato, lomo saltado, nachos,
      porciones de torta/cheesecake, bebidas con hielo y pajilla, palitos.
      Sin dependencias externas ni licencias (todo generado en código).
- [x] Materiales PBR + iluminación de ambiente generada localmente
      (Lightformers dentro de Environment, sin descargas de red).
- [ ] Opcional: sustituir modelos procedurales por escaneos/GLTF premium (Asset
      Library) si el cliente tiene presupuesto para modelos escaneados.
- [ ] Bloom post-procesamiento (postprocessing) para brillo dorado.
- [ ] Scroll narrativo: la escena reacciona al scroll de la landing.
- [ ] Clientes primerizos: reducir bundle 3D (lazy + code split ya hecho).
- [ ] 3D en la app móvil (React Three Fiber + expo-gl) para el detalle del plato.
- [ ] Modo reducido/2D automático para dispositivos lentos (baja dpr).

## · Fase 3 — Producto vendible (multi-restaurante)

- Panel admin por restaurante con login real (Supabase Auth)
- Subdominio personalizado por restaurante (multi-tenancy con tenant_id en RLS)
- Checkout simple: pagar con link (Yape/Plin/Stripe según país)
- Facturación del SaaS (Stripe Billing) + planes y cancelación
- Dashboard con métricas por hora/producto/sucursal

## · Fase 4 — Despliegue profesional

- [x] Vercel: landing + admin + web de la app desplegados en producción
      (menuq-landing / menuq-admin / menuq-app-mobile .vercel.app)
- [ ] GitHub: repo remoto + GitHub Actions (lint/builds automáticos en cada push)
- [ ] Recomendar Vercel: autorizar "vercel integration" para auto-deploy desde Git
- [ ] Expo EAS: builds de Android/iOS para tienda (Play Store / App Store)
- [ ] Dominio propio (ej. elbuensabor.com) para el QR real de producción
- [ ] Supabase en producción + backups + monitoreo (uptime)

## · Fase 5 — Seguridad y pulido

- RLS real (data por tenant, roles mesero/admin)
- Rate limiting en API, sanitización de inputs, HTTPS obligatorio
- Accesibilidad (controles 3D teclado/voice), SEO y métricas (ébertura/performance)
- Analytics básico (Plausible/GA4), registro de ventas y notificaciones al local

## Checklist de presentación al cliente (día de la demo)

1. `landing`: hero 3D con el plato insignia del restaurante (rotarlo con el mouse)
2. `panel`: crear la mesa → descargar QR → imprimir
3. Escanear QR con el teléfono → pedir → ver estado en "Pedidos"
4. Cambiar un plato en el panel → reaparece al instante en la app (con Supabase)
5. Cerrar con: precios y plan mensual
