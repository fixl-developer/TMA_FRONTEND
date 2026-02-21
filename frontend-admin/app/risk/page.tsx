import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { tenantRisk } from "@/data/seed"

export default function RiskPage() {
  const risk = tenantRisk as {
    riskLevel: string
    score: number
    factors: Array<{ name: string; count?: number; status: string; usagePercent?: number }>
    lastUpdated: string
  }

  const levelColor =
    risk.riskLevel === "low"
      ? "text-emerald-400 bg-emerald-500/20"
      : risk.riskLevel === "medium"
      ? "text-amber-400 bg-amber-500/20"
      : "text-red-400 bg-red-500/20"

  return (
    <PageLayout>
      <PageBanner
        title="Risk View"
        subtitle="Tenant risk assessment and factors. Stay ahead."
        variant="default"
      />
      <PageSection className="mt-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Risk summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${levelColor}`}>
                  {risk.riskLevel}
                </span>
                <div>
                  <p className="text-xs text-slate-400">Risk score</p>
                  <p className="text-lg font-bold text-slate-200">{(risk.score * 100).toFixed(1)}%</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400">Last updated: {new Date(risk.lastUpdated).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Risk factors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {risk.factors.map((f) => (
                  <li key={f.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{f.name}</span>
                    <span className="text-xs text-slate-400">
                      {f.count !== undefined && `${f.count} `}
                      {f.usagePercent !== undefined && `${f.usagePercent}%`}
                      {f.status === "ok" && (f.count === undefined && f.usagePercent === undefined ? "OK" : "")}
                      {f.status === "ok" && (f.count !== undefined || f.usagePercent !== undefined) ? " OK" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
