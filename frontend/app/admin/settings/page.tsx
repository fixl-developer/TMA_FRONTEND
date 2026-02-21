"use client"

import { useEffect, useState, useCallback } from "react"
import { getAdminSettings, updateAdminSettings } from "@/shared/services/adminSettingsService"
import { useTenant } from "@/shared/context/TenantContext"
import { Building2, Globe2, Palette, Bell, Shield, Database } from "lucide-react"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminButton,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdminSettingsPage() {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [settings, setSettings] = useState<Awaited<ReturnType<typeof getAdminSettings>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<"org" | "brand" | null>(null)
  const [orgName, setOrgName] = useState("")
  const [subdomain, setSubdomain] = useState("")
  const [primaryColor, setPrimaryColor] = useState("")
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => getAdminSettings(tenantId).then((s) => { setSettings(s); setLoading(false) }), [tenantId])

  useEffect(() => {
    load()
  }, [tenantId])

  useEffect(() => {
    if (settings) {
      setOrgName(settings.organization.name)
      setSubdomain(settings.organization.subdomain)
      setPrimaryColor(settings.branding.primaryColor)
    }
  }, [settings])

  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Tenant Settings"
        subtitle="Configure tenant-wide settings and preferences"
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          title="Organization"
          value="Active"
          subtitle="Status"
          icon={Building2}
          color="green"
        />
        <AdminStatCard
          title="Notifications"
          value="Enabled"
          subtitle="All channels"
          icon={Bell}
          color="blue"
        />
        <AdminStatCard
          title="Security"
          value="High"
          subtitle="Protection level"
          icon={Shield}
          color="purple"
        />
        <AdminStatCard
          title="Storage"
          value="2.4 GB"
          subtitle="of 50 GB used"
          icon={Database}
          color="yellow"
        />
      </div>

      {loading ? (
        <AdminCard>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        </AdminCard>
      ) : settings ? (
        <>
          {/* Organization Settings */}
          <AdminCard className="mb-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Organization</h3>
              <CapabilityGate capability="tenant.manage_settings">
                {editing === "org" ? (
                  <div className="flex gap-2">
                    <AdminButton size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
                    <AdminButton
                      size="sm"
                      disabled={saving}
                      onClick={async () => {
                        if (!tenantId) return
                        setSaving(true)
                        try {
                          await updateAdminSettings(tenantId, { organization: { name: orgName.trim(), subdomain: subdomain.trim() } })
                          showToast("Organization updated", "success")
                          setEditing(null)
                          load()
                        } catch {
                          showToast("Failed to update", "error")
                        } finally {
                          setSaving(false)
                        }
                      }}
                    >
                      {saving ? "Saving…" : "Save"}
                    </AdminButton>
                  </div>
                ) : (
                  <AdminButton size="sm" variant="secondary" onClick={() => setEditing("org")}>Edit</AdminButton>
                )}
              </CapabilityGate>
            </div>
            {editing === "org" ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-white/70">Organization name</Label>
                  <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="mt-1 border-white/20 bg-white/5 text-white" />
                </div>
                <div>
                  <Label className="text-white/70">Subdomain</Label>
                  <Input value={subdomain} onChange={(e) => setSubdomain(e.target.value)} className="mt-1 border-white/20 bg-white/5 text-white" placeholder="your-org.talentos.io" />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="rounded-lg bg-purple-500/10 p-2">
                    <Building2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-white/50">Organization</p>
                    <p className="mt-1 text-white">{settings.organization.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <Globe2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-white/50">Subdomain</p>
                    <p className="mt-1 text-white">{settings.organization.subdomain}</p>
                  </div>
                </div>
              </div>
            )}
          </AdminCard>

          {/* Branding Settings */}
          <AdminCard>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Branding</h3>
              <CapabilityGate capability="tenant.manage_settings">
                {editing === "brand" ? (
                  <div className="flex gap-2">
                    <AdminButton size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
                    <AdminButton
                      size="sm"
                      disabled={saving}
                      onClick={async () => {
                        if (!tenantId) return
                        setSaving(true)
                        try {
                          await updateAdminSettings(tenantId, { branding: { primaryColor: primaryColor.trim() || "#7C3AED" } })
                          showToast("Branding updated", "success")
                          setEditing(null)
                          load()
                        } catch {
                          showToast("Failed to update", "error")
                        } finally {
                          setSaving(false)
                        }
                      }}
                    >
                      {saving ? "Saving…" : "Save"}
                    </AdminButton>
                  </div>
                ) : (
                  <AdminButton size="sm" variant="secondary" onClick={() => setEditing("brand")}>Edit</AdminButton>
                )}
              </CapabilityGate>
            </div>
            {editing === "brand" ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-white/70">Primary color</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-white/20 bg-transparent"
                    />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 border-white/20 bg-white/5 font-mono text-white" placeholder="#7C3AED" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Palette className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">Primary Color</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg border border-white/20 shadow-lg"
                      style={{ backgroundColor: settings.branding.primaryColor }}
                    />
                    <span className="font-mono text-sm text-white">{settings.branding.primaryColor}</span>
                  </div>
                </div>
              </div>
            )}
          </AdminCard>
        </>
      ) : (
        <AdminCard>
          <p className="py-8 text-center text-white/50">No settings found.</p>
        </AdminCard>
      )}
    </AdminPageWrapper>
  )
}
