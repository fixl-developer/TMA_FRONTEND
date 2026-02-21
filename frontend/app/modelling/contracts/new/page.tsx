"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { getBookings, getContractTemplates, createContract, type ContractTemplate } from "@/shared/services/contractService"
import { useTenant } from "@/shared/context/TenantContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function NewContractPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingIdFromUrl = searchParams.get("bookingId")
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [bookings, setBookings] = useState<any[]>([])
  const [templates, setTemplates] = useState<ContractTemplate[]>([])
  const [bookingId, setBookingId] = useState(bookingIdFromUrl || "__none__")
  const [templateId, setTemplateId] = useState("__none__")
  const [amountMinor, setAmountMinor] = useState("")
  const [currency, setCurrency] = useState("INR")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      getBookings(tenantId),
      getContractTemplates(tenantId),
    ]).then(([b, t]) => {
      setBookings(b)
      setTemplates(t)
    })
  }, [tenantId])

  useEffect(() => {
    if (bookingIdFromUrl) setBookingId(bookingIdFromUrl)
  }, [bookingIdFromUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (bookingId === "__none__" || !bookingId) {
      showToast("Select a booking", "warning")
      return
    }
    if (templateId === "__none__" || !templateId) {
      showToast("Select a template", "warning")
      return
    }
    const amount = parseInt(amountMinor, 10)
    if (isNaN(amount) || amount <= 0) {
      showToast("Enter a valid amount", "warning")
      return
    }
    setLoading(true)
    const contract = await createContract(bookingId, templateId, amount, currency, tenantId)
    showToast("Contract created (mock)", "success")
    router.push(`/modelling/contracts/${contract._id}`)
    setLoading(false)
  }

  const confirmedBookings = bookings.filter((b) => b.stage === "CONFIRMED")

  return (
    <AgenciesPage>
      <PageBanner
        title="New contract"
        subtitle="Create from booking"
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

      <Card className="mt-6 border-[#E7E5E4] max-w-2xl">
        <CardHeader>
          <CardTitle className="text-[#1C1917]">Create contract from booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Booking *</Label>
              <Select value={bookingId} onValueChange={setBookingId}>
                <SelectTrigger className="mt-1 border-[#E7E5E4]">
                  <SelectValue placeholder="Select booking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Select booking</SelectItem>
                  {confirmedBookings.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.projectName} – {b.clientName}
                    </SelectItem>
                  ))}
                  {confirmedBookings.length === 0 && (
                    <SelectItem value="__empty__" disabled>No confirmed bookings</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-[#57534E]">Only confirmed bookings are shown.</p>
            </div>
            <div>
              <Label>Template *</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger className="mt-1 border-[#E7E5E4]">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Select template</SelectItem>
                  {templates.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Amount (in minor units, e.g. paise) *</Label>
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
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-[#B8860B] hover:bg-[#9A7209]" disabled={loading}>
                Create contract
              </Button>
              <Button asChild type="button" variant="outline" className="border-[#E7E5E4]">
                <Link href="/modelling/contracts">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
