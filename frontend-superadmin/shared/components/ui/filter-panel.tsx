/**
 * Filter Panel Component
 * 
 * Reusable filter panel with date range, multi-select, search, and filter chips.
 */

"use client"

import React, { useState, useMemo, useCallback, memo, useEffect } from "react"
import { X, Search, Calendar } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { useDebounce } from "@/shared/hooks/use-debounce"
import { cn } from "@/shared/lib/utils"

export interface FilterOption {
  value: string
  label: string
}

export interface DateRange {
  start: Date | null
  end: Date | null
}

interface FilterPanelProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange) => void
  multiSelectFilters?: Array<{
    key: string
    label: string
    options: FilterOption[]
    selected: string[]
    onSelectionChange: (selected: string[]) => void
  }>
  onClearAll?: () => void
}

export const FilterPanel = memo(function FilterPanel({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  dateRange,
  onDateRangeChange,
  multiSelectFilters = [],
  onClearAll,
}: FilterPanelProps) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue)
  const debouncedSearchValue = useDebounce(localSearchValue, 300)

  // Sync debounced value with parent
  useEffect(() => {
    if (debouncedSearchValue !== searchValue && onSearchChange) {
      onSearchChange(debouncedSearchValue)
    }
  }, [debouncedSearchValue, searchValue, onSearchChange])

  const hasActiveFilters = useMemo(() => {
    const hasSearch = searchValue.length > 0
    const hasDateRange =
      dateRange && (dateRange.start !== null || dateRange.end !== null)
    const hasMultiSelect = multiSelectFilters.some(
      (f) => f.selected.length > 0
    )

    return hasSearch || hasDateRange || hasMultiSelect
  }, [searchValue, dateRange, multiSelectFilters])

  const handleClearAll = useCallback(() => {
    setLocalSearchValue("")
    if (onSearchChange) onSearchChange("")
    if (onDateRangeChange) onDateRangeChange({ start: null, end: null })
    multiSelectFilters.forEach((f) => f.onSelectionChange([]))
    if (onClearAll) onClearAll()
  }, [onSearchChange, onDateRangeChange, multiSelectFilters, onClearAll])

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchValue(value)
  }, [])

  return (
    <Card role="region" aria-label="Filter panel">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold" id="filter-panel-title">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearAll}
              className="h-7 px-2 text-[10px] text-slate-500 hover:text-slate-700"
              aria-label="Clear all filters"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4" aria-labelledby="filter-panel-title">
        {/* Search */}
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              placeholder={searchPlaceholder}
              value={localSearchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-9 text-[11px] bg-white border-slate-200"
              aria-label="Search input"
            />
          </div>
        )}

        {/* Date Range */}
        {onDateRangeChange && (
          <div className="space-y-2">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide" htmlFor="date-start">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="date-start" className="sr-only">Start date</label>
                <input
                  id="date-start"
                  type="date"
                  value={
                    dateRange?.start
                      ? dateRange.start.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    onDateRangeChange({
                      start: e.target.value ? new Date(e.target.value) : null,
                      end: dateRange?.end || null,
                    })
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                  aria-label="Start date"
                />
              </div>
              <div>
                <label htmlFor="date-end" className="sr-only">End date</label>
                <input
                  id="date-end"
                  type="date"
                  value={
                    dateRange?.end
                      ? dateRange.end.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    onDateRangeChange({
                      start: dateRange?.start || null,
                      end: e.target.value ? new Date(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
                  aria-label="End date"
                />
              </div>
            </div>
          </div>
        )}

        {/* Multi-select Filters */}
        {multiSelectFilters.map((filter) => (
          <div key={filter.key} className="space-y-2">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide" id={`filter-${filter.key}-label`}>
              {filter.label}
            </label>
            <div 
              className="flex flex-wrap gap-2" 
              role="group" 
              aria-labelledby={`filter-${filter.key}-label`}
            >
              {filter.options.map((option) => {
                const isSelected = filter.selected.includes(option.value)
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      const newSelected = isSelected
                        ? filter.selected.filter((v) => v !== option.value)
                        : [...filter.selected, option.value]
                      filter.onSelectionChange(newSelected)
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[10px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white",
                      isSelected
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300"
                    )}
                    aria-pressed={isSelected}
                    aria-label={`${option.label} filter${isSelected ? " (selected)" : ""}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
            {searchValue && (
              <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-700">
                <span>Search: {searchValue}</span>
                <button
                  onClick={() => onSearchChange?.("")}
                  className="hover:text-slate-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {dateRange &&
              (dateRange.start || dateRange.end) &&
              (() => {
                const startStr = dateRange.start
                  ? dateRange.start.toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })
                  : "..."
                const endStr = dateRange.end
                  ? dateRange.end.toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })
                  : "..."
                return (
                  <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-700">
                    <span>
                      Date: {startStr} → {endStr}
                    </span>
                    <button
                      onClick={() =>
                        onDateRangeChange?.({ start: null, end: null })
                      }
                      className="hover:text-slate-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })()}
            {multiSelectFilters.map((filter) =>
              filter.selected.map((value) => {
                const option = filter.options.find((o) => o.value === value)
                return (
                  <div
                    key={`${filter.key}-${value}`}
                    className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-700"
                  >
                    <span>
                      {filter.label}: {option?.label || value}
                    </span>
                    <button
                      onClick={() => {
                        filter.onSelectionChange(
                          filter.selected.filter((v) => v !== value)
                        )
                      }}
                      className="hover:text-slate-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
})

FilterPanel.displayName = "FilterPanel"
