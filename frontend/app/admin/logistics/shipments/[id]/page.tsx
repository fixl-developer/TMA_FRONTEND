"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/shared/components/ui/PageBanner"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  getShipmentById,
  getPackagesByShipment,
  getTrackingEventsByShipment,
  getShipmentStatusColor,
  getShipmentTypeLabel,
  getCampaignById,
  getTalentById,
} from "@/shared/services/logisticsService"
import { Package, MapPin, Truck, ChevronRight } from "lucide-react"
import { AgenciesPage } from "@/shared/components/layout/AgenciesPage"
import { useDashboardTheme } from "@/shared/context/DashboardThemeContext"
import { format } from "date-fns"

export default function ShipmentDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { page } = useDashboardTheme()
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
      <AgenciesPage>
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-slate-500">Loading shipment…</p>
        </div>
      </AgenciesPage>
    )
  }

  return (
    <AgenciesPage>
      <PageBanner
        title={shipment.trackingNumber}
        subtitle={`${getShipmentTypeLabel(shipment.type)} · ${shipment.carrier}`}
        variant="admin"
        backgroundImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/logistics/shipments">
          <Button variant="ghost" size="sm">
            ← Shipments
          </Button>
        </Link>
        <Link href="/admin/logistics/returns">
          <Button variant="outline" size="sm">
            Returns
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipment details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-xs ${getShipmentStatusColor(shipment.status)}`}
              >
                {shipment.status.replace("_", " ")}
              </span>
            </div>
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4" />
              {shipment.origin} → {shipment.destination}
            </p>
            {shipment.notes && (
              <p className="text-sm text-slate-600">{shipment.notes}</p>
            )}
            {shipment.deliveredAt && (
              <p className="text-sm text-emerald-600">
                Delivered: {format(new Date(shipment.deliveredAt), "MMM d, yyyy HH:mm")}
              </p>
            )}
            {campaign && (
              <p className="text-sm text-slate-600">
                Campaign: {campaign.name}
              </p>
            )}
            {creator && (
              <p className="text-sm text-slate-600">
                Creator: {creator.stageName}
              </p>
            )}
          </CardContent>
        </Card>

        <Card style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Tracking timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="py-4 text-center text-slate-500">No tracking events.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200" />
                <div className="space-y-4">
                  {events.map((e) => (
                    <div key={e._id} className="relative flex gap-3 pl-6">
                      <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs">
                        ✓
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: page.text }}>
                          {e.event.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-slate-500">
                          {e.timestamp && format(new Date(e.timestamp), "MMM d, yyyy HH:mm")} · {e.location}
                        </p>
                        {e.description && (
                          <p className="text-xs text-slate-400">{e.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {packages.length > 0 && (
        <Card className="mt-6" style={{ borderColor: page.border }}>
          <CardHeader>
            <CardTitle>Packages / Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {packages.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between rounded border p-3"
                  style={{ borderColor: page.border }}
                >
                  <div>
                    <p className="font-medium text-sm" style={{ color: page.text }}>
                      {p.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      {p.sku} · Qty: {p.qty} · {p.weightGrams}g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </AgenciesPage>
  )
}
