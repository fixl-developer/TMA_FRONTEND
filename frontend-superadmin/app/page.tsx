/**
 * Home Page - Super Admin
 *
 * Cinematic Super Admin dashboard with sidebar-style layout,
 * simple charts and theme accents. Seed data only.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Sparkles, Users2, Flag, Activity, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Button } from "@/shared/components/ui/button"
import type { Pageant } from "@/shared/lib/types/pageants"
import type { Tenant } from "@/shared/lib/types/tenants"
import { getPageants } from "@/shared/services/pageantService"
import { getTenants } from "@/shared/services/tenantService"
import { getUsers } from "@/shared/services/userService"
import { getFeatureFlags } from "@/shared/services/featuresService"
import { seedTenants, seedTalents, seedBookings } from "@/data/seed"
import { RechartsBar } from "@/shared/components/charts/RechartsBar"
import { RechartsPie } from "@/shared/components/charts/RechartsPie"
import { RechartsArea } from "@/shared/components/charts/RechartsArea"

export default function Home() {
  const [pageants, setPageants] = useState<Pageant[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [flags, setFlags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [p, t, u, f] = await Promise.all([
          getPageants(),
          getTenants(),
          getUsers(),
          getFeatureFlags(),
        ])
        setPageants(p)
        setTenants(t)
        setUsers(u)
        setFlags(f)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const totalTenants = tenants.length
    const totalPageants = pageants.length
    const activePageants = pageants.filter((p) => p.status === "ACTIVE").length
    const draftPageants = pageants.filter((p) => p.status === "DRAFT").length

    const pageantsByTenant = pageants.reduce<Record<string, number>>((acc, p) => {
      acc[p.tenantId] = (acc[p.tenantId] || 0) + 1
      return acc
    }, {})

    const topTenants = tenants
      .map((t) => ({
        tenant: t,
        pageantCount: pageantsByTenant[t._id] || 0,
      }))
      .sort((a, b) => b.pageantCount - a.pageantCount)
      .slice(0, 3)

    const recentPageants = [...pageants].slice(0, 3)

    const modelingAgencyTenants = (seedTenants as any[]).filter(
      (t) => t.agencyType === "MODELING_AGENCY"
    )
    const modelingAgencyIds = modelingAgencyTenants.map((t) => t._id)
    const modelingAgencyTalents = (seedTalents as any[]).filter((t) =>
      modelingAgencyIds.includes(t.tenantId)
    )
    const modelingAgencyBookings = (seedBookings as any[]).filter((b) =>
      modelingAgencyIds.includes(b.tenantId)
    )

    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "ACTIVE").length
    const enabledFlags = flags.filter((f) => f.enabled).length

    return {
      totalTenants,
      totalPageants,
      activePageants,
      draftPageants,
      topTenants,
      recentPageants,
      modelingAgencyCount: modelingAgencyTenants.length,
      modelingAgencyTalents: modelingAgencyTalents.length,
      modelingAgencyBookings: modelingAgencyBookings.length,
      totalUsers,
      activeUsers,
      totalFlags: flags.length,
      enabledFlags,
    }
  }, [pageants, tenants, users, flags])

  const pageantStatusCounts = useMemo(() => {
    const statuses: Pageant["status"][] = ["ACTIVE", "DRAFT", "COMPLETED", "ARCHIVED"]
    return statuses.map((status) => ({
      status,
      value: pageants.filter((p) => p.status === status).length,
    }))
  }, [pageants])

  const tenantTypeCounts = useMemo(() => {
    const map = tenants.reduce<Record<string, number>>((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1
      return acc
    }, {})
    return map
  }, [tenants])

  // Synthetic monthly trend for Area chart (pageants + tenants growth)
  const monthlyTrendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const basePageants = Math.max(0, pageants.length - 3)
    const baseTenants = Math.max(0, tenants.length - 2)
    return months.map((label, i) => ({
      label,
      value: basePageants + i * 2 + (baseTenants + i),
    }))
  }, [pageants.length, tenants.length])

  return (
    <PageLayout>
      <PageHeader
        title="Dashboard"
        description="High-level view of tenants, pageants, users and features. Powered by seed data for Phase 1."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#e1e1e1] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Sparkles className="h-3.5 w-3.5 text-[#0078d4]" />
            Phase 1
          </span>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/tenants">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Users2 className="h-4 w-4" />
                Tenants
              </Button>
            </Link>
            <Link href="/users">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Users2 className="h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Flag className="h-4 w-4" />
                Features
              </Button>
            </Link>
          </div>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Active tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {loading ? "—" : metrics.totalTenants}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Agencies, pageant orgs, brands & event orgs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active pageants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">
                {loading ? "—" : metrics.activePageants}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Currently visible to talents in tenant frontends.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Draft blueprints</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#ffb900]">
                {loading ? "—" : metrics.draftPageants}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Pageant processes being modelled in the builder.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total pageants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#0078d4]">
                {loading ? "—" : metrics.totalPageants}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                Sum of all seeded pageants across tenants.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Platform users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#8764b8]">
                {loading ? "—" : metrics.totalUsers}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                {metrics.activeUsers} active · Cross-tenant
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Feature flags</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#5c2d91]">
                {loading ? "—" : metrics.totalFlags}
              </p>
              <p className="mt-1 text-[11px] text-[#605e5c]">
                {metrics.enabledFlags} enabled
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Quick actions">
        <div className="flex flex-wrap gap-3">
          <Link href="/tenants">
            <Button variant="outline" className="gap-2">
              <Users2 className="h-4 w-4" />
              Manage tenants
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/pageants">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              View pageants
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/users">
            <Button variant="outline" className="gap-2">
              <Users2 className="h-4 w-4" />
              User directory
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/features">
            <Button variant="outline" className="gap-2">
              <Flag className="h-4 w-4" />
              Feature flags
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="gap-2">
              <Activity className="h-4 w-4" />
              Search
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </PageSection>

      <PageSection title="Platform health (SLO)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-[#c7e0f4] bg-[#f3f9fd]">
            <CardHeader>
              <CardTitle className="text-sm text-[#004578]">API latency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#0078d4]">142 ms</p>
              <p className="mt-1 text-[11px] text-[#004578]">p95 &lt; 300ms ✓</p>
            </CardContent>
          </Card>
          <Card className="border-[#c7e0f4] bg-[#f3f9fd]">
            <CardHeader>
              <CardTitle className="text-sm text-[#004578]">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#0078d4]">99.97%</p>
              <p className="mt-1 text-[11px] text-[#004578]">Last 30 days</p>
            </CardContent>
          </Card>
          <Card className="border-[#c7e0f4] bg-[#f3f9fd]">
            <CardHeader>
              <CardTitle className="text-sm text-[#004578]">Error rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#0078d4]">0.02%</p>
              <p className="mt-1 text-[11px] text-[#004578]">Target &lt; 0.1%</p>
            </CardContent>
          </Card>
          <Card className="border-[#c7e0f4] bg-[#f3f9fd]">
            <CardHeader>
              <CardTitle className="text-sm text-[#004578]">Queue depth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#0078d4]">12</p>
              <p className="mt-1 text-[11px] text-[#004578]">Background jobs</p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {!loading && metrics.modelingAgencyCount > 0 && (
        <PageSection title="Modeling agencies (B1)">
            <Card className="border-[#c7e0f4] bg-gradient-to-br from-[#f3f9fd] to-white">
              <CardHeader>
                <CardTitle className="text-[#004578]">Modeling Agencies (B1)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#605e5c]">
                      Agencies
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0078d4]">
                      {metrics.modelingAgencyCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#605e5c]">
                      Talents
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0078d4]">
                      {metrics.modelingAgencyTalents}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#605e5c]">
                      Bookings
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#0078d4]">
                      {metrics.modelingAgencyBookings}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-[#605e5c]">
                  Modeling agencies use B1 (Roster + Booking) blueprint.
                </p>
              </CardContent>
            </Card>
        </PageSection>
      )}

      <PageSection title="Charts">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Pageant status overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-[#605e5c]">
              {loading ? (
                <p className="text-[#605e5c]">Loading from seed…</p>
              ) : (
                <>
                  <RechartsBar
                    data={pageantStatusCounts.map((entry) => ({
                      label:
                        entry.status === "ACTIVE"
                          ? "Active"
                          : entry.status === "DRAFT"
                          ? "Draft"
                          : entry.status === "COMPLETED"
                          ? "Completed"
                          : "Archived",
                      value: entry.value,
                    }))}
                  />
                  <p className="mt-1 text-[10px] text-[#605e5c]">
                    Simple seed-driven chart of pageants by status. In a real
                    system this would be time-series aware.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tenant mix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-[#605e5c]">
              {loading ? (
                <p className="text-[#605e5c]">Loading from seed…</p>
              ) : (
                <>
                  <RechartsPie
                    data={Object.entries(tenantTypeCounts).map(
                      ([type, value]) => ({
                        label:
                          type === "AGENCY"
                            ? "Agencies"
                            : type === "PAGEANT_ORG"
                            ? "Pageant orgs"
                            : type === "EVENT_ORG"
                            ? "Event orgs"
                            : type === "BRAND"
                            ? "Brands"
                            : "Platform internal",
                        value,
                      })
                    )}
                  />
                  <p className="mt-1 text-[10px] text-[#605e5c]">
                    Quick snapshot of tenant composition based on seed data.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection title="Activity trend">
        <Card>
            <CardHeader>
              <CardTitle>Platform activity trend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-[#605e5c]">
              {loading ? (
                <p className="text-[#605e5c]">Loading…</p>
              ) : (
                <>
                  <RechartsArea data={monthlyTrendData} />
                  <p className="mt-1 text-[10px] text-[#605e5c]">
                    Synthetic trend based on seed data. Real system would show
                    pageants and tenants over time.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
      </PageSection>

      <PageSection title="Recent activity">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Recent pageants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[11px] text-[#605e5c]">
              {loading ? (
                <p className="text-[#605e5c]">Loading from seed…</p>
              ) : metrics.recentPageants.length === 0 ? (
                <p className="text-[#605e5c]">
                  No pageants in the current seed. Populate{" "}
                  <code className="rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[10px] text-[#323130]">
                    data/seed/pageants.json
                  </code>{" "}
                  to see them here.
                </p>
              ) : (
                <ul className="divide-y divide-[#e1e1e1]">
                  {metrics.recentPageants.map((p) => (
                    <li key={p._id} className="py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="text-[12px] font-semibold text-[#323130]">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-[#605e5c]">
                            Tenant{" "}
                            <span className="font-mono text-[#323130]">
                              {p.tenantId}
                            </span>
                          </p>
                        </div>
                        <span className="rounded border border-[#e1e1e1] bg-[#f3f2f1] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#323130]">
                          {p.status.toLowerCase()}
                        </span>
                      </div>
                      {p.description && (
                        <p className="mt-1.5 line-clamp-2 text-[11px] text-[#605e5c]">
                          {p.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tenants by pageant activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[11px] text-[#605e5c]">
              {loading ? (
                <p className="text-[#605e5c]">Loading from seed…</p>
              ) : metrics.topTenants.length === 0 ? (
                <p className="text-[#605e5c]">
                  No tenants in the current seed. Update{" "}
                  <code className="rounded bg-[#f3f2f1] px-1.5 py-0.5 text-[10px] text-[#323130]">
                    data/seed/tenants.json
                  </code>{" "}
                  to see distribution.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {metrics.topTenants.map(({ tenant, pageantCount }) => (
                    <li
                      key={tenant._id}
                      className="flex items-center justify-between gap-2 rounded border border-[#e1e1e1] bg-[#faf9f8] px-3 py-2"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-semibold text-[#323130]">
                          {tenant.name}
                        </p>
                        <p className="text-[11px] text-[#605e5c]">
                          {tenant.type.toLowerCase()} ·{" "}
                          <span className="font-mono text-[#323130]">
                            {tenant.slug}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-semibold text-[#0078d4]">
                          {pageantCount}
                        </p>
                        <p className="text-[10px] text-[#605e5c]">
                          pageants in seed
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
