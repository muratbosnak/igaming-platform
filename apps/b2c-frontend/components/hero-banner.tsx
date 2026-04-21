import Image from 'next/image'
import Link from 'next/link'
import { getBanners, type Banner } from '@/lib/banners'
import { getBrandConfig } from '@/lib/brand.config'

interface HeroBannerProps {
  /** Tenant id from the dynamic `[tenant]` route segment. Drives the
   *  banner catalogue lookup so each operator can ship its own promo
   *  artwork from `/brands/<tenantId>/images/banners/...`. */
  tenantId: string
}

/**
 * Proxy-aware base path.
 *
 * Next.js applies `basePath` automatically to `<Link>` and to optimised
 * `<Image>` requests, but **not** to `unoptimized` images — the raw `src`
 * is written to the DOM verbatim. When the app is served behind a subpath
 * gateway (e.g. `/igaming-platform/B2C-frontend/...`) the browser
 * otherwise asks for `/brands/...` at the root origin and 404s.
 *
 * `NEXT_PUBLIC_BASE_PATH` is inlined at build time, so referencing it
 * here keeps this a Server Component with zero runtime cost on the
 * client.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * Hero carousel — pure RSC, zero JavaScript.
 *
 * The "carousel" is a CSS scroll-snap row: native overflow scroll handles
 * touch/trackpad swiping, `snap-x snap-mandatory` snaps to slides, and
 * `scrollbar-hide` keeps the chrome clean. No useState, no
 * IntersectionObserver, no carousel library — which means no hydration
 * cost and no CLS.
 *
 * Slide widths (`w-[90%] md:w-[70%] lg:w-[50%] flex-shrink-0`) ensure the
 * neighbouring slide always peeks in, hinting that there's more to scroll.
 *
 * Heights are strictly `h-48 md:h-64` so the row reserves vertical space
 * at first paint and never reflows.
 */
export function HeroBanner({ tenantId }: HeroBannerProps) {
  const banners = getBanners(tenantId)
  const brand = getBrandConfig(tenantId)

  return (
    <section aria-label="Featured promotions">
      <ul
        role="list"
        className="-mx-4 flex h-48 snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 px-4 scrollbar-hide md:-mx-8 md:h-64 md:gap-4 md:scroll-pl-8 md:px-8 lg:-mx-12 lg:scroll-pl-12 lg:px-12"
      >
        {banners.map((banner, i) => (
          <li
            key={banner.id}
            className="w-[90%] flex-shrink-0 snap-center md:w-[70%] lg:w-[50%]"
          >
            <HeroSlideCard
              banner={banner}
              isLcp={i === 0}
              textColor={brand.typography.heroTextColor}
              textShadow={brand.typography.heroTextShadow}
              scrimGradient={brand.typography.heroScrimGradient}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * `isLcp` drives the loading strategy:
 *  - the first slide is the Largest Contentful Paint candidate, so we
 *    mark it `priority` (which also sets `fetchPriority="high"` and
 *    `loading="eager"` internally in `next/image`);
 *  - every subsequent slide is `loading="lazy"` so the browser only
 *    pulls their bytes once the user actually scrolls them into view.
 *    This keeps the initial hero payload down to a single JPG even
 *    though the DOM contains four slides.
 */
function HeroSlideCard({
  banner,
  isLcp,
  textColor,
  textShadow,
  scrimGradient,
}: {
  banner: Banner
  isLcp: boolean
  textColor: string
  textShadow: string
  scrimGradient: string
}) {
  const copyShadow = textShadow.trim() ? textShadow : undefined
  return (
    <article className="relative isolate flex h-full flex-col justify-end overflow-hidden rounded-2xl">
      <Image
        src={`${BASE_PATH}${banner.imageSrc}`}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 90vw, (max-width: 1024px) 70vw, 50vw"
        unoptimized
        {...(isLcp ? { priority: true } : { loading: 'lazy' as const })}
      />

      {/*
       * Contrast guarantee: a two-stop vertical gradient sits between the
       * background image and the copy. Even when the image crop on narrow
       * phones hides the "dark" part of the artwork, this scrim keeps the
       * WCAG contrast ratio of the white title and badge above 4.5:1.
       *
       * A second, subtler sheen adds depth without tinting the copy area.
       */}
      <div aria-hidden className="absolute inset-0" style={{ background: scrimGradient }} />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_0%,transparent_45%)] mix-blend-overlay"
      />

      <div className="relative flex flex-col items-start gap-2 p-5 md:gap-3 md:p-7">
        <span
          className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur md:text-[11px]"
          style={{ color: textColor, textShadow: copyShadow }}
        >
          {banner.badgeText}
        </span>
        <h2
          className="text-xl font-bold leading-tight tracking-tight md:text-3xl lg:text-4xl"
          style={{ color: textColor, textShadow: copyShadow }}
        >
          {banner.title}
        </h2>
        <p
          className="max-w-xl text-sm leading-relaxed md:text-base"
          style={{ color: textColor, textShadow: copyShadow }}
        >
          {banner.bodyText}
        </p>
        <Link
          href={banner.href}
          className="mt-1 inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl bg-brand-primary px-4 text-sm font-semibold text-brand-primary-contrast shadow-[0_12px_32px_-12px_var(--color-brand-primary)] transition-opacity hover:opacity-90 md:px-5"
        >
          {banner.ctaText}
          <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
}
