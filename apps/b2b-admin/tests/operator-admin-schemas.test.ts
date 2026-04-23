import { describe, expect, it } from 'vitest'
import { BackofficeRole } from '@igaming/database'
import { parseCreateOperatorAdminInput, parseUpdateOperatorAdminInput } from '@/app/(dashboard)/operator-admins/schemas'

const operatorId = '11111111-1111-1111-1111-111111111111'

describe('operator admin mutation validation', () => {
  it('normalizes email and validates create payload', () => {
    const formData = new FormData()
    formData.set('email', '  ADMIN@Example.COM ')
    formData.set('password', 'StrongPassword123')
    formData.set('role', BackofficeRole.ADMIN)
    formData.append('operatorIds', operatorId)

    const parsed = parseCreateOperatorAdminInput(formData)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.email).toBe('admin@example.com')
    }
  })

  it('rejects create payload without operator assignment', () => {
    const formData = new FormData()
    formData.set('email', 'admin@example.com')
    formData.set('password', 'StrongPassword123')
    formData.set('role', BackofficeRole.ADMIN)

    const parsed = parseCreateOperatorAdminInput(formData)
    expect(parsed.success).toBe(false)
  })

  it('validates update payload with user id', () => {
    const formData = new FormData()
    formData.set('userId', '22222222-2222-2222-2222-222222222222')
    formData.set('email', 'updated@example.com')
    formData.set('role', BackofficeRole.MARKETING)
    formData.append('operatorIds', operatorId)

    const parsed = parseUpdateOperatorAdminInput(formData)
    expect(parsed.success).toBe(true)
  })
})
