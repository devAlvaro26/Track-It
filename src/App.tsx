import { useState, useEffect } from "react";
import { Game, AppSettings, Language } from "./types";
import { GameCard } from "./components/GameCard";
import { GameDetailModal } from "./components/GameDetailModal";
import { AddGameForm } from "./components/AddGameForm";
import { LibraryStatsPanel } from "./components/LibraryStatsPanel";
import { SettingsModal } from "./components/SettingsModal";
import { AuthModal } from "./components/AuthModal";
import { getTranslation, translateGenre } from "./translations";
import {
  db,
  isDatabaseConfigured,
  fetchUserGamesFromDb,
  saveGameToDb,
  deleteGameFromDb,
  fetchUserProfile,
  saveUserProfile,
} from "./lib/database";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // App Settings state (theme, language, username)
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const savedLang = localStorage.getItem("language") as Language | null;
    const savedUser = localStorage.getItem("username");

    return {
      theme: savedTheme || "light",
      language: savedLang || "en",
      username: savedUser || "Gamer",
    };
  });

  const t = getTranslation(settings.language);

  // User Auth & Session state
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);

  // Games list: initialized empty or loaded from database / localStorage for current user
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem("game_library_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading games from localStorage", e);
      }
    }
    return [];
  });

  // UI Modals state
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Search, filter and sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"title" | "playTime" | "rating" | "acquisitionDate">("acquisitionDate");

  // Sync settings & theme to document element and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", settings.theme);
    localStorage.setItem("language", settings.language);
    localStorage.setItem("username", settings.username);
  }, [settings]);

  // Save local games cache
  useEffect(() => {
    if (!user) {
      localStorage.setItem("game_library_user", JSON.stringify(games));
    }
  }, [games, user]);

  // Listen to database auth state
  useEffect(() => {
    if (!db || !isDatabaseConfigured) {
      setAuthLoading(false);
      return;
    }

    db.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser.id, currentUser.user_metadata?.username);
      } else {
        setAuthLoading(false);
      }
    });

    const { data: authListener } = db.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (event === "SIGNED_IN" && currentUser) {
        loadUserData(currentUser.id, currentUser.user_metadata?.username);
      } else if (event === "SIGNED_OUT") {
        setGames([]);
        localStorage.removeItem("game_library_user");
        setAuthLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Load user data from database
  const loadUserData = async (userId: string, defaultUsername?: string) => {
    setSyncLoading(true);
    try {
      // 1. Load user games
      const userGames = await fetchUserGamesFromDb(userId);
      setGames(userGames);

      // 2. Load user profile
      const profile = await fetchUserProfile(userId);
      if (profile) {
        setSettings((prev) => ({
          ...prev,
          username: profile.username || defaultUsername || prev.username,
          language: (profile.language as Language) || prev.language,
          theme: (profile.theme as "light" | "dark") || prev.theme,
        }));
      } else if (defaultUsername) {
        setSettings((prev) => ({ ...prev, username: defaultUsername }));
      }
    } catch (err) {
      console.error("Error loading user data from database:", err);
    } finally {
      setSyncLoading(false);
      setAuthLoading(false);
    }
  };

  // Auth logout handler
  const handleLogout = async () => {
    if (db && isDatabaseConfigured) {
      await db.auth.signOut();
    }
    setUser(null);
    setGames([]);
    localStorage.removeItem("game_library_user");
  };

  // Auth login success handler
  const handleAuthSuccess = (authUser: any, customUsername?: string) => {
    setUser(authUser);
    const uName = customUsername || authUser.user_metadata?.username || authUser.email?.split("@")[0] || "Gamer";
    setSettings((prev) => ({ ...prev, username: uName }));
    loadUserData(authUser.id, uName);
  };

  // Handle settings update
  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    if (user && isDatabaseConfigured) {
      await saveUserProfile(user.id, newSettings);
    }
  };

  // Add a new game
  const handleAddGame = async (newGameData: Omit<Game, "id">) => {
    const newGame: Game = {
      ...newGameData,
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    setGames((prev) => [newGame, ...prev]);
    setIsAddOpen(false);

    if (user && isDatabaseConfigured) {
      try {
        await saveGameToDb(newGame, user.id);
      } catch (err) {
        console.error("Could not sync added game to database:", err);
      }
    }
  };

  // Update game details (achievements, rating, play hours, etc.)
  const handleUpdateGame = async (updatedGame: Game) => {
    setGames((prev) => prev.map((g) => (g.id === updatedGame.id ? updatedGame : g)));

    if (user && isDatabaseConfigured) {
      try {
        await saveGameToDb(updatedGame, user.id);
      } catch (err) {
        console.error("Could not sync updated game to database:", err);
      }
    }
  };

  // Delete a game
  const handleDeleteGame = async (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    setSelectedGameId(null);

    if (user && isDatabaseConfigured) {
      try {
        await deleteGameFromDb(id, user.id);
      } catch (err) {
        console.error("Could not delete game from database:", err);
      }
    }
  };

  // Get current selected game
  const selectedGame = games.find((g) => g.id === selectedGameId);

  // Filter & Sort logic
  const filteredGames = games
    .filter((game) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        game.title.toLowerCase().includes(query) ||
        game.genre.toLowerCase().includes(query) ||
        translateGenre(game.genre, settings.language).toLowerCase().includes(query) ||
        game.barcode.includes(query);

      const matchesStatus = statusFilter === "All" || game.status === statusFilter;
      const matchesPlatform = platformFilter === "All" || game.platforms.includes(platformFilter);

      return matchesSearch && matchesStatus && matchesPlatform;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "playTime") {
        return b.playTime - a.playTime;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "acquisitionDate") {
        return new Date(b.acquisitionDate || 0).getTime() - new Date(a.acquisitionDate || 0).getTime();
      }
      return 0;
    });

  // Extract all available platforms in the library
  const allPlatforms = Array.from(new Set(games.flatMap((g) => g.platforms))).sort();

  return (
    <div className="min-h-screen transition-colors duration-300 bg-neutral-50 dark:bg-[#0A0A0A] text-neutral-800 dark:text-gray-100 font-sans" id="app-root">

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-30 border-b border-neutral-200/60 dark:border-white/5 bg-white/85 dark:bg-[#121212]/90 backdrop-blur-md px-6 py-4" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Logo & User Welcome */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/10 flex items-center justify-center">
              <Icons.Library className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
                  {t.appTitle}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {settings.username}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                {user ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Icons.CloudCheck size={14} />
                    <span>{user.email}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Icons.CloudOff size={14} />
                    <span>{t.guestMode}</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Action Header controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">

            {/* User Auth Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition-all cursor-pointer border border-red-500/20"
                title={t.logoutBtn}
              >
                <Icons.LogOut className="w-4 h-4" />
                <span>{t.logoutBtn}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all cursor-pointer border border-indigo-500/20"
              >
                <Icons.LogIn className="w-4 h-4" />
                <span>{t.loginBtn}</span>
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-white/5 hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer text-neutral-700 dark:text-gray-300 text-xs font-bold"
              title={t.settings}
              id="btn-open-settings"
            >
              <Icons.Settings className="w-4 h-4 text-indigo-500" />
            </button>

            {/* Add Game Button */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/15 transition-all hover:scale-[1.02] cursor-pointer"
              id="btn-open-add"
            >
              <Icons.Plus className="w-4 h-4 stroke-[3]" />
              {t.addGame}
            </button>

          </div>

        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8" id="app-main-content">

        {/* Sync Indicator */}
        {syncLoading && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center gap-2 font-bold animate-pulse">
            <Icons.Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.syncingData}</span>
          </div>
        )}

        {/* Statistics board */}
        <LibraryStatsPanel games={games} language={settings.language} />

        {/* CONTROLS BAR: SEARCH, FILTERS, AND SORTING */}
        <div className="p-5 bg-white dark:bg-[#121212] rounded-2xl border border-neutral-200/60 dark:border-white/5 flex flex-col gap-4" id="controls-section">

          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">

            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <Icons.Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-white/5 rounded-xl text-neutral-800 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                id="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick platform scroll buttons / filter drops */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-white/5 px-3 py-1.5 rounded-xl">
                <Icons.Layers className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-400 font-semibold uppercase mr-1">{t.statusLabel}:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-neutral-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                  id="filter-status"
                >
                  <option value="All">{t.allStatuses}</option>
                  <option value="Pendiente">{t.statusPending}</option>
                  <option value="Jugando">{t.statusPlaying}</option>
                  <option value="Completado">{t.statusCompleted}</option>
                  <option value="Favoritos">{t.statusFavorites}</option>
                </select>
              </div>

              {/* Platform Filter */}
              <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-white/5 px-3 py-1.5 rounded-xl">
                <Icons.MonitorPlay className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-400 font-semibold uppercase mr-1">{t.consoleLabel}:</span>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-neutral-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                  id="filter-platform"
                >
                  <option value="All">{t.allConsoles}</option>
                  {allPlatforms.map((plat) => (
                    <option key={plat} value={plat}>
                      {plat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-white/5 px-3 py-1.5 rounded-xl">
                <Icons.ArrowUpDown className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-400 font-semibold uppercase mr-1">{t.sortByLabel}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-neutral-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                  id="sort-select"
                >
                  <option value="acquisitionDate">{t.sortAcquisitionDate}</option>
                  <option value="title">{t.sortTitle}</option>
                  <option value="playTime">{t.sortPlayTime}</option>
                  <option value="rating">{t.sortRating}</option>
                </select>
              </div>

            </div>

          </div>

          {/* Quick Stats Summary Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 dark:text-gray-400 pt-3 border-t border-neutral-100 dark:border-white/5">
            <p>
              {t.showingCount} <span className="font-bold text-neutral-700 dark:text-gray-200">{filteredGames.length}</span> {t.ofCount} <span className="font-bold">{games.length}</span> {t.titlesInLibrary}
            </p>
            {games.length === 0 && (
              <p className="text-indigo-500 font-semibold">{t.emptyLibraryTip}</p>
            )}
          </div>

        </div>

        {/* GAMES GRID */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#121212] rounded-3xl border border-neutral-200/60 dark:border-white/5 p-8 space-y-4" id="empty-state-view">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto text-neutral-400 dark:text-gray-500">
              <Icons.Gamepad2 size={36} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white">{t.noGamesMatch}</h3>
              <p className="text-sm text-neutral-500 dark:text-gray-400 max-w-md mx-auto">
                {t.noGamesMatchDesc}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                  setPlatformFilter("All");
                  setSortBy("acquisitionDate");
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl hover:bg-indigo-500/5 transition-all cursor-pointer"
              >
                {t.resetFilters}
              </button>
              <button
                onClick={() => setIsAddOpen(true)}
                className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-500 transition-all cursor-pointer shadow-md shadow-indigo-600/15"
              >
                + {t.addGame}
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            id="games-grid"
          >
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  language={settings.language}
                  onClick={() => setSelectedGameId(game.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200/60 dark:border-white/5 bg-white dark:bg-[#121212] py-8 px-6 mt-16 text-center text-xs text-neutral-500 dark:text-gray-400" id="app-footer">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-medium">
            © {new Date().getFullYear()} {t.appTitle}. {t.madeWithLove}
          </p>
          <p className="text-[10px] text-neutral-400 dark:text-gray-500">
            {t.footerTechNote} • {user ? t.cloudSynced : t.localStorageNotice}
          </p>
        </div>
      </footer>

      {/* SETTINGS MODAL OVERLAY */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* AUTH MODAL OVERLAY */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            language={settings.language}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>

      {/* DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedGame && (
          <GameDetailModal
            game={selectedGame}
            language={settings.language}
            onClose={() => setSelectedGameId(null)}
            onUpdate={handleUpdateGame}
            onDelete={handleDeleteGame}
          />
        )}
      </AnimatePresence>

      {/* ADD GAME FORM OVERLAY */}
      <AnimatePresence>
        {isAddOpen && (
          <AddGameForm
            language={settings.language}
            onClose={() => setIsAddOpen(false)}
            onAdd={handleAddGame}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
