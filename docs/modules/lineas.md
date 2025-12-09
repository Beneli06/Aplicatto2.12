# Módulo: Líneas

## Descripción
Gestión de líneas de investigación (listado y creación). Datos seed en memoria.

## Objetivo
Exponer las líneas del semillero y permitir que admin cree nuevas.

## Datos de entrada
- POST `/api/v1/lineas`: `{ name, description, leaderId }` (ADMIN, Bearer token)

## Datos de salida
- GET: `ResearchLine[]`
- POST: línea creada `{ id, name, description, leaderId }`

## Flujo
1) Público lista líneas.
2) Admin autentica y envía nueva línea.
3) Backend crea ID y la agrega al arreglo en memoria.

## Endpoints
- `GET /api/v1/lineas` (público)
- `GET /api/v1/lineas/:id` (público)
- `POST /api/v1/lineas` (ADMIN, Bearer)

## Pruebas (Postman)
- Listar: status 200, respuesta array.
- Crear: status 201, guarda `line_id` en env; headers `Authorization: Bearer {{token}}`.
