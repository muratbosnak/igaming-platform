import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveTenantId } from '@/lib/registry'

/**
 * Multi-tenant request rewriter.
 *
 * Flow:
 *   1.  Read the `Host` header from the incoming request.
 *   2.  Look up the `tenantId` in `lib/registry.ts`.
 *   3.  Transparently `rewrite()` the URL from `/...` to `/<tenantId>/...`
 *       so the App Router resolves the dynamic `[tenant]` segment without
 *       the user ever seeing the tenant id in their address bar.
 *
 * Idempotent: if the path is already prefixed (e.g. an internal `_next`
 * round-trip after the first rewrite) we no-op so we don't double-prefix.
 *
 * Naming note: Next 16 also accepts the new `proxy.ts` convention for the
 * same hook, but the `middleware.ts` filename remains supported as the
 * deprecated alias and is what we use here.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  const tenantId = resolveTenantId(host)

  if (!tenantId) {
    return new NextResponse('Tenant not found', { status: 404 })
  }

  const url = request.nextUrl.clone()
  const prefix = `/${tenantId}`

  if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) {
    return NextResponse.next()
  }

  url.pathname = `${prefix}${url.pathname === '/' ? '' : url.pathname}`
  return NextResponse.rewrite(url)
}

/**
 * Matcher excludes everything that must NOT be tenant-rewritten:
 *   - `_next/...`         — RSC payloads, static chunks, image optimiser
 *   - `api/...`           — backend route handlers (own auth boundary)
 *   - any path with `.`   — static assets in `public/` (favicons, brand
 *                           images, robots.txt, sitemap.xml, etc.).
 *                           This is the standard negative-lookahead trick
 *                           recommended in the Next.js docs to keep file
 *                           requests on the filesystem fast-path.
 *
 * Without these exclusions every `<Image>` request would be rewritten to
 * `/<tenant>/brands/<tenant>/images/...` which doesn't exist on disk and
 * would 404 the entire asset pipeline.
 */
export const config = {
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
}
