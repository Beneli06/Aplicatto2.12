// src/services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

// Clase de error personalizada para incluir más contexto
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// Función auxiliar para manejar la respuesta y los errores
async function handleResponse<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    let errorBody;
    try {
      // Intenta parsear el cuerpo del error, que puede contener detalles
      errorBody = await res.json();
    } catch (e) {
      // Si el cuerpo no es JSON, usa el texto
      errorBody = await res.text();
    }
    // Lanza el error personalizado
    throw new ApiError(`Error en ${res.status} para ${path}`, res.status, errorBody);
  }
  return res.json();
}


export async function apiGet<T>(path: string, token?: string): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return handleResponse(res, `GET ${path}`);
  } catch (error) {
    // Re-lanza el error para que el llamador pueda manejarlo
    throw error;
  }
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return handleResponse(res, `POST ${path}`);
  } catch (error) {
    // Re-lanza el error para que el llamador pueda manejarlo
    throw error;
  }
}