import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { TenantAdminShell } from "@/shared/components/layout/TenantAdminShell"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "TalentOS Tenant Admin",
  description: "Tenant administration for TalentOS platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} bg-slate-950 text-slate-100 min-h-screen`}>
        <TenantAdminShell>{children}</TenantAdminShell>
      </body>
    </html>
  )
}
