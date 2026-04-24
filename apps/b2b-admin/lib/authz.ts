import { auth } from '@/auth'
import { assertSuperAdminSession } from '@igaming/auth'
import type { AuthenticatedSuperAdmin } from '@igaming/auth'

export type { AuthenticatedSuperAdmin }

export async function requireSuperAdmin(): Promise<AuthenticatedSuperAdmin> {
  const session = await auth()
  return assertSuperAdminSession(session)
}
