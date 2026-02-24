"use client"

import { useMemo } from "react"
import Link from "next/link"
import { CalendarClock, ArrowLeft } from "lucide-react"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { FilterPanel, type FilterOption } from "@/shared/components/ui/filter-panel"
import { DataTable, type Column } from "@/shared/components/ui/data-table"
import backupJobs from "@/data/seed/backupJobs.json"

type BackupJob = (typeof backupJobs)[number]

const STATUS_OPTIONS: FilterOption[] = [
  { value: "PENDING", label: "Pending" },
  { value: "RUNNING", label: "Running" },
  { value: "SUCCESS", label: "Success" },
  { value: "FAILED", label: "Failed" },
]

export default function BackupSchedulePage() {
  const jobs = backupJobs as BackupJob[]
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  const filtered = useMemo(() => {
    let result = jobs
    if (statusFilter.length > 0) result = result.filter((j) => statusFilter.includes(j.status))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((j) => j._id.toLowerCase().includes(q) || (j.snapshotId ?? "").toLowerCase().includes(q))
    }
    return result
  }, [jobs, statusFilter, searchQuery])

  const metrics = useMemo(() => {
    const upcoming = jobs.filter((j) => j.status === "PENDING").length
    const failed = jobs.filter((j) => j.status === "FAILED").length
    const lastSuccess = jobs.find((j) => j.status === "SUCCESS")
    return { total: jobs.length, upcoming, failed, lastSuccess }
  }, [jobs])

  const columns: Column<BackupJob>[] = useMemo(
    () => [
      {
        key: "_id",
        header: "Job",
        render: (v, row) => (
          <div>
            <p className="text-sm font-semibold text-[#323130]">{String(v)}</p>
            <p className="text-xs text-[#605e5c]">{row.type}</p>
          </div>
        ),
      },
      {
        key: "scheduledAt",
        header: "Scheduled",
        render: (v) => (
          <span className="text-sm text-[#605e5c]">
            {new Date(String(v)).toLocaleString("en-IN")}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (v) => {
          const s = String(v)
          const cls =
            s === "PENDING"
              ? "border-[#ffb900] bg-[#fff4ce] text-[#323130]"
              : s === "SUCCESS"
                ? "border-[#107c10] bg-[#dff6dd] text-[#107c10]"
                : s === "FAILED"
                  ? "border-[#a80000] bg-[#fde7e9] text-[#a80000]"
                  : "border-[#605e5c] bg-[#f3f2f1] text-[#605e5c]"
          return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>{s}</span>
        },
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
    ],
    []
  )

  return (
    <PageLayout>
      <PageHeader
        title="Backup schedule"
        description="Scheduled backups, backup calendar, status tracking, and error handling. Seed data only."
        badge={
          <span className="inline-flex items-center gap-1.5 rounded border border-[#edebe9] bg-white px-2.5 py-1 text-xs font-medium text-[#605e5c]">
            <CalendarClock className="h-3.5 w-3.5 text-[#0078d4]" />
            Schedule
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

      <PageSection title="Overview">
        <MetricsGrid>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Total jobs</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#323130]">{jobs.length}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Upcoming</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#0078d4]">{metrics.upcoming}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Failed</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-semibold text-[#a80000]">{metrics.failed}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold">Last success</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-[#605e5c]">
                {metrics.lastSuccess
                  ? new Date(metrics.lastSuccess.completedAt as string).toLocaleString("en-IN")
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <PageSection
        title="Jobs"
        description={filtered.length !== jobs.length ? `${filtered.length} of ${jobs.length} shown` : undefined}
      >
        <div className="space-y-3">
          <FilterPanel
            searchPlaceholder="Search by job id or snapshot id..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            multiSelectFilters={[
              { key: "status", label: "Status", options: STATUS_OPTIONS, selected: statusFilter, onSelectionChange: setStatusFilter },
            ]}
            onClearAll={() => {
              setSearchQuery("")
              setStatusFilter([])
            }}
          />
          <Card>
            <CardContent className="p-0">
              <DataTable
                data={filtered}
                columns={columns}
                pageSize={10}
                exportable
                exportFileName="backup-jobs"
                emptyMessage="No backup jobs match the filters."
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}

