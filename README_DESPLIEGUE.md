# BioGymStore — Guía de despliegue

Proyecto web de inventario para BioGymStore (HTML5 semántico + CSS3/Bootstrap 5 +
JavaScript). **100% frontend**: la información se guarda en el `localStorage` del
navegador. No requiere servidor ni base de datos.

---

## 1. Cómo ejecutarlo en local

Abrir `index.html` con doble clic **no funciona** bien porque el navegador bloquea
`localStorage` bajo el protocolo `file://`. Usa un servidor local:

- **Opción A (VS Code):** instala la extensión *Live Server*, abre la carpeta del
  proyecto y pulsa "Go Live".
- **Opción B (terminal):** desde esta carpeta ejecuta `python -m http.server 8000`
  y abre <http://localhost:8000>.

### Acceso de demostración
| Campo | Valor |
|-------|-------|
| Usuario | `demo@biogym.cl` |
| Contraseña | `demo1234` |

Para restaurar los datos de prueba, abre la consola del navegador (F12) y escribe
`Store.reset()`.

---

## 2. Cómo publicarlo

Como todo son archivos estáticos, basta subir **el contenido de esta carpeta**
(`index.html`, las demás páginas, y las carpetas `css/`, `js/`, `img/`, `vendor/`)
a cualquier hosting estático. Los archivos de configuración ya incluidos aplican
las cabeceras de seguridad automáticamente:

| Plataforma | Archivo usado | Qué hace |
|------------|---------------|----------|
| **Netlify** | `netlify.toml` **o** `_headers` | Aplica las cabeceras (usa uno de los dos) |
| **Vercel** | `vercel.json` | Aplica las cabeceras |
| **Apache** (cPanel/Hostinger) | `.htaccess` | Aplica las cabeceras + desactiva listado de directorios |
| **GitHub Pages** | — | No lee cabeceras: el sitio funciona igual, solo sin cabeceras |

> Si usas Netlify, deja **un solo** archivo de cabeceras (`netlify.toml` **o**
> `_headers`), porque definen lo mismo y podría duplicarse.

Además, el `<head>` de cada página incluye ya una directiva
`Content-Security-Policy` como respaldo, útil cuando el hosting no lee los archivos
de configuración.

> **Importante — el CSP exige servidor HTTP.** La directiva usa `'self'` (mismo
> origen), que solo funciona cuando la página se sirve por HTTP. Si la abres con
> doble clic (`file://`) el navegador usa un origen "null" y bloquea los estilos
> (se vería sin colores). Usa siempre Live Server o `python -m http.server`,
> **nunca** el archivo directamente.

`robots.txt` pide a los buscadores que no indexen el panel (esto evita que aparezca
en Google, **no** protege el contenido: cualquiera con el enlace puede abrirlo).

---

## 3. Sobre la seguridad (leer antes de publicar)

**El inicio de sesión NO es seguridad real.** Como todo el sistema corre en el
navegador, las credenciales de demostración (`demo@biogym.cl` / `demo1234`) son
visibles en `js/data.js` por diseño. Cualquiera puede leerlas con "Ver código
fuente". Esto es aceptable **solo** porque es un proyecto académico con datos de
prueba.

Lo que **sí** protege este despliegue:
- Las cabeceras de seguridad evitan que el sitio se incruste en marcos, que se
  confunda su tipo de contenido y limitan el acceso a cámara, micrófono, etc.
- No se filtra ninguna llave, token ni dato real, porque no existen en el proyecto.

Para convertir el login en algo real habría que validar al usuario en un
**backend** (fuera del alcance de este curso). Queda anotado como mejora futura.

---

## 4. Estructura

```
index.html            Login
dashboard.html        Panel con indicadores y accesos
inventario.html       Listado de productos y stock
ingreso-stock.html    Ingreso/creación de productos
traslado.html         Traslados entre bodegas
proveedores.html      Proveedores y productos bajo pedido
css/  js/  img/  vendor/    Estilos, lógica, imágenes y Bootstrap local
```
