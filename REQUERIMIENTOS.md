# Requerimientos Funcionales — Sistema "La Estancia" (MenuQ)

> Criterio: **RF-x** = requerimiento funcional. Estado: ✅ hecho · 🔌 pendiente/siguiente fase.

---

## 1. App del cliente (menú digital por QR)

| ID | Requerimiento | Estado |
| -- | ------------- | ------ |
| RF-01 | El cliente escanea el QR de su mesa y abre **directo el menú de esa mesa** | ✅ |
| RF-02 | Menú agrupado por categorías con chips de filtro | ✅ |
| RF-03 | **Búsqueda** de platos (nombre/descripción) | ✅ |
| RF-04 | Detalle del plato: **foto profesional**, descripción, precio, cantidad | ✅ |
| RF-05 | Carrito con totales y envío del pedido a la mesa | ✅ |
| RF-06 | "Mi pedido" **en vivo**: los estados solo cambian cuando la cocina los marca | ✅ |
| RF-07 | Separación de pedidos por mesa (esta visita = esta mesa) | ✅ |
| RF-08 | **Reseña** con estrellas → se publica en la web del restaurante | ✅ |
| RF-09 | Botón "volver al menú para pedir más" | ✅ |
| RF-10 | 🔌 Etiquetas de **alérgenos** (gluten, lactosa…) por plato | 🔌 |
| RF-11 | 🔌 Extras y personalizaciones (término de la carne, agregados, sin cebolla) | 🔌 |
| RF-12 | 🔌 **Especiales del día / promociones** con horario y stock limitado | 🔌 |
| RF-13 | 🔌 "Llamar al mesero" desde la mesa | 🔌 |
| RF-14 | 🔌 **Pedir la cuenta** directamente (solicitud de cierre) | 🔌 |
| RF-15 | 🔌 **Pago desde el celular** (Yape/Plin, link de pago, tarjeta) | 🔌 |
| RF-16 | 🔌 Notificaciones push: "tu pedido está en camino" | 🔌 |
| RF-17 | 🔌 Frecuentes: cuenta de cliente, historial, favoritos, puntos | 🔌 |
| RF-18 | 🔌 Multidioma (español/inglés) | 🔌 |
| RF-19 | 🔌 Accesibilidad: fuentes grandes, alto contraste | 🔌 |
| RF-20 | 🔌 Ticket/comprobante digital del pedido | 🔌 |

## 2. Pantalla de Cocina

| ID | Requerimiento | Estado |
| -- | ------------- | ------ |
| RF-21 | Cola de pedidos **pendientes** (nuevo → cocinando → servido) | ✅ |
| RF-22 | El estado solo lo marca el personal (nada se simula) | ✅ |
| RF-23 | 🔌 Alertas de tiempo: pedido que pasa X min sin atenderse | 🔌 |
| RF-24 | 🔌 Perfiles por estación (parrilla, postres, bar) | 🔌 |
| RF-25 | 🔌 **Marcar plato agotado** → desaparece del menú del cliente al instante | 🔌 |
| RF-26 | 🔌 Pedidos priorizados (mesa VIP / cumpleaños) | 🔌 |

## 3. Panel de administración

| ID | Requerimiento | Estado |
| -- | ------------- | ------ |
| RF-27 | Dashboard: ventas de hoy, pedidos activos, ticket promedio | ✅ |
| RF-28 | Pedidos: avanzar estados, registrar venta manual | ✅ |
| RF-29 | **Cocina** en el panel | ✅ |
| RF-30 | **Reportes** diario/semana/mes/histórico + **CSV** | ✅ |
| RF-31 | CRUD de platos y categorías (afecta a todas las apps al instante) | ✅ |
| RF-32 | Mesas: crear/eliminar + **QR descargable** | ✅ |
| RF-33 | Reseñas: publicar y moderar | ✅ |
| RF-34 | 🔌 **Roles y permisos** (admin, cajero, cocina, mesero) | 🔌 |
| RF-35 | 🔌 Multi-sucursal (varios locales por cuenta) | 🔌 |
| RF-36 | 🔌 Registro de auditoría (quién cambió qué y cuándo) | 🔌 |
| RF-37 | 🔌 Backup y exportación total | 🔌 |

