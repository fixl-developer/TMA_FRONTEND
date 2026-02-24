"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Save, Send, Eye, Calendar } from "lucide-react"
import announcementTemplates from "@/data/seed/announcementTemplates.json"

export default function CreateAnnouncementPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("medium")
  const [targetAudience, setTargetAudience] = useState("all_users")
  const [type, setType] = useState("info")

  return (
    <PageLayout>
      <PageHeader
        title="Create Announcement"
        subtitle="Compose and publish platform-wide announcements"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Announcement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <Input
                  placeholder="Enter announcement title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  placeholder="Enter announcement message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="feature">New Feature</option>
                    <option value="security">Security</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all_users">All Users</option>
                  <option value="tenant_owners">Tenant Owners</option>
                  <option value="admins">Admins Only</option>
                  <option value="specific_blueprint">Specific Blueprint</option>
                  <option value="specific_tenant">Specific Tenant</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Send className="h-4 w-4" />
                  Publish Now
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors">
                  <Save className="h-4 w-4" />
                  Save Draft
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {announcementTemplates.map((template: any) => (
                  <button
                    key={template.id}
                    className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 transition-colors text-left"
                    onClick={() => {
                      setTitle(template.title)
                      setMessage(template.message)
                      setPriority(template.priority)
                      setType(template.type)
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-slate-800">{template.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {template.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{template.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                {title ? (
                  <>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">{title}</h3>
                    <p className="text-xs text-slate-600">{message || "Your message will appear here..."}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                      <Badge variant="outline" className="text-xs">
                        {priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">
                    Start typing to see preview
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estimated Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-800">12,847</p>
                <p className="text-sm text-slate-500 mt-1">Users will see this announcement</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
