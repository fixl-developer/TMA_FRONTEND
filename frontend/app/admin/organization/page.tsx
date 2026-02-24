"use client"

import { Building2, Globe2, Palette, MapPin, Phone, Mail, Edit } from "lucide-react"
import { AdminPageWrapper } from "@/shared/components/layout/AdminPageWrapper"
import {
  AdminPageLayout,
  AdminStatsGrid,
  AdminStatCard,
  AdminCard,
  AdminButton,
} from "@/shared/components/admin/AdminPageLayout"

export default function AdminOrganizationPage() {
  return (
    <AdminPageWrapper>
      <AdminPageLayout
        title="Organization"
        subtitle="Manage your organization profile, branding, and contact information"
        actions={
        <AdminButton>
          <Edit className="h-4 w-4" />
          Edit Profile
        </AdminButton>
      }
    >
      {/* Stats */}
      <AdminStatsGrid columns={4}>
        <AdminStatCard label="Status" value="Active" icon={Building2} color="green" />
        <AdminStatCard label="Subdomain" value="Configured" icon={Globe2} color="blue" subtitle="demo.talentos.io" />
        <AdminStatCard label="Branding" value="Custom" icon={Palette} color="purple" subtitle="Theme applied" />
        <AdminStatCard label="Verified" value="Yes" icon={Mail} color="green" subtitle="Email verified" />
      </AdminStatsGrid>

      {/* Profile */}
      <AdminCard title="Organization Profile" className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4">
            <Building2 className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-600">Organization Name</p>
              <p className="mt-1 text-sm text-gray-900">Demo Pageant Org</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4">
            <Globe2 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-600">Subdomain</p>
              <p className="mt-1 text-sm text-gray-900">demo.talentos.io</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4">
            <Mail className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-600">Contact Email</p>
              <p className="mt-1 text-sm text-gray-900">contact@demo.talentos.io</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4">
            <Phone className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-600">Phone</p>
              <p className="mt-1 text-sm text-gray-900">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
            <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-600">Address</p>
              <p className="mt-1 text-sm text-gray-900">123 Business Street, Suite 100, City, State 12345</p>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Branding */}
      <AdminCard title="Branding">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4">
            <Palette className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600">Primary Color</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-10 w-10 rounded border border-gray-200 bg-[#7C3AED]" />
                <span className="font-mono text-xs text-gray-900">#7C3AED</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4">
            <Palette className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600">Secondary Color</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-10 w-10 rounded border border-gray-200 bg-[#d4ff00]" />
                <span className="font-mono text-xs text-gray-900">#d4ff00</span>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>
      </AdminPageLayout>
    </AdminPageWrapper>
  )
}
