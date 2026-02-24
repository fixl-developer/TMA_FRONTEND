"use client"

import { useState } from "react"
import Link from "next/link"
import { HelpCircle, ArrowLeft } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function NewSupportCasePage() {
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("TECHNICAL")
  const [priority, setPriority] = useState("MEDIUM")
  const [description, setDescription] = useState("")

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="New support case"
        subtitle="Submit a support request"
        action={
          <Link href="/admin/support">
            <AdminButton variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Support
            </AdminButton>
          </Link>
        }
      />

      <AdminCard>
        <div className="mb-6 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Case details</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="subject" className="mb-1 block text-sm font-medium text-white">Subject</label>
            <input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-white">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="TECHNICAL">Technical</option>
              <option value="PAYMENT">Payment</option>
              <option value="FEATURE">Feature request</option>
              <option value="BILLING">Billing</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="mb-1 block text-sm font-medium text-white">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-white">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details..."
              rows={4}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <AdminButton variant="primary" disabled>
              Submit (UI only)
            </AdminButton>
            <Link href="/admin/support">
              <AdminButton variant="secondary">Cancel</AdminButton>
            </Link>
          </div>
        </div>
      </AdminCard>
    </AdminPageWrapper>
  )
}
