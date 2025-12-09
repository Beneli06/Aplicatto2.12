export type UserRole = "ADMIN" | "DOCENTE" | "ESTUDIANTE" | "VISITOR";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  specialty?: string;
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

export type ProjectState = "En Formulación" | "En Curso" | "Finalizado" | "Publicado";

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
  content: string;
  resources: { title: string; url: string }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  docenteId: string;
  lineId?: string;
  projectId?: string;
  level: "Básico" | "Intermedio" | "Avanzado";
  modules: CourseModule[];
  enrolledStudentIds: string[];
  isPublic: boolean;
}

export const users: User[] = [
  { id: "1", name: "Admin User", email: "admin@aplicatto.edu", role: "ADMIN", password: "123" },
  { id: "2", name: "Prof. Jhon Doe", email: "prof@aplicatto.edu", role: "DOCENTE", specialty: "Data Science", password: "123", bio: "Experto en IA.", interests: ["ML", "Python"] },
  { id: "3", name: "Estudiante Ana", email: "ana@est.edu", role: "ESTUDIANTE", password: "123", bio: "Estudiante de ingeniería.", interests: ["IoT"] },
];

export const lines: ResearchLine[] = [
  { id: "l1", name: "Inteligencia Artificial", description: "Aplicación de modelos de ML y DL en contextos sociales.", leaderId: "2" },
  { id: "l2", name: "IoT y Ciudades", description: "Sensores y conectividad para mejorar la vida urbana.", leaderId: "2" },
];

export const projects: Project[] = [
  { id: "p1", title: "Predicción de calidad del aire", description: "Uso de redes neuronales para predecir PM2.5 en Medellín.", lineId: "l1", leaderId: "2", year: 2024, state: "En Curso", tags: ["AI", "Python", "Ambiental"] },
  { id: "p2", title: "Sensores de ruido low-cost", description: "Dispositivos IoT para medir contaminación auditiva.", lineId: "l2", leaderId: "2", year: 2023, state: "Publicado", tags: ["IoT", "Arduino", "Hardware"] },
];

export const courses: Course[] = [
  { id: "c1", title: "Fundamentos de Python", description: "Curso introductorio para investigación.", docenteId: "2", lineId: "l1", level: "Básico", modules: [], enrolledStudentIds: ["3"], isPublic: true },
  { id: "c2", title: "Machine Learning I", description: "Modelos supervisados y no supervisados.", docenteId: "2", lineId: "l1", level: "Intermedio", modules: [], enrolledStudentIds: [], isPublic: true },
];
