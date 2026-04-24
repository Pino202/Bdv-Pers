# BDV Persona SCM

Aplicación frontend en React + Vite + Tailwind + shadcn/ui.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Estructura

- `src/pages/` — páginas de la app (`Home`, `Registro`)
- `src/components/` — componentes reutilizables y UI (shadcn/ui)
- `src/api/client.js` — cliente local de datos (localStorage + BroadcastChannel)
- `src/lib/` — contextos y utilidades

## Notas

El cliente de datos (`src/api/client.js`) es un mock local que persiste en `localStorage` y sincroniza entre pestañas vía `BroadcastChannel`. Reemplázalo por tu backend real cuando esté disponible.
