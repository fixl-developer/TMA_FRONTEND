/**
 * Modelling Invoice Service
 *
 * Mock service for invoices. Tenant-scoped.
 */

import { seedInvoices } from "@/data/seed"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Invoice {
  _id: string
  tenantId: string
  invoiceNumber: string
  clientName: string
  amountMinor: number
  currency: string
  status: string
  dueDate?: string
  paidAt?: string
  description?: string
}

// In-memory store for mock-created invoices (resets on refresh)
const createdInvoices: Invoice[] = []
// Overrides for seed invoices (finalize/pay - mock persistence)
const invoiceOverrides: Record<string, Partial<Invoice>> = {}

function applyOverrides(invoices: Invoice[], tid: string): Invoice[] {
  return invoices.map((i) => {
    const key = `${tid}:${i._id}`
    const override = invoiceOverrides[key]
    return override ? { ...i, ...override } : i
  })
}

export const getInvoices = async (
  tenantId?: string | null
): Promise<Invoice[]> => {
  await delay(120)
  const id = tenantId || "tenant_001"
  const fromSeed = (seedInvoices as Invoice[]).filter((i) => i.tenantId === id)
  const fromCreated = createdInvoices.filter((i) => i.tenantId === id)
  return [...fromCreated, ...applyOverrides(fromSeed, id)]
}

export const getInvoiceById = async (
  invoiceId: string,
  tenantId?: string | null
): Promise<Invoice | null> => {
  await delay(80)
  const tid = tenantId || "tenant_001"
  const fromCreated = createdInvoices.find((x) => x._id === invoiceId && x.tenantId === tid)
  if (fromCreated) return fromCreated
  const i = (seedInvoices as Invoice[]).find(
    (x) => x._id === invoiceId && x.tenantId === tid
  )
  if (!i) return null
  const override = invoiceOverrides[`${tid}:${invoiceId}`]
  return override ? { ...i, ...override } : i
}

/** Mock: create invoice */
export const createInvoice = async (
  clientName: string,
  amountMinor: number,
  currency: string,
  dueDate: string,
  description?: string,
  tenantId?: string | null
): Promise<Invoice> => {
  await delay(200)
  const tid = tenantId || "tenant_001"
  const count = (seedInvoices as Invoice[]).filter((i) => i.tenantId === tid).length + createdInvoices.filter((i) => i.tenantId === tid).length + 1
  const inv: Invoice = {
    _id: `inv_${Date.now()}`,
    tenantId: tid,
    invoiceNumber: `INV-2024-${String(count).padStart(3, "0")}`,
    clientName,
    amountMinor,
    currency,
    status: "DRAFT",
    dueDate,
    description,
  }
  createdInvoices.push(inv)
  return inv
}

/** Mock: finalize invoice */
export const finalizeInvoice = async (
  invoiceId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
  const tid = tenantId || "tenant_001"
  const inv = createdInvoices.find((i) => i._id === invoiceId && i.tenantId === tid)
  if (inv) {
    inv.status = "PENDING"
  } else {
    const key = `${tid}:${invoiceId}`
    invoiceOverrides[key] = { ...invoiceOverrides[key], status: "PENDING" }
  }
}

/** Mock: pay invoice (opens mock checkout) */
export const payInvoice = async (
  invoiceId: string,
  tenantId?: string | null
): Promise<void> => {
  await delay(200)
  const tid = tenantId || "tenant_001"
  const inv = createdInvoices.find((i) => i._id === invoiceId && i.tenantId === tid)
  if (inv) {
    inv.status = "PAID"
    inv.paidAt = new Date().toISOString().split("T")[0]
  } else {
    const key = `${tid}:${invoiceId}`
    invoiceOverrides[key] = {
      ...invoiceOverrides[key],
      status: "PAID",
      paidAt: new Date().toISOString().split("T")[0],
    }
  }
}
