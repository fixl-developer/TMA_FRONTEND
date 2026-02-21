"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { useTenant } from "@/shared/context/TenantContext"
import { useAuth } from "@/shared/context/AuthContext"
import { getTenantRoles } from "@/shared/services/roleService"
import { useToast } from "@/shared/components/ui/toast"
import { inviteUsersBulk, type BulkInviteRow } from "@/shared/services/invitationService"
import { getTenantUsers } from "@/shared/services/adminService"
import { getInvitationsByTenant } from "@/shared/services/invitationService"
import { Plus, Trash2, Users } from "lucide-react"

export interface BulkInviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parsePastedText(text: string, defaultRoleId: string): BulkInviteRow[] {
  const rows: BulkInviteRow[] = []
  const lines = text
    .split(/[\n,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const seen = new Set<string>()
  for (const line of lines) {
    const parts = line.split(/[\t,]/).map((p) => p.trim())
    const email = parts[0]?.toLowerCase()
    if (!email || !EMAIL_REGEX.test(email) || seen.has(email)) continue
    seen.add(email)
    const roleId = parts[1] || defaultRoleId
    rows.push({ email, roleId })
  }
  return rows
}

export function BulkInviteModal({ open, onOpenChange, onSuccess }: BulkInviteModalProps) {
  const { tenantId } = useTenant()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [pasteText, setPasteText] = React.useState("")
  const [defaultRoleId, setDefaultRoleId] = React.useState("")
  const [manualRows, setManualRows] = React.useState<BulkInviteRow[]>([
    { email: "", roleId: "" },
  ])
  const [loading, setLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"paste" | "manual">("paste")

  const roles = React.useMemo(() => {
    const id = tenantId || "tenant_001"
    return getTenantRoles(id)
  }, [tenantId])

  React.useEffect(() => {
    if (roles.length && !defaultRoleId) setDefaultRoleId(roles[0]?._id || "")
  }, [roles, defaultRoleId])

  const getParsedRows = (): BulkInviteRow[] => {
    if (activeTab === "paste") {
      return parsePastedText(pasteText, defaultRoleId || roles[0]?._id || "")
    }
    return manualRows.filter((r) => r.email?.trim() && EMAIL_REGEX.test(r.email.trim()))
  }

  const parsedRows = getParsedRows()

  const addManualRow = () => {
    setManualRows((prev) => [...prev, { email: "", roleId: defaultRoleId || roles[0]?._id || "" }])
  }

  const updateManualRow = (idx: number, field: "email" | "roleId", value: string) => {
    setManualRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    )
  }

  const removeManualRow = (idx: number) => {
    setManualRows((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const rows = getParsedRows()
    if (!rows.length || !tenantId) {
      showToast("Add at least one valid email.", "error")
      return
    }

    setLoading(true)
    try {
      const existingUserEmails: string[] = []
      const [users, invitations] = await Promise.all([
        getTenantUsers(tenantId),
        getInvitationsByTenant(tenantId),
      ])
      users.forEach((u: any) => u.email && existingUserEmails.push(u.email))
      invitations.forEach((i: any) => i.email && existingUserEmails.push(i.email))

      const result = await inviteUsersBulk(
        tenantId,
        rows.map((r) => ({ ...r, roleId: r.roleId || defaultRoleId || roles[0]?._id })),
        user?.email,
        existingUserEmails
      )

      if (result.success > 0) {
        showToast(
          `Sent ${result.success} invitation(s).${result.failed ? ` ${result.failed} skipped (duplicate or invalid).` : ""}`,
          "success"
        )
        setPasteText("")
        setManualRows([{ email: "", roleId: defaultRoleId || roles[0]?._id || "" }])
        onOpenChange(false)
        onSuccess?.()
      } else if (result.failed > 0) {
        showToast(
          result.errors[0]?.reason || "All emails were skipped (duplicate or invalid).",
          "error"
        )
      }
    } catch {
      showToast("Failed to send invitations.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk invite users
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 border-b border-white/10 pb-2">
            <Button
              type="button"
              variant={activeTab === "paste" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("paste")}
            >
              Paste emails
            </Button>
            <Button
              type="button"
              variant={activeTab === "manual" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("manual")}
            >
              Add rows
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Default role</Label>
            <Select value={defaultRoleId} onValueChange={setDefaultRoleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r._id} value={r._id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeTab === "paste" && (
            <div className="space-y-2">
              <Label htmlFor="bulk-paste">
                Paste emails (one per line, or comma-separated)
              </Label>
              <textarea
                id="bulk-paste"
                className="min-h-[120px] w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                placeholder={"alice@agency.com\nbob@agency.com\ncharlie@agency.com"}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
              />
            </div>
          )}

          {activeTab === "manual" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Invitees</Label>
                <Button type="button" variant="outline" size="sm" onClick={addManualRow}>
                  <Plus className="mr-1 h-3 w-3" />
                  Add row
                </Button>
              </div>
              <div className="max-h-[180px] space-y-2 overflow-y-auto">
                {manualRows.map((row, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="email@agency.com"
                      value={row.email}
                      onChange={(e) => updateManualRow(idx, "email", e.target.value)}
                      className="flex-1"
                    />
                    <Select
                      value={row.roleId || defaultRoleId}
                      onValueChange={(v) => updateManualRow(idx, "roleId", v)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r._id} value={r._id}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeManualRow(idx)}
                      disabled={manualRows.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {parsedRows.length > 0 && (
            <p className="text-sm text-white/60">
              {parsedRows.length} valid email(s) ready to invite
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || parsedRows.length === 0}>
              {loading ? "Sending…" : `Send ${parsedRows.length} invite(s)`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
