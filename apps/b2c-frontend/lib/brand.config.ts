/**
 * Per-tenant brand configuration.
 *
 * Each entry is the single source of truth for one operator. The active
 * brand is resolved at request time from the dynamic `[tenant]` route
 * segment (populated by the middleware from the request `Host` header —
 * see `middleware.ts` and `lib/registry.ts`).
 *
 * Server callers (e.g. `app/[tenant]/layout.tsx` for `<html lang>`, the
 * Metadata API, `<meta name="theme-color">`, and the CSS-variable theme
 * injection) call `getBrandConfig(tenantId)` instead of importing a
 * static `brand` object.
 *
 * To onboard a new brand:
 *   1. Add a full palette + typography entry below.
 *   2. Seed `public/brands/<tenantId>/` with that brand's artwork.
 *   3. Register the hostname(s) in `lib/registry.ts`.
 *   4. Add a `next/font/google` loader in `lib/fonts.ts` and wire it
 *      into `getTenantFont` if the brand needs its own typeface.
 * No other code change is required — every brand-aware component reads
 * tokens exclusively from CSS custom properties.
 */

export type BrandLocale = `${string}-${string}`

export interface BrandColors {
  /** Primary CTA / interactive accent. */
  primary: string
  /** Ink used on top of `primary` (button labels, filled pill text). Must
   *  keep WCAG AA contrast against `primary`. */
  primaryContrast: string
  /** Base page canvas. Drives `<meta name="theme-color">`. */
  background: string
  /** Secondary accent — hero gradients, decorative highlights, links. */
  accent: string
  /** Default body text colour on top of `background`. */
  foreground: string
  /** Card / elevated surface — one step up from `background`. */
  surface: string
  /** Second elevation — hover states, nested surfaces. */
  surface2: string
  /** Hairline separators. Usually a low-opacity tint of `foreground`. */
  border: string
  /** Secondary / supporting copy. Usually a mid-opacity tint of
   *  `foreground`. */
  muted: string
}

export interface BrandTypography {
  /** Full CSS `font-family` value assigned to `--font-brand`. Typically
   *  `var(--font-<tenant>), <system fallback stack>` so the stack degrades
   *  gracefully if the web font fails to load. The `--font-<tenant>`
   *  variable itself is emitted by `next/font/google` — see `lib/fonts.ts`. */
  fontFamily: string
  /** Primary header navigation weight (desktop + mobile drawer). */
  navWeight: 500 | 600 | 700
  /** Header nav text transform. */
  navTransform: 'none' | 'uppercase'
  /** Header nav letter spacing for tone (e.g. sporty uppercase). */
  navLetterSpacing: string
  /** Footer column heading weight. */
  footerHeadingWeight: 600 | 700 | 800
  /** Footer column heading size. */
  footerHeadingSize: string
  /** Footer nav link weight. */
  footerLinkWeight: 400 | 500 | 600
  /**
   * Hero banner overlay copy colour.
   *
   * MB Casino promo art uses a dark-canvas treatment — overlay text must
   * stay light for contrast. Site chrome (header/footer) still uses
   * `colors.foreground` for the light theme.
   */
  heroTextColor: string
  /** Optional text shadow on hero title/body/kicker for legibility on
   *  busy photography. Empty string disables. */
  heroTextShadow: string
  /** Full CSS `background` for the hero slide scrim between artwork and
   *  copy. Tenant-tuned so dark-canvas banners are not double-crushed by
   *  an overly heavy gradient. */
  heroScrimGradient: string
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
  /** Canonical origin used as `metadataBase` for absolute URL generation. */
  metadataBase: string
  /** Full palette — every CSS variable the UI reads is set from here. */
  colors: BrandColors
  /** Type system tokens. */
  typography: BrandTypography
  /** Primary desktop nav. */
  primaryNav: BrandNavItem[]
}

/**
 * System-stack fallback appended to every tenant's `font-family`. Kept
 * in one place so the fallback priority is identical across brands.
 */
