# Módulo: Frontend (React + Vite)

## Descripción
SPA que consume la API `/api/v1`, renderiza vistas públicas y tableros según rol.

## Objetivo
Exponer UI para visitantes, admins, docentes y estudiantes, usando datos reales de la API.

## Datos de entrada
- Respuestas JSON de la API: líneas, proyectos, cursos, auth.
- Inputs de usuario: formularios de login, creación de curso (docente), filtros.

## Datos de salida
- Render de componentes y navegación cliente (HashRouter), sin persistencia local.

## Flujo
1) Al montar `App.tsx`, se hacen fetch a `/lineas`, `/proyectos`, `/cursos` y se llena estado.
2) Login llama `/auth/login`; guarda token y usuario.
3) Docente crea curso → POST `/cursos` con Bearer token y actualiza estado local.
4) Vistas públicas muestran catálogos; tableros muestran métricas según rol.

## Endpoints consumidos
- `GET /api/v1/lineas`
- `GET /api/v1/proyectos` (+filtros)
- `GET /api/v1/cursos` (+filtros)
- `POST /api/v1/auth/login`
- `POST /api/v1/cursos` (docente)

## Pruebas
- Navegación manual en dev/prod: login con demos (pwd 123), ver dashboards, crear curso y ver en listado.
- Smoke de build: `npm run build` sin errores.
