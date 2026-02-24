/**
 * System Health Dashboard
 *
 * Monitor platform health, services, and performance metrics.
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Activity, Server, Zap, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"

interface HealthOverview {
  overallStatus: "healthy" | "degraded" | "critical"
  uptime: number
  activeIncidents: number
  servicesHealthy: number
  servicesTotal: number
  avgResponseTime: number
  errorRate: number
}

interface ServiceStatus {
  name: string
  status: "operational" | "degraded" | "down"
  uptime: number
  lastCheck: string
  responseTime: number
}

export default function SystemHealthDashboard() {
  const [overview, setOverview] = useState<HealthOverview | null>(null)
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/data/seed/healthOverview.json").then(res => res.json()),
      fetch("/data/seed/serviceStatus.json").then(res => res.json())
    ]).then(([overviewData, servicesData]) => {
      setOverview(overviewData)
      setServices(servicesData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational": return "bg-[#107c10] text-white border-[#107c10]"
      case "degraded": return "bg-[#ffb900] text-[#323130] border-[#ffb900]"
      case "critical":
      case "down": return "bg-[#d13438] text-white border-[#d13438]"
      default: return "bg-[#605e5c] text-white border-[#605e5c]"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "operational": return <CheckCircle2 className="h-5 w-5 text-[#107c10]" />
      case "degraded": return <AlertTriangle className="h-5 w-5 text-[#ffb900]" />
      case "critical":
      case "down": return <XCircle className="h-5 w-5 text-[#d13438]" />
      default: return <Activity className="h-5 w-5 text-[#605e5c]" />
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="System Health Monitoring"
        description="Monitor platform health, services, and performance"
        badge={
          overview && (
            <span className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium ${getStatusColor(overview.overallStatus)}`}>
              {getStatusIcon(overview.overallStatus)}
              {overview.overallStatus.toUpperCase()}
            </span>
          )
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-[#0078d4]" />
                Platform Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#0078d4]">
                {loading ? "—" : overview?.uptime ? `${overview.uptime}%` : "99.9%"}
              </p>
              <p className="text-sm text-[#605e5c] mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="h-5 w-5 text-[#107c10]" />
                Services Healthy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#107c10]">
                {loading ? "—" : overview?.servicesHealthy && overview?.servicesTotal ? `${overview.servicesHealthy}/${overview.servicesTotal}` : "12/12"}
              </p>
              <p className="text-sm text-[#605e5c] mt-1">All services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-[#8661c5]" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#8661c5]">
                {loading ? "—" : overview?.avgResponseTime ? `${overview.avgResponseTime}ms` : "45ms"}
              </p>
              <p className="text-sm text-[#605e5c] mt-1">API endpoints</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-[#ffb900]" />
                Active Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ffb900]">
                {loading ? "—" : overview?.activeIncidents ?? 0}
              </p>
              <p className="text-sm text-[#605e5c] mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Service status">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Core Services</CardTitle>
                <p className="text-sm text-[#605e5c] mt-1">Real-time service health monitoring</p>
              </div>
              <Link
                href="/superadmin/health/services"
                className="text-sm text-[#0078d4] hover:text-[#106ebe] font-medium"
              >
                View All →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-[#605e5c]">Loading services...</p>
            ) : services.length === 0 ? (
              <p className="text-sm text-[#605e5c]">No services found</p>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-4 rounded border border-[#edebe9] hover:border-[#0078d4] hover:bg-[#f3f2f1] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium text-[#323130]">{service.name}</p>
                        <p className="text-xs text-[#605e5c]">
                          Last checked: {new Date(service.lastCheck).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#323130]">{service.uptime}% uptime</p>
                        <p className="text-xs text-[#605e5c]">{service.responseTime}ms response</p>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Quick actions">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/superadmin/health/services">
            <Card className="hover:border-[#0078d4] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="h-4 w-4 text-[#0078d4]" />
                  Service Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#605e5c]">
                  Monitor all platform services
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/superadmin/health/performance">
            <Card className="hover:border-[#0078d4] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#8661c5]" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#605e5c]">
                  View performance metrics
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/superadmin/health/incidents">
            <Card className="hover:border-[#0078d4] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-[#ffb900]" />
                  Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#605e5c]">
                  Manage active incidents
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/superadmin/health/alerts">
            <Card className="hover:border-[#0078d4] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#107c10]" />
                  Alert Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#605e5c]">
                  Configure alert thresholds
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  )
}
