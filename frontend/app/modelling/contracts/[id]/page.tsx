"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import {
  getContractById,
  getContractSigners,
  sendContract,
  voidContract,
  signContract,
  updateContractDraft,
  type Contract,
  type ContractSigner,
} from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { ArrowLeft, FileSignature, User, Download, PenLine, Pencil } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { getCreatorName } from "@/shared/lib/creator"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SENT: "bg-[#FEF3C7] text-[#B8860B]",
  SIGNED: "bg-emerald-100 text-emerald-700",
  VOID: "bg-rose-100 text-rose-600",
}

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency === "INR" ? "INR" : "USD" }).format(amountMinor / 100)
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default function ContractDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const id = params.id as string
  const [contract, setContract] = useState<(Contract & { talentName?: string }) | null>(null)
  const [signers, setSigners] = useState<(ContractSigner & { signerName?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [signModalOpen, setSignModalOpen] = useState(false)
  const [signingSignerId, setSigningSignerId] = useState<string | null>(null)
  const [signaturePad, setSignaturePad] = useState("")
  const [editDraftOpen, setEditDraftOpen] = useState(false)
  const [editProjectName, setEditProjectName] = useState("")
  const [editClientName, setEditClientName] = useState("")
  const [editAmountMinor, setEditAmountMinor] = useState("")
  const [editCurrency, setEditCurrency] = useState("INR")
  type ContractState = (Contract & { talentName?: string }) | null

  useEffect(() => {
    if (!id) return
    Promise.all([
      getContractById(id, tenantId),
      getContractSigners(id, tenantId),
    ]).then(([c, s]) => {
      setContract(c ?? null)
      setSigners(s)
      if (c) {
        setEditProjectName(c.projectName)
        setEditClientName(c.clientName ?? "")
        setEditAmountMinor(String(c.amountMinor))
        setEditCurrency(c.currency ?? "INR")
      }
      setLoading(false)
    })
  }, [id, tenantId])

  const handleSend = async () => {
    setActionLoading(true)
    await sendContract(id, tenantId)
    setContract((c: ContractState) => (c ? { ...c, status: "SENT" } : null))
    showToast("Contract sent (mock)", "success")
    setActionLoading(false)
  }

  const handleVoid = async () => {
    setActionLoading(true)
    await voidContract(id, tenantId)
    setContract((c: ContractState) => (c ? { ...c, status: "VOID" } : null))
    showToast("Contract voided (mock)", "success")
    setActionLoading(false)
  }

  const handleOpenSign = (signerId: string) => {
    setSigningSignerId(signerId)
    setSignaturePad("")
    setSignModalOpen(true)
  }

  const handleSubmitSign = async () => {
    if (!signingSignerId || !signaturePad.trim()) {
      showToast("Please draw your signature", "warning")
      return
    }
    setActionLoading(true)
    await signContract(id, signingSignerId, tenantId)
    setSigners((prev) =>
      prev.map((s) =>
        s._id === signingSignerId
          ? { ...s, status: "SIGNED", signedAt: new Date().toISOString() }
          : s
      )
    )
    const willBeAllSigned =
      signers.filter((s) => s._id === signingSignerId || s.status === "SIGNED").length === signers.length
    if (willBeAllSigned) {
      setContract((c: ContractState) =>
        c ? { ...c, status: "SIGNED", signedAt: new Date().toISOString() } : null
      )
    }
    showToast("Signature recorded (mock)", "success")
    setSignModalOpen(false)
    setSigningSignerId(null)
    setSignaturePad("")
    setActionLoading(false)
  }

  const handleDownloadPdf = () => {
    showToast("PDF download (mock) – document would be generated", "info")
  }

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    const amount = parseInt(editAmountMinor, 10)
    const updated = await updateContractDraft(
      id,
      {
        projectName: editProjectName.trim(),
        clientName: editClientName.trim(),
        amountMinor: isNaN(amount) ? contract!.amountMinor : amount,
        currency: editCurrency,
      },
      tenantId
    )
    if (updated) {
      setContract((c: ContractState) => (c ? { ...c, ...updated } : null))
      showToast("Draft updated (mock)", "success")
    } else {
      showToast("Draft updated (mock – seed contracts not persisted)", "info")
      setContract((c: ContractState) =>
        c
          ? {
              ...c,
              projectName: editProjectName.trim(),
              clientName: editClientName.trim(),
              amountMinor: isNaN(amount) ? c.amountMinor : amount,
              currency: editCurrency,
            }
          : null
      )
    }
    setEditDraftOpen(false)
    setActionLoading(false)
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center text-[#57534E]">Loading…</div>
      </AgenciesPage>
    )
  }

  if (!contract) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p className="text-[#57534E]">Contract not found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/modelling/contracts">Back to contracts</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={contract.projectName}
        subtitle={contract.clientName}
        variant="modelling"
      />
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-[#57534E] hover:text-[#1C1917]">
          <Link href="/modelling/contracts" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to contracts
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#E7E5E4]">
            <CardHeader>
              <CardTitle className="text-[#1C1917]">Contract details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[contract.status] ?? ""}`}>
                  {contract.status}
                </span>
              </div>
              <div className="rounded-lg border border-[#E7E5E4] bg-[#FAF8F5]/60 px-3 py-2">
                <p className="text-[11px] font-medium text-[#1C1917]">Ownership & attribution</p>
                <p className="mt-0.5 text-xs text-[#57534E]">
                  Created by:{" "}
                  {getCreatorName((contract as any).createdByUserId ?? (contract as any).createdBy) ??
                    (contract as any).createdByUserId ??
                    (contract as any).createdBy ??
                    "System"}
                </p>
                <p className="mt-0.5 text-xs text-[#57534E]">
                  Created: {formatDateTime((contract as any).createdAt)} · Updated: {formatDateTime((contract as any).updatedAt)}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-[#B8860B]" />
                  <span className="text-[#57534E]">Talent: {contract.talentName ?? contract.talentId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileSignature className="h-4 w-4 text-[#B8860B]" />
                  <span className="font-semibold text-[#B8860B]">{formatCurrency(contract.amountMinor, contract.currency)}</span>
                </div>
              </div>
              {contract.signedAt && (
                <p className="text-sm text-[#57534E]">
                  Signed on {new Date(contract.signedAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </p>
              )}
              {contract.status === "DRAFT" && (
                <div className="flex flex-wrap gap-2">
                  <CapabilityGate capability="contracts.create">
                    <Button size="sm" variant="outline" className="border-[#E7E5E4]" onClick={() => setEditDraftOpen(true)}>
                      <Pencil className="mr-1.5 h-4 w-4" />
                      Edit draft
                    </Button>
                  </CapabilityGate>
                  <CapabilityGate capability="contracts.send">
                    <Button className="bg-[#B8860B] hover:bg-[#9A7209]" onClick={handleSend} disabled={actionLoading}>
                      Send for signature
                    </Button>
                  </CapabilityGate>
                  <CapabilityGate capability="contracts.void">
                    <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50" onClick={handleVoid} disabled={actionLoading}>
                      Void
                    </Button>
                  </CapabilityGate>
                </div>
              )}
              {(contract.status === "SENT" || contract.status === "SIGNED") && (
                <CapabilityGate capability="contracts.void">
                  <Button variant="outline" className="border-[#E7E5E4]" onClick={handleVoid} disabled={actionLoading}>
                    Void
                  </Button>
                </CapabilityGate>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E7E5E4]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1C1917]">
                <User className="h-5 w-5 text-[#B8860B]" />
                Signers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {signers.length === 0 ? (
                <p className="py-4 text-sm text-[#57534E]">No signers.</p>
              ) : (
                <div className="space-y-3">
                  {signers.map((s) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between rounded-lg border border-[#E7E5E4] p-3"
                    >
                      <div>
                        <p className="font-medium text-[#1C1917]">{s.signerName}</p>
                        <p className="text-xs text-[#57534E]">
                          {s.role} • {s.status === "SIGNED" && s.signedAt
                            ? `Signed ${new Date(s.signedAt).toLocaleDateString("en-IN")}`
                            : "Pending"}
                        </p>
                      </div>
                      {s.status === "PENDING" && contract.status === "SENT" && (
                        <CapabilityGate capability="contracts.send">
                          <Button size="sm" className="bg-[#B8860B] hover:bg-[#9A7209]" onClick={() => handleOpenSign(s._id)}>
                            <PenLine className="mr-1.5 h-4 w-4" />
                            Sign
                          </Button>
                        </CapabilityGate>
                      )}
                      {s.status === "SIGNED" && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          Signed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-[#E7E5E4]">
            <CardHeader>
              <CardTitle className="text-[#1C1917]">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {contract.bookingId && (
                <Button asChild variant="outline" className="w-full border-[#E7E5E4]">
                  <Link href={`/modelling/bookings/${contract.bookingId}`}>View booking</Link>
                </Button>
              )}
              <CapabilityGate capability="exports.generate">
                <Button
                  variant="outline"
                  className="w-full border-[#E7E5E4]"
                  onClick={handleDownloadPdf}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CapabilityGate>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editDraftOpen} onOpenChange={setEditDraftOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit draft</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveDraft} className="space-y-4">
            <div>
              <Label>Project name</Label>
              <Input
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
                className="mt-1 border-[#E7E5E4]"
                required
              />
            </div>
            <div>
              <Label>Client name</Label>
              <Input
                value={editClientName}
                onChange={(e) => setEditClientName(e.target.value)}
                className="mt-1 border-[#E7E5E4]"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Amount (minor units)</Label>
                <Input
                  type="number"
                  value={editAmountMinor}
                  onChange={(e) => setEditAmountMinor(e.target.value)}
                  className="mt-1 border-[#E7E5E4]"
                  required
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={editCurrency} onValueChange={setEditCurrency}>
                  <SelectTrigger className="mt-1 border-[#E7E5E4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDraftOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]" disabled={actionLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={signModalOpen} onOpenChange={setSignModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-[#57534E]">Draw your signature below (mock – stores locally):</p>
            <div className="rounded-lg border-2 border-dashed border-[#E7E5E4] bg-[#FAF8F5] p-4 min-h-[120px]">
              <textarea
                value={signaturePad}
                onChange={(e) => setSignaturePad(e.target.value)}
                placeholder="Type or draw your name..."
                rows={3}
                className="w-full resize-none rounded border-0 bg-transparent p-0 text-[#1C1917] placeholder:text-[#57534E]/50 focus:ring-0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSignModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#B8860B] hover:bg-[#9A7209]" onClick={handleSubmitSign} disabled={actionLoading}>
              Submit signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AgenciesPage>
  )
}
