'use server'

import { revalidatePath } from 'next/cache'
import { hash } from 'bcryptjs'
import { prisma } from '@igaming/database'
import { requireSuperAdmin } from '@/lib/authz'
import {
  listFiltersSchema,
  parseCreateOperatorAdminInput,
  parseUpdateOperatorAdminInput,
  toggleStatusSchema,
} from './schemas'

export type ActionResult = { ok: true; message: string } | { ok: false; message: string }

export async function getOperatorAdminDirectory(rawFilters: {
  email?: string
  operatorId?: string
  role?: string
  status?: string
}) {
  await requireSuperAdmin()

  const filters = listFiltersSchema.parse({
    email: rawFilters.email,
    operatorId: rawFilters.operatorId,
    role: rawFilters.role || undefined,
    status: rawFilters.status ?? 'all',
  })

  const operators = await prisma.operator.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  const admins = await prisma.backofficeUser.findMany({
    where: {
      isSuperAdmin: false,
      ...(filters.status === 'active' ? { isActive: true } : {}),
      ...(filters.status === 'passive' ? { isActive: false } : {}),
      ...(filters.email
        ? { email: { contains: filters.email, mode: 'insensitive' } }
        : {}),
      operatorAccess: {
        some: {
          ...(filters.operatorId ? { operatorId: filters.operatorId } : {}),
          ...(filters.role ? { role: filters.role } : {}),
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      createdBy: { select: { email: true } },
      updatedBy: { select: { email: true } },
      operatorAccess: {
        where: {
          ...(filters.operatorId ? { operatorId: filters.operatorId } : {}),
          ...(filters.role ? { role: filters.role } : {}),
        },
        select: {
          operatorId: true,
          role: true,
          isActive: true,
          operator: { select: { name: true } },
        },
        orderBy: { operator: { name: 'asc' } },
      },
    },
  })

  return { admins, operators, filters }
}

export async function createOperatorAdminAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const actor = await requireSuperAdmin()
    const parsed = parseCreateOperatorAdminInput(formData)

    if (!parsed.success) {
      return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid input.' }
    }

    const passwordHash = await hash(parsed.data.password, 12)

    await prisma.$transaction(async (tx) => {
      const user = await tx.backofficeUser.create({
        data: {
          email: parsed.data.email,
          passwordHash,
          isSuperAdmin: false,
          isActive: true,
          createdById: actor.id,
        },
        select: { id: true },
      })

      await tx.userOperatorAccess.createMany({
        data: parsed.data.operatorIds.map((operatorId) => ({
          userId: user.id,
          operatorId,
          role: parsed.data.role,
          isActive: true,
        })),
      })
    })

    console.info('[operator-admins] created', { email: parsed.data.email, actorId: actor.id })
    revalidatePath('/operator-admins')
    return { ok: true, message: `Admin ${parsed.data.email} created successfully.` }
  } catch (err) {
    console.error('[operator-admins] create error', err)
    if (err instanceof Error && err.message === 'Unauthorized') throw err
    return { ok: false, message: 'Failed to create admin. Please try again.' }
  }
}

export async function updateOperatorAdminAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const actor = await requireSuperAdmin()
    const parsed = parseUpdateOperatorAdminInput(formData)

    if (!parsed.success) {
      return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid input.' }
    }

    const passwordHash = parsed.data.newPassword
      ? await hash(parsed.data.newPassword, 12)
      : undefined

    await prisma.$transaction(async (tx) => {
      const updateResult = await tx.backofficeUser.updateMany({
        where: { id: parsed.data.userId, isSuperAdmin: false },
        data: {
          email: parsed.data.email,
          updatedById: actor.id,
          ...(passwordHash ? { passwordHash } : {}),
        },
      })
      if (updateResult.count !== 1) {
        throw new Error('ADMIN_NOT_FOUND')
      }

      await tx.userOperatorAccess.deleteMany({ where: { userId: parsed.data.userId } })
      await tx.userOperatorAccess.createMany({
        data: parsed.data.operatorIds.map((operatorId) => ({
          userId: parsed.data.userId,
          operatorId,
          role: parsed.data.role,
          isActive: true,
        })),
      })
    })

    console.info('[operator-admins] updated', { userId: parsed.data.userId, actorId: actor.id })
    revalidatePath('/operator-admins')
    return { ok: true, message: 'Admin updated successfully.' }
  } catch (err) {
    console.error('[operator-admins] update error', err)
    if (err instanceof Error && err.message === 'Unauthorized') throw err
    if (err instanceof Error && err.message === 'ADMIN_NOT_FOUND') {
      return { ok: false, message: 'Admin not found.' }
    }
    return { ok: false, message: 'Failed to update admin. Please try again.' }
  }
}

export async function toggleOperatorAdminStatusAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const actor = await requireSuperAdmin()

    const parsed = toggleStatusSchema.safeParse({
      userId: String(formData.get('userId') ?? ''),
      isActive: String(formData.get('isActive') ?? 'false') === 'true',
    })

    if (!parsed.success) {
      return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid input.' }
    }

    await prisma.$transaction(async (tx) => {
      const updateResult = await tx.backofficeUser.updateMany({
        where: { id: parsed.data.userId, isSuperAdmin: false },
        data: {
          isActive: parsed.data.isActive,
          updatedById: actor.id,
          deactivatedAt: parsed.data.isActive ? null : new Date(),
          deactivatedById: parsed.data.isActive ? null : actor.id,
        },
      })
      if (updateResult.count !== 1) {
        throw new Error('ADMIN_NOT_FOUND')
      }

      await tx.userOperatorAccess.updateMany({
        where: { userId: parsed.data.userId },
        data: { isActive: parsed.data.isActive },
      })
    })

    console.info('[operator-admins] status_changed', {
      userId: parsed.data.userId,
      isActive: parsed.data.isActive,
      actorId: actor.id,
    })

    revalidatePath('/operator-admins')
    return {
      ok: true,
      message: parsed.data.isActive ? 'Admin activated.' : 'Admin deactivated.',
    }
  } catch (err) {
    console.error('[operator-admins] toggle error', err)
    if (err instanceof Error && err.message === 'Unauthorized') throw err
    if (err instanceof Error && err.message === 'ADMIN_NOT_FOUND') {
      return { ok: false, message: 'Admin not found.' }
    }
    return { ok: false, message: 'Failed to update status. Please try again.' }
  }
}
