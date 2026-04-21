import type { Metadata, Viewport } from 'next'
import { getBrandConfig } from '@/lib/brand.config'
import { getTenantFont } from '@/lib/fonts'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import '../globals.css'

/**
 * Tenant-aware root layout.
 *
 * This file is the root layout for every request because the middleware
 * (`middleware.ts`) rewrites every incoming URL to `/<tenantId>/...`.
 * Living here — rather than at `app/layout.tsx` — lets us read the
 * dynamic `[tenant]` route param via `params` and render `<html lang>`,
 * the Metadata API, the theme color, the header and the footer with the
 * correct brand on the very first byte (no client hop, no FOUC).
 *
 * `params` is a Promise in Next 16; we `await` it both here and in
 * `generateMetadata` / `generateViewport`.
 */

/**
 * `basePath` prepend for icon URLs. Next's metadata resolver does NOT
 * auto-prefix `basePath` for icon URLs (only for route-level links) so
 * we handle it manually. Empty by default now that we route via
 * subdomains, but the hook stays in place for future proxied deploys.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>
}): Promise<Metadata> {
  const { tenant } = await params
  const brand = getBrandConfig(tenant)

  return {
    metadataBase: new URL(brand.metadataBase),
    title: {
      default: `${brand.name} — ${brand.tagline}`,
      template: `%s · ${brand.name}`,
    },
    description: `${brand.name} Casino · Slots, Live Casino & Megaways. Licensed by ${brand.jurisdiction}. 18+ only. Play responsibly.`,
    applicationName: brand.name,
    keywords: ['online casino', 'slots', 'live casino', 'megaways', brand.name],
    robots: { index: true, follow: true },
    alternates: { canonical: '/' },
    icons: {
      icon: [
        {
          media: '(prefers-color-scheme: light)',
          url: `${basePath}/brands/${tenant}/images/brand/favicon-light.ico`,
        },
        {
          media: '(prefers-color-scheme: dark)',
          url: `${basePath}/brands/${tenant}/images/brand/favicon-dark.ico`,
        },
      ],
      apple: `${basePath}/brands/${tenant}/images/brand/apple-touch-icon.png`,
    },
    openGraph: {
      type: 'website',
      locale: brand.locale.replace('-', '_'),
      siteName: brand.name,
      title: `${brand.name} — ${brand.tagline}`,
      description: `Licensed online casino. Slots, Live Casino & more. 18+ only.`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand.name} — ${brand.tagline}`,
    },
  }
}

export async function generateViewport({
  params,
}: {
  params: Promise<{ tenant: string }>
}): Promise<Viewport> {
  const { tenant } = await params
  const brand = getBrandConfig(tenant)

  return {
    themeColor: brand.colors.background,
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  }
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  const brand = getBrandConfig(tenant)
  const font = getTenantFont(tenant)

  /**
   * Per-tenant theme injection.
   *
   * `app/globals.css` ships the Kinetika defaults on `:root` as a safety
   * net. Re-declaring every semantic token on `<html>` here lets each
   * tenant flip the entire theme — palette AND typography — without a
   * rebuild and without an extra stylesheet round-trip.
   *
   * Because the inline style lives on the same `<html>` element that
   * Next streams first, the browser applies these values before
   * painting the first frame — no FOUC, no white flash, no incorrect
   * dark theme briefly visible on MB Casino.
   *
   * Every token the UI reads (header, footer, tiles, buttons, borders)
   * is listed here, so a new brand can go fully light / fully dark /
   * anywhere in between without touching a single component.
   */
  const themeStyle = {
    '--color-brand-primary': brand.colors.primary,
    '--color-brand-primary-contrast': brand.colors.primaryContrast,
    '--color-brand-background': brand.colors.background,
    '--color-brand-accent': brand.colors.accent,
    '--color-brand-foreground': brand.colors.foreground,
    '--color-brand-surface': brand.colors.surface,
    '--color-brand-surface-2': brand.colors.surface2,
    '--color-brand-border': brand.colors.border,
    '--color-brand-muted': brand.colors.muted,
    '--font-brand': brand.typography.fontFamily,
  } as React.CSSProperties

  /**
   * `font.variable` is the next/font-generated class that defines
   * `--font-<tenant>: "<actual family name>", <fallback>` on its
   * element. Applying it to `<html>` exposes that variable to the whole
   * tree, and our `--font-brand` above aliases the tenant variable into
   * the generic slot that `app/globals.css` consumes via `font-family:
   * var(--font-brand, ...)`.
   */
  return (
    <html
      lang={brand.locale}
      className={`${font.variable} h-full`}
      style={themeStyle}
    >
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader tenantId={tenant} />
        <main className="flex-1">{children}</main>
        <SiteFooter tenantId={tenant} />
      </body>
    </html>
  )
}
