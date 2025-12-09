import { apiPost } from './api';

export interface AuthResponse {
  token: string;
  rol: "ADMIN" | "DOCENTE" | "ESTUDIANTE";
}

const STORAGE_KEY = "aplicatto_auth";

export async function login(email: string, password: string) {
  const data = await apiPost<AuthResponse>("/auth/login", { email, password });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function getAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}
