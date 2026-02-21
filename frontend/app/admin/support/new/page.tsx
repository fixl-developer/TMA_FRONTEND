"use client"

import { useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { HelpCircle, ChevronLeft } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"

export default function NewSupportCasePage() {
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("TECHNICAL")
  const [priority, setPriority] = useState("MEDIUM")
  const [description, setDescription] = useState("")

  return (
    <AgenciesPage>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/support">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
            <ChevronLeft className="mr-1 h-4 w-4" /> Support
          </Button>
        </Link>
        <PageBanner
          title="New support case"
          subtitle="Submit a support request."
          variant="admin"
          backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" /> Case details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="TECHNICAL">Technical</option>
              <option value="PAYMENT">Payment</option>
              <option value="FEATURE">Feature request</option>
              <option value="BILLING">Billing</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400" disabled>
              Submit (UI only)
            </Button>
            <Link href="/admin/support">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AgenciesPage>
  )
}
