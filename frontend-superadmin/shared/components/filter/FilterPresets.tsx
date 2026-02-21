/**
 * Filter Presets Component
 * 
 * Allows users to save and load filter presets for quick access.
 * Supports URL-based filter state for shareable links.
 */

"use client"

import React, { useState, useEffect, useCallback, memo } from "react"
import { Save, Trash2, Bookmark } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"

export interface FilterPreset {
  id: string
  name: string
  filters: Record<string, any>
  createdAt: string
}

interface FilterPresetsProps {
  onLoadPreset: (preset: FilterPreset) => void
  onSavePreset?: (name: string, filters: Record<string, any>) => void
  currentFilters: Record<string, any>
  storageKey?: string
  className?: string
}

const STORAGE_KEY_PREFIX = "filter_presets_"

export const FilterPresets = memo(function FilterPresets({
  onLoadPreset,
  onSavePreset,
  currentFilters,
  storageKey = "default",
  className,
}: FilterPresetsProps) {
  const [presets, setPresets] = useState<FilterPreset[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [presetName, setPresetName] = useState("")

  const fullStorageKey = `${STORAGE_KEY_PREFIX}${storageKey}`

  // Load presets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(fullStorageKey)
    if (stored) {
      try {
        setPresets(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to load filter presets:", e)
      }
    }
  }, [fullStorageKey])

  const handleSave = useCallback(() => {
    if (!presetName.trim()) return

    const newPreset: FilterPreset = {
      id: `preset_${Date.now()}`,
      name: presetName.trim(),
      filters: { ...currentFilters },
      createdAt: new Date().toISOString(),
    }

    const updated = [newPreset, ...presets].slice(0, 10) // Max 10 presets
    setPresets(updated)
    localStorage.setItem(fullStorageKey, JSON.stringify(updated))
    setPresetName("")
    setShowSaveDialog(false)
    onSavePreset?.(presetName.trim(), currentFilters)
  }, [presetName, currentFilters, presets, fullStorageKey, onSavePreset])

  const handleDelete = useCallback(
    (presetId: string) => {
      const updated = presets.filter((p) => p.id !== presetId)
      setPresets(updated)
      localStorage.setItem(fullStorageKey, JSON.stringify(updated))
    },
    [presets, fullStorageKey]
  )

  const handleLoad = useCallback(
    (preset: FilterPreset) => {
      onLoadPreset(preset)
    },
    [onLoadPreset]
  )

  // Generate shareable URL
  const generateShareableUrl = useCallback(() => {
    const params = new URLSearchParams()
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          params.set(key, value.join(","))
        } else if (value instanceof Date) {
          params.set(key, value.toISOString())
        } else {
          params.set(key, String(value))
        }
      }
    })
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }, [currentFilters])

  const copyShareableUrl = useCallback(() => {
    const url = generateShareableUrl()
    navigator.clipboard.writeText(url)
    // In real app, show toast notification
    alert("Filter URL copied to clipboard!")
  }, [generateShareableUrl])

  return (
    <div className={cn("space-y-3", className)}>
      {/* Save Preset Dialog */}
      {showSaveDialog && (
        <Card className="bg-slate-950/95 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Save Filter Preset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") setShowSaveDialog(false)
              }}
              className="bg-slate-900/70 border-slate-800"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!presetName.trim()}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowSaveDialog(false)
                  setPresetName("")
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Presets List */}
      {presets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Saved Presets
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSaveDialog(true)}
              className="h-6 px-2 text-[10px]"
            >
              <Save className="h-3 w-3 mr-1" />
              Save Current
            </Button>
          </div>
          <div className="space-y-1">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-2 rounded-md bg-slate-900/50 border border-slate-800 hover:bg-slate-900/70 transition-colors"
              >
                <button
                  onClick={() => handleLoad(preset)}
                  className="flex-1 flex items-center gap-2 text-left"
                >
                  <Bookmark className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-xs text-slate-300">{preset.name}</span>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(preset.id)}
                  className="h-6 w-6 text-slate-400 hover:text-red-400"
                  aria-label={`Delete preset ${preset.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button (when no presets) */}
      {presets.length === 0 && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowSaveDialog(true)}
          className="w-full h-8 text-[10px] bg-slate-900/50 border-slate-800"
        >
          <Save className="h-3 w-3 mr-2" />
          Save Filter Preset
        </Button>
      )}

      {/* Shareable URL */}
      <div className="pt-2 border-t border-slate-800">
        <Button
          size="sm"
          variant="outline"
          onClick={copyShareableUrl}
          className="w-full h-8 text-[10px] bg-slate-900/50 border-slate-800"
        >
          Copy Filter URL
        </Button>
        <p className="text-[9px] text-slate-500 mt-1 text-center">
          Share this filter configuration
        </p>
      </div>
    </div>
  )
})

FilterPresets.displayName = "FilterPresets"
