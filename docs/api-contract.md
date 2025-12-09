# Contrato de datos (v0)

## Usuario
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "ADMIN" | "DOCENTE" | "ESTUDIANTE",
  "specialty": "string | null",
  "bio": "string | null",
  "interests": ["string", "string"],
  "avatar": "string | null"
}
```

## Línea de investigación
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "leaderId": "string",
  "imageUrl": "string | null"
}
```

## Proyecto
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "lineId": "string",
  "leaderId": "string",
  "year": 2024,
  "state": "IN_PROGRESS" | "PUBLISHED" | "FINISHED" | "FORMULATION",
  "tags": ["string", "string"]
}
```

## Curso
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "docenteId": "string",
  "lineId": "string | null",
  "level": "Básico" | "Intermedio" | "Avanzado",
  "modules": [
    { "id": "string", "title": "string", "content": "string", "resources": [{"title": "string", "url": "string"}] }
  ],
  "enrolledStudentIds": ["string"],
  "isPublic": true
}
```

## Semilla inicial (derivada de App.tsx)
- Usuarios: Admin, Docente (prof@aplicatto.edu), Estudiante (ana@est.edu), pass "123".
- Líneas: l1 (IA), l2 (IoT y Ciudades).
- Proyectos: p1 (IA/aire), p2 (IoT/ruido).
- Cursos: c1 (Fundamentos de IA, docente 2).

## Endpoints previstos (REST)
- POST `/api/v1/auth/login` → { token, user }
- GET `/api/v1/lineas`
- GET `/api/v1/lineas/:id`
- POST `/api/v1/lineas` (ADMIN)
- GET `/api/v1/proyectos` (filtros: lineId?, estado?)
- POST `/api/v1/proyectos` (ADMIN/DOCENTE)
- GET `/api/v1/cursos`
- POST `/api/v1/cursos` (DOCENTE)

Auth: JWT simple en header Authorization: Bearer <token>.