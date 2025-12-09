export enum UserRole {
  ADMIN = 'ADMIN',
  DOCENTE = 'DOCENTE',
  ESTUDIANTE = 'ESTUDIANTE',
  VISITOR = 'VISITOR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialty?: string; // For teachers
  password?: string; // For auth
  bio?: string;
  interests?: string[];
}

export interface ResearchLine {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  imageUrl?: string;
}

export enum ProjectState {
  FORMULATION = 'En Formulación',
  IN_PROGRESS = 'En Curso',
  FINISHED = 'Finalizado',
  PUBLISHED = 'Publicado'
}

export interface Project {
  id: string;
  title: string;
  description: string;
  lineId: string;
  leaderId: string;
  year: number;
  state: ProjectState;
  tags: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  content: string; // Markdown or text
  resources: { title: string; url: string }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  docenteId: string;
  lineId?: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  modules: CourseModule[];
  enrolledStudentIds: string[];
  isPublic: boolean;
}

export interface GlobalState {
  users: User[];
  lines: ResearchLine[];
  projects: Project[];
  courses: Course[];
  currentUser: User | null;
}