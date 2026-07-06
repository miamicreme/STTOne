import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../index.css'

// Self-hosted Inter variable font — no network request, no layout shift.
// Use one highly readable font family across the app for faster first paint.
const inter = localFont({
  src: './fonts/inter-var.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Southern Tier Operations Command Center',
  description:
    'Boardroom-ready operations cockpit for Southern Tier Telecommunications — interview prototype.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
