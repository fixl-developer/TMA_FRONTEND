/**
 * Contract Templates Library - Super Admin
 *
 * Manage contract templates across all blueprints.
 */

"use client"

import { useEffect, useState } from "react"
import { FileText, Plus, Edit, Copy } from "lucide-react"
import clmData from "@/data/seed/clm.json"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"

type Template = {
  _id: string
  name: string
  category: string
  blueprintType: string
  version: string
  status: string
  description: string
  clauses: string[]
  variables: string[]
  approvalRequired: boolean
  legalReviewDate: string
  usageCount: number
}

const categoryColors = {
  TALENT: "bg-purple-50 text-purple-700 border-purple-200",
  BRAND: "bg-blue-50 text-blue-700 border-blue-200",
  SERVICE_PROVIDER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  AGENCY: "bg-amber-50 text-amber-700 border-amber-200",
  VENUE: "bg-rose-50 text-rose-700 border-rose-200",
  LEGAL: "bg-slate-100 text-slate-700 border-slate-200",
  SUBSCRIPTION: "bg-sky-50 text-sky-700 border-sky-200",
}

export default function ContractTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("ALL")

  useEffect(() => {
    setTemplates(clmData.contractTemplates as Template[])
    setLoading(false)
  }, [])

  const filteredTemplates = filter === "ALL" 
    ? templates 
    : templates.filter(t => t.category === filter)

  const categories = ["ALL", ...Array.from(new Set(templates.map(t => t.category)))]

  return (
    <PageLayout>
      <PageHeader
        title="Contract Templates"
        description="Manage contract templates across all blueprints and categories."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            {templates.length} Templates
          </span>
        }
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New template
          </Button>
        }
      />

      <PageSection title="Filters">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600">Category:</span>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={filter === cat ? "default" : "outline"}
                  className={filter === cat ? "h-7 px-3 text-xs" : "h-7 px-3 text-xs"}
                  onClick={() => setFilter(cat)}
                >
                  {cat.replace(/_/g, " ")}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Templates">
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTemplates.map((template) => (
              <Card key={template._id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                          categoryColors[template.category as keyof typeof categoryColors]
                        }`}>
                          {template.category.replace(/_/g, " ")}
                        </span>
                        <span className="inline-flex rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                          v{template.version}
                        </span>
                        <span className="inline-flex rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          {template.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-1">Blueprint type:</p>
                      <p className="text-xs text-slate-600">{template.blueprintType}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-1">Key clauses ({template.clauses.length}):</p>
                      <ul className="text-xs text-slate-600 space-y-0.5">
                        {template.clauses.slice(0, 3).map((clause, idx) => (
                          <li key={idx}>• {clause}</li>
                        ))}
                        {template.clauses.length > 3 && (
                          <li className="text-slate-500">+ {template.clauses.length - 3} more</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-1">Variables ({template.variables.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 4).map((variable) => (
                          <span key={variable} className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
                            {variable}
                          </span>
                        ))}
                        {template.variables.length > 4 && (
                          <span className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                            +{template.variables.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="text-xs text-slate-500">
                        <p>Used {template.usageCount} times</p>
                        <p>Legal review: {new Date(template.legalReviewDate).toLocaleDateString()}</p>
                      </div>
                      {template.approvalRequired && (
                        <span className="inline-flex rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Approval required
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>
    </PageLayout>
  )
}
