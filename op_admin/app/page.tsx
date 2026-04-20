'use client'

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
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
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
  Menu,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

// ─── Static Data ──────────────────────────────────────────────────────────────

const ngrGgrData = [
  { day: 'Mon', NGR: 32100, GGR: 38400 },
  { day: 'Tue', NGR: 35800, GGR: 42100 },
  { day: 'Wed', NGR: 29400, GGR: 35200 },
  { day: 'Thu', NGR: 41200, GGR: 48600 },
  { day: 'Fri', NGR: 37900, GGR: 44800 },
  { day: 'Sat', NGR: 44100, GGR: 51900 },
  { day: 'Sun', NGR: 38450, GGR: 45231 },
]

const providerData = [
  { name: 'Evolution', value: 40 },
  { name: 'Pragmatic', value: 35 },
  { name: 'Hacksaw', value: 25 },
]
const PROVIDER_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa']

const transactions = [
  { id: 'PL-4421', provider: 'Evolution', bet: '€5,000.00', win: '€0.00', status: 'Settled' },
  { id: 'PL-0982', provider: 'Pragmatic Play', bet: '€1,200.00', win: '€5,400.00', status: 'Paid Out' },
  { id: 'PL-3301', provider: 'Hacksaw Gaming', bet: '€800.00', win: '€2,100.00', status: 'Paid Out' },
  { id: 'PL-7756', provider: 'Evolution', bet: '€3,500.00', win: '€0.00', status: 'Settled' },
  { id: 'PL-1190', provider: 'Pragmatic Play', bet: '€650.00', win: '€4,875.00', status: 'Paid Out' },
]

const withdrawals = [
  { id: 'PL-5500', method: 'Bitcoin', amount: '€12,400.00', risk: 'High' },
  { id: 'PL-2231', method: 'SEPA Bank', amount: '€3,200.00', risk: 'Low' },
  { id: 'PL-8871', method: 'Visa Card', amount: '€850.00', risk: 'Low' },
  { id: 'PL-0043', method: 'Ethereum', amount: '€7,900.00', risk: 'High' },
  { id: 'PL-3312', method: 'MasterCard', amount: '€420.00', risk: 'Low' },
]

const feedEvents = [
  { time: '10:42', text: 'PL-992 won €5,400 on Sweet Bonanza', type: 'win' },
  { time: '10:41', text: 'KYC approved for PL-104', type: 'system' },
  { time: '10:39', text: 'RG Deposit Limit triggered — PL-3301', type: 'alert' },
  { time: '10:37', text: 'PL-7756 lost €3,500 on Lightning Roulette', type: 'win' },
  { time: '10:35', text: 'Fraud flag raised: PL-5500 (velocity)', type: 'alert' },
  { time: '10:33', text: 'Affiliate commission settled: €1,240', type: 'system' },
  { time: '10:30', text: 'PL-1190 won €4,875 on Gates of Olympus', type: 'win' },
  { time: '10:28', text: 'AML review triggered — PL-0043', type: 'alert' },
  { time: '10:25', text: 'API key rotated: Payments Gateway', type: 'system' },
  { time: '10:22', text: 'PL-8801 triggered bonus wagering cap', type: 'alert' },
  { time: '10:19', text: 'PL-0230 won €9,100 on Crazy Time', type: 'win' },
  { time: '10:15', text: 'New VIP tier assigned: PL-6612 → Diamond', type: 'system' },
]

// ─── Navigation Config ────────────────────────────────────────────────────────

type NavItem = {
  label: string
  icon: React.ElementType
  active?: boolean
  badge?: string
  badgeVariant?: 'alert' | 'warn'
}

const navSections: { label: string; items: NavItem[] }[] = [
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

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ up }: { up: boolean | null }) {
  const upPath = 'M0,20 L8,16 L16,17 L24,11 L32,8 L40,9 L48,4'
  const flatPath = 'M0,12 L8,11 L16,13 L24,12 L32,11 L40,12 L48,12'
  const color = up === true ? '#22c55e' : up === false ? '#ef4444' : '#71717a'
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" aria-hidden="true">
      <path
        d={up !== null ? upPath : flatPath}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Sidebar Shared Content ───────────────────────────────────────────────────

function SidebarLogoHeader() {
  return (
    <div className="h-14 flex items-center px-4 border-b border-zinc-800 gap-2.5 shrink-0">
      <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center shrink-0">
        <span className="text-[11px] font-bold text-white">OS</span>
      </div>
      <span className="text-sm font-semibold text-zinc-100 tracking-tight">Operator OS</span>
      <Badge className="ml-auto text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700 px-1.5 py-0 rounded font-medium">
        LIVE
      </Badge>
    </div>
  )
}

function SidebarNavContent() {
  return (
    <>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 mb-1.5">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.label}>
                  <button
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                      item.active
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
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
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-zinc-800 px-3 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">Admin User</p>
            <p className="text-[10px] text-zinc-500 truncate">super-admin</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        </div>
      </div>
    </>
  )
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

function SidebarNav() {
  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col h-full bg-zinc-900 border-r border-zinc-800">
      <SidebarLogoHeader />
      <SidebarNavContent />
    </aside>
  )
}

// ─── Mobile Nav Sheet ─────────────────────────────────────────────────────────

function MobileMenuTrigger() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          aria-label="Open navigation"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 bg-zinc-950 border-zinc-800 p-0 flex flex-col"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SidebarLogoHeader />
        <SidebarNavContent />
      </SheetContent>
    </Sheet>
  )
}

