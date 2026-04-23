import type { DefaultSession } from 'next-auth'
import type { BackofficeRole } from '@igaming/database'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      operatorId: string
      operatorDomain: string
      role: BackofficeRole
      isActive: boolean
      isSuperAdmin: boolean
    }
  }

  interface User {
    operatorId: string
    operatorDomain: string
    role: BackofficeRole
    isActive: boolean
    isSuperAdmin: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    operatorId?: string
    operatorDomain?: string
    role?: BackofficeRole
    isActive?: boolean
    isSuperAdmin?: boolean
  }
}
