"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { getContractById, getSignersByContract, formatCurrency } from "@/shared/services/contractService"
import { FileSignature, Check } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard, AdminButton } from "@/shared/components/admin/AdminPageLayout"

export default function ContractSignPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [contract, setContract] = useState<any>(null)
  const [signers, setSigners] = useState<any[]>([])
  const [code, setCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getContractById(id), getSignersByContract(id)]).then(([c, s]) => {
      setContract(c)
      setSigners(s)
      setLoading(false)
    })
  }, [id])

  const handleSign = async () => {
    if (!code.trim()) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))
    router.push(`/admin/contracts/${id}`)
    setSubmitting(false)
  }

  if (loading || !contract) {
    return (
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="E-Signature"
        subtitle={contract.projectName}
        actions={
          <Link href={`/admin/contracts/${id}`}>
            <AdminButton variant="outline">← Contract</AdminButton>
          </Link>
        }
      >
        <div className="max-w-xl">
          <AdminCard>
            <div className="flex items-center gap-2 mb-6">
              <FileSignature className="h-5 w-5 text-[#d4ff00]" />
              <h3 className="text-lg font-semibold text-white">Sign contract</h3>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{contract.projectName}</p>
                <p className="text-sm text-white/60">{contract.clientName}</p>
                <p className="mt-2 font-semibold text-[#d4ff00]">{formatCurrency(contract.amountMinor, contract.currency)}</p>
              </div>
              <p className="text-sm text-white/60">
                Enter the verification code sent to your email to sign. (Demo: enter any 6 digits)
              </p>
              <div>
                <Label htmlFor="code" className="text-white">Verification code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="mt-2 w-32 font-mono text-lg bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div className="flex gap-3">
                <AdminButton onClick={handleSign} disabled={code.length < 4 || submitting}>
                  {submitting ? "Signing…" : "Sign contract"}
                </AdminButton>
                <Link href={`/admin/contracts/${id}`}>
                  <AdminButton variant="outline">Cancel</AdminButton>
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Check className="h-4 w-4 text-emerald-400" />
                {signers.filter((s) => s.status === "SIGNED").length} of {signers.length} signers completed
              </div>
            </div>
          </AdminCard>
        </div>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
