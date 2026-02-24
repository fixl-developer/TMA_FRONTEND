"use client"

import platformConfig from "@/data/seed/platformConfig.json"
import serviceStatus from "@/data/seed/serviceStatus.json"
import { Globe2, Server, Settings } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

type PlatformConfig = typeof platformConfig
type ServiceStatus = typeof serviceStatus

export default function ConfigEnvironmentsPage() {
  const cfg = platformConfig as PlatformConfig
  const svc = serviceStatus as ServiceStatus

  const general = cfg.general ?? []
  const defaultTimezone = general.find((x) => x.key === "default_timezone")?.value ?? "Asia/Kolkata"

  return (
    <PageLayout>
      <PageHeader
        title="Environment configuration"
        description="High-level view of logical environments and core service health. Seed-only snapshot."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Globe2 className="h-3.5 w-3.5 text-[#0078d4]" />
            Environments
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Environments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">3</p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Development, staging, production (logical).
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Default timezone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-[#323130]">
                {defaultTimezone}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                From global platform config.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Server className="h-4 w-4 text-[#0078d4]" />
                Core services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {svc.services?.length ?? 0}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                API, DB, Redis, Queue (seed).
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Environments">
        <div className="grid gap-4 lg:grid-cols-3">
          {["development", "staging", "production"].map((env) => (
            <Card key={env}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Globe2 className="h-4 w-4 text-[#0078d4]" />
                  {env.charAt(0).toUpperCase() + env.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[#323130]">
                <div>
                  <span className="text-xs text-[#605e5c]">API base URL</span>
                  <p className="font-mono text-xs">
                    https://api-{env}.talentos.local
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#605e5c]">Region</span>
                  <p>ap-south-1 (seed)</p>
                </div>
                <div>
                  <span className="text-xs text-[#605e5c]">Notes</span>
                  <p className="text-xs text-[#605e5c]">
                    Placeholder environment wiring. Real endpoints will come from backend config.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title="Core service status (seed)">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Server className="h-4 w-4 text-[#0078d4]" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {svc.services?.map((s: any) => (
                <div
                  key={s.name}
                  className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-sm text-[#323130]"
                >
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-[#605e5c]">Status: {s.status}</p>
                </div>
              )) ?? (
                <p className="text-sm text-[#605e5c]">
                  No serviceStatus seed found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

