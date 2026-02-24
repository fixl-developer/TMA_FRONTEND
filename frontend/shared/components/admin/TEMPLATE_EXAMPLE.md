# Admin Page Template - Microsoft 365 Style

This template shows how to quickly convert any admin page to Microsoft 365 style using reusable components.

## Basic Page Structure

```tsx
"use client"

import { useState, useEffect } from "react"
import { useTenant } from "@/shared/context/TenantContext"
import { Users, Plus, Search } from "lucide-react"
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
  AdminSearchBar,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

export default function ExamplePage() {
  const { tenantId } = useTenant()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Load data
    loadData()
  }, [tenantId])

  const loadData = async () => {
    setLoading(true)
    // Fetch data here
    setLoading(false)
  }

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminPageLayout
      title="Page Title"
      subtitle="Page description goes here"
      actions={
        <>
          <AdminButton variant="secondary" onClick={() => {}}>
            <Plus className="h-4 w-4" />
            Secondary Action
          </AdminButton>
          <AdminButton onClick={() => {}}>
            <Plus className="h-4 w-4" />
            Primary Action
          </AdminButton>
        </>
      }
    >
      {/* Stats Cards */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard
          label="Total Items"
          value={data.length}
          icon={Users}
          color="blue"
        />
        <AdminStatCard
          label="Active"
          value={42}
          icon={Users}
          color="green"
          trend={{ value: "+12%", direction: "up" }}
        />
        <AdminStatCard
          label="Pending"
          value={8}
          icon={Users}
          color="yellow"
        />
        <AdminStatCard
          label="Inactive"
          value={3}
          icon={Users}
          color="red"
        />
      </AdminStatsGrid>

      {/* Main Content Card with Table */}
      <AdminCard
        title="Data Table"
        subtitle="Manage your data"
        actions={<AdminSearchBar value={searchQuery} onChange={setSearchQuery} />}
      >
        {loading ? (
          <AdminLoading rows={5} />
        ) : filteredData.length === 0 ? (
          <AdminEmptyState
            icon={Users}
            title="No data found"
            description="Try adjusting your search or add new items"
            action={
              <AdminButton onClick={() => {}}>
                <Plus className="h-4 w-4" />
                Add Item
              </AdminButton>
            }
          />
        ) : (
          <AdminTable headers={["Name", "Status", "Date", "Actions"]}>
            {filteredData.map((item) => (
              <AdminTableRow key={item.id} onClick={() => {}}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0078d4] text-xs font-semibold text-white">
                      {item.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-[#323130]">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <AdminBadge variant={item.status === "ACTIVE" ? "success" : "warning"}>
                    {item.status}
                  </AdminBadge>
                </td>
                <td className="px-6 py-4 text-xs text-[#605e5c]">
                  {new Date(item.date).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <AdminButton size="sm" variant="ghost" onClick={(e) => { e.stopPropagation() }}>
                      View
                    </AdminButton>
                    <AdminButton size="sm" variant="danger" onClick={(e) => { e.stopPropagation() }}>
                      Delete
                    </AdminButton>
                  </div>
                </td>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </AdminPageLayout>
  )
}
```

## Component Reference

### AdminPageLayout
Main page wrapper with header
- `title`: Page title (required)
- `subtitle`: Page description (optional)
- `actions`: Action buttons in header (optional)
- `children`: Page content (required)

### AdminStatsGrid
Grid for stat cards
- `columns`: 2, 3, or 4 columns (default: 4)
- `children`: AdminStatCard components

### AdminStatCard
Stat card with icon
- `label`: Card label
- `value`: Main value to display
- `icon`: Lucide icon component
- `color`: "blue" | "green" | "yellow" | "red" | "purple"
- `subtitle`: Additional text (optional)
- `trend`: { value: string, direction: "up" | "down" } (optional)

### AdminCard
Content card with optional header
- `title`: Card title (optional)
- `subtitle`: Card subtitle (optional)
- `actions`: Action buttons (optional)
- `children`: Card content (required)

### AdminTable
Data table
- `headers`: Array of column headers
- `children`: AdminTableRow components
- `emptyState`: Empty state component (optional)

### AdminTableRow
Table row
- `children`: Table cells (td elements)
- `onClick`: Click handler (optional)

### AdminButton
Button component
- `variant`: "primary" | "secondary" | "danger" | "ghost"
- `size`: "sm" | "md" | "lg"
- `disabled`: boolean
- `onClick`: Click handler

### AdminBadge
Status badge
- `variant`: "default" | "success" | "warning" | "danger" | "info"
- `children`: Badge text

### AdminEmptyState
Empty state display
- `icon`: Lucide icon component
- `title`: Main message
- `description`: Additional text (optional)
- `action`: Action button (optional)

### AdminSearchBar
Search input
- `value`: Current search value
- `onChange`: Change handler
- `placeholder`: Placeholder text (optional)

### AdminLoading
Loading skeleton
- `rows`: Number of skeleton rows (default: 4)

## Color Palette

- Primary Blue: `#0078d4`
- Success Green: `#107c10`
- Warning Yellow: `#ffb900`
- Danger Red: `#d13438`
- Purple: `#8764b8`
- Dark Text: `#323130`
- Medium Text: `#605e5c`
- Light Text: `#a19f9d`
- Background: `#faf9f8`
- Border: `#edebe9`
- Hover: `#f3f2f1`

## Typography

- Page Title: `text-2xl font-semibold text-[#323130]`
- Card Title: `text-base font-semibold text-[#323130]`
- Subtitle: `text-xs text-[#605e5c]`
- Body Text: `text-xs text-[#323130]`
- Table Header: `text-xs font-semibold text-[#605e5c]`
- Stat Value: `text-2xl font-semibold text-[#323130]`
