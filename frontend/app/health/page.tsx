/**
 * Health check UI – Phase 24 Polish & Launch Prep
 *
 * Lightweight page for uptime monitoring and status checks.
 * Returns 200 when the app is serving.
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Health | TalentOS",
  description: "Health check endpoint for monitoring",
}

export default function HealthPage() {
  const status = "ok"
  const timestamp = new Date().toISOString()

  return (
    <main id="main-content" role="main" className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="rounded-xl border border-slate-200 bg-white px-8 py-6 text-center">
        <h1 className="text-lg font-semibold text-slate-800">Health check</h1>
        <p className="mt-2 text-sm text-slate-600">
          Status: <span className="font-medium text-emerald-600">{status}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">{timestamp}</p>
      </div>
    </main>
  )
}
