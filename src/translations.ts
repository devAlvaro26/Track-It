import { Language } from "./types";

/**
 * Tabular translation system where each text key holds translations for all supported languages side-by-side.
 * This tabular layout allows developers to view, edit, and maintain translations in parallel,
 * ensuring high efficiency, scalability, and zero missing key discrepancies across languages.
 */
export const translationTable = {
  // --- HEADER & APP BRANDING ---
  appTitle: {
    es: "Mi biblioteca",
    en: "My Library",
  },
  appSubtitle: {
    es: "Tu estantería digital de videojuegos · Con IA",
    en: "Your digital game shelf · Powered by AI",
  },
  welcomeUser: {
    es: "Colección de",
    en: "Collection of",
  },
  addGame: {
    es: "Añadir Juego",
    en: "Add Game",
  },
  settings: {
    es: "Ajustes",
    en: "Settings",
  },

  // --- SETTINGS MODAL ---
  settingsTitle: {
    es: "Ajustes de la Aplicación",
    en: "Application Settings",
  },
  settingsSubtitle: {
    es: "Personaliza el tema, idioma y tu perfil de coleccionista",
    en: "Customize theme, language, and your collector profile",
  },
  themeLabel: {
    es: "Tema de la aplicación",
    en: "App Theme",
  },
  themeDark: {
    es: "Modo Oscuro",
    en: "Dark Mode",
  },
  themeLight: {
    es: "Modo Claro",
    en: "Light Mode",
  },
  languageLabel: {
    es: "Idioma de la interfaz",
    en: "Interface Language",
  },
  languageEs: {
    es: "Español (Spanish)",
    en: "Spanish (Español)",
  },
  languageEn: {
    es: "English (Inglés)",
    en: "English (English)",
  },
  usernameLabel: {
    es: "Nombre de usuario",
    en: "Username",
  },
  usernamePlaceholder: {
    es: "Tu apodo o nombre...",
    en: "Your gamer tag or name...",
  },
  saveSettings: {
    es: "Guardar Cambios",
    en: "Save Changes",
  },
  settingsSavedMsg: {
    es: "¡Ajustes guardados correctamente!",
    en: "Settings saved successfully!",
  },
  saveToApply: {
    es: "Guarda para aplicar los cambios",
    en: "Save to apply changes",
  },

  // --- STATS PANEL ---
  totalLibrary: {
    es: "Total Biblioteca",
    en: "Total Library",
  },
  completionRate: {
    es: "Tasa de Superación",
    en: "Completion Rate",
  },
  playTime: {
    es: "Tiempo de Juego",
    en: "Play Time",
  },
  achievementsUnlocked: {
    es: "Logros Desbloqueados",
    en: "Achievements Unlocked",
  },
  inProgress: {
    es: "en curso",
    en: "playing",
  },
  pending: {
    es: "pendientes",
    en: "pending",
  },
  completed: {
    es: "completados",
    en: "completed",
  },
  favorites: {
    es: "favoritos",
    en: "favorites",
  },
  avgHours: {
    es: "Promedio",
    en: "Average",
  },
  hoursPerGame: {
    es: "h por videojuego",
    en: "h per game",
  },

  // --- CONTROLS & FILTERS ---
  searchPlaceholder: {
    es: "Buscar por título, género o código de barra...",
    en: "Search by title, genre, or barcode...",
  },
  statusLabel: {
    es: "Estado",
    en: "Status",
  },
  allStatuses: {
    es: "Todos los Estados",
    en: "All Statuses",
  },
  statusPending: {
    es: "Pendientes",
    en: "Pending",
  },
  statusPlaying: {
    es: "Jugando",
    en: "Playing",
  },
  statusCompleted: {
    es: "Completados",
    en: "Completed",
  },
  statusFavorites: {
    es: "Favoritos",
    en: "Favorites",
  },
  consoleLabel: {
    es: "Consola",
    en: "Console",
  },
  allConsoles: {
    es: "Todas las Consolas",
    en: "All Consoles",
  },
  sortByLabel: {
    es: "Ordenar por",
    en: "Sort by",
  },
  sortAcquisitionDate: {
    es: "Fecha Adquisición",
    en: "Acquisition Date",
  },
  sortTitle: {
    es: "Título (A-Z)",
    en: "Title (A-Z)",
  },
  sortPlayTime: {
    es: "Horas de Juego",
    en: "Play Hours",
  },
  sortRating: {
    es: "Calificación",
    en: "Rating",
  },
  showingCount: {
    es: "Mostrando",
    en: "Showing",
  },
  ofCount: {
    es: "de",
    en: "of",
  },
  titlesInLibrary: {
    es: "títulos en tu biblioteca",
    en: "titles in your library",
  },
  emptyLibraryTip: {
    es: "Tu estantería está vacía. ¡Pulsa añadir para empezar!",
    en: "Your shelf is empty. Click add to get started!",
  },
  noGamesMatch: {
    es: "Ningún juego coincide con los filtros",
    en: "No games match the current filters",
  },
  noGamesMatchDesc: {
    es: "Prueba a limpiar la barra de búsqueda o a desactivar los filtros de consola o estado.",
    en: "Try clearing search keywords or resetting console and status filters.",
  },
  resetFilters: {
    es: "Restablecer Filtros",
    en: "Reset Filters",
  },

  // --- GAME CARD & STATUS TAGS ---
  statusPendingTag: {
    es: "Pendiente",
    en: "Pending",
  },
  statusPlayingTag: {
    es: "Jugando",
    en: "Playing",
  },
  statusCompletedTag: {
    es: "Completado",
    en: "Completed",
  },
  statusFavoriteTag: {
    es: "Favorito",
    en: "Favorite",
  },
  achievementsLabel: {
    es: "Logros",
    en: "Achievements",
  },
  noAchievementsRecorded: {
    es: "Sin logros registrados",
    en: "No achievements recorded",
  },
  hoursPlayed: {
    es: "jugadas",
    en: "played",
  },
  barcodeShort: {
    es: "Cód. barras",
    en: "Barcode",
  },

  // --- ADD GAME FORM ---
  addGameTitle: {
    es: "Añadir Videojuego a la Biblioteca",
    en: "Add Video Game to Library",
  },
  aiAssistantTitle: {
    es: "Asistente Inteligente de Autocompletado",
    en: "Smart Auto-Fill Assistant",
  },
  aiAssistantDesc: {
    es: "Introduce el nombre y deja que la IA de Gemini complete la carátula, descripción, logros y código de barras de inmediato.",
    en: "Type the name and let Gemini AI fill the cover, description, achievements, and barcode instantly.",
  },
  aiSearching: {
    es: "Buscando en Gemini...",
    en: "Searching Gemini...",
  },
  aiAutofillBtn: {
    es: "Autocompletar con IA",
    en: "Auto-fill with AI",
  },
  aiErrorTitlePrompt: {
    es: "Por favor, introduce el título del videojuego antes de autocompletar.",
    en: "Please enter the game title before auto-filling.",
  },
  aiConnectionError: {
    es: "No se pudo obtener la información de la IA. Comprueba la conexión o intenta más tarde.",
    en: "Could not retrieve AI data. Check your connection or try again later.",
  },
  gameTitleLabel: {
    es: "Título del Videojuego *",
    en: "Video Game Title *",
  },
  gameTitlePlaceholder: {
    es: "Ej: Metroid Prime, Hollow Knight",
    en: "E.g. Metroid Prime, Hollow Knight",
  },
  genreLabel: {
    es: "Género",
    en: "Genre",
  },
  genrePlaceholder: {
    es: "Ej: Metroidvania, RPG",
    en: "E.g. Metroidvania, RPG",
  },
  releaseLabel: {
    es: "Lanzamiento",
    en: "Release",
  },
  releasePlaceholder: {
    es: "Ej: 2023 o 2023-05-12",
    en: "E.g. 2023 or 2023-05-12",
  },
  barcodeLabel: {
    es: "Código de Barras (EAN / UPC)",
    en: "Barcode (EAN / UPC)",
  },
  barcodePlaceholder: {
    es: "Ej: 0045496598518 (12-13 números)",
    en: "E.g. 0045496598518 (12-13 digits)",
  },
  descriptionLabel: {
    es: "Descripción",
    en: "Description",
  },
  descriptionPlaceholder: {
    es: "Breve resumen del juego, de qué trata o por qué es especial...",
    en: "Short summary of the game, plot, or why it's special...",
  },
  platformsLabel: {
    es: "Plataformas y Consolas (Selecciona una o varias)",
    en: "Platforms & Consoles (Select one or multiple)",
  },
  selectedConsolesLabel: {
    es: "Consolas seleccionadas",
    en: "Selected consoles",
  },
  noConsolesSelected: {
    es: "Ninguna consola seleccionada",
    en: "No consoles selected",
  },
  searchConsolePlaceholder: {
    es: "Buscar consola (ej: Switch, PS2, Mega Drive, Atari)...",
    en: "Search console (e.g. Switch, PS2, Mega Drive, Atari)...",
  },
  addOtherConsole: {
    es: "Otra consola",
    en: "Other console",
  },
  customConsolePlaceholder: {
    es: "Escribe el nombre de la consola...",
    en: "Type custom console name...",
  },
  add: {
    es: "Añadir",
    en: "Add",
  },
  noConsolesFound: {
    es: "No se encontraron consolas con esa búsqueda.",
    en: "No consoles found matching search.",
  },
  collectionStatusLabel: {
    es: "Estado de Colección",
    en: "Collection Status",
  },
  pendingToPlayOption: {
    es: "Pendiente de Jugar",
    en: "Pending to Play",
  },
  currentlyPlayingOption: {
    es: "Jugando Actualmente",
    en: "Currently Playing",
  },
  completedOption: {
    es: "Completado",
    en: "Completed",
  },
  favoritesOption: {
    es: "Favoritos del Alma",
    en: "All-Time Favorites",
  },
  acquisitionDateLabel: {
    es: "Fecha de Adquisición",
    en: "Acquisition Date",
  },
  personalRatingLabel: {
    es: "Calificación Personal",
    en: "Personal Rating",
  },
  playHoursLabel: {
    es: "Horas de Juego",
    en: "Play Hours",
  },
  coverDesignTitle: {
    es: "Diseño de Portada Minimalista",
    en: "Minimalist Cover Design",
  },
  bgColorLabel: {
    es: "Color de Fondo",
    en: "Background Color",
  },
  centralSymbolLabel: {
    es: "Símbolo Central",
    en: "Central Symbol",
  },
  collectorNotesLabel: {
    es: "Notas de Coleccionista",
    en: "Collector Notes",
  },
  collectorNotesPlaceholder: {
    es: "¿Dónde lo compraste? ¿Es de segunda mano o físico? Anota lo que quieras...",
    en: "Where did you buy it? Physical or digital? Note anything you like...",
  },
  gameAchievementsTitle: {
    es: "Logros del Juego",
    en: "Game Achievements",
  },
  gameAchievementsDesc: {
    es: "Desafíos específicos para registrar tu progreso al 100% en este título.",
    en: "Specific challenges to track your 100% completion progress.",
  },
  addAchievementBtn: {
    es: "Añadir Logro",
    en: "Add Achievement",
  },
  noAchievementsEmptyHint: {
    es: "Aún no has añadido logros. ¡Escribe un título y pulsa \"Autocompletar con IA\" para cargar logros icónicos automáticamente!",
    en: "No achievements added yet. Type a title and click \"Auto-fill with AI\" to load iconic achievements automatically!",
  },
  newAchievementName: {
    es: "Nuevo Logro",
    en: "New Achievement",
  },
  newAchievementDesc: {
    es: "Haz algo épico para desbloquear este logro.",
    en: "Do something epic to unlock this achievement.",
  },
  achievementNamePlaceholder: {
    es: "Nombre del logro",
    en: "Achievement name",
  },
  achievementUnlockHow: {
    es: "¿Cómo se consigue?",
    en: "How to unlock it?",
  },
  alreadyUnlockedQuestion: {
    es: "¿Conseguido ya?",
    en: "Already unlocked?",
  },
  difficultyEasy: {
    es: "Fácil",
    en: "Easy",
  },
  difficultyMedium: {
    es: "Medio",
    en: "Medium",
  },
  difficultyHard: {
    es: "Difícil",
    en: "Hard",
  },
  saveToLibraryBtn: {
    es: "Guardar en Biblioteca",
    en: "Save to Library",
  },

  // --- GAME DETAIL MODAL ---
  editGameDetailsTitle: {
    es: "Editar Detalles de",
    en: "Edit Details of",
  },
  officialBarcodeTitle: {
    es: "Código de Barras Oficial",
    en: "Official Barcode",
  },
  acquiredLabel: {
    es: "Adquirido",
    en: "Acquired",
  },
  noDateText: {
    es: "Sin fecha",
    en: "No date",
  },
  gameSummaryTitle: {
    es: "Resumen del Juego",
    en: "Game Summary",
  },
  noDescriptionProvided: {
    es: "Este juego no tiene descripción de momento.",
    en: "This game has no description at the moment.",
  },
  achievementsObtainedTitle: {
    es: "Logros Obtenidos",
    en: "Achievements Unlocked",
  },
  percentCompletedText: {
    es: "completado",
    en: "completed",
  },
  noAchievementsDetailHint: {
    es: "Este juego aún no cuenta con logros. Pulsa en Editar arriba para añadir desafíos personalizados.",
    en: "This game does not have achievements yet. Click Edit above to add custom challenges.",
  },
  unlockedOnDate: {
    es: "Desbloqueado el",
    en: "Unlocked on",
  },
  notesAndLogTitle: {
    es: "Notas de Colección y Bitácora",
    en: "Collection Notes & Log",
  },
  notesTextareaPlaceholder: {
    es: "Escribe aquí tus recuerdos, dónde lo conseguiste, sensaciones del juego...",
    en: "Write your memories, purchase location, feelings about the game...",
  },
  confirmDeleteGame: {
    es: "¿Estás seguro de que quieres eliminar este juego de tu biblioteca?",
    en: "Are you sure you want to delete this game from your library?",
  },
  modifyCoverTitle: {
    es: "Modificar Portada",
    en: "Modify Cover",
  },

  // --- COMMON BUTTONS & LABELS ---
  close: {
    es: "Cerrar",
    en: "Close",
  },
  cancel: {
    es: "Cancelar",
    en: "Cancel",
  },
  delete: {
    es: "Eliminar",
    en: "Delete",
  },
  edit: {
    es: "Editar",
    en: "Edit",
  },
  save: {
    es: "Guardar",
    en: "Save",
  },
  hours: {
    es: "horas",
    en: "hours",
  },
  rating: {
    es: "Calificación",
    en: "Rating",
  },
  quickThemeToggleLight: {
    es: "Cambiar a modo claro",
    en: "Switch to light mode",
  },
  quickThemeToggleDark: {
    es: "Cambiar a modo oscuro",
    en: "Switch to dark mode",
  },
  madeWithLove: {
    es: "Hecho con ❤️ para amantes de los videojuegos.",
    en: "Made with ❤️ for video game enthusiasts.",
  },
  footerTechNote: {
    es: "Los datos son autocompletados mediante el SDK oficial de Gemini. Admite escaneo de códigos de barra manuales y sincronización local.",
    en: "Data is auto-filled using the official Gemini SDK. Supports barcode scanning and local synchronization.",
  },
} as const;