// ─── Top Header ───────────────────────────────────────────────────────────────

function TopHeader() {
  return (
    <header className="sticky top-0 z-10 h-14 flex items-center gap-3 px-4 lg:px-6 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur shrink-0">
      {/* Mobile: hamburger + logo */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <MobileMenuTrigger />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">OS</span>
          </div>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">Operator OS</span>
        </div>
      </div>

      {/* Desktop: page title */}
      <div className="hidden lg:block flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">Platform Overview</h1>
        <p className="text-[11px] text-zinc-500 mt-0.5">Mon, Apr 20 2026 · Real-time</p>
      </div>

      {/* Controls — always visible, adapt on small screens */}
      <div className="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">
        <Select defaultValue="today">
          <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700 text-zinc-300 w-32 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="mtd">Month to Date</SelectItem>
          </SelectContent>
        </Select>

        <div className="hidden sm:block">
          <Select defaultValue="CET">
            <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700 text-zinc-300 w-20 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-200 text-xs">
              <SelectItem value="CET">CET</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="EST">EST</SelectItem>
              <SelectItem value="PST">PST</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          size="sm"
          className="h-8 text-xs bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 font-medium"
        >
          <Download className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline">Export Report</span>
        </Button>
      </div>
    </header>
  )
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────

type KPI = {
  title: string
  value: string
  delta: string
  positive: boolean | null
  sub: string
  sparkUp: boolean | null
}

function KPICards() {
  const kpis: KPI[] = [
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="bg-zinc-900 border-zinc-800 rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider leading-snug">
                {kpi.title}
              </p>
              <Sparkline up={kpi.sparkUp} />
            </div>
            <p className="text-2xl font-semibold text-zinc-100 mt-2 tracking-tight tabular-nums">
              {kpi.value}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`text-[11px] font-semibold flex items-center gap-0.5 ${
                  kpi.positive === true
                    ? 'text-emerald-400'
                    : kpi.positive === false
                      ? 'text-red-400'
                      : 'text-zinc-500'
                }`}
              >
                {kpi.positive === true && <TrendingUp className="w-3 h-3" />}
                {kpi.positive === false && <TrendingDown className="w-3 h-3" />}
                {kpi.positive === null && <Minus className="w-3 h-3" />}
                {kpi.delta}
              </span>
              <span className="text-[10px] text-zinc-600 truncate">{kpi.sub}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Chart Row ────────────────────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: '6px',
  fontSize: '11px',
  color: '#e4e4e7',
}

function ChartRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* 7-Day NGR vs GGR Area Chart */}
      <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
        <CardHeader className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
              7-Day NGR vs GGR Trend
            </CardTitle>
            <div className="flex items-center gap-4 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-500 inline-block rounded-full" />
                NGR
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-violet-400 inline-block rounded-full" />
                GGR
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pt-0 pb-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ngrGgrData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNGR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGGR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${((v as number) / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: '#a1a1aa', marginBottom: 4 }}
                formatter={(value) => [`€${(value as number).toLocaleString()}`, undefined]}
              />
              <Area
                type="monotone"
                dataKey="GGR"
                stroke="#a78bfa"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorGGR)"
              />
              <Area
                type="monotone"
                dataKey="NGR"
                stroke="#6366f1"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorNGR)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* GGR by Provider Donut */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
            GGR by Provider
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pt-0 pb-4 flex flex-col items-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={providerData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {providerData.map((entry, index) => (
                  <Cell key={entry.name} fill={PROVIDER_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value as number}%`, undefined]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 w-full mt-1">
            {providerData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: PROVIDER_COLORS[i] }}
                  />
                  {item.name}
                </span>
                <span className="text-[11px] font-semibold text-zinc-200 tabular-nums">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Transactions Table ───────────────────────────────────────────────────────

function TransactionsTable() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
          Recent High-Value Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto w-full pb-2">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider pl-4 py-2">
                  Player ID
                </TableHead>
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider py-2">
                  Provider
                </TableHead>
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider text-right py-2">
                  Bet
                </TableHead>
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider text-right py-2">
                  Win
                </TableHead>
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider py-2">
                  Status
                </TableHead>
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider text-right pr-4 py-2">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={`${tx.id}-${tx.bet}`} className="border-zinc-800 hover:bg-zinc-800/40">
                  <TableCell className="text-xs text-zinc-300 font-medium pl-4 py-2.5 tabular-nums">
                    {tx.id}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400 py-2.5">{tx.provider}</TableCell>
                  <TableCell className="text-xs text-zinc-300 text-right py-2.5 tabular-nums font-mono">
                    {tx.bet}
                  </TableCell>
                  <TableCell
                    className={`text-xs text-right py-2.5 tabular-nums font-mono ${
                      tx.win === '€0.00' ? 'text-zinc-600' : 'text-emerald-400 font-semibold'
                    }`}
                  >
                    {tx.win}
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 font-medium ${
                        tx.status === 'Paid Out'
                          ? 'border-emerald-800 text-emerald-400 bg-emerald-950'
                          : 'border-zinc-700 text-zinc-500 bg-zinc-800'
                      }`}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4 py-2.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-zinc-900 border-zinc-700 text-zinc-200 min-w-36"
                      >
                        <DropdownMenuItem className="text-xs hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-zinc-100">
                          View Player
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-red-400 hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-red-300">
                          Flag Transaction
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Withdrawals Table ────────────────────────────────────────────────────────

function WithdrawalsTable() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
            Pending Withdrawals
          </CardTitle>
          <Badge
            variant="outline"
            className="text-[10px] border-amber-800 text-amber-400 bg-amber-950 px-1.5 py-0 font-medium"
          >
            5 pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto w-full pb-2">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider pl-4 py-2">
                  Player ID
                </TableHead>
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider py-2">
                  Method
                </TableHead>
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider text-right py-2">
                  Amount
                </TableHead>
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider py-2">
                  Risk
                </TableHead>
                <TableHead className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider text-right pr-4 py-2">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((w) => (
                <TableRow key={w.id} className="border-zinc-800 hover:bg-zinc-800/40">
                  <TableCell className="text-xs text-zinc-300 font-medium pl-4 py-2.5 tabular-nums">
                    {w.id}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400 py-2.5">{w.method}</TableCell>
                  <TableCell className="text-xs text-zinc-200 text-right py-2.5 tabular-nums font-mono font-semibold">
                    {w.amount}
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 font-medium ${
                        w.risk === 'High'
                          ? 'border-red-800 text-red-400 bg-red-950'
                          : 'border-zinc-700 text-zinc-500 bg-zinc-800'
                      }`}
                    >
                      {w.risk}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        className="h-6 text-[10px] px-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-medium border-0"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-[10px] px-2 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Live Feed ────────────────────────────────────────────────────────────────

const feedDotClass: Record<string, string> = {
  win: 'bg-emerald-500',
  alert: 'bg-red-500',
  system: 'bg-sky-500',
}

function LiveFeed() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 flex flex-col overflow-hidden">
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-zinc-800 shrink-0">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-widest">
          Live Action Feed
        </span>
      </div>

      <div className="overflow-y-auto max-h-96 xl:max-h-none divide-y divide-zinc-800/60">
        {feedEvents.map((event, i) => (
          <div
            key={i}
            className="flex gap-3 px-4 py-3 hover:bg-zinc-800/40 transition-colors"
          >
            <div className="pt-1 shrink-0">
              <div className={`w-1.5 h-1.5 rounded-full ${feedDotClass[event.type]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] leading-relaxed text-zinc-300">{event.text}</p>
              <p className="text-[10px] text-zinc-600 mt-1 tabular-nums">{event.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-800 px-4 py-3 mt-auto shrink-0">
        <div className="flex items-center justify-between text-[10px] text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Win
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Alert
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> System
          </span>
        </div>
      </div>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full flex-col lg:flex-row overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Desktop sidebar — hidden on mobile */}
      <SidebarNav />

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopHeader />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Primary dashboard content */}
            <div className="xl:col-span-3 space-y-6">
              <KPICards />
              <ChartRow />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <TransactionsTable />
                <WithdrawalsTable />
              </div>
            </div>

            {/* Live feed — stacks below on mobile/tablet, sticky column on xl */}
            <div className="xl:col-span-1">
              <div className="xl:sticky xl:top-6">
                <LiveFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
