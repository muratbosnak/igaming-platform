'use client'

import React from 'react'
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
import type { ColorScheme } from '../theme'

export type AreaSeries = {
  key: string
  color: string
  gradientId: string
  gradientColor: string
}

export type AreaChartConfig = {
  title: string
  data: Record<string, number | string>[]
  xKey: string
  series: AreaSeries[]
}

export type PieChartConfig = {
  title: string
  data: { name: string; value: number }[]
  colors: string[]
}

export type ChartRowProps = {
  areaChart: AreaChartConfig
  pieChart: PieChartConfig
  colorScheme?: ColorScheme
}

const tooltipStyle = {
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: '6px',
  fontSize: '11px',
  color: '#e4e4e7',
}

export function ChartRow({ areaChart, pieChart }: ChartRowProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Area Chart */}
      <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
            {areaChart.title}
          </span>
          <div className="flex items-center gap-4 text-[10px] text-zinc-500">
            {areaChart.series.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-0.5 inline-block rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.key}
              </span>
            ))}
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="w-full h-[300px] min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={areaChart.data}
                margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
              >
                <defs>
                  {areaChart.series.map((s) => (
                    <linearGradient
                      key={s.gradientId}
                      id={s.gradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={s.gradientColor} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={s.gradientColor} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis
                  dataKey={areaChart.xKey}
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
                  formatter={(value) => [
                    `€${(value as number).toLocaleString()}`,
                    undefined,
                  ]}
                />
                {areaChart.series.map((s) => (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill={`url(#${s.gradientId})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="px-4 pt-4 pb-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
            {pieChart.title}
          </span>
        </div>
        <div className="px-4 pb-4 flex flex-col items-center">
          <div className="w-full h-[300px] min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChart.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieChart.data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieChart.colors[index % pieChart.colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value as number}%`, undefined]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 w-full mt-1">
            {pieChart.data.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: pieChart.colors[i % pieChart.colors.length],
                    }}
                  />
                  {item.name}
                </span>
                <span className="text-[11px] font-semibold text-zinc-200 tabular-nums">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
