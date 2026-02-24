/**
 * Advanced Audit Search
 *
 * Advanced search interface with multiple filters and date range selection.
 */

"use client"

import Link from "next/link"
import { ArrowLeft, Search, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

export default function AuditSearchPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Advanced Audit Search"
        description="Search audit logs with advanced filters"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            <Search className="h-3.5 w-3.5 text-blue-500" />
            Advanced Search
          </span>
        }
        actions={
          <Link
            href="/superadmin/audit"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      <PageSection title="Search criteria">
        <Card>
          <CardHeader>
            <CardTitle>Filter audit events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Event Type</label>
                  <Input placeholder="e.g., user.login, payment.failed" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Actor Name/Email</label>
                  <Input placeholder="Search by user name or email" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Date From</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Date To</label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm">
                    <option>All Categories</option>
                    <option>Authentication</option>
                    <option>Financial</option>
                    <option>Security</option>
                    <option>Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Severity</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm">
                    <option>All Severities</option>
                    <option>Critical</option>
                    <option>Error</option>
                    <option>Warning</option>
                    <option>Info</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Result</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm">
                    <option>All Results</option>
                    <option>Success</option>
                    <option>Failure</option>
                    <option>Blocked</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline">Clear Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Search results">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-slate-500">
              Enter search criteria and click Search to view results
            </p>
          </CardContent>
        </Card>
      </PageSection>
    </PageLayout>
  )
}
