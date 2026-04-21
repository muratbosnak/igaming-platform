import Image from 'next/image'
import { getBrandConfig } from '@/lib/brand.config'

interface BrandLogoProps {
  /** Tenant id from the dynamic `[tenant]` route segment. Drives both the
   *  brand name (alt text / aria-label) and the artwork path on disk. */
  tenantId: string
  className?: string
}

/**
 * Server-rendered brand wordmark.
 *
 * Asset paths are tenant-scoped (`/brands/<tenantId>/images/brand/...`) so
 * a single deployment can serve any number of operators by swapping a
 * single prop. `unoptimized` keeps the same bytes served by the CDN/edge
 * and avoids Next's image optimiser pipeline for a small, already-
 * optimised transparent PNG.
 */
export function BrandLogo({ tenantId, className }: BrandLogoProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const brand = getBrandConfig(tenantId)

  return (
    <a href="/" aria-label={`${brand.name} — home`} className={className}>
      <Image
        src={`${basePath}/brands/${tenantId}/images/brand/logo-colored.png`}
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
