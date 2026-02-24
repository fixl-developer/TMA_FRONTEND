"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PageLayout, PageHeader, PageSection, MetricsGrid } from "@/shared/components/layout/PageLayout"
import { Badge } from "@/shared/components/ui/badge"
import { Eye, MousePointer, Users, TrendingUp, TrendingDown } from "lucide-react"
import announcementAnalytics from "@/data/seed/announcementAnalytics.json"

export default function AnalyticsPage() {
  const analytics = announcementAnalytics

  return (
    <PageLayout>
      <PageHeader
        title="Announcement Analytics"
        subtitle="Track engagement and performance metrics"
      />

      <PageSection>
        <MetricsGrid>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#0078d4] sm:text-3xl">{analytics.overview.totalViews.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-[#107c10]" />
                <span className="text-xs text-[#107c10]">+{analytics.overview.viewsGrowth}%</span>
                <span className="text-xs text-[#605e5c]">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Click-Through Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#5c2d91] sm:text-3xl">{analytics.overview.ctr}%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-[#107c10]" />
                <span className="text-xs text-[#107c10]">+{analytics.overview.ctrGrowth}%</span>
                <span className="text-xs text-[#605e5c]">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Unique Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#107c10] sm:text-3xl">{analytics.overview.uniqueUsers.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-[#107c10]" />
                <span className="text-xs text-[#107c10]">+{analytics.overview.usersGrowth}%</span>
                <span className="text-xs text-[#605e5c]">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Avg. Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#ffb900] sm:text-3xl">{analytics.overview.avgEngagement}%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-[#d13438]" />
                <span className="text-xs text-[#d13438]">-{analytics.overview.engagementChange}%</span>
                <span className="text-xs text-[#605e5c]">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </MetricsGrid>
      </PageSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Top Performing Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPerforming.map((announcement: any, index: number) => (
                <div key={announcement.id} className="flex items-start gap-4 p-3 rounded border border-[#edebe9] bg-[#faf9f8]">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0078d4] text-white font-semibold text-xs shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-[#323130] mb-1">{announcement.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-[#605e5c]">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {announcement.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointer className="h-3 w-3" />
                        {announcement.clicks}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {announcement.ctr}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Engagement by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.engagementByType.map((type: any) => (
                <div key={type.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#605e5c]">{type.type}</span>
                    <span className="text-xs font-semibold text-[#323130]">{type.engagement}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#edebe9] rounded overflow-hidden">
                    <div 
                      className="h-full bg-[#0078d4] rounded transition-all"
                      style={{ width: `${type.engagement}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-[#605e5c]">
                    <span>{type.count} announcements</span>
                    <span>{type.totalViews.toLocaleString()} views</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Audience Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.audienceEngagement.map((audience: any) => (
                <div key={audience.audience} className="p-3 rounded border border-[#edebe9] bg-[#faf9f8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#323130]">{audience.audience}</span>
                    <Badge className="bg-[#0078d4] text-white border-[#0078d4]">
                      {audience.engagement}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-[#605e5c]">Views</p>
                      <p className="text-[#323130] font-medium">{audience.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[#605e5c]">Clicks</p>
                      <p className="text-[#323130] font-medium">{audience.clicks}</p>
                    </div>
                    <div>
                      <p className="text-[#605e5c]">CTR</p>
                      <p className="text-[#323130] font-medium">{audience.ctr}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.monthlyTrends.map((trend: any) => (
                <div key={trend.month} className="flex items-center justify-between p-3 rounded border border-[#edebe9] bg-[#faf9f8]">
                  <div>
                    <p className="text-xs font-medium text-[#323130]">{trend.month}</p>
                    <p className="text-xs text-[#605e5c]">{trend.announcements} announcements</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#323130]">{trend.views.toLocaleString()}</p>
                    <p className="text-xs text-[#605e5c]">{trend.engagement}% engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
