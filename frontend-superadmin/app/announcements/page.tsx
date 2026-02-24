"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Megaphone, Users, Eye, Clock, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import announcements from "@/data/seed/announcements.json"
import announcementStats from "@/data/seed/announcementStats.json"

export default function AnnouncementsPage() {
  const stats = announcementStats
  const activeAnnouncements = announcements.filter((a: any) => a.status === "active").slice(0, 6)
  const scheduledAnnouncements = announcements.filter((a: any) => a.status === "scheduled").slice(0, 4)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-[#107c10] text-white border-[#107c10]"
      case "scheduled": return "bg-[#0078d4] text-white border-[#0078d4]"
      case "draft": return "bg-[#605e5c] text-white border-[#605e5c]"
      case "expired": return "bg-[#d13438] text-white border-[#d13438]"
      default: return "bg-[#605e5c] text-white border-[#605e5c]"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-[#d13438]"
      case "high": return "text-[#f7630c]"
      case "medium": return "text-[#ffb900]"
      case "low": return "text-[#107c10]"
      default: return "text-[#605e5c]"
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title="Platform Announcements"
        subtitle="Manage system-wide announcements and notifications"
      />

      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Active Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#107c10] sm:text-3xl">{stats.activeCount}</p>
              <p className="text-xs text-[#605e5c] mt-1">Currently visible</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4] sm:text-3xl">{stats.totalReach.toLocaleString()}</p>
              <p className="text-xs text-[#605e5c] mt-1">Users reached today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#8661c5] sm:text-3xl">{stats.engagementRate}%</p>
              <p className="text-xs text-[#605e5c] mt-1">Click-through rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#ffb900] sm:text-3xl">{stats.scheduledCount}</p>
              <p className="text-xs text-[#605e5c] mt-1">Upcoming announcements</p>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Active Announcements
                <Link href="/announcements/create" className="text-sm text-[#0078d4] hover:text-[#106ebe]">
                  Create New →
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeAnnouncements.map((announcement: any) => (
                  <div key={announcement.id} className="p-4 rounded border border-[#edebe9] bg-[#faf9f8] hover:border-[#0078d4] hover:bg-[#f3f2f1] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-[#323130]">{announcement.title}</h3>
                          <Badge className={getStatusColor(announcement.status)}>
                            {announcement.status}
                          </Badge>
                          <span className={`text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-xs text-[#605e5c] line-clamp-2">{announcement.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#edebe9]">
                      <div className="flex items-center gap-4 text-xs text-[#605e5c]">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {announcement.targetAudience}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {announcement.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {announcement.clicks} clicks
                        </span>
                      </div>
                      <span className="text-xs text-[#605e5c]">{announcement.publishedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Scheduled Announcements
                <Link href="/announcements/schedule" className="text-sm text-[#0078d4] hover:text-[#106ebe]">
                  View All →
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledAnnouncements.map((announcement: any) => (
                  <div key={announcement.id} className="p-4 rounded border border-[#edebe9] bg-[#faf9f8] hover:bg-[#f3f2f1] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-[#323130]">{announcement.title}</h3>
                          <Badge className={getStatusColor(announcement.status)}>
                            {announcement.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#605e5c] line-clamp-1">{announcement.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#edebe9] text-xs text-[#605e5c]">
                      <Calendar className="h-3 w-3" />
                      <span>Scheduled for: {announcement.scheduledDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/announcements/create" className="block p-3 bg-[#0078d4] hover:bg-[#106ebe] rounded transition-colors">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-5 w-5 text-white" />
                  <div>
                    <p className="text-sm font-medium text-white">Create Announcement</p>
                    <p className="text-xs text-white/80">New platform message</p>
                  </div>
                </div>
              </Link>

              <Link href="/announcements/schedule" className="block p-3 rounded border border-[#edebe9] bg-[#faf9f8] hover:border-[#0078d4] hover:bg-[#f3f2f1] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#ffb900]" />
                    <div>
                      <p className="text-sm font-medium text-[#323130]">Schedule</p>
                      <p className="text-xs text-[#605e5c]">Plan future messages</p>
                    </div>
                  </div>
                  <span className="text-[#605e5c]">→</span>
                </div>
              </Link>

              <Link href="/announcements/analytics" className="block p-3 rounded border border-[#edebe9] bg-[#faf9f8] hover:border-[#0078d4] hover:bg-[#f3f2f1] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-[#107c10]" />
                    <div>
                      <p className="text-sm font-medium text-[#323130]">Analytics</p>
                      <p className="text-xs text-[#605e5c]">View performance</p>
                    </div>
                  </div>
                  <span className="text-[#605e5c]">→</span>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.audienceBreakdown.map((audience: any) => (
                  <div key={audience.type} className="flex items-center justify-between">
                    <span className="text-sm text-[#605e5c]">{audience.type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#edebe9] rounded overflow-hidden">
                        <div 
                          className="h-full bg-[#0078d4] rounded"
                          style={{ width: `${audience.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#323130] w-12 text-right">{audience.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
