import type { Game } from '@/lib/games'
import { GameTile } from './game-tile'

interface GameSwimlaneProps {
  title: string
  games: Game[]
  /** Optional "see all" route shown next to the title on md+. */
  href?: string
}

/**
 * Netflix-style horizontal rail (pure RSC, zero JS).
 *
 * - Native `overflow-x-auto` + `snap-x snap-mandatory` handles touch + trackpad
 *   swiping, with `scrollbar-hide` for clean chrome.
 * - The row bleeds to the viewport edges (`-mx-4 md:-mx-8 lg:-mx-12`) so the
 *   first tile lines up with the page gutter and the last tile peeks off-screen.
 * - `scroll-pl-*` keeps snap-aligned tiles flush with the gutter when paged.
 * - Vertical `py-3` gives breathing room so `md:hover:scale-[1.05]` on tiles
 *   isn't clipped by the scroller's implicit `overflow-y: hidden`.
 */
export function GameSwimlane({ title, games, href }: GameSwimlaneProps) {
  if (games.length === 0) return null

  return (
    <section aria-labelledby={slugify(title)} className="flex flex-col gap-3 md:gap-4">
      <header className="flex items-end justify-between gap-4">
        <h2
          id={slugify(title)}
          className="text-lg font-semibold tracking-tight text-brand-foreground md:text-xl"
        >
          {title}
        </h2>
        {href ? (
          <a
            href={href}
            className="text-xs font-medium text-brand-muted transition-colors hover:text-brand-foreground md:text-sm"
          >
            See all →
          </a>
        ) : null}
      </header>

      <div
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 px-4 py-3 scrollbar-hide md:-mx-8 md:gap-4 md:scroll-pl-8 md:px-8 lg:-mx-12 lg:scroll-pl-12 lg:px-12"
        role="list"
      >
        {games.map((game) => (
          <div
            key={game.id}
            role="listitem"
            className="w-32 flex-shrink-0 snap-start md:w-40 lg:w-48"
          >
            <GameTile game={game} />
          </div>
        ))}
      </div>
    </section>
  )
}

function slugify(s: string) {
  return `lane-${s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
}
