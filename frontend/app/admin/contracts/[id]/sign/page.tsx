"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { getContractById, getSignersByContract, formatCurrency } from "@/shared/services/contractService"
import { FileSignature, Check } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"

export default function ContractSignPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const { page } = useDashboardTheme()
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
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading…</p>
        </div>
      </AgenciesPage>
    )
  }

  const pendingSigners = signers.filter((s) => s.status === "PENDING")

  return (
    <AgenciesPage>
      <PageBanner
        title="E-Signature"
        subtitle={contract.projectName}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/admin/contracts/${id}`}>
          <Button variant="ghost" size="sm">← Contract</Button>
        </Link>
      </div>

      <Card className="mt-6 max-w-xl" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Sign contract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4" style={{ borderColor: page.border }}>
            <p className="font-medium">{contract.projectName}</p>
            <p className="text-sm text-slate-500">{contract.clientName}</p>
            <p className="mt-2 font-semibold text-amber-600">{formatCurrency(contract.amountMinor, contract.currency)}</p>
          </div>
          <p className="text-sm text-slate-600">
            Enter the verification code sent to your email to sign. (Demo: enter any 6 digits)
          </p>
          <div>
            <Label htmlFor="code">Verification code</Label>
            <Input
              id="code"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="mt-2 w-32 font-mono text-lg"
            />
          </div>
          <div className="flex gap-3">
            <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400" onClick={handleSign} disabled={code.length < 4 || submitting}>
              {submitting ? "Signing…" : "Sign contract"}
            </Button>
            <Button asChild variant="outline">
              <Link href={`/admin/contracts/${id}`}>Cancel</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Check className="h-4 w-4 text-emerald-500" />
            {signers.filter((s) => s.status === "SIGNED").length} of {signers.length} signers completed
          </div>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
