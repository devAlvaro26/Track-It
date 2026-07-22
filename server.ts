import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

let cachedTwitchToken: { token: string; expiresAt: number } | null = null;

/**
 * Retrieves Twitch OAuth App Access Token required for IGDB API v4 calls.
 */
async function getTwitchToken(): Promise<string | null> {
  const clientId = (process.env.TWITCH_CLIENT_ID || process.env.IGDB_CLIENT_ID || "").trim();
  const clientSecret = (process.env.TWITCH_CLIENT_SECRET || process.env.IGDB_CLIENT_SECRET || "").trim();

  // Guard against missing, empty or placeholder credentials
  if (!clientId || !clientSecret || clientId.toLowerCase().includes("your_") || clientSecret.toLowerCase().includes("your_")) {
    return null;
  }

  if (cachedTwitchToken && cachedTwitchToken.expiresAt > Date.now() + 60000) {
    return cachedTwitchToken.token;
  }

  try {
    const res = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Twitch OAuth token request status", res.status, ":", errText);
      return null;
    }

    const data = await res.json();
    cachedTwitchToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000),
    };

    return cachedTwitchToken.token;
  } catch (err) {
    console.warn("Error fetching Twitch access token:", err);
    return null;
  }
}

/**
 * Formats IGDB image_id or raw URL into a high-resolution cover image URL (t_cover_big_2x)
 */
function formatIgdbCoverUrl(raw: any): string | undefined {
  if (!raw) return undefined;

  if (typeof raw === "string") {
    if (raw.startsWith("http") || raw.startsWith("//")) {
      const url = raw.startsWith("//") ? `https:${raw}` : raw;
      return url.replace("/t_thumb/", "/t_cover_big_2x/");
    }
    return `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${raw}.jpg`;
  }

  if (raw.image_id) {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${raw.image_id}.jpg`;
  }

  if (raw.url) {
    const url = raw.url.startsWith("//") ? `https:${raw.url}` : raw.url;
    return url.replace("/t_thumb/", "/t_cover_big_2x/");
  }

  return undefined;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Check IGDB configuration status
  app.get("/api/igdb/status", async (req, res) => {
    const clientId = process.env.TWITCH_CLIENT_ID || process.env.IGDB_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET || process.env.IGDB_CLIENT_SECRET;
    const isConfigured = Boolean(clientId && clientSecret);

    res.json({
      configured: isConfigured,
      clientIdPresent: Boolean(clientId),
      clientSecretPresent: Boolean(clientSecret),
    });
  });

  // Search games in IGDB API v4
  app.post("/api/igdb/search", async (req, res) => {
    try {
      const { query, limit = 10 } = req.body;
      if (!query || typeof query !== "string" || !query.trim()) {
        return res.status(400).json({ error: "El término de búsqueda es requerido." });
      }

      const clientId = process.env.TWITCH_CLIENT_ID || process.env.IGDB_CLIENT_ID;
      const token = await getTwitchToken();

      if (clientId && token) {
        // Direct IGDB v4 Search
        const sanitizedQuery = query.trim().replace(/"/g, '\\"');
        const igdbBody = `search "${sanitizedQuery}"; fields name, summary, storyline, first_release_date, genres.name, platforms.name, cover.url, cover.image_id, total_rating, rating, url; limit ${limit};`;

        const igdbRes = await fetch("https://api.igdb.com/v4/games", {
          method: "POST",
          headers: {
            "Client-ID": clientId,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
          body: igdbBody,
        });

        if (igdbRes.ok) {
          const rawGames = await igdbRes.json();
          const games = rawGames.map((g: any) => ({
            id: g.id,
            name: g.name,
            summary: g.summary || g.storyline || "",
            firstReleaseDate: g.first_release_date 
              ? new Date(g.first_release_date * 1000).toISOString().split("T")[0]
              : "",
            genres: g.genres ? g.genres.map((gen: any) => gen.name) : [],
            platforms: g.platforms ? g.platforms.map((p: any) => p.name) : [],
            coverUrl: formatIgdbCoverUrl(g.cover),
            rating: g.total_rating || g.rating ? Math.round(g.total_rating || g.rating) : undefined,
            url: g.url || `https://www.igdb.com/games/${g.id}`,
          }));

          return res.json({ games, source: "igdb", configured: true });
        }
        console.warn("IGDB search call returned status:", igdbRes.status);
      }

      return res.json({
        games: [],
        source: "igdb",
        configured: false,
        message: "Configura TWITCH_CLIENT_ID y TWITCH_CLIENT_SECRET en el archivo .env para realizar búsquedas en IGDB."
      });

    } catch (error: any) {
      console.error("Error en /api/igdb/search:", error);
      res.status(500).json({ error: error.message || "Error al buscar juegos en IGDB." });
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

