# Integración frontend ↔ API

Este frontend consume el backend en `/api/v1` (proxy Vite ya apunta a `http://localhost:3001`). Los datos “mock” se reemplazaron por peticiones reales.

## Servicios HTTP
- `apps/frontend/src/services/authApi.ts` → `POST /auth/login` devuelve `{ token, user }`.
- `apps/frontend/src/services/lineasApi.ts` → `GET /lineas`.
- `apps/frontend/src/services/proyectosApi.ts` → `GET /proyectos` (filtros `lineId`, `estado`), `POST /proyectos` (requiere token ADMIN/DOCENTE).
- `apps/frontend/src/services/cursosApi.ts` → `GET /cursos` (filtros `lineId`, `projectId`), `POST /cursos` (requiere token DOCENTE).
- Base: `apps/frontend/src/services/api.ts` gestiona headers, token Bearer y errores.

## Flujo en `App.tsx`
- Al montar: `fetchLineas`, `fetchProyectos`, `fetchCursos` rellenan el estado global con datos del backend.
- Login: `handleAuth` usa `loginApi`; guarda token y usuario, cierra modal.
- Cursos (docente): `handleAddCourse` llama `createCurso` con token y actualiza estado local con la respuesta del backend.

## Notas
- Los usuarios “mock” sólo se mantienen como fallback para métricas del admin; el resto de datos vienen de la API.
- Proxy Vite definido en `apps/frontend/vite.config.ts` para `/api` → `http://localhost:3001`.
- Endpoints documentados en `docs/api-contract.md`.