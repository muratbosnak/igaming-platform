import { prisma } from '@igaming/database'

/**
 * Super admins may access b2b-admin only when the account is active.
 */
export function canAccessB2BAdmin(
  user: { isSuperAdmin: boolean; isActive: boolean } | null,
): boolean {
  return Boolean(user && user.isSuperAdmin && user.isActive)
}

/**
 * Panel segregation check.
 *
 * Operator admins may access b2c-admin only when:
 * - the account is active
 * - the account is NOT a super admin (super admins belong in b2b-admin only)
 */
export function canAccessB2CAdmin(
  user: { isActive: boolean; isSuperAdmin: boolean } | null,
): boolean {
  return Boolean(user && user.isActive && !user.isSuperAdmin)
}

/**
 * Returns true when the user has an active membership for the given operator.
 * A deactivated membership (`isActive: false`) is treated as no access.
 */
export async function hasActiveMembership(
  userId: string,
  operatorId: string,
): Promise<boolean> {
  const membership = await prisma.userOperatorAccess.findUnique({
    where: { userId_operatorId: { userId, operatorId } },
    select: { isActive: true },
  })
  return membership?.isActive === true
}
