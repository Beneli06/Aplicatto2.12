# Guía de despliegue (Frontend en Vercel, Backend en Render)

## Frontend (Vercel)
- Repo: `Beneli06/Aplicatto2.12`
- Proyecto raíz: `apps/frontend`
- Build command: `npm run build`
- Output dir: `dist`
- Node version: 18+
- Variables de entorno (Vercel):
  - `VITE_API_BASE=https://<tu-backend-render>/api/v1`
- Tras el deploy, verifica la URL pública (ej: `https://aplicatto.vercel.app`).

## Backend (Render)
- Servicio Web → conectar GitHub
- Root: `server`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Node version: 18+
- Env vars en Render:
  - `PORT` (Render asigna, usa la que da Render)
  - `JWT_SECRET=<valor-seguro>`
  - `GEMINI_API_KEY=<tu-api-key>`
- URL esperada: `https://<tu-backend-render>.onrender.com`

## Ajustes en local/producción
- `.env` (local frontend): `VITE_API_BASE=/api/v1` (proxy).
- En producción, Vercel debe apuntar al backend público.
- Backend prod expuesto en Render; no exponer claves en frontend.

## Pasos de comprobación tras deploy
1) `GET <backend>/api/v1/health` debe responder `{ ok: true }`.
2) `POST <backend>/api/v1/auth/login` con demo users (pwd 123) retorna token.
3) Frontend: abrir URL de Vercel, login con demo y ver datos cargados.
4) Postman: cambiar `base_url` a la URL del backend en el environment y correr la colección.

## Notas
- Para reenviar builds automáticos: usar Deploy Hooks o activar auto-deploy en Vercel/Render.
- Mantener `.env` fuera del repo; usar los paneles de Vercel/Render para secret management.
