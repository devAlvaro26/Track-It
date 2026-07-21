import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API to enrich video game information using Gemini 3.6-flash
  app.post("/api/enrich-game", async (req, res) => {
    try {
      const { title } = req.body;
      if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "El título es obligatorio y debe ser un texto válido." });
      }

      const prompt = `Proporciona información detallada en español para el videojuego "${title}".
      Queremos datos precisos y elegantes para una biblioteca digital personal de coleccionista.
      Completa la información incluyendo su descripción, año/fecha de lanzamiento, un código de barras representativo (EAN o UPC realista de este juego), género principal, plataformas habituales, logros divertidos u oficiales, y sugerencias visuales de diseño para crear una carátula digital minimalista (un color de fondo elegante y un símbolo o ícono representativo).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Título oficial corregido y con formato correcto del juego." },
              description: { type: Type.STRING, description: "Una descripción breve, elegante y profesional en español del juego (máximo 3 frases)." },
              releaseDate: { type: Type.STRING, description: "Fecha de lanzamiento oficial aproximada en formato YYYY-MM-DD o YYYY." },
              barcode: { type: Type.STRING, description: "Código de barras representativo realista de 12 o 13 dígitos numéricos." },
              genre: { type: Type.STRING, description: "Género principal (ej. RPG de Acción, Plataformas, Aventuras, Terror, Conducción)." },
              platforms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Plataformas clave en las que está disponible el juego (ej. Nintendo Switch, PlayStation 5, PC, Xbox Series X)."
              },
              coverColor: { type: Type.STRING, description: "Un color hexadecimal elegante (ej. #1e293b, #059669, #7c3aed, #db2777) que represente la paleta cromática o atmósfera del juego." },
              coverSymbol: { type: Type.STRING, description: "Un nombre de ícono simple de Lucide (ej. 'sword', 'shield', 'gamepad', 'crown', 'ghost', 'trophy', 'compass', 'flame', 'music', 'skull', 'heart', 'star', 'rocket', 'target', 'wrench', 'car') que encaje con la temática." },
              achievements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Nombre elegante del logro." },
                    description: { type: Type.STRING, description: "Descripción clara del objetivo para conseguirlo." },
                    difficulty: { type: Type.STRING, description: "Dificultad: 'Fácil', 'Medio' o 'Difícil'." }
                  },
                  required: ["name", "description", "difficulty"]
                },
                description: "Lista de 4 logros emblemáticos, oficiales o creativos para este juego."
              }
            },
            required: ["title", "description", "releaseDate", "barcode", "genre", "platforms", "coverColor", "coverSymbol", "achievements"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        return res.status(500).json({ error: "No se pudo obtener respuesta del modelo de IA." });
      }

      const gameData = JSON.parse(responseText.trim());
      res.json(gameData);
    } catch (error: any) {
      console.error("Error al enriquecer juego:", error);
      res.status(500).json({ error: error.message || "Error interno del servidor al procesar la IA." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
