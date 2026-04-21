/**
 * Game catalogue.
 *
 * Tiles are now backed by real static assets served from
 * `public/brands/kinetika/images/games/*`. The `imageSrc` field maps 1:1 to
 * the filename on disk so the tile component can lean on Next.js' image
 * optimiser without any loader indirection.
 *
 * In production this module is replaced by a server fetch (likely an RSC
 * `fetch` with `cache: 'force-cache'` + `revalidateTag`) against the
 * aggregator. Shape stays intentionally narrow to keep the tile dumb.
 */

export type GameCategory = 'slots' | 'live' | 'megaways' | 'table'

export interface Game {
  id: string
  title: string
  provider: string
  categories: GameCategory[]
  /** Absolute, CDN-safe path to the tile artwork (1:1 aspect ratio). */
  imageSrc: string
}

export const categories: {
  id: 'all' | GameCategory
  label: string
}[] = [
  { id: 'all', label: 'All' },
  { id: 'slots', label: 'Slots' },
  { id: 'live', label: 'Live Casino' },
  { id: 'megaways', label: 'Megaways' },
  { id: 'table', label: 'Table Games' },
]

const ART = '/brands/kinetika/images/games'

export const games: Game[] = [
  {
    id: '12-masks-of-fire-drum-frenzy',
    title: '12 Masks of Fire Drum Frenzy',
    provider: 'Microgaming',
    categories: ['slots'],
    imageSrc: `${ART}/12-masks-of-fire-drum-frenzy.jpg`,
  },
  {
    id: 'alice-in-winderland',
    title: 'Alice in Winderland',
    provider: 'Playtech',
    categories: ['slots'],
    imageSrc: `${ART}/alice-in-winderland.jpg`,
  },
  {
    id: 'big-bass-amazon-xtreme',
    title: 'Big Bass Amazon Xtreme',
    provider: 'Pragmatic Play',
    categories: ['slots'],
    imageSrc: `${ART}/big-bass-amazon-xtreme.jpg`,
  },
  {
    id: 'blackjack-neo',
    title: 'Blackjack Neo',
    provider: 'Relax Gaming',
    categories: ['table'],
    imageSrc: `${ART}/blackjack-neo.jpg`,
  },
  {
    id: 'casino-solitaire',
    title: 'Casino Solitaire',
    provider: 'Gamevy',
    categories: ['table'],
    imageSrc: `${ART}/casino-solitaire.jpg`,
  },
  {
    id: 'fire-joker-blitz',
    title: 'Fire Joker Blitz',
    provider: 'Play\u2019n GO',
    categories: ['slots'],
    imageSrc: `${ART}/fire-joker-blitz.jpg`,
  },
  {
    id: 'fire-portals',
    title: 'Fire Portals',
    provider: 'Pragmatic Play',
    categories: ['slots'],
    imageSrc: `${ART}/fire-portals.jpg`,
  },
  {
    id: 'joker-cashpot',
    title: 'Joker Cashpot',
    provider: 'Yggdrasil',
    categories: ['slots'],
    imageSrc: `${ART}/joker-cashpot.jpg`,
  },
  {
    id: 'midnight-gold',
    title: 'Midnight Gold',
    provider: 'Play\u2019n GO',
    categories: ['slots'],
    imageSrc: `${ART}/midnight-gold.jpg`,
  },
  {
    id: 'roulette-nouveau',
    title: 'Roulette Nouveau',
    provider: 'Relax Gaming',
    categories: ['table'],
    imageSrc: `${ART}/roulette-nouveau.jpg`,
  },
  {
    id: 'sugar-rush-1000',
    title: 'Sugar Rush 1000',
    provider: 'Pragmatic Play',
    categories: ['slots'],
    imageSrc: `${ART}/sugar-rush-1000.jpg`,
  },
  {
    id: 'sweet-bonanza',
    title: 'Sweet Bonanza',
    provider: 'Pragmatic Play',
    categories: ['slots'],
    imageSrc: `${ART}/sweet-bonanza.jpg`,
  },
]

export function filterGames(category: string | undefined): Game[] {
  if (!category || category === 'all') return games
  return games.filter((g) => (g.categories as string[]).includes(category))
}

/**
 * Deterministic shuffle (Fisher–Yates with a seeded PRNG).
 *
 * Real lobbies would ask a recommender service for these slices, but we
 * still want the SSR payload to match the first client render so we avoid
 * `Math.random()` here — each seed always produces the same ordering.
 */
function shuffle<T>(arr: readonly T[], seed: number): T[] {
  const out = arr.slice()
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Four curated swimlane arrays — each a random (but stable) slice of the
 * full catalogue so the lobby looks populated without repeating the same
 * ordering across rows.
 */
export const kinetikaFavorites: Game[] = shuffle(games, 0x1a2b3c).slice(0, 10)
export const newReleases: Game[] = shuffle(games, 0x4d5e6f).slice(0, 10)
export const liveCasino: Game[] = shuffle(games, 0x708192).slice(0, 10)
export const megaways: Game[] = shuffle(games, 0xa3b4c5).slice(0, 10)

/**
 * Composite used by the lobby page. Kept as a thin aggregator so the page
 * doesn't have to know about individual lane exports.
 */
export const swimlanes: { title: string; games: Game[] }[] = [
  { title: 'Kinetika Favorites', games: kinetikaFavorites },
  { title: 'New Releases', games: newReleases },
  { title: 'Live Casino', games: liveCasino },
  { title: 'Megaways Drops', games: megaways },
]
