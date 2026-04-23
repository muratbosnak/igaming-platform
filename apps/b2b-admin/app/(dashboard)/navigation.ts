import {
  Activity,
  AlertCircle,
  Gauge,
  Layers,
  LayoutDashboard,
  Network,
  Rocket,
  Scale,
  Shield,
  Share2,
  Users,
  Wallet,
} from 'lucide-react'
import type { NavSection } from '@igaming/ui'

export type B2BAdminNavKey = 'network-overview' | 'operator-admins'

export function getB2BAdminNavSections(activeKey: B2BAdminNavKey): NavSection[] {
  return [
    {
      label: 'OPERATIONS',
      items: [
        {
          label: 'Network Overview',
          icon: LayoutDashboard,
          href: '/',
          active: activeKey === 'network-overview',
        },
        { label: 'Operator Admins', icon: Users, href: '/operator-admins', active: activeKey === 'operator-admins' },
        { label: 'Live API Monitor', icon: Activity },
        { label: 'Tenant Management', icon: Users },
      ],
    },
    {
      label: 'FINANCIALS',
      items: [
        { label: 'Network Settlements', icon: Wallet },
        { label: 'Rev-Share Engine', icon: Share2 },
        { label: 'Tax & Compliance', icon: Scale },
      ],
    },
    {
      label: 'RISK & INFRA',
      items: [
        { label: 'Global Risk Engine', icon: Shield, badge: '2', badgeVariant: 'alert' },
        { label: 'Incident Management', icon: AlertCircle },
        { label: 'Rate Limits', icon: Gauge },
      ],
    },
    {
      label: 'PLATFORM',
      items: [
        { label: 'Deployment Manager', icon: Rocket },
        { label: 'White-Label Config', icon: Layers },
        { label: 'API Gateway', icon: Network },
      ],
    },
  ]
}
