import Image from 'next/image'
import Link from 'next/link'
import type { Game } from '@/lib/games'

/**
 * Proxy-aware base path.
 *
 * Next.js applies `basePath` automatically to `<Link>` and to optimised
 * `<Image>` requests, but **not** to `unoptimized` images — those render
 * the raw `src` verbatim. When the app is served behind a subpath proxy
 * (e.g. `/igaming-platform/B2C-frontend/...`) the browser therefore asks
 * for `/brands/...` at the root origin and gets a 404.
 *
 * `NEXT_PUBLIC_BASE_PATH` is inlined at build time by Next, so referencing
 * it here keeps this file a Server Component and still gives the correct
 * value on the client for hydration parity.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * Square game tile — CLS-safe, zero client JS.
 *
 * - 1:1 aspect ratio (`aspect-square`) so the grid reserves height before
 *   paint and the swimlane doesn't reflow once images decode.
 * - Default state shows the artwork only. No gradient, no text. Any metadata
 *   (title, provider, CTA) is revealed inside a dark hover overlay.
 * - Hover overlay is **desktop-only** (`md:` prefixed). On touch devices we
 *   never enter a sticky `:hover` state — tapping the wrapping `<Link>` fires
 *   navigation immediately.
 * - Focus state mirrors hover for keyboard users on desktop breakpoints.
 */
export function GameTile({ game }: { game: Game }) {
  return (
    <Link
      href={`/game/${game.id}`}
      aria-label={`${game.title} by ${game.provider}`}
      className="group relative block aspect-square overflow-hidden rounded-xl bg-brand-surface outline-none ring-brand-primary/60 transition-transform duration-200 ease-out will-change-transform focus-visible:ring-2 md:hover:scale-[1.03] md:focus-visible:scale-[1.03]"
      style={{ contain: 'paint' }}
    >
      <Image
        src={`${BASE_PATH}${game.imageSrc}`}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
        unoptimized
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-black/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
      >
        <span className="absolute left-1/2 top-1/2 inline-flex h-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap rounded-full bg-brand-primary px-4 text-sm font-semibold text-brand-primary-contrast shadow-[0_12px_32px_-12px_var(--color-brand-primary)]">
          Play Now
          <svg viewBox="0 0 24 24" className="ml-2 h-4 w-4" fill="none" aria-hidden>
            <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />
          </svg>
        </span>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3 md:p-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-primary">
            {game.provider}
          </span>
          <span className="line-clamp-2 text-sm font-bold leading-tight text-white">
            {game.title}
          </span>
        </div>
      </div>
    </Link>
  )
}
