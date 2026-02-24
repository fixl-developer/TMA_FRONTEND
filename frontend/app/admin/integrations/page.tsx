"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getWebhooksByTenant, getApiKeysByTenant } from "@/shared/services/tenantIntegrationsService"
import type { Webhook, ApiKey } from "@/shared/services/tenantIntegrationsService"
import { Webhook as WebhookIcon, Key, Plus } from "lucide-react"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

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
    <AdminPageLayout
      title="Integrations"
      subtitle="Webhooks and API keys for your tenant"
      actions={
        <>
          <Link href="/admin/reports">
            <AdminButton variant="secondary">Reports</AdminButton>
          </Link>
          <AdminButton disabled>
            <Plus className="h-4 w-4" />
            Add (UI only)
          </AdminButton>
        </>
      }
    >
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Webhooks"
          value={webhooks.length}
          subtitle={`${activeWebhooks} active`}
          icon={WebhookIcon}
          color="purple"
        />
        <AdminStatCard
          label="API Keys"
          value={apiKeys.length}
          subtitle={`${activeApiKeys} active`}
          icon={Key}
          color="blue"
        />
        <AdminStatCard
          label="Active Webhooks"
          value={activeWebhooks}
          subtitle="Receiving events"
          icon={WebhookIcon}
          color="green"
        />
        <AdminStatCard
          label="Active Keys"
          value={activeApiKeys}
          subtitle="In use"
          icon={Key}
          color="yellow"
        />
      </AdminStatsGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Webhooks */}
        <AdminCard title="Webhooks" subtitle={`${webhooks.length} total webhooks`}>
          {loading ? (
            <AdminLoading rows={5} />
          ) : webhooks.length === 0 ? (
            <AdminEmptyState
              icon={WebhookIcon}
              title="No webhooks"
              description="Add webhooks to receive event notifications"
            />
          ) : (
            <div className="space-y-2">
              {webhooks.map((w) => (
                <div
                  key={w._id}
                  className="flex items-center justify-between rounded border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-mono text-xs text-gray-900">{w.url}</p>
                    <p className="mt-1 text-xs text-gray-600">
                      {w.events.join(", ")} · {w.successRate ?? 0}% success
                    </p>
                  </div>
                  <AdminBadge variant={w.status === "ACTIVE" ? "success" : "default"}>
                    {w.status}
                  </AdminBadge>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* API Keys */}
        <AdminCard title="API Keys" subtitle={`${apiKeys.length} total keys`}>
          {loading ? (
            <AdminLoading rows={5} />
          ) : apiKeys.length === 0 ? (
            <AdminEmptyState
              icon={Key}
              title="No API keys"
              description="Create API keys for programmatic access"
            />
          ) : (
            <div className="space-y-2">
              {apiKeys.map((k) => (
                <div
                  key={k._id}
                  className="flex items-center justify-between rounded border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">{k.name}</p>
                    <p className="mt-1 font-mono text-xs text-gray-600">{k.keyPrefix}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {k.scopes.join(", ")} · {(k.requestsLast30d ?? 0).toLocaleString("en-IN")} req/30d
                    </p>
                  </div>
                  <AdminBadge variant={k.status === "ACTIVE" ? "success" : "default"}>
                    {k.status}
                  </AdminBadge>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminPageLayout>
  )
}
