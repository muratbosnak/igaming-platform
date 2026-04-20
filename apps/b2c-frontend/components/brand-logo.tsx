import { brand } from '@/lib/brand.config'

/**
 * Server-rendered SVG wordmark. Intentionally inline (no network cost, no CLS,
 * no `use client`) and themed via `currentColor` + brand tokens.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <a
      href="/"
      aria-label={`${brand.name} — home`}
      className={className}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_0_24px_-6px_var(--color-brand-primary)]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 text-brand-primary-contrast"
            aria-hidden
          >
            <path
              d="M5 4v16l6-8-6-8Zm7 0 7 8-7 8V4Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="text-lg font-semibold tracking-tight text-brand-foreground">
          {brand.name}
        </span>
      </span>
    </a>
  )
}
