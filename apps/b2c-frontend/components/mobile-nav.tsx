'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@igaming/ui'
import type { BrandNavItem } from '@/lib/brand.config'
import { BrandLogo } from './brand-logo'

interface MobileNavProps {
  /** Tenant id from the dynamic `[tenant]` route segment. Forwarded to
   *  `BrandLogo` inside the drawer so the wordmark resolves to the
   *  correct artwork on disk regardless of which operator we serve. */
  tenantId: string
  items: BrandNavItem[]
  brandName: string
}

/**
 * Lowest-leaf client component: hamburger + slide-in drawer.
 *
 * - Visibility is controlled purely by CSS (`md:hidden`) — never by JS device
 *   detection — so SSR markup matches client hydration (zero hydration risk).
 * - Locks body scroll while open and restores focus to the trigger on close.
 */
export function MobileNav({ tenantId, items, brandName }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      triggerRef.current?.focus()
    }
  }, [open])

  const drawer = (
    <>
      <div
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${brandName} navigation`}
        className={cn(
          'fixed inset-y-0 right-0 z-[100] flex h-full w-[82%] max-w-sm flex-col',
          'border-l border-brand-border bg-brand-surface shadow-2xl',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-brand-border px-4">
          <BrandLogo tenantId={tenantId} />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-brand-foreground hover:bg-white/5"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center rounded-lg px-3 text-base font-medium text-brand-foreground hover:bg-white/5"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid grid-cols-2 gap-2 border-t border-brand-border p-4">
          <a
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-brand-border bg-transparent px-4 text-sm font-semibold text-brand-foreground hover:bg-white/5"
          >
            Log in
          </a>
          <a
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-brand-primary-contrast hover:opacity-90"
          >
            Register
          </a>
        </div>
      </aside>
    </>
  )

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-brand-foreground hover:bg-white/5 active:bg-white/10"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
      </button>

      {mounted ? createPortal(drawer, document.body) : null}
    </div>
  )
}
