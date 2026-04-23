import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      isSuperAdmin: boolean
      isActive: boolean
    }
  }

  interface User {
    isSuperAdmin: boolean
    isActive: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    isSuperAdmin?: boolean
    isActive?: boolean
  }
}
