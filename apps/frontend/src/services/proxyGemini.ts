import { apiPost } from './api';

export async function generateCourseSyllabus(title: string, level: string, line: string) {
  const res = await apiPost<{ text: string }>('/gemini/syllabus', { title, level, line });
  return res.text || '';
}

export async function generateProjectAbstract(title: string, tags: string[]) {
  const res = await apiPost<{ text: string }>('/gemini/abstract', { title, tags });
  return res.text || '';
}
