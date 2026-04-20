'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Transaction {
  playerId: string
  provider: string
  betAmount: number
  winAmount: number
  status: 'Won' | 'Lost' | 'Pending'
}

const transactions: Transaction[] = [
  {
    playerId: 'PL-00184922',
    provider: 'Evolution',
    betAmount: 250.00,
    winAmount: 687.50,
    status: 'Won',
  },
  {
    playerId: 'PL-00184921',
    provider: 'Pragmatic Play',
    betAmount: 125.50,
    winAmount: 0.00,
    status: 'Lost',
  },
  {
    playerId: 'PL-00184920',
    provider: 'Hacksaw Gaming',
    betAmount: 500.00,
    winAmount: 1250.00,
    status: 'Won',
  },
  {
    playerId: 'PL-00184919',
    provider: 'Evolution',
    betAmount: 75.25,
    winAmount: 0.00,
    status: 'Pending',
  },
  {
    playerId: 'PL-00184918',
    provider: 'BGaming',
    betAmount: 200.00,
    winAmount: 400.00,
    status: 'Won',
  },
]

function getStatusBadge(status: 'Won' | 'Lost' | 'Pending') {
  switch (status) {
    case 'Won':
      return <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Won</Badge>
    case 'Lost':
      return <Badge className="bg-zinc-600/50 text-zinc-200 hover:bg-zinc-600/70">Lost</Badge>
    case 'Pending':
      return <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">Pending</Badge>
  }
}

export function TransactionsSection() {
  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Recent High-Value Transactions</h3>
        <a href="#" className="text-sm text-cyan-500 hover:text-cyan-400 font-medium">View All</a>
      </div>
      <div className="rounded-md border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 bg-zinc-950/50 hover:bg-zinc-950/50">
              <TableHead className="text-zinc-400 font-semibold">Player ID</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Game Provider</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-right">Bet Amount</TableHead>
              <TableHead className="text-zinc-400 font-semibold text-right">Win Amount</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, idx) => (
              <TableRow key={idx} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell className="text-zinc-200 font-medium">{tx.playerId}</TableCell>
                <TableCell className="text-zinc-300">{tx.provider}</TableCell>
                <TableCell className="text-right text-zinc-300">€{tx.betAmount.toFixed(2)}</TableCell>
                <TableCell className="text-right text-zinc-300 font-semibold">€{tx.winAmount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(tx.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
