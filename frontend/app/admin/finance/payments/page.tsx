"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getPaymentEvents } from "@/shared/services/paymentService"
import { useTenant } from "@/shared/context/TenantContext"
import { CreditCard, CheckCircle2, XCircle, RefreshCw, DollarSign, Activity } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

const EVENT_LABELS: Record<string, string> = {
  "payment.captured": "Captured",
  "payment.initiated": "Initiated",
  "payment.failed": "Failed",
  "refund.processed": "Refunded",
}

export default function AdminPaymentsPage() {
  const { tenantId } = useTenant()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPaymentEvents(tenantId).then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [tenantId])

  const successEvents = events.filter((e) => e.status === "SUCCESS")
  const failedEvents = events.filter((e) => e.status === "FAILED")
  const pendingEvents = events.filter((e) => e.status === "PENDING")
  const totalAmount = successEvents.reduce((sum, e) => sum + e.amountMinor, 0)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "success"
      case "PENDING":
        return "warning"
      case "FAILED":
        return "danger"
      default:
        return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Payment Events"
        subtitle="PSP (Razorpay) payment events and status"
        action={
          <div className="flex gap-2">
            <Link href="/admin/wallet">
              <AdminButton variant="secondary" size="sm">
                ← Wallet
              </AdminButton>
            </Link>
            <AdminButton variant="secondary" size="sm" disabled>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync
            </AdminButton>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Events"
          value={events.length}
          subtitle="All payment events"
          icon={Activity}
          color="purple"
        />
        <AdminStatCard
          title="Successful"
          value={successEvents.length}
          subtitle="Completed payments"
          icon={CheckCircle2}
          color="green"
        />
        <AdminStatCard
          title="Failed"
          value={failedEvents.length}
          subtitle="Failed attempts"
          icon={XCircle}
          color="pink"
        />
        <AdminStatCard
          title="Total Amount"
          value={formatCurrency(totalAmount, "INR")}
          subtitle="Successful payments"
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Payment Events List */}
      <AdminCard>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2">
            <CreditCard className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white">PSP Events</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="py-12 text-center text-white/50">No payment events yet.</p>
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <div
                key={e._id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    {e.status === "SUCCESS" ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                    ) : e.status === "FAILED" ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
                        <XCircle className="h-5 w-5 text-rose-400" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                        <RefreshCw className="h-5 w-5 text-amber-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-white">
                          {EVENT_LABELS[e.eventType] ?? e.eventType}
                        </p>
                        <AdminBadge variant={getStatusBadgeVariant(e.status) as any}>
                          {e.status}
                        </AdminBadge>
                      </div>
                      <p className="text-xs text-white/50">
                        {e.paymentId} · {e.psp}
                        {e.invoiceId && ` · Invoice ${e.invoiceId}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-white">
                      {formatCurrency(e.amountMinor, e.currency)}
                    </p>
                    <span className="text-xs text-white/50">
                      {new Date(e.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageWrapper>
  )
}
