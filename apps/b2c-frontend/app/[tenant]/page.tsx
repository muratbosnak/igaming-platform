import type { Metadata } from 'next'
import { getBrandConfig } from '@/lib/brand.config'
import { HeroBanner } from '@/components/hero-banner'
import { GameSwimlane } from '@/components/game-swimlane'
import { getSwimlanes } from '@/lib/games'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>
}): Promise<Metadata> {
  const { tenant } = await params
  const brand = getBrandConfig(tenant)

  return {
    title: 'Casino Lobby',
    description: `Play top slots, live casino and Megaways at ${brand.name}. Licensed by ${brand.jurisdiction}. 18+ only.`,
    alternates: { canonical: '/' },
    openGraph: {
      title: `${brand.name} — Casino Lobby`,
      description: `Slots, Live Casino, Megaways and more at ${brand.name}.`,
    },
  }
}

/**
 * Lobby page (RSC).
 *
 * Layout is fluid edge-to-edge. The hero carousel and each swimlane bleed
 * to the viewport edges (`-mx-*`) so the swipe gesture feels native on
 * mobile, while content text aligns with the page gutter
 * (`px-4 md:px-8 lg:px-12`).
 *
 * Tenant resolution: the `[tenant]` segment is populated by the proxy
 * rewrite (see `proxy.ts`). We forward that id into every
 * tenant-sensitive child (data fetchers, hero, swimlanes) so brand
 * switching is a one-line change at the request boundary.
 */
export default async function LobbyPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  const brand = getBrandConfig(tenant)
  const swimlanes = getSwimlanes(tenant, brand.name)

  return (
    <div className="w-full px-4 py-4 md:px-8 md:py-6 lg:px-12 lg:py-8">
      <HeroBanner tenantId={tenant} />

      <div className="mt-6 flex flex-col gap-8 md:mt-10 md:gap-12">
        {swimlanes.map((lane) => (
          <GameSwimlane key={lane.title} title={lane.title} games={lane.games} />
        ))}
      </div>
    </div>
  )
}
