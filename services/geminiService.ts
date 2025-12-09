import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set. Gemini features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCourseSyllabus = async (title: string, level: string, line: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Error: API Key missing.";

  try {
    const prompt = `Actúa como un docente experto investigador. Crea una descripción breve y un temario sugerido de 3 módulos para un curso de investigación titulado "${title}".
    El nivel es ${level} y pertenece a la línea de investigación "${line}".
    Formato deseado:
    Descripción: [Texto corto]
    Módulo 1: [Nombre] - [Breve descripción]
    Módulo 2: [Nombre] - [Breve descripción]
    Módulo 3: [Nombre] - [Breve descripción]
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No se pudo generar el contenido.";
  } catch (error) {
    console.error("Error generating syllabus:", error);
    return "Hubo un error al generar la sugerencia con IA.";
  }
};

export const generateProjectAbstract = async (title: string, tags: string[]): Promise<string> => {
    const client = getClient();
    if (!client) return "Error: API Key missing.";
  
    try {
      const prompt = `Genera un resumen ejecutivo académico (abstract) de 1 párrafo para un proyecto de investigación titulado "${title}".
      Palabras clave: ${tags.join(', ')}.
      El tono debe ser formal y académico.`;
  
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
  
      return response.text || "No se pudo generar el resumen.";
    } catch (error) {
      console.error("Error generating abstract:", error);
      return "Hubo un error al generar el resumen con IA.";
    }
  };