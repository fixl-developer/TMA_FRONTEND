"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Rocket, Users2, FileStack } from "lucide-react"
import { getTenants } from "@/shared/services/tenantService"
import { getTemplates } from "@/shared/services/templateService"
import { setTenantBlueprints } from "@/shared/services/tenantService"
import type { Tenant } from "@/shared/lib/types/tenants"
import type { TenantTemplate } from "@/shared/lib/types/templates"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/toast"

export default function TemplatesApplyPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [templates, setTemplates] = useState<TenantTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [selectedTenantId, setSelectedTenantId] = useState<string>("")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [t, tmpl] = await Promise.all([getTenants(), getTemplates()])
        setTenants(t)
        setTemplates(tmpl)
        if (!selectedTenantId && t.length) setSelectedTenantId(t[0]._id)
        if (!selectedTemplateId && tmpl.length) setSelectedTemplateId(tmpl[0].id)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const template = templates.find((t) => t.id === selectedTemplateId)
  const tenant = tenants.find((t) => t._id === selectedTenantId)
  const newBlueprints = template
    ? [...new Set([...(tenant?.blueprints ?? []), ...template.includedBlueprints])]
  : []

  const handleApply = async () => {
    if (!selectedTenantId || !template) return
    setDeploying(true)
    try {
      await setTenantBlueprints(selectedTenantId, newBlueprints)
      showToast(`Template ${template.name} applied to tenant. Blueprints updated.`, "success")
      router.push("/templates")
    } catch {
      showToast("Failed to apply template.", "error")
    } finally {
      setDeploying(false)
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Apply template to tenant"
        description="Select a tenant and a template. Applying sets the tenant’s blueprints to include the template’s blueprints (merged with existing). Seed + localStorage."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <Rocket className="h-3.5 w-3.5 text-[#0078d4]" />
            Apply
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/templates">
              <ArrowLeft className="h-3.5 w-3.5" />
              Catalog
            </Link>
          </Button>
        }
      />

      <PageSection>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users2 className="h-4 w-4" />
                Select tenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-[#605e5c]">Loading…</p>
              ) : (
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm"
                >
                  {tenants.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.slug})
                    </option>
                  ))}
                </select>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileStack className="h-4 w-4" />
                Select template
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-[#605e5c]">Loading…</p>
              ) : (
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full rounded-md border border-[#edebe9] bg-white px-3 py-2 text-sm"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              )}
            </CardContent>
          </Card>
        </div>

        {template && tenant && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Preview</CardTitle>
              <p className="text-xs text-[#605e5c]">
                Tenant <strong>{tenant.name}</strong> will get blueprints:{" "}
                <span className="font-mono">{newBlueprints.join(", ")}</span>
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={handleApply} disabled={deploying} className="gap-2">
                <Rocket className="h-4 w-4" />
                {deploying ? "Applying…" : "Apply template"}
              </Button>
            </CardContent>
          </Card>
        )}
      </PageSection>
    </PageLayout>
  )
}
