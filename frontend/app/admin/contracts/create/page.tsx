"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { getContractTemplates, formatCurrency } from "@/shared/services/contractService"
import { getAccounts, getQuoteById } from "@/shared/services/salesService"
import { useTenant } from "@/shared/context/TenantContext"
import { FileSignature, ArrowLeft } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminCard,
  AdminButton,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

export default function ContractCreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tenantId } = useTenant()
  const [templates, setTemplates] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [quote, setQuote] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [projectName, setProjectName] = useState("")
  const [amountMinor, setAmountMinor] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const quoteId = searchParams?.get("quote")
  const templateIdFromUrl = searchParams?.get("template")

  useEffect(() => {
    const load = async () => {
      const [t, a] = await Promise.all([
        getContractTemplates(tenantId),
        getAccounts(tenantId),
      ])
      setTemplates(t)
      setAccounts(a)
      if (quoteId) {
        const q = await getQuoteById(quoteId)
        setQuote(q)
        if (q) {
          setAmountMinor(q.totalMinor)
          setProjectName(q.quoteNumber)
        }
      }
      if (templateIdFromUrl && t.some((x) => x._id === templateIdFromUrl)) {
        setSelectedTemplate(templateIdFromUrl)
      }
      setLoading(false)
    }
    load()
  }, [tenantId, quoteId, templateIdFromUrl])

  const handleSubmit = async () => {
    if (!selectedTemplate || !projectName || amountMinor <= 0) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    router.push("/admin/contracts")
    setSubmitting(false)
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Create Contract"
        subtitle={quote ? `From quote ${quote.quoteNumber}` : "From template"}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/contracts">
              <AdminButton variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                Contracts
              </AdminButton>
            </Link>
            {quote && (
              <Link href={`/admin/sales/quotes/${quote._id}`}>
                <AdminButton variant="secondary">View Quote</AdminButton>
              </Link>
            )}
          </div>
        }
      >
        {loading ? (
          <AdminCard>
            <AdminLoading rows={5} />
          </AdminCard>
        ) : (
          <AdminCard title="Contract Details" className="max-w-2xl">
            <div className="space-y-6">
              {quote && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-sm font-medium text-amber-400">From quote: {quote.quoteNumber}</p>
                  <p className="text-sm text-white/70">Total: {formatCurrency(quote.totalMinor, quote.currency)}</p>
                </div>
              )}
              <div>
                <Label className="text-white/70">Template</Label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-[#d4ff00] focus:outline-none"
                >
                  <option value="">Select template</option>
                  {templates.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-white/70">Client / Account</Label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-[#d4ff00] focus:outline-none"
                >
                  <option value="">Select account</option>
                  {accounts.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="project" className="text-white/70">Project Name</Label>
                <Input
                  id="project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Spring Lookbook 2024"
                  className="mt-2 border-white/20 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-white/70">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amountMinor ? amountMinor / 100 : ""}
                  onChange={(e) => setAmountMinor(Number(e.target.value) * 100)}
                  placeholder="150000"
                  className="mt-2 w-40 border-white/20 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              <div className="flex gap-3">
                <AdminButton
                  onClick={handleSubmit}
                  disabled={!selectedTemplate || !projectName || amountMinor <= 0 || submitting}
                >
                  <FileSignature className="mr-2 h-4 w-4" />
                  {submitting ? "Creating…" : "Create Contract"}
                </AdminButton>
                <Link href="/admin/contracts">
                  <AdminButton variant="secondary">Cancel</AdminButton>
                </Link>
              </div>
            </div>
          </AdminCard>
        )}
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
