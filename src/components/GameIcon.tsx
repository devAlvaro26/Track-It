import React from "react";
import * as Icons from "lucide-react";

interface GameIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const GameIcon: React.FC<GameIconProps> = ({ name, className = "", size = 24 }) => {
  // Normalize the name to match standard Lucide component names (CamelCase)
  const normalizedName = name.trim().toLowerCase();
  
  // Custom dictionary mapping simple strings to Lucide components
  const iconMap: Record<string, keyof typeof Icons> = {
    sword: "Sword",
    shield: "Shield",
    gamepad: "Gamepad2",
    gamepad2: "Gamepad2",
    crown: "Crown",
    ghost: "Ghost",
    trophy: "Trophy",
    compass: "Compass",
    flame: "Flame",
    music: "Music",
    skull: "Skull",
    heart: "Heart",
    star: "Star",
    rocket: "Rocket",
    target: "Target",
    wrench: "Wrench",
    car: "Car",
    bolt: "Bolt",
    sparkles: "Sparkles",
    book: "BookOpen",
    calendar: "Calendar",
    barcode: "Barcode",
    user: "User",
    clock: "Clock",
  };

  const lucideKey = iconMap[normalizedName] || "Gamepad2";
  const LucideIcon = Icons[lucideKey] as React.ComponentType<any>;

  if (!LucideIcon) {
    return <Icons.Gamepad2 className={className} size={size} id="default-game-icon" />;
  }

  return <LucideIcon className={className} size={size} id={`game-icon-${normalizedName}`} />;
};

// Available icons to choose from in the "add game" dropdown picker
export const AVAILABLE_SYMBOLS = [
  { id: "gamepad", label: { es: "Mando de juego", en: "Game Controller" }, icon: "gamepad" },
  { id: "sword", label: { es: "Espada (Acción)", en: "Sword (Action)" }, icon: "sword" },
  { id: "shield", label: { es: "Escudo (Aventura/Aventura)", en: "Shield (Adventure)" }, icon: "shield" },
  { id: "crown", label: { es: "Corona (Fantasía/Monarquía)", en: "Crown (Fantasy/Monarchy)" }, icon: "crown" },
  { id: "skull", label: { es: "Calavera (Terror/Dificultad)", en: "Skull (Horror/Difficulty)" }, icon: "skull" },
  { id: "star", label: { es: "Estrella (Plataformas/Especial)", en: "Star (Platformer/Special)" }, icon: "star" },
  { id: "car", label: { es: "Coche (Carreras)", en: "Car (Racing)" }, icon: "car" },
  { id: "bolt", label: { es: "Rayo (Velocidad/Acción)", en: "Bolt (Speed/Action)" }, icon: "bolt" },
  { id: "ghost", label: { es: "Fantasma (Terror/Retro)", en: "Ghost (Horror/Retro)" }, icon: "ghost" },
  { id: "compass", label: { es: "Brújula (Exploración)", en: "Compass (Exploration)" }, icon: "compass" },
  { id: "flame", label: { es: "Fuego (Combate/Intenso)", en: "Flame (Combat/Intense)" }, icon: "flame" },
  { id: "trophy", label: { es: "Trofeo (Logros/Competición)", en: "Trophy (Achievements/Competition)" }, icon: "trophy" },
  { id: "sparkles", label: { es: "Destellos (Magia/Indie)", en: "Sparkles (Magic/Indie)" }, icon: "sparkles" },
  { id: "target", label: { es: "Diana (Shooter)", en: "Target (Shooter)" }, icon: "target" },
  { id: "rocket", label: { es: "Cohete (Espacial/Ciencia Ficción)", en: "Rocket (Sci-Fi/Space)" }, icon: "rocket" },
];
