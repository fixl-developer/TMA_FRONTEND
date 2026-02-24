"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { GitBranch, ArrowRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks"
import { fetchFraudPatterns } from "@/shared/state/fraudSlice"
import type { FraudPattern } from "@/shared/lib/types/fraud"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"

export default function FraudPatternsPage() {
  const dispatch = useAppDispatch()
  const { patterns, loadingPatterns } = useAppSelector((s) => s.fraud)

  useEffect(() => {
    if (!patterns.length) dispatch(fetchFraudPatterns())
  }, [dispatch, patterns.length])

  const metrics = useMemo(() => {
    const totalOccurrences = patterns.reduce((s, p) => s + (p.occurrences ?? 0), 0)
    const totalPrevented = patterns.reduce((s, p) => s + (p.preventedLoss ?? 0), 0)
    return { count: patterns.length, totalOccurrences, totalPrevented }
  }, [patterns])

  const columns: Column<FraudPattern>[] = useMemo(
    () => [
      { key: "id", header: "Pattern ID", render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
      { key: "name", header: "Name", render: (v) => <span className="text-sm font-medium">{String(v)}</span> },
      { key: "type", header: "Type", render: (v) => <span className="text-sm">{String(v)}</span> },
      { key: "confidence", header: "Confidence", render: (v) => <span className="font-medium">{Number(v)}%</span> },
      { key: "occurrences", header: "Occurrences", render: (v) => <span>{Number(v ?? 0).toLocaleString()}</span> },
      { key: "affectedEntities", header: "Affected", render: (v) => <span>{Number(v ?? 0).toLocaleString()}</span> },
      { key: "preventedLoss", header: "Prevented loss", render: (v) => v != null ? `₹${Number(v).toLocaleString()}` : "—" },
      { key: "status", header: "Status", render: (v) => <span className="rounded border border-[#107c10] bg-[#dff6dd] px-2 py-0.5 text-xs">{String(v)}</span> },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Pattern analysis"
        description="Detected patterns, types, frequency, affected entities. Seed data only."
        badge={<span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]"><GitBranch className="h-3.5 w-3.5 text-[#0078d4]" />Patterns</span>}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/fraud/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
            <Link href="/fraud/signals"><Button variant="outline" size="sm">Signals</Button></Link>
            <Link href="/fraud/models"><Button variant="outline" size="sm">Models</Button></Link>
          </div>
        }
      />
      <PageSection title="Overview">
        <MetricsGrid>
          <Card><CardHeader><CardTitle>Patterns</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingPatterns ? "—" : metrics.count}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total occurrences</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold text-[#323130]">{loadingPatterns ? "—" : metrics.totalOccurrences}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Prevented loss</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-[#107c10]">{loadingPatterns ? "—" : `₹${(metrics.totalPrevented / 100000).toFixed(1)}L`}</p></CardContent></Card>
        </MetricsGrid>
      </PageSection>
      <PageSection title="Patterns">
        <Card><CardContent className="p-0">
          {loadingPatterns ? <div className="flex items-center justify-center py-12 text-sm text-[#605e5c]">Loading…</div> : <DataTable data={patterns} columns={columns} pageSize={10} exportable exportFileName="fraud-patterns" emptyMessage="No patterns in seed." />}
        </CardContent></Card>
      </PageSection>
    </PageLayout>
  )
}
