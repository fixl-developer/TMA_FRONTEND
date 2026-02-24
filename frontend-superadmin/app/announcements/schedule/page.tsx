"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Search, Calendar, Clock, Edit, Trash2 } from "lucide-react"
import announcements from "@/data/seed/announcements.json"

export default function SchedulePage() {
  const [searchTerm, setSearchTerm] = useState("")

  const scheduledAnnouncements = announcements.filter((a: any) => a.status === "scheduled")
  const filtered = scheduledAnnouncements.filter((a: any) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-[#0078d4] text-white border-[#0078d4]"
      default: return "bg-[#a19f9d] text-white border-[#a19f9d]"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-[#d13438]"
      case "high": return "text-[#e74856]"
      case "medium": return "text-[#ffb900]"
      case "low": return "text-[#107c10]"
      default: return "text-[#605e5c]"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Scheduled Announcements"
        subtitle="Manage upcoming platform announcements"
      />

      <PageSection>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#605e5c]" />
            <Input
              placeholder="Search scheduled announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((announcement: any) => (
            <Card key={announcement.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-[#323130]">{announcement.title}</h3>
                      <Badge className={getStatusColor(announcement.status)}>
                        {announcement.status}
                      </Badge>
                      <span className={`text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#605e5c] mb-4">{announcement.message}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#605e5c]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Scheduled: {announcement.scheduledDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{announcement.scheduledTime}</span>
                      </div>
                      <div>
                        <Badge variant="outline">
                          {announcement.targetAudience}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant="outline">
                          {announcement.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 rounded border border-[#edebe9] bg-[#faf9f8] hover:bg-[#f3f2f1] text-[#0078d4] transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded border border-[#edebe9] bg-[#faf9f8] hover:bg-[#f3f2f1] text-[#d13438] transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-[#a19f9d] mx-auto mb-4" />
                <p className="text-[#605e5c]">No scheduled announcements found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </PageSection>
    </PageLayout>
  )
}
