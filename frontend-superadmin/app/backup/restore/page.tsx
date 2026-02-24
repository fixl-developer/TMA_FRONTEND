"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { History, ArrowLeft, RotateCcw } from "lucide-react"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import backupJobs from "@/data/seed/backupJobs.json"

type BackupJob = (typeof backupJobs)[number]

export default function BackupRestorePage() {
  const jobs = backupJobs as BackupJob[]
  const completed = useMemo(
    () => jobs.filter((j) => j.status === "SUCCESS" && j.snapshotId),
    [jobs]
  )
  const [selected, setSelected] = useState<BackupJob | null>(completed[0] ?? null)

  const columns: Column<BackupJob>[] = useMemo(
    () => [
      {
        key: "snapshotId",
        header: "Snapshot",
        render: (v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{String(v ?? row._id)}</p>
            <p className="text-xs text-[#605e5c]">
              {new Date(String(row.completedAt)).toLocaleString("en-IN")}
            </p>
          </div>
        ),
      },
      {
        key: "sizeGb",
        header: "Size",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">
            {v != null ? `${Number(v).toFixed(1)} GB` : "—"}
          </span>
        ),
      },
      {
        key: "durationSeconds",
        header: "Duration",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">
            {v != null ? `${Math.round(Number(v) / 60)} min` : "—"}
          </span>
        ),
      },
      {
        key: "_id",
        header: "Actions",
        sortable: false,
        render: (_v, row) => (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-[#0078d4]"
            onClick={() => setSelected(row)}
          >
            Select
          </Button>
        ),
      },
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Restore"
        description="Available backups and restore wizard (UI placeholder). Supports point-in-time recovery in a later phase."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <History className="h-3.5 w-3.5 text-[#0078d4]" />
            Restore
          </span>
        }
        actions={
          <Link href="/backup/config">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Config
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PageSection title="Available backups">
            <Card>
              <CardContent className="p-0">
                <DataTable
                  data={completed}
                  columns={columns}
                  pageSize={10}
                  exportable
                  exportFileName="backup-snapshots"
                  emptyMessage="No completed backups available."
                />
              </CardContent>
            </Card>
          </PageSection>
        </div>

        <div>
          <PageSection title="Restore wizard">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-[#0078d4]" />
                  Selected snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#323130]">
                {selected ? (
                  <>
                    <div>
                      <p className="text-xs font-medium text-[#605e5c]">Snapshot</p>
                      <p className="font-mono text-xs">{selected.snapshotId ?? selected._id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#605e5c]">Completed at</p>
                      <p>{new Date(String(selected.completedAt)).toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#605e5c]">Size</p>
                      <p>{selected.sizeGb ? `${selected.sizeGb.toFixed(1)} GB` : "—"}</p>
                    </div>
                    <Button size="sm" className="w-full bg-[#0078d4] hover:bg-[#106ebe]">
                      Start restore (placeholder)
                    </Button>
                    <p className="text-xs text-[#605e5c]">
                      In production this will call{" "}
                      <span className="font-mono text-xs">POST /v1/superadmin/backup/restore</span> with the snapshot id and
                      restore target.
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-[#605e5c]">Select a snapshot from the table to simulate a restore.</p>
                )}
              </CardContent>
            </Card>
          </PageSection>
        </div>
      </div>
    </PageLayout>
  )
}

