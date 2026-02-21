"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim()) {
      setError("Please enter your email.")
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      router.push(`/reset-password?email=${encodeURIComponent(email)}`)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20">
            <Mail className="h-7 w-7 text-amber-400" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">Forgot password?</h1>
          <p className="mt-2 text-slate-400">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
            <p className="text-emerald-400 font-medium">Check your email</p>
            <p className="mt-2 text-sm text-slate-400">Redirecting to reset page…</p>
          </div>
        ) : (
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
                  placeholder="you@example.com"
                  className="h-11 border-slate-700 bg-slate-800/80 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-amber-500/50"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              className="h-11 w-full bg-amber-600 text-slate-900 hover:bg-amber-500 font-semibold"
            >
              Send reset link
            </Button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </div>
  )
}
