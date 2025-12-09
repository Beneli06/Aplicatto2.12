# Manual Técnico - Aplicatto

## 1. Instalación y requisitos
- Node.js 18+
- npm
- Clonar repo: `git clone https://github.com/Beneli06/Aplicatto2.12.git`
- Variables de entorno: copiar `.env.example` -> `.env` (raíz) y `server/.env.example` -> `server/.env`.

## 2. Configuración
- Frontend `.env`: `VITE_API_BASE=/api/v1` (en prod apuntar al dominio del backend). No poner API keys en frontend.
- Backend `.env`: `PORT=3001`, `JWT_SECRET=...`, `GEMINI_API_KEY=...` (solo en servidor), opcionales de BD.

## 3. Arquitectura
- Frontend: React + Vite (SPA), servicios HTTP en `apps/frontend/src/services`, UI en `views` y `components`.
- Backend: Express + TypeScript en `server/src`, endpoints REST bajo `/api/v1` con seeds en memoria.
- Comunicación: Vite proxy a backend; Auth via Bearer JWT.

## 4. Estructura
- `apps/frontend/` código del cliente
- `server/` API Express
- `docs/` contratos, postman, manuales
- `db/` schema y migrations (referencia)

## 5. Endpoints clave
- Auth: `POST /api/v1/auth/login`
- Líneas: `GET /api/v1/lineas`, `POST /api/v1/lineas` (ADMIN)
- Proyectos: `GET /api/v1/proyectos` (filtros `lineId`, `estado`), `POST /api/v1/proyectos` (ADMIN/DOCENTE)
- Cursos: `GET /api/v1/cursos` (filtros `lineId`, `projectId`), `POST /api/v1/cursos` (DOCENTE)
- Health: `GET /api/v1/health`

## 6. Ejecutar frontend
```bash
cd apps/frontend
npm install
npm run dev   # http://localhost:5173
npm run build # genera dist/
```

## 7. Ejecutar backend
Dev:
```bash
cd server
npm install
npm run dev   # ts-node-dev en 3001
```
Prod:
```bash
cd server
npm install
npm run build
npm start     # usa dist
```

## 8. Despliegue
- Frontend: Vercel/Netlify. Build `npm run build`, output `dist`, `VITE_API_BASE` apuntando al backend público.
- Backend: Render/Railway. Build `npm run build`, start `npm start`, set env (`PORT`, `JWT_SECRET`, `GEMINI_API_KEY`).

## 9. Pruebas
- Postman: importar `docs/postman/Aplicatto-API.postman_collection.json` y `docs/postman/Aplicatto-Local.postman_environment.json`; correr los 5 endpoints con tests.
- Smoke manual: abrir frontend, login con demos (pwd 123), verificar dashboards y creación de curso.

## 10. Flujo típico
1) Login (admin o docente).
2) Crear línea (admin).
3) Listar líneas.
4) Crear proyecto asociado.
5) Listar proyectos filtrados.
6) Crear curso (docente) asociado a línea.
7) Listar cursos públicos.

## 11. Notas de seguridad
- No commitear `.env` ni API keys.
- Mantener `JWT_SECRET` fuerte en backend.
- En producción, activar CSP estricta y HTTPS detrás de Vercel/Render.
