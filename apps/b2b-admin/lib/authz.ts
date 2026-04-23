import { auth } from '@/auth'
import { assertSuperAdminSession } from './authz-assert'
import type { AuthenticatedSuperAdmin } from './authz-assert'

export type { AuthenticatedSuperAdmin } from './authz-assert'

export async function requireSuperAdmin(): Promise<AuthenticatedSuperAdmin> {
  const session = await auth()
  return assertSuperAdminSession(session)
}
