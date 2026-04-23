'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  SidebarNav,
  TopHeader,
  KPICards,
  ChartRow,
  LiveFeed,
  DashboardTable,
  getTheme,
} from '@igaming/ui'
import type {
  NavSection,
  KPIData,
  FeedEvent,
  TableColumn,
  AreaChartConfig,
  PieChartConfig,
} from '@igaming/ui'
import {
  LayoutDashboard,
  Zap,
  Users,
  CreditCard,
  Gamepad2,
  Share2,
  Gift,
  Trophy,
  Crown,
  ShieldCheck,
  AlertTriangle,
  BadgeAlert,
  Settings,
  Webhook,
  Menu,
  X,
  Download,
  MoreHorizontal,
  Check,
  XCircle,
  LogOut,
} from 'lucide-react'
import { logoutAction } from './actions'

// ─── Navigation ───────────────────────────────────────────────────────────────

const navSections: NavSection[] = [
  {
    label: 'CORE',
    items: [
      { label: 'Overview', icon: LayoutDashboard, active: true },
      { label: 'Live Action Feed', icon: Zap },
      { label: 'Player Management', icon: Users },
    ],
  },
  {
    label: 'FINANCIALS',
    items: [
      { label: 'Cashier & Payments', icon: CreditCard },
      { label: 'Game Settlements', icon: Gamepad2 },
      { label: 'Affiliate Rev-Share', icon: Share2 },
    ],
  },
  {
    label: 'CRM & RETENTION',
    items: [
      { label: 'Bonus Engine', icon: Gift },
      { label: 'Tournaments', icon: Trophy },
      { label: 'VIP Management', icon: Crown },
    ],
  },
  {
    label: 'COMPLIANCE',
    items: [
      { label: 'KYC & AML Center', icon: ShieldCheck, badge: '12', badgeVariant: 'warn' },
      { label: 'Responsible Gaming', icon: AlertTriangle },
      { label: 'Fraud Alerts', icon: BadgeAlert, badge: '3', badgeVariant: 'alert' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Brand Settings', icon: Settings },
      { label: 'API Webhooks', icon: Webhook },
    ],
  },
]

// ─── KPI Data ─────────────────────────────────────────────────────────────────

const kpis: KPIData[] = [
  {
    title: 'Net Gaming Revenue (NGR)',
    value: '€38,450.20',
    delta: '+8.4%',
    positive: true,
    sub: 'vs. yesterday €35,472',
    sparkUp: true,
  },
  {
    title: 'Gross Gaming Revenue (GGR)',
    value: '€45,231.89',
    delta: '+12.5%',
    positive: true,
    sub: 'vs. yesterday €40,208',
    sparkUp: true,
  },
  {
    title: 'Platform Margin',
    value: '15.2%',
    delta: 'Stable',
    positive: null,
    sub: 'Target range: 14–18%',
    sparkUp: null,
  },
  {
    title: 'ARPU (Active)',
    value: '€32.50',
    delta: '+1.2%',
    positive: true,
    sub: '1,183 active players',
    sparkUp: true,
  },
]

// ─── Chart Data ───────────────────────────────────────────────────────────────

const areaChartConfig: AreaChartConfig = {
  title: '7-Day NGR vs GGR Trend',
  xKey: 'day',
  data: [
    { day: 'Mon', NGR: 32100, GGR: 38400 },
    { day: 'Tue', NGR: 35800, GGR: 42100 },
    { day: 'Wed', NGR: 29400, GGR: 35200 },
    { day: 'Thu', NGR: 41200, GGR: 48600 },
    { day: 'Fri', NGR: 37900, GGR: 44800 },
    { day: 'Sat', NGR: 44100, GGR: 51900 },
    { day: 'Sun', NGR: 38450, GGR: 45231 },
  ],
  series: [
    { key: 'GGR', color: '#a78bfa', gradientId: 'b2c-gradGGR', gradientColor: '#a78bfa' },
    { key: 'NGR', color: '#6366f1', gradientId: 'b2c-gradNGR', gradientColor: '#6366f1' },
  ],
}

const pieChartConfig: PieChartConfig = {
  title: 'GGR by Provider',
  data: [
    { name: 'Evolution', value: 40 },
    { name: 'Pragmatic', value: 35 },
    { name: 'Hacksaw', value: 25 },
  ],
  colors: ['#6366f1', '#8b5cf6', '#a78bfa'],
}

// ─── Live Feed Data ───────────────────────────────────────────────────────────

const feedEvents: FeedEvent[] = [
  { time: '10:42', text: 'PL-992 won €5,400 on Sweet Bonanza',       type: 'win' },
  { time: '10:41', text: 'KYC approved for PL-104',                   type: 'system' },
  { time: '10:39', text: 'RG Deposit Limit triggered — PL-3301',      type: 'alert' },
  { time: '10:37', text: 'PL-7756 lost €3,500 on Lightning Roulette', type: 'win' },
  { time: '10:35', text: 'Fraud flag raised: PL-5500 (velocity)',      type: 'alert' },
  { time: '10:33', text: 'Affiliate commission settled: €1,240',       type: 'system' },
  { time: '10:30', text: 'PL-1190 won €4,875 on Gates of Olympus',    type: 'win' },
  { time: '10:28', text: 'AML review triggered — PL-0043',            type: 'alert' },
  { time: '10:25', text: 'API key rotated: Payments Gateway',          type: 'system' },
  { time: '10:22', text: 'PL-8801 triggered bonus wagering cap',       type: 'alert' },
  { time: '10:19', text: 'PL-0230 won €9,100 on Crazy Time',          type: 'win' },
  { time: '10:15', text: 'New VIP tier: PL-6612 → Diamond',           type: 'system' },
]

// ─── Action Menu (transaction row dropdown) ───────────────────────────────────

function ActionMenu({ playerId }: { playerId: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-6 w-6 flex items-center justify-center text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-1 w-44 bg-zinc-900 border border-zinc-700 rounded-md shadow-xl z-20 py-1 text-xs">
          <button
            className="w-full text-left px-3 py-1.5 text-zinc-200 hover:bg-zinc-800 transition-colors"
            onClick={() => setOpen(false)}
          >
            View Player — {playerId}
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-red-400 hover:bg-zinc-800 transition-colors"
            onClick={() => setOpen(false)}
          >
            Flag Transaction
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Table Data & Columns ─────────────────────────────────────────────────────

const transactions: Record<string, unknown>[] = [
  { id: 'PL-4421', provider: 'Evolution',      bet: '€5,000.00', win: '€0.00',     status: 'Settled',  action: null },
  { id: 'PL-0982', provider: 'Pragmatic Play', bet: '€1,200.00', win: '€5,400.00', status: 'Paid Out', action: null },
  { id: 'PL-3301', provider: 'Hacksaw Gaming', bet: '€800.00',   win: '€2,100.00', status: 'Paid Out', action: null },
  { id: 'PL-7756', provider: 'Evolution',      bet: '€3,500.00', win: '€0.00',     status: 'Settled',  action: null },
  { id: 'PL-1190', provider: 'Pragmatic Play', bet: '€650.00',   win: '€4,875.00', status: 'Paid Out', action: null },
]

const txColumns: TableColumn[] = [
  { key: 'id', label: 'Player ID' },
  { key: 'provider', label: 'Provider' },
  { key: 'bet', label: 'Bet', align: 'right' },
  {
    key: 'win',
    label: 'Win',
    align: 'right',
    render: (v) => {
      const val = v as string
      return (
        <span className={`tabular-nums font-mono ${val === '€0.00' ? 'text-zinc-600' : 'text-emerald-400 font-semibold'}`}>
          {val}
        </span>
      )
    },
  },
  {
    key: 'status',
    label: 'Status',
    render: (v) => {
      const val = v as string
      const cls =
        val === 'Paid Out'
          ? 'border-emerald-800 text-emerald-400 bg-emerald-950'
          : 'border-zinc-700 text-zinc-500 bg-zinc-800'
      return (
        <span className={`inline-block text-[10px] font-medium border rounded px-1.5 py-0 ${cls}`}>
          {val}
        </span>
      )
    },
  },
  {
    key: 'action',
    label: 'Action',
    align: 'right',
    render: (_, row) => <ActionMenu playerId={row['id'] as string} />,
  },
]

const withdrawals: Record<string, unknown>[] = [
  { id: 'PL-5500', method: 'Bitcoin',    amount: '€12,400.00', risk: 'High', action: null },
  { id: 'PL-2231', method: 'SEPA Bank',  amount: '€3,200.00',  risk: 'Low',  action: null },
  { id: 'PL-8871', method: 'Visa Card',  amount: '€850.00',    risk: 'Low',  action: null },
  { id: 'PL-0043', method: 'Ethereum',   amount: '€7,900.00',  risk: 'High', action: null },
  { id: 'PL-3312', method: 'MasterCard', amount: '€420.00',    risk: 'Low',  action: null },
]

const wColumns: TableColumn[] = [
  { key: 'id', label: 'Player ID' },
  { key: 'method', label: 'Method' },
  { key: 'amount', label: 'Amount', align: 'right' },
  {
    key: 'risk',
    label: 'Risk',
    render: (v) => {
      const val = v as string
      const cls =
        val === 'High'
          ? 'border-red-800 text-red-400 bg-red-950'
          : 'border-zinc-700 text-zinc-500 bg-zinc-800'
      return (
        <span className={`inline-block text-[10px] font-medium border rounded px-1.5 py-0 ${cls}`}>
          {val}
        </span>
      )
    },
  },
  {
    key: 'action',
    label: 'Actions',
    align: 'right',
    render: () => (
      <div className="flex items-center justify-end gap-1">
        <button className="h-6 px-2 text-[10px] font-medium bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded transition-colors flex items-center gap-1">
          <Check className="w-3 h-3" /> Approve
        </button>
        <button className="h-6 px-2 text-[10px] font-medium border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 rounded transition-colors flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Reject
        </button>
      </div>
    ),
  },
]

// ─── Mobile Nav Overlay ───────────────────────────────────────────────────────

function MobileNav({
  open,
  onClose,
  operatorName,
  operatorSlug,
  operatorLogoSrc,
  userEmail,
  userRole,
  onLogout,
}: {
  open: boolean
  onClose: () => void
  operatorName: string
  operatorSlug: string
  operatorLogoSrc: string
  userEmail: string
  userRole: string
  onLogout: () => void
}) {
  const t = getTheme('indigo')
  const initial = userEmail.charAt(0).toUpperCase()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col shadow-2xl">
        <div className="h-14 flex items-center px-4 border-b border-zinc-800 gap-2.5 shrink-0">
          <img
            src={operatorLogoSrc}
            alt={`${operatorName} logo`}
            className="h-7 w-auto max-w-[88px] object-contain shrink-0"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
            data-operator-slug={operatorSlug}
          />
          <span className={`ml-auto text-[10px] ${t.accentSubtle} ${t.accentText} border ${t.accentBorder} px-1.5 py-0 rounded font-medium`}>
            LIVE
          </span>
          <button onClick={onClose} className="ml-2 text-zinc-500 hover:text-zinc-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 mb-1.5">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.label}>
                      <button
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                          item.active
                            ? `${t.navActiveBg} ${t.navActiveText} font-medium`
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`ml-auto text-[10px] rounded px-1.5 py-0 font-semibold border ${
                              item.badgeVariant === 'alert'
                                ? 'bg-red-950 text-red-400 border-red-800'
                                : 'bg-amber-950 text-amber-400 border-amber-800'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-zinc-800 px-3 py-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-full ${t.avatarBg} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{userEmail}</p>
              <p className="text-[10px] text-zinc-500 truncate">{userRole.toLowerCase()}</p>
            </div>
            <form action={onLogout}>
              <button
                type="submit"
                aria-label="Log out"
                className="text-zinc-500 hover:text-zinc-200 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DashboardClientProps {
  userEmail: string
  operatorName: string
  operatorSlug: string
  operatorLogoSrc: string
  role: string
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardClient({
  userEmail,
  operatorName,
  operatorSlug,
  operatorLogoSrc,
  role,
}: DashboardClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const t = getTheme('indigo')
  const initial = userEmail.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden bg-zinc-950 text-zinc-50">

      {/* Desktop sidebar */}
      <SidebarNav
        brand={{
          name: operatorName,
          abbr: operatorName.slice(0, 2).toUpperCase(),
          logoSrc: operatorLogoSrc,
        }}
        sections={navSections}
        colorScheme="indigo"
        user={{ name: userEmail, role: role.toLowerCase(), initial }}
        onLogout={logoutAction}
      />

      {/* Mobile nav overlay */}
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        operatorName={operatorName}
        operatorSlug={operatorSlug}
        operatorLogoSrc={operatorLogoSrc}
        userEmail={userEmail}
        userRole={role}
        onLogout={logoutAction}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile header — hidden on lg+ */}
        <header className="lg:hidden sticky top-0 z-10 h-14 flex items-center gap-3 px-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur shrink-0">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="h-8 w-8 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
          <img
            src={operatorLogoSrc}
            alt={`${operatorName} logo`}
            className="h-6 w-auto max-w-[72px] object-contain shrink-0"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
            data-operator-slug={operatorSlug}
          />
          <button
            className={`h-8 w-8 ml-auto ${t.buttonBg} ${t.buttonHover} text-white rounded-md flex items-center justify-center transition-colors`}
            aria-label="Export report"
          >
            <Download className="w-3 h-3" />
          </button>
        </header>

        {/* Desktop header from shared component */}
        <div className="hidden lg:block">
          <TopHeader
            title="Platform Overview"
            subtitle="Real-time"
            colorScheme="indigo"
          />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

            <div className="xl:col-span-3 space-y-6">
              <KPICards kpis={kpis} />

              <ChartRow
                areaChart={areaChartConfig}
                pieChart={pieChartConfig}
                colorScheme="indigo"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <DashboardTable
                  title="Recent High-Value Transactions"
                  columns={txColumns}
                  data={transactions}
                />
                <DashboardTable
                  title="Pending Withdrawals"
                  badge={{ label: '5 pending', color: 'amber' }}
                  columns={wColumns}
                  data={withdrawals}
                />
              </div>
            </div>

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
