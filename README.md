# Contador de Aseo 🧹

Control de limpieza de cocina compartido. Aplicación SPA en vanilla JS que permite a 4 personas registrar sus sesiones de limpieza y visualizar estadísticas de participación.

## Funcionalidades

- **Dashboard** — Resumen visual con tarjetas por persona, indicadores de más/menos limpiezas, y barras de participación general.
- **Calendario** — Grid mensual (lunes a domingo). Solo el día actual es seleccionable. Las fechas futuras aparecen bloqueadas y las pasadas sin registro son inertes. Cada día muestra puntos de colores según quién limpió.
- **Estadísticas** — Ranking general con medallas, gráfico de dona (conic-gradient), tabla mensual e historial completo de registros.

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
- **localStorage** — Persistencia local con sincronización entre pestañas.
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
│   ├── constants.js    PEOPLE[] (4 personas) y STORAGE_KEY
│   ├── store.js        Capa de datos (localStorage, cross-tab sync)
│   ├── calendar.js     Grid mensual, modal de registro
│   ├── dashboard.js    Tarjetas resumen, barras de participación
│   └── stats.js        Ranking, gráfico dona, tabla mensual, historial
├── planningGuide.md    Documento de diseño
└── AGENTS.md           Convenciones y reglas del proyecto
```

## Personalizar participantes

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

## Reglas de uso

- **Registros inmutables** — Una vez guardados no pueden editarse ni eliminarse desde la interfaz.
- **Solo hoy** — El día actual es la única celda clickeable del calendario.
- **Un registro por persona por día** — Cada persona puede registrarse una vez por día.

## Despliegue

Adecuado para static hosting (GitHub Pages, Netlify, Vercel, etc.). Solo subir la carpeta raíz.
