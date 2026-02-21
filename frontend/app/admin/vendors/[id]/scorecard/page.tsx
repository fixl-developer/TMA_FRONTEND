"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getVendorById, getVendorScorecard } from "@/shared/services/vendorService"
import { Star, TrendingUp, CheckCircle2, AlertTriangle, Package } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= Math.round(value) ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`}
        />
      ))}
      <span className="ml-1 text-sm font-semibold text-white">{value.toFixed(1)}</span>
    </div>
  )
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="font-semibold text-white">{value.toFixed(1)}/5</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  )
}

function getGrade(score: number): { label: string; variant: "success" | "warning" | "danger" } {
  if (score >= 4.5) return { label: "Excellent", variant: "success" }
  if (score >= 3.5) return { label: "Good", variant: "success" }
  if (score >= 2.5) return { label: "Average", variant: "warning" }
  return { label: "Poor", variant: "danger" }
}

export default function VendorScorecardPage() {
  const { id } = useParams<{ id: string }>()
  const [vendor, setVendor] = useState<any | null>(null)
  const [scorecard, setScorecard] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getVendorById(id), getVendorScorecard(id)]).then(([v, s]) => {
      setVendor(v)
      setScorecard(s)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <AdminPageWrapper>
      <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />)}</div>
    </AdminPageWrapper>
  )

  if (!vendor) return (
    <AdminPageWrapper>
      <AdminCard><p className="text-center text-white/50">Vendor not found.</p></AdminCard>
    </AdminPageWrapper>
  )

  const grade = scorecard ? getGrade(scorecard.overall) : null

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={`${vendor.name} — Scorecard`}
        subtitle={`Performance metrics · ${scorecard?.period || "Latest quarter"}`}
        action={
          <div className="flex gap-2">
            <Link href={`/admin/vendors/${id}`}><AdminButton variant="ghost">← Vendor Profile</AdminButton></Link>
            <Link href="/admin/vendors"><AdminButton variant="secondary">All Vendors</AdminButton></Link>
          </div>
        }
      />

      {!scorecard ? (
        <AdminCard>
          <div className="py-12 text-center">
            <Star className="mx-auto mb-3 h-12 w-12 text-white/20" />
            <p className="text-white/50">No scorecard data available for this vendor yet.</p>
            <p className="mt-1 text-sm text-white/30">Scorecard data is generated after completed purchase orders.</p>
          </div>
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Overall score */}
          <AdminCard>
            <h3 className="mb-4 font-bold text-white">Overall Performance</h3>
            <div className="text-center">
              <p className="text-6xl font-bold text-white">{scorecard.overall.toFixed(1)}</p>
              <p className="mt-1 text-white/50">out of 5.0</p>
              <div className="mt-3 flex justify-center">
                <StarRating value={scorecard.overall} />
              </div>
              {grade && (
                <div className="mt-4">
                  <AdminBadge variant={grade.variant}>{grade.label}</AdminBadge>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Reviews</span>
                <span className="font-semibold text-white">{scorecard.reviewCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Period</span>
                <span className="text-white">{scorecard.period}</span>
              </div>
            </div>
          </AdminCard>

          {/* Detailed scores */}
          <AdminCard className="lg:col-span-2">
            <h3 className="mb-6 font-bold text-white">Score Breakdown</h3>
            <div className="space-y-5">
              <ScoreBar label="Quality" value={scorecard.quality} color="bg-blue-400" />
              <ScoreBar label="On-time Delivery" value={scorecard.delivery} color="bg-emerald-400" />
              <ScoreBar label="Communication" value={scorecard.communication} color="bg-purple-400" />
              {scorecard.pricing && <ScoreBar label="Pricing" value={scorecard.pricing} color="bg-yellow-400" />}
              {scorecard.compliance && <ScoreBar label="Compliance" value={scorecard.compliance} color="bg-teal-400" />}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{scorecard.delivery?.toFixed(0) * 10 || "N/A"}%</p>
                <p className="text-xs text-white/50">On-time delivery rate</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{scorecard.quality?.toFixed(0) * 10 || "N/A"}%</p>
                <p className="text-xs text-white/50">Quality acceptance rate</p>
              </div>
            </div>
          </AdminCard>
        </div>
      )}
    </AdminPageWrapper>
  )
}
