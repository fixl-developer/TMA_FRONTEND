"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { getStatementById } from "@/shared/services/modellingFinanceService"
import { useTenant } from "@/shared/context/TenantContext"
import { useColorMode } from "@/shared/context/ColorModeContext"
import { useToast } from "@/shared/components/ui/toast"
import { ArrowLeft, Download } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

function formatCurrency(amountMinor: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amountMinor / 100)
}

export default function StatementDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    cardBg: isDark ? "#171717" : "#ffffff",
    border: isDark ? "#262626" : "#E7E5E4",
    text: isDark ? "#fafafa" : "#1C1917",
    textSecondary: isDark ? "#a3a3a3" : "#57534E",
  }
  const id = params.id as string
  const [statement, setStatement] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getStatementById(id, tenantId).then((s) => {
      setStatement(s ?? null)
      setLoading(false)
    })
  }, [id, tenantId])

  const handleDownloadPdf = () => {
    showToast("PDF download (mock) – statement would be generated", "info")
  }

  if (loading) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center" style={{ color: theme.textSecondary }}>Loading…</div>
      </AgenciesPage>
    )
  }

  if (!statement) {
    return (
      <AgenciesPage>
        <div className="py-12 text-center">
          <p style={{ color: theme.textSecondary }}>Statement not found.</p>
          <Button asChild variant="outline" className="mt-4 border" style={{ borderColor: theme.border }}>
            <Link href="/modelling/finance/statements">Back to statements</Link>
          </Button>
        </div>
      </AgenciesPage>
    )
  }

  const netMinor = statement.totalInMinor - statement.totalOutMinor

  return (
    <AgenciesPage>
      <div className="border-l-4 border-[#B8860B] pl-6 py-4" style={{ backgroundColor: isDark ? "#0a0a0a" : "#FAF8F5" }}>
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Statement {statement.periodStart} – {statement.periodEnd}</h1>
        <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>{statement.status}</p>
      </div>
      <div className="mt-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 hover:opacity-80" style={{ color: theme.textSecondary }}>
          <Link href="/modelling/finance/statements" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to statements
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Statement summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Total in</p>
                  <p className="text-xl font-semibold text-emerald-600">
                    {formatCurrency(statement.totalInMinor)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Total out</p>
                  <p className="text-xl font-semibold text-rose-600">
                    {formatCurrency(statement.totalOutMinor)}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4" style={{ borderColor: theme.border }}>
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Net</p>
                <p className="text-2xl font-bold text-[#B8860B]">
                  {formatCurrency(netMinor)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <CardHeader>
              <CardTitle style={{ color: theme.text }}>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-[#B8860B] hover:bg-[#9A7209]"
                onClick={handleDownloadPdf}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AgenciesPage>
  )
}
