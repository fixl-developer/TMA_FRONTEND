"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/shared/lib/utils"
import { Button } from "./button"
import { FolderKanban, Megaphone, FileText, Users, FolderOpen } from "lucide-react"

export type EmptyEntityType = "project" | "casting" | "contract" | "talent" | "vendor" | "generic"

const ENTITY_CONFIG: Record<
  EmptyEntityType,
  { title: string; description: string; ctaLabel: string; ctaHref: string; icon: React.ElementType; illustration: string }
> = {
  project: {
    title: "Create your first project",
    description: "Organize work with tasks, checklists, and run-of-show for events and productions.",
    ctaLabel: "Create project",
    ctaHref: "/admin/projects",
    icon: FolderKanban,
    illustration: "📁",
  },
  casting: {
    title: "Create your first casting",
    description: "Open a casting call for your next production. Talent can submit and you can shortlist.",
    ctaLabel: "New casting",
    ctaHref: "/admin/casting",
    icon: Megaphone,
    illustration: "🎬",
  },
  contract: {
    title: "Create your first contract",
    description: "Create contracts from templates and send for e-signature.",
    ctaLabel: "New contract",
    ctaHref: "/admin/contracts/create",
    icon: FileText,
    illustration: "📄",
  },
  talent: {
    title: "Add your first talent",
    description: "Build your roster with talent profiles, portfolios, and availability.",
    ctaLabel: "Add talent",
    ctaHref: "/admin/talent",
    icon: Users,
    illustration: "👤",
  },
  vendor: {
    title: "Add your first vendor",
    description: "Onboard vendors for procurement, RFQs, and purchase orders.",
    ctaLabel: "Add vendor",
    ctaHref: "/admin/vendors",
    icon: FolderOpen,
    illustration: "🏢",
  },
  generic: {
    title: "No items yet",
    description: "Get started by creating your first item.",
    ctaLabel: "Create",
    ctaHref: "#",
    icon: FolderOpen,
    illustration: "✨",
  },
}

export interface EmptyStateCTAProps {
  entity: EmptyEntityType
  className?: string
  customTitle?: string
  customDescription?: string
  customCtaLabel?: string
  customCtaHref?: string
}

export function EmptyStateCTA({
  entity,
  className,
  customTitle,
  customDescription,
  customCtaLabel,
  customCtaHref,
}: EmptyStateCTAProps) {
  const config = ENTITY_CONFIG[entity]
  const Icon = config.icon
  const title = customTitle ?? config.title
  const description = customDescription ?? config.description
  const ctaLabel = customCtaLabel ?? config.ctaLabel
  const ctaHref = customCtaHref ?? config.ctaHref

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-200 px-8 py-12 text-center bg-amber-50/30",
        className
      )}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100/80 text-4xl">
        {config.illustration}
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      <Button asChild className="mt-6 bg-amber-600 hover:bg-amber-500 text-white" size="lg">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  )
}
