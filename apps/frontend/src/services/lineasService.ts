import { apiGet } from './api';

export interface Linea {
  id: number;
  nombre: string;
  descripcion?: string;
}

export function obtenerLineas() {
  return apiGet<Linea[]>('/lineas');
}
