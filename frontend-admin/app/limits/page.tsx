import Link from "next/link"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { tenantSettings } from "@/data/seed"

export default function LimitsPage() {
  const limits = (tenantSettings as { limits: { maxUsers: number; maxStorage: number; maxApiCalls: number } }).limits

  const usage = [
    { name: "Users", used: 24, max: limits.maxUsers, unit: "" },
    { name: "Storage", used: 2.1, max: limits.maxStorage / 1073741824, unit: "GB" },
    { name: "API calls", used: 4500, max: limits.maxApiCalls, unit: "/month" },
  ]

  return (
    <PageLayout>
      <PageBanner
        title="Limits"
        subtitle="Usage against your tenant limits. Stay within plan."
        variant="default"
      />
      <PageSection className="mt-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {usage.map((u) => {
            const pct = u.max > 0 ? Math.min(100, (u.used / u.max) * 100) : 0
            const usedStr = u.unit === "GB" ? `${u.used.toFixed(1)}` : u.used.toLocaleString()
            const maxStr = u.unit === "GB" ? `${u.max.toFixed(1)}` : u.max.toLocaleString()
            return (
              <Card key={u.name}>
                <CardHeader>
                  <CardTitle>{u.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-200">
                    {usedStr} / {maxStr} {u.unit}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${pct > 95 ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{pct.toFixed(0)}% used</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </PageSection>
      <p className="text-sm text-slate-400">
        Need higher limits? <Link href="/settings" className="text-amber-400 hover:underline">Contact support</Link>.
      </p>
    </PageLayout>
  )
}
