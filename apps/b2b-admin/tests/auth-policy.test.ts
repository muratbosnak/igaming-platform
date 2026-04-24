import { describe, expect, it } from 'vitest'
import { canAccessB2BAdmin } from '@igaming/auth'

describe('b2b admin login policy', () => {
  it('allows active super admins', () => {
    expect(
      canAccessB2BAdmin({
        isSuperAdmin: true,
        isActive: true,
      }),
    ).toBe(true)
  })

  it('rejects inactive super admins', () => {
    expect(
      canAccessB2BAdmin({
        isSuperAdmin: true,
        isActive: false,
      }),
    ).toBe(false)
  })

  it('rejects active operator admins', () => {
    expect(
      canAccessB2BAdmin({
        isSuperAdmin: false,
        isActive: true,
      }),
    ).toBe(false)
  })
})
