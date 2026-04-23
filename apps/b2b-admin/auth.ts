import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@igaming/database'

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const emailRaw = credentials?.email
          const passwordRaw = credentials?.password
          if (typeof emailRaw !== 'string' || typeof passwordRaw !== 'string') {
            return null
          }

          const email = emailRaw.trim().toLowerCase()
          if (!email || !passwordRaw) {
            return null
          }

          const user = await prisma.backofficeUser.findUnique({
            where: { email },
          })

          if (!user?.isSuperAdmin) {
            return null
          }

          const valid = await compare(passwordRaw, user.passwordHash)
          if (!valid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            isSuperAdmin: user.isSuperAdmin,
          }
        } catch (err) {
          console.error('[auth] authorize error:', err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.isSuperAdmin = user.isSuperAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        if (typeof token.email === 'string') {
          session.user.email = token.email
        }
        session.user.isSuperAdmin = Boolean(token.isSuperAdmin)
      }
      return session
    },
  },
})
