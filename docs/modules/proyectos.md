# Módulo: Proyectos

## Descripción
Gestión de proyectos asociados a líneas; datos en memoria.

## Objetivo
Permitir registrar proyectos vinculados a líneas y consultarlos por filtros.

## Datos de entrada
- POST `/api/v1/proyectos`: `{ title, description, lineId, leaderId, year, state, tags[] }` (ADMIN o DOCENTE)

## Datos de salida
- GET: `Project[]` (filtrable por `lineId`, `estado`)
- POST: proyecto creado `{ id, ... }`

## Flujo
1) Usuario público lista proyectos (opcional filtro por línea/estado).
2) Admin/Docente crea un proyecto indicando `lineId`.
3) Se almacena en arreglo en memoria y se retorna.

## Endpoints
- `GET /api/v1/proyectos` (público; query `lineId`, `estado`)
- `POST /api/v1/proyectos` (ADMIN/DOCENTE, Bearer)

## Pruebas (Postman)
- Crear: status 201, guarda `project_id`; header `Authorization: Bearer {{token}}`.
- Listar filtrado: status 200, array.
