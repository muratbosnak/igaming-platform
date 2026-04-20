'use client'

import { Download, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-zinc-800 px-8 flex justify-between items-center bg-zinc-950/50 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-semibold text-white">Dashboard Overview</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Date Range
        </Button>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </header>
  )
}
