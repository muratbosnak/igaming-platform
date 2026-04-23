import { auth } from '@/auth'
import { NextResponse } from 'next/server'

/**
 * Normalise a raw `Host` / `X-Forwarded-Host` header to the same first-label
 * form we compare against `Operator.domain` in the JWT.
 *
 * Examples:
 *   admin.mbcasino.localhost:80  →  mbcasino
 *   admin.kinetika.localhost     →  kinetika
 *   mbcasino.localhost           →  mbcasino
 */
function normalizeDomainLabel(host: string | null | undefined): string | null {
  if (!host) return null
  const bare = host.toLowerCase().replace(/:\d+$/, '')
  const withoutAdmin = bare.startsWith('admin.') ? bare.slice('admin.'.length) : bare
  return withoutAdmin.split('.')[0] || null
}

/**
 * Derive the first-label from the stored `operatorDomain` value.
 *
 * The domain may be stored as "mbcasino" or "mbcasino.localhost" depending on
 * how the operator was seeded. We normalise to the first label in both cases.
 */
function normalizeDomainFromStored(operatorDomain: string | null | undefined): string | null {
  if (!operatorDomain) return null
  return operatorDomain.split('.')[0] || null
}

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = Boolean(req.auth?.user?.email)

  // Always let NextAuth's own routes through — they handle their own state
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // local-proxy.js forwards the real browser Host via X-Forwarded-Host
  const forwardedHost = req.headers.get('x-forwarded-host')
  const rawHost = forwardedHost || req.headers.get('host')
  const currentLabel = normalizeDomainLabel(rawHost)

  // ── Login page ────────────────────────────────────────────────────────────
  if (pathname === '/login') {
    if (isLoggedIn && req.auth?.user?.operatorDomain) {
      const sessionLabel = normalizeDomainFromStored(req.auth.user.operatorDomain)
      // Only redirect to dashboard when host matches session — otherwise fall
      // through to let the login page display a host-mismatch error.
      if (sessionLabel && currentLabel && sessionLabel === currentLabel) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }
    }
    return NextResponse.next()
  }

  // ── Unauthenticated → redirect to login ──────────────────────────────────
  if (!isLoggedIn) {
    const login = new URL('/login', req.nextUrl)
    login.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(login)
  }

  // ── Cross-operator session replay protection ──────────────────────────────
  // If the session was issued for operator A but the request arrives on
  // operator B's subdomain, we force-clear the cookie and redirect to /login.
  if (currentLabel && req.auth?.user?.operatorDomain) {
    const sessionLabel = normalizeDomainFromStored(req.auth.user.operatorDomain)

    if (sessionLabel !== currentLabel) {
      console.warn('[auth] session.host_mismatch', {
        userId: req.auth.user.id,
        sessionOperatorDomain: req.auth.user.operatorDomain,
        currentLabel,
      })

      const loginUrl = new URL('/login', req.nextUrl)
      loginUrl.searchParams.set('error', 'wrong_operator')

      const response = NextResponse.redirect(loginUrl)
      // Clear both the plain and the Secure-prefixed cookie variants
      response.cookies.delete('authjs.session-token')
      response.cookies.delete('__Secure-authjs.session-token')
      return response
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
