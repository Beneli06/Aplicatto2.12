import { apiGet } from './api';
import { ResearchLine } from '../types';

export function fetchLineas() {
  return apiGet<ResearchLine[]>('/lineas');
}
