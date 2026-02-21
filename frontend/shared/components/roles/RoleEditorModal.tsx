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
import { seedRolePacks } from "@/data/seed"
import { useToast } from "@/shared/components/ui/toast"
import { createRole } from "@/shared/services/roleService"
import { CapabilityPicker } from "./CapabilityPicker"
import { ShieldPlus } from "lucide-react"

export interface RoleEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  templateId?: string | null
}

export function RoleEditorModal({
  open,
  onOpenChange,
  onSuccess,
  templateId,
}: RoleEditorModalProps) {
  const { tenantId } = useTenant()
  const { showToast } = useToast()
  const [name, setName] = React.useState("")
  const [capabilities, setCapabilities] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("")

  const rolePacks = seedRolePacks as any[]

  React.useEffect(() => {
    if (open) {
      setName("")
      setCapabilities([])
      setSelectedTemplate("")
      if (templateId) {
        const pack = rolePacks.find((rp) => rp._id === templateId)
        if (pack) {
          setSelectedTemplate(pack._id)
          setName(pack.name)
          setCapabilities(pack.capabilities || [])
        }
      }
    }
  }, [open, templateId, rolePacks])

  React.useEffect(() => {
    if (selectedTemplate) {
      const pack = rolePacks.find((rp) => rp._id === selectedTemplate)
      if (pack) {
        setName(pack.name)
        setCapabilities(pack.capabilities || [])
      }
    }
  }, [selectedTemplate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !tenantId) {
      showToast("Enter a role name.", "error")
      return
    }
    setLoading(true)
    try {
      await createRole(tenantId, name.trim(), capabilities, false)
      showToast(`Role "${name}" created.`, "success")
      onOpenChange(false)
      onSuccess?.()
    } catch {
      showToast("Failed to create role.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldPlus className="h-5 w-5" />
            Create custom role
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Start from template (optional)</Label>
            <Select
              value={selectedTemplate || "none"}
              onValueChange={(v) => setSelectedTemplate(v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Blank role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Blank role</SelectItem>
                {rolePacks.map((rp) => (
                  <SelectItem key={rp._id} value={rp._id}>
                    {rp.name} ({rp.capabilities?.length || 0} capabilities)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-name">Role name</Label>
            <Input
              id="role-name"
              placeholder="e.g. Project Coordinator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Capabilities</Label>
            <CapabilityPicker
              selected={capabilities}
              onChange={setCapabilities}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
