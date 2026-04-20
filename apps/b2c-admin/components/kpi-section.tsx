'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  subtext: string
  isPositive?: boolean
}

function KPICard({ title, value, subtext, isPositive }: KPICardProps) {
  const isNegative = subtext.includes('-') && !isPositive
  
  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800">
      <p className="text-sm font-medium text-zinc-400">{title}</p>
      <p className="text-2xl font-bold tracking-tight mt-2 text-white">{value}</p>
      <div className={`flex items-center gap-1 mt-3 text-sm font-medium ${
        isNegative ? 'text-rose-500' : 'text-emerald-500'
      }`}>
        {isNegative ? (
          <TrendingDown className="w-4 h-4" />
        ) : (
          <TrendingUp className="w-4 h-4" />
        )}
        {subtext}
      </div>
    </Card>
  )
}

export function KPISection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Gross Gaming Revenue"
        value="€45,231.89"
        subtext="+12.5% from last week"
        isPositive={true}
      />
      <KPICard
        title="Active Players (24h)"
        value="1,204"
        subtext="+5.2% from yesterday"
        isPositive={true}
      />
      <KPICard
        title="First Time Depositors"
        value="89"
        subtext="-2.1% from last week"
        isPositive={false}
      />
      <KPICard
        title="Total Bet Volume"
        value="145,230"
        subtext="Stable vs last week"
        isPositive={true}
      />
    </div>
  )
}
