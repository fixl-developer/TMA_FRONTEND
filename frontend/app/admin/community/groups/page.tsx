"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCommunityGroups } from "@/shared/services/communityService"
import type { CommunityGroup } from "@/shared/services/communityService"
import { Users2, Lock, ArrowLeft } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

const DEMO_TENANT = "tenant_001"

export default function CommunityGroupsPage() {
  const [groups, setGroups] = useState<CommunityGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCommunityGroups(DEMO_TENANT)
      .then(setGroups)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Groups</h1>
            <p className="mt-2 text-base text-white/60">Community groups and members</p>
          </div>
          <Link href="/admin/community">
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Community
            </Button>
          </Link>
        </div>

        {/* Groups Grid */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h3 className="mb-6 text-lg font-bold text-white">All Groups</h3>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="py-12 text-center">
              <Users2 className="mx-auto mb-3 h-12 w-12 text-white/30" />
              <p className="text-white/60">No groups yet</p>
              <p className="mt-1 text-sm text-white/40">Create your first community group</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((g) => (
                <Link key={g._id} href={`/admin/community/groups/${g._id}`}>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-purple-500/10 p-2">
                        <Users2 className="h-5 w-5 text-purple-400" />
                      </div>
                      {g.isPrivate && <Lock className="h-4 w-4 text-white/40" />}
                    </div>
                    <h3 className="mt-3 font-medium text-white">{g.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/60">{g.description}</p>
                    <p className="mt-2 text-xs text-white/40">{g.memberCount} members</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
