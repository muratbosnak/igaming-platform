import type { Game } from '@/lib/games'

/**
 * Dark placeholder tile — CLS-safe + zero JS.
 *
 * - Strictly `aspect-[3/4]` so the grid reserves height before paint.
 * - Hover state (desktop): whole tile scales 1.05 and a "Play Now" overlay
 *   fades in. Implemented with Tailwind's `group-hover:` — no JS handlers.
 * - Focus state mirrors hover for keyboard users.
 */
export function GameTile({ game }: { game: Game }) {
  const [from, to] = game.palette
  return (
    <a
      href={`/game/${game.id}`}
      aria-label={`${game.title} by ${game.provider}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-brand-surface outline-none ring-brand-primary/60 transition-transform duration-200 ease-out will-change-transform focus-visible:ring-2 md:hover:scale-[1.05] md:focus-visible:scale-[1.05]"
      style={{ contain: 'paint' }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 80% at 20% 15%, ${from} 0%, transparent 55%), radial-gradient(100% 80% at 85% 85%, ${to} 0%, transparent 55%), linear-gradient(180deg, #0b1220 0%, #111c33 100%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.1)_55%,transparent_100%)]"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3 md:p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-brand-foreground/70">
          {game.provider}
        </span>
        <span className="text-sm font-semibold leading-tight text-brand-foreground md:text-base">
          {game.title}
        </span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:flex"
      >
        <span className="inline-flex h-11 items-center justify-center rounded-full bg-brand-primary px-5 text-sm font-semibold text-brand-primary-contrast shadow-[0_12px_32px_-12px_var(--color-brand-primary)]">
          Play Now
          <svg viewBox="0 0 24 24" className="ml-1.5 h-4 w-4" fill="none" aria-hidden>
            <path
              d="M8 5v14l11-7L8 5Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
    </a>
  )
}
