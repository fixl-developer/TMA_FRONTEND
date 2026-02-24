"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  getShipmentById,
  getPackagesByShipment,
  getTrackingEventsByShipment,
  getShipmentTypeLabel,
  getCampaignById,
  getTalentById,
} from "@/shared/services/logisticsService"
import { Package, MapPin, Truck, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminButton,
  AdminBadge,
} from "@/shared/components/layout/AdminPageWrapper"

export default function ShipmentDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [shipment, setShipment] = useState<any>(null)
  const [packages, setPackages] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [campaign, setCampaign] = useState<any>(null)
  const [creator, setCreator] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getShipmentById(id).then(async (s) => {
      setShipment(s)
      const [pkg, evt, camp, talent] = await Promise.all([
        getPackagesByShipment(id),
        getTrackingEventsByShipment(id),
        s?.campaignId ? getCampaignById(s.campaignId) : null,
        s?.creatorId ? getTalentById(s.creatorId) : null,
      ])
      setPackages(pkg)
      setEvents(evt)
      setCampaign(camp)
      setCreator(talent)
      setLoading(false)
    })
  }, [id])

  if (loading || !shipment) {
    return (
      <AdminPageWrapper>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-white/60">Loading shipment…</p>
        </div>
      </AdminPageWrapper>
    )
  }

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title={shipment.trackingNumber}
        subtitle={`${getShipmentTypeLabel(shipment.type)} · ${shipment.carrier}`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/logistics/shipments">
              <AdminButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Shipments
              </AdminButton>
            </Link>
            <Link href="/admin/logistics/returns">
              <AdminButton variant="secondary" size="sm">Returns</AdminButton>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Shipment details</h2>
          </div>
          <div className="space-y-3">
            <AdminBadge variant={
              shipment.status === "DELIVERED" ? "success" :
              shipment.status === "IN_TRANSIT" ? "info" : "default"
            }>
              {shipment.status.replace("_", " ")}
            </AdminBadge>
            <p className="flex items-center gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4" />
              {shipment.origin} → {shipment.destination}
            </p>
            {shipment.notes && (
              <p className="text-sm text-white/70">{shipment.notes}</p>
            )}
            {shipment.deliveredAt && (
              <p className="text-sm text-emerald-400">
                Delivered: {format(new Date(shipment.deliveredAt), "MMM d, yyyy HH:mm")}
              </p>
            )}
            {campaign && (
              <p className="text-sm text-white/70">
                Campaign: {campaign.name}
              </p>
            )}
            {creator && (
              <p className="text-sm text-white/70">
                Creator: {creator.stageName}
              </p>
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Tracking timeline</h2>
          </div>
          {events.length === 0 ? (
            <p className="py-4 text-center text-white/60">No tracking events.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10" />
              <div className="space-y-4">
                {events.map((e) => (
                  <div key={e._id} className="relative flex gap-3 pl-6">
                    <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20 text-xs text-yellow-400">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">
                        {e.event.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-white/60">
                        {e.timestamp && format(new Date(e.timestamp), "MMM d, yyyy HH:mm")} · {e.location}
                      </p>
                      {e.description && (
                        <p className="text-xs text-white/50">{e.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AdminCard>
      </div>

      {packages.length > 0 && (
        <AdminCard>
          <h2 className="mb-4 text-lg font-semibold text-white">Packages / Items</h2>
          <div className="space-y-2">
            {packages.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p className="font-medium text-sm text-white">
                    {p.description}
                  </p>
                  <p className="text-xs text-white/60">
                    {p.sku} · Qty: {p.qty} · {p.weightGrams}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </AdminPageWrapper>
  )
}
