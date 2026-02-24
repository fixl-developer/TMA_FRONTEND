"use client"

import { useMemo } from "react"
import { GitBranch, Server } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import deployments from "@/data/seed/deployments.json"

type Deployment = (typeof deployments)[number]

export default function ConfigDeploymentsPage() {
  const rows = deployments as Deployment[]

  const metrics = useMemo(() => {
    const total = rows.length
    const prod = rows.filter((d) => d.environment === "production").length
    const staging = rows.filter((d) => d.environment === "staging").length
    const avgDuration = total
      ? Math.round(rows.reduce((acc, d) => acc + (d.duration || 0), 0) / total)
      : 0
    return { total, prod, staging, avgDuration }
  }, [rows])

  return (
    <PageLayout>
      <PageHeader
        title="Deployment history"
        description="Platform deployment history across environments. Seed-only view, matching Integrations → Infrastructure."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <GitBranch className="h-3.5 w-3.5 text-[#0078d4]" />
            Deployments
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Total deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {metrics.total}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Across all environments.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Production</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {metrics.prod}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Successful prod releases in seed.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Staging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {metrics.staging}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Staging deployments in seed.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Server className="h-4 w-4 text-[#0078d4]" />
                Avg duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {metrics.avgDuration}s
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">
                Mean deployment duration.
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Deployment log">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded border border-[#edebe9] bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#edebe9] bg-[#faf9f8]">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-[#323130]">Version</th>
                    <th className="px-4 py-3 font-semibold text-[#323130]">Environment</th>
                    <th className="px-4 py-3 font-semibold text-[#323130]">Deployed at</th>
                    <th className="px-4 py-3 font-semibold text-[#323130]">Duration</th>
                    <th className="px-4 py-3 font-semibold text-[#323130]">Status</th>
                    <th className="px-4 py-3 font-semibold text-[#323130]">Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d._id} className="border-b border-[#edebe9] hover:bg-[#faf9f8]">
                      <td className="px-4 py-3 font-medium text-[#323130]">
                        {d.version}
                      </td>
                      <td className="px-4 py-3 text-[#605e5c]">
                        {d.environment}
                      </td>
                      <td className="px-4 py-3 text-[#605e5c]">
                        {new Date(d.deployedAt).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-[#605e5c]">
                        {d.duration}s
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded border border-[#107c10] bg-[#dff6dd] px-2 py-0.5 text-xs font-medium text-[#107c10]">
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#605e5c]">
                        {d.changes?.join(" · ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

