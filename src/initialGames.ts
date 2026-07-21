import { Game } from "./types";

export const INITIAL_GAMES: Game[] = [
  {
    id: "zelda-totk",
    title: "The Legend of Zelda: Tears of the Kingdom",
    description: "Una aventura épica a través de la tierra y los cielos de Hyrule. Secuela directa de Breath of the Wild, expande las mecánicas creativas de construcción de forma ilimitada.",
    genre: "Acción / Aventura",
    platforms: ["Nintendo Switch"],
    releaseDate: "2023-05-12",
    barcode: "0045496598518",
    acquisitionDate: "2023-05-15",
    rating: 5,
    playTime: 120,
    status: "Completado",
    coverColor: "#0d5c4e",
    coverSymbol: "shield",
    achievements: [
      { id: "totk-1", name: "El Poder de la Creación", description: "Utiliza la habilidad Ultramano para construir tu primer vehículo funcional.", difficulty: "Fácil", unlocked: true, unlockedAt: "2023-05-15" },
      { id: "totk-2", name: "Salvador del Reino", description: "Derrota al Rey Demonio Ganondorf y rescata a la princesa Zelda.", difficulty: "Difícil", unlocked: true, unlockedAt: "2023-06-20" },
      { id: "totk-3", name: "Maestro Templario", description: "Completa todos los templos elementales de Hyrule.", difficulty: "Medio", unlocked: true, unlockedAt: "2023-05-30" },
      { id: "totk-4", name: "Coleccionista de Semillas", description: "Encuentra 100 semillas Kolog repartidas por el mapa.", difficulty: "Medio", unlocked: false }
    ],
    notes: "Mi juego favorito de la consola. La mecánica de combinación de armas y construcción es revolucionaria."
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    description: "Un juego de rol de acción y fantasía oscura desarrollado por FromSoftware. Alzaos, Sinluz, y que la gracia os guíe para abrazar el poder del Círculo de Elden y convertiros en el señor de las Tierras Intermedias.",
    genre: "RPG de Acción",
    platforms: ["PC", "PlayStation 5", "Xbox Series X"],
    releaseDate: "2022-02-25",
    barcode: "3391892019187",
    acquisitionDate: "2022-03-01",
    rating: 5,
    playTime: 165,
    status: "Favoritos",
    coverColor: "#451a03",
    coverSymbol: "skull",
    achievements: [
      { id: "er-1", name: "Señor de Elden", description: "Consigue el final principal del juego y conviértete en Señor de Elden.", difficulty: "Difícil", unlocked: true, unlockedAt: "2022-04-12" },
      { id: "er-2", name: "Portador de Runa: Margit", description: "Derrota a Margit, el Presagio Caído en las puertas del Castillo Velo Tormentoso.", difficulty: "Fácil", unlocked: true, unlockedAt: "2022-03-03" },
      { id: "er-3", name: "Diosa de la Putrefacción", description: "Derrota a Malenia, la Espada de Miquella, en el Árbol Hierático.", difficulty: "Difícil", unlocked: false },
      { id: "er-4", name: "Coleccionista Legendario", description: "Consigue todos los talismanes y armas legendarias.", difficulty: "Medio", unlocked: true, unlockedAt: "2022-05-02" }
    ],
    notes: "Juego extremadamente desafiante. Conseguí derrotar a casi todos los jefes principales. El diseño del mapa abierto es inigualable."
  },
  {
    id: "hollow-knight",
    title: "Hollow Knight",
    description: "Desciende al mundo de Hallownest. Una aventura clásica en 2D en un vasto mundo interconectado. Explora cavernas serpenteantes, lucha contra criaturas contaminadas y hazte amigo de extraños bichos.",
    genre: "Metroidvania",
    platforms: ["Nintendo Switch", "PC", "PlayStation 4", "Xbox One"],
    releaseDate: "2017-02-24",
    barcode: "0812301430018",
    acquisitionDate: "2019-07-20",
    rating: 5,
    playTime: 62,
    status: "Favoritos",
    coverColor: "#0f172a",
    coverSymbol: "crown",
    achievements: [
      { id: "hk-1", name: "Corazón de Hallownest", description: "Completa el juego al 112%.", difficulty: "Difícil", unlocked: false },
      { id: "hk-2", name: "Falso Salvador", description: "Derrota al Caballero Falso en los Cruces Olvidados.", difficulty: "Fácil", unlocked: true, unlockedAt: "2019-07-22" },
      { id: "hk-3", name: "El Fin de la Plaga", description: "Completa el juego derrotando al Destello en el núcleo del huevo negro.", difficulty: "Difícil", unlocked: true, unlockedAt: "2019-08-15" },
      { id: "hk-4", name: "Maestro del Aguijón", description: "Consigue todas las mejoras posibles para tu aguijón.", difficulty: "Medio", unlocked: true, unlockedAt: "2019-08-01" }
    ],
    notes: "Arte precioso, banda sonora conmovedora y controles perfectos. El mejor metroidvania jamás creado."
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    description: "Un RPG de aventura y acción de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamur y la modificación corporal.",
    genre: "RPG de Acción / Shooter",
    platforms: ["PC", "PlayStation 5", "Xbox Series X"],
    releaseDate: "2020-12-10",
    barcode: "5060731230123",
    acquisitionDate: "2021-12-25",
    rating: 4,
    playTime: 85,
    status: "Jugando",
    coverColor: "#171717",
    coverSymbol: "bolt",
    achievements: [
      { id: "cp-1", name: "El Loco", description: "Conviértete en un mercenario de leyenda en Night City.", difficulty: "Fácil", unlocked: true, unlockedAt: "2021-12-26" },
      { id: "cp-2", name: "Ciberpsicópata de Nivel", description: "Neutraliza a todos los ciberpsicópatas de la ciudad sin matarlos.", difficulty: "Medio", unlocked: false },
      { id: "cp-3", name: "El Camino del Sol", description: "Consigue el final de la leyenda del Afterlife con Johnny Silverhand.", difficulty: "Medio", unlocked: false },
      { id: "cp-4", name: "Cromo al Límite", description: "Instala al menos una pieza de ciberware legendario en cada ranura corporal.", difficulty: "Fácil", unlocked: true, unlockedAt: "2022-01-10" }
    ],
    notes: "Con el parche 2.0 y la expansión Phantom Liberty, el juego es increíblemente bueno y se ve genial en mi setup."
  },
  {
    id: "super-mario-odyssey",
    title: "Super Mario Odyssey",
    description: "Acompaña a Mario en una aventura en 3D a través de enormes reinos usando sus nuevas habilidades para conseguir energilunas con las que alimentar su nave, la Odyssey.",
    genre: "Plataformas",
    platforms: ["Nintendo Switch"],
    releaseDate: "2017-10-27",
    barcode: "0045496590741",
    acquisitionDate: "2018-01-05",
    rating: 5,
    playTime: 35,
    status: "Completado",
    coverColor: "#be123c",
    coverSymbol: "star",
    achievements: [
      { id: "mo-1", name: "Viajero Interdimensional", description: "Consigue tu primera energiluna en el Reino Sombrero.", difficulty: "Fácil", unlocked: true, unlockedAt: "2018-01-05" },
      { id: "mo-2", name: "¡Salvados del Altar!", description: "Arruina los planes de boda de Bowser en la Luna.", difficulty: "Medio", unlocked: true, unlockedAt: "2018-01-15" },
      { id: "mo-3", name: "Coleccionista de Sombreros", description: "Adquiere todos los sombreros y trajes disponibles en las tiendas Crazy Cap.", difficulty: "Medio", unlocked: false },
      { id: "mo-4", name: "La Gran Cara Oculta", description: "Supera el reto extremo de la Cara Más Oculta de la Luna.", difficulty: "Difícil", unlocked: true, unlockedAt: "2018-02-10" }
    ],
    notes: "Diversión pura de principio a fin. Controlar enemigos y objetos lanzando a Cappy es genial."
  },
  {
    id: "forza-horizon-5",
    title: "Forza Horizon 5",
    description: "Tu aventura Horizon definitiva te espera. Explora los vibrantes y cambiantes paisajes desérticos, selváticos e históricos de México al volante de los mejores coches del mundo.",
    genre: "Carreras / Simulación",
    platforms: ["PC", "Xbox Series X", "Xbox One"],
    releaseDate: "2021-11-09",
    barcode: "0889842880312",
    acquisitionDate: "2022-06-18",
    rating: 4,
    playTime: 48,
    status: "Pendiente",
    coverColor: "#be185d",
    coverSymbol: "car",
    achievements: [
      { id: "fh-1", name: "Bienvenidos a México", description: "Llega al festival Horizon de México y establece tu primer puesto.", difficulty: "Fácil", unlocked: true, unlockedAt: "2022-06-18" },
      { id: "fh-2", name: "Salón de la Fama", description: "Consigue suficientes puntos de galardón para entrar en el Salón de la Fama.", difficulty: "Medio", unlocked: false },
      { id: "fh-3", name: "Explorador de Tormentas", description: "Fotografía un coche de noche en medio de una tormenta de arena.", difficulty: "Medio", unlocked: false },
      { id: "fh-4", name: "Garaje Millonario", description: "Posee al menos 50 coches diferentes en tu colección.", difficulty: "Fácil", unlocked: true, unlockedAt: "2022-08-01" }
    ],
    notes: "Gráficos espectaculares. Ideal para jugar relajado con música electrónica de fondo."
  }
];
