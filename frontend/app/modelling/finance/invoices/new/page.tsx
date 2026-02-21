"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { createInvoice } from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function NewInvoicePage() {
  const router = useRouter()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [clientName, setClientName] = useState("")
  const [amountMinor, setAmountMinor] = useState("")
  const [currency, setCurrency] = useState("INR")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseInt(amountMinor, 10)
    if (isNaN(amount) || amount <= 0) {
      showToast("Enter a valid amount", "warning")
      return
    }
    if (!clientName.trim()) {
      showToast("Enter client name", "warning")
      return
    }
    if (!dueDate) {
      showToast("Select due date", "warning")
      return
    }
    setLoading(true)
    const inv = await createInvoice(
      clientName,
      amount,
      currency,
      dueDate,
      description || undefined,
      tenantId
    )
    showToast("Invoice created (mock)", "success")
    router.push(`/modelling/finance/invoices/${inv._id}`)
    setLoading(false)
  }

  return (
    <AgenciesPage>
      <PageBanner
        title="New invoice"
        subtitle="Create invoice"
        variant="modelling"
      />
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-[#57534E] hover:text-[#1C1917]">
          <Link href="/modelling/finance/invoices" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to invoices
          </Link>
        </Button>
      </div>

      <Card className="mt-6 border-[#E7E5E4] max-w-2xl">
        <CardHeader>
          <CardTitle className="text-[#1C1917]">Invoice details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Client name *</Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Luxury Fashion House"
                className="mt-1 border-[#E7E5E4]"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Amount (in minor units) *</Label>
                <Input
                  type="number"
                  value={amountMinor}
                  onChange={(e) => setAmountMinor(e.target.value)}
                  placeholder="e.g. 150000 for ₹1,500"
                  className="mt-1 border-[#E7E5E4]"
                  required
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
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
            <div>
              <Label>Due date *</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 border-[#E7E5E4]"
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
                className="mt-1 w-full rounded-md border border-[#E7E5E4] px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]" disabled={loading}>
                Create invoice
              </Button>
              <Button asChild type="button" variant="outline" className="border-[#E7E5E4]">
                <Link href="/modelling/finance/invoices">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
