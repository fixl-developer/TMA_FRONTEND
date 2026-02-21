"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getGroupById,
  getGroupMembers,
  isUserInGroup,
  joinGroup,
  leaveGroup,
  type CommunityGroup,
} from "@/shared/services/communityService"
import { Users2, Lock, LogIn, LogOut } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { useTenant } from "@/shared/context/TenantContext"

const DEMO_USER = "user_001"

export default function GroupDetailPage() {
  const params = useParams()
  const { page } = useDashboardTheme()
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
      <AgenciesPage>
        <p className="py-12 text-center text-slate-500">Loading…</p>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <div className="mb-6">
        <Link
          href="/admin/community/groups"
          className="text-sm font-medium hover:opacity-90"
          style={{ color: page.accent }}
        >
          ← Back to Groups
        </Link>
      </div>
      <PageBanner
        title={group.name}
        subtitle={group.description}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
      />
      <section className="mt-8 min-w-0">
        <Card style={{ borderColor: page.border }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className="h-5 w-5" style={{ color: page.accent }} />
              <CardTitle>{group.name}</CardTitle>
              {group.isPrivate && (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  <Lock className="h-3 w-3" /> Private
                </span>
              )}
            </div>
            {isMember ? (
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleLeave}
              >
                <LogOut className="mr-1.5 h-4 w-4" /> Leave group
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleJoin}
                style={{ backgroundColor: page.accent, color: "#1C1917" }}
              >
                <LogIn className="mr-1.5 h-4 w-4" /> Join group
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{group.description}</p>
            <p className="mt-4 text-sm text-slate-500">
              {members.length} members
              {isMember && (
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                  You are a member
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </section>
    </AgenciesPage>
  )
}
