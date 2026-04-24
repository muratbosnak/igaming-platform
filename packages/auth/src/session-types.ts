import type { BackofficeRole } from '@igaming/database'

export type SuperAdminSessionLike = {
  expires?: string
  user?: {
    id?: string
    email?: string | null
    isSuperAdmin?: boolean
    isActive?: boolean
  } | null
} | null

export type OperatorAdminSessionLike = {
  expires?: string
  user?: {
    id?: string
    email?: string | null
    operatorId?: string
    operatorDomain?: string
    role?: BackofficeRole
    isActive?: boolean
    isSuperAdmin?: boolean
  } | null
} | null

export type AuthenticatedSuperAdmin = {
  id: string
  email: string
}

export type AuthenticatedOperatorAdmin = {
  id: string
  email: string
  operatorId: string
  operatorDomain: string
  role: BackofficeRole
}
