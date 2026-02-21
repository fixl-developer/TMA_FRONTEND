"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { ShieldCheck } from "lucide-react"

export interface StepUpMfaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionLabel: string
  onConfirm: (code: string) => void | Promise<void>
  loading?: boolean
}

/**
 * Step-up MFA modal for privileged actions.
 * Shown when user performs sensitive operations (delete user, suspend tenant, etc.).
 */
export function StepUpMfaModal({
  open,
  onOpenChange,
  actionLabel,
  onConfirm,
  loading = false,
}: StepUpMfaModalProps) {
  const [code, setCode] = React.useState("")

  const [submitting, setSubmitting] = React.useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 6) return
    setSubmitting(true)
    try {
      await onConfirm(code)
      setCode("")
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setCode("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            Verify your identity
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-600">
          This action requires additional verification. Enter the 6-digit code from your authenticator app.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stepup-mfa-code">Verification code</Label>
            <Input
              id="stepup-mfa-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="font-mono text-lg tracking-widest"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={code.length < 6 || loading || submitting}>
              {(loading || submitting) ? "Verifying…" : actionLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
