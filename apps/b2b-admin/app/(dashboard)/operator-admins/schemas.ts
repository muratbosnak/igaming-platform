import { BackofficeRole } from '@igaming/database'
import { z } from 'zod'

export const listFiltersSchema = z.object({
  email: z.string().trim().optional().default(''),
  operatorId: z.string().trim().optional().default(''),
  role: z.nativeEnum(BackofficeRole).optional(),
  status: z.enum(['all', 'active', 'passive']).default('all'),
})

const createOperatorAdminSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(12, 'Password must be at least 12 characters.'),
  role: z.nativeEnum(BackofficeRole),
  operatorIds: z.array(z.string().uuid()).min(1, 'Select at least one operator.'),
})

const updateOperatorAdminSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email('Enter a valid email address.'),
  role: z.nativeEnum(BackofficeRole),
  operatorIds: z.array(z.string().uuid()).min(1, 'Select at least one operator.'),
  newPassword: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 12, {
      message: 'New password must be at least 12 characters.',
    }),
})

export const toggleStatusSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean(),
})

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function parseOperatorIds(formData: FormData): string[] {
  return formData
    .getAll('operatorIds')
    .filter((value): value is string => typeof value === 'string')
}

export function parseCreateOperatorAdminInput(formData: FormData) {
  return createOperatorAdminSchema.safeParse({
    email: normalizeEmail(String(formData.get('email') ?? '')),
    password: String(formData.get('password') ?? ''),
    role: formData.get('role'),
    operatorIds: parseOperatorIds(formData),
  })
}

export function parseUpdateOperatorAdminInput(formData: FormData) {
  const rawNewPassword = String(formData.get('newPassword') ?? '').trim()
  return updateOperatorAdminSchema.safeParse({
    userId: String(formData.get('userId') ?? ''),
    email: normalizeEmail(String(formData.get('email') ?? '')),
    role: formData.get('role'),
    operatorIds: parseOperatorIds(formData),
    newPassword: rawNewPassword || undefined,
  })
}
