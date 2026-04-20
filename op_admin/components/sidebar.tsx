'use client'

import { Zap, BarChart3, Users, Gamepad2, DollarSign, Settings, Webhook, FileText, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col p-4 h-screen overflow-hidden">
      {/* Logo Area */}
      <div className="h-12 flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">OPERATOR OS</span>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-8">
        {/* Main Section */}
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Main</p>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-800/50 text-white hover:bg-zinc-800 transition-colors">
              <BarChart3 className="w-5 h-5 text-cyan-500" />
              <span className="text-sm font-medium">Overview</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Player Management</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
              <Gamepad2 className="w-5 h-5" />
              <span className="text-sm font-medium">Game Lobby Config</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Cashier</span>
            </button>
          </div>
        </div>

        {/* System Section */}
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">System</p>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Brand Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
              <Webhook className="w-5 h-5" />
              <span className="text-sm font-medium">API Webhooks</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Audit Logs</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Profile */}
      <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-sm font-bold text-white">AU</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-zinc-500">Active</p>
          </div>
        </div>
        <button className="p-2 hover:bg-zinc-900 rounded-md text-zinc-400 hover:text-zinc-300 transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}
