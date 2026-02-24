\"use client\"

import { useEffect, useMemo, useState } from \"react\"
import { CheckCircle2, ShieldCheck, ShieldQuestion, Users2 } from \"lucide-react\"
import { PageLayout, PageHeader, PageSection } from \"@/shared/components/layout/PageLayout\"
import { Card, CardContent, CardHeader, CardTitle } from \"@/shared/components/ui/card\"
import { getTenants } from \"@/shared/services/tenantService\"
import type { Tenant } from \"@/shared/lib/types/tenants\"

type CheckKey = \"kyc\" | \"documents\" | \"payments\" | \"compliance\"

interface VerificationRow {
  tenant: Tenant
  checks: Record<CheckKey, \"PASSED\" | \"PENDING\">
}

export default function OnboardingVerificationPage() {
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

  const rows = useMemo<VerificationRow[]>(() => {
    return tenants.map((t) => {
      // Simple demo heuristic: ACTIVE tenants are fully verified,
      // PENDING tenants have KYC done but payments/compliance pending.
      const isActive = t.status === \"ACTIVE\"
      const checks: Record<CheckKey, \"PASSED\" | \"PENDING\"> = {
        kyc: isActive || t.status === \"PENDING\" ? \"PASSED\" : \"PENDING\",
        documents: isActive ? \"PASSED\" : \"PENDING\",
        payments: isActive ? \"PASSED\" : \"PENDING\",
        compliance: isActive ? \"PASSED\" : \"PENDING\",
      }
      return { tenant: t, checks }
    })
  }, [tenants])

  const metrics = useMemo(() => {
    const total = rows.length
    const fullyVerified = rows.filter((r) =>
      Object.values(r.checks).every((c) => c === \"PASSED\")
    ).length
    return { total, fullyVerified }
  }, [rows])

  return (
    <PageLayout>
      <PageHeader
        title=\"Onboarding verification\"
        description=\"High-level view of KYC, document, payment and compliance checks for each tenant. Seed-only heuristic for this phase.\"
        badge={
          <span className=\"inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]\">
            <ShieldCheck className=\"h-3.5 w-3.5 text-[#0078d4]\" />
            Verification
          </span>
        }
      />

      <PageSection title=\"Overview\">
        <div className=\"grid gap-4 md:grid-cols-2 lg:grid-cols-4\">
          <Card>
            <CardHeader>
              <CardTitle className=\"text-sm font-semibold\">Tenants in scope</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=\"text-3xl font-semibold text-[#323130]\">
                {loading ? \"—\" : metrics.total}
              </p>
              <p className=\"mt-1 text-xs text-[#605e5c]\">
                Loaded from seed via tenant service.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className=\"text-sm font-semibold\">Fully verified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=\"text-3xl font-semibold text-[#107c10]\">
                {loading ? \"—\" : metrics.fullyVerified}
              </p>
              <p className=\"mt-1 text-xs text-[#605e5c]\">
                All four checks passed (heuristic).
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title=\"Tenant verification matrix\">
        <Card>
          <CardHeader>
            <CardTitle className=\"text-sm font-semibold\">Checks by tenant</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className=\"py-8 text-sm text-[#605e5c]\">Loading tenants…</p>
            ) : rows.length === 0 ? (
              <p className=\"py-8 text-sm text-[#605e5c]\">
                No tenants found in the current seed. Update <code className=\"rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[11px]\">data/seed/tenants.json</code> to explore verification scenarios.
              </p>
            ) : (
              <div className=\"overflow-x-auto rounded border border-[#edebe9]\">
                <table className=\"w-full text-left text-sm\">
                  <thead className=\"border-b border-[#edebe9] bg-[#faf9f8]\">
                    <tr>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">Tenant</th>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">Status</th>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">KYC</th>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">Documents</th>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">Payments</th>
                      <th className=\"px-4 py-3 font-semibold text-[#323130]\">Compliance</th>
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
                        {([\"kyc\", \"documents\", \"payments\", \"compliance\"] as CheckKey[]).map(
                          (key) => {
                            const status = row.checks[key]
                            const passed = status === \"PASSED\"
                            return (
                              <td key={key} className=\"px-4 py-3 align-top\">
                                <span
                                  className={
                                    passed
                                      ? \"inline-flex items-center gap-1 rounded border border-[#107c10] bg-[#dff6dd] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#107c10]\"
                                      : \"inline-flex items-center gap-1 rounded border border-[#ffb900] bg-[#fff4ce] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#797673]\"
                                  }
                                >
                                  {passed ? (
                                    <CheckCircle2 className=\"h-3 w-3\" />
                                  ) : (
                                    <ShieldQuestion className=\"h-3 w-3\" />
                                  )}
                                  {passed ? \"Passed\" : \"Pending\"}
                                </span>
                              </td>
                            )
                          }
                        )}
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

