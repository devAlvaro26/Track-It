export interface Achievement {
  id: string;
  name: string;
  description: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  unlocked: boolean;
  unlockedAt?: string; // date string
}

export type GameStatus = "Pendiente" | "Jugando" | "Completado" | "Favoritos";

export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  platforms: string[];
  releaseDate: string; // release date / year
  barcode: string; // barcode string
  acquisitionDate: string; // user acquisition date
  rating: number; // 1-5 stars
  playTime: number; // in hours
  status: GameStatus;
  coverColor: string; // Hex color for fallback covers
  coverSymbol: string; // Lucide icon name for fallback covers
  coverImage?: string; // User-provided image URL
  achievements: Achievement[];
  notes?: string; // custom personal notes
}

export type Language = "es" | "en";

export interface AppSettings {
  theme: "light" | "dark";
  language: Language;
  username: string;
}

export interface LibraryStats {
  totalGames: number;
  completedGames: number;
  totalHours: number;
  totalAchievementsUnlocked: number;
  totalAchievements: number;
}
