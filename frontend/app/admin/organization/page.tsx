"use client"

import { Building2, Globe2, Palette, MapPin, Phone, Mail } from "lucide-react"
import {
  AdminPageWrapper,
  AdminCard,
  AdminSectionHeader,
  AdminStatCard,
} from "@/shared/components/layout/AdminPageWrapper"

export default function AdminOrganizationPage() {
  return (
    <AdminPageWrapper>
      <AdminSectionHeader
        title="Organization"
        subtitle="Profile, branding, subdomain, and contact information"
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
          title="Subdomain"
          value="Configured"
          subtitle="demo.talentos.io"
          icon={Globe2}
          color="blue"
        />
        <AdminStatCard
          title="Branding"
          value="Custom"
          subtitle="Theme applied"
          icon={Palette}
          color="purple"
        />
        <AdminStatCard
          title="Verified"
          value="Yes"
          subtitle="Email verified"
          icon={Mail}
          color="green"
        />
      </div>

      {/* Profile */}
      <AdminCard className="mb-6">
        <h3 className="mb-6 text-lg font-bold text-white">Organization Profile</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Building2 className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Organization Name</p>
              <p className="mt-1 text-white">Demo Pageant Org</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Globe2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Subdomain</p>
              <p className="mt-1 text-white">demo.talentos.io</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="rounded-lg bg-green-500/10 p-2">
              <Mail className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Contact Email</p>
              <p className="mt-1 text-white">contact@demo.talentos.io</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="rounded-lg bg-yellow-500/10 p-2">
              <Phone className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Phone</p>
              <p className="mt-1 text-white">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:col-span-2">
            <div className="rounded-lg bg-pink-500/10 p-2">
              <MapPin className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Address</p>
              <p className="mt-1 text-white">123 Business Street, Suite 100, City, State 12345</p>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Branding */}
      <AdminCard>
        <h3 className="mb-6 text-lg font-bold text-white">Branding</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Palette className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Primary Color</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg border border-white/20 bg-[#7C3AED] shadow-lg" />
                <span className="font-mono text-sm text-white">#7C3AED</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Palette className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Secondary Color</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg border border-white/20 bg-[#d4ff00] shadow-lg" />
                <span className="font-mono text-sm text-white">#d4ff00</span>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>
    </AdminPageWrapper>
  )
}
