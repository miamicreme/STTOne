import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import '../index.css'

// Self-hosted via next/font — no layout shift, crisp rendering.
// Inter for body/numerics (excellent tabular figures); Sora for display.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Southern Tier Operations Command Center',
  description:
    'Boardroom-ready operations cockpit for Southern Tier Telecommunications — interview prototype.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  )
}
