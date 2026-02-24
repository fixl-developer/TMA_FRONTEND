"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getContractById, getContractTemplateById, getClauses, getSignersByContract, getObligationsByContract, formatCurrency } from "@/shared/services/contractService"
import { FileSignature, User, AlertCircle, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

export default function ContractDetailPage() {
  const params = useParams()
  const id = params?.id as string
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
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading contract…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={contract.projectName}
        subtitle={contract.clientName}
        action={
          <div className="flex gap-2">
            <Link href="/admin/contracts">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Contracts
              </AdminButton>
            </Link>
            {contract.quoteId && (
              <Link href={`/admin/sales/quotes/${contract.quoteId}`}>
                <AdminButton variant="secondary" size="sm">View quote</AdminButton>
              </Link>
            )}
            {(contract.status === "DRAFT" || contract.status === "SENT") && (
              <Link href={`/admin/contracts/${id}/sign`}>
                <AdminButton variant="primary">Sign</AdminButton>
              </Link>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Contract details</h2>
          </div>
          <div className="space-y-3">
            <AdminBadge variant={
              contract.status === "SIGNED" ? "success" :
              contract.status === "SENT" ? "info" : "default"
            }>
              {contract.status}
            </AdminBadge>
            <p className="text-sm text-white/70">Amount: {formatCurrency(contract.amountMinor, contract.currency)}</p>
            {template && <p className="text-sm text-white/70">Template: {template.name}</p>}
            {contract.signedAt && <p className="text-sm text-emerald-400">Signed: {new Date(contract.signedAt).toLocaleString()}</p>}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Signers</h2>
          </div>
          <div className="space-y-3">
            {signers.map((s) => (
              <div key={s._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div>
                  <p className="font-medium text-white">{s.role}</p>
                  <p className="text-sm text-white/60">{s.email ?? `Talent ${s.talentId}`}</p>
                </div>
                <AdminBadge variant={s.status === "SIGNED" ? "success" : "warning"}>
                  {s.status}
                </AdminBadge>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <AdminCard className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Clauses</h2>
        {clauses.length === 0 ? (
          <p className="text-sm text-white/60">No clauses in template.</p>
        ) : (
          <div className="space-y-4">
            {clauses.map((cl) => (
              <div key={cl._id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{cl.name}</p>
                <p className="text-sm text-white/70 mt-1">{cl.content}</p>
                <span className="mt-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">{cl.category}</span>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {obligations.length > 0 && (
        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Obligations</h2>
          </div>
          <div className="space-y-3">
            {obligations.map((o) => (
              <div key={o._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div>
                  <p className="font-medium text-white">{o.title}</p>
                  <p className="text-sm text-white/60">{o.type} · Due {o.dueDate}</p>
                </div>
                <AdminBadge variant={o.status === "COMPLETED" ? "success" : "warning"}>
                  {o.status}
                </AdminBadge>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </AdminPageWrapper>
  )
}
