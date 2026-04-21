/**
 * Hero carousel promotions.
 *
 * Schema is intentionally CMS-shaped (`id`, `imageSrc`, `badgeText`, `title`,
 * `ctaText`, `href`) so the eventual migration from this static file to a
 * `fetch('/api/banners')` RSC data source is a one-line swap — the component
 * keeps consuming the same typed array.
 *
 * `imageSrc` values are root-relative; the hero component is responsible for
 * prepending the environment's basePath (see `NEXT_PUBLIC_BASE_PATH`) so the
 * same catalogue works behind a proxy, on staging, or at a bare production
 * root without edits here.
 */

export interface Banner {
  id: string
  imageSrc: string
  badgeText: string
  title: string
  ctaText: string
  /** Destination when the CTA is clicked. Not part of the minimum schema but
   *  required to make the button functional. Matches the shape a real CMS
   *  would return (e.g. Contentful / Sanity `linkUrl` fields). */
  href: string
}

const ART = '/brands/kinetika/images/banners'

export const banners: Banner[] = [
  {
    id: 'welcome-bonus',
    imageSrc: `${ART}/welcome-bonus.jpg`,
    badgeText: 'New player offer',
    title: '100% Welcome Bonus',
    ctaText: 'Deposit & Play',
    href: '/deposit',
  },
  {
    id: 'new-game-drops',
    imageSrc: `${ART}/new-game-drops.jpg`,
    badgeText: 'Just landed',
    title: 'Explode into New Adventures',
    ctaText: 'Play New Releases',
    href: '/casino/new',
  },
  {
    id: 'weekly-cashback',
    imageSrc: `${ART}/weekly-cashback.jpg`,
    badgeText: 'Every Monday',
    title: 'Up to 20% Cashback',
    ctaText: 'Claim Now',
    href: '/promotions/cashback',
  },
  {
    id: 'live-casino-tourney',
    imageSrc: `${ART}/live-casino-tourney.jpg`,
    badgeText: 'Live event',
    title: 'The Tourney of Titans',
    ctaText: 'Join Tournament',
    href: '/promotions/live-tourney',
  },
]
