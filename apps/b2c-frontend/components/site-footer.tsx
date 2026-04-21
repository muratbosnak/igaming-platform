import Image from 'next/image'
import { brand } from '@/lib/brand.config'

/**
 * MGA-compliant footer (RSC).
 *
 * Layout:
 *   - Mobile: vertical stack (`flex-col`)
 *   - Desktop (md+): horizontal columns (`md:grid md:grid-cols-4`)
 *
 * Includes placeholders for regulatory text, license badge slot, 18+ badge
 * and responsible-gambling links — all required for MGA jurisdictions.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  return (
    <footer className="mt-16 border-t border-brand-border bg-brand-surface/40">
      <div className="w-full px-4 py-10 md:px-8 md:py-12 lg:px-12">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-4 md:gap-8">
          <div className="flex flex-col gap-3">
            <Image
              src={`${basePath}/brands/kinetika/images/brand/logo-white.png`}
              alt={brand.name}
              width={200}
              height={40}
              unoptimized
              className="h-8 w-auto self-start"
            />
            <p className="text-sm leading-relaxed text-brand-muted">
              {brand.tagline}
            </p>
          </div>

          <FooterColumn
            title="Casino"
            links={[
              { label: 'Slots', href: '/casino/slots' },
              { label: 'Live Casino', href: '/live-casino' },
              { label: 'Megaways', href: '/casino/megaways' },
              { label: 'Promotions', href: '/promotions' },
            ]}
          />
          <FooterColumn
            title="Help"
            links={[
              { label: 'Support', href: '/support' },
              { label: 'Banking', href: '/banking' },
              { label: 'Terms', href: '/legal/terms' },
              { label: 'Privacy', href: '/legal/privacy' },
            ]}
          />
          <FooterColumn
            title="Responsible Gaming"
            links={[
              { label: 'Self-exclusion', href: '/responsible/self-exclusion' },
              { label: 'Deposit limits', href: '/responsible/limits' },
              { label: 'Reality check', href: '/responsible/reality-check' },
              { label: 'GamCare', href: 'https://www.gamcare.org.uk' },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-brand-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span
              aria-label="18 plus only"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-black/40 text-sm font-bold text-brand-foreground"
            >
              18+
            </span>
            <span className="inline-flex h-10 items-center justify-center rounded-md border border-brand-border px-3 text-xs font-medium uppercase tracking-wider text-brand-muted">
              {brand.jurisdiction}
            </span>
            <span className="inline-flex h-10 items-center justify-center rounded-md border border-brand-border px-3 text-xs font-medium uppercase tracking-wider text-brand-muted">
              GamCare
            </span>
          </div>

          <p className="text-xs leading-relaxed text-brand-muted md:max-w-xl md:text-right">
            Gambling can be addictive. Play responsibly. {brand.name} is operated
            under license from the {brand.jurisdiction}. Players must be 18 or
            older. © {year} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-foreground/90">
        {title}
      </h2>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-brand-muted transition-colors hover:text-brand-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
