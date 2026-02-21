"use client"

import * as React from "react"
import { Tag, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/toast"
import { useColorMode } from "@/shared/context/ColorModeContext"

export interface TagsManagementProps {
  talentId: string
  currentTagIds: string[]
  availableTags: { _id: string; name: string }[]
  onAddTag: (tagId: string) => void
  onRemoveTag: (tagId: string) => void
}

export function TagsManagement({
  currentTagIds,
  availableTags,
  onAddTag,
  onRemoveTag,
}: TagsManagementProps) {
  const toast = useToast()
  const { mode } = useColorMode()
  const isDark = mode === "dark"
  const theme = {
    border: isDark ? "#262626" : "#E7E5E4",
  }
  const [selectedTagId, setSelectedTagId] = React.useState("")

  const currentTags = availableTags.filter((t) => currentTagIds.includes(t._id))
  const remainingTags = availableTags.filter((t) => !currentTagIds.includes(t._id))

  const handleAdd = () => {
    if (!selectedTagId) return
    onAddTag(selectedTagId)
    setSelectedTagId("")
    toast.showToast("Tag added", "success")
  }

  const handleRemove = (tagId: string) => {
    onRemoveTag(tagId)
    toast.showToast("Tag removed", "success")
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <Tag className="h-4 w-4 text-[#B8860B] shrink-0 mt-0.5" />
        {currentTags.map((t) => (
          <span
            key={t._id}
            className="inline-flex items-center gap-1 rounded-md bg-[#FEF3C7] px-2 py-0.5 text-xs text-[#9A7209]"
          >
            {t.name}
            <button
              type="button"
              onClick={() => handleRemove(t._id)}
              className="rounded p-0.5 hover:bg-amber-200/80"
              aria-label={`Remove ${t.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      {remainingTags.length > 0 && (
        <div className="flex items-center gap-2">
          <Select value={selectedTagId} onValueChange={setSelectedTagId}>
            <SelectTrigger className="w-[160px] border h-8" style={{ borderColor: theme.border }}>
              <SelectValue placeholder="Add tag" />
            </SelectTrigger>
            <SelectContent>
              {remainingTags.map((t) => (
                <SelectItem key={t._id} value={t._id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="border h-8" style={{ borderColor: theme.border }} onClick={handleAdd} disabled={!selectedTagId}>
            Add
          </Button>
        </div>
      )}
    </div>
  )
}
