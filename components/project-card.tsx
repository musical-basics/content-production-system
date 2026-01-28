"use client"

import Image from "next/image"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/types"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: Project
  // Remove direct onClick from props since we are handling navigation internal to the card now
  // Or keep it for external control, but we want to navigate.
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/projects/${project.id}`)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No Date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const dueDateObj = project.due_date ? new Date(project.due_date) : null
  const isOverdue = dueDateObj ? dueDateObj < new Date() : false
  const isUrgent = dueDateObj ? !isOverdue && dueDateObj <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : false

  return (
    <button
      onClick={handleCardClick}
      className="w-full bg-card rounded-lg overflow-hidden border border-border hover:border-muted-foreground/30 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 text-left group"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src="/placeholder.svg"
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-card-foreground text-sm line-clamp-2 leading-tight">
          {project.title}
        </h3>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <Badge
            variant="secondary"
            className={
              isOverdue
                ? "bg-destructive/20 text-destructive border-0 text-xs"
                : isUrgent
                  ? "bg-amber-500/20 text-amber-400 border-0 text-xs"
                  : "bg-secondary text-secondary-foreground border-0 text-xs"
            }
          >
            {formatDate(project.due_date)}
          </Badge>
        </div>
      </div>
    </button>
  )
}
