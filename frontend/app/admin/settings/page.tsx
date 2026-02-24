"use client"

import { useEffect, useState, useCallback } from "react"
import { getAdminSettings, updateAdminSettings } from "@/shared/services/adminSettingsService"
import { useTenant } from "@/shared/context/TenantContext"
import { Building2, Globe2, Palette, Bell, Shield, Database, Edit, Save, X } from "lucide-react"
import { CapabilityGate } from "@/shared/components/ui/CapabilityGate"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/toast"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
  AdminLoading,
} from "@/shared/components/admin/AdminPageLayout"

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

  const handleSaveOrg = async () => {
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
  }

  const handleSaveBrand = async () => {
    if (!tenantId) return
    setSaving(true)
    try {
      await updateAdminSettings(tenantId, { branding: { primaryColor: primaryColor.trim() } })
      showToast("Branding updated", "success")
      setEditing(null)
      load()
    } catch {
      showToast("Failed to update", "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Settings"
        subtitle="Configure tenant-wide settings and preferences"
      >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Organization" value="Active" icon={Building2} color="green" subtitle="Status" />
        <AdminStatCard label="Notifications" value="Enabled" icon={Bell} color="blue" subtitle="All channels" />
        <AdminStatCard label="Security" value="High" icon={Shield} color="purple" subtitle="Protection level" />
        <AdminStatCard label="Storage" value="2.4 GB" icon={Database} color="yellow" subtitle="of 50 GB used" />
      </AdminStatsGrid>

      {loading ? (
        <AdminCard>
          <AdminLoading rows={3} />
        </AdminCard>
      ) : settings ? (
        <>
          {/* Organization Settings */}
          <AdminCard
            title="Organization"
            className="mb-6"
            actions={
              <CapabilityGate capability="tenant.manage_settings">
                {editing === "org" ? (
                  <div className="flex gap-2">
                    <AdminButton size="sm" variant="secondary" onClick={() => setEditing(null)}>
                      <X className="h-4 w-4" />
                      Cancel
                    </AdminButton>
                    <AdminButton size="sm" disabled={saving} onClick={handleSaveOrg}>
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save"}
                    </AdminButton>
                  </div>
                ) : (
                  <AdminButton size="sm" variant="secondary" onClick={() => setEditing("org")}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </AdminButton>
                )}
              </CapabilityGate>
            }
          >
            {editing === "org" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orgName" className="text-xs font-semibold text-gray-600">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="subdomain" className="text-xs font-semibold text-gray-600">Subdomain</Label>
                  <Input
                    id="subdomain"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4">
                  <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Organization Name</p>
                    <p className="mt-1 text-sm text-gray-900">{settings.organization.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4">
                  <Globe2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Subdomain</p>
                    <p className="mt-1 text-sm text-gray-900">{settings.organization.subdomain}</p>
                  </div>
                </div>
              </div>
            )}
          </AdminCard>

          {/* Branding Settings */}
          <AdminCard
            title="Branding"
            actions={
              <CapabilityGate capability="tenant.manage_settings">
                {editing === "brand" ? (
                  <div className="flex gap-2">
                    <AdminButton size="sm" variant="secondary" onClick={() => setEditing(null)}>
                      <X className="h-4 w-4" />
                      Cancel
                    </AdminButton>
                    <AdminButton size="sm" disabled={saving} onClick={handleSaveBrand}>
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save"}
                    </AdminButton>
                  </div>
                ) : (
                  <AdminButton size="sm" variant="secondary" onClick={() => setEditing("brand")}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </AdminButton>
                )}
              </CapabilityGate>
            }
          >
            {editing === "brand" ? (
              <div>
                <Label htmlFor="primaryColor" className="text-xs font-semibold text-gray-600">Primary Color</Label>
                <div className="mt-2 flex items-center gap-3">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-20"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4">
                <Palette className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600">Primary Color</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-10 w-10 rounded border border-gray-200" style={{ backgroundColor: settings.branding.primaryColor }} />
                    <span className="font-mono text-xs text-gray-900">{settings.branding.primaryColor}</span>
                  </div>
                </div>
              </div>
            )}
          </AdminCard>
        </>
      ) : null}
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