export type TranslationKey = keyof typeof translationTable;

// Memoized dictionary cache for ultra-fast zero-overhead lookups
const translationCache: Partial<Record<Language, Record<TranslationKey, string>>> = {};

/**
 * Highly efficient dictionary lookup generator.
 * Converts the tabular `translationTable` into a fast key-value map for the specified language.
 * Results are cached in memory so subsequent calls in React component renders cost 0ms.
 */
export function getTranslation(lang: Language | string = "es"): Record<TranslationKey, string> {
  const selectedLang: Language = lang === "en" ? "en" : "es";

  if (translationCache[selectedLang]) {
    return translationCache[selectedLang]!;
  }

  const dict = {} as Record<TranslationKey, string>;
  for (const k in translationTable) {
    const key = k as TranslationKey;
    const entry = translationTable[key];
    dict[key] = entry[selectedLang] || entry.es;
  }

  translationCache[selectedLang] = dict;
  return dict;
}

/**
 * Direct tabular query helper for retrieving a single text key in a given language.
 */
export function tKey(key: TranslationKey, lang: Language = "es"): string {
  const entry = translationTable[key];
  if (!entry) return key;
  return entry[lang === "en" ? "en" : "es"] || entry.es;
}

/**
 * Genre dictionary to dynamically translate genre terms between Spanish and English
 */
