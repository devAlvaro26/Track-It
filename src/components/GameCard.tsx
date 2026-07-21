import React from "react";
import { motion } from "motion/react";
import { Game, Language } from "../types";
import { GameIcon } from "./GameIcon";
import { getTranslation, translateGenre } from "../translations";
import * as Icons from "lucide-react";

interface GameCardProps {
  game: Game;
  onClick: () => void;
  language?: Language;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick, language = "es" }) => {
  const t = getTranslation(language);

  const totalAchievements = game.achievements.length;
  const unlockedAchievements = game.achievements.filter((a) => a.unlocked).length;
  const achievementProgress = totalAchievements > 0 
    ? Math.round((unlockedAchievements / totalAchievements) * 100) 
    : 0;

  // Status tag configuration matching clear/dark mode aesthetics
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    Pendiente: { bg: "bg-amber-100 dark:bg-amber-950/40", text: "text-amber-800 dark:text-amber-300", label: t.statusPendingTag },
    Jugando: { bg: "bg-sky-100 dark:bg-sky-950/40", text: "text-sky-800 dark:text-sky-300", label: t.statusPlayingTag },
    Completado: { bg: "bg-emerald-100 dark:bg-emerald-950/40", text: "text-emerald-800 dark:text-emerald-300", label: t.statusCompletedTag },
    Favoritos: { bg: "bg-rose-100 dark:bg-rose-950/40", text: "text-rose-800 dark:text-rose-300", label: t.statusFavoriteTag },
  };

  const statusStyle = statusConfig[game.status] || { bg: "bg-slate-100", text: "text-slate-800", label: game.status };

  const locale = language === "en" ? "en-US" : "es-ES";

  return (
    <motion.div
      layoutId={`game-card-${game.id}`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group relative flex flex-col h-[400px] w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl bg-white dark:bg-[#0F0F0F] border border-neutral-200/60 dark:border-white/5 cursor-pointer transition-shadow"
      id={`card-${game.id}`}
    >
      {/* 3:4 Aspect Ratio Cover Box */}
      <div className="relative h-[280px] w-full overflow-hidden flex flex-col justify-between p-4" style={{ backgroundColor: game.coverColor }}>
        
        {/* Abstract pattern overlays for premium collector's edition aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 opacity-70 pointer-events-none" />
        
        {/* Platform logo & Star Rating (Top Bar) */}
        <div className="z-10 flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-md">
            {game.platforms[0] || "GAME"}
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icons.Star
                key={i}
                className={`w-3.5 h-3.5 ${i < game.rating ? "text-amber-400 fill-amber-400" : "text-white/20"}`}
              />
            ))}
          </div>
        </div>

        {/* Central Symbol Cover Art (debossed emblem effect) */}
        <div className="z-10 flex flex-col items-center justify-center py-6">
          <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <GameIcon name={game.coverSymbol} className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]" size={42} />
          </div>
        </div>

        {/* Cover footer text with title & genre */}
        <div className="z-10">
          <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-0.5 truncate">
            {translateGenre(game.genre, language)}
          </p>
          <h3 className="text-lg font-bold text-white leading-snug tracking-tight line-clamp-2 drop-shadow-sm">
            {game.title}
          </h3>
        </div>
      </div>

      {/* Game info content area */}
      <div className="flex-1 p-4 flex flex-col justify-between bg-white dark:bg-[#0F0F0F]">
        
        {/* Status and Acquisition Date */}
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.label}
          </span>
          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-gray-400">
            <Icons.Calendar className="w-3.5 h-3.5" />
            <span>{game.acquisitionDate ? new Date(game.acquisitionDate).toLocaleDateString(locale, { year: "numeric", month: "short" }) : "N/A"}</span>
          </div>
        </div>

        {/* Progress on Achievements */}
        <div className="mt-auto">
          {totalAchievements > 0 ? (
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-neutral-500 dark:text-gray-400 flex items-center gap-1">
                  <Icons.Trophy className="w-3.5 h-3.5 text-indigo-500" />
                  {t.achievementsLabel}: {unlockedAchievements}/{totalAchievements}
                </span>
                <span className="font-semibold text-neutral-700 dark:text-gray-300">
                  {achievementProgress}%
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${achievementProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-xs text-neutral-400 dark:text-gray-500 italic flex items-center gap-1">
              <Icons.Trophy className="w-3.5 h-3.5 opacity-50" />
              {t.noAchievementsRecorded}
            </div>
          )}
        </div>

        {/* Footer Play Hours */}
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-neutral-100 dark:border-white/5 text-[11px] text-neutral-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <Icons.Clock className="w-3 h-3" /> {game.playTime}h {t.hoursPlayed}
          </span>
          {game.barcode && (
            <span className="font-mono text-[9px] tracking-wider truncate max-w-[100px]" title={`${t.barcodeShort}: ${game.barcode}`}>
              ‖ {game.barcode}
            </span>
          )}
        </div>

      </div>
    </motion.div>
  );
};
