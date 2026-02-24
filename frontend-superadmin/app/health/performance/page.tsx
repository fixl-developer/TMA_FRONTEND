/**
 * Performance Metrics
 *
 * Monitor platform performance, latency, and throughput.
 */

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Zap, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"

interface PerformanceMetrics {
  timestamp: string
  apiLatency: {
    p50: number
    p95: number
    p99: number
    avg: number
  }
  throughput: {
    requestsPerSecond: number
    requestsPerMinute: number
  }
  errorRates: {
    http4xx: number
    http5xx: number
    total: number
  }
  database: {
    queryTime: number
    connectionPool: number
    slowQueries: number
  }
  cache: {
    hitRate: number
    missRate: number
    evictions: number
  }
  resources: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
  }
}

export default function PerformanceMetricsPage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/data/seed/performanceMetrics.json")
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return "text-emerald-600"
    if (value <= thresholds.warning) return "text-amber-600"
    return "text-rose-600"
  }

  return (
    <PageLayout>
      <PageHeader
        title="Performance Metrics"
        description="Monitor platform performance and resource utilization"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Zap className="h-3.5 w-3.5 text-violet-500" />
            Real-time Metrics
          </span>
        }
        actions={
          <Link
            href="/superadmin/health"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      {loading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-slate-500">Loading metrics...</p>
          </CardContent>
        </Card>
      ) : !metrics ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-slate-500">No metrics available</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <PageSection title="API Performance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Time Percentiles</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">API latency distribution</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">P50 (Median)</span>
                      <span className={`text-2xl font-bold ${getStatusColor(metrics.apiLatency.p50, { good: 100, warning: 200 })}`}>
                        {metrics.apiLatency.p50}ms
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">P95</span>
                      <span className={`text-2xl font-bold ${getStatusColor(metrics.apiLatency.p95, { good: 200, warning: 500 })}`}>
                        {metrics.apiLatency.p95}ms
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">P99</span>
                      <span className={`text-2xl font-bold ${getStatusColor(metrics.apiLatency.p99, { good: 500, warning: 1000 })}`}>
                        {metrics.apiLatency.p99}ms
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className="text-sm font-medium text-slate-700">Average</span>
                      <span className={`text-2xl font-bold ${getStatusColor(metrics.apiLatency.avg, { good: 150, warning: 300 })}`}>
                        {metrics.apiLatency.avg}ms
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Throughput</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Request volume</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Requests per Second</p>
                      <p className="text-4xl font-bold text-blue-600">
                        {metrics.throughput.requestsPerSecond}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs text-emerald-600">+12% from last hour</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Requests per Minute</p>
                      <p className="text-3xl font-bold text-violet-600">
                        {metrics.throughput.requestsPerMinute}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </PageSection>

          <PageSection title="Error rates">
            <Card>
              <CardHeader>
                <CardTitle>HTTP Error Distribution</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Last hour</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-sm text-amber-700 mb-2">4xx Errors (Client)</p>
                    <p className="text-3xl font-bold text-amber-600">{metrics.errorRates.http4xx}%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
                    <p className="text-sm text-rose-700 mb-2">5xx Errors (Server)</p>
                    <p className="text-3xl font-bold text-rose-600">{metrics.errorRates.http5xx}%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-sm text-slate-700 mb-2">Total Error Rate</p>
                    <p className="text-3xl font-bold text-slate-800">{metrics.errorRates.total}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Database performance">
            <Card>
              <CardHeader>
                <CardTitle>Database Metrics</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Query performance and connections</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Avg Query Time</p>
                    <p className={`text-3xl font-bold ${getStatusColor(metrics.database.queryTime, { good: 50, warning: 100 })}`}>
                      {metrics.database.queryTime}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Connection Pool</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {metrics.database.connectionPool}
                    </p>
                    <p className="text-xs text-slate-500">Active connections</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Slow Queries</p>
                    <p className="text-3xl font-bold text-amber-600">
                      {metrics.database.slowQueries}
                    </p>
                    <p className="text-xs text-slate-500">Last hour</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Cache performance">
            <Card>
              <CardHeader>
                <CardTitle>Cache Metrics</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Cache efficiency</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Hit Rate</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {metrics.cache.hitRate}%
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs text-emerald-600">Excellent</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Miss Rate</p>
                    <p className="text-3xl font-bold text-amber-600">
                      {metrics.cache.missRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Evictions</p>
                    <p className="text-3xl font-bold text-slate-700">
                      {metrics.cache.evictions}
                    </p>
                    <p className="text-xs text-slate-500">Last hour</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PageSection>

          <PageSection title="Resource utilization">
            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Current usage</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">CPU Usage</span>
                      <span className={`text-lg font-bold ${getStatusColor(metrics.resources.cpuUsage, { good: 60, warning: 80 })}`}>
                        {metrics.resources.cpuUsage}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          metrics.resources.cpuUsage <= 60 ? "bg-emerald-500" :
                          metrics.resources.cpuUsage <= 80 ? "bg-amber-500" :
                          "bg-rose-500"
                        }`}
                        style={{ width: `${metrics.resources.cpuUsage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Memory Usage</span>
                      <span className={`text-lg font-bold ${getStatusColor(metrics.resources.memoryUsage, { good: 70, warning: 85 })}`}>
                        {metrics.resources.memoryUsage}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          metrics.resources.memoryUsage <= 70 ? "bg-emerald-500" :
                          metrics.resources.memoryUsage <= 85 ? "bg-amber-500" :
                          "bg-rose-500"
                        }`}
                        style={{ width: `${metrics.resources.memoryUsage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Disk Usage</span>
                      <span className={`text-lg font-bold ${getStatusColor(metrics.resources.diskUsage, { good: 70, warning: 85 })}`}>
                        {metrics.resources.diskUsage}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          metrics.resources.diskUsage <= 70 ? "bg-emerald-500" :
                          metrics.resources.diskUsage <= 85 ? "bg-amber-500" :
                          "bg-rose-500"
                        }`}
                        style={{ width: `${metrics.resources.diskUsage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PageSection>
        </>
      )}
    </PageLayout>
  )
}
