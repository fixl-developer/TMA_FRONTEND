\"use client\"

import { useEffect, useMemo, useState } from \"react\"
import { Activity, Clock, Rocket, Users2 } from \"lucide-react\"
import { PageLayout, PageHeader, PageSection } from \"@/shared/components/layout/PageLayout\"
import { Card, CardContent, CardHeader, CardTitle } from \"@/shared/components/ui/card\"
import { getTenants } from \"@/shared/services/tenantService\"
import type { Tenant } from \"@/shared/lib/types/tenants\"

type OnboardingStage =
  | \"Information\"
  | \"Template\"
  | \"Blueprints\"
  | \"Verification\"
  | \"Deployment\"
  | \"Complete\"

interface OnboardingRow {
  tenant: Tenant
  stage: OnboardingStage
  completion: number
  hasBlueprints: boolean
}

export default function OnboardingProgressPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const t = await getTenants()
        setTenants(t)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const rows = useMemo<OnboardingRow[]>(() => {
    return tenants.map((t) => {
      const hasBlueprints = Array.isArray(t.blueprints) && t.blueprints.length > 0
      let stage: OnboardingStage = \"Information\"
      let completion = 10

      if (t.status === \"PENDING\" && !hasBlueprints) {
        stage = \"Template\"
        completion = 30
      } else if (t.status === \"PENDING\" && hasBlueprints) {
        stage = \"Blueprints\"
        completion = 50
      } else if (t.status === \"ACTIVE\" && !hasBlueprints) {
        stage = \"Verification\"
        completion = 70
      } else if (t.status === \"ACTIVE\" && hasBlueprints) {
        stage = \"Complete\"
        completion = 100
      }

      return {
        tenant: t,
        stage,
        completion,
        hasBlueprints,
      }
    })
  }, [tenants])

  const metrics = useMemo(() => {
    const total = rows.length
    const complete = rows.filter((r) => r.stage === \"Complete\").length
    const inProgress = rows.filter((r) => r.stage !== \"Complete\").length
    const avgCompletion = total
      ? Math.round(rows.reduce((acc, r) => acc + r.completion, 0) / total)
      : 0

    return { total, complete, inProgress, avgCompletion }
  }, [rows])

  return (
    <PageLayout>
      <PageHeader
        title=\"Tenant onboarding progress\"
        description=\"Track where each tenant is in the onboarding journey – from information capture through blueprint deployment.\"
        badge={
          <span className=\"inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]\">
            <Activity className=\"h-3.5 w-3.5 text-[#0078d4]\" />
            Progress
          </span>
        }
      />

      <PageSection title=\"Overview\">
        <div className=\"grid gap-4 md:grid-cols-4\">
          <Card>
            <CardHeader>
              <CardTitle className=\"text-sm font-semibold\">Onboarding tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=\"text-3xl font-semibold text-[#323130]\">
                {loading ? \"—\" : metrics.total}
              </p>
              <p className=\"mt-1 text-xs text-[#605e5c]\">
                Tenants considered in this environment.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className=\"text-sm font-semibold\">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=\"text-3xl font-semibold text-[#107c10]\">
                {loading ? \"—\" : metrics.complete}
              </p>
              <p className=\"mt-1 text-xs text-[#605e5c]\">
                ACTIVE tenants with blueprint assignments.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className=\"text-sm font-semibold\">In progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=\"text-3xl font-semibold text-[#0078d4]\">
                {loading ? \"—\" : metrics.inProgress}
              </p>
              <p className=\"mt-1 text-xs text-[#605e5c]\">
                Pending or partially configured tenants.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className=\"text-sm font-semibold\">Average completion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=\"text-3xl font-semibold text-[#323130]\">
                {loading ? \"—\" : `${metrics.avgCompletion}%`}
              </p>
              <p className=\"mt-1 text-xs text-[#605e5c]\">
                Simple heuristic based on status + blueprints.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title=\"Tenant-level progress\">
        <Card>
          <CardHeader>
            <CardTitle className=\"text-sm font-semibold\">Onboarding pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className=\"py-8 text-sm text-[#605e5c]\">Loading tenants…</p>
            ) : rows.length === 0 ? (
              <p className=\"py-8 text-sm text-[#605e5c]\">
                No tenants found in the current seed. Update <code className=\"rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[11px]\">data/seed/tenants.json</code> to explore onboarding scenarios.
              </p>
            ) : (
              <div className=\"overflow-x-auto rounded border border-[#edebe9]\">
                <table className=\"w-full text-left text-sm\">
                  <thead className=\"border-b border-[#edebe9] bg-[#faf9f8]\">
                    <tr>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">Tenant</th>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">Status</th>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">Onboarding stage</th>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.tenant._id} className=\"border-b border-[#edebe9] hover:bg-[#faf9f8]\">
                        <td className=\"px-4 py-3 align-top\">
                          <p className=\"text-sm font-medium text-[#323130]\">{row.tenant.name}</p>
                          <p className=\"text-xs text-[#605e5c]\">
                            <span className=\"font-mono\">{row.tenant._id}</span> · {row.tenant.slug}
                          </p>
                        </td>
                        <td className=\"px-4 py-3 align-top\">
                          <span
                            className={
                              row.tenant.status === \"ACTIVE\"
                                ? \"inline-flex items-center gap-1 rounded border border-[#107c10] bg-[#dff6dd] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#107c10]\"
                                : \"inline-flex items-center gap-1 rounded border border-[#ffb900] bg-[#fff4ce] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#797673]\"
                            }
                          >
                            <Users2 className=\"h-3 w-3\" />
                            {row.tenant.status.toLowerCase()}
                          </span>
                        </td>
                        <td className=\"px-4 py-3 align-top\">
                          <div className=\"flex items-center gap-2 text-xs text-[#323130]\">
                            {row.stage === \"Complete\" ? (
                              <Rocket className=\"h-3.5 w-3.5 text-[#107c10]\" />
                            ) : (
                              <Clock className=\"h-3.5 w-3.5 text-[#605e5c]\" />
                            )}
                            <span>{row.stage}</span>
                          </div>
                          <p className=\"mt-1 text-[11px] text-[#605e5c]\">
                            {row.hasBlueprints
                              ? \"Blueprints configured\"
                              : \"No blueprints assigned yet\"}
                          </p>
                        </td>
                        <td className=\"px-4 py-3 align-top\">
                          <div className=\"w-32\">
                            <div className=\"h-2 w-full rounded-full bg-[#edebe9]\">
                              <div
                                className=\"h-2 rounded-full bg-[#0078d4]\"
                                style={{ width: `${row.completion}%` }}
                              />
                            </div>
                            <p className=\"mt-1 text-xs text-[#323130]\">{row.completion}%</p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

