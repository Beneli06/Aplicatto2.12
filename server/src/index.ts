import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { users, lines, projects, courses, UserRole } from "./data";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

const app = express();
// Disable CSP in dev to avoid Chrome DevTools complaints; keep other helmet defaults.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 200 }));

// --- Helpers ---
type JwtPayload = { sub: string; role: UserRole };
const signToken = (userId: string, role: UserRole) =>
  jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: "8h" });

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authz = req.headers.authorization;
  if (!authz?.startsWith("Bearer ")) return res.status(401).json({ error: "No auth" });
  const token = authz.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

function requireRole(...roles: UserRole[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user as JwtPayload | undefined;
    if (!user || !roles.includes(user.role)) return res.status(403).json({ error: "No autorizado" });
    next();
  };
}

// --- Root ---
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Aplicatto API - use /api/v1" });
});

// --- Auth ---
app.post("/api/v1/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
  const token = signToken(user.id, user.role);
  return res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// --- Líneas ---
app.get("/api/v1/lineas", (_req, res) => res.json(lines));
app.get("/api/v1/lineas/:id", (req, res) => {
  const line = lines.find(l => l.id === req.params.id);
  if (!line) return res.status(404).json({ error: "No encontrada" });
  res.json(line);
});
app.post("/api/v1/lineas", auth, requireRole("ADMIN"), (req, res) => {
  const { name, description, leaderId } = req.body || {};
  if (!name || !description || !leaderId) return res.status(400).json({ error: "Faltan campos" });
  const newLine = { id: `l${Date.now()}`, name, description, leaderId };
  lines.push(newLine);
  res.status(201).json(newLine);
});

// --- Proyectos ---
app.get("/api/v1/proyectos", (req, res) => {
  const { lineId, estado } = req.query;
  let data = projects;
  if (lineId) data = data.filter(p => p.lineId === lineId);
  if (estado) data = data.filter(p => p.state === estado);
  res.json(data);
});
app.post("/api/v1/proyectos", auth, requireRole("ADMIN", "DOCENTE"), (req, res) => {
  const { title, description, lineId, leaderId, year, state, tags } = req.body || {};
  if (!title || !description || !lineId || !leaderId || !year || !state) return res.status(400).json({ error: "Faltan campos" });
  const newProject = {
    id: `p${Date.now()}`,
    title,
    description,
    lineId,
    leaderId,
    year: Number(year),
    state,
    tags: tags ?? []
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// --- Cursos ---
app.get("/api/v1/cursos", (req: express.Request, res: express.Response) => {
  const { lineId, projectId } = req.query;
  let data = courses;
  if (lineId) data = data.filter(c => c.lineId === lineId);
  if (projectId) data = data.filter(c => c.projectId === projectId);
  res.json(data);
});
app.post("/api/v1/cursos", auth, requireRole("DOCENTE"), (req: express.Request, res: express.Response) => {
  const { title, description, docenteId, level, modules, enrolledStudentIds, isPublic, lineId, projectId } = req.body || {};
  if (!title || !description || !docenteId || !level) return res.status(400).json({ error: "Faltan campos" });
  const newCourse = {
    id: `c${Date.now()}`,
    title,
    description,
    docenteId,
    lineId,
    projectId,
    level,
    modules: Array.isArray(modules) ? modules : [],
    enrolledStudentIds: Array.isArray(enrolledStudentIds) ? enrolledStudentIds : [],
    isPublic: Boolean(isPublic)
  };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// Health
app.get("/api/v1/health", (_req: express.Request, res: express.Response) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});