import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../index.css'

// Self-hosted variable fonts — no network at build time, no layout shift.
// Inter for body/numerics (excellent tabular figures); Sora for display.
const inter = localFont({
  src: './fonts/inter-var.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})
const sora = localFont({
  src: './fonts/sora-var.woff2',
  variable: '--font-sora',
  display: 'swap',
  weight: '100 800',
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
