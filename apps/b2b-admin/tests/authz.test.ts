import { describe, expect, it } from 'vitest'
import { assertSuperAdminSession } from '@igaming/auth'

describe('requireSuperAdmin guard', () => {
  it('throws for missing session', () => {
    expect(() => assertSuperAdminSession(null)).toThrowError('Unauthorized')
  })

  it('throws for non-super-admin user', () => {
    expect(() =>
      assertSuperAdminSession({
        expires: '2999-01-01',
        user: {
          id: 'user-id',
          email: 'operator@example.com',
          isSuperAdmin: false,
          isActive: true,
        },
      }),
    ).toThrowError('Unauthorized')
  })

  it('returns actor details for active super admin', () => {
    expect(
      assertSuperAdminSession({
        expires: '2999-01-01',
        user: {
          id: 'super-id',
          email: 'super@example.com',
          isSuperAdmin: true,
          isActive: true,
        },
      }),
    ).toEqual({
      id: 'super-id',
      email: 'super@example.com',
    })
  })
})
