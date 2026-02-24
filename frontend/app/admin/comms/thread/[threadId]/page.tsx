"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  getThreadById,
  getMessagesByThread,
  getObjectTypeLabel,
  getUserById,
} from "@/shared/services/commsService"
import { MessageSquare, User } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard, AdminButton } from "@/shared/components/admin/AdminPageLayout"
import { format } from "date-fns"

export default function ThreadDetailPage() {
  const params = useParams()
  const threadId = params?.threadId as string
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
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading thread…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title={thread.subject}
        subtitle={`${getObjectTypeLabel(thread.objectType)} · ${thread.objectId}`}
        actions={
          <Link href="/admin/comms">
            <AdminButton variant="outline">← Threads</AdminButton>
          </Link>
        }
      >
        <AdminCard>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-[#d4ff00]" />
            <h3 className="text-lg font-semibold text-white">Messages ({messages.length})</h3>
          </div>
          {messages.length === 0 ? (
            <p className="py-8 text-center text-white/60">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                const author = users[m.authorId]
                return (
                  <div
                    key={m._id}
                    className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4ff00]/20">
                      <User className="h-4 w-4 text-[#d4ff00]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white">
                          {author?.name ?? m.authorId}
                        </span>
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/60">
                          {m.authorRole}
                        </span>
                        <span className="text-xs text-white/40">
                          {m.createdAt && format(new Date(m.createdAt), "MMM d, HH:mm")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/60">{m.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </AdminCard>

        <div className="mt-6">
          <AdminButton variant="outline" disabled>
            Add message (coming soon)
          </AdminButton>
        </div>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
