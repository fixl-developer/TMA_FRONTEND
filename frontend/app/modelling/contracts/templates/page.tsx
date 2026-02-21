"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { LoadingSkeleton } from "@/shared/components/ui/loading-skeleton"
import { getContractTemplates, type ContractTemplate } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { FileText, Plus } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function ContractTemplatesPage() {
  const { tenantId } = useTenant()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
    inputBg: isDark ? "#0a0a0a" : "#ffffff",
  }
  const [templates, setTemplates] = useState<ContractTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContractTemplates(tenantId).then((data) => {
      setTemplates(data)
      setLoading(false)
    })
  }, [tenantId])

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Contract templates</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>Reusable templates with clause library</p>
      </div>
      <section className="mt-8">
        <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
          <CardHeader>
            <CardTitle style={{ color: theme.text }}>Templates</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <LoadingSkeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
                <FileText className="mx-auto h-12 w-12 text-[#B8860B]/50" />
                <p className="mt-4" style={{ color: theme.textSecondary }}>No templates yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((t) => (
                  <Link
                    key={t._id}
                    href={`/modelling/contracts/templates/${t._id}`}
                    className="block rounded-xl border p-5 transition-all hover:border-[#B8860B]/30 hover:shadow-md"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold" style={{ color: theme.text }}>{t.name}</h3>
                        {t.description && (
                          <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{t.description}</p>
                        )}
                        <p className="mt-2 text-xs" style={{ color: theme.textSecondary }}>
                          {t.clauseIds?.length ?? 0} clauses
                        </p>
                      </div>
                      <span className="text-[#B8860B]">Edit</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
