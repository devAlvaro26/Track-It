import React from "react";
import { Game, Language } from "../types";
import { getTranslation } from "../translations";
import * as Icons from "lucide-react";

interface LibraryStatsPanelProps {
  games: Game[];
  language?: Language;
}

export const LibraryStatsPanel: React.FC<LibraryStatsPanelProps> = ({ games, language = "en" }) => {
  const t = getTranslation((language as Language) || "en");

  // Compute stats on the fly
  const totalGames = games.length;
  
  const completedGames = games.filter((g) => g.status === "Completado").length;
  const favoritesGames = games.filter((g) => g.status === "Favoritos").length;
  const playingGames = games.filter((g) => g.status === "Jugando").length;
  const pendingGames = games.filter((g) => g.status === "Pendiente").length;

  const totalHours = games.reduce((acc, g) => acc + (g.playTime || 0), 0);

  // Achievements totals
  let totalAchievementsCount = 0;
  let unlockedAchievementsCount = 0;

  games.forEach((g) => {
    totalAchievementsCount += g.achievements.length;
    unlockedAchievementsCount += g.achievements.filter((a) => a.unlocked).length;
  });

  const completionRate = totalGames > 0 ? Math.round(((completedGames + favoritesGames) / totalGames) * 100) : 0;
  const achievementsRate = totalAchievementsCount > 0 ? Math.round((unlockedAchievementsCount / totalAchievementsCount) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="library-stats-dashboard">
      
      {/* Total Games Metric */}
      <div className="p-4 bg-white dark:bg-[#121212] rounded-xl border border-neutral-200/60 dark:border-white/5 flex items-center gap-4 transition-all hover:border-neutral-300 dark:hover:border-white/10">
        <div className="p-3 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-xl">
          <Icons.Gamepad2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-neutral-400 dark:text-gray-500 tracking-wider">
            {t.totalLibrary}
          </p>
          <p className="text-2xl font-black text-neutral-800 dark:text-white leading-none mt-1">
            {totalGames}
          </p>
          <p className="text-[10px] text-neutral-500 dark:text-gray-400 mt-1">
            {playingGames} {t.inProgress} · {pendingGames} {t.pending}
          </p>
        </div>
      </div>

      {/* Completion Rate Metric */}
      <div className="p-4 bg-white dark:bg-[#121212] rounded-xl border border-neutral-200/60 dark:border-white/5 flex items-center gap-4 transition-all hover:border-neutral-300 dark:hover:border-white/10">
        <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl">
          <Icons.CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase font-bold text-neutral-400 dark:text-gray-500 tracking-wider">
            {t.completionRate}
          </p>
          <p className="text-2xl font-black text-neutral-800 dark:text-white leading-none mt-1">
            {completionRate}%
          </p>
          <p className="text-[10px] text-neutral-500 dark:text-gray-400 mt-1 truncate">
            {completedGames} {t.completed} · {favoritesGames} {t.favorites}
          </p>
        </div>
      </div>

      {/* Total Hours Metric */}
      <div className="p-4 bg-white dark:bg-[#121212] rounded-xl border border-neutral-200/60 dark:border-white/5 flex items-center gap-4 transition-all hover:border-neutral-300 dark:hover:border-white/10">
        <div className="p-3 bg-violet-500/10 text-violet-500 dark:text-violet-400 rounded-xl">
          <Icons.Hourglass className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-neutral-400 dark:text-gray-500 tracking-wider">
            {t.playTime}
          </p>
          <p className="text-2xl font-black text-neutral-800 dark:text-white leading-none mt-1">
            {totalHours}h
          </p>
          <p className="text-[10px] text-neutral-500 dark:text-gray-400 mt-1">
            {t.avgHours}: {totalGames > 0 ? Math.round(totalHours / totalGames) : 0}{t.hoursPerGame}
          </p>
        </div>
      </div>

      {/* Achievements unlocked Metric */}
      <div className="p-4 bg-white dark:bg-[#121212] rounded-xl border border-neutral-200/60 dark:border-white/5 flex items-center gap-4 transition-all hover:border-neutral-300 dark:hover:border-white/10">
        <div className="p-3 bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-xl">
          <Icons.Trophy className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase font-bold text-neutral-400 dark:text-gray-500 tracking-wider">
            {t.achievementsUnlocked}
          </p>
          <p className="text-2xl font-black text-neutral-800 dark:text-white leading-none mt-1">
            {unlockedAchievementsCount} <span className="text-sm font-normal text-neutral-400 dark:text-gray-500">/ {totalAchievementsCount}</span>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 bg-neutral-100 dark:bg-[#1A1A1A] h-1 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${achievementsRate}%` }} />
            </div>
            <span className="text-[9px] font-bold text-neutral-400 dark:text-gray-500">{achievementsRate}%</span>
          </div>
        </div>
      </div>

    </div>
  );
};
