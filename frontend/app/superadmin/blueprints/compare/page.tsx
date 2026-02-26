/**
 * Blueprint Comparison Page - Super Admin
 * 
 * Compare multiple blueprints side-by-side to help tenants choose the right one.
 * Compare: modules, workflows, roles, KPIs, adoption rates, etc.
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Package,
  Users,
  CheckCircle,
  X,
  Plus,
  Trash2
} from "lucide-react"
import {
  getBlueprints,
  compareBlueprints,
  type Blueprint,
  type BlueprintId
} from "@/shared/services/blueprintService"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select"

export default function BlueprintComparePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [selectedIds, setSelectedIds] = useState<BlueprintId[]>([])
  const [compareData, setCompareData] = useState<Blueprint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const blueprintsData = await getBlueprints()
        setBlueprints(blueprintsData.filter(bp => bp.status === "ACTIVE"))

        // Check URL params for pre-selected blueprints
        const idsParam = searchParams.get("ids")
        if (idsParam) {
          const ids = idsParam.split(",") as BlueprintId[]
          setSelectedIds(ids)
          const data = await compareBlueprints(ids)
          setCompareData(data)
        }
      } catch (e) {
        console.error("Failed to load blueprints", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchParams])

  const handleAddBlueprint = async (id: BlueprintId) => {
    if (selectedIds.includes(id) || selectedIds.length >= 4) return

    const newIds = [...selectedIds, id]
    setSelectedIds(newIds)
    const data = await compareBlueprints(newIds)
    setCompareData(data)

    // Update URL
    router.push(`/superadmin/blueprints/compare?ids=${newIds.join(",")}`)
  }

  const handleRemoveBlueprint = async (id: BlueprintId) => {
    const newIds = selectedIds.filter(selectedId => selectedId !== id)
    setSelectedIds(newIds)
    if (newIds.length > 0) {
      const data = await compareBlueprints(newIds)
      setCompareData(data)
      router.push(`/superadmin/blueprints/compare?ids=${newIds.join(",")}`)
    } else {
      setCompareData([])
      router.push("/superadmin/blueprints/compare")
    }
  }

  const availableBlueprints = blueprints.filter(
    bp => !selectedIds.includes(bp.id)
  )

  return (
    <PageLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/superadmin/blueprints/catalog")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>Compare Blueprints</span>
          </div>
        }
        description="Compare up to 4 blueprints side-by-side"
      />

      {/* Blueprint Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Select Blueprints to Compare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Select
              onValueChange={(value) => handleAddBlueprint(value as BlueprintId)}
              disabled={selectedIds.length >= 4}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Add blueprint..." />
              </SelectTrigger>
              <SelectContent>
                {availableBlueprints.map((bp) => (
                  <SelectItem key={bp.id} value={bp.id}>
                    {bp.id} - {bp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500">
              {selectedIds.length} of 4 selected
            </p>
          </div>

          {selectedIds.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {compareData.map((bp) => (
                <Badge
                  key={bp.id}
                  variant="outline"
                  className="flex items-center gap-2 bg-blue-50 px-3 py-1.5"
                >
                  <span className="font-mono text-xs">{bp.id}</span>
                  <span>{bp.name}</span>
                  <button
                    onClick={() => handleRemoveBlueprint(bp.id)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {compareData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-500">
              Select blueprints above to start comparing
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 pr-4 text-left font-medium text-slate-600">
                      Property
                    </th>
                    {compareData.map((bp) => (
                      <th
                        key={bp.id}
                        className="pb-3 px-4 text-left font-medium text-slate-600"
                      >
                        <div>
                          <span className="font-mono text-xs">{bp.id}</span>
                          <p className="mt-1 font-semibold">{bp.name}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-600">Category</td>
                    {compareData.map((bp) => (
                      <td key={bp.id} className="py-3 px-4">
                        <Badge variant="outline">{bp.category}</Badge>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-600">Status</td>
                    {compareData.map((bp) => (
                      <td key={bp.id} className="py-3 px-4">
                        <Badge
                          className={
                            bp.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {bp.status}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-600">Tenants</td>
                    {compareData.map((bp) => (
                      <td key={bp.id} className="py-3 px-4 font-semibold text-slate-800">
                        {bp.tenantCount}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-600">Adoption Rate</td>
                    {compareData.map((bp) => (
                      <td key={bp.id} className="py-3 px-4 font-semibold text-slate-800">
                        {bp.adoptionRate}%
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-600">Version</td>
                    {compareData.map((bp) => (
                      <td key={bp.id} className="py-3 px-4 font-mono text-xs text-slate-600">
                        v{bp.version}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Modules */}
          <Card>
            <CardHeader>
              <CardTitle>Default Modules</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 pr-4 text-left font-medium text-slate-600">
                      Module
                    </th>
                    {compareData.map((bp) => (
                      <th
                        key={bp.id}
                        className="pb-3 px-4 text-center font-medium text-slate-600"
                      >
                        {bp.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    new Set(compareData.flatMap((bp) => bp.defaultModules))
                  ).map((module) => (
                    <tr key={module} className="border-b border-slate-100">
                      <td className="py-3 pr-4 text-slate-700">{module}</td>
                      {compareData.map((bp) => (
                        <td key={bp.id} className="py-3 px-4 text-center">
                          {bp.defaultModules.includes(module) ? (
                            <CheckCircle className="inline h-5 w-5 text-emerald-500" />
                          ) : (
                            <X className="inline h-5 w-5 text-slate-300" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Default Roles</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 pr-4 text-left font-medium text-slate-600">
                      Role
                    </th>
                    {compareData.map((bp) => (
                      <th
                        key={bp.id}
                        className="pb-3 px-4 text-center font-medium text-slate-600"
                      >
                        {bp.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    new Set(compareData.flatMap((bp) => bp.defaultRoles))
                  ).map((role) => (
                    <tr key={role} className="border-b border-slate-100">
                      <td className="py-3 pr-4 text-slate-700">{role}</td>
                      {compareData.map((bp) => (
                        <td key={bp.id} className="py-3 px-4 text-center">
                          {bp.defaultRoles.includes(role) ? (
                            <CheckCircle className="inline h-5 w-5 text-emerald-500" />
                          ) : (
                            <X className="inline h-5 w-5 text-slate-300" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Dashboards */}
          <Card>
            <CardHeader>
              <CardTitle>Default Dashboards</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 pr-4 text-left font-medium text-slate-600">
                      Dashboard
                    </th>
                    {compareData.map((bp) => (
                      <th
                        key={bp.id}
                        className="pb-3 px-4 text-center font-medium text-slate-600"
                      >
                        {bp.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    new Set(compareData.flatMap((bp) => bp.defaultDashboards))
                  ).map((dashboard) => (
                    <tr key={dashboard} className="border-b border-slate-100">
                      <td className="py-3 pr-4 text-slate-700">{dashboard}</td>
                      {compareData.map((bp) => (
                        <td key={bp.id} className="py-3 px-4 text-center">
                          {bp.defaultDashboards.includes(dashboard) ? (
                            <CheckCircle className="inline h-5 w-5 text-emerald-500" />
                          ) : (
                            <X className="inline h-5 w-5 text-slate-300" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Used By */}
          <Card>
            <CardHeader>
              <CardTitle>Typical Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareData.length}, 1fr)` }}>
                {compareData.map((bp) => (
                  <div key={bp.id}>
                    <p className="mb-2 font-mono text-xs font-semibold text-slate-600">
                      {bp.id}
                    </p>
                    <div className="space-y-1">
                      {bp.usedBy.map((user, i) => (
                        <p key={i} className="text-sm text-slate-700">
                          • {user}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  )
}
