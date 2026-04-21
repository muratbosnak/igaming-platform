/**
 * Multi-tenant brand registry.
 *
 * Single source of truth that maps an incoming request `Host` header to the
 * internal `tenantId` used everywhere downstream (route segment, asset path,
 * brand config lookup, analytics).
 *
 * In production this table is replaced by a fetch against the operator
 * directory (likely `RSC fetch` with `cache: 'force-cache'` + tag-based
 * revalidation when a brand goes live or is sunset). The shape stays
 * intentionally narrow so the proxy stays cheap on the hot path.
 *
 * Why hostname-keyed (not header / cookie / subpath):
 *   - Subdomain → tenant is a hard isolation boundary the browser already
 *     enforces (cookies, storage, CSP). It also keeps SEO and licensing
 *     audits unambiguous: one canonical origin per operator.
 *   - The `Host` header is set by the user-agent before the request reaches
 *     us, so the rewrite happens with zero round-trips.
 */

export interface TenantConfig {
  /** Internal identifier — drives the dynamic `/[tenant]/...` route segment
   *  and the on-disk asset folder under `public/brands/<tenantId>/`. */
  tenantId: string
}

/**
 * Hostname → TenantConfig.
 *
 * Keys MUST match the `Host` header verbatim (lower-cased) including the
 * port for non-standard ports. We register every dev/preview port we
 * actually run the app on (3000 spec'd in the brief, 3002 from
 * `package.json#scripts.dev`, and the bare hostname for proxied setups).
 *
 * To onboard a new brand: add an entry here and seed
 * `public/brands/<tenantId>/` with the brand's artwork. No other code
 * change is required for the route + asset pipeline to light up.
 */
const HOSTNAME_REGISTRY: Record<string, TenantConfig> = {
  'kinetika.localhost:3000': { tenantId: 'kinetika' },
  'kinetika.localhost:3002': { tenantId: 'kinetika' },
  'kinetika.localhost': { tenantId: 'kinetika' },

  'mbcasino.localhost:3000': { tenantId: 'mbcasino' },
  'mbcasino.localhost:3002': { tenantId: 'mbcasino' },
  'mbcasino.localhost': { tenantId: 'mbcasino' },
}

/** Tenant served when the `Host` header matches no registered hostname.
 *  Keeps `localhost:3000` (and ad-hoc preview hosts) usable in dev so
 *  contributors aren't forced to edit /etc/hosts before the first run. */
const DEFAULT_TENANT_ID = 'kinetika'

/**
 * Resolve a `tenantId` from the request `Host` header.
 *
 * Returns `null` only when the lookup fails AND the caller has explicitly
 * opted out of the dev fallback by passing `{ allowFallback: false }`.
 * The proxy uses the fallback path so an unknown subdomain renders a
 * recognisable brand instead of a blank 404 in dev.
 */
export function resolveTenantId(
  host: string | null | undefined,
  options: { allowFallback?: boolean } = {},
): string | null {
  const { allowFallback = true } = options

  if (host) {
    const match = HOSTNAME_REGISTRY[host.toLowerCase()]
    if (match) return match.tenantId
  }

  return allowFallback ? DEFAULT_TENANT_ID : null
}

/** Used by `generateStaticParams` and tests so we never have to enumerate
 *  the registry by hand at the call-site. */
export function getRegisteredTenantIds(): string[] {
  const set = new Set<string>()
  for (const cfg of Object.values(HOSTNAME_REGISTRY)) set.add(cfg.tenantId)
  return Array.from(set)
}
