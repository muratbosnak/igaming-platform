'use client'

import React from 'react'

export function Sparkline({ up }: { up: boolean | null }) {
  const upPath = 'M0,20 L8,16 L16,17 L24,11 L32,8 L40,9 L48,4'
  const flatPath = 'M0,12 L8,11 L16,13 L24,12 L32,11 L40,12 L48,12'
  const color = up === true ? '#22c55e' : up === false ? '#ef4444' : '#71717a'
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" aria-hidden="true">
      <path
        d={up !== null ? upPath : flatPath}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
