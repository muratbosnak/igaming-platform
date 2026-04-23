'use client'

import { SidebarNav, TopHeader } from '@igaming/ui'
import { logoutAction } from '@/app/actions'
import { getB2BAdminNavSections } from '../navigation'

type Props = {
  userEmail: string
  isSuperAdmin: boolean
  children: React.ReactNode
}

export function OperatorAdminsShell({ userEmail, isSuperAdmin, children }: Props) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-zinc-950 text-zinc-50 lg:flex-row">
      <SidebarNav
        brand={{ name: 'B2B Admin', abbr: 'B2B' }}
        sections={getB2BAdminNavSections('operator-admins')}
        colorScheme="emerald"
        user={{
          name: userEmail,
          role: isSuperAdmin ? 'Super Admin' : 'Admin',
          initial: (userEmail[0] ?? 'A').toUpperCase(),
        }}
        onLogout={logoutAction}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader
          title="Operator Admins"
          subtitle="Manage operator panel access and lifecycle"
          colorScheme="emerald"
        />
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
