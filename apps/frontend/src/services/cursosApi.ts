import { apiGet, apiPost } from './api';
import { Course, CourseModule } from '../types';

export interface CreateCursoPayload {
  title: string;
  description: string;
  docenteId: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  lineId?: string;
  projectId?: string;
  modules?: CourseModule[];
  enrolledStudentIds?: string[];
  isPublic?: boolean;
}

export function fetchCursos(params?: { lineId?: string; projectId?: string }) {
  const search = new URLSearchParams();
  if (params?.lineId) search.set('lineId', params.lineId);
  if (params?.projectId) search.set('projectId', params.projectId);
  const query = search.toString();
  const path = query ? `/cursos?${query}` : '/cursos';
  return apiGet<Course[]>(path);
}

export function createCurso(payload: CreateCursoPayload, token: string) {
  return apiPost<Course>('/cursos', payload, token);
}
