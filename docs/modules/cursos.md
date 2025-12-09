# Módulo: Cursos

## Descripción
Gestión de cursos impartidos por docentes, opcionalmente asociados a línea/proyecto; datos en memoria.

## Objetivo
Permitir a docentes crear cursos y ofrecer listados públicos.

## Datos de entrada
- POST `/api/v1/cursos`: `{ title, description, docenteId, level, lineId?, projectId?, isPublic?, modules?, enrolledStudentIds? }` (DOCENTE)

## Datos de salida
- GET: `Course[]` (filtrable por `lineId`, `projectId`)
- POST: curso creado `{ id, ... }`

## Flujo
1) Público consulta cursos (solo `isPublic`).
2) Docente autentica y crea curso; se asocia a línea/proyecto si aplica.
3) Backend devuelve curso creado y se agrega al estado in-memory.

## Endpoints
- `GET /api/v1/cursos` (público; query `lineId`, `projectId`)
- `POST /api/v1/cursos` (DOCENTE, Bearer)

## Pruebas (Postman)
- Crear: status 201, guarda `curso_id`; header `Authorization: Bearer {{token}}`.
- Listar: status 200, respuesta array.
