export function canAccessB2BAdmin(user: { isSuperAdmin: boolean; isActive: boolean } | null): boolean {
  return Boolean(user && user.isSuperAdmin && user.isActive)
}
