import type { Metadata } from 'next'
import { brand } from '@/lib/brand.config'
import { HeroBanner } from '@/components/hero-banner'
import { GameSwimlane } from '@/components/game-swimlane'
import { swimlanes } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Casino Lobby',
  description: `Play top slots, live casino and Megaways at ${brand.name}. Licensed by ${brand.jurisdiction}. 18+ only.`,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${brand.name} — Casino Lobby`,
    description: `Slots, Live Casino, Megaways and more at ${brand.name}.`,
  },
}

/**
 * Lobby page (RSC).
 *
 * Layout is fluid edge-to-edge. The hero carousel and each swimlane bleed to
 * the viewport edges (`-mx-*`) so the swipe gesture feels native on mobile,
 * while content text aligns with the page gutter (`px-4 md:px-8 lg:px-12`).
 */
export default function LobbyPage() {
  return (
    <div className="w-full px-4 py-4 md:px-8 md:py-6 lg:px-12 lg:py-8">
      <HeroBanner />

      <div className="mt-6 flex flex-col gap-8 md:mt-10 md:gap-12">
        {swimlanes.map((lane) => (
          <GameSwimlane key={lane.title} title={lane.title} games={lane.games} />
        ))}
      </div>
    </div>
  )
}
