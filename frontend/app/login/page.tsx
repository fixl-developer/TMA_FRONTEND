"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth, DEMO_USERS, DASHBOARD_PATH } from "@/shared/context/AuthContext"
import { getDisplayRoleLabel } from "@/shared/lib/roles"
import { seedUsers } from "@/data/seed"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Mail, Lock, Sparkles, Users, Megaphone, GraduationCap, ChevronDown } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = login(email, password)
    if (result.ok) {
      const key = email.trim().toLowerCase()
      const demo = DEMO_USERS[key]
      const defaultPath = demo ? DASHBOARD_PATH[demo.role] : "/superadmin"
      const path = returnUrl && returnUrl.startsWith("/") ? returnUrl : defaultPath
      router.push(path)
    } else {
      setError(result.error ?? "Login failed")
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding panel + Demo credentials */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-12 lg:flex">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">TalentOS</h1>
          <p className="mt-1 text-sm text-slate-400">PaaS for Modelling, Pageants & Talent</p>
        </div>
        {/* Demo credentials */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Demo credentials</p>
          <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
            {Object.entries(DEMO_USERS).map(([e, { password: p, name, role }]) => (
              <button
                key={e}
                type="button"
                onClick={() => { setEmail(e); setPassword(p); setError("") }}
                className="rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-left text-xs transition-colors hover:border-slate-600 hover:bg-slate-700/40"
                title={`${e} / ${p}`}
              >
                <span className="font-medium text-slate-200 block truncate">{name}</span>
                <span className="text-slate-500 text-[10px] truncate block">{e}</span>
                <span className="text-amber-400/80 text-[10px] mt-0.5 block">{getDisplayRoleLabel(e, role, seedUsers as any[])}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/30 p-4 backdrop-blur">
            <Sparkles className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-white">One platform, every role</p>
              <p className="text-xs text-slate-400">Agency, pageant, talent management, academy & influencer – all in one.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/20 px-3 py-2.5">
              <Users className="h-4 w-4 text-teal-400" />
              <span className="text-xs text-slate-300">Talent CRM</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/20 px-3 py-2.5">
              <Megaphone className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-slate-300">Castings</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/20 px-3 py-2.5">
              <GraduationCap className="h-4 w-4 text-violet-400" />
              <span className="text-xs text-slate-300">Academy</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/20 px-3 py-2.5">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span className="text-xs text-slate-300">Influencer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 flex-col justify-center bg-slate-950 px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <h1 className="font-display text-2xl font-bold text-white">TalentOS</h1>
            <p className="mt-1 text-sm text-slate-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@talentos.io"
                  className="h-11 border-slate-700 bg-slate-800/80 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-amber-500/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 border-slate-700 bg-slate-800/80 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-amber-500/50"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-amber-600 text-slate-900 hover:bg-amber-500 font-semibold"
            >
              Sign in
            </Button>
          </form>

          {/* Demo credentials – mobile only (left panel hidden on small screens) */}
          <div className="mt-6 lg:hidden">
            <details className="group rounded-lg border border-slate-800 bg-slate-900/40">
              <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-400">
                Demo credentials
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="grid grid-cols-2 gap-1.5 border-t border-slate-800 p-2 max-h-48 overflow-y-auto">
                {Object.entries(DEMO_USERS).map(([e, { password: p, name, role }]) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => { setEmail(e); setPassword(p); setError("") }}
                    className="rounded-md border border-slate-700/60 bg-slate-800/50 px-2.5 py-1.5 text-left text-xs transition-colors hover:border-slate-600 hover:bg-slate-700/40"
                    title={`${e} / ${p}`}
                  >
                    <span className="font-medium text-slate-200 block">{name}</span>
                    <span className="text-amber-400/80 text-[10px]">{getDisplayRoleLabel(e, role, seedUsers as any[])}</span>
                  </button>
                ))}
              </div>
            </details>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
