import React, { useState } from "react";
import { Game, Achievement, GameStatus, Language } from "../types";
import { AVAILABLE_SYMBOLS } from "./GameIcon";
import { ConsolePicker } from "./ConsolePicker";
import { getTranslation } from "../translations";
import * as Icons from "lucide-react";

interface AddGameFormProps {
  onClose: () => void;
  onAdd: (game: Omit<Game, "id">) => void;
  language?: Language;
}

export const AddGameForm: React.FC<AddGameFormProps> = ({ onClose, onAdd, language = "es" }) => {
  const t = getTranslation(language);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [releaseDate, setReleaseDate] = useState("");
  const [barcode, setBarcode] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().split("T")[0]);
  const [rating, setRating] = useState<number>(5);
  const [playTime, setPlayTime] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>("Pendiente");
  const [coverColor, setCoverColor] = useState("#0f172a");
  const [coverSymbol, setCoverSymbol] = useState("gamepad");
  const [notes, setNotes] = useState("");
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // AI Loading and error states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Platform multi-select helper
  const availablePlatforms = ["Nintendo Switch", "PlayStation 5", "PlayStation 4", "Xbox Series X", "Xbox One", "PC", "Retro"];

  const togglePlatform = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  // Hit the server-side endpoint `/api/enrich-game` using fetch
  const handleAiAutofill = async () => {
    if (!title.trim()) {
      setAiError(t.aiErrorTitlePrompt);
      return;
    }

    setIsAiLoading(true);
    setAiError("");

    try {
      const response = await fetch("/api/enrich-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, language }),
      });

      if (!response.ok) {
        throw new Error(t.aiConnectionError);
      }

      const data = await response.json();

      // Populate form state with AI response
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.genre) setGenre(data.genre);
      if (data.platforms && Array.isArray(data.platforms)) {
        setPlatforms(data.platforms);
      }
      if (data.releaseDate) setReleaseDate(data.releaseDate);
      if (data.barcode) setBarcode(data.barcode);
      if (data.coverColor) setCoverColor(data.coverColor);
      if (data.coverSymbol) setCoverSymbol(data.coverSymbol);
      if (data.achievements && Array.isArray(data.achievements)) {
        const enrichedAchievements: Achievement[] = data.achievements.map((ach: any, idx: number) => ({
          id: `ach-gen-${Date.now()}-${idx}`,
          name: ach.name || t.newAchievementName,
          description: ach.description || t.newAchievementDesc,
          difficulty: ach.difficulty === "Fácil" || ach.difficulty === "Medio" || ach.difficulty === "Difícil" ? ach.difficulty : "Medio",
          unlocked: false,
        }));
        setAchievements(enrichedAchievements);
      }
    } catch (error: any) {
      console.error("Error AI autofill:", error);
      setAiError(error.message || t.aiConnectionError);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || t.noDescriptionProvided,
      genre: genre.trim() || "Otros",
      platforms: platforms.length > 0 ? platforms : ["PC"],
      releaseDate: releaseDate || new Date().toISOString().split("T")[0],
      barcode: barcode.trim() || Math.floor(Math.random() * 9000000000000 + 1000000000000).toString(),
      acquisitionDate: acquisitionDate || new Date().toISOString().split("T")[0],
      rating,
      playTime: Number(playTime) || 0,
      status,
      coverColor,
      coverSymbol,
      achievements,
      notes: notes.trim(),
    });
  };

  const handleAddManualAchievement = () => {
    const newAch: Achievement = {
      id: `ach-manual-${Date.now()}`,
      name: `${t.newAchievementName} #${achievements.length + 1}`,
      description: t.newAchievementDesc,
      difficulty: "Medio",
      unlocked: false,
    };
    setAchievements([...achievements, newAch]);
  };

  const handleUpdateAchievement = (id: string, fields: Partial<Achievement>) => {
    setAchievements(
      achievements.map((ach) => (ach.id === id ? { ...ach, ...fields } : ach))
    );
  };

  const handleRemoveAchievement = (id: string) => {
    setAchievements(achievements.filter((ach) => ach.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" id="add-game-modal-container">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#121212] rounded-2xl shadow-xl overflow-hidden my-8" id="add-game-modal">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-white/5">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
            <Icons.PlusSquare className="w-5 h-5 text-indigo-500" />
            {t.addGameTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-full transition-colors"
            id="close-add-modal"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-180px)] space-y-6">
          
          {/* Smart AI Section */}
          <div className="p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-400 flex items-center gap-1.5">
                  <Icons.Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                  {t.aiAssistantTitle}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-gray-400">
                  {t.aiAssistantDesc}
                </p>
              </div>
              <button
                type="button"
                disabled={isAiLoading || !title.trim()}
                onClick={handleAiAutofill}
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-500 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
                id="btn-ai-autofill"
              >
                {isAiLoading ? (
                  <>
                    <Icons.Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.aiSearching}
                  </>
                ) : (
                  <>
                    <Icons.Sparkles className="w-3.5 h-3.5 fill-white" />
                    {t.aiAutofillBtn}
                  </>
                )}
              </button>
            </div>
            {aiError && (
              <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <Icons.AlertCircle className="w-3.5 h-3.5" />
                {aiError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                  {t.gameTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.gameTitlePlaceholder}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  id="input-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                    {t.genreLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.genrePlaceholder}
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    id="input-genre"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                    {t.releaseLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.releasePlaceholder}
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    id="input-release-date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                  {t.barcodeLabel}
                </label>
                <div className="relative">
                  <Icons.Barcode className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder={t.barcodePlaceholder}
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={13}
                    className="w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-mono"
                    id="input-barcode"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                  {t.descriptionLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.descriptionPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
                  id="input-description"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-2">
                  {t.platformsLabel}
                </label>
                <ConsolePicker
                  selectedPlatforms={platforms}
                  onChange={setPlatforms}
                  language={language}
                />
              </div>
            </div>

            {/* Right Column: User-Specific Collection Details & Cover Customization */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                    {t.collectionStatusLabel}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as GameStatus)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                    id="select-status"
                  >
                    <option value="Pendiente">{t.pendingToPlayOption}</option>
                    <option value="Jugando">{t.currentlyPlayingOption}</option>
                    <option value="Completado">{t.completedOption}</option>
                    <option value="Favoritos">{t.favoritesOption}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                    {t.acquisitionDateLabel}
                  </label>
                  <input
                    type="date"
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                    id="input-acquisition-date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                    {t.personalRatingLabel}
                  </label>
                  <div className="flex items-center gap-1.5 h-[38px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Icons.Star
                          className={`w-6 h-6 ${star <= rating ? "fill-amber-400" : "text-neutral-300 dark:text-gray-700"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                    {t.playHoursLabel}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder={t.hours}
                    value={playTime || ""}
                    onChange={(e) => setPlayTime(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    id="input-playtime"
                  />
                </div>
              </div>

              {/* Cover Design Settings */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-[#1A1A1A]/40 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-gray-300 flex items-center gap-1">
                  <Icons.Palette className="w-3.5 h-3.5" />
                  {t.coverDesignTitle}
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                      {t.bgColorLabel}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={coverColor}
                        onChange={(e) => setCoverColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-200 dark:border-gray-700 p-0 overflow-hidden"
                      />
                      <span className="text-xs font-mono">{coverColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                      {t.centralSymbolLabel}
                    </label>
                    <select
                      value={coverSymbol}
                      onChange={(e) => setCoverSymbol(e.target.value)}
                      className="w-full px-2 py-1.5 border border-neutral-200 dark:border-white/5 rounded-lg bg-white dark:bg-[#121212] text-neutral-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                    >
                      {AVAILABLE_SYMBOLS.map((sym) => (
                        <option key={sym.id} value={sym.icon}>
                          {sym.label[language] || sym.label["es"]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                  {t.collectorNotesLabel}
                </label>
                <textarea
                  rows={2}
                  placeholder={t.collectorNotesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
                  id="input-notes"
                />
              </div>

            </div>

          </div>

          {/* Achievements Manager (Logros) */}
          <div className="border-t border-neutral-100 dark:border-white/5 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-800 dark:text-white flex items-center gap-1.5">
                  <Icons.Trophy className="w-4 h-4 text-indigo-500" />
                  {t.gameAchievementsTitle} ({achievements.length})
                </h3>
                <p className="text-xs text-neutral-500 dark:text-gray-400">
                  {t.gameAchievementsDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddManualAchievement}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] rounded-lg font-semibold text-neutral-700 dark:text-gray-300 cursor-pointer transition-all"
                id="btn-add-achievement"
              >
                <Icons.Plus className="w-3.5 h-3.5" />
                {t.addAchievementBtn}
              </button>
            </div>

            {achievements.length === 0 ? (
              <div className="text-center py-6 px-4 border-2 border-dashed border-neutral-100 dark:border-white/5 rounded-xl text-xs text-neutral-400 dark:text-gray-500">
                {t.noAchievementsEmptyHint}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="achievements-form-grid">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-3 border border-neutral-100 dark:border-white/5 rounded-xl bg-neutral-50/50 dark:bg-[#1A1A1A]/30 relative space-y-2 group"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(ach.id)}
                      className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-rose-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title={t.delete}
                    >
                      <Icons.Trash className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          required
                          value={ach.name}
                          placeholder={t.achievementNamePlaceholder}
                          onChange={(e) => handleUpdateAchievement(ach.id, { name: e.target.value })}
                          className="w-full bg-transparent border-b border-neutral-200 dark:border-gray-700 focus:border-indigo-500 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none pb-0.5"
                        />
                      </div>
                      <div>
                        <select
                          value={ach.difficulty}
                          onChange={(e) => handleUpdateAchievement(ach.id, { difficulty: e.target.value as "Fácil" | "Medio" | "Difícil" })}
                          className="w-full bg-transparent text-[10px] font-semibold uppercase text-neutral-500 focus:outline-none cursor-pointer"
                        >
                          <option value="Fácil">{t.difficultyEasy}</option>
                          <option value="Medio">{t.difficultyMedium}</option>
                          <option value="Difícil">{t.difficultyHard}</option>
                        </select>
                      </div>
                    </div>

                    <input
                      type="text"
                      required
                      value={ach.description}
                      placeholder={t.achievementUnlockHow}
                      onChange={(e) => handleUpdateAchievement(ach.id, { description: e.target.value })}
                      className="w-full bg-transparent text-xs text-neutral-500 dark:text-gray-400 focus:outline-none"
                    />

                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="checkbox"
                        checked={ach.unlocked}
                        id={`check-${ach.id}`}
                        onChange={(e) => handleUpdateAchievement(ach.id, { 
                          unlocked: e.target.checked,
                          unlockedAt: e.target.checked ? new Date().toISOString().split("T")[0] : undefined
                        })}
                        className="w-3.5 h-3.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor={`check-${ach.id}`} className="text-[11px] text-neutral-500 dark:text-neutral-400 select-none cursor-pointer">
                        {t.alreadyUnlockedQuestion}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="border-t border-neutral-100 dark:border-white/5 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-[#CCCCCC] border border-neutral-200 dark:border-white/5 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
              id="btn-cancel-add"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-500 rounded-lg shadow-sm transition-all cursor-pointer"
              id="btn-submit-add"
            >
              {t.saveToLibraryBtn}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
