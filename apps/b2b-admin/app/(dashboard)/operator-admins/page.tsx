import { auth } from '@/auth'
import { getOperatorAdminDirectory } from './actions'
import { OperatorAdminsShell } from './operator-admins-shell'
import { OperatorAdminsClient } from './operator-admins-client'

type SearchParams = Promise<{
  email?: string
  operatorId?: string
  role?: string
  status?: string
}>

export default async function OperatorAdminsPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams
  const session = await auth()
  const userEmail = session?.user?.email ?? ''
  const isSuperAdmin = session?.user?.isSuperAdmin ?? false
  const directory = await getOperatorAdminDirectory(resolvedSearchParams)

  return (
    <OperatorAdminsShell userEmail={userEmail} isSuperAdmin={isSuperAdmin}>
      <OperatorAdminsClient
        admins={directory.admins}
        operators={directory.operators}
        filters={directory.filters}
      />
    </OperatorAdminsShell>
  )
}
