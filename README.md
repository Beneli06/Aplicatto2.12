
# Aplicatto

Monorepo con frontend (React + Vite) y backend (Express) para el semillero Aplicatto.

## Requisitos
- Node.js 18+
- npm

## Variables de entorno
- Copia `.env.example` a `.env` en la raíz (frontend) y `server/.env.example` a `server/.env`.
- Configura al menos:
  - `GEMINI_API_KEY` (para el proxy de Gemini en el backend)
  - `JWT_SECRET` (backend)
  - `PORT` (opcional, por defecto 3001)

## Backend (API)
```bash
cd server
npm install
npm run dev
```
- Endpoints en `http://localhost:3001/api/v1/*` (ver `docs/api-contract.md`).
- Usuarios demo: `admin@aplicatto.edu`, `prof@aplicatto.edu`, `ana@est.edu` (clave: `123`).

## Frontend
```bash
cd apps/frontend
npm install
npm run dev
```
- Vite usa proxy a `http://localhost:3001` para `/api` (config en `apps/frontend/vite.config.ts`).
- Despliegue: Vercel/Netlify. Build `npm run build`, output `dist`, set `VITE_API_BASE` al backend público.

## Integración frontend ↔ API
- Servicios HTTP en `apps/frontend/src/services`: `authApi`, `lineasApi`, `proyectosApi`, `cursosApi` (base en `api.ts`).
- `App.tsx` carga líneas, proyectos y cursos desde el backend al montar y usa `loginApi` para autenticación.
- Docente crea cursos vía `createCurso` (token obligatorio). Usuarios demo arriba.
- Más detalle en `docs/frontend-api-integration.md`.

## Datos de prueba
- El backend sirve datos seed en memoria (usuarios, líneas, proyectos y cursos) definidos en `server/src/data.ts`.

## Notas
- El frontend consume el backend; las llamadas directas a Gemini se hacen vía proxy (`/api/v1/gemini/*`).
- Ver guía de despliegue en `docs/deploy.md`.
