/**
 * Root Layout
 *
 * Main application layout. AuthProvider must wrap all content
 * so useAuth is available in every page.
 */

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AppProviders } from './providers'
import { SkipLink } from '@/shared/components/ui/skip-link'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'TalentOS - PaaS for Modelling, Pageants & Talent Businesses',
  description: 'Multi-tenant, white-label platform for talent management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} antialiased`}>
        <SkipLink />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
