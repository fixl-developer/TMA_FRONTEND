/**
 * Service Status
 *
 * Detailed status monitoring for all platform services.
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Server, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"

interface Service {
  id: string
  name: string
  category: string
  status: "operational" | "degraded" | "down" | "maintenance"
  uptime: number
  uptimeDays: number
  lastCheck: string
  responseTime: number
  errorRate: number
  version: string
  region: string
  dependencies: string[]
  healthChecks: Array<{
    name: string
    status: "pass" | "fail"
    lastRun: string
  }>
}

export default function ServiceStatusPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    fetch("/data/seed/services.json")
      .then((res) => res.json())
      .then((data) => {
        setServices(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "degraded": return "bg-amber-100 text-amber-700 border-amber-200"
      case "down": return "bg-rose-100 text-rose-700 border-rose-200"
      case "maintenance": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      case "degraded": return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "down": return <XCircle className="h-5 w-5 text-rose-600" />
      case "maintenance": return <RefreshCw className="h-5 w-5 text-blue-600" />
      default: return <Server className="h-5 w-5 text-slate-600" />
    }
  }

  const categories = ["all", ...Array.from(new Set(services.map(s => s.category)))]
  const filteredServices = categoryFilter === "all" 
    ? services 
    : services.filter(s => s.category === categoryFilter)

  return (
    <PageLayout>
      <PageHeader
        title="Service Status"
        description="Monitor all platform services and dependencies"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Server className="h-3.5 w-3.5 text-blue-500" />
            {services.length} Services
          </span>
        }
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link
              href="/superadmin/health"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        }
      />

      <PageSection title="Filter by category">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat === "all" ? "All Services" : cat}
              {cat !== "all" && (
                <span className="ml-2 text-xs opacity-75">
                  ({services.filter(s => s.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </PageSection>

      <PageSection title="Services">
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">Loading services...</p>
            </CardContent>
          </Card>
        ) : filteredServices.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-500">No services found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">{service.category}</Badge>
                          <Badge variant="outline" className="text-xs">{service.version}</Badge>
                          <Badge variant="outline" className="text-xs">{service.region}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Uptime</p>
                      <p className="text-xl font-bold text-emerald-600">{service.uptime}%</p>
                      <p className="text-xs text-slate-500">{service.uptimeDays} days</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Response Time</p>
                      <p className="text-xl font-bold text-blue-600">{service.responseTime}ms</p>
                      <p className="text-xs text-slate-500">Average</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Error Rate</p>
                      <p className="text-xl font-bold text-amber-600">{service.errorRate}%</p>
                      <p className="text-xs text-slate-500">Last hour</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Last Check</p>
                      <p className="text-sm font-medium text-slate-700">
                        {new Date(service.lastCheck).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(service.lastCheck).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {service.dependencies.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-2">Dependencies</p>
                      <div className="flex flex-wrap gap-1">
                        {service.dependencies.map((dep, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Health Checks</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {service.healthChecks.map((check, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded border text-xs ${
                            check.status === "pass"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-rose-50 border-rose-200 text-rose-700"
                          }`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            {check.status === "pass" ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            <span className="font-medium">{check.name}</span>
                          </div>
                          <p className="text-[10px] opacity-75">
                            {new Date(check.lastRun).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Service ID: {service.id}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Logs
                      </Button>
                      <Button size="sm" variant="outline">
                        View Metrics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection title="Service summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Operational</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">
                {services.filter(s => s.status === "operational").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Degraded</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600">
                {services.filter(s => s.status === "degraded").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Down</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-rose-600">
                {services.filter(s => s.status === "down").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {services.filter(s => s.status === "maintenance").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}
