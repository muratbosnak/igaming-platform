interface HeroSlide {
  eyebrow: string
  title: string
  cta: string
  href: string
  /** Two-stop palette for the CSS gradient placeholder. */
  palette: [string, string]
}

const slides: HeroSlide[] = [
  {
    eyebrow: 'New player offer',
    title: '100% Welcome Bonus',
    cta: 'Deposit & Play',
    href: '/deposit',
    palette: ['#0ea5e9', '#8b5cf6'],
  },
  {
    eyebrow: 'Every Monday',
    title: 'Weekly Cashback',
    cta: 'Claim Now',
    href: '/promotions/cashback',
    palette: ['#f59e0b', '#ef4444'],
  },
  {
    eyebrow: 'Live event',
    title: 'Live Casino Tourney',
    cta: 'Join Tournament',
    href: '/promotions/live-tourney',
    palette: ['#14b8a6', '#0ea5e9'],
  },
  {
    eyebrow: 'Just landed',
    title: 'New Game Drop',
    cta: 'Play New Releases',
    href: '/casino/new',
    palette: ['#ec4899', '#8b5cf6'],
  },
]

/**
 * Hero carousel — pure RSC, zero JavaScript.
 *
 * The "carousel" is a CSS scroll-snap row: native overflow scroll handles
 * touch/trackpad swiping, `snap-x snap-mandatory` snaps to slides, and
 * `scrollbar-hide` keeps the chrome clean. No useState, no IntersectionObserver,
 * no carousel library — which means no hydration cost and no CLS.
 *
 * Slide widths (`w-[90%] md:w-[70%] lg:w-[50%] flex-shrink-0`) ensure the
 * neighbouring slide always peeks in, hinting that there's more to scroll.
 *
 * Heights are strictly `h-48 md:h-64` so the row reserves vertical space at
 * first paint and never reflows.
 */
export function HeroBanner() {
  return (
    <section aria-label="Featured promotions">
      <ul
        role="list"
        className="-mx-4 flex h-48 snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 px-4 scrollbar-hide md:-mx-8 md:h-64 md:gap-4 md:scroll-pl-8 md:px-8 lg:-mx-12 lg:scroll-pl-12 lg:px-12"
      >
        {slides.map((slide) => (
          <li
            key={slide.title}
            className="w-[90%] flex-shrink-0 snap-center md:w-[70%] lg:w-[50%]"
          >
            <HeroSlideCard slide={slide} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function HeroSlideCard({ slide }: { slide: HeroSlide }) {
  const [from, to] = slide.palette
  return (
    <article
      className="relative isolate flex h-full flex-col justify-end overflow-hidden rounded-2xl p-5 md:p-7"
      style={{
        backgroundImage: `radial-gradient(120% 80% at 80% 20%, ${from} 0%, transparent 55%), radial-gradient(100% 80% at 10% 90%, ${to} 0%, transparent 55%), linear-gradient(180deg, #0b1220 0%, #0f172a 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0%,transparent_45%)] mix-blend-overlay"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.85)_0%,rgba(15,23,42,0.2)_55%,transparent_85%)]"
      />

      <div className="relative flex flex-col items-start gap-2 md:gap-3">
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground/90 backdrop-blur md:text-[11px]">
          {slide.eyebrow}
        </span>
        <h2 className="text-xl font-bold leading-tight tracking-tight text-brand-foreground md:text-3xl lg:text-4xl">
          {slide.title}
        </h2>
        <a
          href={slide.href}
          className="mt-1 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-brand-primary-contrast shadow-[0_12px_32px_-12px_var(--color-brand-primary)] transition-opacity hover:opacity-90 md:px-5"
        >
          {slide.cta}
          <svg
            className="ml-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </article>
  )
}
