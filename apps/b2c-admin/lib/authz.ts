import { headers } from 'next/headers'
import { auth } from '@/auth'
import { getOperatorLogoSrc, getOperatorSlug, resolveOperatorFromHost } from './operator-host'
import { assertOperatorAdminSession } from './authz-assert'
import type { AuthenticatedOperatorAdmin } from './authz-assert'

export type { AuthenticatedOperatorAdmin } from './authz-assert'

/**
 * Single entry point for all server components and server actions that need
 * an authenticated operator admin session.
 *
 * Resolves the operator from the current request host, retrieves the session,
 * and asserts that the session's operatorId matches the resolved operator.
 *
 * Throws `'Unauthorized'` if any check fails — Next.js propagates this to
 * the nearest error boundary.
 */
export async function requireOperatorAdmin(): Promise<
  AuthenticatedOperatorAdmin & { operatorName: string; operatorSlug: string; operatorLogoSrc: string }
> {
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host')

  const operator = await resolveOperatorFromHost(host)
  if (!operator) {
    throw new Error('Unauthorized')
  }

  const session = await auth()
  const admin = assertOperatorAdminSession(session, operator.id)

  const operatorSlug = getOperatorSlug(operator.domain)
  const operatorLogoSrc = getOperatorLogoSrc(operator.domain)

  return { ...admin, operatorName: operator.name, operatorSlug, operatorLogoSrc }
}
