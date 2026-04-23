import 'server-only'
import { cache } from 'react'
import { prisma } from '@igaming/database'

export interface ResolvedOperator {
  id: string
  domain: string
  name: string
}

export function getOperatorSlug(domain: string): string {
  return domain.toLowerCase().split('.')[0]
}

export function getOperatorLogoSrc(domain: string): string {
  const slug = getOperatorSlug(domain)
  return `/brands/${slug}/images/brand/logo-white.png`
}

/**
 * Normalises a raw `Host` header into the domain segment we store in
 * `Operator.domain`.
 *
 * Transformation chain:
 *   admin.mbcasino.localhost:80  →  mbcasino.localhost  (full remaining)
 *                               OR  mbcasino             (first label)
 *
 * We try both candidates against the DB; the first match wins. This makes
 * the resolver tolerant of however the operator was seeded — whether the
 * DBA stored `mbcasino` or `mbcasino.localhost`.
 */
function domainCandidates(host: string | null | undefined): string[] {
  if (!host) return []

  // Lowercase + strip port
  const bare = host.toLowerCase().replace(/:\d+$/, '')

  // Strip the leading `admin.` prefix so we're left with the brand segment
  const withoutAdmin = bare.startsWith('admin.') ? bare.slice('admin.'.length) : bare

  // Candidates: full remaining hostname, then just the first label
  const firstLabel = withoutAdmin.split('.')[0]

  const candidates: string[] = [withoutAdmin]
  if (firstLabel && firstLabel !== withoutAdmin) {
    candidates.push(firstLabel)
  }

  return candidates
}

/**
 * Resolves the incoming `Host` header to an Operator row.
 *
 * Cached per request via `React.cache` — multiple callers in the same
 * render pass (proxy, page, server action) share the single DB round-trip.
 */
export const resolveOperatorFromHost = cache(
  async (host: string | null | undefined): Promise<ResolvedOperator | null> => {
    const candidates = domainCandidates(host)
    if (candidates.length === 0) return null

    const operator = await prisma.operator.findFirst({
      where: { domain: { in: candidates } },
      select: { id: true, domain: true, name: true },
    })

    return operator ?? null
  },
)
