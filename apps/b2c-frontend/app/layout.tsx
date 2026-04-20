import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'B2C Frontend — Operator OS',
  description: 'Player-facing frontend',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-zinc-950">{children}</body>
    </html>
  )
}
