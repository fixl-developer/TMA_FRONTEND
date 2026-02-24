"use client"

import { useState } from "react"
import Link from "next/link"
import { Settings2, ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"

export default function ReportBuilderPage() {
  const [name, setName] = useState("")
  const [dataSource, setDataSource] = useState("platform_metrics")
  const [visualization, setVisualization] = useState("table")
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const handleSave = async () => {
    if (!name.trim()) { showToast("Enter report name.", "warning"); return }
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      showToast("Report saved (UI only – backend POST /analytics/reports not connected).", "success")
    } catch { showToast("Save failed.", "error") }
    finally { setSaving(false) }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Report builder"
        description="Visual report builder, data source selection, metric configuration, visualization options. Seed/UI only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><Settings2 className="h-3.5 w-3.5 text-[#0078d4]" />Builder</span>}
        actions={<Button asChild variant="outline" size="sm"><Link href="/analytics/reports"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" />Reports</Link></Button>}
      />
      <PageSection>
        <Card>
          <CardHeader><CardTitle className="text-base">New report</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Report name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly tenant health" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Data source</Label>
              <select id="source" value={dataSource} onChange={(e) => setDataSource(e.target.value)} className="w-full rounded border border-[#edebe9] px-3 py-2 text-sm">
                <option value="platform_metrics">Platform metrics</option>
                <option value="tenant_analytics">Tenant analytics</option>
                <option value="revenue_reports">Revenue reports</option>
                <option value="custom">Custom query</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="viz">Visualization</Label>
              <select id="viz" value={visualization} onChange={(e) => setVisualization(e.target.value)} className="w-full rounded border border-[#edebe9] px-3 py-2 text-sm">
                <option value="table">Table</option>
                <option value="bar">Bar chart</option>
                <option value="line">Line chart</option>
                <option value="pie">Pie chart</option>
              </select>
            </div>
            <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save report"}</Button>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
