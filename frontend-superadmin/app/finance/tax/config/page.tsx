"use client"

import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import taxConfig from "@/data/seed/taxConfig.json"

type TaxConfig = typeof taxConfig

export default function FinanceTaxConfigPage() {
  const cfg = taxConfig as TaxConfig

  return (
    <PageLayout>
      <PageHeader
        title="Tax configuration"
        description="Tax jurisdictions, rates, rules, exemptions, and compliance settings. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <FileText className="h-3.5 w-3.5 text-[#0078d4]" />
            Tax
          </span>
        }
        actions={
          <Link href="/finance">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Finance
            </Button>
          </Link>
        }
      />

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Default jurisdiction</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{cfg.defaultJurisdiction}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Used when tenant country is not mapped explicitly.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Jurisdictions</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{cfg.jurisdictions.length}</p>
              <p className="mt-1 text-xs text-[#605e5c]">IN (GST), EU (VAT), US (Sales Tax)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Audit trail</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{cfg.compliance.storeAuditTrailYears} years</p>
              <p className="mt-1 text-xs text-[#605e5c]">Tax audit logs retention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Lock invoicing</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{cfg.compliance.lockInvoicingAfterDays} days</p>
              <p className="mt1 text-xs text-[#605e5c]">After which invoices cannot be edited</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="Jurisdictions">
        <div className="grid gap-4 md:grid-cols-3">
          {cfg.jurisdictions.map((j) => (
            <Card key={j.code}>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  {j.name} ({j.code})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[#323130]">
                <p>
                  Type: <span className="font-medium">{j.type}</span>
                </p>
                <p>
                  Standard: <span className="font-medium">{j.standardRatePercent}%</span> · Reduced:{" "}
                  <span className="font-medium">{j.reducedRatePercent}%</span> · Zero:{" "}
                  <span className="font-medium">{j.zeroRatePercent}%</span>
                </p>
                <p className="text-xs text-[#605e5c]">
                  Exempt: {j.exemptCategories.join(", ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  )
}

