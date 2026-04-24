import type {
  SuperAdminSessionLike,
  OperatorAdminSessionLike,
  AuthenticatedSuperAdmin,
  AuthenticatedOperatorAdmin,
} from './session-types'

export function assertSuperAdminSession(
  session: SuperAdminSessionLike,
): AuthenticatedSuperAdmin {
  const user = session?.user
  if (!user || !user.id || !user.email || !user.isSuperAdmin || !user.isActive) {
    throw new Error('Unauthorized')
  }

  return {
    id: user.id,
    email: user.email,
  }
}

/**
 * Asserts that the session represents an active, non-super-admin user whose
 * `operatorId` matches the operator resolved from the current request host.
 *
 * Throws `'Unauthorized'` when any check fails — callers do NOT need to
 * handle partial/invalid sessions.
 */
export function assertOperatorAdminSession(
  session: OperatorAdminSessionLike,
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
