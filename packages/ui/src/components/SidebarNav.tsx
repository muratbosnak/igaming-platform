'use client'

import React from 'react'
import type { ColorScheme } from '../theme'
import { getTheme } from '../theme'

export type NavItem = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
  badge?: string
  badgeVariant?: 'alert' | 'warn'
}

export type NavSection = {
  label: string
  items: NavItem[]
}

export type SidebarBrand = {
  name: string
  abbr: string
}

export type SidebarUser = {
  name: string
  role: string
  initial: string
}

export type SidebarNavProps = {
  brand: SidebarBrand
  sections: NavSection[]
  user?: SidebarUser
  colorScheme?: ColorScheme
  liveBadge?: boolean
}

export function SidebarNav({
  brand,
  sections,
  user = { name: 'Admin User', role: 'super-admin', initial: 'A' },
  colorScheme = 'indigo',
  liveBadge = true,
}: SidebarNavProps) {
  const t = getTheme(colorScheme)

  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col h-full bg-zinc-900 border-r border-zinc-800">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-zinc-800 gap-2.5 shrink-0">
        <div
          className={`w-7 h-7 rounded ${t.accentBg} flex items-center justify-center shrink-0`}
        >
          <span className="text-[11px] font-bold text-white">{brand.abbr}</span>
        </div>
        <span className="text-sm font-semibold text-zinc-100 tracking-tight">{brand.name}</span>
        {liveBadge && (
          <span
            className={`ml-auto text-[10px] ${t.accentSubtle} ${t.accentText} border ${t.accentBorder} px-1.5 py-0 rounded font-medium`}
          >
            LIVE
          </span>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {sections.map((section) => (
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

      {/* User footer */}
      {user && (
        <div className="border-t border-zinc-800 px-3 py-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full ${t.avatarBg} flex items-center justify-center text-xs font-bold text-white shrink-0`}
            >
              {user.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user.role}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          </div>
        </div>
      )}
    </aside>
  )
}
