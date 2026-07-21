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
  { id: "gamepad", label: "Mando de juego", icon: "gamepad" },
  { id: "sword", label: "Espada (Acción)", icon: "sword" },
  { id: "shield", label: "Escudo (Aventura/Aventura)", icon: "shield" },
  { id: "crown", label: "Corona (Fantasía/Monarquía)", icon: "crown" },
  { id: "skull", label: "Calavera (Terror/Dificultad)", icon: "skull" },
  { id: "star", label: "Estrella (Plataformas/Especial)", icon: "star" },
  { id: "car", label: "Coche (Carreras)", icon: "car" },
  { id: "bolt", label: "Rayo (Velocidad/Acción)", icon: "bolt" },
  { id: "ghost", label: "Fantasma (Terror/Retro)", icon: "ghost" },
  { id: "compass", label: "Brújula (Exploración)", icon: "compass" },
  { id: "flame", label: "Fuego (Combate/Intenso)", icon: "flame" },
  { id: "trophy", label: "Trofeo (Logros/Competición)", icon: "trophy" },
  { id: "sparkles", label: "Destellos (Magia/Indie)", icon: "sparkles" },
  { id: "target", label: "Diana (Shooter)", icon: "target" },
  { id: "rocket", label: "Cohete (Espacial/Ciencia Ficción)", icon: "rocket" },
];
