'use client'

import React from 'react'
import { Download } from 'lucide-react'
import type { ColorScheme } from '../theme'
import { getTheme } from '../theme'

export type TopHeaderProps = {
  title: string
  subtitle?: string
  colorScheme?: ColorScheme
}

export function TopHeader({ title, subtitle, colorScheme = 'indigo' }: TopHeaderProps) {
  const t = getTheme(colorScheme)

  return (
    <header className="sticky top-0 z-10 h-14 flex items-center gap-3 px-4 lg:px-6 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur shrink-0">
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <select
          defaultValue="today"
          className="h-8 text-xs bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-zinc-600 w-32 cursor-pointer"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="mtd">Month to Date</option>
        </select>

        <select
          defaultValue="CET"
          className="hidden sm:block h-8 text-xs bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-zinc-600 w-20 cursor-pointer"
        >
          <option value="CET">CET</option>
          <option value="UTC">UTC</option>
          <option value="EST">EST</option>
          <option value="PST">PST</option>
        </select>

        <button
          className={`h-8 text-xs ${t.buttonBg} ${t.buttonHover} text-white rounded-md px-3 flex items-center gap-1.5 font-medium transition-colors`}
        >
          <Download className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>
    </header>
  )
}
