import { apiGet, apiPost } from './api';
import { Project } from '../types';

export interface CreateProjectPayload {
  title: string;
  description: string;
  lineId: string;
  leaderId: string;
  year: number;
  state: string;
  tags?: string[];
}

export function fetchProyectos(params?: { lineId?: string; estado?: string }) {
  const search = new URLSearchParams();
  if (params?.lineId) search.set('lineId', params.lineId);
  if (params?.estado) search.set('estado', params.estado);
  const query = search.toString();
  const path = query ? `/proyectos?${query}` : '/proyectos';
  return apiGet<Project[]>(path);
}

export function createProyecto(payload: CreateProjectPayload, token: string) {
  return apiPost<Project>('/proyectos', payload, token);
}
