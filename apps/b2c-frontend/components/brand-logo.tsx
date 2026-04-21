import Image from 'next/image'
import { brand } from '@/lib/brand.config'

/**
 * Server-rendered brand wordmark. Uses the static colored logo asset served
 * from the brand's public/ folder. `unoptimized` keeps the same bytes served
 * by the CDN/edge and avoids Next's image optimizer pipeline for a small,
 * already-optimized transparent PNG.
 */
export function BrandLogo({ className }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  return (
    <a
      href="/"
      aria-label={`${brand.name} — home`}
      className={className}
    >
      <Image
        src={`${basePath}/brands/kinetika/images/brand/logo-colored.png`}
        alt={brand.name}
        width={200}
        height={40}
        priority
        unoptimized
        className="h-8 w-auto"
      />
    </a>
  )
}
