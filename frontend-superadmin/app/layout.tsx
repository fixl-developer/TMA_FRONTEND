/**
 * Root Layout - Super Admin
 * 
 * Main application layout for Super Admin frontend.
 * Wraps all pages with necessary providers.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SuperAdminShell } from '@/shared/components/layout/SuperAdminShell'
import { ToastProvider } from '@/shared/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TalentOS Super Admin',
  description: 'Super Admin dashboard for TalentOS platform management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-foreground min-h-screen`}
      >
        <ToastProvider>
          <SuperAdminShell>{children}</SuperAdminShell>
        </ToastProvider>
      </body>
    </html>
  )
}
