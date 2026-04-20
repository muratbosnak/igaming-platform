'use client'

import { Card } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { day: 'Mon', revenue: 32400 },
  { day: 'Tue', revenue: 38210 },
  { day: 'Wed', revenue: 41290 },
  { day: 'Thu', revenue: 35800 },
  { day: 'Fri', revenue: 48910 },
  { day: 'Sat', revenue: 52100 },
  { day: 'Sun', revenue: 45231 },
]

export function ChartSection() {
  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800 w-full">
      <h3 className="text-lg font-semibold text-white mb-6">7-Day GGR Trend</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#71717a"
              style={{ fontSize: '12px', fontWeight: 500 }}
            />
            <YAxis 
              stroke="#71717a"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                color: '#f4f4f5',
              }}
              formatter={(value) => [`€${(value as number).toLocaleString()}`, 'GGR']}
              labelStyle={{ color: '#f4f4f5' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
