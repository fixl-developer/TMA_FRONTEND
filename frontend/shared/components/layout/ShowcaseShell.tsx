"use client"

import Link from "next/link"
import { useAuth } from "@/shared/context/AuthContext"

export function ShowcaseShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/showcase" className="font-display text-xl font-bold text-slate-800">
            TalentOS Showcase
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900">Dashboard</Link>
                <button onClick={() => logout()} className="text-sm text-slate-600 hover:text-slate-900">Logout</button>
              </>
            ) : (
              <Link href="/login" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
