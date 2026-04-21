/**
 * Per-tenant web fonts.
 *
 * We use `next/font/google` so Next downloads the font at build time,
 * self-hosts it, injects `<link rel="preload">`, and applies
 * `font-display: swap` with zero CLS. Each loader call creates a scoped
 * CSS variable that only ships on pages that actually apply its
 * `.variable` class — so Kinetika pages ship only Inter, and MB Casino
 * pages ship only Barlow.
 *
 * Each font exposes its family name via a uniquely-named variable
 * (`--font-kinetika`, `--font-mbcasino`). The tenant layout then aliases
 * one of them to the generic `--font-brand` variable via an inline
 * style, so component CSS can keep referencing a single brand-agnostic
 * variable (see `app/globals.css`).
 */

import { Inter, Barlow } from 'next/font/google'

/**
 * Kinetika — clean, modern grotesque.
 *
 * Inter is the de-facto "tech / product" face on the modern web; it
 * pairs well with the deep-navy surface and electric accent.
 */
export const kinetikaFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kinetika',
})

/**
 * MB Casino — Aura Sport.
 *
 * Barlow (Paul D. Hunt, 2017) is a low-contrast grotesque originally
 * drawn for California DMV + transit signage. It carries strong sporty
 * associations — you see it on MLS kits, cycling kit prints, and
 * Nike-style athletic collateral — which matches the "energetic, sporty,
 * young" brief. We load the weight range the UI actually uses:
 *   - 500 for body copy
 *   - 600 for nav / secondary CTAs
 *   - 700/800 for headlines and the primary "Play Now" pill
 */
export const mbcasinoFont = Barlow({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-mbcasino',
})

const TENANT_FONTS = {
  kinetika: kinetikaFont,
  mbcasino: mbcasinoFont,
} as const

/**
 * Resolve the font loader for a given tenant.
 *
 * Falls back to the Kinetika face for unknown ids so a routing mistake
 * degrades to a recognisable default instead of an unstyled lobby.
 */
export function getTenantFont(tenantId: string) {
  return TENANT_FONTS[tenantId as keyof typeof TENANT_FONTS] ?? kinetikaFont
}
