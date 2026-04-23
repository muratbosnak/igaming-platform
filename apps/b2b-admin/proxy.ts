import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((req) => {
  const isLoggedIn = Boolean(req.auth?.user?.email)
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (pathname === '/login') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    const login = new URL('/login', req.nextUrl)
    login.searchParams.set('callbackUrl', `${pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(login)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
