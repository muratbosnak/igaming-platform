'use client'

import {
  LayoutDashboard,
  Activity,
  Users,
  Wallet,
  Share2,
  Scale,
  Shield,
  AlertCircle,
  Gauge,
  Rocket,
  Layers,
  Network,
} from 'lucide-react'
import {
  SidebarNav,
  TopHeader,
  KPICards,
  ChartRow,
  LiveFeed,
  DashboardTable,
} from '@igaming/ui'
import type {
  NavSection,
  KPIData,
  FeedEvent,
  TableColumn,
  AreaChartConfig,
  PieChartConfig,
} from '@igaming/ui'

// ─── Navigation ───────────────────────────────────────────────────────────────

const navSections: NavSection[] = [
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Network Overview', icon: LayoutDashboard, active: true },
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

// ─── KPIs ─────────────────────────────────────────────────────────────────────

const kpis: KPIData[] = [
  {
    title: 'Total Network GGR',
    value: '€1,248,400',
    delta: '+6.2%',
    positive: true,
    sub: 'vs. yesterday €1,175,100',
    sparkUp: true,
  },
  {
    title: 'Active Tenants',
    value: '14',
    delta: 'Stable',
    positive: null,
    sub: '2 staging · 1 suspended',
    sparkUp: null,
  },
  {
    title: 'Avg API Latency',
    value: '42ms',
    delta: '-3ms',
    positive: true,
    sub: 'P99: 118ms · SLA: 200ms',
    sparkUp: true,
  },
  {
    title: 'Total Rev-Share Due',
    value: '€184,200',
    delta: '+9.8%',
    positive: true,
    sub: 'Settlement: 30 Apr 2026',
    sparkUp: true,
  },
]

// ─── Charts ───────────────────────────────────────────────────────────────────

const areaChartConfig: AreaChartConfig = {
  title: '7-Day Network Volume by Operator',
  xKey: 'day',
  data: [
    { day: 'Mon', Alpha: 180000, Beta: 140000, Gamma: 95000 },
    { day: 'Tue', Alpha: 195000, Beta: 155000, Gamma: 102000 },
    { day: 'Wed', Alpha: 170000, Beta: 130000, Gamma: 88000 },
    { day: 'Thu', Alpha: 210000, Beta: 165000, Gamma: 115000 },
    { day: 'Fri', Alpha: 200000, Beta: 158000, Gamma: 110000 },
    { day: 'Sat', Alpha: 230000, Beta: 175000, Gamma: 125000 },
    { day: 'Sun', Alpha: 225000, Beta: 170000, Gamma: 120000 },
  ],
  series: [
    { key: 'Alpha', color: '#10b981', gradientId: 'gradAlpha', gradientColor: '#10b981' },
    { key: 'Beta', color: '#6ee7b7', gradientId: 'gradBeta', gradientColor: '#6ee7b7' },
    { key: 'Gamma', color: '#a7f3d0', gradientId: 'gradGamma', gradientColor: '#a7f3d0' },
  ],
}

const pieChartConfig: PieChartConfig = {
  title: 'GGR Contribution by Operator',
  data: [
    { name: 'Brand Alpha', value: 38 },
    { name: 'Brand Beta', value: 31 },
    { name: 'Brand Gamma', value: 21 },
    { name: 'Brand Delta', value: 10 },
  ],
  colors: ['#10b981', '#6ee7b7', '#a7f3d0', '#d1fae5'],
}

// ─── Tenant Status Table ──────────────────────────────────────────────────────

type Tenant = {
  name: string
  status: string
  dailyGgr: string
  margin: string
  uptime: string
  action: string
}

const tenants: Tenant[] = [
  { name: 'Brand Alpha', status: 'Active', dailyGgr: '€225,000', margin: '16.2%', uptime: '99.98%', action: 'View' },
  { name: 'Brand Beta', status: 'Warning', dailyGgr: '€170,000', margin: '14.8%', uptime: '98.70%', action: 'Review' },
  { name: 'Brand Gamma', status: 'Active', dailyGgr: '€120,000', margin: '12.1%', uptime: '99.92%', action: 'View' },
  { name: 'Brand Delta', status: 'Suspended', dailyGgr: '€0', margin: '—', uptime: '—', action: 'Restore' },
  { name: 'Tenant Echo', status: 'Active', dailyGgr: '€95,000', margin: '15.5%', uptime: '99.89%', action: 'View' },
]

const tenantColumns: TableColumn[] = [
  { key: 'name', label: 'Tenant' },
  {
    key: 'status',
    label: 'Status',
    render: (value) => {
      const v = value as string
      const cls =
        v === 'Active'
          ? 'border-emerald-800 text-emerald-400 bg-emerald-950'
          : v === 'Warning'
            ? 'border-amber-800 text-amber-400 bg-amber-950'
            : 'border-zinc-700 text-zinc-500 bg-zinc-800'
      return (
        <span className={`text-[10px] font-medium border rounded px-1.5 py-0 ${cls}`}>
          {v}
        </span>
      )
    },
  },
  { key: 'dailyGgr', label: 'Daily GGR', align: 'right' },
  { key: 'margin', label: 'Margin', align: 'right' },
  { key: 'uptime', label: 'Uptime', align: 'right' },
  {
    key: 'action',
    label: 'Action',
    align: 'right',
    render: (value) => {
      const v = value as string
      const cls =
        v === 'Restore'
          ? 'border-amber-800 text-amber-400 hover:bg-amber-950'
          : v === 'Review'
            ? 'border-amber-800 text-amber-400 hover:bg-amber-950'
            : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'
      return (
        <button
          className={`h-6 text-[10px] px-2 border rounded font-medium transition-colors ${cls}`}
        >
          {v}
        </button>
      )
    },
  },
]

// ─── Infrastructure Alerts Table ──────────────────────────────────────────────

type InfraAlert = {
  service: string
  severity: string
  message: string
  time: string
}

const infraAlerts: InfraAlert[] = [
  { service: 'Payments API', severity: 'High', message: 'Rate limit at 92% — Brand Beta', time: '10:44' },
  { service: 'Game CDN', severity: 'Medium', message: 'Latency spike: Evolution +120ms', time: '10:38' },
  { service: 'Risk Engine', severity: 'Low', message: 'Watchlist rule #44 triggered', time: '10:31' },
  { service: 'Auth Service', severity: 'Info', message: 'Token refresh: 1,432 sessions', time: '10:22' },
  { service: 'DB Replica', severity: 'High', message: 'Replication lag 8.2s EU-WEST-1', time: '10:15' },
]

const alertColumns: TableColumn[] = [
  { key: 'service', label: 'Service' },
  {
    key: 'severity',
    label: 'Severity',
    render: (value) => {
      const v = value as string
      const cls =
        v === 'High'
          ? 'border-red-800 text-red-400 bg-red-950'
          : v === 'Medium'
            ? 'border-amber-800 text-amber-400 bg-amber-950'
            : v === 'Low'
              ? 'border-sky-800 text-sky-400 bg-sky-950'
              : 'border-zinc-700 text-zinc-500 bg-zinc-800'
      return (
        <span className={`text-[10px] font-medium border rounded px-1.5 py-0 ${cls}`}>
          {v}
        </span>
      )
    },
  },
  { key: 'message', label: 'Message' },
  { key: 'time', label: 'Time', align: 'right' },
]

// ─── Live Feed ────────────────────────────────────────────────────────────────

const feedEvents: FeedEvent[] = [
  { time: '10:45', text: 'Deployment: Brand Alpha v2.4.1 → Production', type: 'deploy' },
  { time: '10:43', text: 'Rate limit warning: Brand Beta API (92%)', type: 'alert' },
  { time: '10:40', text: 'Global Jackpot seeded: €250,000 pool activated', type: 'system' },
  { time: '10:38', text: 'Latency alert: Evolution CDN EU-WEST (+120ms)', type: 'alert' },
  { time: '10:35', text: 'Tenant onboarded: Brand Zeta (staging)', type: 'deploy' },
  { time: '10:32', text: 'Rev-share report generated: Q1 2026 — €184,200', type: 'system' },
  { time: '10:28', text: 'KYC failover: Sumsub → Veriff (Brand Gamma)', type: 'alert' },
  { time: '10:25', text: 'Rollback: Brand Delta v1.9.3 (error rate 4.2%)', type: 'alert' },
  { time: '10:20', text: 'Rate limit cleared: Brand Beta API', type: 'system' },
  { time: '10:15', text: 'DB replica sync complete: EU-WEST-1', type: 'system' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function B2BDashboard() {
  return (
    <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden bg-zinc-950 text-zinc-50">
      <SidebarNav
        brand={{ name: 'Operator OS', abbr: 'B2B' }}
        sections={navSections}
        colorScheme="emerald"
        user={{ name: 'Network Admin', role: 'platform-admin', initial: 'N' }}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopHeader
          title="Network Overview"
          subtitle="Mon, Apr 20 2026 · Real-time"
          colorScheme="emerald"
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Primary content */}
            <div className="xl:col-span-3 space-y-6">
              <KPICards kpis={kpis} />
              <ChartRow
                areaChart={areaChartConfig}
                pieChart={pieChartConfig}
                colorScheme="emerald"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <DashboardTable
                  title="Active Tenant Status"
                  columns={tenantColumns}
                  data={tenants as Record<string, unknown>[]}
                />
                <DashboardTable
                  title="Infrastructure Alerts"
                  badge={{ label: '2 critical', color: 'red' }}
                  columns={alertColumns}
                  data={infraAlerts as Record<string, unknown>[]}
                />
              </div>
            </div>

            {/* Live feed — stacks bottom on mobile, sticky column on xl */}
            <div className="xl:col-span-1">
              <div className="xl:sticky xl:top-6">
                <LiveFeed events={feedEvents} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