## 4. Gestión — Inventario

| ID | Requerimiento |
| -- | ------------- |
| RF-38 | Catálogo de insumos: nombre, categoría, **unidad de medida**, proveedor, costo, stock actual y **stock mínimo** |
| RF-39 | **Recetas por plato**: insumos + cantidades (ej. ojo de bife = 400g ancho + 5g chimichurri) |
| RF-40 | Movimientos: entradas (compras), salidas (ventas automáticas por orden), **mermas** |
| RF-41 | **Alertas de stock bajo** (semáforo rojo/amarillo) |
| RF-42 | Inventario cíclico / **conteo físico** con ajustes |
| RF-43 | **Costo por plato** calculado desde recetas → margen real |
| RF-44 | Reporte de **mermas** (qué se perdió y por qué razón) |
| RF-45 | Proveedores: ficha + **órdenes de compra** con estado (pedido, recibido, pendiente) |
| RF-46 | Historial de movimientos por insumo y por fecha |

## 5. Gestión — Finanzas

| ID | Requerimiento |
| -- | ------------- |
| RF-47 | Ventas por día/semana/mes, ticket promedio, mesas por hora, ocupación |
| RF-48 | **COGS**: costo de mercadería desde inventario + recetas |
| RF-49 | Gastos operativos: alquiler, planilla, servicios → **margen bruto y neto** |
| RF-50 | Cuadre de caja: apertura, cierre y arqueo por cajero |
| RF-51 | Flujo de caja: ingresos vs egresos por día |
| RF-52 | Top de platos por **utilidad** y por **volumen** |
| RF-53 | Reporte financiero exportable (CSV/PDF) y punto de equilibrio |
| RF-54 | Variación de ventas: por día de semana, por rango horario, por temporada |

## 6. Gestión — Pagos

| ID | Requerimiento |
| -- | ------------- |
| RF-55 | Múltiples métodos: **efectivo, tarjeta, QR (Yape/Plin), link de pago**, transferencia |
| RF-56 | **Facturación electrónica** del país (Bolivia: SIN) y boleta/ticket |
| RF-57 | Comprobante al cliente: PDF/QR por email o WhatsApp |
| RF-58 | Apertura/cierre de caja por cajero + arqueo + conciliación contra tarjetas y billeteras |
| RF-59 | **Propinas** (sugerida o voluntaria) |
| RF-60 | **Split de cuenta** (dividir entre comensales) y cobros parciales |
| RF-61 | **Anulaciones/reembolsos** con motivo y auditoría |
| RF-62 | Mesa con cuenta pendiente: marca "cuenta abierta" hasta cobrar |

## 7. Transversales (plataforma)

| ID | Requerimiento |
| -- | ------------- |
| RF-63 | **Autenticación real** (Supabase Auth) + RLS por restaurante/tenant |
| RF-64 | Roles con permisos por pantalla |
| RF-65 | Multi-tenant: cada restaurante solo ve sus datos |
| RF-66 | Notificaciones push al cliente y al local |
| RF-67 | Monitoreo de errores + métricas de uso (analytics) |
| RF-68 | Seguridad de datos: backups, retención, GDPR/ley de datos del país |

---

## Resumen por prioridad (hoja de ruta sugerida)

**Ahora mismo (novato → presentable):** RF-34 roles/admin-lite → RF-25 agotados → RF-14 pedir cuenta → RF-10 alérgenos → RF-43 costos por receta.

**Para cerrar con un cliente (MVP gestionable):** RF-38..46 inventario (v.1 = insumos + stock mínimo + mermas), RF-47/51/53 finanzas (v.1 = ventas + caja + gastos básicos), RF-55/58/59 pagos (v.1 = efectivo + QR + propina).

**Para vender como producto completo:** RF-35 multi-sucursal, RF-63/65 multi-tenant autenticado, RF-56 facturación electrónica del país.
