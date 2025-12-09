import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_prod';
const API_KEY = process.env.API_KEY; // must be set in server env

if (!API_KEY) {
  console.warn('Warning: API_KEY is not set. Gemini endpoints will fail until you set API_KEY in server env.');
}

// Create DB pool (MySQL). Ensure env vars are set or change values for local dev.
const db = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME ?? 'aplicatto',
  waitForConnections: true,
  connectionLimit: 10,
});

const genaiClient = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.get('/api/v1/health', (_req, res) => res.json({ ok: true }));

// Auth: register
app.post('/api/v1/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });

  try {
    const [rows] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if ((rows as any[]).length > 0) return res.status(409).json({ error: 'Usuario ya existe' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO usuarios (nombre, email, password_hash, created_at) VALUES (?, ?, ?, NOW())', [name ?? null, email, hash]);
    const insertId = (result as any).insertId;
    return res.status(201).json({ id: insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

// Auth: login
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });

  try {
    const [rows] = await db.query('SELECT id, nombre, password_hash FROM usuarios WHERE email = ?', [email]);
    const user = (rows as any[])[0];
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ sub: user.id, name: user.nombre }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

// Proxy endpoints for Gemini (server-side only)
app.post('/api/v1/gemini/syllabus', async (req, res) => {
  const { title, level, line } = req.body;
  if (!title || !level || !line) return res.status(400).json({ error: 'Faltan campos' });
  if (!genaiClient) return res.status(500).json({ error: 'API key no disponible en servidor' });

  const prompt = `Actúa como un docente experto investigador. Crea una descripción breve y un temario sugerido de 3 módulos para un curso de investigación titulado "${title}". Nivel: ${level}. Línea: ${line}. Formato: Descripción: [Texto corto] Módulo 1: [Nombre] - [Breve descripción] Módulo 2: [Nombre] - [Breve descripción] Módulo 3: [Nombre] - [Breve descripción]`;

  try {
    const response = await genaiClient.models.generateContent({ model: 'gemini-pro', contents: prompt });
    return res.json({ text: response.text ?? '' });
  } catch (err) {
    console.error('GenAI error', err);
    return res.status(500).json({ error: 'Error en generación IA' });
  }
});

app.post('/api/v1/gemini/abstract', async (req, res) => {
  const { title, tags } = req.body;
  if (!title || !Array.isArray(tags)) return res.status(400).json({ error: 'Faltan campos' });
  if (!genaiClient) return res.status(500).json({ error: 'API key no disponible en servidor' });

  const prompt = `Genera un resumen ejecutivo académico (abstract) de 1 párrafo para un proyecto titulado "${title}". Palabras clave: ${tags.join(', ')}.`;
  try {
    const response = await genaiClient.models.generateContent({ model: 'gemini-pro', contents: prompt });
    return res.json({ text: response.text ?? '' });
  } catch (err) {
    console.error('GenAI error', err);
    return res.status(500).json({ error: 'Error en generación IA' });
  }
});

// Basic lines/proyectos endpoints (in-memory examples or later backed by DB)
app.get('/api/v1/lineas', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre AS name, descripcion AS description, leaderId FROM lineas');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    // fallback to empty
    return res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
