'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Sparkline } from './Sparkline'

export type KPIData = {
  title: string
  value: string
  delta: string
  positive: boolean | null
  sub: string
  sparkUp: boolean | null
}

export type KPICardsProps = {
  kpis: KPIData[]
}

export function KPICards({ kpis }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"
        >
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
        </div>
      ))}
    </div>
  )
}
