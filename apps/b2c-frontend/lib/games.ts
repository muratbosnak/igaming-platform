/**
 * Mock game catalogue.
 *
 * In production this is replaced by a server fetch (likely an RSC `fetch`
 * with `cache: 'force-cache'` + `revalidateTag`) against the aggregator.
 * Shape is intentionally narrow to keep the tile component dumb.
 */

export type GameCategory = 'slots' | 'live' | 'megaways' | 'table'

export interface Game {
  id: string
  title: string
  provider: string
  categories: GameCategory[]
  /** Deterministic gradient tuple for the placeholder tile. */
  palette: [string, string]
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

export const games: Game[] = [
  { id: 'g-01', title: 'Sky Reels',        provider: 'NetEnt',         categories: ['slots'],              palette: ['#0ea5e9', '#8b5cf6'] },
  { id: 'g-02', title: 'Gonzo Megaways',   provider: 'Red Tiger',      categories: ['slots', 'megaways'],  palette: ['#f59e0b', '#ef4444'] },
  { id: 'g-03', title: 'Lightning Roulette', provider: 'Evolution',    categories: ['live', 'table'],      palette: ['#14b8a6', '#0ea5e9'] },
  { id: 'g-04', title: 'Crazy Time',       provider: 'Evolution',      categories: ['live'],               palette: ['#ec4899', '#8b5cf6'] },
  { id: 'g-05', title: 'Bonanza',          provider: 'Big Time Gaming',categories: ['slots', 'megaways'],  palette: ['#84cc16', '#22c55e'] },
  { id: 'g-06', title: 'Book of Dead',     provider: 'Play\u2019n GO', categories: ['slots'],              palette: ['#eab308', '#f97316'] },
  { id: 'g-07', title: 'Blackjack Live',   provider: 'Evolution',      categories: ['live', 'table'],      palette: ['#22c55e', '#0ea5e9'] },
  { id: 'g-08', title: 'Starburst',        provider: 'NetEnt',         categories: ['slots'],              palette: ['#6366f1', '#8b5cf6'] },
  { id: 'g-09', title: 'Dead or Alive 2',  provider: 'NetEnt',         categories: ['slots'],              palette: ['#78350f', '#ef4444'] },
  { id: 'g-10', title: 'Reactoonz',        provider: 'Play\u2019n GO', categories: ['slots'],              palette: ['#a855f7', '#ec4899'] },
  { id: 'g-11', title: 'Extra Chilli',     provider: 'Big Time Gaming',categories: ['slots', 'megaways'],  palette: ['#b91c1c', '#f97316'] },
  { id: 'g-12', title: 'Immersive Roulette', provider: 'Evolution',    categories: ['live', 'table'],      palette: ['#0f766e', '#22d3ee'] },
  { id: 'g-13', title: 'Sweet Bonanza',    provider: 'Pragmatic Play', categories: ['slots'],              palette: ['#db2777', '#f43f5e'] },
  { id: 'g-14', title: 'Wolf Gold',        provider: 'Pragmatic Play', categories: ['slots'],              palette: ['#f59e0b', '#84cc16'] },
  { id: 'g-15', title: 'Monopoly Live',    provider: 'Evolution',      categories: ['live'],               palette: ['#ef4444', '#fbbf24'] },
  { id: 'g-16', title: 'Divine Fortune',   provider: 'NetEnt',         categories: ['slots'],              palette: ['#f59e0b', '#f43f5e'] },
]

export function filterGames(category: string | undefined): Game[] {
  if (!category || category === 'all') return games
  return games.filter((g) => (g.categories as string[]).includes(category))
}

/**
 * Curated swimlane slices.
 *
 * Real product would derive these from a recommender service / CMS; for now
 * they are deterministic slices of the mock catalogue so the lobby renders
 * predictably across renders.
 */
export const swimlanes: { title: string; games: Game[] }[] = [
  {
    title: 'Kinetika Favorites',
    games: [
      games[7], games[0], games[12], games[1], games[5], games[3], games[15], games[9],
    ],
  },
  {
    title: 'New Releases',
    games: [
      games[12], games[13], games[15], games[5], games[9], games[8], games[0], games[7],
    ],
  },
  {
    title: 'Live Casino',
    games: games.filter((g) => g.categories.includes('live')),
  },
  {
    title: 'Megaways Drops',
    games: games.filter((g) => g.categories.includes('megaways')),
  },
]
