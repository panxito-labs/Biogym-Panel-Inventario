# BioGymStore — Sistema de Inventario

Sitio web para la **gestión de inventario de BioGymStore**, desarrollado como
proyecto del curso de desarrollo web. Resuelve una necesidad real del negocio:
llevar el control de stock de productos (suplementos, pesas, indumentaria) entre
múltiples bodegas, con registro de ingresos y traslados.

> **Estado actual:** prototipo funcional en frontend. Los datos se guardan en el
> `localStorage` del navegador (cada usuario ve su propio inventario de prueba).
> La integración con backend y la API de Bsale quedan como mejora futura.

---

### Acceso de demostración

| Campo | Valor |
|-------|-------|
| Usuario | `demo@biogym.cl` |
| Contraseña | `demo1234` |

Para restaurar los datos de prueba: consola del navegador (F12) → `Store.reset()`.

---

## Funcionalidades

- **Dashboard** — indicadores (total productos, unidades, alertas de stock, bodegas),
  accesos rápidos y movimientos recientes.
- **Inventario** — listado de productos con stock por bodega, búsqueda en vivo y
  filtro por categoría.
- **Ingreso de stock** — suma unidades a un producto existente o crea productos
  nuevos (SKU único, recuento automático de cajas).
- **Traslado** — mueve stock entre bodegas con validación de disponibilidad;
  gestión de bodegas (agregar/eliminar) e historial de movimientos.
- **Proveedores** — fichas de proveedores y productos "bajo pedido" con cotización
  directa.

---

## Estructura del proyecto

```
index.html            Inicio de sesión
dashboard.html        Panel principal
inventario.html       Listado de productos
ingreso-stock.html    Ingreso y creación de productos
traslado.html         Traslados y bodegas
proveedores.html      Proveedores y pedidos
css/styles.css        Estilos propios (paleta #0d0d0d / #121212 / #ffe600)
js/data.js            Datos semilla (credenciales demo, productos, bodegas)
js/store.js           Estado de la app + persistencia en localStorage
js/icons.js           Set de iconos SVG propios (sin emojis)
js/app.js             Compartido: sesión, navbar, utilidades
js/pages/*.js         Lógica específica de cada página
img/                  Logo BioGym (PNG oficial)
vendor/               Bootstrap 5.3.3 local (CSS + JS bundle)
```

---

## Tecnologías

- **HTML5 semántico** — `header`, `nav`, `main`, `section`, `article`, `footer`.
- **CSS3 + Bootstrap 5** — grid, componentes y utilidades; customización con
  variables CSS propias.
- **JavaScript (ES6)** — módulos por IIFE, sin dependencias ni frameworks.
- **Bootstrap local en `vendor/`** — funciona sin conexión a internet.

---

## Seguridad (importante)

El inicio de sesión es una **simulación académica**: en un proyecto 100% frontend
las credenciales de demostración son visibles a propósito (`js/data.js`). Proteger
un acceso de verdad requiere un backend.
Sí se aplican **cabeceras de seguridad** (CSP, `X-Frame-Options`, HSTS, etc.) vía
`vercel.json`, `_headers`, `netlify.toml` y `.htaccess`. 

---

## Equipo y roles

| Integrante | Rol |
|------------|-----|
| Francisco Correa | Jefe de Proyecto · Diseñador UI/UX · Webmaster |
| Aukin Carilao | Diseñador UI/UX · Desarrollador frontend |

- **Cliente:** BioGymStore
- **Curso:** Interfaz de Usuario — sección 1
- **Fecha:** 15-10-2026
- **Versión:** 1.0

---

### Etapas del proyecto (según la rúbrica del curso)

| Etapa | Estado |
|-------|--------|
| Definición de equipo y tema | ✔ hecho |
| Planificación y requerimientos | pendiente |
| Wireframe | pendiente |
| Desarrollo | ✔ prototipo funcional |
| Entrega final | pendiente |
