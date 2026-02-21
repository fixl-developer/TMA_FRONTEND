"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getContractById, getContractTemplateById, getClauses, getSignersByContract, getObligationsByContract, formatCurrency } from "@/shared/services/contractService"
import { FileSignature, User, AlertCircle } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SENT: "bg-blue-100 text-blue-700",
  SIGNED: "bg-emerald-100 text-emerald-700",
}

export default function ContractDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { page } = useDashboardTheme()
  const [contract, setContract] = useState<any>(null)
  const [template, setTemplate] = useState<any>(null)
  const [clauses, setClauses] = useState<any[]>([])
  const [signers, setSigners] = useState<any[]>([])
  const [obligations, setObligations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getContractById(id).then(async (c) => {
      setContract(c)
      if (c?.templateId) setTemplate(await getContractTemplateById(c.templateId))
      const tmpl = await getContractTemplateById(c?.templateId ?? "")
      const clauseIds = tmpl?.clauseIds ?? []
      const allClauses = await getClauses(c?.tenantId)
      setClauses(clauseIds.map((cid: string) => allClauses.find((cl) => cl._id === cid)).filter(Boolean))
      setSigners(await getSignersByContract(id))
      setObligations(await getObligationsByContract(id))
      setLoading(false)
    })
  }, [id])

  if (loading || !contract) {
    return (
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading contract…</p>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={contract.projectName}
        subtitle={contract.clientName}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/contracts">
          <Button variant="ghost" size="sm">← Contracts</Button>
        </Link>
        {contract.quoteId && (
          <Link href={`/admin/sales/quotes/${contract.quoteId}`}>
            <Button variant="outline" size="sm">View quote</Button>
          </Link>
        )}
        {(contract.status === "DRAFT" || contract.status === "SENT") && (
          <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
            <Link href={`/admin/contracts/${id}/sign`}>Sign</Link>
          </Button>
        )}
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Contract details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[contract.status] ?? "bg-slate-100"}`}>
                {contract.status}
              </span>
            </div>
            <p className="text-sm text-slate-600">Amount: {formatCurrency(contract.amountMinor, contract.currency)}</p>
            {template && <p className="text-sm text-slate-600">Template: {template.name}</p>}
            {contract.signedAt && <p className="text-sm text-emerald-600">Signed: {new Date(contract.signedAt).toLocaleString()}</p>}
          </CardContent>
        </Card>

        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Signers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {signers.map((s) => (
                <div key={s._id} className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: page.border }}>
                  <div>
                    <p className="font-medium">{s.role}</p>
                    <p className="text-sm text-slate-500">{s.email ?? `Talent ${s.talentId}`}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${s.status === "SIGNED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle>Clauses</CardTitle>
        </CardHeader>
        <CardContent>
          {clauses.length === 0 ? (
            <p className="text-sm text-slate-500">No clauses in template.</p>
          ) : (
            <div className="space-y-4">
              {clauses.map((cl) => (
                <div key={cl._id} className="rounded-lg border p-4" style={{ borderColor: page.border }}>
                  <p className="font-medium" style={{ color: page.text }}>{cl.name}</p>
                  <p className="text-sm text-slate-600 mt-1">{cl.content}</p>
                  <span className="mt-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs">{cl.category}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {obligations.length > 0 && (
        <Card className="mt-6" style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Obligations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {obligations.map((o) => (
                <div key={o._id} className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: page.border }}>
                  <div>
                    <p className="font-medium">{o.title}</p>
                    <p className="text-sm text-slate-500">{o.type} · Due {o.dueDate}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${o.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </AgenciesPage>
  )
}
