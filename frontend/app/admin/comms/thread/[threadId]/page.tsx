"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getThreadById,
  getMessagesByThread,
  getObjectTypeLabel,
  getUserById,
} from "@/shared/services/commsService"
import { MessageSquare, User } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { format } from "date-fns"

export default function ThreadDetailPage() {
  const params = useParams()
  const threadId = params?.threadId as string
  const { page } = useDashboardTheme()
  const [thread, setThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [users, setUsers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!threadId) return
    getThreadById(threadId).then(async (t) => {
      setThread(t)
      const msgs = await getMessagesByThread(threadId)
      setMessages(msgs)
      const authorIds = [...new Set(msgs.map((m) => m.authorId))]
      const userMap: Record<string, any> = {}
      for (const uid of authorIds) {
        const u = await getUserById(uid)
        if (u) userMap[uid] = u
      }
      setUsers(userMap)
      setLoading(false)
    })
  }, [threadId])

  if (loading || !thread) {
    return (
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading thread…</p>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={thread.subject}
        subtitle={`${getObjectTypeLabel(thread.objectType)} · ${thread.objectId}`}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/comms">
          <Button variant="ghost" size="sm">
            ← Threads
          </Button>
        </Link>
      </div>

      <Card className="mt-6" style={{ borderColor: page.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="py-8 text-center text-slate-500">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                const author = users[m.authorId]
                return (
                  <div
                    key={m._id}
                    className="flex gap-3 rounded-lg border p-3"
                    style={{ borderColor: page.border }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm" style={{ color: page.text }}>
                          {author?.name ?? m.authorId}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                          {m.authorRole}
                        </span>
                        <span className="text-xs text-slate-400">
                          {m.createdAt && format(new Date(m.createdAt), "MMM d, HH:mm")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{m.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button variant="outline" disabled>
          Add message (coming soon)
        </Button>
      </div>
    </AgenciesPage>
  )
}
