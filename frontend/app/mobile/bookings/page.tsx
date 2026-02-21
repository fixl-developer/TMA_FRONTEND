"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarCheck, ChevronLeft, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { getBookings } from "@/shared/services/bookingService"
import { useTenant } from "@/shared/context/TenantContext"

type BookingStage = "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string

const STAGE_COLOR: Record<string, string> = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
}

export default function MobileBookingsPage() {
  const { tenantId } = useTenant()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming")

  useEffect(() => {
    getBookings(tenantId || "tenant_001").then((list: any[]) => {
      setBookings(list)
      setLoading(false)
    })
  }, [tenantId])

  const today = new Date().toISOString().split("T")[0]
  const upcoming = bookings.filter((b) => b.stage !== "COMPLETED" && b.stage !== "CANCELLED" && (b.dates?.start || "") >= today)
  const past = bookings.filter((b) => b.stage === "COMPLETED" || (b.dates?.start || "") < today)
  const displayed = filter === "upcoming" ? upcoming : past

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <Link href="/mobile">
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
        </Link>
        <h1 className="text-lg font-bold text-slate-800">My Bookings</h1>
      </div>

      <div className="px-4 pt-4">
        {/* Filter tabs */}
        <div className="mb-4 flex rounded-xl bg-slate-100 p-1">
          {[
            { id: "upcoming", label: `Upcoming (${upcoming.length})` },
            { id: "past", label: `Past (${past.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                filter === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200" />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <CalendarCheck className="h-12 w-12 text-slate-300" />
            <p className="mt-3 text-slate-500">No {filter} bookings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((b) => (
              <div key={b._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{b.projectName || b.title || "Booking"}</p>
                    <p className="text-sm text-slate-500">{b.clientName || "Client"}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STAGE_COLOR[b.stage] || "bg-slate-100 text-slate-600"}`}>
                    {b.stage}
                  </span>
                </div>
                {b.dates?.start && (
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.dates.start}</span>
                    {b.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.location}</span>}
                  </div>
                )}
                {b.feeMinor && (
                  <div className="mt-2 text-sm font-semibold text-slate-800">
                    ₹{(b.feeMinor / 100).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
