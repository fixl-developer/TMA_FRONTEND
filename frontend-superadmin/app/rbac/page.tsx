/**
 * RBAC Dashboard
 *
 * Role-Based Access Control overview and management.
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, Users, Lock, FileText, Activity, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"

interface RBACStats {
  totalRoles: number
  totalPermissions: number
  totalPolicies: number
  activeUsers: number
  recentChanges: number
  blueprintCoverage: number
}

interface RecentActivity {
  id: string
  action: string
  user: string
  role: string
  timestamp: string
  type: "role_assigned" | "permission_changed" | "policy_updated"
}

export default function RBACDashboard() {
  const [stats, setStats] = useState<RBACStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/data/seed/rbacStats.json").then(res => res.json()),
      fetch("/data/seed/rbacActivity.json").then(res => res.json())
    ]).then(([statsData, activityData]) => {
      setStats(statsData)
      setActivities(activityData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "role_assigned": return <Users className="h-4 w-4 text-[#0078d4]" />
      case "permission_changed": return <Lock className="h-4 w-4 text-[#ffb900]" />
      case "policy_updated": return <FileText className="h-4 w-4 text-[#107c10]" />
      default: return <Activity className="h-4 w-4 text-[#605e5c]" />
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Role & Permission Management"
        description="Manage roles, permissions, and access control policies"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Shield className="h-3.5 w-3.5 text-[#0078d4]" />
            RBAC Dashboard
          </span>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-5 w-5 text-[#0078d4]" />
                Total Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#0078d4]">
                {loading ? "—" : stats?.totalRoles ?? 0}
              </p>
              <p className="text-xs text-[#605e5c] mt-1">Across all blueprints</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Lock className="h-5 w-5 text-[#107c10]" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#107c10]">
                {loading ? "—" : stats?.totalPermissions ?? 0}
              </p>
              <p className="text-xs text-[#605e5c] mt-1">Unique permissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-5 w-5 text-[#5c2d91]" />
                Active Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#5c2d91]">
                {loading ? "—" : stats?.totalPolicies ?? 0}
              </p>
              <p className="text-xs text-[#605e5c] mt-1">Policy definitions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Activity className="h-5 w-5 text-[#ffb900]" />
                Recent Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ffb900]">
                {loading ? "—" : stats?.recentChanges ?? 0}
              </p>
              <p className="text-xs text-[#605e5c] mt-1">Last 7 days</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PageSection title="Recent activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">RBAC Changes</CardTitle>
              <p className="text-xs text-[#605e5c] mt-1">Latest role and permission updates</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-xs text-[#605e5c]">Loading...</p>
              ) : activities.length === 0 ? (
                <p className="text-xs text-[#605e5c]">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {activities.slice(0, 8).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded border border-[#edebe9] hover:border-[#0078d4] transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#323130] font-medium">{activity.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#605e5c]">{activity.user}</span>
                          <span className="text-xs text-[#a19f9d]">•</span>
                          <Badge variant="outline" className="text-xs">{activity.role}</Badge>
                        </div>
                        <p className="text-xs text-[#a19f9d] mt-1">
                          {new Date(activity.timestamp).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Blueprint coverage">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Role Distribution</CardTitle>
              <p className="text-xs text-[#605e5c] mt-1">Roles defined per blueprint</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Pageant", roles: 12, color: "bg-[#e3008c]" },
                  { name: "Talent Agency", roles: 10, color: "bg-[#0078d4]" },
                  { name: "Casting", roles: 8, color: "bg-[#5c2d91]" },
                  { name: "Model Management", roles: 9, color: "bg-[#107c10]" },
                  { name: "Event Management", roles: 7, color: "bg-[#ffb900]" }
                ].map((blueprint) => (
                  <div key={blueprint.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#323130]">{blueprint.name}</span>
                      <span className="text-xs text-[#605e5c]">{blueprint.roles} roles</span>
                    </div>
                    <div className="h-2 bg-[#f3f2f1] rounded overflow-hidden">
                      <div
                        className={`h-full ${blueprint.color}`}
                        style={{ width: `${(blueprint.roles / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </div>

      <PageSection title="Quick actions">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/superadmin/rbac/matrix">
            <Card className="hover:border-[#0078d4] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#0078d4]" />
                  Permission Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#605e5c]">
                  Visualize role-permission mappings
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/superadmin/rbac/roles">
            <Card className="hover:border-[#0078d4] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#107c10]" />
                  Manage Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#605e5c]">
                  Create and edit role definitions
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/superadmin/rbac/policies">
            <Card className="hover:border-[#0078d4] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#5c2d91]" />
                  Policy Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#605e5c]">
                  Define access control policies
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/superadmin/rbac/audit">
            <Card className="hover:border-[#0078d4] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#ffb900]" />
                  Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#605e5c]">
                  Track RBAC changes and access
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}
