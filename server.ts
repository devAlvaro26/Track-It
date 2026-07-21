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
      const { title, language = "es" } = req.body;
      if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "El título es obligatorio y debe ser un texto válido." });
      }

      const targetLangName = language === "en" ? "English" : "Spanish";

      const prompt = `Proporciona información detallada en ${targetLangName} para el videojuego "${title}".
      Queremos datos precisos y elegantes para una biblioteca digital personal de coleccionista.
      Completa la información incluyendo su descripción en ${targetLangName}, año/fecha de lanzamiento, un código de barras representativo (EAN o UPC realista de este juego), género principal en ${targetLangName}, plataformas habituales, logros divertidos u oficiales en ${targetLangName}, y sugerencias visuales de diseño para crear una carátula digital minimalista (un color de fondo elegante y un símbolo o ícono representativo).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Official corrected title of the game." },
              description: { type: Type.STRING, description: `A brief, elegant, and professional description in ${targetLangName} (max 3 sentences).` },
              releaseDate: { type: Type.STRING, description: "Official approximate release date in YYYY-MM-DD or YYYY format." },
              barcode: { type: Type.STRING, description: "Representative realistic 12 or 13 digit numeric barcode." },
              genre: { type: Type.STRING, description: `Main genre in ${targetLangName} (e.g. Action RPG, Platformer, Adventure, Horror, Racing).` },
              platforms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key platforms where the game is available (e.g. Nintendo Switch, PlayStation 5, PC, Xbox Series X)."
              },
              coverColor: { type: Type.STRING, description: "An elegant hex color (e.g. #1e293b, #059669, #7c3aed, #db2777) representing the game's aesthetic." },
              coverSymbol: { type: Type.STRING, description: "A simple Lucide icon name (e.g. 'sword', 'shield', 'gamepad', 'crown', 'ghost', 'trophy', 'compass', 'flame', 'music', 'skull', 'heart', 'star', 'rocket', 'target', 'wrench', 'car') matching the theme." },
              achievements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: `Name of the achievement in ${targetLangName}.` },
                    description: { type: Type.STRING, description: `Clear objective description in ${targetLangName}.` },
                    difficulty: { type: Type.STRING, description: "Difficulty: 'Fácil', 'Medio', or 'Difícil'." }
                  },
                  required: ["name", "description", "difficulty"]
                },
                description: `List of 4 iconic achievements in ${targetLangName} for this game.`
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