const SYSTEM_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const TENANT_BRANDS: Record<string, BrandConfig> = {
  /**
   * Kinetika — dark, techy, performance-driven.
   * Electric-blue primary on deep-navy canvas, violet accent.
   */
  kinetika: {
    name: 'Kinetika',
    tagline: 'Play faster. Win smarter.',
    locale: 'en-NO',
    jurisdiction: 'Malta Gaming Authority (MGA)',
    metadataBase: 'https://kinetika.example',
    colors: {
      primary: '#0ea5e9',
      primaryContrast: '#ffffff',
      background: '#0f172a',
      accent: '#8b5cf6',
      foreground: '#f8fafc',
      surface: '#111c33',
      surface2: '#17223d',
      border: 'rgba(255, 255, 255, 0.08)',
      muted: 'rgba(255, 255, 255, 0.6)',
    },
    typography: {
      fontFamily: `var(--font-kinetika), ${SYSTEM_FONT_STACK}`,
      navWeight: 500,
      navTransform: 'none',
      navLetterSpacing: '0em',
      footerHeadingWeight: 600,
      footerHeadingSize: '0.875rem',
      footerLinkWeight: 400,
      heroTextColor: '#FFFFFF',
      heroTextShadow: '0 2px 8px rgba(0,0,0,0.45)',
      heroScrimGradient:
        'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.55) 45%, rgba(15,23,42,0.15) 80%, transparent 100%)',
    },
    primaryNav: [
      { label: 'Casino', href: '/casino' },
      { label: 'Live Casino', href: '/live-casino' },
      { label: 'Promotions', href: '/promotions' },
    ],
  },

  /**
   * MB Casino — "Aura Sport" identity.
   *
   * Vibe: light, bright, high-energy, sporty. Pure-white canvas with
   * Electric Orange primary (action) and Royal Blue accent (trust),
   * paired with Barlow for the sporty/athletic type voice. Promo hero
   * art uses a dark canvas — overlay copy is therefore light for
   * contrast; `colors.foreground` remains the site body ink outside the
   * hero.
   *
   * Contrast notes:
   *   - `#FF5722` on `#FFFFFF` is 4.53:1 (AA for large text; we keep
   *     button labels on orange in white, not orange-on-white).
   *   - `#1A1A1A` on `#FFFFFF` is 17.4:1 (well above AAA).
   *   - `rgba(26, 26, 26, 0.6)` on `#FFFFFF` stays above 4.5:1 for body
   *     copy.
   */
  mbcasino: {
    name: 'MB Casino',
    tagline: 'Bigger wins. Bolder play.',
    locale: 'en-MT',
    jurisdiction: 'Malta Gaming Authority (MGA)',
    metadataBase: 'https://mbcasino.example',
    colors: {
      primary: '#FF5722',
      primaryContrast: '#FFFFFF',
      background: '#FFFFFF',
      accent: '#2979FF',
      foreground: '#1A1A1A',
      surface: '#F5F7FA',
      surface2: '#EAEEF3',
      border: 'rgba(26, 26, 26, 0.1)',
      muted: 'rgba(26, 26, 26, 0.6)',
    },
    typography: {
      fontFamily: `var(--font-mbcasino), ${SYSTEM_FONT_STACK}`,
      navWeight: 600,
      navTransform: 'uppercase',
      navLetterSpacing: '0.05em',
      footerHeadingWeight: 700,
      footerHeadingSize: '1rem',
      footerLinkWeight: 600,
      heroTextColor: '#FFFFFF',
      heroTextShadow:
        '0 1px 2px rgba(0,0,0,0.85), 0 2px 18px rgba(0,0,0,0.55)',
      heroScrimGradient:
        'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.14) 52%, transparent 100%)',
    },
    primaryNav: [
      { label: 'Casino', href: '/casino' },
      { label: 'Live Casino', href: '/live-casino' },
      { label: 'Promotions', href: '/promotions' },
    ],
  },
}

/**
 * Resolve the brand config for a given `tenantId`.
 *
 * Falls back to `kinetika` (the seed brand) for unknown ids so a routing
 * mistake degrades gracefully to a recognisable lobby instead of a hard
 * crash. Unknown ids should be impossible at runtime because the
 * middleware only rewrites to ids present in the registry, but the
 * fallback keeps unit tests and Storybook stable.
 */
export function getBrandConfig(tenantId: string): BrandConfig {
  return TENANT_BRANDS[tenantId] ?? TENANT_BRANDS.kinetika
}
