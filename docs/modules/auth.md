# Módulo: Autenticación

## Descripción
Autenticación basada en JWT para usuarios demo del semillero.

## Objetivo
Permitir login seguro y emisión de token para proteger rutas de creación.

## Datos de entrada
- POST `/api/v1/auth/login`: `{ email, password }`

## Datos de salida
- `{ token, user: { id, name, role } }`

## Flujo
1) El usuario envía email/password.
2) El backend valida contra seeds en memoria.
3) Se firma JWT con `sub` y `role` (expira en 8h).
4) Se devuelve token y datos mínimos de usuario.

## Endpoints
- `POST /api/v1/auth/login` (público)

## Pruebas (Postman)
- Caso éxito (demo users, pwd 123): status 200, guarda `token` en env.
- Caso fallo: status 401 si credenciales no coinciden.
