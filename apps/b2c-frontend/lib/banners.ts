/**
 * Hero carousel promotions — per tenant.
 *
 * Schema is intentionally CMS-shaped (`id`, `imageSrc`, `badgeText`,
 * `title`, `ctaText`, `href`) so the eventual migration from this static
 * file to a `fetch('/api/banners?tenant=...')` RSC data source is a
 * one-line swap — the component keeps consuming the same typed array.
 *
 * `imageSrc` values are root-relative and tenant-scoped
 * (`/brands/<tenantId>/images/banners/...`); the hero component is
 * responsible for prepending `NEXT_PUBLIC_BASE_PATH` so the same catalogue
 * works behind a proxy gateway, on staging, or at a bare production root
 * without edits here.
 */

export interface Banner {
  id: string
  imageSrc: string
  badgeText: string
  title: string
  bodyText: string
  ctaText: string
  /** Destination when the CTA is clicked. Not part of the minimum schema but
   *  required to make the button functional. Matches the shape a real CMS
   *  would return (e.g. Contentful / Sanity `linkUrl` fields). */
  href: string
}

/**
 * Build the banner catalogue for a given tenant.
 *
 * Today every brand ships the same four promo slots — the per-tenant
 * variation lives in the artwork on disk under
 * `public/brands/<tenantId>/images/banners/*.jpg`. When a CMS replaces
 * this file the function signature stays identical; only the body
 * becomes a `fetch`.
 */
export function getBanners(tenantId: string): Banner[] {
  const ART = `/brands/${tenantId}/images/banners`

  if (tenantId === 'mbcasino') {
    return [
      {
        id: 'welcome-offer-kickoff',
        imageSrc: `${ART}/welcome-offer-kickoff.jpg`,
        badgeText: 'WELCOME OFFER',
        title: 'KICKOFF YOUR MB CASINO JOURNEY!',
        bodyText: 'Claim up to €1000 + 100 Free Spins on your first three deposits.',
        ctaText: 'JOIN NOW',
        href: '/register',
      },
      {
        id: 'live-casino-courtside',
        imageSrc: `${ART}/live-casino-courtside.jpg`,
        badgeText: 'LIVE CASINO',
        title: 'JOIN THE ACTION COURTSIDE!',
        bodyText: 'Experience the thrill of real-time dealers on your favorite table games.',
        ctaText: 'PLAY LIVE',
        href: '/live-casino',
      },
      {
        id: 'turbo-reels-drop',
        imageSrc: `${ART}/turbo-reels-drop.jpg`,
        badgeText: 'SLOTS EXPLOSION',
        title: 'GET READY FOR TURBO-CHARGED WINS!',
        bodyText: 'Explore hundreds of fast-paced slots with massive jackpot drops.',
        ctaText: 'SPIN TO WIN',
        href: '/casino/slots',
      },
      {
        id: 'championship-leaderboard',
        imageSrc: `${ART}/championship-leaderboard.jpg`,
        badgeText: 'LEADERBOARD TOURNAMENT',
        title: 'COMPETE IN THE MB CHAMPIONSHIP!',
        bodyText:
          'Play eligible games to climb the ranks and win your share of the weekly €10,000 prize pool.',
        ctaText: 'JOIN TOURNAMENT',
        href: '/promotions/tournament',
      },
    ]
  }

  return [
    {
      id: 'welcome-bonus',
      imageSrc: `${ART}/welcome-bonus.jpg`,
      badgeText: 'New player offer',
      title: '100% Welcome Bonus',
      bodyText: 'Unlock your welcome package and start spinning right away.',
      ctaText: 'Deposit & Play',
      href: '/deposit',
    },
    {
      id: 'new-game-drops',
      imageSrc: `${ART}/new-game-drops.jpg`,
      badgeText: 'Just landed',
      title: 'Explode into New Adventures',
      bodyText: 'Fresh releases are live with bigger multipliers and bonus features.',
      ctaText: 'Play New Releases',
      href: '/casino/new',
    },
    {
      id: 'weekly-cashback',
      imageSrc: `${ART}/weekly-cashback.jpg`,
      badgeText: 'Every Monday',
      title: 'Up to 20% Cashback',
      bodyText: 'Get part of your weekly losses back and jump in with confidence.',
      ctaText: 'Claim Now',
      href: '/promotions/cashback',
    },
    {
      id: 'live-casino-tourney',
      imageSrc: `${ART}/live-casino-tourney.jpg`,
      badgeText: 'Live event',
      title: 'The Tourney of Titans',
      bodyText: 'Join this week’s live tables battle and compete for top prizes.',
      ctaText: 'Join Tournament',
      href: '/promotions/live-tourney',
    },
  ]
}
