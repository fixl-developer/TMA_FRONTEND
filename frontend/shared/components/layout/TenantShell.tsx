/**
 * Tenant Shell
 *
 * Layout for tenant-facing app routes (/tenant/*).
 * Placeholder until tenant app pages are built.
 */

"use client"

import Link from "next/link"

export function TenantShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-semibold text-slate-800">
            TalentOS
          </Link>
          <Link
            href="/login"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Switch account
          </Link>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
