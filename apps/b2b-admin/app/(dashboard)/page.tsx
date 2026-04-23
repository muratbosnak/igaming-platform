import { auth } from '@/auth'
import { DashboardPage } from './dashboard-page'

export default async function Page() {
  const session = await auth()
  return (
    <DashboardPage
      userEmail={session?.user?.email ?? ''}
      isSuperAdmin={session?.user?.isSuperAdmin ?? false}
    />
  )
}
