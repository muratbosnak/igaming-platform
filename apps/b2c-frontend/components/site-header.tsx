import { getBrandConfig } from '@/lib/brand.config'
import { BrandLogo } from './brand-logo'
import { MobileNav } from './mobile-nav'

interface SiteHeaderProps {
  /** Tenant id from the dynamic `[tenant]` route segment. Forwarded to
   *  every brand-aware child so the entire header is decoupled from any
   *  hardcoded operator slug. */
  tenantId: string
}

/**
 * Sticky, server-rendered header.
 *
 * Mobile (< md):  Logo · "Deposit" · Hamburger
 * Desktop (md+):  Logo · Inline nav · Login + Register
 *
 * Conditional layouts are CSS-only (`hidden md:flex`) — never JS — so the
 * SSR payload is identical to client hydration regardless of viewport.
 */
export function SiteHeader({ tenantId }: SiteHeaderProps) {
  const brand = getBrandConfig(tenantId)

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-background/80 backdrop-blur supports-[backdrop-filter]:bg-brand-background/70">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 md:px-8 lg:px-12">
        <BrandLogo tenantId={tenantId} />

        <nav
          aria-label="Primary"
          className="hidden md:flex md:items-center md:gap-1"
        >
          {brand.primaryNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-brand-foreground transition-colors hover:bg-brand-surface-2 hover:text-brand-foreground"
              style={{
                fontWeight: brand.typography.navWeight,
                textTransform: brand.typography.navTransform,
                letterSpacing: brand.typography.navLetterSpacing,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-primary px-3.5 text-sm font-semibold text-brand-primary-contrast shadow-[0_8px_24px_-12px_var(--color-brand-primary)] transition-opacity hover:opacity-90 md:hidden"
          >
            Log In
          </a>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-brand-border px-4 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-surface-2"
            >
              Log in
            </a>
            <a
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-brand-primary-contrast hover:opacity-90"
            >
              Register
            </a>
          </div>

          <MobileNav
            tenantId={tenantId}
            items={brand.primaryNav}
            brandName={brand.name}
          />
        </div>
      </div>
    </header>
  )
}
