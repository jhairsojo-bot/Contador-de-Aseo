# Contador de Aseo

SPA vanilla JS para control de limpieza de cocina. Sin frameworks, sin build.

## Servir localmente

Requiere servidor HTTP (ES modules no funcionan con `file://`):

```sh
python -m http.server 8000
# o
npx serve .
```

## Arquitectura

| Archivo | Rol |
|---------|-----|
| `index.html` | Entry point único, Tailwind CDN, secciones ocultas por clase `.section` |
| `js/constants.js` | `PEOPLE[]` (4 personas con nombre, color hex, clase Tailwind) y `AREAS[]` (4 áreas de limpieza) |
| `js/store.js` | Capa de datos: records en memoria, custom event `records-changed`, funciones de stats por persona y área |
| `js/calendar.js` | Grid mensual (lunes a domingo), modal de registro en dos pasos (persona → área), navegación entre meses |
| `js/dashboard.js` | Tarjetas resumen, barras de participación, ranking de áreas, distribución por persona |
| `js/stats.js` | Ranking, gráfico dona (conic-gradient), ranking por área, tabla mensual, historial con columna de área |
| `js/app.js` | Router SPA por hash (`#dashboard`, `#calendar`, `#stats`), inicialización |
| `css/styles.css` | Animaciones calendar-cell, modal, scrollbar |
| `planningGuide.md` | Documento de diseño con paleta, tipografías y decisiones visuales |

## Sistema de diseño — «Añil y Lino»

| Token | Hex | Rol |
|-------|------|------|
| Lino | `#F6F4EF` | Fondo general |
| Superficie | `#FFFFFF` | Tarjetas |
| Índigo | `#1B2A4A` | Estructura (nav, títulos, reglas) |
| Piedra | `#8B7D6B` | Texto secundario |
| Hilo | `#D6CDC0` | Bordes y divisores |
| Cuero | `#C8733A` | Acento único |

**Tipografía:** DM Serif Display (títulos) + DM Sans (cuerpo) — Google Fonts. Clases CSS: `.font-display` y `.font-body` definidas en `styles.css`.

**Layout:** Sin sombras en tarjetas, solo bordes `#D6CDC0`. Fondo `#F6F4EF`. Nav y footer blancos con borde inferior `#D6CDC0`. Modal de registro sin cambios visuales.

**Acento Cuero (`#C8733A`):** Nav activo (texto + borde inferior), celda del día actual (ring), hover en links de navegación. Sin otro uso decorativo.

## Reglas clave

- **Solo hoy**: el día actual es la única celda clickeable del calendario. Fechas futuras bloqueadas (`opacity-30 cursor-not-allowed`). Fechas pasadas sin registro son inertes.
- **Cocina múltiple**: la persona puede registrar Cocina múltiples veces al día. Sala, Baño y Otro solo una vez por persona al día.
- **Sin persistencia**: los datos solo existen en memoria durante la sesión. Al recargar la página se pierden.

## Tailwind CDN

Se usa `https://cdn.tailwindcss.com` (runtime). NO re-procesa clases añadidas dinámicamente por JS. Para colores dinámicos usar `element.style.backgroundColor = valor` o `style="..."` inline en templates, NUNCA interpolación en className.

## Convenciones

- Colores persona: Jhair=azul(#3B82F6), Andrea=verde(#22C55E), Maryuri=amarillo(#EAB308), Erickson=rojo(#EF4444) — **no modificar**
- Calendario inicia en lunes.
- Navegación hash-based; cambiar hash en `app.js:navigateTo()` dispara render del módulo correspondiente.
- Todos los renders reciben `container` (elemento DOM) y usan `container.innerHTML = ''` antes de pintar.
- Evento `records-changed` se dispara en `store.js` tras cada `saveRecord()`; `app.js` lo escucha para re-renderizar la sección activa.
- No hay tests, no hay lint, no hay typecheck.
- Despliegue: static hosting (GitHub Pages, Netlify, Vercel) - subir carpeta raíz.
