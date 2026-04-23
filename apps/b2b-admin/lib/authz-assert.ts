export type SessionLike = {
  expires?: string
  user?: {
    id?: string
    email?: string | null
    isSuperAdmin?: boolean
    isActive?: boolean
  } | null
} | null

export type AuthenticatedSuperAdmin = {
  id: string
  email: string
}

export function assertSuperAdminSession(session: SessionLike): AuthenticatedSuperAdmin {
  const user = session?.user
  if (!user || !user.id || !user.email || !user.isSuperAdmin || !user.isActive) {
    throw new Error('Unauthorized')
  }

  return {
    id: user.id,
    email: user.email,
  }
}
