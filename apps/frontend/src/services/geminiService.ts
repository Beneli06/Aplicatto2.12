import { generateCourseSyllabus as serverGenerateCourseSyllabus, generateProjectAbstract as serverGenerateProjectAbstract } from './proxyGemini';

export const generateCourseSyllabus = async (title: string, level: string, line: string) => {
  return serverGenerateCourseSyllabus(title, level, line);
};

export const generateProjectAbstract = async (title: string, tags: string[]) => {
  return serverGenerateProjectAbstract(title, tags);
};
