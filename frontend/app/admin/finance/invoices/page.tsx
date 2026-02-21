"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getInvoices } from "@/shared/services/modellingInvoiceService"
import { useTenant } from "@/shared/context/TenantContext"
import { FileText, Plus, DollarSign, Clock, CheckCircle } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/layout/AdminPageWrapper"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"

function formatCurrency(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency === "INR" ? "INR" : "USD",
  }).format(amountMinor / 100)
}

export default function AdminInvoicesPage() {
  const { tenantId } = useTenant()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInvoices(tenantId).then((data) => {
      setInvoices(data)
      setLoading(false)
    })
  }, [tenantId])

  const paidInvoices = invoices.filter((inv) => inv.status === "PAID")
  const pendingInvoices = invoices.filter((inv) => inv.status === "PENDING")
  const draftInvoices = invoices.filter((inv) => inv.status === "DRAFT")
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amountMinor, 0)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "success"
      case "PENDING":
        return "warning"
      case "DRAFT":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Invoices"
        subtitle="Create, send, and manage invoices"
        action={
          <div className="flex gap-2">
            <Link href="/admin/wallet">
              <AdminButton variant="secondary" size="sm">
                ← Wallet
              </AdminButton>
            </Link>
            <CapabilityGate capability="ledger.transfer">
              <AdminButton>
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </AdminButton>
            </CapabilityGate>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Total Invoices"
          value={invoices.length}
          subtitle="All invoices"
          icon={FileText}
          color="purple"
        />
        <AdminStatCard
          title="Paid"
          value={paidInvoices.length}
          subtitle="Completed"
          icon={CheckCircle}
          color="green"
        />
        <AdminStatCard
          title="Pending"
          value={pendingInvoices.length}
          subtitle="Awaiting payment"
          icon={Clock}
          color="yellow"
        />
        <AdminStatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue, "INR")}
          subtitle="From paid invoices"
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Invoices List */}
      <AdminCard>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">All Invoices</h3>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <AdminEmptyState
            icon={FileText}
            title="No invoices yet"
            description="Create your first invoice to get started"
            action={
              <CapabilityGate capability="ledger.transfer">
                <AdminButton>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </AdminButton>
              </CapabilityGate>
            }
          />
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv._id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                      <FileText className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-white">{inv.invoiceNumber}</p>
                        <AdminBadge variant={getStatusBadgeVariant(inv.status) as any}>
                          {inv.status}
                        </AdminBadge>
                      </div>
                      <p className="text-sm text-white/60">{inv.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-[#d4ff00]">
                      {formatCurrency(inv.amountMinor, inv.currency)}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/admin/finance/invoices/${inv._id}`}>
                        <AdminButton variant="ghost" size="sm">
                          View
                        </AdminButton>
                      </Link>
                      {inv.status === "PENDING" && (
                        <CapabilityGate capability="ledger.transfer">
                          <Link href={`/admin/payments/checkout?invoiceId=${inv._id}`}>
                            <AdminButton size="sm">Pay</AdminButton>
                          </Link>
                        </CapabilityGate>
                      )}
                      {inv.status === "PAID" && (
                        <CapabilityGate capability="exports.generate">
                          <Link href={`/admin/finance/invoices/${inv._id}/receipt`}>
                            <AdminButton variant="secondary" size="sm">
                              Receipt
                            </AdminButton>
                          </Link>
                        </CapabilityGate>
                      )}
                      <CapabilityGate capability="exports.generate">
                        <AdminButton variant="secondary" size="sm">
                          Download
                        </AdminButton>
                      </CapabilityGate>
                    </div>
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
