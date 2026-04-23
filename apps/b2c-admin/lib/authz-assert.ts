import type { BackofficeRole } from '@igaming/database'

export type SessionLike = {
  expires?: string
  user?: {
    id?: string
    email?: string | null
    operatorId?: string
    operatorDomain?: string
    role?: BackofficeRole
    isActive?: boolean
    isSuperAdmin?: boolean
  } | null
} | null

export type AuthenticatedOperatorAdmin = {
  id: string
  email: string
  operatorId: string
  operatorDomain: string
  role: BackofficeRole
}

/**
 * Asserts that the session represents an active, non-super-admin user whose
 * `operatorId` matches the operator resolved from the current request host.
 *
 * Throws `'Unauthorized'` when any check fails — callers do NOT need to
 * handle partial/invalid sessions.
 */
export function assertOperatorAdminSession(
  session: SessionLike,
  hostOperatorId: string,
): AuthenticatedOperatorAdmin {
  const user = session?.user

  if (
    !user ||
    !user.id ||
    !user.email ||
    !user.operatorId ||
    !user.operatorDomain ||
    !user.role ||
    !user.isActive ||
    user.isSuperAdmin
  ) {
    throw new Error('Unauthorized')
  }

  if (user.operatorId !== hostOperatorId) {
    throw new Error('Unauthorized')
  }

  return {
    id: user.id,
    email: user.email,
    operatorId: user.operatorId,
    operatorDomain: user.operatorDomain,
    role: user.role,
  }
}
