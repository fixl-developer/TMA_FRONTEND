"use client"

import { useState } from "react"
import { BarChart3, Download, Plus, FileText, TrendingUp, Users, DollarSign } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminTable,
  AdminTableRow,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/shared/components/admin/AdminPageLayout"

const SAVED_REPORTS = [
  { id: "1", name: "Monthly Revenue Report", type: "Revenue", lastRun: "2024-01-15", status: "Completed" },
  { id: "2", name: "Talent Activity Summary", type: "Talent", lastRun: "2024-01-14", status: "Completed" },
  { id: "3", name: "Lead Conversion Analysis", type: "CRM", lastRun: "2024-01-13", status: "Completed" },
]

export default function ReportsPage() {
  const [reports] = useState(SAVED_REPORTS)

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Reports"
        subtitle="Generate and view business intelligence reports"
        actions={
        <AdminButton>
          <Plus className="h-4 w-4" />
          Create Report
        </AdminButton>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Total Reports" value={reports.length} icon={FileText} color="purple" />
        <AdminStatCard label="Revenue Reports" value="1" icon={DollarSign} color="green" />
        <AdminStatCard label="Talent Reports" value="1" icon={Users} color="blue" />
        <AdminStatCard label="CRM Reports" value="1" icon={TrendingUp} color="yellow" />
      </AdminStatsGrid>

      {/* Quick Report Templates */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#323130] mb-4">Quick Templates</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Revenue Report", icon: DollarSign, color: "#107c10" },
            { label: "Bookings Report", icon: BarChart3, color: "#0078d4" },
            { label: "Talent Activity", icon: Users, color: "#8764b8" },
            { label: "Lead Analysis", icon: TrendingUp, color: "#ffb900" },
          ].map((template) => {
            const Icon = template.icon
            return (
              <div
                key={template.label}
                className="group rounded border border-[#edebe9] bg-white p-4 transition-all hover:border-[#0078d4] hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5" style={{ color: template.color }} />
                  <p className="text-sm font-semibold text-[#323130]">{template.label}</p>
                </div>
                <AdminButton size="sm" variant="ghost">
                  Generate
                </AdminButton>
              </div>
            )
          })}
        </div>
      </div>

      {/* Saved Reports */}
      <AdminCard
        title="Saved Reports"
        actions={
          <AdminButton size="sm" variant="secondary">
            <Download className="h-4 w-4" />
            Export All
          </AdminButton>
        }
      >
        {reports.length === 0 ? (
          <AdminEmptyState
            icon={FileText}
            title="No reports yet"
            description="Create your first report to get started"
            action={
              <AdminButton>
                <Plus className="h-4 w-4" />
                Create Report
              </AdminButton>
            }
          />
        ) : (
          <AdminTable headers={["Report Name", "Type", "Last Run", "Status", "Actions"]}>
            {reports.map((report) => (
              <AdminTableRow key={report.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#0078d4]" />
                    <span className="text-xs font-semibold text-[#323130]">{report.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">{report.type}</td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {new Date(report.lastRun).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant="success">{report.status}</AdminBadge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <AdminButton size="sm" variant="ghost">
                      View
                    </AdminButton>
                    <AdminButton size="sm" variant="ghost">
                      <Download className="h-3 w-3" />
                    </AdminButton>
                  </div>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
