/**
 * Data Table Component
 * 
 * Reusable data table with sorting, pagination, row selection, and export.
 * Optimized for seed data (client-side operations).
 */

"use client"

import { useState, useMemo, ReactNode } from "react"
import { ArrowUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T) => ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  selectable?: boolean
  onRowSelect?: (selectedRows: T[]) => void
  exportable?: boolean
  exportFileName?: string
  emptyMessage?: string
  /** "agencies" for warm cream/gold theme (non-SuperAdmin) */
  variant?: "default" | "agencies"
  className?: string
}

type SortDirection = "asc" | "desc" | null

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  selectable = false,
  onRowSelect,
  exportable = false,
  exportFileName = "export",
  emptyMessage = "No data available",
  variant = "default",
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn as keyof T]
      const bVal = b[sortColumn as keyof T]

      if (aVal === bVal) return 0

      const comparison = aVal < bVal ? -1 : 1
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (columnKey: keyof T | string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((row) => row._id || String(row))))
    }
  }

  const handleSelectRow = (rowId: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId)
    } else {
      newSelected.add(rowId)
    }
    setSelectedRows(newSelected)

    if (onRowSelect) {
      const selected = data.filter((row) =>
        newSelected.has(row._id || String(row))
      )
      onRowSelect(selected)
    }
  }

  const handleExport = () => {
    const headers = columns.map((col) => col.header).join(",")
    const rows = sortedData.map((row) =>
      columns
        .map((col) => {
          const value = row[col.key as keyof T]
          return typeof value === "string" ? `"${value}"` : value
        })
        .join(",")
    )

    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${exportFileName}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const isAgencies = variant === "agencies"
  const borderCls = isAgencies ? "border-[#E7E5E4]" : "border-slate-200"
  const bgCls = isAgencies ? "bg-[#FAFAF9]" : "bg-slate-50"
  const hoverCls = isAgencies ? "hover:bg-[#FEF3C7]/30" : "hover:bg-slate-50"
  const selectedCls = isAgencies ? "bg-[#FEF3C7]/50" : "bg-blue-50"

  return (
    <Card className={cn("border", borderCls, className)}>
      <CardContent className="p-0">
        {exportable && (
          <div className={cn("flex justify-end p-3 border-b", borderCls)}>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="h-8 text-[11px] border-slate-200"
              aria-label="Export table data to CSV"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Export CSV
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table 
            className="w-full text-[11px] text-slate-700"
            role="table"
            aria-label="Data table"
          >
            <thead>
              <tr className={cn("border-b", borderCls, bgCls)}>
                {selectable && (
                  <th className="px-4 py-3 text-left" scope="col">
                    <label className="sr-only">Select all rows</label>
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        selectedRows.size === paginatedData.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-4 py-3 text-left font-semibold text-slate-700"
                    scope="col"
                  >
                    {col.sortable !== false ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1.5 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white rounded"
                        aria-label={`Sort by ${col.header}${sortColumn === col.key ? ` (${sortDirection === "asc" ? "ascending" : "descending"})` : ""}`}
                      >
                        {col.header}
                        <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                      </button>
                    ) : (
                      col.header
                    )}
                    {sortColumn === col.key && (
                      <span className="ml-1 text-[10px] text-slate-500" aria-hidden="true">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const rowId = row._id || String(idx)
                  const isSelected = selectedRows.has(rowId)

                  return (
                    <tr
                      key={rowId}
                      className={cn(
                        "border-b transition-colors",
                        borderCls,
                        isSelected ? selectedCls : hoverCls
                      )}
                    >
                      {selectable && (
                        <td className="px-4 py-3">
                          <label className="sr-only">Select row</label>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(rowId)}
                            className="rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                            aria-label={`Select row ${idx + 1}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={String(col.key)} className="px-4 py-3">
                          {col.render
                            ? col.render(row[col.key as keyof T], row)
                            : String(row[col.key as keyof T] ?? "")}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={cn("flex items-center justify-between border-t px-4 py-3", borderCls)}>
            <p className="text-[10px] text-slate-500">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
              {sortedData.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-3 text-[11px] border-slate-200"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[11px] text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-7 px-3 text-[11px] border-slate-200"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
