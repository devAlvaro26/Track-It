import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Game, Achievement, GameStatus, Language, IgdbSearchResult } from "../types";
import { GameIcon, AVAILABLE_SYMBOLS } from "./GameIcon";
import { ConsolePicker } from "./ConsolePicker";
import { IgdbSearchModal } from "./IgdbSearchModal";
import { getTranslation, translateGenre, translateSymbolLabel } from "../translations";
import * as Icons from "lucide-react";

interface GameDetailModalProps {
  game: Game;
  onClose: () => void;
  onUpdate: (game: Game) => void;
  onDelete: (id: string) => void;
  language?: Language;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose, onUpdate, onDelete, language = "en" }) => {
  const t = getTranslation(language);

  const [isEditing, setIsEditing] = useState(false);
  const [showIgdbModal, setShowIgdbModal] = useState(false);
  const [editImportNotice, setEditImportNotice] = useState("");

  const [editTitle, setEditTitle] = useState(game.title);
  const [editDescription, setEditDescription] = useState(game.description);
  const [editGenre, setEditGenre] = useState(game.genre);
  const [editBarcode, setEditBarcode] = useState(game.barcode);
  const [editAcquisitionDate, setEditAcquisitionDate] = useState(game.acquisitionDate);
  const [editReleaseDate, setEditReleaseDate] = useState(game.releaseDate);
  const [editRating, setEditRating] = useState(game.rating);
  const [editPlayTime, setEditPlayTime] = useState(game.playTime);
  const [editStatus, setEditStatus] = useState(game.status);
  const [editCoverColor, setEditCoverColor] = useState(game.coverColor);
  const [editCoverSymbol, setEditCoverSymbol] = useState(game.coverSymbol);
  const [editCoverImage, setEditCoverImage] = useState(game.coverImage || "");
  const [editIgdbId, setEditIgdbId] = useState<number | undefined>(game.igdbId);
  const [editIgdbRating, setEditIgdbRating] = useState<number | undefined>(game.igdbRating);
  const [editIgdbUrl, setEditIgdbUrl] = useState<string | undefined>(game.igdbUrl);
  const [editNotes, setEditNotes] = useState(game.notes || "");
  const [editPlatforms, setEditPlatforms] = useState<string[]>(game.platforms);

  // Toggle achievement unlock status
  const handleToggleAchievement = (achievementId: string) => {
    const updatedAchievements = game.achievements.map((ach) => {
      if (ach.id === achievementId) {
        const nextUnlocked = !ach.unlocked;
        return {
          ...ach,
          unlocked: nextUnlocked,
          unlockedAt: nextUnlocked ? new Date().toISOString().split("T")[0] : undefined,
        };
      }
      return ach;
    });

    onUpdate({
      ...game,
      achievements: updatedAchievements,
    });
  };

  // Quick save for notes/hours/rating in view mode
  const handleSaveQuickEdits = (field: keyof Game, value: any) => {
    onUpdate({
      ...game,
      [field]: value,
    });
  };

  // Full save from editing form
  const handleSaveFullEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...game,
      title: editTitle.trim(),
      description: editDescription.trim(),
      genre: editGenre.trim(),
      barcode: editBarcode.trim(),
      acquisitionDate: editAcquisitionDate,
      releaseDate: editReleaseDate,
      rating: editRating,
      playTime: Number(editPlayTime),
      status: editStatus,
      coverColor: editCoverColor,
      coverSymbol: editCoverSymbol,
      coverImage: editCoverImage.trim() || undefined,
      igdbId: editIgdbId,
      igdbRating: editIgdbRating,
      igdbUrl: editIgdbUrl,
      platforms: editPlatforms,
      notes: editNotes.trim(),
    });
    setIsEditing(false);
  };

  // Handle game select from IGDB modal while editing
  const handleSelectIgdbGame = (selected: IgdbSearchResult) => {
    setShowIgdbModal(false);
    if (selected.name) setEditTitle(selected.name);
    if (selected.summary) setEditDescription(selected.summary);
    if (selected.firstReleaseDate) setEditReleaseDate(selected.firstReleaseDate);
    if (selected.genres && selected.genres.length > 0) setEditGenre(selected.genres[0]);
    if (selected.platforms && selected.platforms.length > 0) setEditPlatforms(selected.platforms);
    if (selected.coverUrl) setEditCoverImage(selected.coverUrl);
    if (selected.id) setEditIgdbId(selected.id);
    if (selected.rating) setEditIgdbRating(selected.rating);
    if (selected.url) setEditIgdbUrl(selected.url);

    setEditImportNotice(t.igdbImportSuccess.replace("{name}", selected.name || ""));
  };

  // Helper to render vector EAN-13 barcode
  const renderBarcodeSVG = (code: string) => {
    const cleanCode = code.replace(/[^0-9]/g, "") || "0000000000000";
    const bars: boolean[] = [];
    bars.push(true, false, true);
    
    for (let i = 0; i < cleanCode.length; i++) {
      const digit = parseInt(cleanCode[i] || "0");
      const pattern = [
        [true, false, true, false, false],
        [true, true, false, false, true],
        [true, false, true, true, false],
        [false, true, true, false, true],
        [true, false, false, true, true],
        [false, true, false, true, true],
        [true, true, false, true, false],
        [true, false, true, false, true],
        [false, false, true, true, true],
        [true, true, true, false, false],
      ][digit % 10];
      
      bars.push(...pattern);
      if (i === 5) {
        bars.push(false, true, false, true, false);
      }
    }
    bars.push(true, false, true);

    return (
      <div className="flex flex-col items-center bg-white p-3 rounded-lg border border-neutral-200 shadow-sm max-w-[180px] mx-auto select-none">
        <svg viewBox="0 0 100 40" className="w-full h-10">
          <g fill="#000000">
            {bars.map((isBlack, index) => {
              if (isBlack) {
                return (
                  <rect
                    key={index}
                    x={(index * 1.1) + 2}
                    y="1"
                    width="0.9"
                    height="32"
                  />
                );
              }
              return null;
            })}
          </g>
        </svg>
        <div className="font-mono text-[9px] tracking-[3px] text-black mt-1 text-center font-bold">
          {cleanCode.substring(0, 1)} {cleanCode.substring(1, 7)} {cleanCode.substring(7, 13)}
        </div>
      </div>
    );
  };

  // Achievement ratios
  const totalAchievements = game.achievements.length;
  const unlockedCount = game.achievements.filter((a) => a.unlocked).length;
  const progressPercent = totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;
  const locale = language === "en" ? "en-US" : "es-ES";

  return (
    <>
      {showIgdbModal && (
        <IgdbSearchModal
          initialQuery={editTitle}
          onClose={() => setShowIgdbModal(false)}
          onSelectGame={handleSelectIgdbGame}
          language={language}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-hidden" id="detail-modal-container">
        
        {/* Container */}
        <motion.div
          layoutId={`game-card-${game.id}`}
          className={`relative w-full ${isEditing ? "max-w-3xl" : "max-w-4xl"} bg-white dark:bg-[#121212] rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col my-auto`}
          id="detail-modal"
        >
          
          {/* Close Button - View mode only */}
          {!isEditing && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full transition-all cursor-pointer shadow-lg"
              id="close-detail-modal"
              title={t.close}
            >
              <Icons.X className="w-5 h-5" />
            </button>
          )}

          <AnimatePresence mode="wait">
            {!isEditing ? (
              /* ================= VIEW MODE ================= */
              <div className="flex flex-col md:flex-row h-full overflow-y-auto max-h-[90vh]">
                
                {/* Left Pane: Interactive Cover & Barcode Side */}
                <div
                  className="w-full md:w-1/3 p-6 flex flex-col justify-between text-white relative min-h-[400px] overflow-hidden"
                  style={{ backgroundColor: game.coverColor }}
                >
                  {/* High-res IGDB Cover Background Image if available */}
                  {game.coverImage ? (
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />

                  <div className="z-10 flex justify-between items-start gap-3 mb-2">
                    <div className="flex flex-wrap gap-1 flex-1 min-w-0 pr-1 items-center">
                      {game.platforms && game.platforms.length > 0 ? (
                        game.platforms.map((plat) => (
                          <span
                            key={plat}
                            className="text-[10px] font-bold tracking-wider text-white/95 uppercase px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-md shadow-sm border border-white/10 whitespace-nowrap"
                          >
                            {plat}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-bold tracking-wider text-white/95 uppercase px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-md shadow-sm border border-white/10">
                          PC
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 shrink-0 ml-auto">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 border border-white/10 transition-all cursor-pointer"
                        title={t.edit}
                        id="btn-edit-mode"
                      >
                        <Icons.Edit3 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${t.confirmDeleteGame}`)) {
                            onDelete(game.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-600/85 border border-white/10 transition-all cursor-pointer"
                        title={t.delete}
                        id="btn-delete-game"
                      >
                        <Icons.Trash className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Cover Display */}
                  <div className="z-10 flex flex-col items-center justify-center my-6">
                    {game.coverImage ? (
                      <div className="relative group w-36 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 my-2">
                        <img
                          src={game.coverImage}
                          alt={game.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="p-6 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-xl mb-4">
                        <GameIcon name={game.coverSymbol} className="text-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.3)]" size={56} />
                      </div>
                    )}

                    <h1 className="text-2xl font-black text-center tracking-tight leading-tight px-2 text-white mt-2">
                      {game.title}
                    </h1>
                    
                    <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                        {translateGenre(game.genre, language)}
                      </span>
                      {game.igdbRating !== undefined && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/80 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                          <Icons.Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          {t.igdbRating}: {game.igdbRating}/100
                        </span>
                      )}
                    </div>

                    {game.igdbUrl && (
                      <a
                        href={game.igdbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-[11px] text-indigo-200 hover:text-white underline flex items-center gap-1 transition-colors"
                      >
                        <Icons.ExternalLink className="w-3 h-3" />
                        {t.viewOnIgdb}
                      </a>
                    )}
                  </div>

                  {/* Simulated Spine Barcode */}
                  <div className="z-10 mt-auto pt-4 border-t border-white/15 space-y-3">
                    {game.barcode && game.barcode.trim() !== "" ? (
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-white/50 text-center mb-1">
                          {t.officialBarcodeTitle}
                        </p>
                        {renderBarcodeSVG(game.barcode)}
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">
                          {t.officialBarcodeTitle}
                        </p>
                        <p className="text-xs text-white/50 italic font-mono">
                          {t.noBarcodeText}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-around items-center text-xs text-white/80">
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-white/40 uppercase">{t.acquiredLabel}</p>
                        <p className="font-semibold">{game.acquisitionDate || t.noDateText}</p>
                      </div>
                      <div className="w-px h-6 bg-white/15" />
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-white/40 uppercase">{t.releaseLabel}</p>
                        <p className="font-semibold">{game.releaseDate || t.noDateText}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Pane: Detailed Logs, Achievements checklist, Ratings */}
                <div className="flex-1 p-8 bg-neutral-50 dark:bg-[#1A1A1A]/40 space-y-6 overflow-y-auto max-h-[750px]">
                  
                  {/* Meta Summary Row */}
                  <div className="grid grid-cols-3 gap-4" id="stats-summary-row">
                    <div className="bg-white dark:bg-[#121212] p-3 rounded-xl border border-neutral-100 dark:border-white/5">
                      <p className="text-[10px] uppercase font-bold text-neutral-400 dark:text-gray-500 mb-0.5 flex items-center gap-1">
                        <Icons.Play className="w-3 h-3 text-sky-500" />
                        {t.statusLabel}
                      </p>
                      <select
                        value={game.status}
                        onChange={(e) => handleSaveQuickEdits("status", e.target.value as GameStatus)}
                        className="bg-transparent text-sm font-bold text-neutral-800 dark:text-white focus:outline-none cursor-pointer w-full"
                      >
                        <option value="Pendiente">{t.statusPendingTag}</option>
                        <option value="Jugando">{t.statusPlayingTag}</option>
                        <option value="Completado">{t.statusCompletedTag}</option>
                        <option value="Favoritos">{t.statusFavoriteTag}</option>
                      </select>
                    </div>

                    <div className="bg-white dark:bg-[#121212] p-3 rounded-xl border border-neutral-100 dark:border-white/5">
                      <p className="text-[10px] uppercase font-bold text-neutral-400 dark:text-gray-500 mb-0.5 flex items-center gap-1">
                        <Icons.Clock className="w-3 h-3 text-emerald-500" />
                        {t.playHoursLabel}
                      </p>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={game.playTime}
                          onChange={(e) => handleSaveQuickEdits("playTime", Math.max(0, Number(e.target.value)))}
                          className="bg-transparent text-sm font-bold text-neutral-800 dark:text-white focus:outline-none w-14 border-b border-dashed border-neutral-300 dark:border-white/10"
                        />
                        <span className="text-xs text-neutral-500 font-semibold">{t.hours}</span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#121212] p-3 rounded-xl border border-neutral-100 dark:border-white/5">
                      <p className="text-[10px] uppercase font-bold text-neutral-400 dark:text-gray-500 mb-0.5 flex items-center gap-1">
                        <Icons.Award className="w-3 h-3 text-amber-500" />
                        {t.rating}
                      </p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleSaveQuickEdits("rating", star)}
                            className="cursor-pointer hover:scale-110 transition-transform"
                          >
                            <Icons.Star
                              className={`w-4 h-4 ${star <= game.rating ? "text-amber-400 fill-amber-400" : "text-neutral-300 dark:text-gray-700"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-gray-500 mb-2">
                      {t.gameSummaryTitle}
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed bg-white dark:bg-[#121212] p-4 rounded-xl border border-neutral-100 dark:border-white/5">
                      {game.description || t.noDescriptionProvided}
                    </p>
                  </div>

                  {/* Achievements Progress & Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-gray-500 flex items-center gap-1.5">
                        <Icons.Trophy className="w-3.5 h-3.5 text-indigo-500" />
                        {t.achievementsObtainedTitle} ({unlockedCount}/{totalAchievements})
                      </h3>
                      {totalAchievements > 0 && (
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {progressPercent}% {t.percentCompletedText}
                        </span>
                      )}
                    </div>

                    {totalAchievements > 0 && (
                      <div className="w-full bg-neutral-200 dark:bg-[#1A1A1A] h-2 rounded-full overflow-hidden mb-4">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}

                    {game.achievements.length === 0 ? (
                      <div className="text-center py-4 bg-white dark:bg-[#121212] border border-neutral-100 dark:border-white/5 rounded-xl text-xs text-neutral-400">
                        {t.noAchievementsDetailHint}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="achievements-checklist-grid">
                        {game.achievements.map((ach) => (
                          <div
                            key={ach.id}
                            onClick={() => handleToggleAchievement(ach.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 items-start select-none ${
                              ach.unlocked
                                ? "bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-900/50"
                                : "bg-white dark:bg-[#121212] border border-neutral-100 dark:border-white/5 hover:border-neutral-200 dark:hover:border-white/10"
                            }`}
                          >
                            <div className="mt-0.5">
                              {ach.unlocked ? (
                                <div className="p-1 bg-indigo-600 text-white rounded-md">
                                  <Icons.Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="p-1 border-2 border-neutral-300 dark:border-white/10 rounded-md w-[22px] h-[22px]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center gap-2 mb-0.5">
                                <h4 className={`text-xs font-bold truncate ${ach.unlocked ? "text-indigo-900 dark:text-indigo-300" : "text-neutral-800 dark:text-neutral-200"}`}>
                                  {ach.name}
                                </h4>
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                  ach.difficulty === "Fácil" 
                                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600" 
                                    : ach.difficulty === "Medio" 
                                    ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600" 
                                    : "bg-rose-50 dark:bg-rose-950/20 text-rose-600"
                                }`}>
                                  {ach.difficulty === "Fácil" ? t.difficultyEasy : ach.difficulty === "Medio" ? t.difficultyMedium : t.difficultyHard}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-500 dark:text-[#CCCCCC] line-clamp-2 leading-snug">
                                {ach.description}
                              </p>
                              {ach.unlocked && ach.unlockedAt && (
                                <span className="text-[9px] text-indigo-600/70 dark:text-indigo-400/70 font-semibold block mt-1">
                                  {t.unlockedOnDate} {new Date(ach.unlockedAt).toLocaleDateString(locale)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ) : (
              /* ================= EDIT MODE ================= */
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-white/5 flex-shrink-0">
                  <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                    <Icons.Edit3 className="w-5 h-5 text-indigo-500" />
                    <span>{t.editGameDetailsTitle}</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Form */}
                <form onSubmit={handleSaveFullEdit} className="p-6 overflow-y-auto flex-1 space-y-6">
                  {editImportNotice && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Icons.CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="font-semibold">{editImportNotice}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditImportNotice("")}
                        className="text-emerald-600 dark:text-emerald-400 hover:opacity-75 transition-opacity cursor-pointer"
                      >
                        <Icons.X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left Column: Basic Info */}
                    <div className="space-y-4 flex flex-col">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1 flex justify-between items-center">
                          <span>{t.gameTitleLabel}</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder={t.gameTitlePlaceholder}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowIgdbModal(true)}
                            className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                            title={t.igdbSearchBtn}
                          >
                            <Icons.Search className="w-3.5 h-3.5" />
                            <span>{t.igdbSearchBtn}</span>
                          </button>
                        </div>
                      </div>

                      {/* Cover Image URL Input */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1 flex justify-between items-center">
                          <span>{t.igdbCoverUrlLabel}</span>
                          {editCoverImage && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <Icons.CheckCircle2 className="w-3 h-3" />
                              {t.igdbOfficialCover}
                            </span>
                          )}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder={t.igdbCoverUrlPlaceholder}
                            value={editCoverImage}
                            onChange={(e) => setEditCoverImage(e.target.value)}
                            className="flex-1 px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                          />
                          {editCoverImage && (
                            <button
                              type="button"
                              onClick={() => setEditCoverImage("")}
                              className="px-2 text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                              title={t.removeImage}
                            >
                              <Icons.XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                            {t.genreLabel}
                          </label>
                          <input
                            type="text"
                            placeholder={t.genrePlaceholder}
                            value={editGenre}
                            onChange={(e) => setEditGenre(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                            {t.releaseLabel}
                          </label>
                          <input
                            type="text"
                            placeholder={t.releasePlaceholder}
                            value={editReleaseDate}
                            onChange={(e) => setEditReleaseDate(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                          {t.barcodeLabel}
                        </label>
                        <input
                          type="text"
                          value={editBarcode}
                          onChange={(e) => setEditBarcode(e.target.value.replace(/[^0-9]/g, ""))}
                          maxLength={13}
                          className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-mono"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                          {t.descriptionLabel}
                        </label>
                        <textarea
                          rows={4}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full flex-1 min-h-[90px] px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Right Column: Personal status & aesthetics */}
                    <div className="space-y-4 flex flex-col">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                            {t.statusLabel}
                          </label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as GameStatus)}
                            className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                          >
                            <option value="Pendiente">{t.statusPendingTag}</option>
                            <option value="Jugando">{t.statusPlayingTag}</option>
                            <option value="Completado">{t.statusCompletedTag}</option>
                            <option value="Favoritos">{t.statusFavoriteTag}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                            {t.acquisitionDateLabel}
                          </label>
                          <input
                            type="date"
                            value={editAcquisitionDate}
                            onChange={(e) => setEditAcquisitionDate(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                            {t.playHoursLabel}
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder={t.hours}
                            value={editPlayTime}
                            onChange={(e) => setEditPlayTime(Math.max(0, Number(e.target.value)))}
                            className="w-full px-3 py-2 border border-neutral-200 dark:border-white/5 rounded-lg bg-neutral-50 dark:bg-[#1A1A1A] text-neutral-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400 mb-1">
                            {t.rating}
                          </label>
                          <div className="flex gap-1.5 h-[38px] items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setEditRating(star)}
                                className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                              >
                                <Icons.Star
                                  className={`w-6 h-6 ${star <= editRating ? "fill-amber-400" : "text-neutral-300 dark:text-gray-700"}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cover Preview & Customization */}
                      <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-[#1A1A1A]/40 space-y-3 flex-1 flex flex-col justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-gray-300 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Icons.Palette className="w-3.5 h-3.5" />
                            {t.coverDesignTitle}
                          </span>
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                              {t.bgColorLabel}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={editCoverColor}
                                onChange={(e) => setEditCoverColor(e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-200 dark:border-gray-700 p-0 overflow-hidden"
                              />
                              <span className="text-xs font-mono">{editCoverColor}</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                              {t.centralSymbolLabel}
                            </label>
                            <select
                              value={editCoverSymbol}
                              onChange={(e) => setEditCoverSymbol(e.target.value)}
                              className="w-full px-2 py-1.5 border border-neutral-200 dark:border-white/5 rounded-lg bg-white dark:bg-[#121212] text-neutral-800 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                            >
                              {AVAILABLE_SYMBOLS.map((sym) => (
                                <option key={sym.id} value={sym.icon}>
                                  {translateSymbolLabel(sym.id, language)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Cover Live Preview */}
                        <div className="relative h-28 w-full rounded-lg overflow-hidden flex items-center justify-center p-3 shadow-inner mt-auto" style={{ backgroundColor: editCoverColor }}>
                          {editCoverImage ? (
                            <img
                              src={editCoverImage}
                              alt={t.previewCover}
                              className="absolute inset-0 w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                              <Icons.Gamepad2 className="w-8 h-8 text-white" />
                            </div>
                          )}
                          <div className="absolute bottom-2 left-3 right-3 text-white drop-shadow">
                            <p className="text-xs font-bold truncate">{editTitle || game.title}</p>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Platforms selection - Full Width */}
                  <div className="border-t border-neutral-100 dark:border-white/5 pt-5 space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-gray-400">
                      {t.platformsLabel}
                    </label>
                    <ConsolePicker
                      selectedPlatforms={editPlatforms}
                      onChange={setEditPlatforms}
                      language={language}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="border-t border-neutral-100 dark:border-white/5 pt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-[#CCCCCC] border border-neutral-200 dark:border-white/5 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={!editTitle.trim()}
                      className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-500 rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      {t.saveSettings}
                    </button>
                  </div>

                </form>
              </div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      {showIgdbModal && (
        <IgdbSearchModal
          initialQuery={editTitle || game.title}
          language={language}
          onClose={() => setShowIgdbModal(false)}
          onSelectGame={handleSelectIgdbGame}
        />
      )}
    </>
  );
};
