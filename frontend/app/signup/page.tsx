"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, UserCircle2, ArrowRight, Sparkles } from "lucide-react"

export default function SignupLandingPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 p-12 lg:flex">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">TalentOS</h1>
          <p className="mt-1 text-sm text-slate-400">Create your account</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/30 p-4 backdrop-blur">
            <Sparkles className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-white">Join the platform</p>
              <p className="text-xs text-slate-400">Choose how you want to get started – as an organization or as talent.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="rounded-md border border-slate-700/60 px-3 py-1.5">Multi Talent Agency</span>
            <span className="rounded-md border border-slate-700/60 px-3 py-1.5">India&apos;s First Platform</span>
          </div>
        </div>
      </div>

      {/* Right: Signup options */}
      <div className="flex flex-1 flex-col justify-center bg-slate-950 px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Create your account</h1>
            <p className="mt-2 text-slate-400">Choose how you want to join TalentOS</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => router.push("/signup/tenant")}
              className="group flex flex-col items-start rounded-2xl border border-slate-700/80 bg-slate-900/50 p-6 text-left shadow-xl transition-all hover:border-teal-500/50 hover:bg-slate-800/50 hover:shadow-teal-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 transition-colors group-hover:bg-teal-500/30">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">Tenant / Organization</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">Agency, pageant org, brand, or academy. Create your organization on TalentOS.</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-400 transition-all group-hover:gap-2">
                Get started <ArrowRight className="h-4 w-4" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/signup/talent")}
              className="group flex flex-col items-start rounded-2xl border border-slate-700/80 bg-slate-900/50 p-6 text-left shadow-xl transition-all hover:border-amber-500/50 hover:bg-slate-800/50 hover:shadow-amber-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 transition-colors group-hover:bg-amber-500/30">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">Talent</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">Model, pageant contestant, or influencer. Join the platform as talent.</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 transition-all group-hover:gap-2">
                Get started <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
