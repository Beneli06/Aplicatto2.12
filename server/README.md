Server

Coloca aquí el servidor Express (TypeScript) con la lógica de negocio y las claves (API_KEY) en `server/.env` o en Secret Manager.

Archivo recomendado: `server/src/index.ts` con endpoints:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET/POST /api/v1/lineas
- GET/POST /api/v1/proyectos
- POST /api/v1/gemini/* (proxy a Google GenAI)

Ejecutar (ejemplo):
- Instalar dependencias en `server/` y ejecutar con `npx ts-node-dev --respawn server/src/index.ts`