"use client"

import * as React from "react"
import { CAPABILITY_METADATA, getCapabilityName, getCapabilityDescription } from "@/shared/lib/constants/capabilities"
import { HelpCircle } from "lucide-react"

export interface CapabilityPickerProps {
  selected: string[]
  onChange: (selected: string[]) => void
  disabled?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  tenant: "Tenant",
  users: "Users",
  talents: "Talents",
  jobs: "Jobs",
  bookings: "Bookings",
  contracts: "Contracts",
  wallet: "Wallet",
  ledger: "Ledger",
  credits: "Credits",
  escrow: "Escrow",
  disputes: "Disputes",
  automations: "Automations",
  audit: "Audit",
  exports: "Exports",
  pageant: "Pageant",
  casting: "Casting",
  participants: "Participants",
}

function groupByCategory(): Record<string, string[]> {
  const groups: Record<string, string[]> = {}
  for (const [key, meta] of Object.entries(CAPABILITY_METADATA)) {
    const cat = meta.category || "other"
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(key)
  }
  const order = Object.keys(CATEGORY_LABELS)
  const sorted: Record<string, string[]> = {}
  for (const cat of order) {
    if (groups[cat]) sorted[cat] = groups[cat].sort()
  }
  const rest = Object.keys(groups).filter((c) => !order.includes(c))
  for (const cat of rest) sorted[cat] = groups[cat].sort()
  return sorted
}

export function CapabilityPicker({ selected, onChange, disabled }: CapabilityPickerProps) {
  const groups = React.useMemo(() => groupByCategory(), [])

  const toggle = (cap: string) => {
    if (disabled) return
    const next = selected.includes(cap)
      ? selected.filter((c) => c !== cap)
      : [...selected, cap]
    onChange(next)
  }

  const toggleAllInCategory = (caps: string[]) => {
    if (disabled) return
    const allSelected = caps.every((c) => selected.includes(c))
    if (allSelected) {
      onChange(selected.filter((c) => !caps.includes(c)))
    } else {
      const merged = new Set([...selected, ...caps])
      onChange(Array.from(merged))
    }
  }

  return (
    <div className="max-h-[320px] space-y-4 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-4">
      {Object.entries(groups).map(([category, caps]) => (
        <div key={category}>
          <button
            type="button"
            onClick={() => toggleAllInCategory(caps)}
            disabled={disabled}
            className="mb-2 flex w-full items-center justify-between text-left text-sm font-semibold text-white/90 hover:text-white"
          >
            {CATEGORY_LABELS[category] || category}
            <span className="text-xs text-white/50">
              {caps.filter((c) => selected.includes(c)).length}/{caps.length}
            </span>
          </button>
          <div className="flex flex-wrap gap-2">
            {caps.map((cap) => {
              const name = getCapabilityName(cap)
              const desc = getCapabilityDescription(cap)
              const checked = selected.includes(cap)
              return (
                <label
                  key={cap}
                  className={`
                    inline-flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-colors
                    ${checked
                      ? "border-purple-400/50 bg-purple-400/20 text-white"
                      : "border-white/15 bg-white/5 text-white/70 hover:border-white/25 hover:bg-white/10"
                    }
                    ${disabled ? "cursor-not-allowed opacity-60" : ""}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(cap)}
                    disabled={disabled}
                    className="sr-only"
                  />
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border border-current">
                    {checked && <span className="text-[10px]">✓</span>}
                  </span>
                  {name}
                  {desc && (
                    <span title={desc} className="text-white/40">
                      <HelpCircle className="h-3 w-3" />
                    </span>
                  )}
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
