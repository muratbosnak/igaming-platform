'use client'

import React from 'react'

export type TableColumn = {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

export type DashboardTableProps = {
  title: string
  badge?: { label: string; color: 'amber' | 'red' | 'emerald' | 'sky' }
  columns: TableColumn[]
  data: Record<string, unknown>[]
  minWidth?: string
}

const badgeClasses: Record<string, string> = {
  amber: 'border-amber-800 text-amber-400 bg-amber-950',
  red: 'border-red-800 text-red-400 bg-red-950',
  emerald: 'border-emerald-800 text-emerald-400 bg-emerald-950',
  sky: 'border-sky-800 text-sky-400 bg-sky-950',
}

export function DashboardTable({
  title,
  badge,
  columns,
  data,
  minWidth = '560px',
}: DashboardTableProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
          {title}
        </span>
        {badge && (
          <span
            className={`text-[10px] border rounded px-1.5 py-0 font-medium ${badgeClasses[badge.color]}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      <div className="overflow-x-auto w-full pb-2">
        <table className="w-full text-sm" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-zinc-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-[10px] text-zinc-600 font-semibold uppercase tracking-wider py-2 ${
                    col.align === 'right'
                      ? 'text-right pr-4'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-left pl-4'
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-zinc-800/60 hover:bg-zinc-800/40 last:border-0"
              >
                {columns.map((col) => {
                  const value = row[col.key]
                  return (
                    <td
                      key={col.key}
                      className={`py-2.5 text-xs text-zinc-300 ${
                        col.align === 'right'
                          ? 'text-right pr-4 tabular-nums font-mono'
                          : col.align === 'center'
                            ? 'text-center'
                            : 'pl-4'
                      }`}
                    >
                      {col.render ? col.render(value, row) : String(value ?? '')}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
