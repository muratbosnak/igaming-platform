import { requireOperatorAdmin } from '@/lib/authz'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const admin = await requireOperatorAdmin()

  return (
    <DashboardClient
      userEmail={admin.email}
      operatorName={admin.operatorName}
      operatorSlug={admin.operatorSlug}
      operatorLogoSrc={admin.operatorLogoSrc}
      role={admin.role}
    />
  )
}
