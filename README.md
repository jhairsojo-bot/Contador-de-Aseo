# Contador de Aseo 🧹

Control de limpieza de cocina compartido. Aplicación SPA en vanilla JS que permite a 4 personas registrar sus sesiones de limpieza y visualizar estadísticas de participación.

## Funcionalidades

- **Dashboard** — Resumen visual con tarjetas por persona, indicadores de más/menos limpiezas, barras de participación general, ranking de áreas más limpiadas y distribución por persona y área.
- **Calendario** — Grid mensual (lunes a domingo). Solo el día actual es seleccionable. Las fechas futuras aparecen bloqueadas y las pasadas sin registro son inertes. Registro en dos pasos: seleccionar persona y luego el área a limpiar. Cada día muestra puntos de colores según quién limpió y en qué área.
- **Estadísticas** — Ranking general con medallas, gráfico de dona (conic-gradient), ranking por área con identificación del top limpiador, tabla mensual e historial completo de registros con columna de área.

## Sistema de diseño — «Añil y Lino»

| Token | Hex | Uso |
|-------|------|------|
| Lino | `#F6F4EF` | Fondo general |
| Superficie | `#FFFFFF` | Tarjetas |
| Índigo | `#1B2A4A` | Estructura (nav, títulos, reglas) |
| Piedra | `#8B7D6B` | Texto secundario |
| Hilo | `#D6CDC0` | Bordes y divisores |
| Cuero | `#C8733A` | Acento único |

**Tipografía:** DM Serif Display (títulos) + DM Sans (cuerpo) — Google Fonts.

## Tecnología

- **Zero frameworks** — JavaScript vanilla, sin React, Vue ni build tools.
- **Tailwind CDN** — Utilidades CSS en runtime vía `cdn.tailwindcss.com`.
- **Sin persistencia** — Los datos solo existen en memoria durante la sesión.
- **Google Fonts** — DM Serif Display y DM Sans cargadas desde CDN.

## Servir localmente

Los módulos ES requieren un servidor HTTP (no funcionan con `file://`):

```sh
python -m http.server 8000
# o
npx serve .
```

Luego abre `http://localhost:8000` en el navegador.

## Estructura del proyecto

```
├── index.html          Entry point único
├── css/
│   └── styles.css      Animaciones, variables CSS, clases de tipografía
├── js/
│   ├── app.js          Router SPA por hash, inicialización
│   ├── constants.js    PEOPLE[] (4 personas) y AREAS[] (4 áreas de limpieza)
│   ├── store.js        Capa de datos en memoria, custom events
│   ├── calendar.js     Grid mensual, modal de registro
│   ├── dashboard.js    Tarjetas resumen, barras de participación
│   └── stats.js        Ranking, gráfico dona, tabla mensual, historial
├── planningGuide.md    Documento de diseño
└── AGENTS.md           Convenciones y reglas del proyecto
```

## Personalizar participantes y áreas

Para cambiar los nombres o colores de las personas, edita `js/constants.js`:

```js
export const PEOPLE = [
  { name: 'Jhair',    color: '#3B82F6', bg: 'bg-blue-500' },
  { name: 'Andrea',   color: '#22C55E', bg: 'bg-green-500' },
  { name: 'Maryuri',  color: '#EAB308', bg: 'bg-yellow-500' },
  { name: 'Erickson', color: '#EF4444', bg: 'bg-red-500' },
];
```

- `name` — Nombre visible en toda la interfaz.
- `color` — Color hex (aparece en gráficos, bordes de tarjetas y puntos del calendario).
- `bg` — Clase Tailwind (usada en los círculos del footer y del modal de registro). Debe coincidir aproximadamente con el `color` hex.

**Importante:** `bg` debe ser una clase Tailwind preexistente (ej. `bg-blue-500`), no un valor arbitrario. Tailwind CDN no re-procesa clases añadidas dinámicamente por JS.

**Importante:** La leyenda del footer en `index.html` (líneas 87–102) tiene los nombres y las clases `bg-*` escritos manualmente. Si cambias los nombres o colores en `constants.js`, también debes actualizar esas entradas en el footer para que coincidan.

Para agregar o quitar áreas de limpieza, edita `js/constants.js`:

```js
export const AREAS = [
  { id: 'cocina', name: 'Cocina', icon: '🍳' },
  { id: 'sala',   name: 'Sala',   icon: '🛋️' },
  { id: 'bano',   name: 'Baño',   icon: '🚿' },
  { id: 'otro',   name: 'Otro',   icon: '📦' },
];
```

- `id` — Identificador único del área (usado internamente).
- `name` — Nombre visible en la interfaz.
- `icon` — Emoji representativo del área.

## Reglas de uso

- **Registros inmutables** — Una vez guardados no pueden editarse ni eliminarse desde la interfaz.
- **Solo hoy** — El día actual es la única celda clickeable del calendario.
- **Cocina múltiple** — La persona puede registrar Cocina múltiples veces al día. Sala, Baño y Otro solo una vez por persona al día.
- **Sin persistencia** — Los datos se pierden al recargar la página.

## Despliegue

Adecuado para static hosting (GitHub Pages, Netlify, Vercel, etc.). Solo subir la carpeta raíz.
