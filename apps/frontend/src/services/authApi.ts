import { apiPost } from './api';
import { UserRole } from '../types';

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; role: UserRole };
}

export function loginApi(email: string, password: string) {
  return apiPost<AuthResponse>('/auth/login', { email, password });
}
