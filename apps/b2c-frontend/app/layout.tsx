import type { Metadata, Viewport } from 'next'
import { brand } from '@/lib/brand.config'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

/**
 * Root Metadata — localized + SEO-ready.
 *
 * - `title.template` means individual pages only need a short `title` and the
 *   brand suffix is appended automatically.
 * - `metadataBase` would normally come from env; hard-coded placeholder for
 *   preview builds.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://kinetika.example'),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: `${brand.name} Casino · Slots, Live Casino & Megaways. Licensed by ${brand.jurisdiction}. 18+ only. Play responsibly.`,
  applicationName: brand.name,
  keywords: ['online casino', 'slots', 'live casino', 'megaways', brand.name],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
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

export const viewport: Viewport = {
  themeColor: brand.colors.background,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={brand.locale} className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
