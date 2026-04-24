import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@igaming/database'
import { normalizeEmail } from '@igaming/utils'
import { canAccessB2CAdmin, hasActiveMembership } from '@igaming/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        // Hidden field injected server-side from the Host header so the
        // client cannot forge which operator they're logging into.
        operatorDomain: { label: 'Operator Domain', type: 'text' },
      },
      authorize: async (credentials) => {
        // TODO: Add rate limiting here (per IP + per email) before going
        // to production. See Phase 2 notes.
        try {
          const emailRaw = credentials?.email
          const passwordRaw = credentials?.password
          const operatorDomain = credentials?.operatorDomain

          if (
            typeof emailRaw !== 'string' ||
            typeof passwordRaw !== 'string' ||
            typeof operatorDomain !== 'string' ||
            !operatorDomain
          ) {
            console.warn('[auth] login.denied', { reason: 'operator_unresolved' })
            return null
          }

          const email = normalizeEmail(emailRaw)
          if (!email || !passwordRaw) {
            return null
          }

          // Re-resolve operator from the submitted domain — never trust the
          // client value blindly; we verify it exists in our DB.
          const operator = await prisma.operator.findFirst({
            where: { domain: operatorDomain },
            select: { id: true, domain: true, name: true },
          })

          if (!operator) {
            console.warn('[auth] login.denied', { email, reason: 'operator_unresolved' })
            return null
          }

          const user = await prisma.backofficeUser.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              passwordHash: true,
              isActive: true,
              isSuperAdmin: true,
            },
          })

          if (!user) {
            // Deliberate: don't distinguish "user not found" from "bad password"
            console.warn('[auth] login.denied', { email, operatorId: operator.id, reason: 'bad_password' })
            return null
          }

          if (!canAccessB2CAdmin(user)) {
            const reason = user.isSuperAdmin ? 'super_admin_blocked' : 'inactive'
            console.warn('[auth] login.denied', { email, operatorId: operator.id, reason })
            return null
          }

          const membershipOk = await hasActiveMembership(user.id, operator.id)
          if (!membershipOk) {
            console.warn('[auth] login.denied', {
              email,
              operatorId: operator.id,
              reason: 'no_membership',
            })
            return null
          }

          const validPassword = await compare(passwordRaw, user.passwordHash)
          if (!validPassword) {
            console.warn('[auth] login.denied', { email, operatorId: operator.id, reason: 'bad_password' })
            return null
          }

          // Retrieve the role from the membership row
          const membership = await prisma.userOperatorAccess.findUnique({
            where: { userId_operatorId: { userId: user.id, operatorId: operator.id } },
            select: { role: true },
          })

          console.info('[auth] login.success', { userId: user.id, operatorId: operator.id })

          return {
            id: user.id,
            email: user.email,
            operatorId: operator.id,
            // Store the domain so the middleware can compare it against the
            // Host header without a DB round-trip (JWT is edge-safe).
            operatorDomain: operator.domain,
            role: membership!.role,
            isActive: user.isActive,
            isSuperAdmin: false,
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
        token.operatorId = user.operatorId
        token.operatorDomain = user.operatorDomain
        token.role = user.role
        token.isActive = user.isActive
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
        session.user.operatorId = token.operatorId as string
        session.user.operatorDomain = token.operatorDomain as string
        session.user.role = token.role as import('@igaming/database').BackofficeRole
        session.user.isActive = Boolean(token.isActive)
        session.user.isSuperAdmin = Boolean(token.isSuperAdmin)
      }
      return session
    },
  },
})
