"use client"

import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import gstConfig from "@/data/seed/gstConfig.json"

type GstConfig = typeof gstConfig

export default function FinanceGstPage() {
  const cfg = gstConfig as GstConfig

  return (
    <PageLayout>
      <PageHeader
        title="GST compliance (India)"
        description="GST configuration, GSTIN management, and GST reporting overview (seed UI)."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <FileText className="h-3.5 w-3.5 text-[#0078d4]" />
            GST
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
            <CardHeader><CardTitle className="text-sm font-semibold">Jurisdiction</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">{cfg.jurisdiction}</p>
              <p className="mt-1 text-xs text-[#605e5c]">India GST</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Filing frequency</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#323130]">
                {cfg.filingFrequency.charAt(0).toUpperCase() + cfg.filingFrequency.slice(1)}
              </p>
              <p className="mt-1 text-xs text-[#605e5c]">Next due: {cfg.nextFilingDue}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Registrations</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[#107c10]">{cfg.gstinRegistrations.length}</p>
              <p className="mt-1 text-xs text-[#605e5c]">Active GSTINs in seed data</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection title="GSTIN registrations">
        <Card>
          <CardContent className="pt-4 text-sm text-[#323130]">
            <div className="space-y-3">
              {cfg.gstinRegistrations.map((g) => (
                <div
                  key={g.gstin}
                  className="flex items-center justify-between rounded border border-[#edebe9] bg-[#faf9f8] px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#323130]">{g.tenantName}</p>
                    <p className="font-mono text-xs text-[#605e5c]">{g.gstin}</p>
                  </div>
                  <div className="text-right text-xs text-[#605e5c]">
                    <p>State: {g.stateCode}</p>
                    <p>Status: {g.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}

