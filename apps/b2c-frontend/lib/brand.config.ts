/**
 * Brand / white-label configuration.
 *
 * This file is the single source of truth for the active brand. It is
 * imported from the server (e.g. `layout.tsx` for <html lang>, Metadata API,
 * <meta name="theme-color">) and mirrored into CSS custom properties in
 * `app/globals.css` under the `@theme` block.
 *
 * To onboard a new brand: copy this file into a new `brands/<slug>.ts`,
 * swap values, and wire a loader that chooses based on hostname / env.
 */

export type BrandLocale = `${string}-${string}`

export interface BrandColors {
  /** Primary CTA / interactive accent. */
  primary: string
  /** Base background / canvas. */
  background: string
  /** Secondary accent — hero gradients, highlights. */
  accent: string
}

export interface BrandNavItem {
  label: string
  href: string
}

export interface BrandConfig {
  /** Public-facing brand name. Used in <title>, footer, a11y labels. */
  name: string
  /** Short tagline — rendered in meta description fallback. */
  tagline: string
  /** BCP 47 locale code, e.g. 'en-NO'. Drives <html lang> + Intl formatting. */
  locale: BrandLocale
  /** Regulator jurisdiction label shown in footer. */
  jurisdiction: string
  /** Core color tokens — mirrored as CSS vars. */
  colors: BrandColors
  /** Primary desktop nav. */
  primaryNav: BrandNavItem[]
}

export const brand: BrandConfig = {
  name: 'Kinetika',
  tagline: 'Play faster. Win smarter.',
  locale: 'en-NO',
  jurisdiction: 'Malta Gaming Authority (MGA)',
  colors: {
    primary: '#0ea5e9',
    background: '#0f172a',
    accent: '#8b5cf6',
  },
  primaryNav: [
    { label: 'Casino', href: '/casino' },
    { label: 'Live Casino', href: '/live-casino' },
    { label: 'Promotions', href: '/promotions' },
  ],
}
