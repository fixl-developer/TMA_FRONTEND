"use client"

import { Settings, Globe2, Shield, CreditCard } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import platformConfig from "@/data/seed/platformConfig.json"

type PlatformConfig = typeof platformConfig

export default function GlobalConfigPage() {
  const cfg = platformConfig as PlatformConfig
  const totalKeys =
    Object.values(cfg).flat().length

  return (
    <PageLayout>
      <PageHeader
        title="Global configuration"
        description="Platform-wide settings for naming, limits, payments, and security. Seed-only view of platformConfig.json."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Settings className="h-3.5 w-3.5 text-[#0078d4]" />
            Config
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Config keys</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {totalKeys}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Across general, limits, payments, security.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Platform name</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#323130]">
                {cfg.general.find((x) => x.key === "platform_name")?.value ?? "—"}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                From platformConfig.json
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#0078d4]" />
                Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#323130]">
                Max pageants:{" "}
                <span className="font-mono">
                  {cfg.limits.find((x) => x.key === "max_pageants_per_tenant")?.value ?? "—"}
                </span>
              </p>
              <p className="text-sm text-[#323130]">
                Max talents:{" "}
                <span className="font-mono">
                  {cfg.limits.find((x) => x.key === "max_talents_per_tenant")?.value ?? "—"}
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#0078d4]" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#323130]">
                Session timeout:{" "}
                <span className="font-mono">
                  {cfg.security.find((x) => x.key === "session_timeout_minutes")?.value ?? "—"} min
                </span>
              </p>
              <p className="text-sm text-[#323130]">
                MFA for admins:{" "}
                <span className="font-mono">
                  {cfg.security.find((x) => x.key === "mfa_required_for_admins")?.value ?? "false"}
                </span>
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Configuration keys">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Globe2 className="h-4 w-4 text-[#0078d4]" />
                General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#323130]">
              {cfg.general.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                >
                  <div>
                    <p className="font-mono text-xs text-[#323130]">{item.key}</p>
                    <p className="text-[11px] text-[#605e5c]">{item.description}</p>
                  </div>
                  <span className="shrink-0 font-medium text-[#323130]">
                    {String(item.value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Globe2 className="h-4 w-4 text-[#0078d4]" />
                Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#323130]">
              {cfg.limits.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                >
                  <div>
                    <p className="font-mono text-xs text-[#323130]">{item.key}</p>
                    <p className="text-[11px] text-[#605e5c]">{item.description}</p>
                  </div>
                  <span className="shrink-0 font-medium text-[#323130]">
                    {String(item.value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="h-4 w-4 text-[#0078d4]" />
                Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#323130]">
              {cfg.payments.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                >
                  <div>
                    <p className="font-mono text-xs text-[#323130]">{item.key}</p>
                    <p className="text-[11px] text-[#605e5c]">{item.description}</p>
                  </div>
                  <span className="shrink-0 font-medium text-[#323130]">
                    {String(item.value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}

