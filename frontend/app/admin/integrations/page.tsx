"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { getWebhooksByTenant, getApiKeysByTenant } from "@/shared/services/tenantIntegrationsService"
import type { Webhook, ApiKey } from "@/shared/services/tenantIntegrationsService"
import { Webhook as WebhookIcon, Key, Plus, CheckCircle, XCircle } from "lucide-react"

const DEMO_TENANT = "tenant_001"

export default function TenantIntegrationsPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getWebhooksByTenant(DEMO_TENANT),
      getApiKeysByTenant(DEMO_TENANT),
    ])
      .then(([w, k]) => {
        setWebhooks(w)
        setApiKeys(k)
      })
      .finally(() => setLoading(false))
  }, [])

  const activeWebhooks = webhooks.filter((w) => w.status === "ACTIVE").length
  const activeApiKeys = apiKeys.filter((k) => k.status === "ACTIVE").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Integrations</h1>
            <p className="mt-2 text-base text-white/60">Webhooks and API keys for your tenant</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/reports">
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                Reports
              </Button>
            </Link>
            <Button className="bg-[#d4ff00] text-black hover:bg-[#b8e600]" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Add (UI only)
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Webhooks</p>
                  <p className="mt-1 text-sm text-white/60">{activeWebhooks} active</p>
                </div>
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <WebhookIcon className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{webhooks.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">API keys</p>
                  <p className="mt-1 text-sm text-white/60">{activeApiKeys} active</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Key className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{apiKeys.length}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Webhooks */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="mb-6 text-lg font-bold text-white">Webhooks</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : webhooks.length === 0 ? (
              <div className="py-12 text-center">
                <WebhookIcon className="mx-auto mb-3 h-12 w-12 text-white/30" />
                <p className="text-white/60">No webhooks</p>
                <p className="mt-1 text-sm text-white/40">Add webhooks to receive event notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {webhooks.map((w) => (
                  <div
                    key={w._id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-sm text-white">{w.url}</p>
                      <p className="mt-1 text-xs text-white/60">
                        {w.events.join(", ")} · {w.successRate ?? 0}% success
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        w.status === "ACTIVE"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* API Keys */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="mb-6 text-lg font-bold text-white">API keys</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="py-12 text-center">
                <Key className="mx-auto mb-3 h-12 w-12 text-white/30" />
                <p className="text-white/60">No API keys</p>
                <p className="mt-1 text-sm text-white/40">Create API keys for programmatic access</p>
              </div>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((k) => (
                  <div
                    key={k._id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{k.name}</p>
                      <p className="mt-1 font-mono text-xs text-white/60">{k.keyPrefix}</p>
                      <p className="mt-1 text-xs text-white/40">
                        {k.scopes.join(", ")} · {(k.requestsLast30d ?? 0).toLocaleString()} req/30d
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        k.status === "ACTIVE"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {k.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
