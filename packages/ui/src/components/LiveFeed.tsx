'use client'

import React from 'react'

export type FeedEvent = {
  time: string
  text: string
  type: 'win' | 'alert' | 'system' | 'deploy'
}

export type LiveFeedProps = {
  events: FeedEvent[]
}

const dotColors: Record<string, string> = {
  win: 'bg-emerald-500',
  alert: 'bg-red-500',
  system: 'bg-sky-500',
  deploy: 'bg-violet-500',
}

export function LiveFeed({ events }: LiveFeedProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col overflow-hidden">
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-zinc-800 shrink-0">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-widest">
          Live Action Feed
        </span>
      </div>

      <div className="overflow-y-auto max-h-96 xl:max-h-none divide-y divide-zinc-800/60">
        {events.map((event, i) => (
          <div
            key={i}
            className="flex gap-3 px-4 py-3 hover:bg-zinc-800/40 transition-colors"
          >
            <div className="pt-1 shrink-0">
              <div
                className={`w-1.5 h-1.5 rounded-full ${dotColors[event.type] ?? 'bg-zinc-500'}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] leading-relaxed text-zinc-300">{event.text}</p>
              <p className="text-[10px] text-zinc-600 mt-1 tabular-nums">{event.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-800 px-4 py-3 mt-auto shrink-0">
        <div className="flex items-center gap-3 text-[10px] text-zinc-600 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Win
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Alert
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> System
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Deploy
          </span>
        </div>
      </div>
    </div>
  )
}
