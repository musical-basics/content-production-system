"use client"

import { Youtube, Clock, FileText, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Project, ProjectStatus, Deliverable } from "@/lib/types"
import { statusLabels } from "@/lib/types"

interface ProjectMetadataProps {
  project: Project
  onUpdate: (updates: Partial<Project>) => void
}

const platformIcons = {
  youtube: Youtube,
  tiktok: Clock,
  blog: FileText,
}

const platformLabels = {
  youtube: "YouTube",
  tiktok: "TikTok",
  blog: "Blog",
}

export function ProjectMetadata({ project, onUpdate }: ProjectMetadataProps) {
  const handleStatusChange = (status: ProjectStatus) => {
    onUpdate({ status })
  }

  const handleDescriptionChange = (description: string) => {
    onUpdate({ description })
  }

  const toggleDeliverable = (deliverableId: string) => {
    const updatedDeliverables = project.deliverables.map((d) =>
      d.id === deliverableId ? { ...d, completed: !d.completed } : d
    )
    onUpdate({ deliverables: updatedDeliverables })
  }

  const completedCount = project.deliverables.filter((d) => d.completed).length

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Title */}
        <div>
          <h2 className="text-xl font-semibold text-foreground leading-tight">
            {project.title}
          </h2>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <Select value={project.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <Textarea
            value={project.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="min-h-[120px] bg-input border-border resize-none"
            placeholder="Add a description..."
          />
        </div>

        {/* Deliverables */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Deliverables</label>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{project.deliverables.length} completed
            </span>
          </div>
          <div className="space-y-2">
            {project.deliverables.map((deliverable) => {
              const Icon = platformIcons[deliverable.platform]
              return (
                <button
                  key={deliverable.id}
                  onClick={() => toggleDeliverable(deliverable.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-input border border-border hover:border-muted-foreground/30 transition-colors text-left"
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      deliverable.completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {deliverable.completed && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate ${
                        deliverable.completed
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {deliverable.title}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {platformLabels[deliverable.platform]}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