const genreDictionary: Record<string, { es: string; en: string }> = {
  plataformas: { es: "Plataformas", en: "Platformer" },
  aventura: { es: "Aventura", en: "Adventure" },
  aventuras: { es: "Aventuras", en: "Adventure" },
  rpg: { es: "RPG", en: "RPG" },
  rol: { es: "Rol", en: "RPG" },
  metroidvania: { es: "Metroidvania", en: "Metroidvania" },
  acción: { es: "Acción", en: "Action" },
  accion: { es: "Acción", en: "Action" },
  carreras: { es: "Carreras", en: "Racing" },
  simulador: { es: "Simulador", en: "Simulation" },
  simulación: { es: "Simulación", en: "Simulation" },
  simulacion: { es: "Simulación", en: "Simulation" },
  terror: { es: "Terror", en: "Horror" },
  deportes: { es: "Deportes", en: "Sports" },
  estrategia: { es: "Estrategia", en: "Strategy" },
  lucha: { es: "Lucha", en: "Fighting" },
  pelea: { es: "Pelea", en: "Fighting" },
  disparos: { es: "Disparos", en: "Shooter" },
  puzles: { es: "Puzles", en: "Puzzle" },
  puzzle: { es: "Puzles", en: "Puzzle" },
  puzzles: { es: "Puzles", en: "Puzzle" },
  rompecabezas: { es: "Rompecabezas", en: "Puzzle" },
  otros: { es: "Otros", en: "Others" },
  conducción: { es: "Conducción", en: "Racing" },
  conduccion: { es: "Conducción", en: "Racing" },
  supervivencia: { es: "Supervivencia", en: "Survival" },
  sandbox: { es: "Sandbox", en: "Sandbox" },
  música: { es: "Música", en: "Music" },
  musica: { es: "Música", en: "Music" },
  ritmo: { es: "Ritmo", en: "Rhythm" },
};

/**
 * Translates genre strings (including compound genres like "Plataformas / Aventura") to the requested language.
 */
export function translateGenre(genreStr: string = "", lang: Language | string = "es"): string {
  if (!genreStr) return "";
  const selectedLang = lang === "en" ? "en" : "es";

  // Split by slashes or commas
  const parts = genreStr.split("/").map((p) => p.trim());

  const translatedParts = parts.map((part) => {
    const lower = part.toLowerCase();
    if (genreDictionary[lower]) {
      return genreDictionary[lower][selectedLang];
    }

    // Replace individual matching keywords
    let updatedPart = part;
    for (const [key, val] of Object.entries(genreDictionary)) {
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      if (regex.test(updatedPart)) {
        updatedPart = updatedPart.replace(regex, val[selectedLang]);
      }
    }
    return updatedPart;
  });

  return translatedParts.join(" / ");
}

/**
 * Backward compatibility object mapping for legacy code imports `translations.es` / `translations.en`.
 */
export const translations = {
  get es() {
    return getTranslation("es");
  },
  get en() {
    return getTranslation("en");
  },
};
