"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  getGroupById,
  getGroupMembers,
  isUserInGroup,
  joinGroup,
  leaveGroup,
  type CommunityGroup,
} from "@/shared/services/communityService"
import { Users2, Lock, LogIn, LogOut } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import { AdminPageLayout, AdminCard, AdminButton } from "@/shared/components/admin/AdminPageLayout"
import { useTenant } from "@/shared/context/TenantContext"

const DEMO_USER = "user_001"

export default function GroupDetailPage() {
  const params = useParams()
  const { tenantId } = useTenant()
  const id = params.id as string
  const [group, setGroup] = useState<CommunityGroup | null>(null)
  const [members, setMembers] = useState<{ userId: string }[]>([])
  const [isMember, setIsMember] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([
      getGroupById(id, tenantId ?? "tenant_001"),
      getGroupMembers(id),
      isUserInGroup(id, DEMO_USER),
    ]).then(([g, m, member]) => {
      setGroup(g ?? null)
      setMembers(m)
      setIsMember(member)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [id, tenantId])

  const handleJoin = async () => {
    await joinGroup(id, DEMO_USER)
    setIsMember(true)
    load()
  }

  const handleLeave = async () => {
    await leaveGroup(id, DEMO_USER)
    setIsMember(false)
    load()
  }

  if (loading || !group) {
    return (
      <AdminPageWrapper>
        <p className="py-12 text-center text-white/60">Loading…</p>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title={group.name}
        subtitle={group.description}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/community/groups">
              <AdminButton variant="outline">← Back to Groups</AdminButton>
            </Link>
            {isMember ? (
              <AdminButton
                variant="outline"
                className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                onClick={handleLeave}
              >
                <LogOut className="mr-1.5 h-4 w-4" /> Leave group
              </AdminButton>
            ) : (
              <AdminButton onClick={handleJoin}>
                <LogIn className="mr-1.5 h-4 w-4" /> Join group
              </AdminButton>
            )}
          </div>
        }
      >
        <AdminCard>
          <div className="flex items-center gap-2 mb-4">
            <Users2 className="h-5 w-5 text-[#d4ff00]" />
            <h3 className="text-lg font-semibold text-white">{group.name}</h3>
            {group.isPrivate && (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                <Lock className="h-3 w-3" /> Private
              </span>
            )}
          </div>
          <p className="text-sm text-white/60 mb-4">{group.description}</p>
          <p className="text-sm text-white/60">
            {members.length} members
            {isMember && (
              <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                You are a member
              </span>
            )}
          </p>
        </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
