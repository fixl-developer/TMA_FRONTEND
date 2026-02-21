"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Upload, FileImage, FileVideo } from "lucide-react"

export default function ContentUploadPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"IMAGE" | "VIDEO">("IMAGE")
  const [dragging, setDragging] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setUploaded(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUploaded(true)
    setTimeout(() => router.push("/admin/content/pending"), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#3d1f47] to-[#6b2d5c] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">← Back</Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Upload content</h1>
            <p className="mt-2 text-base text-white/60">Images, videos, metadata.</p>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Media Upload */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-bold text-white">Media</h3>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`flex min-h-[240px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                  dragging ? "border-amber-400 bg-amber-500/10" : "border-white/20 bg-white/5"
                }`}
              >
                {uploaded ? (
                  <p className="text-emerald-400">File ready</p>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-white/50" />
                    <p className="mt-2 text-sm text-white/60">Drag & drop or click to upload</p>
                    <p className="text-xs text-white/40">Image or video</p>
                  </>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-bold text-white">Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Content title"
                    className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 backdrop-blur-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60">Type</label>
                  <div className="mt-2 flex gap-4">
                    <label className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${type === "IMAGE" ? "border-amber-400 bg-amber-500/10" : "border-white/20 bg-white/5"}`}>
                      <input type="radio" name="type" value="IMAGE" checked={type === "IMAGE"} onChange={() => setType("IMAGE")} className="text-amber-400" />
                      <FileImage className="h-5 w-5 text-amber-400" />
                      <span className="text-white">Image</span>
                    </label>
                    <label className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${type === "VIDEO" ? "border-amber-400 bg-amber-500/10" : "border-white/20 bg-white/5"}`}>
                      <input type="radio" name="type" value="VIDEO" checked={type === "VIDEO"} onChange={() => setType("VIDEO")} className="text-amber-400" />
                      <FileVideo className="h-5 w-5 text-amber-400" />
                      <span className="text-white">Video</span>
                    </label>
                  </div>
                </div>
              </div>
              <Button type="submit" className="mt-6 w-full bg-[#d4ff00] text-black hover:bg-[#b8e600]">
                Upload
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
